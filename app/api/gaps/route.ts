import { NextResponse } from "next/server"
import { QUESTIONS } from "@/lib/questions"

/**
 * GET /api/gaps
 * Returns questions for the patrimonial diagnosis
 * Uses hardcoded questions from lib/questions.ts
 */
export async function GET() {
  try {
    return NextResponse.json({
      questions: QUESTIONS,
      source: "hardcoded",
      loadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error loading questions:", error)

    return NextResponse.json({
      questions: QUESTIONS,
      source: "fallback-error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
