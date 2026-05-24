import { Brain, Loader2, MessageSquare, MoreVertical, Plus, Send } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AppShell from '../components/AppShell'
import AddExpenseModal from '../components/AddExpenseModal'
import ExpenseConfirmationPill from '../components/ExpenseConfirmationPill'
import ExpenseSummaryCard from '../components/ExpenseSummaryCard'
import ProductCard from '../components/ProductCard'
import { useApp } from '../context/AppContext'
import { detectCategory, expenseCategories } from '../data/expenseCategories'
import { serfinanzaKnowledge } from '../data/serfinanzaKnowledge'
import { serfinanzaProducts } from '../data/serfinanzaProducts'
import { addExpense, deleteExpense, dismissCategory, getCurrentMonth, getDismissed, getTotalByCategory, getTotalByMonth } from '../services/expenseService'
import { askClaude } from '../services/claudeService'
import { buildMemoryContext, buildTimeContext, deleteMemory, getPendingMemories, resolveMemory, saveMemory, updateLastSeen } from '../services/memoryService'
import { buildClientSummary } from '../utils/finance'
import { getProductRecommendationPrompt } from '../utils/productRecommender'

const KEY = 'finconfia_chat_history'
const priorityOrder = ['arriendo', 'mercado', 'servicios', 'transporte', 'salud', 'comunicacion', 'entretenimiento', 'creditos']

const monthLabel = (month) => {
  const [y, m] = month.split('-').map(Number)
  const names = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  return `${names[m - 1]} ${y}`
}

const getCurrentMonthName = () => {
  const d = new Date()
  const names = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  return `${names[d.getMonth()]} ${d.getFullYear()}`
}

const buildProactiveContext = (user) => {
  const month = getCurrentMonth()
  const byCategory = getTotalByCategory(user.id, month)
  const total = getTotalByMonth(user.id, month)
  const income = user.income || 0
  const dismissed = getDismissed(user.id)
  const registeredIds = Object.keys(byCategory)
  const registered = registeredIds.map((id) => expenseCategories.find((c) => c.id === id)?.label || id)
  const pending = priorityOrder
    .filter((id) => !registeredIds.includes(id) && !dismissed.includes(id))
    .map((id) => expenseCategories.find((c) => c.id === id)?.label)
    .filter(Boolean)
  const percentage = income > 0 ? Math.round((total / income) * 100) : 0

  return {
    registeredCategories: registered.join(', ') || 'Ninguna aun',
    pendingCategories: pending.slice(0, 3).join(', ') || 'Ninguna',
    dismissedCategories: dismissed.map((id) => expenseCategories.find((c) => c.id === id)?.label || id).join(', ') || 'Ninguna',
    totalRegistered: `$${total.toLocaleString('es-CO')}`,
    income: `$${income.toLocaleString('es-CO')}`,
    percentage: `${percentage}%`,
    pending
  }
}

const getDynamicChips = (user) => {
  if (!user) return []
  const context = buildProactiveContext(user)
  const pending = context.pending
  const chips = ['Cuanto llevo gastado este mes?', 'En que estoy gastando mas?']
  if (pending[0]) chips.push(`Agregar gasto de ${pending[0].toLowerCase()}`)
  if (pending[1]) chips.push(`Agregar gasto de ${pending[1].toLowerCase()}`)
  chips.push('Dame un consejo para ahorrar mas')
  return chips.slice(0, 5)
}

const buildExpenseSummary = (userId) => {
  const month = getCurrentMonth()
  const total = getTotalByMonth(userId, month)
  const byCategory = getTotalByCategory(userId, month)
  if (total === 0) return 'El usuario aun no ha registrado gastos este mes.'
  const lines = Object.entries(byCategory).map(([catId, amount]) => {
    const cat = expenseCategories.find((c) => c.id === catId)
    const pct = Math.round((amount / total) * 100)
    return `  - ${cat?.label || catId}: $${amount.toLocaleString('es-CO')} (${pct}%)`
  }).join('\n')
  return `Gastos registrados este mes: $${total.toLocaleString('es-CO')}\nDesglose:\n${lines}`
}

