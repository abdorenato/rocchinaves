"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressBar } from "@/components/progress-bar"
import { DIAGNOSIS_QUESTIONS } from "@/lib/questions"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const contactData = sessionStorage.getItem("contactData")
    if (!contactData) {
      router.push("/")
    }
  }, [router])

  const currentQuestion = DIAGNOSIS_QUESTIONS[currentQuestionIndex]
  const totalQuestions = DIAGNOSIS_QUESTIONS.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    if (errors[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: "" }))
    }
  }

  const validateCurrentQuestion = () => {
    if (currentQuestion.required && !answers[currentQuestion.id]?.trim()) {
      setErrors((prev) => ({ ...prev, [currentQuestion.id]: "Este campo é obrigatório" }))
      return false
    }
    return true
  }

  const handleNext = async () => {
    if (!validateCurrentQuestion()) {
      return
    }

    if (currentQuestionIndex === DIAGNOSIS_QUESTIONS.length - 1) {
      const contactData = sessionStorage.getItem("contactData")
      if (contactData) {
        const contact = JSON.parse(contactData)
        const mergedAnswers = {
          ...answers,
          contact_nome: contact.fullName,
          contact_email: contact.email,
          contact_telefone: contact.phone,
        }

        sessionStorage.setItem("quizAnswers", JSON.stringify(mergedAnswers))

        try {
          await fetch("/api/send-quiz-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contact: {
                name: contact.fullName,
                email: contact.email,
                phone: contact.phone,
              },
              answers: mergedAnswers,
            }),
          })
          console.log("[v0] Quiz data email sent to team")
        } catch (error) {
          console.error("[v0] Failed to send quiz data email:", error)
        }
      } else {
        sessionStorage.setItem("quizAnswers", JSON.stringify(answers))
      }

      router.push("/results")
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const canGoBack = currentQuestionIndex > 0
  const currentAnswer = answers[currentQuestion.id]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <ProgressBar progress={progress} currentStep={currentQuestionIndex + 1} totalSteps={totalQuestions} />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Step indicator */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-4">
              <span className="text-sm font-semibold text-primary">Diagnóstico Patrimonial</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Pergunta {currentQuestionIndex + 1} de {totalQuestions}
            </p>
          </div>

          {/* Question Card */}
          <Card className="bg-card border-border mb-8">
            <CardContent className="pt-8 pb-8">
              <Label
                htmlFor={currentQuestion.id}
                className="text-xl md:text-2xl font-semibold text-foreground mb-6 block"
              >
                {currentQuestion.label}
                {currentQuestion.required && <span className="text-primary ml-1">*</span>}
              </Label>

              {currentQuestion.type === "multipleChoice" ? (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleAnswer(currentQuestion.id, option)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                        currentAnswer === option
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-[1.02]"
                          : "border-border bg-input hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.01]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground text-sm md:text-base">{option}</span>
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-2 ${
                            currentAnswer === option ? "border-primary bg-primary scale-110" : "border-border"
                          }`}
                        >
                          {currentAnswer === option && (
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
              ) : (
                <Input
                  id={currentQuestion.id}
                  type={currentQuestion.type}
                  placeholder="Digite sua resposta"
                  value={currentAnswer || ""}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  className={`bg-input border-border text-foreground text-lg ${
                    errors[currentQuestion.id] ? "border-destructive" : ""
                  }`}
                />
              )}

              {errors[currentQuestion.id] && (
                <p className="text-sm text-destructive mt-2">{errors[currentQuestion.id]}</p>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={!canGoBack}
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Voltar
            </Button>

            <Button
              size="lg"
              onClick={handleNext}
              disabled={!currentAnswer}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 max-w-xs"
            >
              {currentQuestionIndex === DIAGNOSIS_QUESTIONS.length - 1 ? "Ver Resultados" : "Próxima"}
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
