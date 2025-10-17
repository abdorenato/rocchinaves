import { type NextRequest, NextResponse } from "next/server"
import { QuestionsArraySchema } from "@/lib/gaps-schema"

/**
 * POST /api/gaps-upload
 * Admin endpoint to validate questions JSON structure
 * Requires ADMIN_TOKEN for authentication
 * Validates JSON structure with Zod schema
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const adminToken = process.env.ADMIN_TOKEN

    if (!adminToken) {
      return NextResponse.json({ error: "Admin token not configured on server" }, { status: 500 })
    }

    if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing token" }, { status: 401 })
    }

    // Parse and validate JSON
    const body = await request.json()

    // Validate with Zod schema
    const validationResult = QuestionsArraySchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid JSON structure",
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const questions = validationResult.data

    return NextResponse.json({
      success: true,
      message: "Questions JSON validated successfully",
      questionsCount: questions.length,
      timestamp: new Date().toISOString(),
      note: "Questions are managed in lib/questions.ts",
    })
  } catch (error) {
    console.error("[v0] Error validating questions:", error)
    return NextResponse.json(
      {
        error: "Failed to process validation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
