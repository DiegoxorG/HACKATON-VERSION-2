import { BarChart3, Bot, FileText, LayoutDashboard, Package, Receipt, TrendingUp, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

const links = [
  { to: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { to: '/expenses', label: 'Mis Gastos', icon: Receipt },
  { to: '/advisor', label: 'Asesor IA', icon: Bot },
  { to: '/credits', label: 'Creditos', icon: BarChart3 },
  { to: '/products', label: 'Productos', icon: Package },
  { to: '/reports', label: 'Reportes', icon: FileText },
  { to: '/score', label: 'Mi Score ML', icon: TrendingUp },
  { to: '/profile', label: 'Perfil', icon: User }
]

export default function AppShell({ children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-64 fixed left-0 top-0 h-screen bg-[#1B3A6B] text-white flex-col p-6">
        <Logo light size="sm" />
        <nav className="mt-8 space-y-2">
          {links.map((l) => {
            const Icon = l.icon
            const active = location.pathname === l.to
            return (
              <Link key={l.to} to={l.to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${active ? 'bg-[#F5A623] text-[#1B3A6B] font-semibold' : 'hover:bg-[#2D5FA6]'}`}>
                <Icon size={18} /> {l.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-white border-t border-slate-200 z-40 flex justify-around items-center px-2">
        {links.slice(0, 5).map((l) => {
          const Icon = l.icon
          const active = location.pathname === l.to
          return (
            <Link 
              key={l.to} 
              to={l.to} 
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${active ? 'text-[#F5A623]' : 'text-slate-400'}`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{l.label}</span>
              {active && <div className="w-1 h-1 bg-[#F5A623] rounded-full" />}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}