import type { Answer } from "./questions"
import { QUESTIONS } from "./questions"
import { generateNarrative, type Narrative } from "./narratives"

export interface GapFeedback {
  questionId: string
  pillar: string
  area: string
  score: number
  text: string
  maturityLevel: MaturityLevel
}

export type MaturityLevel = "Voo Solo" | "Turbulência" | "Formação de Frota" | "Torre de Controle"

export interface CellScore {
  cellId: string
  pillar: string
  area: string
  score: number
  questionScores: number[]
}

export interface PillarScore {
  pillar: string
  score: number
  cells: CellScore[]
}

export interface AreaScore {
  area: string
  score: number
  cells: CellScore[]
}

export interface ScoreResult {
  // Cell-level scores (9 cells)
  cellScores: CellScore[]

  // Pillar scores (3 rows: Pessoas, Processos, Plataformas)
  pillarScores: PillarScore[]

  // Area scores (3 columns: Marketing, Comunicação, Vendas)
  areaScores: AreaScore[]

  // Overall score (average of all 9 cells)
  overallScore: number

  // Maturity level classification
  maturityLevel: MaturityLevel

  // Metadata
  totalQuestions: number
  answeredQuestions: number

  // Narrative and gaps
  narrative: Narrative
  gaps: GapFeedback[]
  reinforcements: GapFeedback[]
}

/**
 * Calculate all scores from quiz answers
 * Based on DOC 2 — SCORING LOGIC AND VISUALIZATION
 */
export function calculateScores(answers: Answer[]): ScoreResult {
  // Step 1: Calculate cell scores (average of 2 questions per cell)
  const cellScores: CellScore[] = []

  // Group questions by cell
  const cellGroups = new Map<string, typeof QUESTIONS>()
  QUESTIONS.forEach((q) => {
    const cellId = `${q.pillar.toLowerCase()}-${q.area.toLowerCase()}`
    if (!cellGroups.has(cellId)) {
      cellGroups.set(cellId, [])
    }
    cellGroups.get(cellId)!.push(q)
  })

  // Calculate score for each cell
  cellGroups.forEach((cellQuestions, cellId) => {
    const questionScores = cellQuestions.map((q) => {
      const answer = answers.find((a) => a.questionId === q.id)
      return answer?.value || 0
    })

    const cellScore = questionScores.reduce((sum, score) => sum + score, 0) / questionScores.length

    cellScores.push({
      cellId,
      pillar: cellQuestions[0].pillar,
      area: cellQuestions[0].area,
      score: Number(cellScore.toFixed(2)),
      questionScores,
    })
  })

  // Step 2: Calculate pillar scores (average of 3 cells per row)
  const pillarScores: PillarScore[] = []
  const pillars = ["Pessoas", "Processos", "Plataformas"]

  pillars.forEach((pillar) => {
    const pillarCells = cellScores.filter((c) => c.pillar === pillar)
    const pillarScore = pillarCells.reduce((sum, cell) => sum + cell.score, 0) / pillarCells.length

    pillarScores.push({
      pillar,
      score: Number(pillarScore.toFixed(2)),
      cells: pillarCells,
    })
  })

  // Step 3: Calculate area scores (average of 3 cells per column)
  const areaScores: AreaScore[] = []
  const areas = ["Marketing", "Comunicação", "Vendas"]

  areas.forEach((area) => {
    const areaCells = cellScores.filter((c) => c.area === area)
    const areaScore = areaCells.reduce((sum, cell) => sum + cell.score, 0) / areaCells.length

    areaScores.push({
      area,
      score: Number(areaScore.toFixed(2)),
      cells: areaCells,
    })
  })

  // Step 4: Calculate overall score (average of all 9 cells)
  const overallScore = Number((cellScores.reduce((sum, cell) => sum + cell.score, 0) / cellScores.length).toFixed(2))

  // Step 5: Determine maturity level
  const maturityLevel = getMaturityLevel(overallScore)

  // Step 6: Generate narrative based on maturity level
  const narrative = generateNarrative(maturityLevel)

  // Step 7: Generate GAPs and reinforcements
  const answersMap: Record<string, number> = {}
  answers.forEach((a) => {
    answersMap[a.questionId] = a.value
  })

  const gaps = generateGaps(answersMap)
  const reinforcements = generateReinforcements(answersMap)

  return {
    cellScores,
    pillarScores,
    areaScores,
    overallScore,
    maturityLevel,
    totalQuestions: QUESTIONS.length,
    answeredQuestions: answers.length,
    narrative,
    gaps,
    reinforcements,
  }
}

