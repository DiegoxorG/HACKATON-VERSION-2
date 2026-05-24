export const expenseCategories = [
  { id: 'arriendo', label: 'Arriendo / Vivienda', icon: 'Home', color: '#1B3A6B', keywords: ['arriendo', 'alquiler', 'vivienda', 'casa', 'apartamento'] },
  { id: 'mercado', label: 'Mercado / Comida', icon: 'ShoppingCart', color: '#22C55E', keywords: ['mercado', 'comida', 'supermercado', 'alimentacion', 'exito', 'jumbo', 'olimpica'] },
  { id: 'servicios', label: 'Servicios publicos', icon: 'Zap', color: '#F59E0B', keywords: ['servicios', 'luz', 'agua', 'gas', 'recibo', 'electricidad', 'epm', 'triple a'] },
  { id: 'transporte', label: 'Transporte', icon: 'Car', color: '#6366F1', keywords: ['transporte', 'bus', 'taxi', 'uber', 'gasolina', 'metro', 'moto', 'peaje'] },
  { id: 'salud', label: 'Salud', icon: 'Heart', color: '#EF4444', keywords: ['salud', 'medicina', 'farmacia', 'medico', 'droga', 'eps', 'clinica', 'drogueria'] },
  { id: 'educacion', label: 'Educacion', icon: 'GraduationCap', color: '#8B5CF6', keywords: ['educacion', 'colegio', 'universidad', 'matricula', 'pension', 'curso'] },
  { id: 'entretenimiento', label: 'Entretenimiento', icon: 'Tv', color: '#EC4899', keywords: ['entretenimiento', 'netflix', 'spotify', 'cine', 'salida', 'restaurante', 'fiesta'] },
  { id: 'creditos', label: 'Creditos / Deudas', icon: 'CreditCard', color: '#F5A623', keywords: ['credito', 'cuota', 'deuda', 'prestamo', 'tarjeta', 'banco'] },
  { id: 'comunicacion', label: 'Comunicaciones', icon: 'Phone', color: '#14B8A6', keywords: ['celular', 'internet', 'claro', 'movistar', 'tigo', 'wifi', 'plan'] },
  { id: 'otros', label: 'Otros', icon: 'MoreHorizontal', color: '#94A3B8', keywords: [] }
]

export const detectCategory = (text) => {
  const lower = (text || '').toLowerCase()
  for (const cat of expenseCategories) {
    if (cat.keywords.some((k) => lower.includes(k))) return cat
  }
  return expenseCategories.find((c) => c.id === 'otros')
}
