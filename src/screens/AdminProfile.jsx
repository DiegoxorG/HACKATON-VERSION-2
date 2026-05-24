import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminShell from '../components/AdminShell'
import { useAdmin } from '../context/AdminContext'

export default function AdminProfile() {
  const navigate = useNavigate()
  const { admin, setAdmin } = useAdmin()

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem('finia_admin_session')
    navigate('/admin/login')
  }

  return (
    <AdminShell>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Perfil</h1>
          <p className="text-[#94a3b8]">Información de tu sesión</p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#1a56db] to-[#0e9f6e] flex items-center justify-center text-3xl font-bold text-white">
              {admin?.email?.split('@')[0]?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{admin?.email}</h2>
              <p className="text-[#94a3b8]">Asesor Serfinanza</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-[#0f172a] border border-[#334155] rounded-lg">
              <p className="text-sm text-[#94a3b8]">Email</p>
              <p className="text-white font-medium mt-1">{admin?.email}</p>
            </div>
            <div className="p-4 bg-[#0f172a] border border-[#334155] rounded-lg">
              <p className="text-sm text-[#94a3b8]">Rol</p>
              <p className="text-white font-medium mt-1">Asesor Bancario</p>
            </div>
            <div className="p-4 bg-[#0f172a] border border-[#334155] rounded-lg">
              <p className="text-sm text-[#94a3b8]">Sesión iniciada</p>
              <p className="text-white font-medium mt-1">
                {new Date(admin?.loginTime).toLocaleString('es-CO')}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <h3 className="font-semibold text-blue-400 mb-2">Acceso Admin FinIA</h3>
          <p className="text-sm text-blue-300">
            Tienes acceso completo a todos los clientes del portafolio y herramientas de análisis. 
            Usa el IA Analyst para obtener recomendaciones sobre tus clientes en tiempo real.
          </p>
        </div>
      </div>
    </AdminShell>
  )
}
