"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { QuestionBlock } from "@/components/question-block"
import { WizardNav } from "@/components/wizard-nav"
import { ProgressBar } from "@/components/progress-bar"
import { loadQuestions } from "@/lib/gaps-loader"
import type { Answer, Question } from "@/lib/questions"

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true)
      const loadedQuestions = await loadQuestions()
      setQuestions(loadedQuestions)
      setIsLoading(false)
    }
    fetchQuestions()
  }, [])

  if (isLoading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-card rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-card rounded w-32 mx-auto mb-8"></div>
              <div className="h-32 bg-card rounded mb-8"></div>
              <div className="h-12 bg-card rounded w-full"></div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">Carregando perguntas...</p>
          </div>
        </main>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  if (!currentQuestion) {
    console.log("[v0] Current question is undefined, index:", currentQuestionIndex, "total:", totalQuestions)
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-muted-foreground">Erro ao carregar pergunta. Por favor, recarregue a página.</p>
          </div>
        </main>
      </div>
    )
  }

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = { questionId, value }
        return updated
      }
      return [...prev, { questionId, value }]
    })

    setIsTransitioning(true)
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setIsTransitioning(false)
      } else {
        // Last question - save answers and navigate to results
        sessionStorage.setItem("quizAnswers", JSON.stringify(answers))
        router.push("/results")
      }
    }, 600)
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      sessionStorage.setItem("quizAnswers", JSON.stringify(answers))
      router.push("/results")
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id)
  const canProceed = currentAnswer !== undefined

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <ProgressBar progress={progress} currentStep={currentQuestionIndex + 1} totalSteps={totalQuestions} />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Context Info */}
          <div className="mb-8 text-center">
            <div
              key={`context-${currentQuestionIndex}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-4 animate-in fade-in slide-in-from-top-2 duration-500"
            >
              <span className="text-sm font-semibold text-primary">{currentQuestion.pillar}</span>
              <span className="text-muted-foreground">×</span>
              <span className="text-sm font-semibold text-foreground">{currentQuestion.area}</span>
            </div>
            <p
              key={`counter-${currentQuestionIndex}`}
              className="text-sm text-muted-foreground animate-in fade-in duration-500"
            >
              Pergunta {currentQuestionIndex + 1} de {totalQuestions}
            </p>
          </div>

          {/* Question */}
          <div
            key={currentQuestionIndex}
            className={`animate-in fade-in slide-in-from-right-4 duration-500 ${
              isTransitioning ? "animate-out fade-out slide-out-to-left-4" : ""
            }`}
          >
            <QuestionBlock
              question={currentQuestion}
              value={currentAnswer?.value}
              onChange={(value) => handleAnswer(currentQuestion.id, value)}
            />
          </div>

          {/* Navigation */}
          <WizardNav
            onBack={handleBack}
            onNext={handleNext}
            canGoBack={currentQuestionIndex > 0}
            canProceed={canProceed}
            isLastQuestion={currentQuestionIndex === totalQuestions - 1}
          />
        </div>
      </main>
    </div>
  )
}
