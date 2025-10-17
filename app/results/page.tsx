"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Loader2, CheckCircle2, AlertTriangle, Shield } from "lucide-react"

type RiskLevel = "low" | "medium" | "high" | "critical"

interface RiskAssessment {
  level: RiskLevel
  score: number
  title: string
  description: string
  risks: string[]
  opportunities: string[]
}

export default function ResultsPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null)
  const [isLoadingEmail, setIsLoadingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState("")

  useEffect(() => {
    const answersJson = sessionStorage.getItem("quizAnswers")

    if (!answersJson) {
      router.push("/")
      return
    }

    const parsedAnswers: Record<string, string> = JSON.parse(answersJson)
    setAnswers(parsedAnswers)

    // Calculate risk assessment
    const calculatedAssessment = calculateRiskAssessment(parsedAnswers)
    setAssessment(calculatedAssessment)
  }, [router])

  const handleSendEmail = async () => {
    if (!assessment || !answers) return

    console.log("[v0] Answers object:", answers)
    console.log("[v0] Contact nome:", answers.contact_nome)
    console.log("[v0] Contact email:", answers.contact_email)
    console.log("[v0] Contact telefone:", answers.contact_telefone)

    if (!answers.contact_nome || !answers.contact_email) {
      console.error("[v0] Missing contact data in answers")
      setEmailError("Dados de contato não encontrados. Por favor, reinicie o diagnóstico.")
      return
    }

    setIsLoadingEmail(true)
    setEmailError("")

    try {
      const emailData = {
        contact: {
          name: answers.contact_nome,
          email: answers.contact_email,
          phone: answers.contact_telefone || "",
        },
        assessment,
        answers,
      }

      console.log("[v0] Sending email data:", JSON.stringify(emailData, null, 2))

      const response = await fetch("/api/send-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })

      console.log("[v0] Response status:", response.status)

      const responseData = await response.json()
      console.log("[v0] Response data:", responseData)

      if (!response.ok) {
        throw new Error(responseData.error || "Falha ao enviar e-mail")
      }

      setEmailSent(true)
      setTimeout(() => {
        router.push("/success")
      }, 2000)
    } catch (err) {
      console.error("[v0] Error sending email:", err)
      setEmailError(err instanceof Error ? err.message : "Não foi possível enviar o e-mail. Tente novamente.")
      setIsLoadingEmail(false)
    }
  }

  if (!assessment) {
    return null
  }

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-orange-600"
      case "critical":
        return "text-red-600"
    }
  }

  const getRiskBgColor = (level: RiskLevel) => {
    switch (level) {
      case "low":
        return "bg-green-50 border-green-200"
      case "medium":
        return "bg-yellow-50 border-yellow-200"
      case "high":
        return "bg-orange-50 border-orange-200"
      case "critical":
        return "bg-red-50 border-red-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Seu Diagnóstico Patrimonial</h1>
            <p className="text-muted-foreground">
              Olá, <span className="text-foreground font-semibold">{answers.contact_nome}</span>! Aqui está sua análise
              personalizada.
            </p>
          </div>

          {/* Risk Level Badge */}
          <Card className={`mb-8 border-2 ${getRiskBgColor(assessment.level)}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${getRiskColor(assessment.level)} bg-white`}>
                  {assessment.level === "low" ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : assessment.level === "critical" ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : (
                    <Shield className="w-8 h-8" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className={`text-2xl font-bold mb-2 ${getRiskColor(assessment.level)}`}>{assessment.title}</h2>
                  <p className="text-foreground leading-relaxed">{assessment.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risks */}
          {assessment.risks.length > 0 && (
            <Card className="mb-6 border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Principais Riscos Identificados
                </h3>
                <ul className="space-y-3">
                  {assessment.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-orange-600 font-bold mt-1">•</span>
                      <span className="text-foreground leading-relaxed">{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Opportunities */}
          {assessment.opportunities.length > 0 && (
            <Card className="mb-8 border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Oportunidades de Melhoria
                </h3>
                <ul className="space-y-3">
                  {assessment.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-600 font-bold mt-1">•</span>
                      <span className="text-foreground leading-relaxed">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Email CTA */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Receba seu relatório completo</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Nossa equipe receberá seu diagnóstico e entrará em contato em breve com um relatório detalhado e
                recomendações personalizadas para otimização do seu patrimônio.
              </p>

              {emailSent ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    Diagnóstico enviado com sucesso!
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Em breve você receberá o contato da equipe Rocchi Naves com seu relatório completo.
                  </p>
                </div>
              ) : (
                <>
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
                        Enviar Diagnóstico
                      </>
                    )}
                  </Button>
                  {emailError && <p className="text-sm text-destructive mt-4">{emailError}</p>}
                </>
              )}

              <p className="text-xs text-muted-foreground mt-4">
                Seus dados estão protegidos e serão utilizados apenas para análise e contato da equipe Rocchi Naves.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function calculateRiskAssessment(answers: Record<string, string>): RiskAssessment {
  let riskScore = 0
  const risks: string[] = []
  const opportunities: string[] = []

  // Analyze property quantity
  const propertyQty = answers.diag_imoveis_qtd
  if (propertyQty === "3 a 5" || propertyQty === "Mais de 5") {
    riskScore += 2
    risks.push("Múltiplos imóveis em nome pessoal aumentam exposição tributária e sucessória")
  }

  // Analyze rental income
  const rentalIncome = answers.diag_renda_aluguel
  if (rentalIncome === "De R$ 15 mil a R$ 20 mil" || rentalIncome === "Acima de R$ 20 mil") {
    riskScore += 2
    risks.push("Renda de aluguel significativa pode ser otimizada com estrutura adequada")
  }

  // Analyze tax structure
  const taxStructure = answers.diag_regime_declaracao
  if (taxStructure === "Só como pessoa física") {
    riskScore += 3
    risks.push("Declaração apenas como pessoa física resulta em carga tributária mais alta")
    opportunities.push("Constituir holding patrimonial pode reduzir impostos em até 30%")
  } else if (taxStructure === "Tenho CNPJ mas não uso ativamente") {
    riskScore += 1
    opportunities.push("Ativar e estruturar corretamente o CNPJ existente")
  }

  // Analyze tax reform awareness
  const reformAwareness = answers.diag_simulacao_reforma
  if (reformAwareness === "Nunca pensei nisso") {
    riskScore += 2
    risks.push("Falta de planejamento para Reforma Tributária pode gerar custos inesperados")
  }

  // Analyze succession planning
  const succession = answers.diag_sucessao
  if (succession === "Nada definido") {
    riskScore += 3
    risks.push("Ausência de planejamento sucessório expõe herdeiros a custos elevados de inventário")
    opportunities.push("Implementar planejamento sucessório para proteger herdeiros")
  }

  // Analyze heir impact
  const heirImpact = answers.diag_impacto_herdeiros
  if (heirImpact === "Sim") {
    riskScore += 2
    risks.push("Herdeiros podem enfrentar dificuldades financeiras com ITCMD e custos de inventário")
  }

  // Analyze inventory knowledge
  const inventoryKnowledge = answers.diag_conhecimento_inventario
  if (inventoryKnowledge === "Não faço ideia") {
    riskScore += 1
    opportunities.push("Entender custos de inventário (ITCMD pode chegar a 8% do patrimônio)")
  }

  // Analyze asset protection
  const assetProtection = answers.diag_protecao_patrimonial
  if (assetProtection === "Não estão protegidos") {
    riskScore += 3
    risks.push("Imóveis desprotegidos estão vulneráveis a bloqueios judiciais e disputas")
    opportunities.push("Implementar blindagem patrimonial com holding e cláusulas de proteção")
  }

  // Analyze family risks
  const familyRisks = answers.diag_riscos_familiares
  if (familyRisks === "Sim, e é uma preocupação") {
    riskScore += 2
    risks.push("Risco de disputas familiares sobre imóveis")
    opportunities.push("Estabelecer governança familiar e acordos claros")
  }

  // Analyze willingness to restructure
  const willingness = answers.diag_disponibilidade
  if (willingness === "Sim, quero entender como fazer isso") {
    opportunities.push("Momento ideal para reestruturação patrimonial antes da Reforma Tributária")
  }

  // Determine risk level
  let level: RiskLevel
  let title: string
  let description: string

  if (riskScore >= 12) {
    level = "critical"
    title = "Risco Crítico - Ação Urgente Necessária"
    description =
      "Seu patrimônio está altamente exposto a riscos tributários e sucessórios. Recomendamos ação imediata para proteção e otimização."
  } else if (riskScore >= 8) {
    level = "high"
    title = "Risco Alto - Reestruturação Recomendada"
    description =
      "Identificamos vulnerabilidades significativas que podem impactar seu patrimônio. Reestruturação é altamente recomendada."
  } else if (riskScore >= 4) {
    level = "medium"
    title = "Risco Moderado - Melhorias Necessárias"
    description =
      "Seu patrimônio tem proteção parcial, mas há oportunidades importantes de otimização tributária e proteção."
  } else {
    level = "low"
    title = "Risco Baixo - Situação Controlada"
    description =
      "Seu patrimônio está relativamente bem estruturado, mas sempre há espaço para otimizações e melhorias."
  }

  return {
    level,
    score: riskScore,
    title,
    description,
    risks,
    opportunities,
  }
}
