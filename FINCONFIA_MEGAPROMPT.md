# FINCONFIA — MEGAPROMPT COMPLETO PARA CODEX
# Construir todo el proyecto desde cero

You are a senior full-stack fintech developer and UI/UX designer.
Build **FinConfia** — a complete AI-powered financial assistant web app
for Colombian bank clients — from scratch, with zero placeholders.

Every file must be complete, every screen must be fully styled,
and the AI must work with real Claude API calls through a backend proxy.

---

## WHAT IS FINCONFIA

FinConfia bridges the trust gap between Colombian banks and individual clients.
It gives each client a personalized AI financial advisor, helps them understand
their credit capacity, and generates internal reports for the bank.
The goal: more informed clients = better payment rates = stronger bank-client trust.

---

## TECH STACK

Frontend:  React 18 + Vite + Tailwind CSS + lucide-react + Recharts
Backend:   Node.js 20 + Express (proxy to Claude API)
AI:        Anthropic Claude — model: claude-sonnet-4-20250514
Auth:      localStorage only (no real backend auth needed)
Storage:   localStorage for users, chat history, session
Charts:    Recharts (PieChart, BarChart, AreaChart)
Icons:     lucide-react ONLY — zero emojis anywhere in the UI
Fonts:     Sora (headings) + DM Sans (body) from Google Fonts

---

## PROJECT FILE STRUCTURE

```
finconfia/
├── server/
│   ├── index.js          ← Express proxy server
│   ├── package.json
│   └── .env              ← ANTHROPIC_API_KEY goes here
├── src/
│   ├── main.jsx
│   ├── App.jsx            ← Router + auth guard
│   ├── index.css          ← Tailwind directives + Google Fonts import
│   ├── context/
│   │   └── AppContext.jsx ← Global state: user, auth, financials
│   ├── services/
│   │   ├── claudeService.js  ← askClaude() → calls localhost:3001
│   │   └── authService.js    ← localStorage auth CRUD
│   ├── data/
│   │   └── mockUser.js       ← Demo user for hackathon button
│   ├── utils/
│   │   └── finance.js        ← calculateScore(), formatCOP(), etc.
│   └── screens/
│       ├── Splash.jsx
│       ├── Login.jsx
│       ├── Register.jsx      ← 3-step wizard
│       ├── Welcome.jsx       ← Post-register celebration
│       ├── Dashboard.jsx
│       ├── AIAdvisor.jsx
│       ├── CreditAnalyzer.jsx
│       ├── BankReport.jsx
│       └── Profile.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── .env                  ← VITE_ vars (empty, backend handles key)
```

---

## DESIGN SYSTEM

```css
Colors:
  --blue-dark:    #1B3A6B   primary brand, headers, sidebar
  --blue-mid:     #2D5FA6   gradients, hover states
  --blue-light:   #EEF4FF   input backgrounds, subtle fills
  --gold:         #F5A623   accent, active states, CTAs
  --gold-light:   #FFF8E7   gold tinted backgrounds
  --green:        #22C55E   success, positive scores
  --yellow:       #F59E0B   warnings
  --red:          #EF4444   danger, high risk
  --gray-bg:      #F0F4F8   page background
  --white:        #FFFFFF   cards
  --text-dark:    #1E293B   primary text
  --text-mid:     #64748B   secondary text
  --text-light:   #94A3B8   captions, timestamps

Fonts (import in index.css from Google Fonts):
  Sora: weights 600, 700, 800
  DM Sans: weights 400, 500, 600

Typography scale:
  Display:  Sora 800, 2.5rem
  H1:       Sora 700, 1.75rem
  H2:       Sora 600, 1.25rem
  Body:     DM Sans 400, 1rem
  Small:    DM Sans 400, 0.875rem
  Tiny:     DM Sans 400, 0.75rem
  Numbers:  DM Sans 600 monospace variant

Components:
  Card:           bg-white rounded-2xl shadow-md p-6
  Input:          bg-[#EEF4FF] border border-gray-200 rounded-xl p-3
                  focus:ring-2 focus:ring-[#F5A623] focus:border-transparent
  Button primary: bg-[#1B3A6B] text-white rounded-xl py-3 px-6
                  font-semibold hover:bg-[#2D5FA6] transition-all
                  active:scale-95
  Button gold:    bg-[#F5A623] text-[#1B3A6B] rounded-xl py-3 px-6
                  font-semibold hover:brightness-105 active:scale-95
  Button outline: border-2 border-[#1B3A6B] text-[#1B3A6B] rounded-xl
  Badge green:    bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm
  Badge yellow:   bg-yellow-100 text-yellow-700 rounded-full px-3 py-1 text-sm
  Badge red:      bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm

Layout:
  Auth screens (Splash/Login/Register): 2-column full height
    Left col  (w-1/2): blue gradient, logo, illustration, feature pills
    Right col (w-1/2): white, centered form, max-w-sm mx-auto
    Mobile (<768px):   stack, blue header on top (h-48), form below

  App screens (Dashboard/Chat/Credits/Report/Profile): sidebar layout
    Sidebar (w-64): fixed left, full height, bg-[#1B3A6B], white text
    Main area:      flex-1, bg-[#F0F4F8], p-8, overflow-y-auto
    Mobile (<768px): bottom nav bar instead of sidebar

Animations:
  Screen enter:  fadeIn + translateY(16px→0) 300ms ease-out
  Cards:         hover:shadow-lg hover:-translate-y-0.5 transition-all
  Buttons:       active:scale-95 transition-transform
  Score arc:     SVG stroke-dashoffset animated 800ms ease-out on mount
  Skeletons:     animate-pulse bg-gray-200 rounded
```

