"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"

interface WizardNavProps {
  onBack: () => void
  onNext: () => void
  canGoBack: boolean
  canProceed: boolean
  isLastQuestion: boolean
}

export function WizardNav({ onBack, onNext, canGoBack, canProceed, isLastQuestion }: WizardNavProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="outline"
        size="lg"
        onClick={onBack}
        disabled={!canGoBack}
        className="border-border text-foreground hover:bg-secondary bg-transparent"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      {isLastQuestion && (
        <Button
          size="lg"
          onClick={onNext}
          disabled={!canProceed}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        >
          Ver Resultados
          <CheckCircle className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  )
}
