export const formatCOP = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0)

export const calculateHealth = (client) => {
  if (!client) return 0
  const { income = 0, expenses = 0, paymentHistory = 'al_dia', emergencyFund = 0, debtRatio = 0 } = client
  
  let score = 50
  
  // Historial de pagos (máximo +30)
  if (paymentHistory === 'al_dia') score += 30
  else if (paymentHistory === 'tarde') score -= 15
  else if (paymentHistory === 'no_pago') score -= 30
  
  // Endeudamiento (máximo +20)
  if (debtRatio <= 0.3) score += 20
  else if (debtRatio <= 0.45) score += 10
  else if (debtRatio <= 0.6) score -= 10
  else score -= 20
  
  // Fondo de emergencia (máximo +15)
  if (emergencyFund >= 2) score += 15
  else if (emergencyFund >= 1) score += 10
  else if (emergencyFund > 0) score += 5
  else score -= 10
  
  // Ahorro mensual (máximo +10)
  const savings = income - expenses
  const savingsRate = income > 0 ? savings / income : -1
  if (savingsRate > 0.2) score += 10
  else if (savingsRate > 0.1) score += 5
  else if (savingsRate <= 0) score -= 10
  
  return Math.min(100, Math.max(0, Math.round(score)))
}

export const getHealthLabel = (score) => {
  if (score >= 80) return { label: 'Excelente', color: '#0e9f6e', bg: 'bg-green-100 text-green-700' }
  if (score >= 60) return { label: 'Estable', color: '#1a56db', bg: 'bg-blue-100 text-blue-700' }
  if (score >= 40) return { label: 'En riesgo', color: '#e3a008', bg: 'bg-yellow-100 text-yellow-700' }
  return { label: 'Crítico', color: '#e02424', bg: 'bg-red-100 text-red-700' }
}

export const getRiskColor = (level) => {
  const colors = {
    bajo: '#0e9f6e',
    moderado: '#e3a008',
    alto: '#f97316',
    critico: '#e02424'
  }
  return colors[level] || '#666'
}

export const getRiskBg = (level) => {
  const bgs = {
    bajo: 'bg-green-50 text-green-700 border-green-200',
    moderado: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    alto: 'bg-orange-50 text-orange-700 border-orange-200',
    critico: 'bg-red-50 text-red-700 border-red-200'
  }
  return bgs[level] || 'bg-gray-50 text-gray-700'
}

export const buildClientSummary = (client) => `
Nombre: ${client.name}, Edad: ${client.age}, Ciudad: ${client.city}, Ocupación: ${client.occupation}
Ingreso mensual: ${formatCOP(client.income)}
Gastos mensuales: ${formatCOP(client.expenses)}
Capacidad de pago: ${formatCOP(client.paymentCapacity)}
Endeudamiento: ${(client.debtRatio * 100).toFixed(1)}%
Salud financiera: ${client.financialHealth}/100
Probabilidad de mora: ${(client.moraProbability * 100).toFixed(1)}%
Historial de pago: ${client.paymentHistory}
Fondo de emergencia: ${client.emergencyFund.toFixed(1)} meses
Nivel de riesgo: ${client.riskLevel}
${client.alerts.length > 0 ? `Alertas activas: ${client.alerts.join(', ')}` : 'Sin alertas activas'}
`.trim()

export const buildPortfolioSummary = (clients) => {
  if (!clients || clients.length === 0) return 'Sin datos de clientes'
  
  const avg = (arr) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
  
  const totalClients = clients.length
  const byRisk = {
    bajo: clients.filter(c => c.riskLevel === 'bajo').length,
    moderado: clients.filter(c => c.riskLevel === 'moderado').length,
    alto: clients.filter(c => c.riskLevel === 'alto').length,
    critico: clients.filter(c => c.riskLevel === 'critico').length
  }
  
  const avgHealth = avg(clients.map(c => c.financialHealth))
  const avgMoraProbability = avg(clients.map(c => c.moraProbability))
  const withAlerts = clients.filter(c => c.alerts && c.alerts.length > 0).length
  const inMora = clients.filter(c => c.paymentHistory !== 'al_dia').length
  const totalIncome = clients.reduce((sum, c) => sum + (c.income || 0), 0)
  const totalExpenses = clients.reduce((sum, c) => sum + (c.expenses || 0), 0)
  
  return `
Total clientes: ${totalClients}
Distribución de riesgo: ${byRisk.bajo} bajo, ${byRisk.moderado} moderado, ${byRisk.alto} alto, ${byRisk.critico} crítico
Salud financiera promedio: ${avgHealth.toFixed(1)}/100
Probabilidad de mora promedio: ${(avgMoraProbability * 100).toFixed(1)}%
Clientes con alertas: ${withAlerts}
Clientes en mora/atraso: ${inMora}
Ingreso total portafolio: ${formatCOP(totalIncome)}
Gastos totales portafolio: ${formatCOP(totalExpenses)}
Ahorro agregado: ${formatCOP(totalIncome - totalExpenses)}
`.trim()
}