---

## LOGO COMPONENT

Create src/components/Logo.jsx:

```jsx
// The logo reads "FinConfia" with a gold diamond replacing the dot of the i
// The full word must always be readable as "FinConfia"
export default function Logo({ size = 'md', light = false }) {
  const sizes = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl' }
  const color = light ? 'text-white' : 'text-[#1B3A6B]'
  return (
    <span className={`font-extrabold ${sizes[size]} ${color} tracking-tight`}
          style={{ fontFamily: 'Sora, sans-serif' }}>
      FinConf
      <span className="relative inline-flex items-center justify-center">
        <span
          className="inline-block bg-[#F5A623] mx-0.5"
          style={{
            width: size === 'lg' ? 12 : size === 'md' ? 9 : 7,
            height: size === 'lg' ? 12 : size === 'md' ? 9 : 7,
            transform: 'rotate(45deg)',
            verticalAlign: 'middle',
            flexShrink: 0
          }}
        />
      </span>
      a
    </span>
  )
}
```

Use <Logo /> everywhere — never hardcode the name as a string.

---

## BACKEND — server/index.js

```javascript
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }))
app.use(express.json())

app.post('/api/claude', async (req, res) => {
  const { systemPrompt, userMessage, history = [] } = req.body
  if (!userMessage) return res.status(400).json({ error: 'userMessage is required' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt || 'Eres FinConfia, un asistente financiero empático.',
        messages: [...history, { role: 'user', content: userMessage }]
      })
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(response.status).json({ error: err.error?.message || 'API error' })
    }

    const data = await response.json()
    res.json({ reply: data.content[0].text })

  } catch (err) {
    console.error('[FinConfia backend error]', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.get('/health', (_, res) => res.json({ status: 'ok', model: 'claude-sonnet-4-20250514' }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`✅ FinConfia backend ready on port ${PORT}`))
```

server/package.json:
```json
{
  "name": "finconfia-server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": { "start": "node index.js", "dev": "nodemon index.js" },
  "dependencies": { "express": "^4.18.2", "cors": "^2.8.5", "dotenv": "^16.0.3" }
}
```

server/.env:
```
ANTHROPIC_API_KEY=paste_your_key_here
```

---

## src/services/claudeService.js

```javascript
const BACKEND = 'http://localhost:3001'

export const askClaude = async (systemPrompt, userMessage, history = []) => {
  const res = await fetch(`${BACKEND}/api/claude`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, userMessage, history })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  const data = await res.json()
  return data.reply
}
```

---

## src/services/authService.js

```javascript
const USERS_KEY = 'finconfia_users'
const SESSION_KEY = 'finconfia_session'

export const register = (userData) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  if (users.find(u => u.email === userData.email))
    throw new Error('Este correo ya está registrado')
  const user = { ...userData, id: Date.now(), createdAt: new Date().toISOString() }
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export const login = (email, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) throw new Error('Correo o contraseña incorrectos')
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export const logout = () => localStorage.removeItem(SESSION_KEY)

export const getSession = () => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')

export const updateProfile = (updatedData) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const idx = users.findIndex(u => u.id === updatedData.id)
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updatedData }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    localStorage.setItem(SESSION_KEY, JSON.stringify(users[idx]))
    return users[idx]
  }
  return updatedData
}
```

---

## src/utils/finance.js

```javascript
export const formatCOP = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

export const calculateScore = (user) => {
  if (!user) return 0
  const { income = 0, fixedExpenses = 0, variableExpenses = 0, credits = 0 } = user
  const total = fixedExpenses + variableExpenses
  const savings = income - total
  const savingsRate = income > 0 ? savings / income : 0
  let score = 50
  if (savingsRate > 0.20) score += 20
  else if (savingsRate > 0.10) score += 10
  if (credits >= 3) score -= 15
  else if (credits === 2) score -= 7
  if (total > income * 0.85) score -= 15
  else if (total > income * 0.70) score -= 7
  if (savings > 0) score += 10
  return Math.min(100, Math.max(0, Math.round(score)))
}

export const getScoreLabel = (score) => {
  if (score >= 70) return { label: 'Excelente', color: '#22C55E', bg: 'bg-green-100 text-green-700' }
  if (score >= 50) return { label: 'Buena', color: '#F59E0B', bg: 'bg-yellow-100 text-yellow-700' }
  return { label: 'En riesgo', color: '#EF4444', bg: 'bg-red-100 text-red-700' }
}

export const buildClientSummary = (user) => `
Nombre: ${user.name}, Edad: ${user.age}, Ciudad: ${user.city}, Ocupación: ${user.occupation}
Ingreso mensual: ${formatCOP(user.income)}
Gastos fijos: ${formatCOP(user.fixedExpenses)}
Gastos variables: ${formatCOP(user.variableExpenses)}
Ahorro mensual: ${formatCOP((user.income || 0) - (user.fixedExpenses || 0) - (user.variableExpenses || 0))}
Créditos activos: ${user.credits}
Metas: ${user.goals?.join(', ')}
Puntaje de salud financiera: ${calculateScore(user)}/100
`.trim()
```

