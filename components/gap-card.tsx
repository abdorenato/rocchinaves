import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, AlertCircle, TrendingUp } from "lucide-react"
import type { GapFeedback, MaturityLevel } from "@/lib/scoring"

interface GapCardProps {
  gap: GapFeedback
  index: number
}

const maturityConfig: Record<
  MaturityLevel,
  {
    icon: typeof AlertTriangle
    iconColor: string
    bgColor: string
    borderColor: string
  }
> = {
  "Voo Solo": {
    icon: AlertTriangle,
    iconColor: "text-red-500",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
  },
  Turbulência: {
    icon: AlertCircle,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/30",
  },
  "Formação de Frota": {
    icon: TrendingUp,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
  },
  "Torre de Controle": {
    icon: TrendingUp,
    iconColor: "text-green-500",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
  },
}

export function GapCard({ gap, index }: GapCardProps) {
  const config = maturityConfig[gap.maturityLevel]
  const Icon = config.icon

  return (
    <Card className={`bg-card border ${config.borderColor} hover:border-primary/50 transition-colors`}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              Oportunidade {index + 1} <span className="text-muted-foreground">•</span>{" "}
              <span className="text-primary">
                {gap.pillar} + {gap.area}
              </span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">{gap.text}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
