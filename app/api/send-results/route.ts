import { NextResponse } from "next/server"
import { Resend } from "resend"
import { renderEmailHTML, type EmailTemplateData } from "@/lib/emailTemplate"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    console.log("[v0] Received email request")
    const body = await request.json()
    console.log("[v0] Request body parsed successfully")

    const { adminEmail, ...emailData } = body as EmailTemplateData & { adminEmail?: string }

    // Validate required fields
    if (!emailData?.contact?.email || !emailData?.contact?.name || !emailData?.scores) {
      console.log("[v0] Validation failed - missing required fields")
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    console.log("[v0] Validation passed, rendering email HTML")

    let htmlContent: string
    try {
      htmlContent = renderEmailHTML(emailData)
      console.log("[v0] Email HTML rendered successfully")
    } catch (renderError) {
      console.error("[v0] Error rendering email HTML:", renderError)
      console.error("[v0] Email data:", JSON.stringify(emailData, null, 2))
      return NextResponse.json({ error: "Erro ao gerar template do e-mail" }, { status: 500 })
    }

    const emailFrom = process.env.EMAIL_FROM || "Torre de Controle <onboarding@resend.dev>"
    const emailSubject = process.env.EMAIL_SUBJECT || "Seu Diagnóstico Torre de Controle™ está pronto 🚀"
    const emailBcc = process.env.EMAIL_BCC

    const recipientEmail = adminEmail || emailData.contact.email
    const isAdminEmail = !!adminEmail

    // Send email using Resend
    const emailOptions: any = {
      from: emailFrom,
      to: [recipientEmail],
      subject: isAdminEmail
        ? `[Admin] Novo diagnóstico: ${emailData.contact.name} - ${emailData.scores.overall.toFixed(1)}/5.0`
        : emailSubject,
      html: htmlContent,
    }

    if (emailBcc && !isAdminEmail) {
      emailOptions.bcc = [emailBcc]
    }

    console.log("[v0] Sending email via Resend")
    const { data, error } = await resend.emails.send(emailOptions)

    if (error) {
      console.error("[v0] Resend API error:", error)

      if (error.message?.includes("domain is not verified")) {
        return NextResponse.json(
          {
            error:
              "Domínio não verificado. Para enviar e-mails em produção, verifique seu domínio em https://resend.com/domains. Para testes, use 'onboarding@resend.dev' como EMAIL_FROM.",
          },
          { status: 403 },
        )
      }

      return NextResponse.json({ error: "Falha ao enviar e-mail" }, { status: 500 })
    }

    console.log("[v0] Email sent successfully")
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] API error:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
