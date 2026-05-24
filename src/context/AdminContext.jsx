import { createContext, useContext, useMemo, useState } from 'react'
import { mockClients } from '../data/mockClients'
import { getIntegratedClients } from '../services/accountsService'

// Contexto del panel admin:
// - sesion de admin
// - data de clientes (integrados o mock fallback)
// - filtros y listado filtrado
const AdminContext = createContext(null)

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [tick, setTick] = useState(0)
  const [filters, setFilters] = useState({
    search: '',
    riskLevel: 'all',
    paymentHistory: 'all',
    city: 'all',
    tags: 'all',
    sortBy: 'health' // health | mora | name | lastContact
  })

  const clients = useMemo(() => {
    // Si existen usuarios reales registrados, se transforman a clientes admin.
    // Si no, se usa dataset mock para no romper demo/UX.
    const integrated = getIntegratedClients()
    return integrated.length > 0 ? integrated : mockClients
  }, [tick])

  const filteredClients = useMemo(() => {
    let result = [...clients]

    // Búsqueda
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q) || 
        c.id.toLowerCase().includes(q)
      )
    }

    // Nivel de riesgo
    if (filters.riskLevel !== 'all') {
      result = result.filter(c => c.riskLevel === filters.riskLevel)
    }

    // Historial de pago
    if (filters.paymentHistory !== 'all') {
      result = result.filter(c => c.paymentHistory === filters.paymentHistory)
    }

    // Ciudad
    if (filters.city !== 'all') {
      result = result.filter(c => c.city === filters.city)
    }

    // Tags
    if (filters.tags !== 'all') {
      result = result.filter(c => c.tags.includes(filters.tags))
    }

    // Ordenamiento
    if (filters.sortBy === 'health') {
      result.sort((a, b) => b.financialHealth - a.financialHealth)
    } else if (filters.sortBy === 'mora') {
      result.sort((a, b) => b.moraProbability - a.moraProbability)
    } else if (filters.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (filters.sortBy === 'lastContact') {
      result.sort((a, b) => new Date(b.lastContact) - new Date(a.lastContact))
    }

    return result
  }, [clients, filters])

  const value = useMemo(() => ({
    admin,
    setAdmin,
    clients,
    filteredClients,
    filters,
    setFilters,
    refreshClients: () => setTick((n) => n + 1),
    getClientById: (id) => clients.find(c => c.id === id)
  }), [admin, clients, filteredClients, filters])

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin debe usarse dentro de AdminProvider')
  return ctx
}
