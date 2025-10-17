import { QUESTIONS, type Question } from "./questions"

/**
 * Load questions dynamically from API
 * Falls back to hardcoded questions if API fails
 */
export async function loadQuestions(): Promise<Question[]> {
  try {
    const response = await fetch("/api/gaps", {
      cache: "no-store", // Always fetch fresh data
    })

    if (!response.ok) {
      console.warn("[v0] Failed to load questions from API, using fallback")
      return QUESTIONS
    }

    const data = await response.json()

    if (data.questions && Array.isArray(data.questions)) {
      console.log(`[v0] Loaded ${data.questions.length} questions from ${data.source}`)
      return data.questions
    }

    return QUESTIONS
  } catch (error) {
    console.error("[v0] Error loading questions:", error)
    return QUESTIONS
  }
}
