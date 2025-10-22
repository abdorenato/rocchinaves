export type Question = {
  id: string
  pillar: "Pessoas" | "Processos" | "Plataformas"
  area: "Marketing" | "Comunicação" | "Vendas"
  question: string
  gapFeedback: {
    "1": string
    "2": string
    "3": string
    "4": string
    "5": string
  }
}

export type Answer = {
  questionId: string
  value: number // 1-5
}

// Official scale labels from DOC 3.1
export const scaleLabels = {
  1: "Inexistente — não temos isso estruturado",
  2: "Inicial — intenção/rascunho, sem método nem métrica",
  3: "Parcial — acontece às vezes, sem cadência/integração",
  4: "Quase lá — existe e roda, falta padronizar/otimizar",
  5: "Está tudo bem — estado ideal para o estágio atual",
}

// 18 official questions with contextual GAP feedback
export const QUESTIONS: Question[] = [
  // ===== PESSOAS × MARKETING =====
  {
    id: "pessoas_marketing_1",
    pillar: "Pessoas",
    area: "Marketing",
    question:
      "O time de marketing entende claramente como seu trabalho impacta as metas comerciais (pipeline, conversão e receita)?",
    gapFeedback: {
      "1": "Voo Solo: Marketing atua isolado das metas de vendas. Traduza objetivos comerciais em KPIs de marketing (MQL→SQL, CAC, ROI) e socialize-os.",
      "2": "Voo Solo: Existe intenção de alinhar, mas sem métricas conjuntas. Crie um quadro simples de metas compartilhadas e apresente quinzenalmente.",
      "3": "Turbulência: Integração ocasional. Agende rituais mensais MKT+Vendas com revisão de funil e aprendizado de campanhas.",
      "4": "Formação de Frota: Alinhado, porém sem otimização contínua. Conecte metas a experimentos com hipóteses e critérios de sucesso.",
      "5": "Torre de Controle: Excelente — marketing orientado a metas comerciais e aprendizado recorrente.",
    },
  },
  {
    id: "pessoas_marketing_2",
    pillar: "Pessoas",
    area: "Marketing",
    question:
      "Papéis e responsabilidades de marketing (planejamento, mídia, conteúdo, analytics) estão claros e atribuídos a donos?",
    gapFeedback: {
      "1": "Voo Solo: Falta definição de papéis → sobrecarga no fundador. Mapeie RACI simples (Responsável/Aprovador/Consultado/Informado).",
      "2": "Voo Solo: Há rascunho, mas confuso. Publique um organograma funcional mínimo com exemplos de entregas por função.",
      "3": "Turbulência: Papéis existem, mas há sobreposição. Elimine ambiguidade e adote checklists por função.",
      "4": "Formação de Frota: Quase lá. Adicione metas por função e cadência de 1:1 para desbloquear gargalos.",
      "5": "Torre de Controle: Clareza de papéis consolidada — mantenha revisões trimestrais.",
    },
  },

  // ===== PESSOAS × COMUNICAÇÃO =====
  {
    id: "pessoas_comunicacao_1",
    pillar: "Pessoas",
    area: "Comunicação",
    question: "Existe alinhamento interno sobre posicionamento e tom de voz da marca (o que dizer, como e por quê)?",
    gapFeedback: {
      "1": "Voo Solo: Cada um comunica de um jeito. Escreva um one-pager de posicionamento e tom de voz.",
      "2": "Voo Solo: Diretrizes soltas. Construa guia de 1 página com exemplos bons/ruins para padronizar.",
      "3": "Turbulência: Alinhamento parcial. Faça um training curto com líderes e atendimento/SDR.",
      "4": "Formação de Frota: Falta reforço contínuo. Adote revisão bimestral com amostras reais.",
      "5": "Torre de Controle: Excelente — coerência e clareza percebidas por todos.",
    },
  },
  {
    id: "pessoas_comunicacao_2",
    pillar: "Pessoas",
    area: "Comunicação",
    question:
      "Há porta-vozes treinados e responsáveis por aprovar mensagens sensíveis e responder a situações críticas?",
    gapFeedback: {
      "1": "Voo Solo: Risco reputacional alto. Defina porta-vozes e crie um fluxo mínimo de aprovação.",
      "2": "Voo Solo: Nomes existem, sem preparo. Faça media training básico e script de respostas.",
      "3": "Turbulência: Aprovam, mas reagem tarde. Implante monitoramento e critérios de escalonamento.",
      "4": "Formação de Frota: Falta simulação. Rode drills trimestrais de crise.",
      "5": "Torre de Controle: Muito bom — porta-vozes preparados e ágeis.",
    },
  },

  // ===== PESSOAS × VENDAS =====
  {
    id: "pessoas_vendas_1",
    pillar: "Pessoas",
    area: "Vendas",
    question:
      "O perfil e a capacitação do time comercial (prospecção, qualificação, fechamento) atendem ao ciclo de vendas atual?",
    gapFeedback: {
      "1": "Voo Solo: Falta perfil e treino. Defina competências por etapa (SDR/Closer) e trilha básica de capacitação.",
      "2": "Voo Solo: Existe gente boa, mas sem método. Padronize roteiro de discovery e objeções.",
      "3": "Turbulência: Capacitação pontual. Institua roleplays quinzenais e shadowing.",
      "4": "Formação de Frota: Quase lá. Acompanhe métricas individuais e feedback 1:1.",
      "5": "Torre de Controle: Excelente — time com fit e evolução contínua.",
    },
  },
  {
    id: "pessoas_vendas_2",
    pillar: "Pessoas",
    area: "Vendas",
    question:
      "Papéis e metas (SDR, Closer, CS) estão claros e conectados a indicadores (taxa de contato, SQLs, win-rate, churn)?",
    gapFeedback: {
      "1": "Voo Solo: Sem clareza de papéis/Metas. Publique metas simples por função e defina 3 métricas-chave.",
      "2": "Voo Solo: Metas existem, não mensuradas. Crie painel básico por função (planilha/CRM).",
      "3": "Turbulência: Medem, mas não agem. Faça rituais semanais de revisão e planos de ação.",
      "4": "Formação de Frota: Ajuste fino. Inclua metas de qualidade (Ciclo, Ticket, NPS).",
      "5": "Torre de Controle: Ótimo — metas e indicadores bem conectados.",
    },
  },

  // ===== PROCESSOS × MARKETING =====
  {
    id: "processos_marketing_1",
    pillar: "Processos",
    area: "Marketing",
    question:
      "Existe planejamento de campanhas com metas, orçamento, hipóteses e critérios de sucesso definidos antes de rodar?",
    gapFeedback: {
      "1": "Voo Solo: Ação sem plano. Use um canvas simples (objetivo, público, oferta, métrica).",
      "2": "Voo Solo: Planeja sem métricas. Adicione hipóteses e KPIs antes do lançamento.",
      "3": "Turbulência: Planeja, mas não revisa. Institua post-mortem de campanha.",
      "4": "Formação de Frota: Falta versionamento. Crie backlog de experimentos priorizados.",
      "5": "Torre de Controle: Excelente — campanhas orientadas por método.",
    },
  },
  {
    id: "processos_marketing_2",
    pillar: "Processos",
    area: "Marketing",
    question: "O funil MQL→SQL é definido e compartilhado com vendas (critérios, SLA e handoff)?",
    gapFeedback: {
      "1": "Voo Solo: Sem definição de MQL/SQL. Acorde critérios mínimos e gere exemplo real.",
      "2": "Voo Solo: Critérios vagos. Documente SLA (prazos/responsáveis) e encaminhamento.",
      "3": "Turbulência: Handoff irregular. Automatize passagem no CRM e notificações.",
      "4": "Formação de Frota: Falta auditoria. Faça amostragens semanais de qualidade.",
      "5": "Torre de Controle: Muito bom — funil integrado e auditado.",
    },
  },

  // ===== PROCESSOS × COMUNICAÇÃO =====
  {
    id: "processos_comunicacao_1",
    pillar: "Processos",
    area: "Comunicação",
    question:
      "Existe calendário editorial integrado (interna/externa) com processos de briefing, aprovação e publicação?",
    gapFeedback: {
      "1": "Voo Solo: Conteúdo ad-hoc. Crie calendário mensal simples e fluxos de aprovação.",
      "2": "Voo Solo: Calendário existe, mas para inglês ver. Defina DRI (responsável) por peça.",
      "3": "Turbulência: Publica sem medir. Vincule cada peça a um objetivo e métrica.",
      "4": "Formação de Frota: Falta retro. Faça retro bimestral com insights por canal.",
      "5": "Torre de Controle: Excelente — editorial integrado e orientado a objetivos.",
    },
  },
  {
    id: "processos_comunicacao_2",
    pillar: "Processos",
    area: "Comunicação",
    question:
      "Há rituais de comunicação interna (reuniões, newsletters, mural digital) que garantem alinhamento e coerência?",
    gapFeedback: {
      "1": "Voo Solo: Alinhamento por boato. Institua um ritual mínimo semanal.",
      "2": "Voo Solo: Rituais irregulares. Padronize pauta, responsáveis e tempo.",
      "3": "Turbulência: Reúne, mas não decide. Termine com decisões e responsáveis.",
      "4": "Formação de Frota: Falta medir eficácia. Pesquisas pulso trimestrais.",
      "5": "Torre de Controle: Muito bom — rituais consistentes e úteis.",
    },
  },

  // ===== PROCESSOS × VENDAS =====
  {
    id: "processos_vendas_1",
    pillar: "Processos",
    area: "Vendas",
    question: "O playbook comercial está documentado (etapas, critérios de avanço, scripts de discovery e follow-up)?",
    gapFeedback: {
      "1": "Voo Solo: Vendas por instinto. Documente etapas e critérios mínimos.",
      "2": "Voo Solo: Documento existe, não é usado. Traga para o dia a dia com cheatsheets.",
      "3": "Turbulência: Uso parcial. Conecte o playbook ao CRM (campos obrigatórios).",
      "4": "Formação de Frota: Falta melhoria contínua. Revise trimestralmente com dados.",
      "5": "Torre de Controle: Excelente — playbook vivo e aderente.",
    },
  },
  {
    id: "processos_vendas_2",
    pillar: "Processos",
    area: "Vendas",
    question:
      "Existe cadência de pipeline review (semanal/quinzenal) com ações claras por etapa e previsão de fechamento?",
    gapFeedback: {
      "1": "Voo Solo: Sem revisão de pipeline. Agende uma rotina curta semanal.",
      "2": "Voo Solo: Reúne, mas não direciona. Registre ações e prazos por oportunidade.",
      "3": "Turbulência: Direciona, mas não acompanha. Retorne nas pendências na reunião seguinte.",
      "4": "Formação de Frota: Quase lá. Inclua forecast e razões de perda padronizadas.",
      "5": "Torre de Controle: Muito bom — pipeline com ritmo e previsibilidade.",
    },
  },

  // ===== PLATAFORMAS × MARKETING =====
  {
    id: "plataformas_marketing_1",
    pillar: "Plataformas",
    area: "Marketing",
    question:
      "Ferramentas de marketing (ads, analytics, automação) estão integradas e permitem atribuição confiável de resultados?",
    gapFeedback: {
      "1": "Voo Solo: Dados dispersos. Conecte fontes em um painel único (mesmo que planilha).",
      "2": "Voo Solo: Integrações básicas. Adote parâmetros e convenções de UTMs.",
      "3": "Turbulência: Mede, mas atribui mal. Revise modelo de atribuição e tags.",
      "4": "Formação de Frota: Falta granularidade. Crie vistas por campanha/oferta/persona.",
      "5": "Torre de Controle: Excelente — analytics confiável para decisões.",
    },
  },
  {
    id: "plataformas_marketing_2",
    pillar: "Plataformas",
    area: "Marketing",
    question: "Existe automação mínima (nutrição, réguas de contatos, remarketing) conectada ao CRM?",
    gapFeedback: {
      "1": "Voo Solo: Zero automação. Comece com uma régua simples de 3 etapas.",
      "2": "Voo Solo: Automação solta. Integre com CRM para gatilhos de etapa.",
      "3": "Turbulência: Flui, mas não segmenta. Aplique segmentação por engajamento/fit.",
      "4": "Formação de Frota: Falta testes A/B. Experimente assunto/CTA/oferta.",
      "5": "Torre de Controle: Muito bom — fluxo automatizado e conectado.",
    },
  },

  // ===== PLATAFORMAS × COMUNICAÇÃO =====
  {
    id: "plataformas_comunicacao_1",
    pillar: "Plataformas",
    area: "Comunicação",
    question:
      "Canais e ferramentas de comunicação (site, blog, redes, e-mail) estão conectados e versionados (CMS, DAM)?",
    gapFeedback: {
      "1": "Voo Solo: Conteúdo espalhado. Implante CMS simples e pasta-mãe organizada.",
      "2": "Voo Solo: CMS existe, sem governança. Defina donos e padrões de versão.",
      "3": "Turbulência: Publica, mas perde ativos. Adote DAM ou taxonomia rígida.",
      "4": "Formação de Frota: Falta auditoria. Faça varreduras trimestrais de links/SEO.",
      "5": "Torre de Controle: Excelente — ecossistema conectado e governado.",
    },
  },
  {
    id: "plataformas_comunicacao_2",
    pillar: "Plataformas",
    area: "Comunicação",
    question:
      "Atendimento e relacionamento (inbox social, WhatsApp, e-mail) têm SLA e registro no CRM para histórico único?",
    gapFeedback: {
      "1": "Voo Solo: Conversas se perdem. Centralize contatos e crie campos mínimos.",
      "2": "Voo Solo: Registro parcial. Padronize SLA e motivo de contato.",
      "3": "Turbulência: Integração manual. Automatize captura via conectores/API.",
      "4": "Formação de Frota: Falta QA de qualidade. Amostre e avalie atendimentos.",
      "5": "Torre de Controle: Muito bom — relacionamento integrado e rastreável.",
    },
  },

  // ===== PLATAFORMAS × VENDAS =====
  {
    id: "plataformas_vendas_1",
    pillar: "Plataformas",
    area: "Vendas",
    question: "O CRM é adotado pelo time (campos obrigatórios, atualizações) e reflete a realidade do pipeline?",
    gapFeedback: {
      "1": "Voo Solo: CRM ignorado. Simplifique campos e cobre atualização diária.",
      "2": "Voo Solo: Uso esporádico. Vincule comissões/avaliação ao hygiene do CRM.",
      "3": "Turbulência: Atualiza sem padrão. Defina campos obrigatórios por etapa.",
      "4": "Formação de Frota: Falta auditoria e coaching. Faça QA semanal de registros.",
      "5": "Torre de Controle: Excelente — CRM confiável e vivo.",
    },
  },
  {
    id: "plataformas_vendas_2",
    pillar: "Plataformas",
    area: "Vendas",
    question:
      "Há painéis (dashboards) para líderes e para o dono com métricas-chave (forecast, ciclo, win-rate, ticket)?",
    gapFeedback: {
      "1": "Voo Solo: Sem visão. Monte um painel mínimo (forecast, funil, ganhos/perdas).",
      "2": "Voo Solo: Painel existe, desatualizado. Automatize fontes e atualizações.",
      "3": "Turbulência: Vê números, age pouco. Crie rituais de decisão a partir do painel.",
      "4": "Formação de Frota: Falta granularidade por time/canal. Adicione filtros e metas.",
      "5": "Torre de Controle: Muito bom — gestão orientada por dados.",
    },
  },
]

// Backward compatibility: export as 'questions' (lowercase)
export const questions = QUESTIONS
