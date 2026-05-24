export const formatCOP = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0)

export const calculateScore = (user) => {
  if (!user) return 0
  const { income = 0, fixedExpenses = 0, variableExpenses = 0, credits = 0 } = user
  const total = fixedExpenses + variableExpenses
  const savings = income - total
  const savingsRate = income > 0 ? savings / income : 0
  let score = 50
  if (savingsRate > 0.2) score += 20
  else if (savingsRate > 0.1) score += 10
  if (credits >= 3) score -= 15
  else if (credits === 2) score -= 7
  if (total > income * 0.85) score -= 15
  else if (total > income * 0.7) score -= 7
  if (savings > 0) score += 10
  return Math.min(100, Math.max(0, Math.round(score)))
}

export const getScoreLabel = (score) => {
  if (score >= 70) return { label: 'Excelente', color: '#22C55E', bg: 'bg-green-100 text-green-700' }
  if (score >= 50) return { label: 'Buena', color: '#F59E0B', bg: 'bg-yellow-100 text-yellow-700' }
  return { label: 'En riesgo', color: '#EF4444', bg: 'bg-red-100 text-red-700' }
}

export const buildClientSummary = (user) => `
Nombre: ${user.name}, Edad: ${user.age}, Ciudad: ${user.city}, Ocupacion: ${user.occupation}
Ingreso mensual: ${formatCOP(user.income)}
Gastos fijos: ${formatCOP(user.fixedExpenses)}
Gastos variables: ${formatCOP(user.variableExpenses)}
Ahorro mensual: ${formatCOP((user.income || 0) - (user.fixedExpenses || 0) - (user.variableExpenses || 0))}
Creditos activos: ${user.credits}
Metas: ${user.goals?.join(', ')}
Puntaje de salud financiera: ${calculateScore(user)}/100
`.trim()

export const monthlyPayment = (amount, monthlyRatePercent, months) => {
  const rate = (monthlyRatePercent || 0) / 100
  if (!amount || !months) return 0
  if (!rate) return amount / months
  return (amount * rate) / (1 - Math.pow(1 + rate, -months))
}

