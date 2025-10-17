"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ResultsLeadFormProps {
  onSubmit: (data: ContactData) => void
}

export interface ContactData {
  fullName: string
  email: string
  company?: string
  segment?: string
  annualRevenue?: string
  phone?: string
}

export function ResultsLeadForm({ onSubmit }: ResultsLeadFormProps) {
  const [formData, setFormData] = useState<ContactData>({
    fullName: "",
    email: "",
    company: "",
    segment: "",
    annualRevenue: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate required fields
    if (!formData.fullName || !formData.email) {
      alert("Por favor, preencha nome e email.")
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert("Por favor, insira um email válido.")
      setIsSubmitting(false)
      return
    }

    onSubmit(formData)
  }

  return (
    <Card className="bg-card border-border max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Parabéns! Você completou a análise
        </CardTitle>
        <p className="text-muted-foreground">
          Para visualizar seu diagnóstico completo e receber os resultados por email, preencha os dados abaixo:
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground">
                Nome Completo *
              </Label>
              <Input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-foreground">
                Empresa
              </Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="segment" className="text-foreground">
                Segmento
              </Label>
              <Input
                id="segment"
                type="text"
                value={formData.segment}
                onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="annualRevenue" className="text-foreground">
                Faturamento Anual
              </Label>
              <Select
                value={formData.annualRevenue}
                onValueChange={(value) => setFormData({ ...formData, annualRevenue: value })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1M">Até R$ 1 milhão</SelectItem>
                  <SelectItem value="1M-5M">R$ 1 a 5 milhões</SelectItem>
                  <SelectItem value="5M-15M">R$ 5 a 15 milhões</SelectItem>
                  <SelectItem value="15M-30M">R$ 15 a 30 milhões</SelectItem>
                  <SelectItem value="30M+">Acima de R$ 30 milhões</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Telefone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-background border-border"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processando..." : "Ver Meu Diagnóstico"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Seus dados são confidenciais e serão usados apenas para enviar o diagnóstico.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
