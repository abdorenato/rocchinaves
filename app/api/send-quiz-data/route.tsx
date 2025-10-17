import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    console.log("[v0] Received quiz data email request")
    const body = await request.json()
    const { contact, answers } = body

    if (!contact?.name || !contact?.email || !answers) {
      console.log("[v0] Validation failed - missing required fields")
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Build simple data email for internal team
    const htmlContent = buildQuizDataEmail(contact, answers)

    const emailFrom = process.env.EMAIL_FROM || "Rocchi Naves <onboarding@resend.dev>"

    const emailOptions = {
      from: emailFrom,
      to: ["renatocamarotta@gmail.com"],
      subject: `[NOVO LEAD] ${contact.name} - Diagnóstico Patrimonial Completo`,
      html: htmlContent,
    }

    console.log("[v0] Sending quiz data email to team")
    const { data, error } = await resend.emails.send(emailOptions)

    if (error) {
      console.error("[v0] Resend API error:", error)
      return NextResponse.json({ error: "Falha ao enviar e-mail" }, { status: 500 })
    }

    console.log("[v0] Quiz data email sent successfully")
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

function buildQuizDataEmail(contact: any, answers: any): string {
  const questionLabels: Record<string, string> = {
    diag_imoveis_qtd: "Quantos imóveis você possui?",
    diag_renda_aluguel: "Qual a renda mensal aproximada de aluguel?",
    diag_regime_declaracao: "Como você declara seus imóveis e rendimentos?",
    diag_simulacao_reforma: "Já fez alguma simulação do impacto da Reforma Tributária?",
    diag_sucessao: "Tem planejamento sucessório definido?",
    diag_impacto_herdeiros: "Seus herdeiros teriam dificuldade financeira com ITCMD?",
    diag_conhecimento_inventario: "Conhece os custos de inventário?",
    diag_protecao_patrimonial: "Seus imóveis estão protegidos contra bloqueios?",
    diag_riscos_familiares: "Há risco de disputas familiares?",
    diag_disponibilidade: "Estaria disposto a reestruturar seu patrimônio?",
    diag_interesse_consultoria: "Tem interesse em consultoria especializada?",
  }

  let answersHTML = ""
  for (const [key, value] of Object.entries(answers)) {
    if (key.startsWith("diag_")) {
      const label = questionLabels[key] || key
      answersHTML += `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #666666; font-size: 14px; font-weight: 600;">
            ${label}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #1a1a1a; font-size: 14px;">
            ${value}
          </td>
        </tr>
      `
    }
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Lead - Diagnóstico Patrimonial</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="700" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #1B8B9E; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">🎯 Novo Lead Capturado</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Diagnóstico Patrimonial - Reforma Tributária</p>
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 20px; font-weight: 700;">📋 Dados do Lead</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 10px 0; color: #666666; font-size: 14px; font-weight: 600;">Nome:</td>
                  <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px; font-weight: 700;">${contact.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666666; font-size: 14px; font-weight: 600;">E-mail:</td>
                  <td style="padding: 10px 0; color: #1B8B9E; font-size: 14px; font-weight: 700;">${contact.email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666666; font-size: 14px; font-weight: 600;">Telefone:</td>
                  <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px; font-weight: 700;">${contact.phone}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Answers -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 20px; font-weight: 700;">📊 Respostas do Diagnóstico</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
                ${answersHTML}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #1a1a1a; text-align: center;">
              <p style="margin: 0; color: #a68b5b; font-size: 14px; font-weight: 600;">Rocchi Naves Advogados</p>
              <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                Sistema de Diagnóstico Patrimonial
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
