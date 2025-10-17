import { Header } from "@/components/header"
import { Shield, TrendingUp, FileText } from "lucide-react"
import { LandingForm } from "@/components/landing-form"

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
                <span className="text-primary text-sm font-semibold tracking-wider uppercase bg-primary/10 px-3 py-1 rounded-full">
                  Diagnóstico Patrimonial
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight">
                <span className="text-foreground tracking-tight leading-tight">
                  Descubra como a Reforma Tributária impacta seu patrimônio imobiliário
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground text-pretty leading-relaxed font-normal">
                Avalie riscos, identifique oportunidades e proteja seus imóveis e rendimentos de aluguel com um
                diagnóstico personalizado.
              </p>

              <a href="#cta-card" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                Fazer meu diagnóstico gratuito →
              </a>
            </div>

            <div
              id="cta-card"
              className="relative bg-card border-2 border-primary/30 rounded-lg p-6 md:p-8 shadow-lg animate-in fade-in duration-500 delay-500"
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
                    Comece seu diagnóstico gratuito
                  </h2>
                  <p className="text-muted-foreground">Preencha seus dados para receber uma análise personalizada</p>
                </div>

                <LandingForm />

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">Identifique riscos tributários e sucessórios</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">Descubra oportunidades de economia fiscal</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">Receba um relatório profissional por e-mail</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  🔒 Seus dados estão protegidos e não serão compartilhados
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Rocchi Naves Advogados. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
