import type { MaturityLevel } from "@/lib/scoring"
import { getMaturityColor } from "@/lib/scoring"

interface MaturityBadgeProps {
  level: MaturityLevel
  score: number
}

export function MaturityBadge({ level, score }: MaturityBadgeProps) {
  return (
    <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border-2 border-primary/30">
      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Nível de Maturidade</div>
      <div className={`text-4xl md:text-5xl font-bold ${getMaturityColor(level)}`}>{level}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-bold text-foreground">{score.toFixed(1)}</span>
        <span className="text-2xl text-muted-foreground">/5.0</span>
      </div>
    </div>
  )
}
