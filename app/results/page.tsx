"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { RadarChart } from "@/components/radar-chart"
import { MaturityBadge } from "@/components/maturity-badge"
import { GapCard } from "@/components/gap-card"
import { ReinforcementCard } from "@/components/reinforcement-card"
import { ResultsLeadForm, type ContactData } from "@/components/results-lead-form"
import { calculateScores, getMaturityLevel, getMaturityColor } from "@/lib/scoring"
import type { ScoreResult, MaturityLevel } from "@/lib/scoring"
import type { Answer } from "@/lib/questions"
import type { EmailTemplateData } from "@/lib/emailTemplate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, TrendingUp, MessageCircle, Mail, Loader2 } from "lucide-react"

export default function ResultsPage() {
  const router = useRouter()
  const [scores, setScores] = useState<ScoreResult | null>(null)
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isLoadingEmail, setIsLoadingEmail] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [adminEmailSent, setAdminEmailSent] = useState(false)

  useEffect(() => {
    const answersJson = sessionStorage.getItem("quizAnswers")

    if (!answersJson) {
      router.push("/")
      return
    }

    const answers: Answer[] = JSON.parse(answersJson)

    // Calculate scores
    const calculatedScores = calculateScores(answers)
    setScores(calculatedScores)
  }, [router])

  useEffect(() => {
    if (showResults && scores && contactData && !adminEmailSent) {
      // Wait for charts to render, then send email to admin
      const sendAdminEmail = async () => {
        try {
          console.log("[v0] Waiting for charts to render before sending admin email...")
          await new Promise((resolve) => setTimeout(resolve, 2000))

          console.log("[v0] Looking for chart elements...")
          const radar3psDiv = document.getElementById("radar-3ps")
          const radarAreasDiv = document.getElementById("radar-areas")

          const radar3psCanvas = radar3psDiv?.querySelector("canvas")
          const radarAreasCanvas = radarAreasDiv?.querySelector("canvas")

          if (!radar3psCanvas || !radarAreasCanvas) {
            console.error("[v0] Charts not found, skipping admin email")
            return
          }

          const radar3psDataURL = radar3psCanvas.toDataURL("image/png")
          const radarAreasDataURL = radarAreasCanvas.toDataURL("image/png")

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
            isInternalCopy: true,
          }

          console.log("[v0] Sending admin notification email...")
          const response = await fetch("/api/send-results", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...emailData,
              adminEmail: "renatocamarotta@gmail.com",
            }),
          })

          if (response.ok) {
            console.log("[v0] Admin email sent successfully")
            setAdminEmailSent(true)
          } else {
            console.error("[v0] Failed to send admin email")
          }
        } catch (error) {
          console.error("[v0] Error sending admin email:", error)
        }
      }

      sendAdminEmail()
    }
  }, [showResults, scores, contactData, adminEmailSent])

  const handleLeadSubmit = (data: ContactData) => {
    setContactData(data)
    setShowResults(true)
    // Store contact data for email sending
    sessionStorage.setItem("contactData", JSON.stringify(data))
  }

  const scrollToGaps = () => {
    const gapsSection = document.getElementById("gaps-section")
    if (gapsSection) {
      gapsSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleSendEmail = async () => {
    if (!scores || !contactData) return

    setIsLoadingEmail(true)
    setEmailError("")

    try {
      console.log("[v0] Waiting for charts to render...")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("[v0] Looking for chart elements...")
      const radar3psDiv = document.getElementById("radar-3ps")
      const radarAreasDiv = document.getElementById("radar-areas")

      const radar3psCanvas = radar3psDiv?.querySelector("canvas")
      const radarAreasCanvas = radarAreasDiv?.querySelector("canvas")

      if (!radar3psCanvas || !radarAreasCanvas) {
        throw new Error("Não foi possível capturar os gráficos. Os elementos canvas não foram encontrados.")
      }

      const radar3psDataURL = radar3psCanvas.toDataURL("image/png")
      const radarAreasDataURL = radarAreasCanvas.toDataURL("image/png")

      if (radar3psDataURL.length < 100 || radarAreasDataURL.length < 100) {
        throw new Error("Os gráficos parecem estar vazios. Aguarde um momento e tente novamente.")
      }

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

      const response = await fetch("/api/send-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Falha ao enviar e-mail")
      }

      router.push("/success")
    } catch (err) {
      console.error("[v0] Error sending email:", err)
      setEmailError(err instanceof Error ? err.message : "Não foi possível enviar o e-mail. Tente novamente.")
      setIsLoadingEmail(false)
    }
  }

  if (!scores) {
    return null
  }

  if (!showResults) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Testimonial/CTA Content */}
            <div className="space-y-6">
              <div className="flex gap-6 items-start mb-6">
                <img
                  src="https://d8aklbmnnlaxwza3.public.blob.vercel-storage.com/renato-abdo-photo.png"
                  alt="Renato Abdo"
                  className="w-40 h-48 object-cover flex-shrink-0"
                />
                <div className="space-y-4 flex-1">
                  <p className="text-lg md:text-xl text-foreground leading-relaxed">
                    Você acaba de dar um passo importante para entender o que está travando o crescimento da sua
                    empresa.
                  </p>
                  <p className="text-lg md:text-xl text-foreground leading-relaxed">
                    Assim que preencher seus dados, você vai receber o diagnóstico que vai te direcionar em pontos
                    frágeis da sua operação.
                  </p>
                </div>
              </div>

              {/* Signature */}
              <div className="border-t border-border pt-4">
                <p className="text-lg font-bold text-foreground">Renato Abdo</p>
                <p className="text-sm text-muted-foreground">Estrategista de Negócios</p>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <ResultsLeadForm onSubmit={handleLeadSubmit} />
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Prepare chart data
  const pillarScores = scores.pillarScores.map((p) => p.score)
  const pillarChartData = {
    labels: scores.pillarScores.map((p) => p.pillar),
    datasets: [
      {
        label: "Pontuação 3Ps",
        data: pillarScores,
        backgroundColor: "rgba(108, 197, 211, 0.2)",
        borderColor: "rgba(108, 197, 211, 1)",
        borderWidth: 2,
        pointBackgroundColor: getPointColors(pillarScores),
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(108, 197, 211, 1)",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const areaScores = scores.areaScores.map((a) => a.score)
  const areaChartData = {
    labels: scores.areaScores.map((a) => a.area),
    datasets: [
      {
        label: "Pontuação M/C/V",
        data: areaScores,
        backgroundColor: "rgba(108, 197, 211, 0.2)",
        borderColor: "rgba(108, 197, 211, 1)",
        borderWidth: 2,
        pointBackgroundColor: getPointColors(areaScores),
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(108, 197, 211, 1)",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const gapsByMaturity = scores.gaps.reduce(
    (acc, gap) => {
      if (!acc[gap.maturityLevel]) {
        acc[gap.maturityLevel] = []
      }
      acc[gap.maturityLevel].push(gap)
      return acc
    },
    {} as Record<MaturityLevel, typeof scores.gaps>,
  )

  // Define order and labels for maturity levels
  const maturityLevels: { level: MaturityLevel; label: string; description: string }[] = [
    {
      level: "Voo Solo",
      label: "Voo Solo",
      description: "Prioridade crítica — estruturação básica necessária",
    },
    {
      level: "Turbulência",
      label: "Turbulência",
      description: "Prioridade alta — integração e consistência necessárias",
    },
    {
      level: "Formação de Frota",
      label: "Formação de Frota",
      description: "Prioridade média — otimização e padronização",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-6 mb-8">
            {/* Left: Greeting + Badge - takes 5 columns */}
            <div className="md:col-span-5 flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Seu Diagnóstico</h1>
              <p className="text-sm text-muted-foreground mb-4">
                Olá, <span className="text-foreground font-semibold">{contactData?.fullName}</span>! Aqui está sua
                análise de maturidade.
              </p>
              <div className="flex justify-start">
                <MaturityBadge level={scores.maturityLevel} score={scores.overallScore} />
              </div>
            </div>

            {/* Right: Narrative - takes 7 columns */}
            <div className="md:col-span-7">
              <Card className="bg-card border-border h-full">
                <CardContent className="p-6 flex flex-col justify-center h-full">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 text-balance">
                    {scores.narrative.headline}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed text-pretty">{scores.narrative.body}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 mb-8">
            <Button
              onClick={scrollToGaps}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Ver Análise Completa e Oportunidades
            </Button>
            <div className="flex flex-col items-center gap-1 animate-bounce">
              <ChevronDown className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">Role para baixo</span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-center">Radar 3Ps</CardTitle>
                <p className="text-xs text-muted-foreground text-center">Pessoas, Processos, Plataformas</p>
              </CardHeader>
              <CardContent className="pb-4">
                <RadarChart id="radar-3ps" data={pillarChartData} />
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-center">Radar M/C/V</CardTitle>
                <p className="text-xs text-muted-foreground text-center">Marketing, Comunicação, Vendas</p>
              </CardHeader>
              <CardContent className="pb-4">
                <RadarChart id="radar-areas" data={areaChartData} />
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">Pontuação por Pilar (3Ps)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {scores.pillarScores.map((pillar) => {
                const pillarLevel = getMaturityLevel(pillar.score)
                const pillarColor = getMaturityColor(pillarLevel)

                return (
                  <Card key={pillar.pillar} className="bg-card border-border">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className={`text-4xl font-bold ${pillarColor}`}>{pillar.score.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground text-center">de 5.0</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-semibold text-foreground mb-1">{pillar.pillar}</div>
                        <div className={`text-sm font-semibold ${pillarColor}`}>{pillarLevel}</div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">Pontuação por Área (M/C/V)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {scores.areaScores.map((area) => {
                const areaLevel = getMaturityLevel(area.score)
                const areaColor = getMaturityColor(areaLevel)

                return (
                  <Card key={area.area} className="bg-card border-border">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className={`text-4xl font-bold ${areaColor}`}>{area.score.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground text-center">de 5.0</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-semibold text-foreground mb-1">{area.area}</div>
                        <div className={`text-sm font-semibold ${areaColor}`}>{areaLevel}</div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {scores.gaps.length > 0 && (
            <div id="gaps-section" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Oportunidades de Melhoria</h2>
              <p className="text-muted-foreground text-center mb-8">
                Organizadas por nível de maturidade — priorize as mais críticas
              </p>

              <div className="space-y-8">
                {maturityLevels.map(({ level, label, description }) => {
                  const levelGaps = gapsByMaturity[level]
                  if (!levelGaps || levelGaps.length === 0) return null

                  const levelColor = getMaturityColor(level)

                  return (
                    <div key={level}>
                      <div className="mb-4">
                        <h3 className={`text-xl font-bold ${levelColor} mb-1`}>{label}</h3>
                        <p className="text-sm text-muted-foreground">{description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {levelGaps.length} {levelGaps.length === 1 ? "oportunidade" : "oportunidades"}
                        </p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {levelGaps.map((gap, index) => (
                          <GapCard key={gap.questionId} gap={gap} index={index} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {scores.reinforcements.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Pontos Fortes</h2>
              <p className="text-muted-foreground text-center mb-6">Continue mantendo essas práticas</p>
              <div className="grid md:grid-cols-2 gap-4">
                {scores.reinforcements.map((reinforcement, index) => (
                  <ReinforcementCard
                    key={reinforcement.questionId}
                    pillar={reinforcement.pillar}
                    area={reinforcement.area}
                    text={reinforcement.text}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 mb-12">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-start">
                  {/* Left: Photo + Signature */}
                  <div className="flex flex-col items-start gap-4">
                    <img
                      src="https://d8aklbmnnlaxwza3.public.blob.vercel-storage.com/renato-abdo-photo.png"
                      alt="Renato Abdo"
                      className="w-64 h-80 object-cover rounded-lg shadow-lg"
                    />
                    <div className="border-t border-border pt-4 w-full text-center">
                      <p className="text-lg font-bold text-foreground">Renato Abdo</p>
                      <p className="text-sm text-muted-foreground">Estrategista de Negócios</p>
                    </div>
                  </div>

                  {/* Right: Two content blocks stacked vertically */}
                  <div className="space-y-8">
                    {/* Block 1: Email Diagnostic */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-foreground">Receba seu diagnóstico completo</h2>
                      <p className="text-muted-foreground">
                        Enviaremos um relatório detalhado com seus resultados e recomendações para{" "}
                        <span className="text-primary font-semibold">{contactData?.email}</span>
                      </p>
                      <Button
                        size="lg"
                        onClick={handleSendEmail}
                        disabled={isLoadingEmail}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        {isLoadingEmail ? (
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
                      {emailError && <p className="text-sm text-destructive">{emailError}</p>}
                      <p className="text-xs text-muted-foreground">
                        Você receberá um e-mail com seus gráficos, pontuações detalhadas e recomendações personalizadas.
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border" />

                    {/* Block 2: Strategic Session */}
                    <div className="space-y-4">
                      <p className="text-lg text-foreground leading-relaxed font-semibold">
                        O Raio X que você acabou de ver é só o primeiro passo.
                      </p>
                      <p className="text-base text-foreground leading-relaxed">
                        Eu desenvolvi um processo chamado{" "}
                        <span className="font-semibold">Gap Analysis + Mapa Estratégico</span>, que mostra exatamente o
                        que precisa ser ajustado para sua empresa crescer sem depender de você o tempo todo.
                      </p>
                      <p className="text-base text-foreground leading-relaxed">
                        Se quiser entender o que os dados do seu diagnóstico realmente revelam, agende uma{" "}
                        <span className="font-semibold">Sessão Estratégica</span> comigo.
                      </p>
                      <p className="text-base text-foreground leading-relaxed">
                        É nessa conversa que a gente transforma números em direção — e problemas em plano de crescimento
                        real.
                      </p>
                      <Button
                        size="lg"
                        className="bg-[#25D366] hover:bg-[#20BA5A] text-black text-lg font-semibold shadow-lg hover:shadow-xl transition-all w-full"
                        asChild
                      >
                        <a
                          href="https://wa.me/5511999999999?text=Olá%2C%20gostaria%20de%20agendar%20uma%20Sessão%20Estratégica"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="mr-2 h-5 w-5" />
                          Agendar Sessão Estratégica
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function getPointColors(scores: number[]) {
  return scores.map((score) => {
    if (score >= 5) return "rgba(34, 197, 94, 1)" // green - Torre de Controle
    if (score >= 4) return "rgba(234, 179, 8, 1)" // yellow - Formação de Frota
    if (score >= 3) return "rgba(249, 115, 22, 1)" // orange - Turbulência
    return "rgba(239, 68, 68, 1)" // red - Voo Solo
  })
}
