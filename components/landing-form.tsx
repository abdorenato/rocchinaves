"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function LandingForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/send-contact-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar confirmação")
      }

      // Store form data in sessionStorage and navigate to quiz
      sessionStorage.setItem("contactData", JSON.stringify(formData))
      router.push("/quiz")
    } catch (error) {
      console.error("Error sending confirmation:", error)
      // Continue to quiz even if email fails
      sessionStorage.setItem("contactData", JSON.stringify(formData))
      router.push("/quiz")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
          className={`bg-input border-border text-foreground ${errors.email ? "border-destructive" : ""}`}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground">
          Telefone <span className="text-primary">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          disabled={isSubmitting}
          className={`bg-input border-border text-foreground ${errors.phone ? "border-destructive" : ""}`}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          "Iniciar Diagnóstico"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Ao continuar, você concorda em receber o diagnóstico por e-mail
      </p>
    </form>
  )
}