/**
 * Determine maturity level based on overall score
 * Based on DOC 2 classification ranges
 */
export function getMaturityLevel(score: number): MaturityLevel {
  if (score >= 4.3) {
    return "Torre de Controle"
  }
  if (score >= 3.5) {
    return "Formação de Frota"
  }
  if (score >= 2.5) {
    return "Turbulência"
  }
  return "Voo Solo"
}

/**
 * Get maturity level description
 */
export function getMaturityDescription(level: MaturityLevel): string {
  const descriptions: Record<MaturityLevel, string> = {
    "Voo Solo":
      "Dependência total do dono. Operação caótica, sem processos estruturados. Marketing, Comunicação e Vendas funcionam de forma isolada e reativa.",
    Turbulência:
      "Esforços isolados sem método. Algumas iniciativas existem, mas falta integração e consistência. Resultados imprevisíveis.",
    "Formação de Frota":
      "Integração parcial com processos emergentes. As áreas começam a trabalhar juntas, mas ainda há gaps significativos na execução.",
    "Torre de Controle":
      "Sistema consolidado e previsível. Marketing, Comunicação e Vendas operam de forma integrada com processos maduros e tecnologia adequada.",
  }
  return descriptions[level]
}

/**
 * Get maturity level color for UI
 */
export function getMaturityColor(level: MaturityLevel): string {
  const colors: Record<MaturityLevel, string> = {
    "Voo Solo": "text-red-500",
    Turbulência: "text-orange-500",
    "Formação de Frota": "text-yellow-500",
    "Torre de Controle": "text-primary",
  }
  return colors[level]
}

/**
 * Generate GAP feedback from answers using question.gapFeedback
 * Shows ALL gaps for scores < 5, organized by maturity level
 */
export function generateGaps(answers: Record<string, number>): GapFeedback[] {
  const allGaps: GapFeedback[] = []

  for (const [questionId, value] of Object.entries(answers)) {
    const roundedScore = Math.floor(value)

    // Only show gaps for scores < 5
    if (roundedScore < 5) {
      const question = QUESTIONS.find((q) => q.id === questionId)
      if (question) {
        const text = question.gapFeedback[String(roundedScore) as "1" | "2" | "3" | "4"]

        if (text) {
          let maturityLevel: MaturityLevel
          if (roundedScore <= 2) {
            maturityLevel = "Voo Solo"
          } else if (roundedScore === 3) {
            maturityLevel = "Turbulência"
          } else {
            maturityLevel = "Formação de Frota"
          }

          allGaps.push({
            questionId,
            pillar: question.pillar,
            area: question.area,
            score: roundedScore,
            text,
            maturityLevel,
          })
        }
      }
    }
  }

  return allGaps.sort((a, b) => {
    // Priority order: Voo Solo (1-2) > Turbulência (3) > Formação de Frota (4)
    if (a.score !== b.score) {
      return a.score - b.score
    }
    // Then by area
    return a.area.localeCompare(b.area)
  })
}

/**
 * Generate positive reinforcements for scores of 5
 */
export function generateReinforcements(answers: Record<string, number>): GapFeedback[] {
  const reinforcements: GapFeedback[] = []

  for (const [questionId, value] of Object.entries(answers)) {
    if (Math.floor(value) === 5) {
      const question = QUESTIONS.find((q) => q.id === questionId)
      if (question) {
        const text = question.gapFeedback["5"]
        if (text) {
          reinforcements.push({
            questionId,
            pillar: question.pillar,
            area: question.area,
            score: 5,
            text,
          })
        }
      }
    }
  }

  return reinforcements.slice(0, 3) // Limit to 3 reinforcements
}
