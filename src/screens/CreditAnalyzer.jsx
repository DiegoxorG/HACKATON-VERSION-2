import { AlertTriangle, Calculator, CheckCircle, Lightbulb, Loader2, RefreshCw, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import AppShell from '../components/AppShell'
import { useApp } from '../context/AppContext'
import { askClaude } from '../services/claudeService'
import { buildClientSummary, formatCOP, monthlyPayment } from '../utils/finance'

export default function CreditAnalyzer() {
  const { user } = useApp()
  const [amount, setAmount] = useState(10000000)
  const [rate, setRate] = useState(1.8)
  const [months, setMonths] = useState(24)
  const [purpose, setPurpose] = useState('Vivienda')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const mp = useMemo(() => monthlyPayment(Number(amount), Number(rate), Number(months)), [amount, rate, months])
  const tp = mp * months

  const analyze = async () => {
    setLoading(true)
    try {
      const system = 'Eres analista de riesgo crediticio colombiano. Responde UNICAMENTE con JSON sin markdown: {"verdict":"APROBADO|CON_PRECAUCION|NO_RECOMENDADO","probability":number,"reasons":["..."],"advice":"...","alternative":"...|null"}'
      const userPrompt = `${buildClientSummary(user)}\n\nCredito solicitado: monto ${formatCOP(amount)}, tasa mensual ${rate}%, plazo ${months} meses, proposito ${purpose}, cuota estimada ${formatCOP(mp)}.`
      const reply = await askClaude(system, userPrompt)
      const json = JSON.parse(reply)
      setResult(json)
    } catch {
      setResult({ verdict: 'CON_PRECAUCION', probability: 50, reasons: ['No fue posible interpretar la respuesta de IA.'], advice: 'Revisa los datos e intenta de nuevo.', alternative: null })
    } finally {
      setLoading(false)
    }
  }

  const verdictColor = result?.verdict === 'APROBADO' ? 'green' : result?.verdict === 'NO_RECOMENDADO' ? 'red' : 'yellow'

  return <AppShell>
    <div className="bg-white rounded-2xl p-6 shadow mb-6">
      <h1 className="font-sora text-2xl text-[#1B3A6B] flex items-center gap-2"><Calculator /> Analizador de Credito</h1>
      <p className="text-slate-500 mb-4">Descubre si este credito te conviene antes de solicitarlo</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-600">Monto del credito (COP)</label>
          <input className="bg-[#EEF4FF] p-3 rounded-xl w-full mt-1" type="number" min="100000" step="100000" placeholder="Ej: 15000000" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-slate-600">Tasa de interes mensual (%)</label>
          <input className="bg-[#EEF4FF] p-3 rounded-xl w-full mt-1" type="number" step="0.1" min="0" placeholder="Ej: 1.8" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-slate-600">Plazo del credito: {months} meses</label>
          <input className="bg-[#EEF4FF] p-3 rounded-xl w-full mt-1" type="range" min={6} max={60} step={6} value={months} onChange={(e) => setMonths(e.target.value)} />
          <p className="text-xs text-slate-500 mt-1">Rango permitido: 6 a 60 meses.</p>
        </div>
        <div>
          <label className="text-sm text-slate-600">Proposito del credito</label>
          <select className="bg-[#EEF4FF] p-3 rounded-xl w-full mt-1" value={purpose} onChange={(e) => setPurpose(e.target.value)}><option>Vivienda</option><option>Vehiculo</option><option>Educacion</option><option>Negocio</option><option>Libre inversion</option><option>Emergencia</option></select>
        </div>
      </div>
      <div className="bg-[#EEF4FF] rounded-xl p-4 mt-4"><p>Cuota mensual estimada: <strong>{formatCOP(mp)}</strong></p><p>Total a pagar: {formatCOP(tp)}</p><p>Total intereses: {formatCOP(tp - amount)}</p></div>
      <button onClick={analyze} className="w-full mt-4 bg-[#F5A623] text-[#1B3A6B] rounded-xl py-3 font-semibold">{loading ? <span className="inline-flex items-center gap-2"><Loader2 className="animate-spin" size={16} />Analizando con IA...</span> : 'Analizar con IA ->'}</button>
    </div>
    {result && <div className="space-y-4 animate-fadeInUp">
      <div className={`rounded-2xl p-6 border-2 ${verdictColor === 'green' ? 'bg-green-50 border-green-400' : verdictColor === 'yellow' ? 'bg-yellow-50 border-yellow-400' : 'bg-red-50 border-red-400'}`}><p className="font-sora text-3xl">{result.verdict}</p></div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5"><p className="font-sora">Probabilidad de pago exitoso</p><p className="text-5xl font-sora mt-3">{result.probability}%</p></div>
        <div className="bg-white rounded-2xl p-5"><p className="font-sora mb-2">Factores considerados</p>{(result.reasons || []).map((r, i) => <p key={i} className="text-sm mb-2">{r}</p>)}</div>
      </div>
      <div className="border-l-4 border-[#F5A623] bg-[#FFF8E7] rounded-xl p-4"><p className="font-semibold">Consejo de FinConfia</p><p>{result.advice}</p></div>
      {result.verdict !== 'APROBADO' && result.alternative && <div className="border-2 border-dashed border-[#F5A623] rounded-xl p-4"><p className="font-semibold">Alternativa sugerida</p><p>{result.alternative}</p></div>}
    </div>}
  </AppShell>
}