---

## src/data/mockUser.js

```javascript
export const mockUser = {
  id: 9999,
  name: 'Carlos Martínez',
  age: 34,
  city: 'Barranquilla',
  occupation: 'Docente',
  email: 'demo@finconfia.co',
  password: 'demo123',
  income: 3200000,
  fixedExpenses: 1400000,
  variableExpenses: 600000,
  credits: 2,
  goals: ['Pagar mis deudas', 'Crear un fondo de emergencia'],
  createdAt: new Date().toISOString()
}
```

---

## src/context/AppContext.jsx

Provide: user, setUser, logout
On mount: read from getSession()
Export useApp() hook

---

## SCREEN 1 — Splash.jsx

2-column full-height layout (flex-row h-screen):

LEFT COLUMN — bg gradient from #1B3A6B to #2D5FA6:
  - <Logo size="lg" light /> centered
  - Tagline: "Tu asesor financiero de confianza" — white DM Sans
  - SVG illustration below (white strokes on transparent):
    Draw a clean dashboard card outline containing:
    * Left half: 3 vertical bars (bar chart) of varying heights
    * Right half: circle with a horizontal line through center
    * Bottom strip: rounded rectangle (credit card shape)
    All paths: stroke="white" strokeWidth="2" fill="none" opacity="0.8"
    Size: 280x180px viewBox
  - 3 feature pills at bottom (white/10 bg, rounded-full, white text small):
    <CheckCircle size={14}/> Asesoría personalizada
    <Shield size={14}/> Datos seguros
    <TrendingUp size={14}/> Mejora tu crédito

RIGHT COLUMN — bg white, flex items-center justify-center:
  Centered card (max-w-sm w-full px-10):
    <Logo size="sm" /> top
    H1: "Bienvenido" — Sora bold #1B3A6B
    Subtitle: "Toma el control de tus finanzas con inteligencia artificial"
              DM Sans gray
    Gap of 2rem
    Button stack:
      [Iniciar sesión]  → full width primary blue, navigate to /login
      [Crear cuenta]    → full width gold, navigate to /register
      [Demo rápida]     → full width outline, loads mockUser + goes to /dashboard
                          text small: "Ver demo sin registrarse"
    Bottom: tiny gray "© 2025 FinConfia · Barranquilla, Colombia"

---

## SCREEN 2 — Login.jsx

Same 2-column layout. Right column form:

  <Logo size="sm" />
  H1: "Iniciar sesión"
  Subtitle: "¡Bienvenido de vuelta!"

  Form fields (label above, icon inside input left):
    <Mail size={16}/> Correo electrónico — email input
    <Lock size={16}/> Contraseña — password input + eye toggle (<Eye/>/<EyeOff/>)

  "¿Olvidaste tu contraseña?" — right aligned gold text tiny

  Error box (if error): red bg-red-50 border border-red-200 rounded-xl p-3
    <AlertCircle size={16} className="text-red-500"/> {errorMessage}

  [Ingresar →] full width primary blue button
    Loading state: <Loader2 className="animate-spin"/> "Ingresando..."

  Divider: gray line with "o" centered

  [Demo rápida] outline button — loads mockUser, skips auth

  Bottom: "¿No tienes cuenta? " + gold link "Crear cuenta"

---

## SCREEN 3 — Register.jsx (3-step wizard)

Same 2-column layout. Right column:

