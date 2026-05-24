import { Briefcase, Calendar, Check, CheckCircle, CreditCard, DollarSign, GraduationCap, Home, Lock, Mail, MapPin, Receipt, Shield, ShoppingCart, Star, TrendingUp, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useApp } from '../context/AppContext'
import { register } from '../services/authService'
import { formatCOP } from '../utils/finance'

const goalsList = [
  { icon: Receipt, label: 'Pagar mis deudas' },
  { icon: Home, label: 'Ahorrar para vivienda' },
  { icon: Shield, label: 'Fondo de emergencia' },
  { icon: TrendingUp, label: 'Empezar a invertir' },
  { icon: Star, label: 'Mejorar mi credito' },
  { icon: GraduationCap, label: 'Ahorrar para educacion' }
]

export default function Register() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const { setUser } = useApp()
  const [form, setForm] = useState({
    name: '',
    age: '',
    city: 'Barranquilla',
    occupation: 'Empleado/a',
    estadoCivil: 'Soltero/a',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    email: '',
    password: '',
    confirmPassword: '',
    income: 0,
    fixedExpenses: 0,
    variableExpenses: 0,
    credits: 0,
    goals: []
  })
  const [error, setError] = useState('')
  const savings = useMemo(() => Number(form.income || 0) - Number(form.fixedExpenses || 0) - Number(form.variableExpenses || 0), [form])

  const toggleGoal = (goal) => setForm((f) => ({ ...f, goals: f.goals.includes(goal) ? f.goals.filter((g) => g !== goal) : [...f.goals, goal] }))

  const next = () => {
    setError('')
    if (step === 1 && (!form.name || !form.age || !form.numeroDocumento || !form.email || !form.password || form.password !== form.confirmPassword)) return setError('Completa tus datos y verifica la contrasena')
    if (step === 3 && form.goals.length === 0) return setError('Selecciona al menos una meta')
    if (step < 3) setStep(step + 1)
  }

  const createAccount = () => {
    try {
      const user = register({ ...form, age: Number(form.age), income: Number(form.income), fixedExpenses: Number(form.fixedExpenses), variableExpenses: Number(form.variableExpenses), credits: Number(form.credits) })
      setUser(user)
      navigate('/welcome')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AuthLayout title="Crear cuenta" subtitle="Configuracion en 3 pasos">
      <div className="flex items-center justify-between mb-6">{[1, 2, 3].map((n) => <div key={n} className={`w-10 h-10 rounded-full grid place-items-center ${n <= step ? 'bg-[#F5A623] text-[#1B3A6B]' : 'bg-slate-100 text-slate-400'}`}>{n < step ? <Check size={16} /> : n}</div>)}</div>
      {step === 1 && <div className="space-y-3">
        <div>
          <label className="text-sm text-slate-600">Nombre completo</label>
          <input className="w-full bg-[#EEF4FF] p-3 rounded-xl mt-1" placeholder="Ej: Ana Maria Perez" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-slate-600">Edad</label>
          <input className="w-full bg-[#EEF4FF] p-3 rounded-xl mt-1" placeholder="Ej: 29" type="number" min="18" max="100" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-slate-600">Ciudad de residencia</label>
          <input className="w-full bg-[#EEF4FF] p-3 rounded-xl mt-1" placeholder="Ej: Barranquilla" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-slate-600">Estado civil</label>
          <select className="w-full bg-[#EEF4FF] p-3 rounded-xl mt-1" value={form.estadoCivil} onChange={(e) => setForm({ ...form, estadoCivil: e.target.value })}>
            <option>Soltero/a</option>
            <option>Casado/a</option>
            <option>Union libre</option>
            <option>Divorciado/a</option>
            <option>Viudo/a</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-600">Tipo de documento</label>
          <select className="w-full bg-[#EEF4FF] p-3 rounded-xl mt-1" value={form.tipoDocumento} onChange={(e) => setForm({ ...form, tipoDocumento: e.target.value })}>
            <option>CC</option>
            <option>CE</option>
            <option>TI</option>
            <option>Pasaporte</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-600">Numero de identificacion</label>
          <input className="w-full bg-[#EEF4FF] p-3 rounded-xl mt-1" placeholder="Ej: 1122334455" value={form.numeroDocumento} onChange={(e) => setForm({ ...form, numeroDocumento: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-slate-600">Correo electronico</label>
          <input className="w-full bg-[#EEF4FF] p-3 rounded-xl mt-1" placeholder="Ej: nombre@correo.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-slate-600">Contrasena</label>
          <input className="w-full bg-[#EEF4FF] p-3 rounded-xl mt-1" placeholder="Minimo 6 caracteres" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-slate-600">Confirmar contrasena</label>
          <input className="w-full bg-[#EEF4FF] p-3 rounded-xl mt-1" placeholder="Repite tu contrasena" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
        </div>
      </div>}
      {step === 2 && <div className="space-y-3">
        <div>
          <label className="text-sm text-slate-600">Ingreso mensual neto (COP)</label>
          <input className="w-full bg-[#EEF4FF] p-3 rounded-xl mt-1" placeholder="Ej: 3200000" type="number" min="0" value={form.income} onChange={(e) => setForm({ ...form, income: e.target.value })} />
          <p className="text-xs text-slate-500 mt-1">Sin puntos ni comas.</p>
        </div>
        <div>
          <label className="text-sm text-slate-600">Gastos fijos mensuales (COP)</label>
          <input className="w-full bg-[#EEF4FF] p-3 rounded-xl mt-1" placeholder="Ej: 1400000" type="number" min="0" value={form.fixedExpenses} onChange={(e) => setForm({ ...form, fixedExpenses: e.target.value })} />
          <p className="text-xs text-slate-500 mt-1">Arriendo, servicios, cuotas y pagos recurrentes.</p>
        </div>
        <div>
          <label className="text-sm text-slate-600">Gastos variables mensuales (COP)</label>
          <input className="w-full bg-[#EEF4FF] p-3 rounded-xl mt-1" placeholder="Ej: 600000" type="number" min="0" value={form.variableExpenses} onChange={(e) => setForm({ ...form, variableExpenses: e.target.value })} />
          <p className="text-xs text-slate-500 mt-1">Comida, transporte, entretenimiento y compras.</p>
        </div>
        <div>
          <label className="text-sm text-slate-600">Creditos activos actualmente</label>
          <div className="flex items-center gap-2 mt-1"><button className="px-3 py-2 rounded-lg bg-[#1B3A6B] text-white" onClick={() => setForm({ ...form, credits: Math.max(0, form.credits - 1) })}>-</button><div className="px-4">{form.credits}</div><button className="px-3 py-2 rounded-lg bg-[#1B3A6B] text-white" onClick={() => setForm({ ...form, credits: form.credits + 1 })}>+</button></div>
        </div>
        <div className="bg-[#FFF8E7] border-l-4 border-[#F5A623] p-3 rounded-xl">
          <p className="text-sm text-slate-600">Capacidad de ahorro estimada</p><p className={`font-bold ${savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCOP(savings)}</p>
        </div>
      </div>}
      {step === 3 && <div className="grid grid-cols-2 gap-3">{goalsList.map(({ icon: Icon, label }) => {
        const selected = form.goals.includes(label)
        return <button key={label} onClick={() => toggleGoal(label)} className={`p-3 rounded-2xl border text-left relative ${selected ? 'bg-[#FFF8E7] border-2 border-[#F5A623]' : 'bg-white border-slate-200'}`}><Icon size={16} className="mb-2" />{label}{selected && <CheckCircle size={16} className="absolute top-2 right-2 text-[#F5A623]" />}</button>
      })}</div>}
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      <div className="flex gap-3 mt-6">
        {step > 1 && <button className="flex-1 border-2 border-[#1B3A6B] text-[#1B3A6B] rounded-xl py-3" onClick={() => setStep(step - 1)}>{'<- Atras'}</button>}
        {step < 3 ? <button className="flex-1 bg-[#1B3A6B] text-white rounded-xl py-3" onClick={next}>Continuar</button> : <button className="flex-1 bg-[#F5A623] text-[#1B3A6B] rounded-xl py-3 font-semibold" onClick={createAccount}>Crear mi cuenta</button>}
      </div>
    </AuthLayout>
  )
}
