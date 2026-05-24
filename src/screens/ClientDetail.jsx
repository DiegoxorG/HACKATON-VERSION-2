import { AlertTriangle, Loader2, MessageSquare, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminShell from '../components/AdminShell'
import HealthGauge from '../components/HealthGauge'
import NoteEditor from '../components/NoteEditor'
import RiskBadge from '../components/RiskBadge'
import { useAdmin } from '../context/AdminContext'
import { buildClientSummary, formatCOP } from '../utils/adminFinance'

// Mock de generación de reporte (en prod usaría Claude API)
const generateMockReport = (client) => ({
  resumen_ejecutivo: `Cliente ${client.name} presenta nivel de riesgo ${client.riskLevel.toUpperCase()}. Ingresos mensuales de ${formatCOP(client.income)} con gastos de ${formatCOP(client.expenses)}. Capacidad de pago: ${formatCOP(client.paymentCapacity)}. ${client.paymentHistory === 'no_pago' ? 'Cliente con no pagos significativos.' : client.paymentHistory === 'tarde' ? 'Cliente con atrasos en pagos.' : 'Cliente al día en sus obligaciones.'}`,
  nivel_riesgo: client.riskLevel.toUpperCase(),
  score_pago: Math.round(100 - (client.moraProbability * 100)),
  fortalezas: client.riskLevel === 'bajo' 
    ? ['Ingreso estable', 'Bajo endeudamiento', 'Historial al día']
    : client.riskLevel === 'moderado'
    ? ['Capacidad de pago moderada', 'Algunos créditos activos', 'Empleo identificado']
    : ['Historial registrado', 'Identificación de ingresos'],
  alertas: client.alerts.length > 0 ? client.alerts : ['Sin alertas críticas en el momento'],
  recomendacion_banco: client.riskLevel === 'critico' 
    ? 'Contacto urgente recomendado. Evaluarplan de reestructuración o recuperación. Considerar escalación a legal si procede.'
    : client.riskLevel === 'alto'
    ? 'Llamada de seguimiento dentro de 7 días. Evaluar capacidad real de pago e identificar impedimentos.'
    : client.riskLevel === 'moderado'
    ? 'Seguimiento mensual. Monitorear cambios en ingresos o estructura de gastos.'
    : 'Mantener contacto trimestral. Cliente con buen desempeño.',
  proyeccion_6_meses: client.riskLevel === 'critico' 
    ? 'Alto riesgo de escalamiento. Proyección negativa sin intervención.'
    : client.riskLevel === 'alto'
    ? 'Tendencia a empeorar. Se recomienda acción preventiva inmediata.'
    : 'Tendencia estable. Posible mejora si se mantiene disciplina.'
})

export default function ClientDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getClientById } = useAdmin()
  const [client, setClient] = useState(null)
  const [report, setReport] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [showReport, setShowReport] = useState(false)

  useEffect(() => {
    const c = getClientById(id)
    if (!c) navigate('/admin/clients')
    else setClient(c)
  }, [id, getClientById, navigate])

  const generateReport = async () => {
    setReportLoading(true)
    // Simular delay de API
    await new Promise(r => setTimeout(r, 800))
    setReport(generateMockReport(client))
    setShowReport(true)
    setReportLoading(false)
  }

  if (!client) return null

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <button
          onClick={() => navigate('/admin/clients')}
          className="text-[#94a3b8] hover:text-white transition"
        >
          ← Volver a clientes
        </button>

        {/* Perfil */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Izquierda: Información */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card superior: Datos básicos */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#1a56db] to-[#0e9f6e] flex items-center justify-center text-2xl font-bold text-white">
                  {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white">{client.name}</h1>
                  <p className="text-[#94a3b8]">{client.id}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <RiskBadge level={client.riskLevel} />
                    <span className="text-xs text-[#94a3b8]">Miembro desde {new Date(client.memberSince).toLocaleDateString('es-CO')}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#94a3b8]">Email</p>
                  <p className="text-white font-medium">{client.email}</p>
                </div>
                <div>
                  <p className="text-[#94a3b8]">Teléfono</p>
                  <p className="text-white font-medium">{client.phone}</p>
                </div>
                <div>
                  <p className="text-[#94a3b8]">Ciudad</p>
                  <p className="text-white font-medium">{client.city}</p>
                </div>
                <div>
                  <p className="text-[#94a3b8]">Ocupación</p>
                  <p className="text-white font-medium">{client.occupation}</p>
                </div>
              </div>
            </div>

            {/* Métricas financieras */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
                <p className="text-xs text-[#94a3b8] mb-3">Ingreso mensual</p>
                <p className="text-2xl font-bold text-white">{formatCOP(client.income)}</p>
              </div>
              <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
                <p className="text-xs text-[#94a3b8] mb-3">Gastos mensuales</p>
                <p className="text-2xl font-bold text-white">{formatCOP(client.expenses)}</p>
              </div>
              <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
                <p className="text-xs text-[#94a3b8] mb-3">Capacidad de pago</p>
                <p className={`text-2xl font-bold ${client.paymentCapacity >= 0 ? 'text-[#0e9f6e]' : 'text-red-400'}`}>
                  {formatCOP(client.paymentCapacity)}
                </p>
              </div>
              <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
                <p className="text-xs text-[#94a3b8] mb-3">Fondo emergencia</p>
                <p className="text-2xl font-bold text-white">{client.emergencyFund.toFixed(1)} meses</p>
              </div>
            </div>

            {/* Indicadores */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
                <p className="text-xs text-[#94a3b8] mb-2">Endeudamiento</p>
                <div className="h-2 bg-[#334155] rounded-full overflow-hidden mb-2">
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
                <p className="text-sm font-bold text-white">{(client.debtRatio * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
                <p className="text-xs text-[#94a3b8] mb-2">Probabilidad mora</p>
                <div className="h-2 bg-[#334155] rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${
                      client.moraProbability <= 0.2
                        ? 'bg-[#0e9f6e]'
                        : client.moraProbability <= 0.5
                        ? 'bg-[#e3a008]'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${client.moraProbability * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm font-bold text-white">{(client.moraProbability * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
                <p className="text-xs text-[#94a3b8] mb-2">Últi contact</p>
                <p className="text-sm font-bold text-white">
                  {new Date(client.lastContact).toLocaleDateString('es-CO')}
                </p>
              </div>
            </div>

            {/* Créditos activos */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Créditos activos ({client.credits.length})</h2>
              <div className="space-y-3">
                {client.credits.map((credit, i) => (
                  <div key={i} className="p-3 bg-[#0f172a] border border-[#334155] rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-white">{credit.name}</p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        credit.status === 'al_dia' ? 'bg-green-500/10 text-green-400' :
                        credit.status === 'tarde' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {credit.status === 'al_dia' ? 'Al día' : credit.status === 'tarde' ? 'Tarde' : 'No pago'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-[#94a3b8] text-xs">Monto</p>
                        <p className="text-white font-medium">{formatCOP(credit.amount)}</p>
                      </div>
                      <div>
                        <p className="text-[#94a3b8] text-xs">Cuota mensual</p>
                        <p className="text-white font-medium">{formatCOP(credit.monthlyQuota)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alertas */}
            {client.alerts.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-red-400 mb-2">Alertas activas</p>
                    <ul className="space-y-1">
                      {client.alerts.map((alert, i) => (
                        <li key={i} className="text-sm text-red-300">• {alert}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Derecha: Herramientas del asesor */}
          <div className="space-y-6">
            {/* Medidor de salud */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 flex flex-col items-center">
              <p className="text-sm text-[#94a3b8] mb-4">Salud financiera</p>
              <HealthGauge score={client.financialHealth} size="md" />
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <button
                onClick={generateReport}
                disabled={reportLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0e9f6e] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition"
              >
                {reportLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <MessageSquare size={18} />
                    Generar Reporte
                  </>
                )}
              </button>

              <button
                onClick={() => navigate(`/admin/analyst?client=${client.id}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1a56db] text-white rounded-lg hover:opacity-90 transition"
              >
                <MessageSquare size={18} />
                Consultar con IA
              </button>

              <button
                onClick={() => window.open(`tel:${client.phone}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#334155] text-white rounded-lg hover:border-[#1a56db] transition"
              >
                <Phone size={18} />
                {client.phone}
              </button>
            </div>

            {/* Notas */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Notas privadas</h2>
              <NoteEditor clientId={client.id} />
            </div>
          </div>
        </div>

        {/* Reporte IA (si está disponible) */}
        {showReport && report && (
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg overflow-hidden">
            <div className="bg-[#0f172a] border-b border-[#334155] p-6">
              <h2 className="text-xl font-bold text-white">Reporte IA — {client.name}</h2>
              <p className="text-sm text-[#94a3b8]">Generado el {new Date().toLocaleString('es-CO')}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Resumen ejecutivo */}
              <div>
                <h3 className="font-semibold text-white mb-2">Resumen ejecutivo</h3>
                <p className="text-[#e0e7ff]">{report.resumen_ejecutivo}</p>
              </div>

              {/* Nivel de riesgo */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-4">
                  <p className="text-sm text-[#94a3b8] mb-2">Nivel de riesgo</p>
                  <RiskBadge level={client.riskLevel} size="lg" />
                </div>
                <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-4">
                  <p className="text-sm text-[#94a3b8] mb-2">Score de pago</p>
                  <p className="text-3xl font-bold text-[#0e9f6e]">{report.score_pago}%</p>
                </div>
              </div>

              {/* Fortalezas y alertas */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-white mb-3">Fortalezas</h3>
                  <ul className="space-y-2">
                    {report.fortalezas.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#0e9f6e]">
                        <span className="text-lg mt-0.5">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-3">Observaciones</h3>
                  <ul className="space-y-2">
                    {report.alertas.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-yellow-400">
                        <span className="text-lg mt-0.5">⚠</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recomendación */}
              <div className="bg-[#0e9f6e]/10 border border-[#0e9f6e]/30 rounded-lg p-4">
                <h3 className="font-semibold text-[#0e9f6e] mb-2">Recomendación del banco</h3>
                <p className="text-[#e0e7ff]">{report.recomendacion_banco}</p>
              </div>

              {/* Proyección */}
              <div className="bg-[#1a56db]/10 border border-[#1a56db]/30 rounded-lg p-4">
                <h3 className="font-semibold text-[#1a56db] mb-2">Proyección a 6 meses</h3>
                <p className="text-[#e0e7ff]">{report.proyeccion_6_meses}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
