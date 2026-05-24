const getKey = (userId) => `finconfia_expenses_${userId}`
const DISMISSED_KEY = (userId) => `finconfia_dismissed_categories_${userId}`

export const getExpenses = (userId) => {
  if (!userId) return []
  return JSON.parse(localStorage.getItem(getKey(userId)) || '[]')
}

export const addExpense = (userId, expense) => {
  const expenses = getExpenses(userId)
  const date = expense.date ? new Date(expense.date) : new Date()
  const newExpense = {
    id: Date.now(),
    ...expense,
    createdAt: date.toISOString(),
    month: date.toISOString().slice(0, 7)
  }
  expenses.push(newExpense)
  localStorage.setItem(getKey(userId), JSON.stringify(expenses))
  return newExpense
}

export const deleteExpense = (userId, expenseId) => {
  const expenses = getExpenses(userId).filter((e) => e.id !== expenseId)
  localStorage.setItem(getKey(userId), JSON.stringify(expenses))
}

export const updateExpense = (userId, expenseId, updates) => {
  const expenses = getExpenses(userId).map((e) => (e.id === expenseId ? { ...e, ...updates } : e))
  localStorage.setItem(getKey(userId), JSON.stringify(expenses))
}

export const getTotalByMonth = (userId, month) => getExpenses(userId).filter((e) => e.month === month).reduce((sum, e) => sum + Number(e.amount || 0), 0)

export const getTotalByCategory = (userId, month) => {
  const expenses = getExpenses(userId).filter((e) => e.month === month)
  const result = {}
  expenses.forEach((e) => {
    result[e.categoryId] = (result[e.categoryId] || 0) + Number(e.amount || 0)
  })
  return result
}

export const getCurrentMonth = () => new Date().toISOString().slice(0, 7)

export const getDismissed = (userId) => JSON.parse(localStorage.getItem(DISMISSED_KEY(userId)) || '[]')

export const dismissCategory = (userId, categoryId) => {
  const dismissed = getDismissed(userId)
  if (!dismissed.includes(categoryId)) {
    localStorage.setItem(DISMISSED_KEY(userId), JSON.stringify([...dismissed, categoryId]))
  }
}
