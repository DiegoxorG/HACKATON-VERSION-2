from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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

@app.get("/health")
def health():
    return {"status": "ok", "model": "claude-sonnet-4-20250514"}

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
