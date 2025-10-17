import { z } from "zod"

// Zod schema for GAP feedback validation
export const GapFeedbackSchema = z.object({
  "1": z.string(),
  "2": z.string(),
  "3": z.string(),
  "4": z.string(),
  "5": z.string(),
})

export const QuestionSchema = z.object({
  id: z.string(),
  pillar: z.enum(["Pessoas", "Processos", "Plataformas"]),
  area: z.enum(["Marketing", "Comunicacao", "Vendas"]),
  question: z.string(),
  gapFeedback: GapFeedbackSchema,
})

export const QuestionsArraySchema = z.array(QuestionSchema)

export type QuestionData = z.infer<typeof QuestionSchema>
export type QuestionsArray = z.infer<typeof QuestionsArraySchema>
