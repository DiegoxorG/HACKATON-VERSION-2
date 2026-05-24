import { AlertCircle, Brain, Calendar, Check, CheckSquare, Clock, Target, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { useApp } from '../context/AppContext'
import { askClaude } from '../services/claudeService'
import { updateProfile } from '../services/authService'
import { deleteMemory, getPendingMemories, resolveMemory } from '../services/memoryService'
import { calculateScore, formatCOP, getScoreLabel } from '../utils/finance'

const typeMeta = {
  pendiente: { icon: Clock, color: 'text-yellow-600' },
  meta: { icon: Target, color: 'text-blue-600' },
  problema: { icon: AlertCircle, color: 'text-red-600' },
  compromiso: { icon: CheckSquare, color: 'text-green-600' },
  evento: { icon: Calendar, color: 'text-violet-600' }
}

export default function Profile() {
  const { user, setUser, logout } = useApp()
  const navigate = useNavigate()
  const [edit, setEdit] = useState(false)
  const [draft, setDraft] = useState(user)
  const [goalTarget, setGoalTarget] = useState(10000000)
  const [goalMonths, setGoalMonths] = useState(12)
  const [plan, setPlan] = useState('')
  const [loadingPlan, setLoadingPlan] = useState(false)
  const [memoryTick, setMemoryTick] = useState(0)
  const score = calculateScore(user)
  const label = getScoreLabel(score)
  const memories = useMemo(() => getPendingMemories(user?.id || 0), [user?.id, memoryTick])

  const editFields = [
    { key: 'name', label: 'Nombre completo', placeholder: 'Ej: Ana Maria Perez', type: 'text' },
    { key: 'estadoCivil', label: 'Estado civil', placeholder: 'Ej: Soltero/a', type: 'text' },
    { key: 'tipoDocumento', label: 'Tipo de documento', placeholder: 'Ej: CC', type: 'text' },
    { key: 'numeroDocumento', label: 'Numero de identificacion', placeholder: 'Ej: 1122334455', type: 'text' },
    { key: 'email', label: 'Correo electronico', placeholder: 'Ej: nombre@correo.com', type: 'email' },
    { key: 'occupation', label: 'Ocupacion', placeholder: 'Ej: Docente', type: 'text' },
    { key: 'city', label: 'Ciudad', placeholder: 'Ej: Barranquilla', type: 'text' },
    { key: 'income', label: 'Ingreso mensual (COP)', placeholder: 'Ej: 3200000', type: 'number' },
    { key: 'fixedExpenses', label: 'Gastos fijos mensuales (COP)', placeholder: 'Ej: 1400000', type: 'number' },
    { key: 'variableExpenses', label: 'Gastos variables mensuales (COP)', placeholder: 'Ej: 600000', type: 'number' },
    { key: 'credits', label: 'Creditos activos', placeholder: 'Ej: 2', type: 'number' }
  ]

  const save = () => {
    const updated = updateProfile({ ...draft, income: Number(draft.income), fixedExpenses: Number(draft.fixedExpenses), variableExpenses: Number(draft.variableExpenses), credits: Number(draft.credits) })
    setUser(updated)
    setEdit(false)
  }

  const calcPlan = async () => {
    setLoadingPlan(true)
    try {
      const reply = await askClaude('Eres asesor financiero y respondes breve en espanol.', `Cliente quiere ahorrar ${formatCOP(goalTarget)} en ${goalMonths} meses. Da un plan concreto.`)
      setPlan(reply)
    } catch {
      setPlan('No fue posible generar el plan en este momento. Intenta nuevamente.')
    } finally {
      setLoadingPlan(false)
    }
  }

  const ageDays = (iso) => Math.floor((new Date() - new Date(iso)) / (1000 * 60 * 60 * 24))

  return <AppShell>
    <div className="grid lg:grid-cols-3 gap-4">
      <div>
        <div className="bg-white rounded-2xl p-8 text-center"><div className="w-24 h-24 rounded-full bg-[#1B3A6B] text-white grid place-items-center mx-auto border-4 border-[#F5A623] text-3xl font-sora">{user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div><h2 className="font-sora text-xl mt-4">{user?.name}</h2><p className="text-slate-500">{user?.occupation} - {user?.city}</p><span className={`inline-block mt-2 px-3 py-1 rounded-full ${label.bg}`}>{label.label}</span></div>
        <div className="bg-white rounded-2xl p-6 mt-4"><h3 className="font-sora flex items-center gap-2"><Target size={16} />Calculadora de metas</h3><label className="text-sm text-slate-600 block mt-3">Meta de ahorro total (COP)</label><input className="w-full bg-[#EEF4FF] p-3 rounded-xl mt-1" type="number" min="100000" step="100000" placeholder="Ej: 10000000" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} /><label className="text-sm text-slate-600 block mt-3">Plazo para lograrla (meses)</label><input className="w-full bg-[#EEF4FF] p-3 rounded-xl mt-1" type="number" min="1" max="60" placeholder="Ej: 12" value={goalMonths} onChange={(e) => setGoalMonths(e.target.value)} /><button onClick={calcPlan} className="w-full mt-3 bg-[#F5A623] text-[#1B3A6B] rounded-xl py-3">Calcular con IA</button>{loadingPlan ? <div className="animate-pulse h-16 bg-slate-200 rounded-xl mt-3" /> : plan && <div className="bg-[#FFF8E7] border-l-4 border-[#F5A623] p-3 rounded-xl mt-3">{plan}</div>}</div>
      </div>
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl p-6"><div className="flex justify-between"><h3 className="font-sora">Mi informacion</h3><button onClick={() => setEdit((e) => !e)} className="text-[#F5A623]">Editar</button></div>{edit ? <div className="grid md:grid-cols-2 gap-3 mt-4">{editFields.map((field) => <div key={field.key}><label className="text-sm text-slate-600">{field.label}</label><input className="bg-[#EEF4FF] p-3 rounded-xl w-full mt-1" type={field.type} min={field.type === 'number' ? 0 : undefined} placeholder={field.placeholder} value={draft[field.key] || ''} onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })} /></div>)}<div className="col-span-2 flex gap-3"><button onClick={save} className="bg-[#F5A623] text-[#1B3A6B] rounded-xl px-4 py-2">Guardar</button><button onClick={() => { setDraft(user); setEdit(false) }} className="border-2 border-[#1B3A6B] text-[#1B3A6B] rounded-xl px-4 py-2">Cancelar</button></div></div> : <div className="mt-4 space-y-2"> <p><strong>Tipo y numero de documento:</strong> {user?.tipoDocumento || 'No registrado'} {user?.numeroDocumento || ''}</p><p><strong>Estado civil:</strong> {user?.estadoCivil || 'No registrado'}</p><p><strong>Correo:</strong> {user?.email}</p><p><strong>Ingreso:</strong> {formatCOP(user?.income)}</p><p><strong>Gastos fijos:</strong> {formatCOP(user?.fixedExpenses)}</p><p><strong>Gastos variables:</strong> {formatCOP(user?.variableExpenses)}</p><p><strong>Creditos:</strong> {user?.credits}</p></div>}</div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between"><h3 className="font-sora inline-flex items-center gap-2"><Brain className="text-[#F5A623]" size={18} />Lo que recuerdo de ti</h3><span className="text-xs text-slate-400">Solo tu puedes ver esto</span></div>
          {memories.length === 0 ? <p className="text-slate-500 text-sm mt-3">Aun no tengo nada guardado. Cuentame mas en el chat.</p> : <div className="mt-3 space-y-2">{memories.map((m) => {
            const meta = typeMeta[m.type] || typeMeta.pendiente
            const Icon = meta.icon
            return <div key={m.id} className="flex items-center gap-3 border-b pb-2"><Icon size={15} className={meta.color} /><div className="flex-1"><p className="text-sm text-[#1B3A6B] font-medium">{m.text}</p><p className="text-xs text-slate-400">Hace {ageDays(m.createdAt)} dias</p></div><button onClick={() => { resolveMemory(user.id, m.id); setMemoryTick((n) => n + 1) }} className="text-green-600"><Check size={16} /></button><button onClick={() => { deleteMemory(user.id, m.id); setMemoryTick((n) => n + 1) }} className="text-slate-400"><Trash2 size={14} /></button></div>
          })}</div>}
          <p className="text-xs text-slate-400 italic mt-3">Todas las memorias resueltas se eliminan automaticamente despues de 30 dias</p>
        </div>

        <div className="bg-white rounded-2xl p-6"><h3 className="font-sora mb-3">Metas</h3><div className="flex flex-wrap gap-2">{(user?.goals || []).map((g) => <span key={g} className="px-3 py-1 rounded-full bg-[#FFF8E7] border border-[#F5A623]">{g}</span>)}</div></div>
        <button onClick={() => { logout(); navigate('/') }} className="w-full border-2 border-red-500 text-red-600 rounded-xl py-3">Cerrar sesion</button>
      </div>
    </div>
  </AppShell>
}
