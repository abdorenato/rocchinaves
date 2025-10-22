"use client"

import { QUESTIONS } from "@/lib/questions"

export default async function AdminGapsPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token
  const adminToken = process.env.ADMIN_TOKEN

  if (!token || token !== adminToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-8 bg-card rounded-lg border">
          <h1 className="text-2xl font-bold text-destructive mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground">Token de administrador inválido ou ausente.</p>
          <p className="text-sm text-muted-foreground mt-4">Use: /admin/gaps?token=SEU_ADMIN_TOKEN</p>
        </div>
      </div>
    )
  }

  let apiQuestions = null
  let apiSource = null
  let apiError = null

  try {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    const response = await fetch(`${baseUrl}/api/gaps`, {
      cache: "no-store",
    })

    if (response.ok) {
      const data = await response.json()
      apiQuestions = data.questions
      apiSource = data.source
    }
  } catch (error) {
    apiError = error instanceof Error ? error.message : "Unknown error"
  }

  const currentQuestions = apiQuestions || QUESTIONS
  const categories = [...new Set(currentQuestions.map((q) => q.category))]

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Administração - GAPs/Perguntas</h1>
          <p className="text-muted-foreground">Visualize e gerencie as perguntas do questionário</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="text-sm text-muted-foreground mb-1">Total de Perguntas</div>
            <div className="text-3xl font-bold">{currentQuestions.length}</div>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <div className="text-sm text-muted-foreground mb-1">Categorias</div>
            <div className="text-3xl font-bold">{categories.length}</div>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <div className="text-sm text-muted-foreground mb-1">Fonte</div>
            <div className="text-lg font-semibold">{apiSource || "Fallback"}</div>
            {apiError && <div className="text-xs text-destructive mt-1">{apiError}</div>}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border mb-8">
          <h2 className="text-xl font-semibold mb-4">Perguntas por Categoria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => {
              const count = currentQuestions.filter((q) => q.category === category).length
              return (
                <div key={category} className="flex justify-between items-center p-3 bg-muted rounded">
                  <span className="font-medium">{category}</span>
                  <span className="text-muted-foreground">{count} perguntas</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">JSON Completo</h2>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify({ questions: currentQuestions }, null, 2))
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Copiar JSON
            </button>
          </div>
          <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
            <code>{JSON.stringify({ questions: currentQuestions }, null, 2)}</code>
          </pre>
        </div>

        <div className="mt-8 bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Como Atualizar as Perguntas</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Opção 1: URL Externa (GAPS_URL)</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                <li>Configure a variável de ambiente GAPS_URL com a URL do seu JSON</li>
                <li>O JSON deve ter o formato: {`{"questions": [...]}`}</li>
                <li>A aplicação tentará buscar desta URL primeiro</li>
                <li>Se falhar, usará o fallback hardcoded</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Opção 2: Editar Código (Fallback)</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  Edite o arquivo <code className="bg-muted px-1 rounded">lib/questions.ts</code>
                </li>
                <li>Modifique o array QUESTIONS com suas perguntas</li>
                <li>Faça commit e deploy das mudanças</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Formato da Pergunta</h3>
              <pre className="bg-muted p-3 rounded overflow-x-auto mt-2">
                {`{
  "id": "unique-id",
  "category": "Nome da Categoria",
  "question": "Texto da pergunta?",
  "options": [
    { "value": 1, "label": "Opção 1" },
    { "value": 2, "label": "Opção 2" },
    { "value": 3, "label": "Opção 3" },
    { "value": 4, "label": "Opção 4" },
    { "value": 5, "label": "Opção 5" }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
