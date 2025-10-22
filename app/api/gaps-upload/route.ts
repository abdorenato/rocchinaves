import { type NextRequest, NextResponse } from "next/server"
import { QuestionsArraySchema } from "@/lib/gaps-schema"

/**
 * POST /api/gaps-upload
 * Admin endpoint to upload new GAPs JSON
 * Requires ADMIN_TOKEN for authentication
 * Validates JSON structure with Zod schema
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
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

    // In a real implementation, you would:
    // 1. Upload to Vercel Blob or S3
    // 2. Update GAPS_URL environment variable
    // 3. Clear cache

    // For now, return success with validation confirmation
    return NextResponse.json({
      success: true,
      message: "GAPs JSON validated successfully",
      questionsCount: questions.length,
      timestamp: new Date().toISOString(),
      note: "To complete upload, integrate with Vercel Blob or S3 storage",
    })
  } catch (error) {
    console.error("[v0] Error uploading GAPs:", error)
    return NextResponse.json(
      {
        error: "Failed to process upload",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