const buildFullSystemPrompt = (user) => {
  const proactive = buildProactiveContext(user)
  return `
Eres FinConfia, un asesor financiero empatico y experto en finanzas personales colombianas. Hablas en espanol colombiano, de forma calida y clara.

PERFIL DEL CLIENTE:
${buildClientSummary(user)}

${buildTimeContext(user.id)}

${buildMemoryContext(user.id)}

GASTOS REGISTRADOS ESTE MES:
${buildExpenseSummary(user.id)}

COMPORTAMIENTO PROACTIVO - GASTOS:
CATEGORIAS YA REGISTRADAS ESTE MES: ${proactive.registeredCategories}
CATEGORIAS PENDIENTES DE PREGUNTAR: ${proactive.pendingCategories}
CATEGORIAS QUE EL USUARIO INDICO QUE NO TIENE: ${proactive.dismissedCategories}
TOTAL REGISTRADO: ${proactive.totalRegistered} de ${proactive.income} de ingreso (${proactive.percentage})

PRODUCTOS RECOMENDADOS PARA ESTE CLIENTE:
${getProductRecommendationPrompt(user)}

BASE DE CONOCIMIENTO BANCO SERFINANZA:
${serfinanzaKnowledge}

DETECCION DE MEMORIAS - REGLAS ESTRICTAS:
SOLO guarda una memoria si cumple LAS TRES condiciones:
1) Es algo concreto y especifico
2) Tiene un seguimiento logico en el futuro
3) Impacta directamente las finanzas del usuario

SI GUARDAR:
- Pendientes con monto o producto especifico
- Metas con cifra o plazo
- Compromisos financieros concretos
- Eventos que cambian ingresos o gastos

NO GUARDAR:
- Emociones o estados de animo
- Cosas ya resueltas en el mismo mensaje
- Informacion que ya esta en el perfil
- Comentarios generales sin accion
- Planes muy vagos sin cifra ni plazo

LIMITE: maximo 10 memorias activas por usuario. Si ya hay 10, solo guarda una nueva si es mas importante que la mas antigua (reemplazala).
DURACION AUTOMATICA:
- pendiente: 30 dias
- meta: 90 dias
- compromiso: 21 dias
- problema: 14 dias
- evento: 7 dias despues de la fecha estimada

Si decides guardar memoria, usa:
[GUARDAR_MEMORIA:{"type":"pendiente|meta|problema|compromiso|evento","text":"texto corto","followUpDays":N}]
Si el usuario confirma que resolvio algo, usa:
[RESOLVER_MEMORIA:ID]

DETECCION DE GASTOS:
Si detectas gasto con monto, agrega:
[GASTO_DETECTADO:{"categoria":"mercado","monto":350000,"descripcion":"Mercado"}]
Si pregunta cuanto lleva gastado, agrega:
[MOSTRAR_GASTOS]

REGLAS:
- Tags nunca visibles al usuario
- Maximo 3 parrafos cortos
- Termina con una pregunta de seguimiento
`
}

const parseAIResponse = (text, user) => {
  const memoryMatches = [...text.matchAll(/\[GUARDAR_MEMORIA:({[^\]]+})\]/g)]
  const newMemories = []
  memoryMatches.forEach((match) => {
    try {
      const data = JSON.parse(match[1])
      const pending = getPendingMemories(user.id)
      if (pending.length >= 10) {
        const oldest = pending.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0]
        deleteMemory(user.id, oldest.id)
      }
      const saved = saveMemory(user.id, data)
      newMemories.push(saved)
    } catch {}
  })

  const resolveMatches = [...text.matchAll(/\[RESOLVER_MEMORIA:(\d+)\]/g)]
  resolveMatches.forEach((match) => resolveMemory(user.id, parseInt(match[1], 10)))

  const prodMatch = text.match(/\[RECOMENDAR_PRODUCTO:([^\]]+)\]/)
  const productId = prodMatch ? prodMatch[1] : null
  const product = productId ? serfinanzaProducts.find((p) => p.id === productId) : null

  const expenseMatch = text.match(/\[GASTO_DETECTADO:({[^\]]+})\]/)
  let detectedExpense = null
  if (expenseMatch) {
    try {
      const data = JSON.parse(expenseMatch[1])
      const category = expenseCategories.find((c) => c.id === data.categoria) || detectCategory(data.descripcion)
      detectedExpense = { categoryId: category.id, categoryLabel: category.label, amount: Number(data.monto), description: data.descripcion, color: category.color, icon: category.icon }
    } catch {}
  }

  const showExpenses = text.includes('[MOSTRAR_GASTOS]')
  const cleanText = text
    .replace(/\[GUARDAR_MEMORIA:[^\]]+\]/g, '')
    .replace(/\[RESOLVER_MEMORIA:\d+\]/g, '')
    .replace(/\[GASTO_DETECTADO:[^\]]+\]/g, '')
    .replace(/\[MOSTRAR_GASTOS\]/g, '')
    .replace(/\[RECOMENDAR_PRODUCTO:[^\]]+\]/g, '')
    .trim()

  return { cleanText, newMemories, detectedExpense, showExpenses, product }
}

