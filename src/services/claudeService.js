const BACKEND = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const APP_TOKEN = import.meta.env.VITE_APP_TOKEN || 'dev-token-change-me'

// Cliente HTTP para el endpoint de conversación IA.
// Usa VITE_API_URL en producción y localhost en desarrollo.
export const askClaude = async (systemPrompt, userMessage, history = []) => {
  const res = await fetch(`${BACKEND}/api/claude`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-token': APP_TOKEN
    },
    body: JSON.stringify({ systemPrompt, userMessage, history })
  })

  if (!res.ok) {
    let errMsg = 'No se pudo completar la solicitud.'
    try {
      const err = await res.json()
      errMsg = err.error || err.detail || errMsg
    } catch {
      errMsg = `Error HTTP ${res.status}`
    }
    throw new Error(errMsg)
  }

  const data = await res.json()
  return data.reply
}
