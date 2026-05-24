import { Lightbulb, Package, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import ProductCard from '../components/ProductCard'
import { useApp } from '../context/AppContext'
import { serfinanzaProducts } from '../data/serfinanzaProducts'
import { getRecommendedProducts } from '../utils/productRecommender'

const categories = ['Todos', 'Tarjeta de Credito', 'CDT', 'Credito', 'Canal Digital']

export default function Products() {
  const { user } = useApp()
  const [searchParams] = useSearchParams()
  const preselect = searchParams.get('product')
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [forYou, setForYou] = useState(true)
  const recommended = useMemo(() => getRecommendedProducts(user), [user])
  const topMatch = recommended[0]?.matchScore || 0

  const filteredAll = useMemo(() => {
    const base = activeCategory === 'Todos' ? serfinanzaProducts : serfinanzaProducts.filter((p) => p.category === activeCategory)
    if (preselect) return base.filter((p) => p.id === preselect)
    return base
  }, [activeCategory, preselect])

  const recommendedSet = new Set(recommended.map((r) => r.id))

  return (
    <AppShell>
      <div className="bg-gradient-to-r from-[#1B3A6B] to-[#2D5FA6] rounded-2xl p-8 mb-6 text-white flex items-center justify-between">
        <div>
          <h1 className="font-sora text-4xl font-extrabold">Productos Serfinanza</h1>
          <p className="text-white/70 mt-2">Recomendados para tu perfil</p>
        </div>
        <div className="text-right">
          <p className="text-xs">Tu afinidad</p>
          <p className="font-sora text-5xl text-[#F5A623]">{topMatch}%</p>
          <p className="text-xs">compatibilidad</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setForYou(true)} className={`px-4 py-2 rounded-full ${forYou ? 'bg-[#F5A623] text-[#1B3A6B] font-semibold' : 'bg-white border text-slate-600'}`}>Para ti</button>
        {categories.map((c) => <button key={c} onClick={() => { setForYou(false); setActiveCategory(c) }} className={`px-4 py-2 rounded-full ${!forYou && activeCategory === c ? 'bg-[#F5A623] text-[#1B3A6B] font-semibold' : 'bg-white border text-slate-600'}`}>{c}</button>)}
      </div>

      {forYou && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sora text-2xl text-[#1B3A6B] inline-flex items-center gap-2"><Star size={20} className="text-[#F5A623]" />Recomendados para ti</h2>
            <p className="text-sm text-slate-500">Basado en tu perfil financiero</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {recommended.map((p) => (
              <div key={p.id} className="relative">
                <span className="absolute top-3 right-3 z-10 bg-[#F5A623] text-[#1B3A6B] text-xs font-bold px-3 py-1 rounded-full">RECOMENDADO</span>
                <div className="bg-[#FFF8E7] border-l-4 border-[#F5A623] p-3 rounded-xl mb-3 text-sm text-[#1B3A6B] italic inline-flex items-start gap-2"><Lightbulb size={14} className="text-[#F5A623] mt-0.5" />{p.matchReason}</div>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-sora text-2xl text-[#1B3A6B] mb-4">Todos los productos</h2>
        {filteredAll.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500">
            <Package size={40} className="mx-auto mb-3" />
            No encontramos productos para este filtro
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredAll.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </AppShell>
  )
}


