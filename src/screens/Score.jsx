import { TrendingUp } from 'lucide-react'
import { useState } from 'react'
import AppShell from '../components/AppShell'
import { useApp } from '../context/AppContext'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const APP_TOKEN = import.meta.env.VITE_APP_TOKEN || 'dev-token-change-me'

const FEATURE_LABELS = {
  edad: 'Edad',
  ingresos: 'Ingresos',
  gastos_fijos: 'Gastos fijos',
  gastos_variables: 'Gastos variables',
  creditos_activos: 'Creditos activos',
}

function formatCOP(v) {
  return `$${new Intl.NumberFormat('es-CO').format(Number(v || 0))}`
}

export default function Score() {
  const { user } = useApp()

  const [form, setForm] = useState({
    age: user?.age || 25,
    income: user?.income || 0,
    fixedExpenses: user?.fixedExpenses || 0,
    variableExpenses: user?.variableExpenses || 0,
    credits: user?.credits || 0,
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: Number(value) }))
  }

  async function calculate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/score/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-token': APP_TOKEN
        },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Error del servidor')
      }
      setResult(await res.json())
    } catch (err) {
      setError(err.message || 'No se pudo calcular el score.')
    } finally {
      setLoading(false)
    }
  }

  const prob = result?.probability ?? 0
  const ringColor = prob >= 66 ? '#22C55E' : prob >= 40 ? '#F5A623' : '#EF4444'
  const labelText = prob >= 66 ? 'Alta probabilidad' : prob >= 40 ? 'Probabilidad media' : 'Baja probabilidad'
  const labelBg = prob >= 66 ? 'bg-green-100 text-green-700' : prob >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'

  const savings = form.income - form.fixedExpenses - form.variableExpenses

  return (
    <AppShell>
      <h1 className="font-sora text-3xl text-[#1B3A6B]">Mi Score ML</h1>
      <p className="text-slate-500 mb-6">Modelo XGBoost a€” ajusta tus datos y calcula tu probabilidad de credito</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Editable form */}
        <div className="bg-white rounded-2xl p-6 shadow space-y-4">
          <h2 className="font-sora text-lg text-[#1B3A6B]">Tus datos financieros</h2>

          <div>
            <label className="text-sm text-slate-500 block mb-1">Edad</label>
            <input
              type="number" min={18} max={100}
              value={form.age}
              onChange={(e) => set('age', e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 block mb-1">Ingreso mensual (COP)</label>
            <input
              type="number" min={0}
              value={form.income}
              onChange={(e) => set('income', e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 block mb-1">Gastos fijos (COP)</label>
            <input
              type="number" min={0}
              value={form.fixedExpenses}
              onChange={(e) => set('fixedExpenses', e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 block mb-1">Gastos variables (COP)</label>
            <input
              type="number" min={0}
              value={form.variableExpenses}
              onChange={(e) => set('variableExpenses', e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 block mb-1">Creditos activos</label>
            <div className="flex items-center gap-3">
              <button onClick={() => set('credits', Math.max(0, form.credits - 1))} className="w-9 h-9 rounded-full border border-slate-200 text-lg font-bold hover:bg-slate-50">aˆ’</button>
              <span className="font-sora text-xl w-6 text-center">{form.credits}</span>
              <button onClick={() => set('credits', form.credits + 1)} className="w-9 h-9 rounded-full border border-slate-200 text-lg font-bold hover:bg-slate-50">+</button>
            </div>
          </div>

          <div className={`rounded-xl p-3 text-sm ${savings >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            Capacidad de ahorro estimada: <strong>{formatCOP(savings)}</strong>
          </div>

          <button
            onClick={calculate}
            disabled={loading}
            className="w-full bg-[#1B3A6B] text-white rounded-xl py-3 font-semibold hover:bg-[#2D5FA6] transition disabled:opacity-50"
          >
            {loading ? 'Calculando...' : 'Calcular mi score'}
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result && !loading && (
            <div className="bg-white rounded-2xl p-8 shadow flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-[#1B3A6B]/10 flex items-center justify-center">
                <TrendingUp className="text-[#1B3A6B]" size={32} />
              </div>
              <p className="text-slate-500">Ajusta tus datos y presiona <strong>Calcular mi score</strong></p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl p-8 shadow flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#1B3A6B] border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500">Calculando con XGBoost...</p>
            </div>
          )}

          {result && <>
            {/* Gauge */}
            <div className="bg-white rounded-2xl p-6 shadow flex flex-col items-center gap-3">
              <div className="w-36 h-36 rounded-full flex items-center justify-center" style={{ border: `8px solid ${ringColor}` }}>
                <div className="text-center">
                  <p className="font-sora text-4xl font-bold" style={{ color: ringColor }}>{prob}%</p>
                  <p className="text-slate-500 text-xs">Probabilidad</p>
                </div>
              </div>
              <span className={`px-4 py-1 rounded-full text-sm font-semibold ${labelBg}`}>{labelText}</span>
              <p className="text-slate-500 text-sm text-center">
                {result.will_take_credit ? 'El modelo predice que tomaras un credito' : 'El modelo predice que no tomaras un credito'}
              </p>
            </div>

            {/* Feature importances */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="font-sora text-lg text-[#1B3A6B] mb-4">Factores influyentes</h2>
              <div className="space-y-3">
                {Object.entries(result.feature_importances || {})
                  .sort(([, a], [, b]) => b - a)
                  .map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">{FEATURE_LABELS[key] || key}</span>
                        <span className="font-semibold text-[#1B3A6B]">{(val * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-2 rounded-full bg-[#1B3A6B] transition-all" style={{ width: `${(val * 100).toFixed(1)}%` }} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Interpretation */}
            <div className="bg-white rounded-2xl p-5 shadow">
              <p className="text-slate-600 text-sm">
                {prob >= 66
                  ? `Con ${prob}% de probabilidad, tu perfil muestra alta inclinacion a tomar credito. Tus ingresos y gastos son los factores mas relevantes.`
                  : prob >= 40
                  ? `Con ${prob}% de probabilidad, tu perfil esta en zona intermedia. Intenta reducir gastos o creditos activos para mejorar el indicador.`
                  : `Con ${prob}% de probabilidad, actualmente es poco probable que tomes un credito. Considera reducir gastos para mejorar tu capacidad de ahorro.`}
              </p>
            </div>
          </>}
        </div>
      </div>
    </AppShell>
  )
}

