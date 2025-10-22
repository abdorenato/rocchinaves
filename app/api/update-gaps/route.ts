import { put } from "@vercel/blob"
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const adminToken = formData.get("adminToken") as string

    if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Token admin inválido" }, { status: 401 })
    }

    if (!file) {
      return NextResponse.json({ error: "Arquivo não fornecido" }, { status: 400 })
    }

    const text = await file.text()
    const data = JSON.parse(text)

    if (!Array.isArray(data) || data.length !== 18) {
      return NextResponse.json({ error: "JSON deve conter exatamente 18 perguntas" }, { status: 400 })
    }

    const validPillars = ["Pessoas", "Processos", "Plataformas"]
    const validAreas = ["Marketing", "Comunicação", "Vendas"]

    for (const q of data) {
      if (
        !q.id ||
        !validPillars.includes(q.pillar) ||
        !validAreas.includes(q.area) ||
        !q.question ||
        !q.gapFeedback ||
        !q.gapFeedback["1"] ||
        !q.gapFeedback["2"] ||
        !q.gapFeedback["3"] ||
        !q.gapFeedback["4"] ||
        !q.gapFeedback["5"]
      ) {
        return NextResponse.json({ error: "Estrutura de pergunta inválida" }, { status: 400 })
      }
    }

    const filename = "current-gaps.json"

    const blob = await put(filename, text, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    })

    console.log("[v0] Gaps uploaded to Blob:", blob.url)

    return NextResponse.json({
      success: true,
      url: blob.url,
      message:
        "Perguntas atualizadas com sucesso! Configure GAPS_URL uma vez com esta URL e futuros uploads atualizarão automaticamente.",
    })
  } catch (error) {
    console.error("[v0] Error updating gaps:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao processar upload" },
      { status: 500 },
    )
  }
}
