import { getRiskColor, getRiskBg } from '../utils/adminFinance'

export default function RiskBadge({ level, size = 'md' }) {
  const labels = {
    bajo: 'Bajo',
    moderado: 'Moderado',
    alto: 'Alto',
    critico: 'Crítico'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  return (
    <span className={`rounded-full border font-semibold ${getRiskBg(level)} ${sizes[size]}`}>
      {labels[level] || level}
    </span>
  )
}
