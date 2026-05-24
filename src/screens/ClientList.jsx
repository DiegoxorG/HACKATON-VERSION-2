import { ChevronRight, Download, Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminShell from '../components/AdminShell'
import RiskBadge from '../components/RiskBadge'
import HealthGauge from '../components/HealthGauge'
import { useAdmin } from '../context/AdminContext'
import { formatCOP } from '../utils/adminFinance'

export default function ClientList() {
  const navigate = useNavigate()
  const { clients, filters, setFilters, filteredClients } = useAdmin()
  const [page, setPage] = useState(0)
  
  // Extraer opciones únicas
  const cities = [...new Set(clients.map(c => c.city))].sort()
  const tags = [...new Set(clients.flatMap(c => c.tags))].sort()
  
  // Paginación
  const itemsPerPage = 10
  const paginatedClients = filteredClients.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage)

  const exportCSV = () => {
    const headers = ['ID', 'Nombre', 'Email', 'Ciudad', 'Salud', 'Riesgo', 'Probabilidad Mora']
    const rows = filteredClients.map(c => [
      c.id,
      c.name,
      c.email,
      c.city,
      c.financialHealth,
      c.riskLevel,
      (c.moraProbability * 100).toFixed(1)
    ])
    
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Título */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Clientes</h1>
            <p className="text-[#94a3b8]">
              Mostrando {paginatedClients.length} de {filteredClients.length} clientes
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#0e9f6e] text-white rounded-lg hover:opacity-90 transition"
          >
            <Download size={18} />
            Exportar
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-2">Buscar</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
                <input
                  type="text"
                  placeholder="Nombre, email o ID"
                  value={filters.search}
                  onChange={(e) => {
                    setFilters({ ...filters, search: e.target.value })
                    setPage(0)
                  }}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg pl-9 pr-4 py-2 text-[#f1f5f9] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a56db]"
                />
              </div>
            </div>

            {/* Riesgo */}
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-2">Nivel de riesgo</label>
              <select
                value={filters.riskLevel}
                onChange={(e) => {
                  setFilters({ ...filters, riskLevel: e.target.value })
                  setPage(0)
                }}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-[#f1f5f9] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a56db]"
              >
                <option value="all">Todos</option>
                <option value="bajo">Bajo</option>
                <option value="moderado">Moderado</option>
                <option value="alto">Alto</option>
                <option value="critico">Crítico</option>
              </select>
            </div>

            {/* Historial */}
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-2">Historial de pago</label>
              <select
                value={filters.paymentHistory}
                onChange={(e) => {
                  setFilters({ ...filters, paymentHistory: e.target.value })
                  setPage(0)
                }}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-[#f1f5f9] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a56db]"
              >
                <option value="all">Todos</option>
                <option value="al_dia">Al día</option>
                <option value="tarde">Tarde</option>
                <option value="no_pago">No pago</option>
              </select>
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-2">Ciudad</label>
              <select
                value={filters.city}
                onChange={(e) => {
                  setFilters({ ...filters, city: e.target.value })
                  setPage(0)
                }}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-[#f1f5f9] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a56db]"
              >
                <option value="all">Todas</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Ordenar */}
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-2">Ordenar por</label>
              <select
                value={filters.sortBy}
                onChange={(e) => {
                  setFilters({ ...filters, sortBy: e.target.value })
                  setPage(0)
                }}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-[#f1f5f9] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a56db]"
              >
                <option value="health">Salud financiera</option>
                <option value="mora">Probabilidad mora</option>
                <option value="name">Nombre</option>
                <option value="lastContact">Último contacto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0f172a] border-b border-[#334155]">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-[#94a3b8]">Cliente</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#94a3b8]">Salud</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#94a3b8]">Endeudamiento</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#94a3b8]">Capacidad pago</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#94a3b8]">Riesgo</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#94a3b8]">Mora</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#94a3b8]">Último contacto</th>
                  <th className="px-6 py-3 text-center font-semibold text-[#94a3b8]">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {paginatedClients.map((client, i) => (
                  <tr
                    key={client.id}
                    className={`hover:bg-[#334155]/30 transition ${
                      client.riskLevel === 'critico' ? 'bg-red-500/5 border-l-2 border-red-500' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{client.name}</p>
                        <p className="text-xs text-[#94a3b8]">{client.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8">
                          <HealthGauge score={client.financialHealth} size="sm" />
                        </div>
                        <span className="text-white">{client.financialHealth}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-20">
                        <div className="h-2 bg-[#334155] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              client.debtRatio <= 0.3
                                ? 'bg-[#0e9f6e]'
                                : client.debtRatio <= 0.6
                                ? 'bg-[#e3a008]'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(client.debtRatio * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-[#94a3b8] mt-1">{(client.debtRatio * 100).toFixed(0)}%</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">
                      {formatCOP(client.paymentCapacity)}
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge level={client.riskLevel} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        client.moraProbability >= 0.5 ? 'text-red-400' :
                        client.moraProbability >= 0.3 ? 'text-[#e3a008]' :
                        'text-[#0e9f6e]'
                      }`}>
                        {(client.moraProbability * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#94a3b8] text-sm">
                      {new Date(client.lastContact).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => navigate(`/admin/client/${client.id}`)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#334155] transition text-[#94a3b8]"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="border-t border-[#334155] px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-3 py-1 rounded border border-[#334155] text-[#94a3b8] hover:border-[#1a56db] disabled:opacity-50 transition"
              >
                Anterior
              </button>
              <span className="text-sm text-[#94a3b8]">
                Página {page + 1} de {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="px-3 py-1 rounded border border-[#334155] text-[#94a3b8] hover:border-[#1a56db] disabled:opacity-50 transition"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
