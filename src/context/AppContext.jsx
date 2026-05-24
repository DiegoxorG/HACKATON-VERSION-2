import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getSession, logout as authLogout } from '../services/authService'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    setUser(getSession())
  }, [])

  const logout = () => {
    authLogout()
    setUser(null)
  }

  const value = useMemo(() => ({ user, setUser, logout }), [user])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
  return ctx
}
