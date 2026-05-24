# FinConfia

Aplicacion web fintech con asesor IA para clientes bancarios en Colombia.

## Requisitos
- Node.js 20+
- API key de Anthropic

## Instalacion y ejecucion
```bash
# 1. Instalar dependencias del frontend
npm install

# 2. Instalar dependencias del backend
cd server && npm install && cd ..

# 3. Agregar tu API key de Anthropic
# Editar server/.env y poner: ANTHROPIC_API_KEY=sk-ant-...

# 4. Iniciar todo con un solo comando
npm run dev:all
```

Frontend: http://localhost:5173  
Backend: http://localhost:3001
