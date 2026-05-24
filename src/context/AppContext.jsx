import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getSession, logout as authLogout } from '../services/authService'

// Contexto global del lado cliente:
// - usuario autenticado
// - setter de usuario
// - accion de cierre de sesion
const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  // Rehidrata sesion al primer render desde localStorage.
  useEffect(() => {
    setUser(getSession())
  }, [])

  // Cierra sesion en storage y limpia estado React.
  const logout = () => {
    authLogout()
    setUser(null)
  }

  // Valor memoizado para evitar renders extra en consumidores.
  const value = useMemo(() => ({ user, setUser, logout }), [user])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
  return ctx
}
