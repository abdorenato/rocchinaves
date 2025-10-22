import { type NextRequest, NextResponse } from "next/server"

interface Question {
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

/**
 * POST /api/update-gaps
 * Deprecated endpoint - questions are now managed in lib/questions.ts
 * Returns informational message
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const adminToken = formData.get("adminToken") as string

    if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Token admin inválido" }, { status: 401 })
    }

    return NextResponse.json({
      success: false,
      message: "Este endpoint foi descontinuado. As perguntas são gerenciadas diretamente em lib/questions.ts",
      note: "Para atualizar perguntas, edite o arquivo lib/questions.ts e faça deploy",
    })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao processar requisição" },
      { status: 500 },
    )
  }
}
