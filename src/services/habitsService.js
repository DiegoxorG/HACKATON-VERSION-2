const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const APP_TOKEN = import.meta.env.VITE_APP_TOKEN || 'dev-token-change-me'

// Consulta de perfil de habitos financieros calculado en backend.
// Se integra en prompts de IA para recomendaciones mas personalizadas.
export const analyzeHabits = async (payload) => {
  const res = await fetch(`${API}/habits/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-token': APP_TOKEN
    },
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
