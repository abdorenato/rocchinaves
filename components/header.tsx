export function Header() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Torre de Controle™</h2>
              <p className="text-xs text-muted-foreground">Radar de Maturidade</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">Renato Abdo</p>
            <p className="text-xs text-muted-foreground">Estrategista de Negócios</p>
          </div>
        </div>
      </div>
    </header>
  )
}
