import { CheckCircle, Shield, TrendingUp } from 'lucide-react'
import Logo from './Logo'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen md:flex">
      <section className="md:w-1/2 bg-gradient-to-br from-[#1B3A6B] to-[#2D5FA6] text-white p-8 md:p-12 flex flex-col items-center justify-center gap-6">
        <Logo size="lg" light />
        <p className="text-center">Tu asesor financiero de confianza</p>
        <svg width="280" height="180" viewBox="0 0 280 180" fill="none" className="opacity-80">
          <rect x="20" y="20" width="240" height="130" rx="18" stroke="white" strokeWidth="2" />
          <line x1="45" y1="130" x2="45" y2="90" stroke="white" strokeWidth="2" />
          <line x1="65" y1="130" x2="65" y2="70" stroke="white" strokeWidth="2" />
          <line x1="85" y1="130" x2="85" y2="105" stroke="white" strokeWidth="2" />
          <circle cx="190" cy="85" r="30" stroke="white" strokeWidth="2" />
          <line x1="160" y1="85" x2="220" y2="85" stroke="white" strokeWidth="2" />
          <rect x="70" y="140" width="140" height="20" rx="10" stroke="white" strokeWidth="2" />
        </svg>
        <div className="flex flex-wrap gap-2 justify-center text-xs">
          <span className="bg-white/10 rounded-full px-3 py-2 inline-flex items-center gap-1"><CheckCircle size={14} /> Asesoria personalizada</span>
          <span className="bg-white/10 rounded-full px-3 py-2 inline-flex items-center gap-1"><Shield size={14} /> Datos seguros</span>
          <span className="bg-white/10 rounded-full px-3 py-2 inline-flex items-center gap-1"><TrendingUp size={14} /> Mejora tu credito</span>
        </div>
      </section>
      <section className="md:w-1/2 bg-white flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md animate-fadeInUp">
          {title && <h1 className="font-sora text-3xl text-[#1B3A6B] font-bold">{title}</h1>}
          {subtitle && <p className="text-slate-500 mt-2">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </section>
    </div>
  )
}
