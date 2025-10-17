import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "./ClientLayout"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Diagnóstico Patrimonial | Reforma Tributária",
  description: "Avalie os riscos e oportunidades do seu patrimônio imobiliário frente à Reforma Tributária",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${inter.variable}`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
