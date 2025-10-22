export type Question = {
  id: string
  step: "contact" | "diagnosis"
  label: string
  type: "text" | "email" | "tel" | "multipleChoice"
  name: string
  options?: string[]
  required?: boolean
}

export type Answer = {
  questionId: string
  value: string
}

// Contact information questions (Step 1)
export const CONTACT_QUESTIONS: Question[] = [
  {
    id: "contact_nome",
    step: "contact",
    label: "Nome completo",
    type: "text",
    name: "nome",
    required: true,
  },
  {
    id: "contact_email",
    step: "contact",
    label: "E-mail",
    type: "email",
    name: "email",
    required: true,
  },
  {
    id: "contact_telefone",
    step: "contact",
    label: "Telefone (WhatsApp)",
    type: "tel",
    name: "telefone",
    required: true,
  },
]

// Patrimonial diagnosis questions (Step 2)
export const DIAGNOSIS_QUESTIONS: Question[] = [
  {
    id: "diag_imoveis_qtd",
    step: "diagnosis",
    label: "Quantos imóveis você possui atualmente em seu nome pessoal?",
    type: "multipleChoice",
    name: "imoveis_qtd",
    options: ["Nenhum", "1 a 2", "3 a 5", "Mais de 5"],
  },
  {
    id: "diag_imoveis_alugados",
    step: "diagnosis",
    label: "Algum desses imóveis está atualmente alugado?",
    type: "multipleChoice",
    name: "imoveis_alugados",
    options: ["Sim", "Não"],
  },
  {
    id: "diag_renda_aluguel",
    step: "diagnosis",
    label: "Qual a faixa aproximada de renda mensal com aluguéis recebida atualmente?",
    type: "multipleChoice",
    name: "renda_aluguel",
    options: [
      "Até R$ 5 mil",
      "De R$ 5 mil a R$ 10 mil",
      "De R$ 10 mil a R$ 15 mil",
      "De R$ 15 mil a R$ 20 mil",
      "Acima de R$ 20 mil",
    ],
  },
  {
    id: "diag_regime_declaracao",
    step: "diagnosis",
    label: "Você declara os imóveis e aluguéis como pessoa física ou por meio de pessoa jurídica (holding)?",
    type: "multipleChoice",
    name: "regime_declaracao",
    options: ["Só como pessoa física", "Tenho CNPJ mas não uso ativamente", "Já tenho uma holding patrimonial ativa"],
  },
  {
    id: "diag_simulacao_reforma",
    step: "diagnosis",
    label:
      "Você já simulou como a Reforma Tributária pode afetar seus rendimentos de aluguel e sua carga tributária nos próximos anos?",
    type: "multipleChoice",
    name: "simulacao_reforma",
    options: [
      "Nunca pensei nisso",
      "Tenho dúvidas e gostaria de entender melhor",
      "Já analisei e estou me organizando com um profissional",
    ],
  },
  {
    id: "diag_sucessao",
    step: "diagnosis",
    label: "Você tem um plano sucessório para os imóveis que possui?",
    type: "multipleChoice",
    name: "sucessao",
    options: [
      "Nada definido",
      "Tenho testamento",
      "Já conversei informalmente com a família",
      "Já tenho holding com cláusulas de sucessão",
    ],
  },
  {
    id: "diag_impacto_herdeiros",
    step: "diagnosis",
    label:
      "Seus herdeiros teriam dificuldades financeiras para arcar com ITCMD, cartórios e inventário se algo acontecesse com você?",
    type: "multipleChoice",
    name: "impacto_herdeiros",
    options: ["Sim", "Talvez", "Não, já está tudo resolvido"],
  },
  {
    id: "diag_conhecimento_inventario",
    step: "diagnosis",
    label: "Você conhece os custos reais de um inventário no Brasil (ITCMD + cartórios + honorários + tempo)?",
    type: "multipleChoice",
    name: "conhecimento_inventario",
    options: ["Não faço ideia", "Já ouvi falar por alto", "Já simulei e estou me preparando"],
  },
  {
    id: "diag_protecao_patrimonial",
    step: "diagnosis",
    label: "Seus imóveis estão protegidos contra bloqueios judiciais, divórcio, ações trabalhistas ou dívidas?",
    type: "multipleChoice",
    name: "protecao_patrimonial",
    options: ["Não estão protegidos", "Tenho cláusulas contratuais básicas", "Uso holding com blindagem jurídica"],
  },
  {
    id: "diag_riscos_familiares",
    step: "diagnosis",
    label: "Você tem sócios ou familiares envolvidos nos imóveis? Existe risco de disputa?",
    type: "multipleChoice",
    name: "riscos_familiares",
    options: ["Sim, e é uma preocupação", "Em parte", "Não, tudo bem resolvido"],
  },
  {
    id: "diag_disponibilidade",
    step: "diagnosis",
    label:
      "Considerando os impactos da Reforma Tributária, você estaria disposto(a) a reestruturar parte do seu patrimônio nos próximos 60 dias, caso isso te garantisse redução de imposto e proteção jurídica?",
    type: "multipleChoice",
    name: "disponibilidade",
    options: ["Não tenho interesse", "Depende dos custos e garantias", "Sim, quero entender como fazer isso"],
  },
]

// All questions combined
export const ALL_QUESTIONS = [...CONTACT_QUESTIONS, ...DIAGNOSIS_QUESTIONS]

// Export QUESTIONS as alias for ALL_QUESTIONS for files that still reference it
export const QUESTIONS = ALL_QUESTIONS

// Export empty scaleLabels for backward compatibility (no longer used in new system)
export const scaleLabels = {
  1: "Opção 1",
  2: "Opção 2",
  3: "Opção 3",
  4: "Opção 4",
  5: "Opção 5",
}
