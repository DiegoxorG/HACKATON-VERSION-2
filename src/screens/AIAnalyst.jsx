import { Loader2, MessageSquare, Send, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AdminShell from '../components/AdminShell'
import { useAdmin } from '../context/AdminContext'
import { serfinanzaProducts } from '../data/serfinanzaProducts'
import { askClaude } from '../services/claudeService'
import { buildClientSummary, buildPortfolioSummary } from '../utils/adminFinance'

const CHATS_KEY = 'finia_admin_chats'
const productCatalogText = serfinanzaProducts.map((p) => {
  const requisitos = (p.requisitos || []).join('; ')
  const idealFor = (p.idealFor || []).join(', ')
  return `- ${p.name} (${p.category}) | cupo: ${p.cupo} | tasa: ${p.tasa} | minIncome: ${p.minIncome ?? 'N/A'} | ideal para: ${idealFor} | requisitos: ${requisitos}`
}).join('\n')

export default function AIAnalyst() {
  const [searchParams] = useSearchParams()
  const { clients, getClientById } = useAdmin()

  const clientId = searchParams.get('client')
  const selectedClient = clientId ? getClientById(clientId) : null

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [scope] = useState(clientId ? 'client' : 'portfolio')
  const [chats, setChats] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem(CHATS_KEY)
    if (saved) setChats(JSON.parse(saved))
  }, [])

  const systemPrompt = `Eres FinIA Analyst, un asistente de inteligencia financiera disenado para asesores bancarios de Serfinanza Colombia.

Tu rol es ayudar al asesor a:
1. Entender el estado financiero de sus clientes
2. Identificar clientes en riesgo antes de que entren en mora
3. Priorizar acciones: a quien llamar, que producto ofrecer, como abordar una conversacion
4. Detectar patrones en el portafolio
5. Generar argumentos solidos para presentar a clientes o superiores

CONTEXTO DEL PORTAFOLIO:
${buildPortfolioSummary(clients)}

${selectedClient ? `CLIENTE EN FOCO:
${buildClientSummary(selectedClient)}` : ''}

CATALOGO DE PRODUCTOS SERFINANZA:
${productCatalogText}

REGLAS:
- Se directo y ejecutivo. El asesor no tiene tiempo.
- Usa terminos financieros pero explica cuando sea necesario.
- Si detectas algo urgente, dilo primero.
- Propon acciones concretas: "Llama a X porque Y. Sugiere Z."
- No inventes datos que no esten en el contexto.
- Cuando recomiendes productos, menciona solo productos del catalogo anterior.
- Si preguntan "que vender" o "que ofrecer", devuelve 2-3 productos con:
  1) Nombre exacto del producto
  2) Por que aplica al cliente
  3) Requisito clave a validar (ingreso, historial, etc.)
- Responde siempre en espanol colombiano profesional.`

  const quickQuestions = [
    'Quienes tienen mayor riesgo de mora este mes?',
    'Que clientes debo contactar esta semana?',
    'Hay patrones preocupantes en el portafolio?',
    clientId ? `Resume el estado de ${selectedClient?.name}` : 'Cual es el perfil tipico de mi portafolio?'
  ]

  const sendMessage = async (text = input) => {
    if (!text.trim()) return

    const userMsg = { role: 'user', content: text, ts: new Date().toISOString() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const response = await askClaude(
        systemPrompt,
        text,
        next.map((m) => ({ role: m.role, content: m.content }))
      )

      const aiMsg = { role: 'assistant', content: response, ts: new Date().toISOString() }
      const final = [...next, aiMsg]
      setMessages(final)

      const chat = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        scope,
        clientId,
        messages: final,
        preview: text.substring(0, 50)
      }
      const updated = [chat, ...chats].slice(0, 10)
      setChats(updated)
      localStorage.setItem(CHATS_KEY, JSON.stringify(updated))
    } catch (err) {
      const msg = err.message.includes('fetch')
        ? 'No se pudo conectar con el backend. Verifica que este corriendo en http://localhost:8000.'
        : err.message.includes('401')
        ? 'API key invalida o no configurada. Revisa ANTHROPIC_API_KEY en backend/.env.'
        : err.message.includes('429')
        ? 'Demasiadas solicitudes. Intenta de nuevo en un momento.'
        : 'No pudimos procesar tu pregunta en este momento.'
      setMessages([...next, { role: 'assistant', content: msg, error: true, ts: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminShell>
      <div className="grid lg:grid-cols-[1fr_280px] gap-4 h-[calc(100vh-120px)]">
        <section className="bg-[#1e293b] rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#334155] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1a56db] to-[#0e9f6e] text-white grid place-items-center font-bold">
                AI
              </div>
              <div>
                <p className="font-semibold text-white">FinIA Analyst</p>
                <p className="text-xs text-[#0e9f6e]">En linea</p>
              </div>
            </div>
            {selectedClient && (
              <span className="text-xs bg-[#0e9f6e]/20 text-[#0e9f6e] px-2 py-1 rounded">
                {selectedClient.name}
              </span>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0f172a]">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <MessageSquare size={40} className="mx-auto mb-3 text-[#334155]" />
                  <p className="text-[#94a3b8]">Inicia una conversacion</p>
                  <p className="text-sm text-[#64748b] mt-1">Pregunta sobre clientes, patrones o recomendaciones</p>
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-lg ${
                      m.role === 'user'
                        ? 'bg-[#1a56db] text-white rounded-br-none'
                        : `bg-[#334155] text-[#f1f5f9] rounded-bl-none ${m.error ? 'border-l-2 border-red-500' : ''}`
                    }`}
                  >
                    <p className="text-sm">{m.content}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#334155] px-4 py-3 rounded-lg rounded-bl-none inline-flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0e9f6e] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#0e9f6e] animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-2 h-2 rounded-full bg-[#0e9f6e] animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            )}
          </div>

          {messages.length === 0 && (
            <div className="p-4 bg-[#1e293b] border-t border-[#334155] overflow-x-auto">
              <div className="flex gap-2 flex-nowrap">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="whitespace-nowrap px-3 py-1 text-xs bg-[#334155] text-[#f1f5f9] rounded-full hover:bg-[#1a56db] transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-[#1e293b] border-t border-[#334155] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Pregunta sobre clientes, patrones o recomendaciones..."
              className="flex-1 bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-[#f1f5f9] placeholder-[#64748b] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a56db]"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-lg bg-[#0e9f6e] text-white grid place-items-center hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </section>

        <aside className="bg-[#1e293b] rounded-lg border border-[#334155] overflow-hidden hidden lg:flex flex-col">
          <div className="p-4 border-b border-[#334155] flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">Historial</h3>
            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([])
                  setInput('')
                }}
                className="text-[#64748b] hover:text-red-400 transition"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {chats.length === 0 ? (
              <p className="text-xs text-[#64748b] text-center py-4">Sin historial</p>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setMessages(chat.messages)}
                  className="w-full text-left p-2 rounded hover:bg-[#334155] transition"
                >
                  <p className="text-xs text-[#94a3b8] truncate">{chat.preview}</p>
                  <p className="text-[9px] text-[#64748b]">
                    {new Date(chat.createdAt).toLocaleString('es-CO')}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>
      </div>
    </AdminShell>
  )
}
