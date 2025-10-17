import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border text-center">
            <CardHeader className="pt-12">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold mb-4">Diagnóstico Enviado!</CardTitle>
            </CardHeader>
            <CardContent className="pb-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 rounded-lg bg-primary/10 border border-primary/30">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground mb-2">Verifique sua caixa de entrada</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Enviamos seu diagnóstico completo com os gráficos, pontuações detalhadas e recomendações
                      estratégicas personalizadas.
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground">
                  Não encontrou o e-mail? Verifique sua pasta de spam ou lixo eletrônico.
                </p>

                <div className="pt-6">
                  <Link href="/">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                      Fazer Nova Avaliação
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
