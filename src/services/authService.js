const USERS_KEY = 'finconfia_users'
const SESSION_KEY = 'finconfia_session'

export const register = (userData) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  if (users.find((u) => u.email === userData.email)) throw new Error('Este correo ya esta registrado')
  const user = { ...userData, id: Date.now(), createdAt: new Date().toISOString() }
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export const login = (email, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) throw new Error('Correo o contrasena incorrectos')
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export const logout = () => localStorage.removeItem(SESSION_KEY)

export const getSession = () => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')

export const updateProfile = (updatedData) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const idx = users.findIndex((u) => u.id === updatedData.id)
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updatedData }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    localStorage.setItem(SESSION_KEY, JSON.stringify(users[idx]))
    return users[idx]
  }
  return updatedData
}
