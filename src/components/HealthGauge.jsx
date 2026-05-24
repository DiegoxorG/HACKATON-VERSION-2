import { getHealthLabel } from '../utils/adminFinance'

export default function HealthGauge({ score, size = 'md' }) {
  const label = getHealthLabel(score)
  
  const sizes = {
    sm: { w: 'w-24', h: 'h-24', text: 'text-2xl', textLabel: 'text-xs' },
    md: { w: 'w-32', h: 'h-32', text: 'text-4xl', textLabel: 'text-sm' },
    lg: { w: 'w-48', h: 'h-48', text: 'text-6xl', textLabel: 'text-base' }
  }
  
  const s = sizes[size]
  const circumference = 188.4 // 2 * Math.PI * 30
  const offset = circumference * (1 - score / 100)
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        <svg className={`${s.w} ${s.h} transform -rotate-90`} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="30" fill="none" stroke="#334155" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke={label.color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute text-center">
          <p className={`font-bold ${s.text}`} style={{ color: label.color }}>
            {Math.round(score)}
          </p>
          <p className={`text-slate-400 ${s.textLabel}`}>de 100</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${label.bg}`}>
        {label.label}
      </span>
    </div>
  )
}
