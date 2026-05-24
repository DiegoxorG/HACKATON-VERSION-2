import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { setAdmin } = useAdmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Mock validation
    if (email === 'admin@serfinanza.com' && password === 'admin123') {
      const adminData = { email, role: 'admin', loginTime: new Date().toISOString() }
      setAdmin(adminData)
      localStorage.setItem('finia_admin_session', JSON.stringify(adminData))
      setTimeout(() => navigate('/admin/dashboard'), 300)
    } else {
      setError('Credenciales inválidas. Use admin@serfinanza.com / admin123')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center p-4">
      {/* Patrón geométrico de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#1a56db] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0e9f6e] rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#0e9f6e] mb-4">
            <span className="text-2xl font-bold text-white">FA</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">FinIA Admin</h1>
          <p className="text-[#94a3b8]">Panel de Administración Bancaria</p>
        </div>

        {/* Card */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-2">Acceso para Asesores</h2>
          <p className="text-sm text-[#94a3b8] mb-6">
            Ingresa tus credenciales de Serfinanza para acceder al panel
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#f1f5f9] mb-2">
                Email institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.email@serfinanza.com"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#1a56db]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#f1f5f9] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#1a56db]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1a56db] to-[#0e9f6e] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Ingresar al panel'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-[#0f172a] rounded-lg border border-[#334155]">
            <p className="text-xs text-[#94a3b8] mb-2">
              <strong>Demo:</strong> Usa las siguientes credenciales:
            </p>
            <p className="text-xs font-mono text-[#e3a008]">
              Email: admin@serfinanza.com
            </p>
            <p className="text-xs font-mono text-[#e3a008]">
              Contraseña: admin123
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#94a3b8] mt-6">
          Acceso exclusivo para asesores y administrativos de Serfinanza Colombia
        </p>
      </div>
    </div>
  )
}
