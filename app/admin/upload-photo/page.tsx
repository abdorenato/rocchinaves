"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Check, AlertCircle } from "lucide-react"

export default function UploadPhotoPage() {
  const [uploading, setUploading] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione uma imagem válida")
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 2MB")
      return
    }

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Falha ao fazer upload")
      }

      const data = await response.json()
      setPhotoUrl(data.url)
    } catch (err) {
      setError("Erro ao fazer upload da foto. Tente novamente.")
      console.error("[v0] Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-white">Upload da Foto do Renato Abdo</h1>

        <Card className="border-primary/30 bg-[#111] p-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="photo-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/30 bg-black/50 p-12 transition-colors hover:border-primary/50"
              >
                <Upload className="mb-4 h-12 w-12 text-primary" />
                <span className="text-lg text-white">Clique para selecionar a foto</span>
                <span className="mt-2 text-sm text-gray-400">PNG, JPG ou WEBP (máx. 2MB)</span>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {uploading && (
              <div className="flex items-center justify-center gap-2 text-primary">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Fazendo upload...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-red-500">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {photoUrl && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-4 text-green-500">
                  <Check className="h-5 w-5" />
                  <span>Upload concluído com sucesso!</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">URL da foto:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={photoUrl}
                      readOnly
                      className="flex-1 rounded-lg bg-black/50 px-4 py-2 text-sm text-white"
                    />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(photoUrl)
                      }}
                      variant="outline"
                    >
                      Copiar
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg bg-black/50 p-4">
                  <p className="mb-2 text-sm font-medium text-white">Preview:</p>
                  <img
                    src={photoUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
