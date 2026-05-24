# 🔐 Integración de API Key para IA Real

## Estado Actual (MVP)

El chat de IA y los reportes actualmente usan **MOCK responses** (datos ficticios).

```
✅ Chat funciona (pero con respuestas hardcoded)
✅ Reportes generan (pero con datos mock)
❌ NO usan Claude API real
❌ NO necesitan API key
```

---

## Para Usar Claude API Real

### Opción 1: Frontend (NO RECOMENDADO - INSEGURO)

```javascript
// ❌ NUNCA hagas esto en frontend
const API_KEY = "sk-ant-xxxxx"  // ¡PELIGRO! Expone tu key
```

**Por qué es peligro:**
- La key queda visible en código fuente
- Cualquiera puede ver/copiar tu key en navegador
- Consumos descontrolados

---

### Opción 2: Backend (RECOMENDADO - SEGURO) ✅

#### Paso 1: Obtener API Key de Anthropic

1. Ir a: https://console.anthropic.com/
2. Crear cuenta (si no tienes)
3. Ir a: API Keys
4. Click: "Create Key"
5. Copiar tu clave (empieza con `sk-ant-`)

#### Paso 2: Crear Archivo .env en Backend

```bash
# backend/.env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

#### Paso 3: Configurar Backend (Python/FastAPI)

```python
# backend/main.py

import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("ANTHROPIC_API_KEY")
client = Anthropic()

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    """Endpoint para chat IA seguro"""
    
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        system=request.system_prompt,
        messages=[
            {"role": "user", "content": request.message}
        ]
    )
    
    return {"response": message.content[0].text}
```

#### Paso 4: Frontend Llama Backend (No expone key)

```javascript
// src/screens/AIAnalyst.jsx

async function sendMessage(message, systemPrompt) {
    // ✅ SEGURO: frontend NO tiene key
    const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: message,
            system_prompt: systemPrompt
        })
    });
    
    const data = await response.json();
    return data.response;
}
```

---

## 📋 Checklist de Seguridad

```bash
❌ NUNCA:
   - Poner API key en código fuente
   - Commitear .env a Git
   - Exponer key en frontend
   - Compartir key en Slack/email

✅ SIEMPRE:
   - Usar .env con dotenv
   - Agregar .env a .gitignore
   - Usar backend para keys
   - Rotar keys regularmente
   - Usar variables de entorno
```

---

## 🚀 Implementación Paso a Paso

### Paso 1: Instalar Dependencias

```bash
# En backend/
pip install anthropic python-dotenv
```

### Paso 2: Crear backend/.env

```bash
# backend/.env
ANTHROPIC_API_KEY=sk-ant-xxxxx
FLASK_ENV=development
PORT=8000
```

### Paso 3: Agregar a .gitignore

```bash
# .gitignore
.env
.env.local
.env.*.local
*.env
```

### Paso 4: Implementar Endpoint

```python
# backend/routes/chat.py

from anthropic import Anthropic
from flask import Blueprint, request, jsonify
import os

chat_bp = Blueprint('chat', __name__)
client = Anthropic()

