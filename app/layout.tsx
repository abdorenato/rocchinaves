import type React from "react"
import type { Metadata } from "next"
import { Raleway, Roboto_Mono } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "./ClientLayout"

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["300", "400", "500", "600", "700", "800"],
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Radar de Maturidade | Torre de Controle™",
  description: "Avalie a maturidade da integração entre Marketing, Comunicação e Vendas na sua empresa",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${raleway.variable} ${robotoMono.variable}`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
