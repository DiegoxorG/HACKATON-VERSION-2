import { serfinanzaProducts } from '../data/serfinanzaProducts'
import { calculateScore } from './finance'

export const getRecommendedProducts = (user) => {
  if (!user) return []
  const score = calculateScore(user)
  const savings = (user.income || 0) - (user.fixedExpenses || 0) - (user.variableExpenses || 0)
  const results = []

  serfinanzaProducts.forEach((product) => {
    let match = 0
    let reason = ''

    if (product.category === 'CDT' && savings >= 500000) {
      if (product.id === 'cdt-30' && savings < 1000000) {
        match = 90
        reason = `Tienes $${savings.toLocaleString('es-CO')} de ahorro mensual. Un CDT a 30 dias es perfecto para empezar a invertir con seguridad.`
      }
      if (product.id === 'cdt-180' && savings >= 1000000) {
        match = 95
        reason = `Con tu capacidad de ahorro puedes constituir un CDT a 180 dias y ganar hasta 9.2% E.A. Este ano podrias generar intereses significativos.`
      }
      if (product.id === 'cdt-360' && savings >= 2000000) {
        match = 92
        reason = 'Tu perfil financiero es solido. Un CDT a 360 dias al 10% E.A. maximizaria tu rentabilidad este ano.'
      }
    }

    if (product.category === 'Tarjeta de Credito') {
      if (product.id === 'tarjeta-clasica' && user.income >= 800000 && user.income < 2000000 && user.credits <= 2 && score >= 40) {
        match = 88
        reason = 'La Tarjeta Clasica Serfinanza se ajusta a tu perfil de ingresos y te ayuda a construir historial crediticio.'
      }
      if (product.id === 'tarjeta-gold' && user.income >= 2000000 && user.income < 5000000 && user.credits <= 2 && score >= 55) {
        match = 90
        reason = 'Con tus ingresos calificas para la Tarjeta Gold. Mejor tasa y mayor cupo que la Clasica.'
      }
      if (product.id === 'tarjeta-platinum' && user.income >= 5000000 && user.credits <= 1 && score >= 70) {
        match = 93
        reason = 'Tu perfil financiero es excelente. La Tarjeta Platinum te da acceso a beneficios premium como sala VIP y seguro de viaje.'
      }
    }

    if (product.id === 'credito-consumo') {
      const debtGoal = user.goals?.includes('Pagar mis deudas')
      if (debtGoal && user.credits >= 2 && score >= 45) {
        match = 85
        reason = `Tienes ${user.credits} creditos activos. Una compra de cartera con Serfinanza podria unificarlos en una sola cuota con mejor tasa.`
      }
    }

    if (product.id === 'app-serfinanza') {
      match = 100
      reason = 'La App Serfinanza es gratuita y te permite gestionar todos tus productos desde el celular. Es el canal mas rapido para todo.'
    }

    if (match > 0) {
      results.push({ ...product, matchScore: match, matchReason: reason })
    }
  })

  return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 4)
}

export const getProductRecommendationPrompt = (user) => {
  const recommendations = getRecommendedProducts(user)
  if (recommendations.length === 0) return ''
  const list = recommendations.map((p) => `- ${p.name} (${p.category}): ${p.matchReason}`).join('\n')
  return `
PRODUCTOS SERFINANZA RECOMENDADOS PARA ESTE CLIENTE:
${list}

Cuando sea natural en la conversacion, menciona estos productos de forma proactiva.
Usa frases como: "Basado en tu perfil, creo que el [producto] podria interesarte porque..."
Incluye al final de tu mensaje una linea especial con este formato EXACTO cuando recomiedes un producto:
[RECOMENDAR_PRODUCTO:id_del_producto]
Solo incluye esa linea cuando menciones activamente un producto.`
}

