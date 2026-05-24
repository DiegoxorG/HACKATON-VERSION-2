const MEMORY_KEY = (userId) => `finconfia_memory_${userId}`
const LAST_SEEN_KEY = (userId) => `finconfia_last_seen_${userId}`

export const getMemories = (userId) => JSON.parse(localStorage.getItem(MEMORY_KEY(userId)) || '[]')

export const saveMemory = (userId, memory) => {
  const memories = getMemories(userId)
  const newMemory = {
    id: Date.now(),
    ...memory,
    createdAt: new Date().toISOString(),
    resolved: false
  }
  memories.push(newMemory)
  localStorage.setItem(MEMORY_KEY(userId), JSON.stringify(memories))
  return newMemory
}

export const resolveMemory = (userId, memoryId) => {
  const memories = getMemories(userId).map((m) =>
    m.id === memoryId ? { ...m, resolved: true, resolvedAt: new Date().toISOString() } : m
  )
  localStorage.setItem(MEMORY_KEY(userId), JSON.stringify(memories))
}

export const deleteMemory = (userId, memoryId) => {
  const memories = getMemories(userId).filter((m) => m.id !== memoryId)
  localStorage.setItem(MEMORY_KEY(userId), JSON.stringify(memories))
}

export const getPendingMemories = (userId) => getMemories(userId).filter((m) => !m.resolved)

export const getLastSeen = (userId) => {
  const raw = localStorage.getItem(LAST_SEEN_KEY(userId))
  return raw ? new Date(raw) : null
}

export const updateLastSeen = (userId) => {
  localStorage.setItem(LAST_SEEN_KEY(userId), new Date().toISOString())
}

export const getDaysSinceLastSeen = (userId) => {
  const last = getLastSeen(userId)
  if (!last) return null
  const diff = new Date() - last
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export const getHoursSinceLastSeen = (userId) => {
  const last = getLastSeen(userId)
  if (!last) return null
  return Math.floor((new Date() - last) / (1000 * 60 * 60))
}

export const buildTimeContext = (userId) => {
  const now = new Date()
  const days = getDaysSinceLastSeen(userId)
  const hours = getHoursSinceLastSeen(userId)

  const dateStr = now.toLocaleString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daysLeft = daysInMonth - now.getDate()
  const weekOfMonth = Math.ceil(now.getDate() / 7)

  let lastSeenText = 'Es la primera vez que el usuario habla contigo.'
  if (days === 0 && hours !== null && hours < 1) lastSeenText = 'El usuario hablo contigo hace menos de una hora.'
  else if (days === 0) lastSeenText = `El usuario hablo contigo hace ${hours} horas hoy.`
  else if (days === 1) lastSeenText = 'El usuario no hablaba contigo desde ayer.'
  else if (days !== null) lastSeenText = `Han pasado ${days} dias desde la ultima conversacion.`

  return `
CONTEXTO TEMPORAL ACTUAL:
- Fecha y hora: ${dateStr}
- Dia del mes: ${now.getDate()} de ${daysInMonth} (quedan ${daysLeft} dias)
- Semana del mes: ${weekOfMonth}a semana
- Mes: ${now.toLocaleString('es-CO', { month: 'long', year: 'numeric' })}
- Ultima conversacion: ${lastSeenText}
- Es fin de mes: ${daysLeft <= 5 ? 'SI - ideal para hacer resumen mensual' : 'No'}
- Es inicio de mes: ${now.getDate() <= 5 ? 'SI - ideal para planear el mes' : 'No'}
- Dia de la semana: ${now.toLocaleString('es-CO', { weekday: 'long' })}
- Es fin de semana: ${[0, 6].includes(now.getDay()) ? 'SI' : 'No'}
`
}

export const buildMemoryContext = (userId) => {
  const pending = getPendingMemories(userId)
  if (pending.length === 0) return 'MEMORIA: El usuario no tiene pendientes ni compromisos registrados.'

  const now = new Date()
  const lines = pending.map((m) => {
    const created = new Date(m.createdAt)
    const daysAgo = Math.floor((now - created) / (1000 * 60 * 60 * 24))
    const when = daysAgo === 0 ? 'hoy' : daysAgo === 1 ? 'ayer' : `hace ${daysAgo} dias`
    return `  [${String(m.type || '').toUpperCase()}] "${m.text}" - mencionado ${when} (ID: ${m.id})`
  }).join('\n')

  return `
MEMORIA PERSISTENTE DEL USUARIO (cosas que menciono antes y aun no se resuelven):
${lines}

INSTRUCCIONES DE SEGUIMIENTO:
- Si han pasado 3+ dias de un PENDIENTE, pregunta si ya lo resolvio.
- Si han pasado 7+ dias de un COMPROMISO, pregunta como le fue.
- Si han pasado 1+ dias de un PROBLEMA, pregunta como esta.
- Si un EVENTO FUTURO ya paso (fecha estimada superada), pregunta si ocurrio.
- Maximo menciona 2 memorias por conversacion para no abrumar al usuario.
- Cuando el usuario confirme que resolvio algo, incluye al final:
  [RESOLVER_MEMORIA:ID] para marcarlo como resuelto.
- Se natural.
`
}
