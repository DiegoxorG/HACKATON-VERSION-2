import { CreditCard, DollarSign, PiggyBank, Star, TrendingDown, AlertTriangle } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import AppShell from '../components/AppShell'
import { useApp } from '../context/AppContext'
import { expenseCategories } from '../data/expenseCategories'
import { getCurrentMonth, getExpenses, getTotalByCategory, getTotalByMonth } from '../services/expenseService'
import { getRecommendedProducts } from '../utils/productRecommender'
import { calculateScore, formatCOP, getScoreLabel } from '../utils/finance'
import { Banknote, Smartphone, TrendingUp } from 'lucide-react'

const iconMap = { CreditCard, TrendingUp, Banknote, Smartphone }

export default function Dashboard() {
  const { user } = useApp()
  const navigate = useNavigate()
  const income = user?.income || 0
  const currentMonth = getCurrentMonth()
  const expenses = getExpenses(user?.id)
  const totalExpenses = getTotalByMonth(user?.id, currentMonth)
  const byCategory = getTotalByCategory(user?.id, currentMonth)
  const savings = income - totalExpenses
  const credits = user?.credits || 0
  const score = calculateScore(user)
  const label = getScoreLabel(score)
  const recommended = useMemo(() => getRecommendedProducts(user).slice(0, 3), [user])

  const pie = Object.entries(byCategory).map(([id, value]) => {
    const cat = expenseCategories.find((c) => c.id === id) || expenseCategories.find((c) => c.id === 'otros')
    return { id, name: cat.label, value, color: cat.color }
  })

  return <AppShell>
    <h1 className="font-sora text-3xl text-[#1B3A6B]">Hola, {user?.name}</h1>
    <p className="text-slate-500 mb-6">Resumen de tu salud financiera</p>
    <div className="grid md:grid-cols-4 gap-4 mb-6">{[
      [DollarSign, formatCOP(income), 'Ingreso mensual', 'text-blue-600'],
      [TrendingDown, formatCOP(totalExpenses), 'Total gastos mes', 'text-red-500'],
      [PiggyBank, formatCOP(savings), 'Capacidad de ahorro real', savings >= 0 ? 'text-green-500' : 'text-red-500'],
      [CreditCard, `${credits} activos`, 'Creditos', 'text-[#F5A623]']
    ].map(([Icon, v, l, c], i) => <div key={i} className="bg-white rounded-2xl p-5 shadow"><Icon className={c} /><p className="font-sora text-xl mt-2">{v}</p><p className="text-slate-500 text-sm">{l}</p></div>)}</div>

    <div className="bg-white rounded-2xl p-4 mb-6">
      {totalExpenses > income * 0.8 && <p className="text-red-600 text-sm inline-flex items-center gap-2"><AlertTriangle size={14} />Estas gastando mas del 80% de tus ingresos este mes</p>}
      {totalExpenses < income * 0.5 && <p className="text-green-600 text-sm">Excelente. Estas ahorrando mas del 50% este mes</p>}
    </div>

    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <button onClick={() => navigate('/advisor')} className="bg-[#1B3A6B] text-white rounded-2xl p-6 text-left"><h3 className="font-sora text-2xl">Hablar con FinConfia</h3><p className="text-white/70">Obten consejos personalizados</p></button>
      <button onClick={() => navigate('/expenses')} className="bg-[#F5A623] text-[#1B3A6B] rounded-2xl p-6 text-left"><h3 className="font-sora text-2xl">Ver mis gastos</h3><p>Desglose real por categoria</p></button>
    </div>

    <div className="bg-white rounded-2xl p-6 shadow mb-6 h-80"><h2 className="font-sora text-xl text-[#1B3A6B] mb-2">A donde va tu dinero</h2><ResponsiveContainer><PieChart><Pie data={pie} dataKey="value" innerRadius={60} outerRadius={90}>{pie.map((p) => <Cell key={p.id} fill={p.color} />)}</Pie></PieChart></ResponsiveContainer></div>

    <section className="bg-white rounded-2xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora text-xl text-[#1B3A6B] inline-flex items-center gap-2"><Star className="text-[#F5A623]" size={18} />Para tu perfil</h2>
        <button className="text-[#F5A623] font-semibold text-sm" onClick={() => navigate('/products')}>Ver todos</button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {recommended.map((p) => {
          const Icon = iconMap[p.icon] || CreditCard
          return (
            <div key={p.id} className="min-w-48 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="w-8 h-8 rounded-full text-white grid place-items-center" style={{ backgroundColor: p.color }}><Icon size={14} /></div>
              <p className="font-semibold text-sm text-[#1B3A6B] mt-2">{p.name}</p>
              <p className="text-[#F5A623] text-xs mt-1">{p.tasa}</p>
              <button className="text-[#F5A623] text-xs font-semibold mt-2" onClick={() => navigate(`/products?product=${p.id}`)}>Ver</button>
            </div>
          )
        })}
      </div>
    </section>
  </AppShell>
}
