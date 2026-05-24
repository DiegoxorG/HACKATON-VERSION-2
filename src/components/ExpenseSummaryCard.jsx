import { Car, CreditCard, GraduationCap, Heart, Home, MoreHorizontal, Phone, ShoppingCart, Tv, Zap } from 'lucide-react'
import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts'
import { useNavigate } from 'react-router-dom'

const iconMap = { Home, ShoppingCart, Zap, Car, Heart, GraduationCap, Tv, CreditCard, Phone, MoreHorizontal }

export default function ExpenseSummaryCard({ monthLabel, total, rows }) {
  const navigate = useNavigate()
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 max-w-sm mt-3 animate-fadeInUp">
      <p className="font-sora font-bold text-[#1B3A6B]">Tus gastos de {monthLabel}</p>
      <p className="font-sora text-3xl text-[#F5A623]">${total.toLocaleString('es-CO')}</p>
      <div className="h-32">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={rows} dataKey="amount" innerRadius={28} outerRadius={50}>
              {rows.map((r) => <Cell key={r.id} fill={r.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2">
        {rows.map((r) => {
          const Icon = iconMap[r.icon] || MoreHorizontal
          return (
            <div key={r.id} className="flex items-center justify-between border-b pb-2 text-xs">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} /><Icon size={12} /><span>{r.label}</span></div>
              <div className="text-right"><p className="font-semibold text-[#1B3A6B]">${r.amount.toLocaleString('es-CO')}</p><p className="text-slate-400">{r.pct}%</p></div>
            </div>
          )
        })}
      </div>
      <button onClick={() => navigate('/expenses')} className="mt-3 text-[#F5A623] text-sm font-semibold">Ver desglose completo</button>
    </div>
  )
}
