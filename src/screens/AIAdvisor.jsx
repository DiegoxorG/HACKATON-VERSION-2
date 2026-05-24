import { Loader2, MessageSquare, MoreVertical, Send } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AppShell from '../components/AppShell'
import { useApp } from '../context/AppContext'
import { serfinanzaKnowledge } from '../data/serfinanzaKnowledge'
import { askClaude } from '../services/claudeService'
import { buildClientSummary } from '../utils/finance'

const KEY = 'finconfia_chat_history'
const chips = ['Puedo pagar mis deudas mas rapido?', 'Cuanto debo ahorrar al mes?', 'Conviene sacar un credito ahora?', 'Como mejoro mi historial crediticio?']

export default function AIAdvisor() {
  const { user } = useApp()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sessions, setSessions] = useState(JSON.parse(localStorage.getItem(KEY) || '[]'))
  const systemPrompt = useMemo(() => `Eres FinConfia, un asesor financiero empatetico experto en finanzas personales colombianas. Hablas en espanol colombiano y terminas con una pregunta de seguimiento.

Perfil del cliente:
${buildClientSummary(user)}

=== BASE DE CONOCIMIENTO BANCO SERFINANZA ===
${serfinanzaKnowledge}

Cuando el cliente pregunte sobre productos, procesos o canales de Serfinanza,
usa SIEMPRE esta base de conocimiento para dar respuestas precisas y actualizadas.
Si la pregunta es sobre un producto específico, menciona tasas, requisitos y 
canales concretos. Si no sabes algo, di que puede contactar al 01 8000 123 456.
`, [user])

  useEffect(() => {
    if (!user) return
    if (messages.length) return
    sendMessage('Saluda al cliente por su nombre y dale 1 insight especifico sobre su situacion financiera basado en sus numeros reales. Se calido y motivador. Maximo 3 oraciones.', true)
  }, [user])

  const persistSession = (next) => {
    const all = JSON.parse(localStorage.getItem(KEY) || '[]')
    const payload = [{ id: Date.now(), createdAt: new Date().toISOString(), messages: next }, ...all]
    localStorage.setItem(KEY, JSON.stringify(payload.slice(0, 15)))
    setSessions(payload.slice(0, 15))
  }

  const sendMessage = async (text = input, silentUser = false) => {
    if (!text.trim()) return
    const userMsg = { role: 'user', content: text, ts: new Date().toISOString() }
    const next = silentUser ? messages : [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const reply = await askClaude(systemPrompt, text, next.map((m) => ({ role: m.role, content: m.content })))
      const withAi = [...next, { role: 'assistant', content: reply, ts: new Date().toISOString() }]
      setMessages(withAi)
      persistSession(withAi)
    } catch (err) {
      const msg = err.message.includes('fetch') ? 'No se pudo conectar. Esta corriendo el servidor?' : err.message.includes('401') ? 'Clave API invalida. Contacta soporte.' : err.message.includes('429') ? 'Demasiadas solicitudes. Espera un momento.' : 'No pudimos responder en este momento.'
      setMessages([...next, { role: 'assistant', content: msg, error: true, ts: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  return <AppShell>
    <div className="grid lg:grid-cols-[1fr_288px] gap-4 h-[calc(100vh-120px)]">
      <section className="bg-white rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#1B3A6B] text-white grid place-items-center font-sora">FC</div><div><p className="font-sora">FinConfia</p><p className="text-xs text-green-600">En linea</p></div></div><MoreVertical size={18} /></div>
        <div className="flex-1 p-4 bg-slate-100 overflow-y-auto space-y-3">{messages.map((m, i) => <div key={i} className={`max-w-[75%] ${m.role === 'user' ? 'ml-auto' : ''}`}><div className={`${m.role === 'user' ? 'bg-[#1B3A6B] text-white rounded-2xl rounded-tr-none' : `bg-white text-[#1B3A6B] rounded-2xl rounded-tl-none border-l-4 ${m.error ? 'border-red-400' : 'border-[#F5A623]'}`} px-4 py-3`}>{m.content}</div></div>)}{loading && <div className="bg-white rounded-2xl border-l-4 border-[#F5A623] px-4 py-3 inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#F5A623] dot-1" /><span className="w-2 h-2 rounded-full bg-[#F5A623] dot-2" /><span className="w-2 h-2 rounded-full bg-[#F5A623] dot-3" /></div>}</div>
        <div className="p-3 bg-white border-t overflow-x-auto hide-scrollbar"><div className="flex gap-2">{chips.map((c) => <button key={c} onClick={() => sendMessage(c)} className="whitespace-nowrap border border-[#F5A623] rounded-full px-4 py-2 text-sm">{c}</button>)}</div></div>
        <div className="p-4 border-t bg-white flex gap-2"><input className="flex-1 bg-[#EEF4FF] rounded-full px-4 py-3" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Escribele a FinConfia..." /><button onClick={() => sendMessage()} className="w-12 h-12 rounded-full bg-[#F5A623] text-[#1B3A6B] grid place-items-center"><Send size={18} /></button></div>
      </section>
      <aside className="bg-white rounded-2xl border overflow-hidden hidden lg:block"><h3 className="p-4 border-b font-sora">Conversaciones</h3><div className="p-2 space-y-2">{sessions.length === 0 ? <div className="text-center text-slate-500 py-8"><MessageSquare className="mx-auto mb-2" />Aun no hay conversaciones anteriores</div> : sessions.map((s) => <button key={s.id} className="w-full text-left p-3 rounded-xl hover:bg-slate-100" onClick={() => setMessages(s.messages)}><p className="text-xs text-slate-500">{new Date(s.createdAt).toLocaleString('es-CO')}</p><p className="truncate">{s.messages?.[0]?.content || 'Conversacion'}</p></button>)}</div></aside>
    </div>
  </AppShell>
}