@chat_bp.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    system_prompt = data.get('system_prompt')
    
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            system=system_prompt,
            messages=[
                {"role": "user", "content": message}
            ]
        )
        
        return jsonify({
            "response": response.content[0].text,
            "status": "success"
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500
```

### Paso 5: Frontend Llama API

```javascript
// src/services/claudeService.js

export async function askClaude(message, systemPrompt) {
    try {
        const response = await fetch('http://localhost:8000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                system_prompt: systemPrompt
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'error') {
            throw new Error(data.error);
        }
        
        return data.response;
    } catch (error) {
        console.error('Claude API error:', error);
        throw error;
    }
}
```

### Paso 6: Usar en AIAnalyst

```javascript
// src/screens/AIAnalyst.jsx

import { askClaude } from '../services/claudeService.js';

async function sendMessage(message, systemPrompt) {
    try {
        const response = await askClaude(message, systemPrompt);
        
        // Guardar en historial
        const newMessage = {
            role: 'assistant',
            content: response
        };
        
        setMessages([...messages, newMessage]);
    } catch (error) {
        // Fallback a mock si API falla
        console.log('API falló, usando mock');
        // ... usar mock response
    }
}
```

---

## 🔍 Verificar que Funciona

### Terminal 1: Backend

```bash
cd backend
python main.py
# Debe decir: "Running on http://localhost:8000"
```

### Terminal 2: Frontend

```bash
npm run dev
# Debe decir: "Local: http://localhost:5173"
```

### Browser: Probar Chat

```
1. http://localhost:5173/admin/login
2. Login con credenciales
3. Ir a IA Analyst
4. Escribir pregunta
5. Debe llamar backend → backend llama Claude → respuesta real
```

---

## 📊 Flujo Seguro de API Key

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. USER IN BROWSER                                    │
│     Escribe pregunta en chat                           │
│                   ↓                                     │
│  2. FRONTEND (React)                                   │
│     Envía mensaje a backend                           │
│     ❌ NO tiene API key                                │
│                   ↓                                     │
│  3. BACKEND (Python/Flask)                            │
│     Recibe mensaje                                     │
│     ✅ TIENE API key en .env                           │
│     Llama a Claude API                                 │
│     Recibe respuesta                                   │
│                   ↓                                     │
│  4. RESPUESTA                                          │
│     Backend envía a Frontend                           │
│     Frontend renderiza en chat                         │
│     User ve respuesta de IA                            │
│                                                         │
└─────────────────────────────────────────────────────────┘

SEGURIDAD: API key SOLO en backend, NUNCA en frontend
```

---

## ⚙️ Variables de Entorno (Producción)

### Heroku/Vercel/Railway

```bash
# En panel de deploy, agregar:
ANTHROPIC_API_KEY=sk-ant-xxxxx
FLASK_ENV=production
```

### Docker

```dockerfile
FROM python:3.11
ENV ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
ENV FLASK_ENV=production
# ...
```

### AWS Lambda

```python
import os
api_key = os.environ.get('ANTHROPIC_API_KEY')
```

---

## 🚨 Si Dejas como Mock

Actualmente el proyecto funciona perfectamente con mock:

```javascript
// ACTUAL (Mock - funciona pero con respuestas ficticias)
const mockResponse = "4 independientes en riesgo...";
setMessages([...messages, { role: 'assistant', content: mockResponse }]);

// CAMBIAR A (Real - llama Claude)
const realResponse = await askClaude(message, systemPrompt);
setMessages([...messages, { role: 'assistant', content: realResponse }]);
```

---

## 📚 Links Útiles

- **Anthropic Console:** https://console.anthropic.com/
- **API Documentation:** https://docs.anthropic.com/
- **Model Info:** https://docs.anthropic.com/models/overview

---

## 🎯 Resumen

| Aspecto | Mock | Real |
|---------|------|------|
| **API Key necesaria** | ❌ No | ✅ Sí |
| **Dónde** | N/A | backend/.env |
| **Exposición** | N/A | Ninguna (backend) |
| **Costo** | Gratis | $0.003-0.3 por mensaje |
| **Respuestas** | Ficticias | Reales de Claude |
| **Tiempo setup** | 0 min | 15 min |

---

## ✅ Próximas Fases

**Fase 1 (Actual):** Mock responses ✅
**Fase 2 (Recomendado):** Backend + Claude real 📝
**Fase 3:** Multi-asesor + persistencia
**Fase 4:** Fine-tuning con datos Serfinanza

---

## 🆘 Soporte

Si tienes problemas:

1. Verificar .env existe y tiene API key
2. Verificar backend corre: http://localhost:8000
3. Verificar CORS habilitado en backend
4. Ver logs de error en console/terminal

---

**Por ahora: usa mock y funciona perfecto.**
**Cuando quieras Claude real: sigue esta guía.**
