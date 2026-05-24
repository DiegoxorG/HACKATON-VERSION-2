import { BarChart3, Bot, FileText, LayoutDashboard, LogOut, Package, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/clients', label: 'Clientes', icon: Package },
  { to: '/admin/analyst', label: 'IA Analyst', icon: Bot },
  { to: '/admin/reports', label: 'Reportes', icon: FileText },
  { to: '/admin/profile', label: 'Perfil', icon: User }
]

export default function AdminShell({ children }) {
  const location = useLocation()
  const { admin, setAdmin } = useAdmin()

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem('finia_admin_session')
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9]">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 fixed left-0 top-0 h-screen bg-[#1e293b] border-r border-[#334155] flex-col p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1a56db] to-[#0e9f6e] flex items-center justify-center text-white font-bold text-lg">
            FA
          </div>
          <div>
            <p className="font-bold text-sm">FinIA Admin</p>
            <p className="text-xs text-[#94a3b8]">Serfinanza</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-2">
          {links.map((l) => {
            const Icon = l.icon
            const active = location.pathname === l.to
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? 'bg-[#1a56db] text-white'
                    : 'text-[#94a3b8] hover:bg-[#334155]'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{l.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-[#334155] pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#334155] flex items-center justify-center text-sm font-bold">
              {admin?.email?.split('@')[0]?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{admin?.email}</p>
              <p className="text-xs text-[#94a3b8]">Asesor</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#94a3b8] hover:text-red-400 transition"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-6 pb-20 md:pb-6">{children}</main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-[#1e293b] border-t border-[#334155] flex items-center justify-between px-4">
        {links.map((l) => {
          const Icon = l.icon
          const active = location.pathname === l.to
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex flex-col items-center justify-center text-[10px] gap-1 ${
                active ? 'text-[#1a56db]' : 'text-[#94a3b8]'
              }`}
            >
              <Icon size={20} />
              <span>{l.label}</span>
            </Link>
          )
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center justify-center text-[10px] gap-1 text-red-400"
        >
          <LogOut size={20} />
          <span>Salir</span>
        </button>
      </nav>
    </div>
  )
}
