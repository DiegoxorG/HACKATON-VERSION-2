import { Banknote, CheckCircle, CreditCard, Info, Smartphone, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const iconMap = {
  CreditCard,
  TrendingUp,
  Banknote,
  Smartphone
}

export default function ProductCard({ product, compact = false }) {
  const { user } = useApp()
  const navigate = useNavigate()
  const [showAllBenefits, setShowAllBenefits] = useState(false)
  const [showReqs, setShowReqs] = useState(false)
  const Icon = iconMap[product.icon] || CreditCard

  const whatsappMessage = useMemo(() => {
    const name = user?.name || 'Cliente'
    return encodeURIComponent(`Hola Serfinanza, me interesa el ${product.name}. Mi nombre es ${name}.`)
  }, [product.name, user])

  if (compact) {
    return (
      <div className="rounded-xl border-l-4 bg-white shadow-sm p-4 flex items-start gap-3 animate-fadeInUp" style={{ borderColor: product.color }}>
        <div className="w-10 h-10 rounded-full text-white grid place-items-center" style={{ backgroundColor: product.color }}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sora font-bold text-sm text-[#1B3A6B]">{product.name}</p>
          <p className="text-xs text-slate-500">{product.tagline}</p>
          {product.matchReason && <p className="text-xs italic text-blue-700 mt-1">{product.matchReason}</p>}
        </div>
        <button onClick={() => navigate(`/products?product=${product.id}`)} className="text-xs bg-[#F5A623] text-[#1B3A6B] px-3 py-1.5 rounded-lg font-semibold">Ver mas</button>
      </div>
    )
  }

  const visibleBenefits = showAllBenefits ? product.beneficios : product.beneficios.slice(0, 3)

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="p-5 text-white" style={{ backgroundColor: product.color }}>
        <div className="flex items-center justify-between">
          <Icon size={32} />
          <span className="text-[11px] bg-white/20 px-2 py-1 rounded-full">{product.category}</span>
        </div>
        <h3 className="font-sora font-bold text-2xl mt-3">{product.name}</h3>
        <p className="text-sm text-white/80">{product.tagline}</p>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-3 gap-2">
          {[['Cupo', product.cupo], ['Tasa', product.tasa], ['Cuota manejo', product.cuotaManejo]].map(([k, v]) => (
            <div key={k} className="bg-gray-50 rounded-xl p-3">
              <p className="text-[11px] text-slate-500">{k}</p>
              <p className="text-xs font-semibold text-[#1B3A6B] mt-1">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <p className="font-sora text-sm font-semibold text-[#1B3A6B] inline-flex items-center gap-2"><CheckCircle size={14} className="text-[#F5A623]" />Beneficios</p>
          <div className="mt-2 space-y-1.5">
            {visibleBenefits.map((b) => <p key={b} className="text-sm text-slate-600"><span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />{b}</p>)}
          </div>
          {product.beneficios.length > 3 && (
            <button onClick={() => setShowAllBenefits((s) => !s)} className="text-xs text-[#1B3A6B] font-semibold mt-2">
              {showAllBenefits ? 'Ver menos' : `+ ${product.beneficios.length - 3} mas`}
            </button>
          )}
        </div>

        <div className="mt-3">
          <button onClick={() => setShowReqs((s) => !s)} className="text-sm text-slate-500 inline-flex items-center gap-2"><Info size={14} />Requisitos</button>
          {showReqs && <div className="mt-2 space-y-1">{product.requisitos.map((r) => <p key={r} className="text-sm text-slate-600"><span className="inline-block w-1.5 h-1.5 bg-slate-400 rounded-full mr-2" />{r}</p>)}</div>}
        </div>

        <a href={`https://wa.me/573009876543?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="mt-4 block text-center w-full bg-[#F5A623] text-[#1B3A6B] rounded-xl py-3 font-semibold">
          Quiero este producto
        </a>
      </div>
    </div>
  )
}


