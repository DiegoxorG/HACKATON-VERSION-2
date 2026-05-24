from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="FinConfia API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

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


def analyze_habits(payload: HabitsRequest):
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


@app.post("/score/calculate")
def score_calculate(payload: ScoreRequest):
    try:
        from credit_scorer import predict_credit_probability
        return predict_credit_probability(payload.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok", "model": "claude-sonnet-4-20250514"}


@app.post("/habits/analyze")
def habits_analyze(payload: HabitsRequest):
    try:
        return analyze_habits(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/claude")
def ask_claude(req: ClaudeRequest):
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
