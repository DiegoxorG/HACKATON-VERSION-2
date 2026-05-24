from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import anthropic
import os
import threading
import time
from dotenv import load_dotenv

# Carga variables de entorno locales (desarrollo) y de plataforma (deploy).
load_dotenv()

app = FastAPI(title="FinConfia API")

# Origenes permitidos por defecto para entorno local.
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# En producción se pueden agregar dominios por variable CORS_ORIGINS
# separando por comas.
extra_origins = os.getenv("CORS_ORIGINS", "").strip()
if extra_origins:
    allowed_origins.extend([o.strip() for o in extra_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cliente oficial de Anthropic inicializado con API key de entorno.
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
APP_API_TOKEN = os.getenv("APP_API_TOKEN", "dev-token-change-me")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")

# Rate limit en memoria (simple, por IP).
_RATE_LIMIT_BUCKETS = {}
_RATE_LIMIT_LOCK = threading.Lock()

class Message(BaseModel):
    role: str
    content: str

class ClaudeRequest(BaseModel):
    systemPrompt: Optional[str] = "Eres FinConfia, un asistente financiero."
    userMessage: str
    history: Optional[List[Message]] = []

class ScoreRequest(BaseModel):
    age: int = Field(ge=0, default=18)
    income: int = Field(ge=0, default=0)
    fixedExpenses: int = Field(ge=0, default=0)
    variableExpenses: int = Field(ge=0, default=0)
    credits: int = Field(ge=0, default=0)

class HabitsRequest(BaseModel):
    income: float = Field(ge=0, default=0)
    fixedExpenses: float = Field(ge=0, default=0)
    variableExpenses: float = Field(ge=0, default=0)
    monthlyExpenses: float = Field(ge=0, default=0)
    credits: int = Field(ge=0, default=0)
    savings: Optional[float] = None
    age: int = Field(ge=0, default=0)
    city: Optional[str] = ""
    occupation: Optional[str] = ""

class AdminLoginRequest(BaseModel):
    email: str
    password: str


def _require_app_token(req: Request):
    header_token = req.headers.get("x-app-token", "")
    if not header_token or header_token != APP_API_TOKEN:
        raise HTTPException(status_code=401, detail="Token de aplicacion invalido")


def _enforce_rate_limit(req: Request, route_name: str, max_requests=30, window_seconds=60):
    # Clave por ruta + IP para limitar abuso básico.
    ip = req.client.host if req.client else "unknown"
    key = f"{route_name}:{ip}"
    now = time.time()
    with _RATE_LIMIT_LOCK:
        history = _RATE_LIMIT_BUCKETS.get(key, [])
        history = [ts for ts in history if now - ts < window_seconds]
        if len(history) >= max_requests:
            raise HTTPException(status_code=429, detail="Demasiadas solicitudes")
        history.append(now)
        _RATE_LIMIT_BUCKETS[key] = history


def analyze_habits(payload: HabitsRequest):
    # Heurística liviana para perfilar hábitos con datos mínimos del usuario.
    # Está pensada para ser explicable y usable en prompts IA.
    income = float(payload.income or 0)
    fixed_exp = float(payload.fixedExpenses or 0)
    variable_exp = float(payload.variableExpenses or 0)
    monthly_exp = float(payload.monthlyExpenses or 0)
    credits = int(payload.credits or 0)

    base_expenses = monthly_exp if monthly_exp > 0 else (fixed_exp + variable_exp)
    if base_expenses <= 0:
        base_expenses = fixed_exp + variable_exp

    savings = float(payload.savings) if payload.savings is not None else (income - base_expenses)
    savings_rate = (savings / income) if income > 0 else 0
    debt_pressure = ((fixed_exp + credits * 180000) / income) if income > 0 else 1
    expense_ratio = (base_expenses / income) if income > 0 else 1

    healthy_signals = 0
    healthy_signals += 1 if savings > 0 else 0
    healthy_signals += 1 if savings_rate >= 0.1 else 0
    healthy_signals += 1 if expense_ratio <= 0.75 else 0
    healthy_signals += 1 if debt_pressure <= 0.4 else 0
    healthy_signals += 1 if credits <= 2 else 0

    if healthy_signals >= 4:
        financial_profile = "Habitos financieros saludables"
    elif healthy_signals >= 2:
        financial_profile = "Habitos financieros mixtos"
    else:
        financial_profile = "Habitos financieros por fortalecer"

    spending_profile = "Gasto moderado"
    if income > 0:
        if expense_ratio >= 0.9:
            spending_profile = "Gasto muy activo"
        elif expense_ratio >= 0.75:
            spending_profile = "Gasto activo"
        elif expense_ratio <= 0.45:
            spending_profile = "Gasto bajo"

    conclusions = []
    if savings > 0:
        conclusions.append("Presenta capacidad de ahorro positiva.")
    else:
        conclusions.append("No esta logrando ahorro mensual; hay presion de caja.")

    if expense_ratio >= 0.85:
        conclusions.append("El gasto mensual consume gran parte del ingreso.")
    elif expense_ratio <= 0.6:
        conclusions.append("Mantiene control razonable del gasto frente al ingreso.")

    if credits >= 4:
        conclusions.append("Tiene alta carga de productos de credito activos.")
    elif credits == 0:
        conclusions.append("No registra creditos activos actualmente.")

    if debt_pressure > 0.5:
        conclusions.append("La presion financiera por obligaciones fijas es elevada.")

    recommendations = []
    if savings_rate < 0.1:
        recommendations.append("Definir una meta de ahorro automatica de al menos 10% del ingreso.")
    if expense_ratio > 0.75:
        recommendations.append("Aplicar recorte de 10-15% en gastos variables por 8 semanas.")
    if credits >= 3:
        recommendations.append("Priorizar estrategia de consolidacion o reduccion de deudas.")
    if not recommendations:
        recommendations.append("Mantener disciplina actual y construir fondo de emergencia de 3 a 6 meses.")

    return {
        "financial_habit_profile": financial_profile,
        "spending_habit_profile": spending_profile,
        "financial_habit_conclusion": " ".join(conclusions),
        "recommendations": recommendations,
        "metrics": {
            "savings": round(savings, 2),
            "savings_rate": round(savings_rate, 4),
            "expense_ratio": round(expense_ratio, 4),
            "debt_pressure": round(debt_pressure, 4),
            "healthy_signals": healthy_signals,
        },
    }


@app.post("/admin/login")
def admin_login(payload: AdminLoginRequest, req: Request):
    _enforce_rate_limit(req, "admin_login", max_requests=10, window_seconds=60)
    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        raise HTTPException(status_code=500, detail="Credenciales admin no configuradas en servidor")
    if payload.email != ADMIN_EMAIL or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Credenciales invalidas")
    return {
        "ok": True,
        "admin": {
            "email": payload.email,
            "role": "admin",
            "loginTime": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
    }


@app.post("/score/calculate")
def score_calculate(payload: ScoreRequest, req: Request):
    _require_app_token(req)
    _enforce_rate_limit(req, "score", max_requests=30, window_seconds=60)
    # Endpoint de score basado en el modelo de credit_scorer.py
    try:
        from credit_scorer import predict_credit_probability
        return predict_credit_probability(payload.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    # Endpoint de salud para validar deploy/conectividad.
    return {"status": "ok", "model": "claude-sonnet-4-20250514"}


@app.post("/habits/analyze")
def habits_analyze(payload: HabitsRequest, req: Request):
    _require_app_token(req)
    _enforce_rate_limit(req, "habits", max_requests=40, window_seconds=60)
    # Endpoint para enriquecer contexto de IA con hábitos financieros.
    try:
        return analyze_habits(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/claude")
def ask_claude(req: ClaudeRequest, request: Request):
    _require_app_token(request)
    _enforce_rate_limit(request, "claude", max_requests=20, window_seconds=60)
    # Endpoint principal de conversación IA.
    # Recibe system prompt, mensaje usuario e historial.
    try:
        messages = [{"role": m.role, "content": m.content} for m in req.history]
        messages.append({"role": "user", "content": req.userMessage})

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=req.systemPrompt,
            messages=messages
        )
        return {"reply": response.content[0].text}

    except anthropic.AuthenticationError:
        raise HTTPException(status_code=401, detail="API key invalida")
    except anthropic.RateLimitError:
        raise HTTPException(status_code=429, detail="Demasiadas solicitudes")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
