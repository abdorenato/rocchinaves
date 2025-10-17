"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Loader2 } from "lucide-react"
import type { ScoreResult } from "@/lib/scoring"
import type { EmailTemplateData } from "@/lib/emailTemplate"

interface EmailResultsFormProps {
  scores: ScoreResult
  contactData: any
}

export function EmailResultsForm({ scores, contactData }: EmailResultsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendEmail = async () => {
    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Waiting for charts to render...")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("[v0] Looking for chart elements...")
      const radar3psDiv = document.getElementById("radar-3ps")
      const radarAreasDiv = document.getElementById("radar-areas")

      console.log("[v0] radar-3ps div found:", !!radar3psDiv)
      console.log("[v0] radar-areas div found:", !!radarAreasDiv)

      const radar3psCanvas = radar3psDiv?.querySelector("canvas")
      const radarAreasCanvas = radarAreasDiv?.querySelector("canvas")

      console.log("[v0] radar-3ps canvas found:", !!radar3psCanvas)
      console.log("[v0] radar-areas canvas found:", !!radarAreasCanvas)

      if (!radar3psCanvas || !radarAreasCanvas) {
        throw new Error("Não foi possível capturar os gráficos. Os elementos canvas não foram encontrados.")
      }

      const ctx3ps = radar3psCanvas.getContext("2d")
      const ctxAreas = radarAreasCanvas.getContext("2d")

      if (!ctx3ps || !ctxAreas) {
        throw new Error("Não foi possível acessar o contexto dos gráficos.")
      }

      console.log("[v0] Canvas dimensions - 3ps:", radar3psCanvas.width, "x", radar3psCanvas.height)
      console.log("[v0] Canvas dimensions - areas:", radarAreasCanvas.width, "x", radarAreasCanvas.height)

      let radar3psDataURL: string
      let radarAreasDataURL: string

      try {
        radar3psDataURL = radar3psCanvas.toDataURL("image/png")
        console.log("[v0] radar-3ps captured, length:", radar3psDataURL.length)
      } catch (err) {
        console.error("[v0] Error capturing radar-3ps:", err)
        throw new Error("Erro ao capturar gráfico 3Ps")
      }

      try {
        radarAreasDataURL = radarAreasCanvas.toDataURL("image/png")
        console.log("[v0] radar-areas captured, length:", radarAreasDataURL.length)
      } catch (err) {
        console.error("[v0] Error capturing radar-areas:", err)
        throw new Error("Erro ao capturar gráfico de áreas")
      }

      if (radar3psDataURL.length < 100 || radarAreasDataURL.length < 100) {
        throw new Error("Os gráficos parecem estar vazios. Aguarde um momento e tente novamente.")
      }

      console.log("[v0] Preparing email data...")
      const emailData: EmailTemplateData = {
        contact: {
          name: contactData.fullName,
          email: contactData.email,
          company: contactData.company,
          segment: contactData.segment,
          revenue: contactData.annualRevenue,
          phone: contactData.phone,
        },
        scores: {
          overall: scores.overallScore,
          pillars: {
            pessoas: scores.pillarScores.find((p) => p.pillar === "Pessoas")?.score || 0,
            processos: scores.pillarScores.find((p) => p.pillar === "Processos")?.score || 0,
            plataformas: scores.pillarScores.find((p) => p.pillar === "Plataformas")?.score || 0,
          },
          areas: {
            marketing: scores.areaScores.find((a) => a.area === "Marketing")?.score || 0,
            comunicacao: scores.areaScores.find((a) => a.area === "Comunicação")?.score || 0,
            vendas: scores.areaScores.find((a) => a.area === "Vendas")?.score || 0,
          },
        },
        narrative: {
          level: scores.maturityLevel,
          headline: scores.narrative.headline,
          body: scores.narrative.body,
        },
        gaps: scores.gaps.map((gap) => ({
          pillar: gap.pillar,
          area: gap.area,
          text: gap.text,
          maturityLevel: gap.maturityLevel,
        })),
        strengths: scores.reinforcements.map((reinforcement) => ({
          pillar: reinforcement.pillar,
          area: reinforcement.area,
          text: reinforcement.text,
        })),
        charts: {
          radar3ps: radar3psDataURL,
          radarAreas: radarAreasDataURL,
        },
      }

      console.log("[v0] Sending email request...")
      const response = await fetch("/api/send-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("[v0] Email API error:", errorData)
        throw new Error(errorData.error || "Falha ao enviar e-mail")
      }

      console.log("[v0] Email sent successfully!")
      // Navigate to success page
      router.push("/success")
    } catch (err) {
      console.error("[v0] Error sending email:", err)
      setError(err instanceof Error ? err.message : "Não foi possível enviar o e-mail. Tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-card border-border border-2 border-primary/30">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Receba seu diagnóstico completo</CardTitle>
        <CardDescription className="text-base">
          Enviaremos um relatório detalhado com seus resultados e recomendações para{" "}
          <span className="text-primary font-semibold">{contactData.email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Button
          size="lg"
          onClick={handleSendEmail}
          disabled={isLoading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5 mr-2" />
              Enviar Diagnóstico por E-mail
            </>
          )}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <p className="text-xs text-muted-foreground text-center max-w-md">
          Você receberá um e-mail com seus gráficos, pontuações detalhadas e recomendações personalizadas.
        </p>
      </CardContent>
    </Card>
  )
}
