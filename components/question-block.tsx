"use client"

import type { Question } from "@/lib/questions"
import { scaleLabels } from "@/lib/questions"
import { Card, CardContent } from "@/components/ui/card"

interface QuestionBlockProps {
  question: Question
  value?: number
  onChange: (value: number) => void
}

export function QuestionBlock({ question, value, onChange }: QuestionBlockProps) {
  return (
    <Card className="bg-card border-border mb-8">
      <CardContent className="pt-8 pb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-8 text-balance leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                value === score
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-[1.02]"
                  : "border-border bg-input hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.01]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground text-sm md:text-base">
                  {scaleLabels[score as keyof typeof scaleLabels]}
                </span>
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-2 ${
                    value === score ? "border-primary bg-primary scale-110" : "border-border"
                  }`}
                >
                  {value === score && (
                    <svg
                      className="w-5 h-5 text-primary-foreground animate-in zoom-in duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>1 - Inexistente</span>
            <span>5 - Está tudo bem</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
