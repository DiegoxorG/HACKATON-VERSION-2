import { BarChart, Bar, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Plus, Receipt, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AppShell from '../components/AppShell'
import AddExpenseModal from '../components/AddExpenseModal'
import { expenseCategories } from '../data/expenseCategories'
import { addExpense, deleteExpense, getCurrentMonth, getExpenses } from '../services/expenseService'
import { formatCOP } from '../utils/finance'

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const ymLabel = (ym) => {
  const [y, m] = ym.split('-').map(Number)
  return `${monthNames[m - 1]} ${y}`
}

const shiftMonth = (ym, delta) => {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function Expenses() {
  const user = JSON.parse(localStorage.getItem('finconfia_session') || 'null')
  const [month, setMonth] = useState(getCurrentMonth())
  const [all, setAll] = useState(getExpenses(user?.id))
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('todos')
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    const tipKey = `finconfia_expenses_tip_${user?.id}`
    if (user?.id && !localStorage.getItem(tipKey)) {
      alert('Cuentale a FinConfia tus gastos o agregalos aqui para ver tu desglose real')
      localStorage.setItem(tipKey, '1')
    }
  }, [user])

  const monthExpenses = useMemo(() => all.filter((e) => e.month === month), [all, month])
  const total = useMemo(() => monthExpenses.reduce((s, e) => s + Number(e.amount || 0), 0), [monthExpenses])
  const byCategory = useMemo(() => {
    const r = {}
    monthExpenses.forEach((e) => { r[e.categoryId] = (r[e.categoryId] || 0) + Number(e.amount || 0) })
    return r
  }, [monthExpenses])

  const pieData = useMemo(() => Object.entries(byCategory).map(([id, amount]) => {
    const cat = expenseCategories.find((c) => c.id === id) || expenseCategories.find((c) => c.id === 'otros')
    return { id, label: cat.label, color: cat.color, amount, pct: total ? Math.round((amount / total) * 100) : 0 }
  }), [byCategory, total])

  const lastMonthTotal = useMemo(() => all.filter((e) => e.month === shiftMonth(month, -1)).reduce((s, e) => s + Number(e.amount || 0), 0), [all, month])
  const diffPct = lastMonthTotal > 0 ? Math.round(((total - lastMonthTotal) / lastMonthTotal) * 100) : 0

  const bars6 = useMemo(() => Array.from({ length: 6 }).map((_, idx) => {
    const ym = shiftMonth(month, -5 + idx)
    const value = all.filter((e) => e.month === ym).reduce((s, e) => s + Number(e.amount || 0), 0)
    return { month: ymLabel(ym).split(' ')[0], value }
  }), [all, month])

  const filteredList = useMemo(() => monthExpenses.filter((e) => {
    const matchSearch = (e.description || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'todos' ? true : e.categoryId === filter
    return matchSearch && matchFilter
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [monthExpenses, search, filter])

  const highestCat = [...pieData].sort((a, b) => b.amount - a.amount)[0]

  const remove = (id) => {
    deleteExpense(user.id, id)
    setAll(getExpenses(user.id))
  }

  const addManual = (expense) => {
    addExpense(user.id, expense)
    setAll(getExpenses(user.id))
  }

  return <AppShell>
    <AddExpenseModal open={openModal} onClose={() => setOpenModal(false)} onSave={addManual} />
    <div className="bg-gradient-to-r from-[#1B3A6B] to-[#2D5FA6] rounded-2xl p-6 text-white flex items-center justify-between">
      <div>
        <h1 className="font-sora text-3xl">Mis Gastos</h1>
        <div className="mt-2 inline-flex items-center gap-3 text-sm"><button onClick={() => setMonth(shiftMonth(month, -1))}>{'<'}</button><span className="font-semibold">{ymLabel(month)}</span><button onClick={() => setMonth(shiftMonth(month, 1))}>{'>'}</button></div>
      </div>
      <div className="w-32 h-32 rounded-full border-4 border-[#F5A623] bg-white text-[#1B3A6B] grid place-items-center text-center p-3"><p className="font-sora text-xs">{formatCOP(total)}</p><p className="text-[10px] text-slate-500">este mes</p></div>
    </div>

    <div className="grid md:grid-cols-3 gap-4 mt-4">
      <div className="bg-white rounded-xl shadow-sm p-4"><p className="text-2xl font-sora text-[#1B3A6B]">{monthExpenses.length}</p><p className="text-slate-500 text-sm">Movimientos</p></div>
      <div className="bg-white rounded-xl shadow-sm p-4"><p className="text-2xl font-sora text-[#1B3A6B]">{highestCat?.label || 'Sin datos'}</p><p className="text-slate-500 text-sm">Mayor gasto</p></div>
      <div className="bg-white rounded-xl shadow-sm p-4"><p className={`text-2xl font-sora ${diffPct > 0 ? 'text-red-500' : 'text-green-600'}`}>{diffPct > 0 ? '+' : ''}{diffPct}%</p><p className="text-slate-500 text-sm">vs mes anterior</p></div>
    </div>

    <div className="grid lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm"><h3 className="font-sora text-xl text-[#1B3A6B] mb-3">Por categoria</h3><div className="h-56"><ResponsiveContainer><PieChart><Pie data={pieData} dataKey="amount" innerRadius={55} outerRadius={90}>{pieData.map((p) => <Cell key={p.id} fill={p.color} />)}</Pie></PieChart></ResponsiveContainer></div><div className="space-y-2">{pieData.map((p) => <div key={p.id} className="flex justify-between text-sm"><span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />{p.label}</span><span>{formatCOP(p.amount)} ({p.pct}%)</span></div>)}</div></div>
      <div className="bg-white rounded-2xl p-6 shadow-sm"><h3 className="font-sora text-xl text-[#1B3A6B] mb-3">Ultimos 6 meses</h3><div className="h-64"><ResponsiveContainer><BarChart data={bars6}><XAxis dataKey="month" /><YAxis /><Bar dataKey="value" fill="#1B3A6B" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
    </div>

    <div className="mt-6">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-3"><h3 className="font-sora text-xl text-[#1B3A6B]">Todos los gastos</h3><div className="flex gap-2"><div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={14} /><input className="bg-white rounded-full pl-8 pr-3 py-2 text-sm" placeholder="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} /></div><select className="bg-white rounded-full px-3 py-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="todos">Todas</option>{expenseCategories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div></div>
      {filteredList.length === 0 ? <div className="bg-white rounded-2xl p-10 text-center text-slate-500"><Receipt size={40} className="mx-auto mb-2" />Aun no tienes gastos registrados<br />Cuentaselos a FinConfia o agregalos aqui<button onClick={() => setOpenModal(true)} className="block mx-auto mt-4 bg-[#F5A623] text-[#1B3A6B] px-4 py-2 rounded-xl">+ Agregar primer gasto</button></div> : <div className="space-y-2">{filteredList.map((e) => {
        const cat = expenseCategories.find((c) => c.id === e.categoryId) || expenseCategories.find((c) => c.id === 'otros')
        return <div key={e.id} className="bg-white rounded-xl p-4 flex items-center justify-between"><div><p className="font-semibold text-[#1B3A6B]">{e.description}</p><p className="text-xs text-slate-500">{cat.label} • {new Date(e.createdAt).toLocaleDateString('es-CO')}</p></div><div className="text-right"><p className="font-sora text-[#1B3A6B]">{formatCOP(e.amount)}</p><button onClick={() => remove(e.id)} className="text-red-500"><Trash2 size={14} /></button></div></div>
      })}</div>}
    </div>

    <button onClick={() => setOpenModal(true)} className="fixed bottom-20 right-6 md:bottom-8 w-14 h-14 rounded-full bg-[#F5A623] shadow-lg text-[#1B3A6B] grid place-items-center" title="Agregar gasto"><Plus size={24} /></button>
  </AppShell>
}
