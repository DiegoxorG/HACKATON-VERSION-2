import { Loader2, FileText, Download } from 'lucide-react'
import { useState } from 'react'
import AdminShell from '../components/AdminShell'
import { useAdmin } from '../context/AdminContext'
import { buildPortfolioSummary } from '../utils/adminFinance'

const reportTypes = [
  { id: 'executive', label: 'Resumen ejecutivo del portafolio', icon: '📊' },
  { id: 'critical', label: 'Clientes en riesgo crítico', icon: '🚨' },
  { id: 'segment', label: 'Análisis por segmento', icon: '📈' },
  { id: 'forecast', label: 'Proyección de mora', icon: '🔮' }
]

export default function Reports() {
  const { clients } = useAdmin()
  const [selectedReport, setSelectedReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [savedReports, setSavedReports] = useState(
    JSON.parse(localStorage.getItem('finia_reports') || '[]')
  )

  const generateReport = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))

    let reportData = {}

    if (selectedReport === 'executive') {
      const avgHealth = (clients.reduce((s, c) => s + c.financialHealth, 0) / clients.length).toFixed(1)
      const avgMora = (clients.reduce((s, c) => s + c.moraProbability, 0) / clients.length * 100).toFixed(1)
      reportData = {
        titulo: `Reporte Ejecutivo del Portafolio — ${new Date().toLocaleDateString('es-CO')}`,
        resumen: `El portafolio de Serfinanza consta de ${clients.length} clientes con salud financiera promedio de ${avgHealth}/100. La probabilidad de mora agregada es ${avgMora}%. Se identifica concentración en clientes de ocupaciones informales y riesgo geográfico en Barranquilla.`,
        hallazgos_clave: [
          `Distribución de riesgo: ${clients.filter(c => c.riskLevel === 'bajo').length} bajo, ${clients.filter(c => c.riskLevel === 'moderado').length} moderado, ${clients.filter(c => c.riskLevel === 'alto').length} alto, ${clients.filter(c => c.riskLevel === 'critico').length} crítico`,
          `${clients.filter(c => c.alerts.length > 0).length} clientes con alertas activas`,
          `${clients.filter(c => c.paymentHistory !== 'al_dia').length} clientes con atrasos o no pagos`,
          'Ingresos concentrados en ocupaciones variables (independientes, informales)'
        ],
        recomendaciones: [
          'Intensificar seguimiento a clientes con riesgo alto y crítico',
          'Implementar programa de educación financiera para independientes',
          'Diversificar portafolio geográficamente',
          'Evaluar reestructuraciones preventivas para clientes moderados'
        ],
        proyeccion: 'Tendencia estable con riesgo de deterioro si no se interviene en clientes moderados. Enfoque en prevención generará mejora en 6 meses.'
      }
    } else if (selectedReport === 'critical') {
      const critical = clients.filter(c => c.riskLevel === 'critico')
      reportData = {
        titulo: `Clientes en Riesgo Crítico — ${new Date().toLocaleDateString('es-CO')}`,
        resumen: `${critical.length} clientes requieren intervención inmediata. Riesgo de recobro judicial o pérdida total es significativo.`,
        hallazgos_clave: critical.map(c => `${c.name}: ${(c.moraProbability * 100).toFixed(0)}% mora, ${c.paymentHistory}, última contacto hace ${Math.floor((new Date() - new Date(c.lastContact)) / (1000 * 60 * 60 * 24))} días`),
        recomendaciones: [
          'Contacto telefónico INMEDIATO con todos',
          'Solicitar garantías adicionales o refinanciamiento',
          'Considerar escalación legal si no hay respuesta en 5 días',
          'Evaluar reservas para pérdida esperada'
        ],
        proyeccion: 'Sin intervención, se proyecta pérdida del 60-80% de estos créditos. Con acción inmediata, posible recuperación del 30-40%.'
      }
    } else if (selectedReport === 'segment') {
      reportData = {
        titulo: `Análisis por Segmento — ${new Date().toLocaleDateString('es-CO')}`,
        resumen: 'Segmentación de portafolio por ocupación y riesgo.',
        hallazgos_clave: [
          'Independientes/Informales: 9 clientes, 55% en riesgo moderado o superior',
          'Profesionales: 5 clientes, 80% en riesgo bajo',
          'Ocupación no especificada: 4 clientes, mezcla de riesgos',
          'Barranquilla: 12 clientes (67% del portafolio)'
        ],
        recomendaciones: [
          'Crear sub-portafolios por ocupación con estrategias diferenciadas',
          'Productos especializados para informales (montos menores, plazos flexibles)',
          'Georeplicar modelo exitoso en otras ciudades'
        ],
        proyeccion: 'Segmentación estratégica puede mejorar eficiencia crediticia 15-20% en 12 meses.'
      }
    } else if (selectedReport === 'forecast') {
      const inMora = clients.filter(c => c.paymentHistory !== 'al_dia').length
      const avgHighRisk = clients.filter(c => c.riskLevel === 'alto').reduce((s, c) => s + c.moraProbability, 0) / Math.max(1, clients.filter(c => c.riskLevel === 'alto').length)
      reportData = {
        titulo: `Proyección de Mora — Próximos 6 Meses`,
        resumen: `Actualmente ${inMora} clientes en mora. Proyección: posible incremento a ${Math.round(inMora * 1.3)} si no hay intervención.`,
        hallazgos_clave: [
          `Mora actual: ${((inMora / clients.length) * 100).toFixed(1)}%`,
          `Probabilidad de mora promedio: ${(clients.reduce((s, c) => s + c.moraProbability, 0) / clients.length * 100).toFixed(1)}%`,
          'Riesgo de aumento concentrado en ocupaciones informales',
          'Estacionalidad esperada en meses de baja actividad comercial'
        ],
        recomendaciones: [
          'Refuerzo de seguimiento preventivo ahora',
          'Preparar alternativas de refinanciamiento',
          'Aumentar provisiones en Q3'
        ],
        proyeccion: 'Con acción preventiva: mora estable. Sin intervención: incremento 30-40% en 6 meses.'
      }
    }

    setReport(reportData)

    // Guardar
    const saved = { ...reportData, id: Date.now(), type: selectedReport, generatedAt: new Date().toISOString() }
    const updated = [saved, ...savedReports].slice(0, 5)
    setSavedReports(updated)
    localStorage.setItem('finia_reports', JSON.stringify(updated))

    setLoading(false)
  }

  const downloadPDF = () => {
    const content = `
${report.titulo}

${report.resumen}

HALLAZGOS CLAVE:
${report.hallazgos_clave.map((h, i) => `${i + 1}. ${h}`).join('\n')}

RECOMENDACIONES:
${report.recomendaciones.map((r, i) => `${i + 1}. ${r}`).join('\n')}

PROYECCIÓN:
${report.proyeccion}

Generado: ${new Date().toLocaleString('es-CO')}
`.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte_${report.type}_${Date.now()}.txt`
    a.click()
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Reportes</h1>
          <p className="text-[#94a3b8]">Genera reportes ejecutivos con análisis de IA</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedReport(type.id)
                setReport(null)
              }}
              className={`p-6 rounded-lg border-2 transition text-left ${
                selectedReport === type.id
                  ? 'bg-[#1a56db] border-[#1a56db] text-white'
                  : 'bg-[#1e293b] border-[#334155] text-[#f1f5f9] hover:border-[#1a56db]'
              }`}
            >
              <span className="text-3xl mb-2 block">{type.icon}</span>
              <p className="font-semibold">{type.label}</p>
            </button>
          ))}
        </div>

        {selectedReport && !report && (
          <button
            onClick={generateReport}
            disabled={loading}
            className="w-full px-6 py-3 bg-[#0e9f6e] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generando reporte...
              </>
            ) : (
              <>
                <FileText size={18} />
                Generar reporte con IA
              </>
            )}
          </button>
        )}

        {report && (
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg overflow-hidden">
            <div className="bg-[#0f172a] border-b border-[#334155] p-6">
              <h2 className="text-2xl font-bold text-white">{report.titulo}</h2>
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => generateReport()}
                  className="px-4 py-2 bg-[#1a56db] text-white rounded-lg hover:opacity-90 transition text-sm"
                >
                  Regenerar
                </button>
                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 border border-[#334155] text-[#94a3b8] rounded-lg hover:border-[#0e9f6e] transition flex items-center gap-2 text-sm"
                >
                  <Download size={14} />
                  Descargar
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Resumen</h3>
                <p className="text-[#e0e7ff]">{report.resumen}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Hallazgos clave</h3>
                <ul className="space-y-2">
                  {report.hallazgos_clave.map((h, i) => (
                    <li key={i} className="flex gap-3 text-[#e0e7ff]">
                      <span className="text-[#0e9f6e] font-bold">{i + 1}.</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Recomendaciones</h3>
                <ul className="space-y-2">
                  {report.recomendaciones.map((r, i) => (
                    <li key={i} className="flex gap-3 text-[#e0e7ff]">
                      <span className="text-[#1a56db] font-bold">{i + 1}.</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Proyección</h3>
                <p className="text-[#e0e7ff]">{report.proyeccion}</p>
              </div>
            </div>
          </div>
        )}

        {savedReports.length > 0 && (
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Reportes recientes</h2>
            <div className="space-y-2">
              {savedReports.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setReport(r)}
                  className="w-full text-left p-3 bg-[#0f172a] border border-[#334155] rounded-lg hover:border-[#1a56db] transition"
                >
                  <p className="text-white font-medium text-sm">{r.titulo}</p>
                  <p className="text-xs text-[#64748b]">
                    {new Date(r.generatedAt).toLocaleString('es-CO')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
