/**
 * DOC 3 — NARRATIVE LOGIC AND FEEDBACK
 * Maturity level narratives with headlines, body text, and tone
 */

export type NarrativeTone = "provocativo" | "encorajador" | "validante" | "reconhecedor"

export interface Narrative {
  level: string
  headline: string
  body: string
  tone: NarrativeTone
}

/**
 * Generate narrative based on maturity level
 * Based on DOC 3 specifications
 */
export function generateNarrative(level: string): Narrative {
  const narratives: Record<string, Narrative> = {
    "Voo Solo": {
      level: "Voo Solo",
      headline: "Você está pilotando sozinho um avião potente — mas sem plano de voo.",
      body: "O crescimento da empresa ainda depende 100% de você. Há esforço e talento, mas falta sistema, integração e clareza. O próximo passo é sair do operacional e criar estrutura para o negócio voar sem a sua presença constante.",
      tone: "provocativo",
    },
    Turbulência: {
      level: "Turbulência",
      headline: "Seu avião já decolou — mas ainda enfrenta turbulências por falta de método.",
      body: "Você já tem resultados e estrutura básica, mas as áreas não operam com o mesmo ritmo. Marketing, comunicação e vendas ainda se movem de forma reativa. O foco agora é criar cadência e processos que sustentem o crescimento previsível.",
      tone: "encorajador",
    },
    "Formação de Frota": {
      level: "Formação de Frota",
      headline: "Você não está mais voando sozinho — está começando a formar sua frota.",
      body: "As áreas já se conversam e há sinais claros de integração. Agora o desafio é consolidar as rotinas e lideranças, aprimorar indicadores e padronizar processos. Você está muito perto de ativar o 'piloto automático' do negócio.",
      tone: "validante",
    },
    "Torre de Controle": {
      level: "Torre de Controle",
      headline: "Bem-vindo à Torre de Controle™ — você lidera de forma estratégica.",
      body: "Seu negócio opera com clareza, integração e dados reais. O próximo passo é pensar crescimento exponencial, inovação e replicabilidade. Continue aprimorando lideranças e mantendo o foco na visão de longo prazo.",
      tone: "reconhecedor",
    },
  }

  return narratives[level] || narratives["Voo Solo"]
}

/**
 * Get tone description for UI styling
 */
export function getToneColor(tone: NarrativeTone): string {
  const colors: Record<NarrativeTone, string> = {
    provocativo: "text-orange-400",
    encorajador: "text-yellow-400",
    validante: "text-primary",
    reconhecedor: "text-green-400",
  }
  return colors[tone]
}
