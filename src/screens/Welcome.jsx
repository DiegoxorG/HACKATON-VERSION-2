import { CheckCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { calculateScore, getScoreLabel } from '../utils/finance'

export default function Welcome() {
  const { user } = useApp()
  const navigate = useNavigate()
  const score = calculateScore(user)
  const label = getScoreLabel(score)

  useEffect(() => {
    const t = setTimeout(() => navigate('/dashboard'), 5000)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-xl animate-fadeInUp">
        <div className="w-20 h-20 rounded-full bg-[#F5A623] text-white grid place-items-center mx-auto"><CheckCircle size={40} /></div>
        <h1 className="font-sora text-4xl text-[#1B3A6B] font-extrabold mt-6">Listo, {user?.name}!</h1>
        <p className="text-slate-500 mt-2">Tu perfil esta configurado. FinConfia ya conoce tu situacion.</p>
        <div className="bg-[#1B3A6B] rounded-2xl text-white p-6 mt-6 inline-block min-w-[280px]">
          <p>Tu salud financiera inicial</p>
          <p className="font-sora text-5xl text-[#F5A623]">{score}<span className="text-xl text-white">/100</span></p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${label.bg}`}>{label.label}</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className="mt-8 bg-[#F5A623] text-[#1B3A6B] rounded-xl px-8 py-3 font-semibold">Ver mi Dashboard</button>
      </div>
    </div>
  )
}

