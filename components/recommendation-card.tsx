import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

interface RecommendationCardProps {
  recommendation: string
  index: number
}

export function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">Recomendação {index + 1}</h3>
            <p className="text-muted-foreground leading-relaxed">{recommendation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
