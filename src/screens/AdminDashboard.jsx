import { AlertTriangle, TrendingUp, Users } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import AdminShell from '../components/AdminShell'
import RiskBadge from '../components/RiskBadge'
import { useAdmin } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

// Datos simulados de tendencia (últimos 6 meses)
const trendData = [
  { mes: 'Nov', salud: 62, mora: 18 },
  { mes: 'Dic', salud: 61, mora: 20 },
  { mes: 'Ene', salud: 60, mora: 22 },
  { mes: 'Feb', salud: 58, mora: 25 },
  { mes: 'Mar', salud: 57, mora: 28 },
  { mes: 'Abr', salud: 56, mora: 31 },
  { mes: 'May', salud: 55, mora: 35 }
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { clients } = useAdmin()

  // Calcular KPIs
  const totalClients = clients.length
  const riskCritical = clients.filter(c => c.riskLevel === 'critico').length
  const riskHigh = clients.filter(c => c.riskLevel === 'alto').length
  const highRiskCount = riskCritical + riskHigh
  
  const avgMora = (clients.reduce((sum, c) => sum + c.moraProbability, 0) / clients.length * 100).toFixed(1)
  const avgHealth = (clients.reduce((sum, c) => sum + c.financialHealth, 0) / clients.length).toFixed(1)

  // Distribución de riesgo
  const riskDistribution = [
    { name: 'Bajo', value: clients.filter(c => c.riskLevel === 'bajo').length, color: '#0e9f6e' },
    { name: 'Moderado', value: clients.filter(c => c.riskLevel === 'moderado').length, color: '#e3a008' },
    { name: 'Alto', value: clients.filter(c => c.riskLevel === 'alto').length, color: '#f97316' },
    { name: 'Crítico', value: clients.filter(c => c.riskLevel === 'critico').length, color: '#e02424' }
  ]

  // Top 5 con mayor riesgo
  const topAtRisk = clients
    .sort((a, b) => b.moraProbability - a.moraProbability)
    .slice(0, 5)

  // Requieren contacto urgente
  const urgentContact = clients
    .filter(c => c.riskLevel === 'alto' || c.riskLevel === 'critico' || c.paymentHistory !== 'al_dia')
    .sort((a, b) => new Date(b.lastContact) - new Date(a.lastContact))
    .slice(0, 6)

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-[#94a3b8]">Resumen ejecutivo del portafolio</p>
        </div>

        {/* KPIs */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm mb-2">Total clientes</p>
                <p className="text-3xl font-bold text-white">{totalClients}</p>
              </div>
              <Users className="text-[#1a56db]" size={24} />
            </div>
          </div>

          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm mb-2">Alto/Crítico</p>
                <p className="text-3xl font-bold text-red-400">{highRiskCount}</p>
              </div>
              <AlertTriangle className="text-red-400" size={24} />
            </div>
          </div>

          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
            <div>
              <p className="text-[#94a3b8] text-sm mb-2">Mora promedio</p>
              <p className="text-3xl font-bold text-[#e3a008]">{avgMora}%</p>
            </div>
          </div>

          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
            <div>
              <p className="text-[#94a3b8] text-sm mb-2">Salud promedio</p>
              <p className="text-3xl font-bold text-[#0e9f6e]">{avgHealth}/100</p>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Distribución de riesgo */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Distribución por nivel de riesgo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tendencia */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Tendencia portafolio (6 meses)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="mes" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="salud"
                  stroke="#0e9f6e"
                  name="Salud promedio"
                  strokeWidth={2}
                  dot={{ fill: '#0e9f6e' }}
                />
                <Line
                  type="monotone"
                  dataKey="mora"
                  stroke="#e02424"
                  name="% en mora"
                  strokeWidth={2}
                  dot={{ fill: '#e02424' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alertas y contactos */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mayor riesgo de mora */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-400" />
              Mayor riesgo de mora
            </h2>
            <div className="space-y-3">
              {topAtRisk.map((client) => (
                <button
                  key={client.id}
                  onClick={() => navigate(`/admin/client/${client.id}`)}
                  className="w-full text-left p-3 bg-[#0f172a] border border-[#334155] rounded-lg hover:border-red-500/30 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-white">{client.name}</p>
                      <p className="text-xs text-[#94a3b8]">{client.email}</p>
                    </div>
                    <RiskBadge level={client.riskLevel} size="sm" />
                  </div>
                  <p className="text-xs text-red-400 mt-2">
                    {(client.moraProbability * 100).toFixed(0)}% probabilidad de mora
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Requieren contacto */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Requieren contacto esta semana</h2>
            <div className="space-y-3">
              {urgentContact.map((client) => (
                <button
                  key={client.id}
                  onClick={() => navigate(`/admin/client/${client.id}`)}
                  className="w-full text-left p-3 bg-[#0f172a] border border-[#334155] rounded-lg hover:border-[#1a56db]/30 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-white">{client.name}</p>
                      <p className="text-xs text-[#94a3b8]">
                        Último contacto: {new Date(client.lastContact).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                    <RiskBadge level={client.riskLevel} size="sm" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