export default function AIAdvisor() {
  const { user } = useApp()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sessions, setSessions] = useState(JSON.parse(localStorage.getItem(KEY) || '[]'))
  const [openAddExpense, setOpenAddExpense] = useState(false)
  const chips = useMemo(() => (user ? getDynamicChips(user) : []), [user, messages.length])

  useEffect(() => {
    if (!user || messages.length) return
    const currentMonth = getCurrentMonth()
    const lastMonthKey = `finconfia_last_month_${user.id}`
    const lastMonth = localStorage.getItem(lastMonthKey)

    if (lastMonth && lastMonth !== currentMonth) {
      const lastMonthTotal = getTotalByMonth(user.id, lastMonth)
      const autoMsg = {
        role: 'assistant',
        content: `Hola ${user.name}! Arrancamos ${getCurrentMonthName()}. El mes pasado registraste $${lastMonthTotal.toLocaleString('es-CO')} en gastos. Empezamos a llevar el registro de este mes? Ya pagaste el arriendo?`,
        isAutomatic: true,
        ts: new Date().toISOString()
      }
      setMessages([autoMsg])
      persistSession([autoMsg])
    } else {
      sendMessage('Saluda al cliente por su nombre y dale 1 insight especifico sobre su situacion financiera basado en sus numeros reales. Se calido y motivador. Maximo 3 oraciones.', true)
    }

    localStorage.setItem(lastMonthKey, currentMonth)
  }, [user])

  const persistSession = (next) => {
    const all = JSON.parse(localStorage.getItem(KEY) || '[]')
    const payload = [{ id: Date.now(), createdAt: new Date().toISOString(), messages: next }, ...all]
    localStorage.setItem(KEY, JSON.stringify(payload.slice(0, 15)))
    setSessions(payload.slice(0, 15))
  }

  const buildSummaryCard = () => {
    const month = getCurrentMonth()
    const total = getTotalByMonth(user.id, month)
    const byCategory = getTotalByCategory(user.id, month)
    const rows = Object.entries(byCategory).map(([id, amount]) => {
      const cat = expenseCategories.find((c) => c.id === id) || expenseCategories.find((c) => c.id === 'otros')
      return { id, label: cat.label, icon: cat.icon, color: cat.color, amount, pct: total > 0 ? Math.round((amount / total) * 100) : 0 }
    })
    return { monthLabel: monthLabel(month), total, rows }
  }

  const maybeDismissCategory = (userText) => {
    const lower = userText.toLowerCase()
    const negative = ['no tengo', 'no pago', 'no gasto', 'nada en', 'ningun']
    if (!negative.some((n) => lower.includes(n))) return
    const cat = detectCategory(userText)
    if (cat && cat.id !== 'otros') dismissCategory(user.id, cat.id)
  }

  const maybeForgetMemory = (userText) => {
    const lower = userText.toLowerCase()
    if (!lower.includes('olvida eso') && !lower.includes('no recuerdes eso')) return
    const pending = getPendingMemories(user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (pending[0]) deleteMemory(user.id, pending[0].id)
  }

  const sendMessage = async (text = input, silentUser = false) => {
    if (!text.trim()) return
    if (!silentUser) {
      maybeDismissCategory(text)
      maybeForgetMemory(text)
    }

    const userMsg = { role: 'user', content: text, ts: new Date().toISOString() }
    const next = silentUser ? messages : [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      updateLastSeen(user.id)
      const systemPrompt = buildFullSystemPrompt(user)
      const reply = await askClaude(systemPrompt, text, next.map((m) => ({ role: m.role, content: m.content })))
      const parsed = parseAIResponse(reply, user)

      let savedExpense = null
      if (parsed.detectedExpense && parsed.detectedExpense.amount > 0) savedExpense = addExpense(user.id, parsed.detectedExpense)
      const summary = parsed.showExpenses ? buildSummaryCard() : null

      const withAi = [...next, {
        role: 'assistant',
        content: parsed.cleanText,
        product: parsed.product || null,
        savedExpense,
        showExpenses: parsed.showExpenses,
        expenseSummary: summary,
        memorySaved: parsed.newMemories.length > 0,
        ts: new Date().toISOString()
      }]
      setMessages(withAi)
      persistSession(withAi)
    } catch (err) {
      const msg = err.message.includes('fetch') ? 'No se pudo conectar. Esta corriendo el servidor?' : err.message.includes('401') ? 'Clave API invalida. Contacta soporte.' : err.message.includes('429') ? 'Demasiadas solicitudes. Espera un momento.' : 'No pudimos responder en este momento.'
      setMessages([...next, { role: 'assistant', content: msg, error: true, ts: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePill = (msgTs, expenseId) => {
    deleteExpense(user.id, expenseId)
    const updated = messages.map((m) => (m.ts === msgTs ? { ...m, savedExpense: null } : m))
    setMessages(updated)
    persistSession(updated)
  }

  const handleManualExpense = (expense) => {
    const saved = addExpense(user.id, expense)
    const botMsg = {
      role: 'assistant',
      content: `Anotado. Registre ${saved.description} por $${saved.amount.toLocaleString('es-CO')}.`,
      savedExpense: saved,
      ts: new Date().toISOString()
    }
    const next = [...messages, botMsg]
    setMessages(next)
    persistSession(next)
  }

  return <AppShell>
    <AddExpenseModal open={openAddExpense} onClose={() => setOpenAddExpense(false)} onSave={handleManualExpense} />
    <div className="grid lg:grid-cols-[1fr_288px] gap-4 h-[calc(100vh-120px)]">
      <section className="bg-white rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#1B3A6B] text-white grid place-items-center font-sora">FC</div><div><p className="font-sora">FinConfia</p><p className="text-xs text-green-600">En linea</p></div></div><MoreVertical size={18} /></div>
        <div className="flex-1 p-4 bg-slate-100 overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[75%] ${m.role === 'user' ? 'ml-auto' : ''}`}>
              <div className={`${m.role === 'user' ? 'bg-[#1B3A6B] text-white rounded-2xl rounded-tr-none' : `bg-white text-[#1B3A6B] rounded-2xl rounded-tl-none border-l-4 ${m.error ? 'border-red-400' : 'border-[#F5A623]'}`} px-4 py-3`}>
                <p>{m.content}</p>
                {m.savedExpense && <ExpenseConfirmationPill expense={m.savedExpense} onDelete={() => handleDeletePill(m.ts, m.savedExpense.id)} />}
                {m.role === 'assistant' && m.product && <div className="mt-3"><ProductCard product={m.product} compact /></div>}
                {m.showExpenses && m.expenseSummary && <ExpenseSummaryCard monthLabel={m.expenseSummary.monthLabel} total={m.expenseSummary.total} rows={m.expenseSummary.rows} />}
                {m.memorySaved && <div className="mt-2 inline-flex items-center gap-1 text-[11px] italic text-slate-400 animate-fadeInUp"><Brain size={12} />Recordare esto</div>}
              </div>
            </div>
          ))}
          {loading && <div className="bg-white rounded-2xl border-l-4 border-[#F5A623] px-4 py-3 inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#F5A623] dot-1" /><span className="w-2 h-2 rounded-full bg-[#F5A623] dot-2" /><span className="w-2 h-2 rounded-full bg-[#F5A623] dot-3" /></div>}
        </div>
        <div className="p-3 bg-white border-t overflow-x-auto hide-scrollbar"><div className="flex gap-2">{chips.map((c) => <button key={c} onClick={() => sendMessage(c)} className="whitespace-nowrap border border-[#F5A623] rounded-full px-4 py-2 text-sm">{c}</button>)}</div></div>
        <div className="p-4 border-t bg-white space-y-2">
          <button onClick={() => setOpenAddExpense(true)} className="inline-flex items-center gap-1 text-xs border border-[#F5A623] text-[#1B3A6B] rounded-full px-3 py-1.5"><Plus size={12} /> Agregar gasto</button>
          <div className="flex gap-2"><input className="flex-1 bg-[#EEF4FF] rounded-full px-4 py-3" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Escribele a FinConfia..." /><button onClick={() => sendMessage()} className="w-12 h-12 rounded-full bg-[#F5A623] text-[#1B3A6B] grid place-items-center"><Send size={18} /></button></div>
        </div>
      </section>
      <aside className="bg-white rounded-2xl border overflow-hidden hidden lg:block"><h3 className="p-4 border-b font-sora">Conversaciones</h3><div className="p-2 space-y-2">{sessions.length === 0 ? <div className="text-center text-slate-500 py-8"><MessageSquare className="mx-auto mb-2" />Aun no hay conversaciones anteriores</div> : sessions.map((s) => <button key={s.id} className="w-full text-left p-3 rounded-xl hover:bg-slate-100" onClick={() => setMessages(s.messages)}><p className="text-xs text-slate-500">{new Date(s.createdAt).toLocaleString('es-CO')}</p><p className="truncate">{s.messages?.[0]?.content || 'Conversacion'}</p></button>)}</div></aside>
    </div>
  </AppShell>
}
