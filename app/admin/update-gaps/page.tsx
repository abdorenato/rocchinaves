"use client"

import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function UpdateGapsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Atualizar Perguntas</h1>
          <p className="text-muted-foreground">Gerenciamento de perguntas do diagnóstico patrimonial</p>
        </div>

        <Card className="p-6">
          <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-blue-500">Sistema Simplificado</p>
              <p className="text-sm text-blue-400 mt-1">
                As perguntas agora são gerenciadas diretamente no código para maior simplicidade e confiabilidade.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold mb-3">Como Atualizar as Perguntas</h3>
          <div className="text-sm space-y-3">
            <div>
              <p className="font-medium mb-2">1. Edite o arquivo de perguntas:</p>
              <code className="block bg-muted p-3 rounded">lib/questions.ts</code>
            </div>
            <div>
              <p className="font-medium mb-2">2. Modifique o array DIAGNOSIS_QUESTIONS:</p>
              <pre className="bg-muted p-3 rounded overflow-x-auto text-xs">
                {`export const DIAGNOSIS_QUESTIONS: Question[] = [
  {
    id: "diag_imoveis_qtd",
    category: "Patrimônio Imobiliário",
    question: "Quantos imóveis você possui?",
    options: [
      { value: "1", label: "1 imóvel" },
      { value: "2-3", label: "2 a 3 imóveis" },
      ...
    ]
  },
  ...
]`}
              </pre>
            </div>
            <div>
              <p className="font-medium mb-2">3. Faça commit e deploy:</p>
              <code className="block bg-muted p-3 rounded">git commit -m "Atualizar perguntas" && git push</code>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold mb-3">Vantagens desta Abordagem</h3>
          <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
            <li>Sem dependência de arquivos externos ou URLs</li>
            <li>Versionamento completo via Git</li>
            <li>Validação de TypeScript em tempo de desenvolvimento</li>
            <li>Mais rápido e confiável</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
