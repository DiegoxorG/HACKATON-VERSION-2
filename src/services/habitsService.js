const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const analyzeHabits = async (payload) => {
  const res = await fetch(`${API}/habits/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    let errMsg = 'No se pudo analizar habitos.'
    try {
      const err = await res.json()
      errMsg = err.detail || err.error || errMsg
    } catch {}
    throw new Error(errMsg)
  }

  return res.json()
}
