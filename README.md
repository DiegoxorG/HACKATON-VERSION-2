# FinConfia - Setup

## Requisitos
- Node.js 18+
- Python 3.11+

## Instalacion

```bash
# 1. Instalar dependencias del frontend
npm install

# 2. Instalar dependencias del backend Python
cd backend
pip install -r requirements.txt
cd ..

# 3. Agregar tu API key
# Editar backend/.env y poner:
# ANTHROPIC_API_KEY=sk-ant-...

# 4. Iniciar todo
npm run dev:all
```

# Frontend: http://localhost:5173
# Backend:  http://localhost:8000
# Docs API: http://localhost:8000/docs
