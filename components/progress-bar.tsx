interface ProgressBarProps {
  progress: number
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ progress, currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progresso</span>
            <span key={currentStep} className="text-sm text-muted-foreground animate-in fade-in zoom-in duration-300">
              {currentStep}/{totalSteps}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out shadow-lg shadow-primary/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