Step indicator (3 circles connected by lines, horizontal):
  Circle: 40px, Sora bold number inside
  Active:    bg-[#F5A623] text-[#1B3A6B] shadow-md
  Completed: bg-[#1B3A6B] text-white — show <Check size={16}/>
  Pending:   bg-gray-100 text-gray-400
  Labels below: "Tu perfil" / "Tus finanzas" / "Tus metas"
  Connecting lines: gray, turn blue when step is completed

── STEP 1: "Cuéntanos sobre ti" ──
  Fields with icon left inside input:
    <User/> Nombre completo
    <Calendar/> Edad (number)
    <MapPin/> Ciudad (pre-filled "Barranquilla")
    <Briefcase/> Ocupación → select:
      ["Empleado/a", "Independiente", "Empresario/a",
       "Estudiante", "Pensionado/a", "Otro"]
    <Mail/> Correo electrónico
    <Lock/> Contraseña (+ confirm password)
  Inline validation: red text below field if empty on Next

── STEP 2: "Tu situación financiera" ──
  Each field has "COP" badge right-side inside input, blue text
    <DollarSign/> Ingreso mensual neto
    <Home/> Gastos fijos  — helper text below: "Arriendo, servicios, créditos"
    <ShoppingCart/> Gastos variables — helper: "Comida, transporte, entretenimiento"
    <CreditCard/> Créditos activos — stepper [−] [N] [+] with blue buttons

  Live preview card (gold border-l-4, bg-[#FFF8E7], p-4, rounded-xl):
    Show in real time as user types:
    Label: "Capacidad de ahorro estimada"
    Value: formatCOP(income - fixedExpenses - variableExpenses)
    Color: green if positive, red if negative
    Mini bar: income=full width blue, expenses=overlay red, savings=green extension

── STEP 3: "¿Qué quieres lograr?" ──
  Subtitle: "Selecciona al menos una meta"
  
  Goal grid (2 columns):
    Each goal chip (full card style, rounded-2xl, p-4, cursor-pointer):
      Icon left (lucide) + goal text
      Unselected: white bg, gray border, gray text
      Selected:   bg-[#FFF8E7] border-2 border-[#F5A623], blue text bold
                  <CheckCircle/> icon appears top-right corner in gold
    
    Goals with icons:
      <Receipt/> "Pagar mis deudas"
      <Home/> "Ahorrar para vivienda"
      <Shield/> "Fondo de emergencia"
      <TrendingUp/> "Empezar a invertir"
      <Star/> "Mejorar mi crédito"
      <GraduationCap/> "Ahorrar para educación"

  Error if none selected: show red message on submit attempt

  [Crear mi cuenta →] gold button full width

Navigation buttons at bottom of each step:
  Step 1+2: [← Atrás] outline left + [Continuar →] primary blue right
  Step 3: [← Atrás] + [Crear mi cuenta →] gold

---

## SCREEN 4 — Welcome.jsx (post-register celebration)

Full screen white, centered vertically:

  Animated circle (scale from 0 to 1, 600ms spring):
    80px circle, gold bg, white <CheckCircle size={40}/>

  H1: "¡Listo, {name}!" — Sora 800 #1B3A6B
  Subtitle: "Tu perfil está configurado. FinConfia ya conoce tu situación."
             DM Sans gray

  Score preview card (blue bg, white, rounded-2xl, inline-flex, px-8 py-4):
    "Tu salud financiera inicial"
    Large score number in gold (Sora 800, 3rem)
    "/100" in white smaller
    Score label pill below

  Progress bar (animated fill left to right, 1s delay):
    bg-white/20 track, bg-[#F5A623] fill, height 8px, rounded-full

  [Ver mi Dashboard →] gold button, large, mt-8

  Auto-navigate to /dashboard after 5 seconds (countdown optional)

---

## SIDEBAR COMPONENT — src/components/Sidebar.jsx

Fixed left sidebar for all app screens (width: 256px, h-screen):

bg-[#1B3A6B] flex flex-col

TOP:
  Logo section (p-6 border-b border-white/10):
    <Logo light size="sm"/>
    Tiny text: "Asesor financiero IA" — white/60

NAV ITEMS (flex-col gap-1 p-4):
  Each item (flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer):
    Icon (20px) + Label (DM Sans 500)
    Active:   bg-[#F5A623] text-[#1B3A6B] font-semibold
    Inactive: text-white/80 hover:bg-white/10 transition-all

  Items:
    <LayoutDashboard/> "Inicio"         → /dashboard
    <Bot/>             "Asesor IA"      → /advisor
    <CreditCard/>      "Créditos"       → /credits
    <FileText/>        "Reportes"       → /reports
    <User/>            "Perfil"         → /profile

BOTTOM (mt-auto p-4 border-t border-white/10):
  User avatar circle (40px bg-[#F5A623] text-[#1B3A6B] font-bold initials)
  + Name bold white small
  + Occupation text-white/60 tiny
  <LogOut size={16}/> "Cerrar sesión" — text-white/60 hover:text-red-400
    onClick: logout() + navigate to /

MOBILE (<768px): hide sidebar, show bottom nav bar instead
  Bottom nav: bg-white border-t, 5 tabs, same icons
  Active tab: gold icon + gold label + gold dot below icon

---

## SCREEN 5 — Dashboard.jsx

Layout: Sidebar + main content

MAIN CONTENT (p-8 bg-[#F0F4F8]):

  TOP ROW (flex justify-between items-center mb-8):
    Left: "Hola, {name}" — Sora 800 #1B3A6B
          "Aquí está tu resumen financiero" — DM Sans gray
    Right: date string (DM Sans small gray)
           <Bell/> icon button (relative, if alerts show gold dot)

  AI ALERTS SECTION (loads on mount via Claude):
    Call askClaude() once with:
      system: "Eres un asesor financiero. Responde SOLO con JSON válido sin markdown:
               {\"alerts\":[{\"type\":\"tip|warning|danger\",\"text\":\"...\"}]}"
      user: "Genera 2 alertas financieras cortas y específicas para: " + buildClientSummary(user)
    
    Show skeleton cards while loading (2 gray animate-pulse bars)
    Render each alert as dismissable banner:
      tip:     bg-blue-50 border-l-4 border-blue-400  <Lightbulb/> blue
      warning: bg-yellow-50 border-l-4 border-yellow-400 <AlertTriangle/> yellow
      danger:  bg-red-50 border-l-4 border-red-400 <AlertCircle/> red
    Each has <X/> button top-right to dismiss (remove from state)
    Fade-in animation on appear

  SCORE + METRICS ROW (grid grid-cols-3 gap-6 mb-6):

    LEFT-CENTER SPAN (col-span-1):
      White card, centered content:
        "Salud Financiera" — DM Sans gray small, uppercase tracking-wide
        
        SVG Score Circle (200px):
          Background track circle: stroke="#EEF4FF" strokeWidth="12"
          Animated arc: stroke=scoreColor strokeWidth="12"
            strokeDasharray="502" (circumference for r=80)
            strokeDashoffset: animated from 502 to 502*(1-score/100)
            Animation: 800ms ease-out on mount
            strokeLinecap="round"
          Center text: score number Sora 800 48px + "/100" small
          Below circle: score label pill (getScoreLabel badge)

    RIGHT (col-span-2, grid grid-cols-2 gap-4):
      4 metric cards (white, rounded-2xl, p-5):
        Each: icon top (24px, colored) + value (Sora 600 24px) + label (DM Sans gray sm)
        
        Card 1 — <DollarSign className="text-blue-600"/>
          formatCOP(income) blue
          "Ingreso mensual"
        
        Card 2 — <TrendingDown className="text-red-500"/>
          formatCOP(fixedExpenses + variableExpenses) red
          "Total gastos"
        
        Card 3 — <PiggyBank className="text-green-500"/>
          formatCOP(savings) — green if positive, red if negative
          "Capacidad de ahorro"
        
        Card 4 — <CreditCard className="text-[#F5A623]"/>
          "{credits} activos" gold
          "Créditos"

  CHARTS ROW (grid grid-cols-2 gap-6 mb-6):

    LEFT — "¿A dónde va tu dinero?" (white card):
      Recharts PieChart (donut, innerRadius=60 outerRadius=90):
        Slice 1: Gastos Fijos   — #1B3A6B
        Slice 2: Gastos Variables — #F5A623
        Slice 3: Ahorro         — #22C55E (or #EF4444 if negative)
      Custom legend below: colored dot + label + amount + percent
      Center label in donut: "Total" + formatCOP(income)

    RIGHT — "Capacidad crediticia" (white card):
      Title + subtitle: "Basado en tu perfil financiero"
      
      Large capacity bar:
        Label: "Tu límite de crédito recomendado"
        Value: formatCOP(income * 0.3) in bold (30% of income rule)
        Bar: full width, rounded-full, h-4
          track: bg-gray-100
          fill: bg-green-500 width=(score)%  or yellow/red
      
      3 info rows below (icon + label + value, border-b):
        <Percent/> Tasa de endeudamiento: X%
        <Calendar/> Plazo máximo sugerido: X meses
        <CheckCircle/> Estado crediticio: label pill

  QUICK ACTIONS ROW (grid grid-cols-2 gap-4):
    Card 1 (bg-[#1B3A6B] text-white rounded-2xl p-6 cursor-pointer hover:bg-[#2D5FA6]):
      <Bot size={32} className="text-[#F5A623] mb-3"/>
      "Hablar con FinConfia" Sora 700
      "Obtén consejos personalizados" DM Sans small white/70
      → navigate to /advisor

    Card 2 (bg-[#F5A623] text-[#1B3A6B] rounded-2xl p-6 cursor-pointer):
      <Calculator size={32} className="text-[#1B3A6B] mb-3"/>
      "Analizar un crédito" Sora 700
      "¿Te conviene ese crédito?" DM Sans small
      → navigate to /credits

---

## SCREEN 6 — AIAdvisor.jsx

Sidebar + main content split (main has 2 columns):

CHAT COLUMN (flex-1):

  Top bar (white bg-white shadow-sm p-4 flex items-center gap-3):
    FC avatar circle (40px bg-[#1B3A6B] text-white "FC" Sora bold)
    "FinConfia" Sora 700 + green dot + "En línea" DM Sans tiny green
    Right: <MoreVertical/> menu icon

  Chat scroll area (flex-1 overflow-y-auto p-4 bg-[#F0F4F8] flex flex-col gap-3):

    Date separator: centered pill "Hoy" gray bg small

    AI message bubble (left):
      flex gap-3 items-start max-w-[75%]
      FC avatar (32px) + white card rounded-2xl rounded-tl-none shadow-sm
      Gold left border: border-l-4 border-[#F5A623]
      Text: DM Sans #1B3A6B
      Timestamp: DM Sans tiny gray mt-1

    User message bubble (right):
      flex justify-end
      bg-[#1B3A6B] text-white rounded-2xl rounded-tr-none px-5 py-3
      Max width 75% aligned right
      Timestamp: DM Sans tiny white/60 mt-1

    Typing indicator (left, same as AI bubble style):
      3 dots: each a 8px circle bg-[#F5A623]
      Animation: bounce staggered (0ms, 150ms, 300ms delay)

  Suggestion chips (horizontal scroll, p-3 bg-white border-t):
    Pill style: border border-[#F5A623] text-[#1B3A6B] rounded-full
                px-4 py-2 text-sm cursor-pointer hover:bg-[#FFF8E7]
                whitespace-nowrap
    Chips:
      "¿Puedo pagar mis deudas más rápido?"
      "¿Cuánto debo ahorrar al mes?"
      "¿Conviene sacar un crédito ahora?"
      "¿Cómo mejoro mi historial crediticio?"
    On click: set as input value + auto-send

  Input bar (fixed bottom, bg-white border-t p-4):
    Rounded-full input: bg-[#EEF4FF] border-none flex-1
    Placeholder: "Escríbele a FinConfia..."
    Right: circular send button bg-[#F5A623] text-[#1B3A6B] <Send size={18}/>
    On Enter or click send: call sendMessage()

ON MOUNT: auto-call Claude with:
  userMessage: "Saluda al cliente por su nombre y dale 1 insight específico 
                sobre su situación financiera basado en sus números reales.
                Sé cálido y motivador. Máximo 3 oraciones."
  Include buildClientSummary(user) in system prompt.

CONVERSATION STATE:
  history = [{role, content}] in useState
  Add each message to history before next Claude call
  Save sessions to localStorage: 'finconfia_chat_history'
  Key per session: timestamp of first message

SYSTEM PROMPT for all chat messages:
```
Eres FinConfia, un asesor financiero empático experto en finanzas personales colombianas.
Hablas en español colombiano, de forma cálida, clara y sin tecnicismos innecesarios.
Nunca suenas como un robot. Das consejos específicos, accionables, y siempre
terminas con una pregunta de seguimiento para continuar la conversación.
Máximo 3 párrafos cortos por respuesta.

Perfil del cliente:
${buildClientSummary(user)}
```

ERROR HANDLING in chat:
  If askClaude() throws: show error bubble (left side, red border-l-4):
    if err includes 'fetch': "No se pudo conectar. ¿Está corriendo el servidor?"
    if err includes '401':   "Clave API inválida. Contacta soporte."
    if err includes '429':   "Demasiadas solicitudes. Espera un momento."
    else:                    err.message

HISTORY PANEL (right column, w-72, bg-white border-l):
  Title: "Conversaciones" Sora 700 p-4 border-b
  List of past sessions from localStorage:
    Each: date formatted + first message preview (truncated 40 chars)
    Click: load that conversation into chat state
  Empty state: <MessageSquare/> icon + "Aún no hay conversaciones anteriores"

---

## SCREEN 7 — CreditAnalyzer.jsx

Sidebar + main content:

TOP CARD (white rounded-2xl shadow p-6 mb-6):
  Title: "Analizador de Crédito" <Calculator/> icon
  Subtitle: "Descubre si este crédito te conviene antes de solicitarlo"

  FORM (grid grid-cols-2 gap-6):
    
    Left column:
      Monto del crédito:
        Input number, "COP" badge right, <DollarSign/> left
        Show formatted preview below: "= formatCOP(amount)"

      Tasa de interés mensual:
        Input number, "% mensual" badge right
        Show "= X% efectivo anual" below in gray small

      Propósito del crédito:
        Horizontal chip selector (5 per row, scrollable):
          <Home/> Vivienda | <Car/> Vehículo | <GraduationCap/> Educación
          <Briefcase/> Negocio | <Zap/> Libre inversión | <AlertCircle/> Emergencia
          Selected: gold bg blue text border-[#F5A623]

    Right column:
      Plazo (meses):
        Custom range slider:
          Track bg-gray-200, filled bg-[#1B3A6B]
          Thumb: 24px circle bg-[#F5A623] border-2 border-white shadow
          Value label above thumb: floating gold pill
          Min: 6, Max: 60, Step: 6
          Labels below: "6 meses" left, "60 meses" right

      Live calculator card (bg-[#EEF4FF] rounded-xl p-4):
        "Resumen del crédito" — DM Sans 600
        Rows:
          Cuota mensual estimada: formatCOP(monthlyPayment)
          Total a pagar:          formatCOP(totalPayment)
          Total intereses:        formatCOP(totalPayment - amount)
          % del ingreso:          X% — red if > 30%
        Formula: monthlyPayment = amount * rate / (1 - (1+rate)^-months)

  [Analizar con IA →] full width gold button below form
    Loading: <Loader2 animate-spin/> "Analizando con IA..."

RESULTS SECTION (animated slide-up, only when results exist):

  Call askClaude() on submit:
    system: "Eres analista de riesgo crediticio colombiano. 
             Responde ÚNICAMENTE con JSON sin texto extra ni markdown:
             {\"verdict\":\"APROBADO|CON_PRECAUCIÓN|NO_RECOMENDADO\",
              \"probability\":number,
              \"reasons\":[\"...\",\"...\",\"...\"],
              \"advice\":\"...\",
              \"alternative\":\"...|null\"}"
    user: buildClientSummary(user) + "\n\nCrédito solicitado: " + creditDetails

  VERDICT BANNER (full width rounded-2xl p-6):
    APROBADO:        bg-green-50 border-2 border-green-400
      <CheckCircle size={48} className="text-green-500"/>
      "APROBADO" Sora 800 text-green-700 text-3xl
    CON_PRECAUCIÓN:  bg-yellow-50 border-2 border-yellow-400
      <AlertTriangle size={48} className="text-yellow-500"/>
      "CON PRECAUCIÓN" Sora 800 text-yellow-700 text-3xl
    NO_RECOMENDADO:  bg-red-50 border-2 border-red-400
      <XCircle size={48} className="text-red-500"/>
      "NO RECOMENDADO" Sora 800 text-red-700 text-3xl

  GRID (grid grid-cols-2 gap-4 mt-4):

    Probability gauge (white card):
      "Probabilidad de pago exitoso"
      SVG semicircle gauge (180° arc):
        Track: gray, Fill: colored arc based on probability
        Center: big % number Sora 800
      Color: green>70, yellow>40, red<=40

    Reasons list (white card):
      Title: "Factores considerados"
      Each reason: <CheckCircle className="text-green-500"/> or 
                   <XCircle className="text-red-500"/> + text
      Show green checks for positive, red X for risk factors

  Advice box (border-l-4 border-[#F5A623] bg-[#FFF8E7] p-4 rounded-xl):
    <Lightbulb className="text-[#F5A623]"/> "Consejo de FinConfia"
    advice text in #1B3A6B

  Alternative box (only if not APROBADO):
    Dashed border-2 border-[#F5A623] rounded-xl p-4
    <RefreshCw className="text-[#F5A623]"/> "Alternativa sugerida"
    alternative text gray

---

## SCREEN 8 — BankReport.jsx

Sidebar + main content:

EMPTY STATE (when no report generated):
  Centered card (max-w-lg mx-auto mt-16):
    SVG illustration: clipboard with checkmarks outline (white strokes on blue bg circle)
    "Genera tu reporte financiero" Sora 700
    "Un resumen ejecutivo de tu situación para el banco" DM Sans gray
    [Generar Reporte con IA →] gold button large
      Loading: spinner + "Analizando tu perfil..."

REPORT CARD (after generation, animate fadeIn):

  Call askClaude() on button click:
    system: "Eres analista de riesgo de un banco colombiano.
             Genera reporte ejecutivo para uso interno del banco.
             Responde SOLO con JSON válido sin markdown:
             {\"resumen_ejecutivo\":\"...\",
              \"nivel_riesgo\":\"BAJO|MEDIO|ALTO\",
              \"score_pago\":number,
              \"fortalezas\":[\"...\"],
              \"alertas\":[\"...\"],
              \"recomendacion_banco\":\"...\",
              \"proyeccion_6_meses\":\"...\"}"
    user: "Genera el reporte para: " + buildClientSummary(user)

  Official header (bg-[#1B3A6B] text-white rounded-t-2xl p-6):
    <Logo light size="sm"/> left
    Right: "REPORTE INTERNO" badge (gold bg blue text rounded-full)
           Date + "Confidencial"
    Below: client name Sora 700 white + occupation DM Sans white/70

  Risk badge (full width p-4 text-center):
    BAJO:  bg-green-100 border-b-4 border-green-400 text-green-700
    MEDIO: bg-yellow-100 border-b-4 border-yellow-400 text-yellow-700
    ALTO:  bg-red-100 border-b-4 border-red-400 text-red-700
    Large icon + "RIESGO {nivel}" Sora 800 text-2xl

  Score section (white p-6):
    "Probabilidad de pago exitoso"
    Progress bar (animated on mount):
      track bg-gray-100 h-4 rounded-full
      fill colored (green/yellow/red) animated width transition 1s
    Right: score number Sora 800 text-2xl

  Grid (grid grid-cols-2 gap-0 border-t):
    Fortalezas (p-6 border-r):
      Title: <CheckCircle className="text-green-500"/> "Fortalezas"
      Each: green dot + text DM Sans
    Alertas (p-6):
      Title: <AlertTriangle className="text-yellow-500"/> "Alertas"
      Each: yellow dot + text DM Sans
      Empty alertas: <Shield className="text-green-500"/> "Sin alertas"

  Recommendation (bg-[#1B3A6B] text-white p-6):
    <Building2 className="text-[#F5A623]"/> "Recomendación del banco"
    recommendation text DM Sans white

  Projection (dashed border-2 border-[#F5A623] bg-[#FFF8E7] p-6 rounded-b-2xl):
    <TrendingUp className="text-[#F5A623]"/> "Proyección a 6 meses"
    projection text italic DM Sans #1B3A6B

  Actions (flex gap-4 mt-4):
    [Regenerar reporte] outline button
    [Descargar PDF] primary blue button → window.print()

---

## SCREEN 9 — Profile.jsx

Sidebar + main content (2-column grid):

LEFT COLUMN:
  Avatar card (white rounded-2xl p-8 text-center):
    Avatar circle 96px (bg-[#1B3A6B] text-white Sora 700 text-3xl — initials)
    Gold ring border-4 border-[#F5A623]
    Name Sora 700 text-xl mt-4
    Occupation + city DM Sans gray
    Score pill (getScoreLabel badge) mt-2

  Savings calculator card (white rounded-2xl p-6 mt-4):
    Title: <Target/> "Calculadora de metas" Sora 700
    Subtitle: "¿Cuánto necesito ahorrar?"
    
    Two inputs:
      <DollarSign/> Meta en COP (number)
      <Calendar/> Plazo (months, 1–60)
    
    [Calcular con IA] gold button
    
    Result card (bg-[#FFF8E7] border-l-4 border-[#F5A623] p-4 rounded-xl):
      Shows Claude's savings plan response
      Loading skeleton while waiting

RIGHT COLUMN:
  Personal info card (white rounded-2xl p-6):
    Header row: "Mi información" Sora 700 + [Editar <Pencil/>] gold small button
    
    View mode: each field as row (border-b):
      Icon gray + label gray tiny uppercase + value DM Sans #1B3A6B
    
    Edit mode (toggle on Editar click):
      All fields become inputs
      Save button gold + Cancel outline
      On save: updateProfile() + setUser() + show success toast

  Financial info card (white rounded-2xl p-6 mt-4):
    Same pattern: view/edit mode
    Fields: income, fixedExpenses, variableExpenses, credits
    On save: recalculate score in real time

  Goals card (white rounded-2xl p-6 mt-4):
    Current goals as gold chips with <X/> to remove
    [+ Agregar meta] outlined dashed button
    → shows goal grid same as register step 3

  Settings card (white rounded-2xl p-6 mt-4):
    Toggle rows:
      <Bell/> Notificaciones push
      <Mail/> Correos del banco
      Each: label left + custom toggle switch right (blue when on)

  Danger zone (mt-4):
    [Cerrar sesión] outlined red button full width
    onClick: logout() + navigate('/')

---

## ROOT PACKAGE.JSON

```json
{
  "name": "finconfia",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "dev:server": "node server/index.js",
    "dev:all": "concurrently \"npm run dev\" \"npm run dev:server\""
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "recharts": "^2.12.0",
    "lucide-react": "^0.383.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.17",
    "concurrently": "^8.2.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.1.0"
  }
}
```

---

## TAILWIND CONFIG

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif']
      },
      colors: {
        brand: { blue: '#1B3A6B', mid: '#2D5FA6', light: '#EEF4FF' },
        gold: { DEFAULT: '#F5A623', light: '#FFF8E7' }
      }
    }
  }
}
```

---

## INDEX.CSS

```css
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

* { font-family: 'DM Sans', sans-serif; }
h1, h2, h3, .font-display { font-family: 'Sora', sans-serif; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUp { animation: fadeInUp 300ms ease-out forwards; }

@keyframes dotBounce {
  0%, 80%, 100% { transform: translateY(0); }
  40%            { transform: translateY(-8px); }
}
.dot-1 { animation: dotBounce 1.2s infinite 0ms; }
.dot-2 { animation: dotBounce 1.2s infinite 150ms; }
.dot-3 { animation: dotBounce 1.2s infinite 300ms; }
```

---

## APP.JSX ROUTING

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Splash from './screens/Splash'
import Login from './screens/Login'
import Register from './screens/Register'
import Welcome from './screens/Welcome'
import Dashboard from './screens/Dashboard'
import AIAdvisor from './screens/AIAdvisor'
import CreditAnalyzer from './screens/CreditAnalyzer'
import BankReport from './screens/BankReport'
import Profile from './screens/Profile'

const Protected = ({ children }) => {
  const { user } = useApp()
  return user ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<Splash />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/welcome"   element={<Welcome />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/advisor"   element={<Protected><AIAdvisor /></Protected>} />
          <Route path="/credits"   element={<Protected><CreditAnalyzer /></Protected>} />
          <Route path="/reports"   element={<Protected><BankReport /></Protected>} />
          <Route path="/profile"   element={<Protected><Profile /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
```

---

## FINAL INSTRUCTIONS

1. Generate EVERY FILE completely. Zero placeholders. Zero TODOs.
2. Every screen must be visually polished from the first render.
3. The Logo component must render "FinConfia" — never "FinC.ia" or broken.
4. Auth is 100% localStorage — never call any auth backend.
5. AI calls go through localhost:3001 ONLY — never call Anthropic from the browser.
6. All error messages must be user-friendly in Spanish — never show raw errors.
7. Demo rápida button must work instantly without any form filling.
8. The app must start with two commands:
   Terminal 1: cd server && npm install && node index.js
   Terminal 2: npm install && npm run dev
9. On first load with no users: show splash with both login and register options.
10. Mobile responsive: sidebar becomes bottom nav below 768px.
11. Use Sora font for all headings and large numbers.
12. Use DM Sans for all body text and labels.
13. Never use emojis anywhere — use lucide-react icons exclusively.
14. Every Claude API call must show a skeleton/spinner loading state.
15. Every Claude API call must handle errors gracefully in Spanish.
```

---

**SETUP COMMANDS (include in README.md in Spanish):**
```bash
# 1. Instalar dependencias del frontend
npm install

# 2. Instalar dependencias del backend
cd server && npm install && cd ..

# 3. Agregar tu API key de Anthropic
# Editar server/.env y poner: ANTHROPIC_API_KEY=sk-ant-...

# 4. Iniciar todo con un solo comando
npm run dev:all

# El frontend corre en: http://localhost:5173
# El backend corre en:  http://localhost:3001
```
