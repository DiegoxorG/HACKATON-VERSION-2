import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Logo from '../components/Logo'
import { useApp } from '../context/AppContext'
import { mockUser } from '../data/mockUser'
import { login } from '../services/authService'

export default function Login() {
  const navigate = useNavigate()
  const { setUser } = useApp()
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = login(email, password)
      setUser(user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const quickDemo = () => {
    localStorage.setItem('finconfia_session', JSON.stringify(mockUser))
    setUser(mockUser)
    navigate('/dashboard')
  }

  return (
    <AuthLayout title="Iniciar sesion" subtitle="Bienvenido de vuelta">
      <Logo size="sm" />
      <form className="space-y-4 mt-4" onSubmit={onSubmit}>
        <label className="block text-sm">Correo electronico</label>
        <div className="relative"><Mail className="absolute left-3 top-3.5 text-slate-400" size={16} /><input className="w-full bg-[#EEF4FF] border rounded-xl p-3 pl-10" placeholder="Ej: nombre@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} type="email" /></div>
        <label className="block text-sm">Contrasena</label>
        <div className="relative"><Lock className="absolute left-3 top-3.5 text-slate-400" size={16} /><input className="w-full bg-[#EEF4FF] border rounded-xl p-3 pl-10 pr-10" placeholder="Ingresa tu contrasena" value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? 'text' : 'password'} /><button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-3 text-slate-400">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 flex items-center gap-2 text-sm"><AlertCircle size={16} />{error}</div>}
        <button className="w-full bg-[#1B3A6B] text-white rounded-xl py-3 font-semibold">{loading ? <span className="inline-flex items-center gap-2"><Loader2 className="animate-spin" size={16} />Ingresando...</span> : 'Ingresar ->'}</button>
      </form>
      <div className="my-4 text-center text-slate-400">o</div>
      <button onClick={quickDemo} className="w-full border-2 border-[#1B3A6B] text-[#1B3A6B] rounded-xl py-3 font-semibold">Demo rapida</button>
      <p className="text-sm mt-4">No tienes cuenta? <Link to="/register" className="text-[#F5A623] font-semibold">Crear cuenta</Link></p>
    </AuthLayout>
  )
}


