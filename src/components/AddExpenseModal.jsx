import { Car, CreditCard, GraduationCap, Heart, Home, MoreHorizontal, Phone, ShoppingCart, Tv, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { expenseCategories } from '../data/expenseCategories'

const iconMap = { Home, ShoppingCart, Zap, Car, Heart, GraduationCap, Tv, CreditCard, Phone, MoreHorizontal }

export default function AddExpenseModal({ open, onClose, onSave }) {
  const [categoryId, setCategoryId] = useState('otros')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  if (!open) return null

  const save = () => {
    if (!amount || Number(amount) <= 0) return
    const cat = expenseCategories.find((c) => c.id === categoryId)
    onSave({ categoryId: cat.id, categoryLabel: cat.label, color: cat.color, icon: cat.icon, amount: Number(amount), description: description || cat.label, date })
    setAmount('')
    setDescription('')
    setDate(new Date().toISOString().slice(0, 10))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center"><h3 className="font-sora text-xl">+ Agregar gasto</h3><button onClick={onClose}><X size={18} /></button></div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {expenseCategories.map((c) => {
            const Icon = iconMap[c.icon] || MoreHorizontal
            const selected = categoryId === c.id
            return <button key={c.id} onClick={() => setCategoryId(c.id)} className={`rounded-xl p-3 text-center border ${selected ? 'border-2' : 'border-slate-200'}`} style={{ borderColor: selected ? c.color : undefined, backgroundColor: selected ? `${c.color}15` : undefined }}><Icon size={20} style={{ color: c.color }} className="mx-auto" /><p className="text-[10px] mt-1 text-slate-600">{c.label}</p></button>
          })}
        </div>
        <input autoFocus className="w-full mt-4 text-center text-3xl font-sora bg-[#EEF4FF] rounded-xl py-3" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" />
        <p className="text-center text-xs text-slate-400 mt-1">COP</p>
        <input className="w-full mt-3 bg-[#EEF4FF] rounded-xl p-3" placeholder="Descripcion (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="w-full mt-3 bg-[#EEF4FF] rounded-xl p-3" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={save} className="w-full mt-4 bg-[#F5A623] text-[#1B3A6B] rounded-xl py-3 font-semibold">Guardar gasto</button>
        <button onClick={onClose} className="w-full mt-2 rounded-xl py-3">Cancelar</button>
      </div>
    </div>
  )
}
