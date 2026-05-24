import { Car, Check, CreditCard, GraduationCap, Heart, Home, MoreHorizontal, Phone, ShoppingCart, Tv, X, Zap } from 'lucide-react'

const iconMap = { Home, ShoppingCart, Zap, Car, Heart, GraduationCap, Tv, CreditCard, Phone, MoreHorizontal }

export default function ExpenseConfirmationPill({ expense, onDelete }) {
  const Icon = iconMap[expense.icon] || MoreHorizontal
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex items-center gap-2 mt-2 animate-fadeInUp">
      <Check size={14} className="text-green-500" />
      <Icon size={14} style={{ color: expense.color }} />
      <span className="text-xs text-[#1B3A6B] font-medium truncate">{expense.description}</span>
      <span className="text-xs font-sora text-green-700">${Number(expense.amount).toLocaleString('es-CO')}</span>
      <button onClick={onDelete} className="ml-auto text-slate-400 hover:text-red-500"><X size={12} /></button>
    </div>
  )
}
