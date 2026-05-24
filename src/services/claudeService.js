const BACKEND = 'http://localhost:8000'

export const askClaude = async (systemPrompt, userMessage, history = []) => {
  const res = await fetch(`${BACKEND}/api/claude`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, userMessage, history })
  })

  if (!res.ok) {
    let errMsg = 'No se pudo completar la solicitud.'
    try {
      const err = await res.json()
      errMsg = err.error || errMsg
    } catch {
      errMsg = `Error HTTP ${res.status}`
    }
    throw new Error(errMsg)
  }

  const data = await res.json()
  return data.reply
}

