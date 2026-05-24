import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { setAdmin } = useAdmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Credenciales invalidas')
      }

      const data = await res.json()
      const adminData = data.admin
      setAdmin(adminData)
      localStorage.setItem('finia_admin_session', JSON.stringify(adminData))
      setTimeout(() => navigate('/admin/dashboard'), 300)
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#1a56db] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0e9f6e] rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#0e9f6e] mb-4">
            <span className="text-2xl font-bold text-white">FA</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">FinIA Admin</h1>
          <p className="text-[#94a3b8]">Panel de Administracion Bancaria</p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-2">Acceso para Asesores</h2>
          <p className="text-sm text-[#94a3b8] mb-6">
            Ingresa tus credenciales institucionales para acceder al panel
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
                Contrasena
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
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

          <div className="mt-6 p-4 bg-[#0f172a] rounded-lg border border-[#334155]">
            <p className="text-xs text-[#94a3b8]">
              Credenciales administradas por el servidor. Si no tienes acceso, contacta al administrador.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#94a3b8] mt-6">
          Acceso exclusivo para asesores y administrativos de Serfinanza Colombia
        </p>
      </div>
    </div>
  )
}
