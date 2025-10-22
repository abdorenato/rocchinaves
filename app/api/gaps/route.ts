import { NextResponse } from "next/server"
import { QUESTIONS, type Question } from "@/lib/questions"

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds
let cachedData: Question[] | null = null
let cacheTimestamp = 0

/**
 * Transform external JSON format to internal Question[] format
 * External format: { version, items: { "pillar_area_num": { "1": "...", ... } } }
 * Internal format: [{ id, pillar, area, question, gapFeedback: { "1": "...", ... } }]
 */
function transformExternalGaps(externalData: any): Question[] | null {
  try {
    // Check if it's the external format with "items"
    if (externalData.items && typeof externalData.items === "object") {
      console.log("[v0] Transforming external GAPs format")

      // Create a map of external GAPs by ID
      const externalGaps = externalData.items

      // Merge with hardcoded questions to get full structure
      const mergedQuestions = QUESTIONS.map((question) => {
        const externalGap = externalGaps[question.id]

        if (externalGap) {
          // Replace gapFeedback with external data
          return {
            ...question,
            gapFeedback: externalGap,
          }
        }

        // Keep original if no external data found
        return question
      })

      console.log("[v0] Successfully transformed external GAPs")
      return mergedQuestions
    }

    // If it's already in the correct format (array), return as-is
    if (Array.isArray(externalData)) {
      return externalData
    }

    return null
  } catch (error) {
    console.error("[v0] Error transforming external GAPs:", error)
    return null
  }
}

/**
 * GET /api/gaps
 * Returns questions with GAP feedback
 * Loads from external JSON (GAPS_URL) with 5-minute cache
 * Falls back to hardcoded questions if external source fails
 */
export async function GET() {
  try {
    const now = Date.now()
    const cacheExpired = now - cacheTimestamp > CACHE_TTL

    // Return cached data if still valid
    if (cachedData && !cacheExpired) {
      console.log("[v0] Serving GAPs from cache")
      return NextResponse.json({
        questions: cachedData,
        source: "cache",
        cachedAt: new Date(cacheTimestamp).toISOString(),
      })
    }

    // Try to load from external URL
    const gapsUrl = process.env.GAPS_URL

    if (gapsUrl) {
      console.log("[v0] Fetching GAPs from external URL:", gapsUrl)

      try {
        const response = await fetch(gapsUrl, {
          next: { revalidate: 300 }, // 5 minutes
        })

        if (response.ok) {
          try {
            const data = await response.json()

            const transformedData = transformExternalGaps(data)

            if (transformedData && transformedData.length > 0) {
              cachedData = transformedData
              cacheTimestamp = now

              console.log(`[v0] Successfully loaded ${transformedData.length} questions from external source`)
              return NextResponse.json({
                questions: cachedData,
                source: "external",
                loadedAt: new Date(now).toISOString(),
              })
            } else {
              console.warn("[v0] External GAPs format invalid or empty, using fallback")
            }
          } catch (jsonError) {
            console.warn("[v0] Failed to parse external GAPs as JSON, using fallback")
          }
        } else {
          console.warn(`[v0] External GAPs fetch failed with status ${response.status}, using fallback`)
        }
      } catch (fetchError) {
        console.warn(
          "[v0] Failed to fetch external GAPs (file may not exist yet), using fallback:",
          fetchError instanceof Error ? fetchError.message : "Unknown error",
        )
      }
    }

    // Fallback to hardcoded questions
    console.log("[v0] Using fallback hardcoded GAPs")
    cachedData = QUESTIONS
    cacheTimestamp = now

    return NextResponse.json({
      questions: QUESTIONS,
      source: "fallback",
      loadedAt: new Date(now).toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error loading GAPs:", error)

    // Return hardcoded questions on error
    return NextResponse.json({
      questions: QUESTIONS,
      source: "fallback-error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
