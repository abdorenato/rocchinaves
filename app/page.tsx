import { Header } from "@/components/header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, TrendingUp, Target, Radio } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4">
        <div className="min-h-[85vh] flex items-center py-12 md:py-16">
          <div className="w-full grid md:grid-cols-[55%_45%] gap-8 md:gap-12 items-center">
            {/* Left Column - Main Message */}
            <div className="space-y-6 max-w-[90%] md:max-w-none">
              <div className="inline-block">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">
                  Diagnóstico Empresarial
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight">
                <span className="text-foreground tracking-wide leading-7 text-5xl">
                  Descubra em 5 minutos o que está te impedindo de crescer, com liberdade e clareza.
                </span>
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl text-orange-400 text-pretty leading-tight font-normal tracking-wider">
                Entenda os gargalos invisíveis que travam Marketing, Vendas e Comunicação, e tenha controle real do seu negócio.
              </p>

              <a href="#cta-card" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                Fazer meu diagnóstico agora →
              </a>
            </div>

            {/* Right Column - CTA Card */}
            <div
              id="cta-card"
              className="relative bg-card border border-primary/30 rounded-lg p-6 md:p-8 shadow-[0_0_20px_rgba(108,197,211,0.1)] animate-in fade-in duration-500 delay-500 overflow-hidden"
            >
              {/* Subtle background icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
                <Radio className="w-64 h-64 text-primary" />
              </div>

              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
                  Receba uma Análise gratuita e personalizada.
                </h2>

                <p className="text-pretty leading-relaxed mb-6 text-xl text-sidebar-border">
                  Respondendo poucas perguntas, você recebe um diagnóstico visual e estratégico, mostrando onde o crescimento trava e como destravar.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-primary">Identifique os pontos cegos da sua operação</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-primary">Tenha clareza sobre o que medir e de quem cobrar</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-primary">
                      Descubra o que mudar para crescer e conquistar liberdade
                    </p>
                  </div>
                </div>

                <Link href="/quiz">
                  <Button
                    size="lg"
                    className="w-full text-lg px-8 py-6 bg-primary hover:bg-[#5bb6c4] transition-all duration-200 hover:scale-105 hover:shadow-[0_0_15px_rgba(108,197,211,0.3)]"
                  >
                    Começar agora
                  </Button>
                </Link>

                <p className="text-sm text-muted-foreground text-center mt-4 font-medium">
                  +100 líderes já descobriram seus principais gargalos com este diagnóstico.
                </p>

                <p className="text-xs text-muted-foreground/70 text-center mt-2">
                  🔒 Gratuito, confidencial e sem burocracia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Torre de Controle™. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
