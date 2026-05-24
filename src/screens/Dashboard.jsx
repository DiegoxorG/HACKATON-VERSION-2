import { Calculator, CreditCard, DollarSign, PiggyBank, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import AppShell from '../components/AppShell'
import { useApp } from '../context/AppContext'
import { calculateScore, formatCOP, getScoreLabel } from '../utils/finance'

export default function Dashboard() {
  const { user } = useApp()
  const navigate = useNavigate()
  const income = user?.income || 0
  const fixed = user?.fixedExpenses || 0
  const variable = user?.variableExpenses || 0
  const savings = income - fixed - variable
  const credits = user?.credits || 0
  const score = calculateScore(user)
  const label = getScoreLabel(score)
  const pie = [{ name: 'Fijos', value: fixed, color: '#1B3A6B' }, { name: 'Variables', value: variable, color: '#F5A623' }, { name: 'Ahorro', value: Math.abs(savings), color: savings >= 0 ? '#22C55E' : '#EF4444' }]

  return <AppShell>
    <h1 className="font-sora text-3xl text-[#1B3A6B]">Hola, {user?.name}</h1>
    <p className="text-slate-500 mb-6">Resumen de tu salud financiera</p>
    <div className="grid md:grid-cols-4 gap-4 mb-6">{[
      [DollarSign, formatCOP(income), 'Ingreso mensual', 'text-blue-600'],
      [TrendingDown, formatCOP(fixed + variable), 'Total gastos', 'text-red-500'],
      [PiggyBank, formatCOP(savings), 'Capacidad de ahorro', savings >= 0 ? 'text-green-500' : 'text-red-500'],
      [CreditCard, `${credits} activos`, 'Creditos', 'text-[#F5A623]']
    ].map(([Icon, v, l, c], i) => <div key={i} className="bg-white rounded-2xl p-5 shadow"><Icon className={c} /><p className="font-sora text-xl mt-2">{v}</p><p className="text-slate-500 text-sm">{l}</p></div>)}</div>
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-2xl p-6 shadow h-80"><h2 className="font-sora text-xl text-[#1B3A6B] mb-2">A donde va tu dinero</h2><ResponsiveContainer><PieChart><Pie data={pie} dataKey="value" innerRadius={60} outerRadius={90}>{pie.map((p) => <Cell key={p.name} fill={p.color} />)}</Pie></PieChart></ResponsiveContainer></div>
      <div className="bg-white rounded-2xl p-6 shadow"><h2 className="font-sora text-xl text-[#1B3A6B]">Capacidad crediticia</h2><p className="text-slate-500">Tu limite recomendado</p><p className="text-3xl font-sora mt-2">{formatCOP(income * 0.3)}</p><div className="mt-3 h-4 bg-slate-100 rounded-full"><div className="h-4 rounded-full" style={{ width: `${score}%`, background: label.color }} /></div></div>
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      <button onClick={() => navigate('/advisor')} className="bg-[#1B3A6B] text-white rounded-2xl p-6 text-left"><h3 className="font-sora text-2xl">Hablar con FinConfia</h3><p className="text-white/70">Obten consejos personalizados</p></button>
      <button onClick={() => navigate('/credits')} className="bg-[#F5A623] text-[#1B3A6B] rounded-2xl p-6 text-left"><h3 className="font-sora text-2xl">Analizar un credito</h3><p>Te conviene ese credito?</p></button>
    </div>
  </AppShell>
}
