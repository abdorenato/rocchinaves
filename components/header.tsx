import Image from "next/image"

export function Header() {
  return (
    <header className="border-b border-border bg-black">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo-rn.png" alt="Rocchi Naves" width={120} height={40} className="h-10 w-auto" priority />
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">Reforma Tributária</p>
            <p className="text-xs text-white/80">Análise de Risco e Oportunidades</p>
          </div>
        </div>
      </div>
    </header>
  )
}
