import { getExpenses } from './expenseService'
import { calculateScore } from '../utils/finance'

const USERS_KEY = 'finconfia_users'

const avg = (values) => {
  if (!values.length) return 0
  return values.reduce((sum, n) => sum + n, 0) / values.length
}

const getPaymentHistory = (capacity) => {
  if (capacity >= 500000) return 'al_dia'
  if (capacity >= 0) return 'tarde'
  return 'no_pago'
}

const getRiskLevel = (score) => {
  if (score >= 75) return 'bajo'
  if (score >= 55) return 'moderado'
  if (score >= 35) return 'alto'
  return 'critico'
}

const getCreditStatus = (paymentHistory) => {
  if (paymentHistory === 'al_dia') return 'al_dia'
  if (paymentHistory === 'tarde') return 'tarde'
  return 'no_pago'
}

const buildTags = (user, paymentHistory) => {
  const tags = []
  if (user.occupation) tags.push(String(user.occupation).toLowerCase().replaceAll(' ', '-'))
  if (paymentHistory !== 'al_dia') tags.push('seguimiento')
  if ((user.credits || 0) >= 3) tags.push('multi-credito')
  if ((user.income || 0) >= 5000000) tags.push('alto-ingreso')
  if (!tags.length) tags.push('cliente-digital')
  return tags
}

export const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]')

export const ensureUserExists = (user) => {
  if (!user || !user.email) return
  const users = getUsers()
  if (!users.find((u) => u.email === user.email)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
  }
}

export const mapUserToAdminClient = (user) => {
  const monthlyExpenses = getExpenses(user.id)
  const avgDynamicExpense = avg(monthlyExpenses.map((e) => Number(e.amount || 0)))
  const fixedExpenses = Number(user.fixedExpenses || 0)
  const variableExpenses = Number(user.variableExpenses || 0)
  const modeledExpenses = fixedExpenses + variableExpenses + avgDynamicExpense
  const income = Number(user.income || 0)
  const savings = income - modeledExpenses
  const paymentCapacity = Math.round(savings * 0.65)
  const debtRatio = income > 0 ? Math.max(0, Math.min(1.5, (modeledExpenses + (user.credits || 0) * 180000) / income)) : 1.5
  const paymentHistory = getPaymentHistory(paymentCapacity)
  const financialHealth = calculateScore(user)
  const riskLevel = getRiskLevel(financialHealth)
  const moraProbability = Math.max(0.03, Math.min(0.95, 1 - (financialHealth / 100)))
  const emergencyFund = modeledExpenses > 0 ? Math.max(0, savings / modeledExpenses) : 0
  const creditCount = Number(user.credits || 0)

  return {
    id: `USR-${user.id}`,
    sourceUserId: user.id,
    name: user.name || 'Cliente sin nombre',
    email: user.email || 'sin-correo@finconfia.co',
    phone: user.phone || 'No registrado',
    city: user.city || 'No registrada',
    occupation: user.occupation || 'No registrada',
    age: Number(user.age || 0),
    memberSince: user.createdAt || new Date().toISOString(),
    income,
    expenses: modeledExpenses,
    savings,
    credits: Array.from({ length: creditCount }).map((_, i) => ({
      name: `Credito #${i + 1}`,
      amount: 3000000 + (i * 1500000),
      monthlyQuota: 180000 + (i * 50000),
      status: getCreditStatus(paymentHistory)
    })),
    paymentHistory,
    financialHealth,
    debtRatio,
    paymentCapacity,
    emergencyFund,
    riskLevel,
    moraProbability,
    alerts: paymentCapacity < 0 ? ['Capacidad de pago negativa'] : [],
    adminNotes: [],
    lastContact: new Date().toISOString().slice(0, 10),
    tags: buildTags(user, paymentHistory)
  }
}

export const getIntegratedClients = () => getUsers().map(mapUserToAdminClient)
