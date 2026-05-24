import { Download, FileText, Loader2 } from 'lucide-react'
import { useState } from 'react'
import AdminShell from '../components/AdminShell'
import { useAdmin } from '../context/AdminContext'
import { askClaude } from '../services/claudeService'
import { buildClientSummary, buildPortfolioSummary } from '../utils/adminFinance'

const reportTypes = [
  { id: 'executive', label: 'Resumen ejecutivo del portafolio', icon: 'R1' },
  { id: 'critical', label: 'Clientes en riesgo critico', icon: 'R2' },
  { id: 'segment', label: 'Analisis por segmento', icon: 'R3' },
  { id: 'forecast', label: 'Proyeccion de mora', icon: 'R4' }
]

const parseClaudeJson = (raw) => {
  if (!raw || typeof raw !== 'string') throw new Error('Respuesta vacia del modelo')
  try {
    return JSON.parse(raw)
  } catch {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    if (fenced?.[1]) return JSON.parse(fenced[1])
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(raw.slice(start, end + 1))
    }
    throw new Error('No se pudo extraer JSON del reporte')
  }
}

const getTypeLabel = (type) => reportTypes.find((r) => r.id === type)?.label || type

export default function Reports() {
  const { clients } = useAdmin()
  const [scope, setScope] = useState('portfolio')
  const [selectedClientId, setSelectedClientId] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [savedReports, setSavedReports] = useState(
    JSON.parse(localStorage.getItem('finia_reports') || '[]').filter((r) => r?.source === 'ia')
  )

  const generateReport = async () => {
    if (!selectedReport) return
    if (scope === 'client' && !selectedClientId) {
      setError('Selecciona un cliente para generar reporte individual.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const system = 'Eres analista senior de riesgo y portafolio para Serfinanza Colombia. Responde SOLO con JSON valido y sin texto adicional: {"titulo":"...","resumen":"...","hallazgos_clave":["..."],"recomendaciones":["..."],"proyeccion":"..."}'
      const selectedClient = clients.find((c) => c.id === selectedClientId)
      const scopeText = scope === 'client'
        ? `Contexto de cliente individual:\n${buildClientSummary(selectedClient)}`
        : `Resumen de portafolio:\n${buildPortfolioSummary(clients)}`
      const userPrompt = `
Tipo de reporte solicitado: ${getTypeLabel(selectedReport)} (${selectedReport})
Alcance del reporte: ${scope === 'client' ? 'cliente individual' : 'portafolio'}
Fecha actual: ${new Date().toLocaleString('es-CO')}

${scopeText}

Instrucciones:
- El reporte debe ser ejecutivo, accionable y concreto.
- Incluye de 3 a 6 hallazgos_clave.
- Incluye de 3 a 6 recomendaciones.
- En recomendaciones sugiere ofertas/productos del banco cuando aplique.
- No inventes clientes ni cifras fuera del contexto entregado.
- Si el alcance es cliente individual, personaliza recomendaciones para ese cliente y evita hablar del portafolio completo.
`.trim()

      const raw = await askClaude(system, userPrompt)
      const parsed = parseClaudeJson(raw)

      const reportData = {
        titulo: parsed.titulo || `Reporte ${getTypeLabel(selectedReport)} - ${scope === 'client' ? (selectedClient?.name || 'Cliente') : 'Portafolio'} - ${new Date().toLocaleDateString('es-CO')}`,
        resumen: parsed.resumen || 'Sin resumen disponible',
        hallazgos_clave: Array.isArray(parsed.hallazgos_clave) ? parsed.hallazgos_clave : ['Sin hallazgos disponibles'],
        recomendaciones: Array.isArray(parsed.recomendaciones) ? parsed.recomendaciones : ['Sin recomendaciones disponibles'],
        proyeccion: parsed.proyeccion || 'Sin proyeccion disponible',
        type: selectedReport,
        scope,
        clientId: selectedClientId || null
      }

      setReport(reportData)

      const saved = { ...reportData, id: Date.now(), generatedAt: new Date().toISOString(), source: 'ia' }
      const updated = [saved, ...savedReports].slice(0, 5)
      setSavedReports(updated)
      localStorage.setItem('finia_reports', JSON.stringify(updated))
    } catch (err) {
      const msg = err?.message || ''
      setError(
        msg.includes('401')
          ? 'La API key no es valida para generar reportes.'
          : msg.includes('429')
          ? 'Hay muchas solicitudes seguidas. Intenta en 1 minuto.'
          : msg.includes('fetch')
          ? 'No se pudo conectar al backend. Verifica que la URL de API este configurada y el servicio este activo.'
          : 'No pudimos generar el reporte con IA en este intento.'
      )
      setReport(null)
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = () => {
    if (!report) return
    const content = `
${report.titulo}

${report.resumen}

HALLAZGOS CLAVE:
${report.hallazgos_clave.map((h, i) => `${i + 1}. ${h}`).join('\n')}

RECOMENDACIONES:
${report.recomendaciones.map((r, i) => `${i + 1}. ${r}`).join('\n')}

PROYECCION:
${report.proyeccion}

Generado: ${new Date().toLocaleString('es-CO')}
`.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte_${report.type || 'admin'}_${Date.now()}.txt`
    a.click()
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Reportes</h1>
          <p className="text-[#94a3b8]">Genera reportes ejecutivos con analisis de IA</p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <button
              onClick={() => {
                setScope('portfolio')
                setReport(null)
                setError('')
              }}
              className={`px-4 py-2 rounded-lg border text-sm transition ${scope === 'portfolio' ? 'bg-[#1a56db] border-[#1a56db] text-white' : 'border-[#334155] text-[#94a3b8] hover:border-[#1a56db]'}`}
            >
              Reporte de Portafolio
            </button>
            <button
              onClick={() => {
                setScope('client')
                setReport(null)
                setError('')
              }}
              className={`px-4 py-2 rounded-lg border text-sm transition ${scope === 'client' ? 'bg-[#1a56db] border-[#1a56db] text-white' : 'border-[#334155] text-[#94a3b8] hover:border-[#1a56db]'}`}
            >
              Reporte por Cliente
            </button>
          </div>
          {scope === 'client' && (
            <select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value)
                setReport(null)
                setError('')
              }}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-[#f1f5f9] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a56db]"
            >
              <option value="">Selecciona un cliente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </option>
              ))}
            </select>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedReport(type.id)
                setReport(null)
                setError('')
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
                  onClick={downloadReport}
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
                <h3 className="font-semibold text-white mb-2">Proyeccion</h3>
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
                  onClick={() => {
                    setReport(r)
                    setError('')
                  }}
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
