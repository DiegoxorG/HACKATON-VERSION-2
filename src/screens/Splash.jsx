import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { mockUser } from '../data/mockUser'
import { useApp } from '../context/AppContext'

export default function Splash() {
  const navigate = useNavigate()
  const { setUser } = useApp()

  const quickDemo = () => {
    localStorage.setItem('finconfia_session', JSON.stringify(mockUser))
    setUser(mockUser)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen md:flex">
      <section className="md:w-1/2 bg-gradient-to-br from-[#1B3A6B] to-[#2D5FA6] text-white p-10 flex flex-col items-center justify-center gap-8">
        <Logo size="lg" light />
        <p>Tu asesor financiero de confianza</p>
      </section>
      <section className="md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-4">
          <Logo size="sm" />
          <h1 className="font-sora text-3xl text-[#1B3A6B] font-bold">Bienvenido</h1>
          <p className="text-slate-500">Toma el control de tus finanzas con inteligencia artificial</p>
          <button onClick={() => navigate('/login')} className="w-full bg-[#1B3A6B] text-white rounded-xl py-3 font-semibold hover:bg-[#2D5FA6]">Iniciar sesion</button>
          <button onClick={() => navigate('/register')} className="w-full bg-[#F5A623] text-[#1B3A6B] rounded-xl py-3 font-semibold">Crear cuenta</button>
          <button onClick={quickDemo} className="w-full border-2 border-[#1B3A6B] text-[#1B3A6B] rounded-xl py-3 font-semibold">Demo rapida</button>
          <p className="text-xs text-slate-400">Ver demo sin registrarse</p>
        </div>
      </section>
    </div>
  )
}
