import { CheckCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import AppShell from '../components/AppShell'
import Logo from '../components/Logo'
import { useApp } from '../context/AppContext'
import { askClaude } from '../services/claudeService'
import { buildClientSummary } from '../utils/finance'

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

export default function BankReport() {
  const { user } = useApp()
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [reportError, setReportError] = useState('')

  const generate = async () => {
    setLoading(true)
    setReportError('')
    try {
      const system = 'Eres analista de riesgo de un banco colombiano. Responde SOLO con JSON valido: {"resumen_ejecutivo":"...","nivel_riesgo":"BAJO|MEDIO|ALTO","score_pago":number,"fortalezas":["..."],"alertas":["..."],"recomendacion_banco":"...","proyeccion_6_meses":"..."}'
      const userPrompt = `Genera el reporte para: ${buildClientSummary(user)}`
      const raw = await askClaude(system, userPrompt)
      const parsed = parseClaudeJson(raw)
      setReport(parsed)
    } catch (err) {
      const msg = err?.message || ''
      setReportError(msg.includes('401') ? 'La API key no es valida para generar reportes.' : msg.includes('429') ? 'Hay muchas solicitudes seguidas. Intenta en 1 minuto.' : 'No pudimos generar el reporte con IA en este intento.')
      setReport({ resumen_ejecutivo: 'No fue posible generar el reporte en este momento.', nivel_riesgo: 'MEDIO', score_pago: 50, fortalezas: ['Perfil registrado correctamente'], alertas: ['Error temporal de analisis IA'], recomendacion_banco: 'Reintentar generacion en unos minutos.', proyeccion_6_meses: 'Sin proyeccion disponible.' })
    } finally {
      setLoading(false)
    }
  }

  return <AppShell>
    {!report ? <div className="max-w-lg mx-auto mt-16 bg-white rounded-2xl p-8 text-center"><h2 className="font-sora text-2xl text-[#1B3A6B]">Genera tu reporte financiero</h2><p className="text-slate-500 mt-2">Un resumen ejecutivo de tu situacion para el banco</p><button onClick={generate} className="mt-6 bg-[#F5A623] text-[#1B3A6B] rounded-xl px-6 py-3 font-semibold">{loading ? <span className="inline-flex items-center gap-2"><Loader2 className="animate-spin" size={16} />Analizando tu perfil...</span> : 'Generar Reporte con IA ->'}</button>{reportError && <p className="mt-4 text-sm text-red-600">{reportError}</p>}</div> :
      <div className="bg-white rounded-2xl overflow-hidden animate-fadeInUp">
        {reportError && <div className="px-6 py-3 bg-red-50 text-red-700 text-sm border-b border-red-200">{reportError}</div>}
        <div className="bg-[#1B3A6B] text-white p-6 flex justify-between"><Logo light size="sm" /><div className="text-right text-sm"><span className="bg-[#F5A623] text-[#1B3A6B] px-3 py-1 rounded-full">REPORTE INTERNO</span><p className="mt-2">{new Date().toLocaleDateString('es-CO')} - Confidencial</p></div></div>
        <div className="p-6 border-b"><p className="text-sm text-slate-500">Resumen ejecutivo</p><p className="mt-1">{report.resumen_ejecutivo}</p></div>
        <div className="p-6"><p className="font-sora text-2xl">Riesgo {report.nivel_riesgo}</p><p className="mt-2">Probabilidad de pago: <strong>{report.score_pago}%</strong></p></div>
        <div className="grid md:grid-cols-2 border-t"><div className="p-6 border-r"><h3 className="font-sora mb-3">Fortalezas</h3>{report.fortalezas?.map((f, i) => <p key={i}>- {f}</p>)}</div><div className="p-6"><h3 className="font-sora mb-3">Alertas</h3>{report.alertas?.length ? report.alertas.map((a, i) => <p key={i}>- {a}</p>) : <p>Sin alertas</p>}</div></div>
        <div className="bg-[#1B3A6B] text-white p-6"><p className="font-semibold">Recomendacion del banco</p><p>{report.recomendacion_banco}</p></div>
        <div className="p-6 bg-[#FFF8E7] border-2 border-dashed border-[#F5A623]"><p className="font-semibold">Proyeccion a 6 meses</p><p>{report.proyeccion_6_meses}</p></div>
        <div className="p-6 flex gap-3"><button onClick={generate} className="border-2 border-[#1B3A6B] text-[#1B3A6B] rounded-xl px-5 py-2">Regenerar reporte</button><button onClick={() => window.print()} className="bg-[#1B3A6B] text-white rounded-xl px-5 py-2">Descargar PDF</button></div>
      </div>}
  </AppShell>
}
