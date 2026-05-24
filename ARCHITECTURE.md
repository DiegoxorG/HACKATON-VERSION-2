# FinConfia Architecture Guide

## 1) High-Level Structure
- `src/` contains the React frontend.
- `backend/` contains the FastAPI server for AI and analytics endpoints.
- The project has two UI flows:
  - Client flow (`App.jsx`)
  - Admin flow (`AppAdmin.jsx`)

## 2) Frontend Entry And Routing
- File: `src/main.jsx`
- It decides which app to mount based on URL:
  - Paths containing `/admin` mount `AppAdmin`
  - Otherwise mounts `App`

### Client App
- File: `src/App.jsx`
- Public routes:
  - `/`, `/login`, `/register`, `/welcome`
- Protected routes:
  - `/dashboard`, `/expenses`, `/advisor`, `/credits`, `/products`, `/reports`, `/profile`, `/score`

### Admin App
- File: `src/AppAdmin.jsx`
- Public admin route:
  - `/admin/login`
- Protected admin routes:
  - `/admin/dashboard`, `/admin/clients`, `/admin/client/:id`, `/admin/analyst`, `/admin/reports`, `/admin/profile`

## 3) Global State (Contexts)
### Client Context
- File: `src/context/AppContext.jsx`
- Provides:
  - `user`
  - `setUser`
  - `logout`

### Admin Context
- File: `src/context/AdminContext.jsx`
- Provides:
  - `admin` session state
  - `clients` and `filteredClients`
  - `filters` and `setFilters`
  - `getClientById`
- Data source behavior:
  - Uses integrated real users if available
  - Falls back to `mockClients` for demo safety

## 4) Service Layer
### AI Chat Service
- File: `src/services/claudeService.js`
- Uses:
  - `VITE_API_URL` in production
  - `http://localhost:8000` fallback in local dev
- Endpoint used:
  - `POST /api/claude`

### Habits Service
- File: `src/services/habitsService.js`
- Calls:
  - `POST /habits/analyze`
- Returns habit profiles and recommendation hints used by AI prompts.

### Other Core Services
- `authService.js`: register/login/session persistence.
- `expenseService.js`: expense CRUD and aggregates by month/category.
- `memoryService.js`: persistent conversational memory helpers.
- `accountsService.js`: maps app users into admin client cards.

## 5) Backend API
- File: `backend/main.py`
- Main endpoints:
  - `GET /health`
  - `POST /api/claude`
  - `POST /habits/analyze`
  - `POST /score/calculate`

### CORS
- Base local origins are enabled by default.
- Production origins are added via:
  - `CORS_ORIGINS` env var (comma-separated list).

### Anthropic Integration
- Uses `ANTHROPIC_API_KEY`.
- Model currently configured in code:
  - `claude-sonnet-4-20250514`

## 6) Deploy Topology (Render)
- Backend (Web Service), for example:
  - `https://finconfia-api.onrender.com`
- Frontend (Static Site), for example:
  - `https://finconfia-web.onrender.com`
- Required env links:
  - Frontend: `VITE_API_URL=https://finconfia-api.onrender.com`
  - Backend: `CORS_ORIGINS=https://finconfia-web.onrender.com`

## 7) Typical Runtime Flow
1. User opens frontend route.
2. React app loads correct flow (client/admin).
3. For AI screens, frontend builds prompt context (profile, expenses, habits).
4. Frontend calls backend `/api/claude`.
5. Backend forwards request to Anthropic and returns model reply.
6. Frontend parses tags/actions from response and updates UI/state.

