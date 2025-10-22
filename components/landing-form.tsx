"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LandingForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    segment: "",
    annualRevenue: "",
    phone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nome completo é obrigatório"
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Store form data in sessionStorage and navigate to quiz
    sessionStorage.setItem("contactData", JSON.stringify(formData))
    router.push("/quiz")
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Comece seu diagnóstico</CardTitle>
        <CardDescription className="text-base">Preencha seus dados para iniciar a avaliação</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Required Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground">
                Nome completo <span className="text-primary">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Seu nome completo"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className={`bg-input border-border text-foreground ${errors.fullName ? "border-destructive" : ""}`}
              />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                E-mail <span className="text-primary">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`bg-input border-border text-foreground ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Campos opcionais</p>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-foreground">
                Empresa
              </Label>
              <Input
                id="company"
                type="text"
                placeholder="Nome da sua empresa"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="segment" className="text-foreground">
                Segmento
              </Label>
              <Input
                id="segment"
                type="text"
                placeholder="Ex: Tecnologia, Varejo, Serviços"
                value={formData.segment}
                onChange={(e) => handleChange("segment", e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualRevenue" className="text-foreground">
                Faturamento anual
              </Label>
              <Select value={formData.annualRevenue} onValueChange={(value) => handleChange("annualRevenue", value)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Selecione uma faixa" />
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
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base"
          >
            Iniciar Diagnóstico
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Ao continuar, você concorda em receber o diagnóstico por e-mail
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
