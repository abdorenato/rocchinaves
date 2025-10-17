import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface ReinforcementCardProps {
  pillar: string
  area: string
  text: string
  index: number
}

export function ReinforcementCard({ pillar, area, text, index }: ReinforcementCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">
              Ponto Forte {index + 1} • {pillar} + {area}
            </h3>
            <p className="text-muted-foreground leading-relaxed">{text}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
