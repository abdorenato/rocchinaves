import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`renato-abdo-photo.${file.name.split(".").pop()}`, file, {
      access: "public",
    })

    console.log("[v0] Photo uploaded to Blob:", blob.url)

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("[v0] Error uploading photo:", error)
    return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 })
  }
}
