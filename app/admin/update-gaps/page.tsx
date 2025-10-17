"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Upload, Eye } from "lucide-react"

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

export default function UpdateGapsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [adminToken, setAdminToken] = useState("")

  const validateQuestions = (data: any): Question[] => {
    if (!Array.isArray(data)) {
      throw new Error("JSON deve ser um array de perguntas")
    }

    if (data.length !== 18) {
      throw new Error(`Esperado 18 perguntas, encontrado ${data.length}`)
    }

    const validPillars = ["Pessoas", "Processos", "Plataformas"]
    const validAreas = ["Marketing", "Comunicação", "Vendas"]

    data.forEach((q, index) => {
      if (!q.id || typeof q.id !== "string") {
        throw new Error(`Pergunta ${index + 1}: ID inválido`)
      }
      if (!validPillars.includes(q.pillar)) {
        throw new Error(`Pergunta ${index + 1}: Pilar inválido (${q.pillar})`)
      }
      if (!validAreas.includes(q.area)) {
        throw new Error(`Pergunta ${index + 1}: Área inválida (${q.area})`)
      }
      if (!q.question || typeof q.question !== "string") {
        throw new Error(`Pergunta ${index + 1}: Texto da pergunta inválido`)
      }
      if (!q.gapFeedback || typeof q.gapFeedback !== "object") {
        throw new Error(`Pergunta ${index + 1}: gapFeedback inválido`)
      }
      for (const level of ["1", "2", "3", "4", "5"]) {
        if (!q.gapFeedback[level] || typeof q.gapFeedback[level] !== "string") {
          throw new Error(`Pergunta ${index + 1}: Feedback para nível ${level} inválido`)
        }
      }
    })

    return data as Question[]
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError(null)
    setSuccess(null)
    setQuestions(null)

    try {
      const text = await selectedFile.text()
      const data = JSON.parse(text)
      const validatedQuestions = validateQuestions(data)
      setQuestions(validatedQuestions)
      setSuccess("JSON válido! Clique em 'Preview' para revisar ou 'Upload' para aplicar.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao validar JSON")
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file || !questions || !adminToken) {
      setError("Arquivo, validação e token admin são obrigatórios")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("adminToken", adminToken)

      const response = await fetch("/api/update-gaps", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao fazer upload")
      }

      setSuccess(`Upload realizado! As perguntas foram atualizadas. Configure GAPS_URL uma vez com: ${result.url}`)
      setFile(null)
      setQuestions(null)
      setShowPreview(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Atualizar Perguntas e GAPs</h1>
          <p className="text-gray-400">Faça upload de um arquivo JSON com as 18 perguntas e feedbacks de GAP</p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Token Admin</label>
              <input
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="Digite o token admin"
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Arquivo JSON</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-black file:font-medium hover:file:bg-primary/90"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-500">Erro</p>
                <p className="text-sm text-red-400 mt-1">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-green-500">Sucesso</p>
                <p className="text-sm text-green-400 mt-1">{success}</p>
              </div>
            </div>
          )}

          {questions && (
            <div className="flex gap-4">
              <Button onClick={() => setShowPreview(!showPreview)} variant="outline" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? "Ocultar Preview" : "Preview"}
              </Button>
              <Button
                onClick={handleUpload}
                disabled={loading || !adminToken}
                className="flex-1 bg-primary text-black hover:bg-primary/90"
              >
                <Upload className="w-4 h-4 mr-2" />
                {loading ? "Enviando..." : "Upload para Blob"}
              </Button>
            </div>
          )}
        </Card>

        {showPreview && questions && (
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h2 className="text-xl font-bold mb-4">Preview das Perguntas</h2>
            <div className="space-y-6 max-h-[600px] overflow-y-auto">
              {questions.map((q, index) => (
                <div key={q.id} className="border-b border-zinc-800 pb-4 last:border-0">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-primary font-bold">{index + 1}.</span>
                    <div className="flex-1">
                      <div className="flex gap-2 mb-1">
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">{q.pillar}</span>
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">{q.area}</span>
                      </div>
                      <p className="font-medium">{q.question}</p>
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-400 font-medium">Feedbacks de GAP:</p>
                        {Object.entries(q.gapFeedback).map(([level, feedback]) => (
                          <div key={level} className="text-sm">
                            <span className="text-gray-500">Nível {level}:</span>{" "}
                            <span className="text-gray-300">{feedback}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="bg-zinc-900 border-zinc-800 p-6">
          <h3 className="font-bold mb-3">Como funciona</h3>
          <div className="text-sm text-gray-400 space-y-2">
            <p>1. Faça upload do JSON com as 18 perguntas</p>
            <p>2. O sistema valida a estrutura e salva no Blob como "current-gaps.json"</p>
            <p>
              3. Configure a variável GAPS_URL <strong className="text-primary">uma única vez</strong> com a URL
              retornada
            </p>
            <p>4. Próximos uploads sobrescrevem o mesmo arquivo automaticamente</p>
            <p className="text-primary">✓ Não precisa atualizar GAPS_URL novamente!</p>
          </div>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 p-6">
          <h3 className="font-bold mb-3">Formato do JSON</h3>
          <pre className="text-xs bg-black p-4 rounded-lg overflow-x-auto">
            {`[
  {
    "id": "pessoas_marketing_1",
    "pillar": "Pessoas",
    "area": "Marketing",
    "question": "Sua pergunta aqui?",
    "gapFeedback": {
      "1": "Feedback para nível 1",
      "2": "Feedback para nível 2",
      "3": "Feedback para nível 3",
      "4": "Feedback para nível 4",
      "5": "Feedback para nível 5"
    }
  },
  ...
]`}
          </pre>
        </Card>
      </div>
    </div>
  )
}
