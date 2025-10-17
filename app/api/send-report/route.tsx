import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Received body:", JSON.stringify(body, null, 2))

    const { contact, assessment, answers } = body

    console.log("[v0] Contact data:", contact)
    console.log("[v0] Has assessment:", !!assessment)
    console.log("[v0] Contact email:", contact?.email)
    console.log("[v0] Contact name:", contact?.name)

    if (!contact?.email || !contact?.name || !assessment) {
      console.error("[v0] Validation failed - Missing required fields")
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Build email HTML
    const htmlContent = buildEmailHTML(contact, assessment)

    const emailFrom = process.env.EMAIL_FROM || "Rocchi Naves <onboarding@resend.dev>"

    console.log("[v0] Sending email to:", "renatocamarotta@gmail.com")
    console.log("[v0] Reply-to:", contact.email)

    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: ["renatocamarotta@gmail.com"],
      replyTo: contact.email,
      subject: `📋 Diagnóstico Patrimonial - ${contact.name}`,
      html: htmlContent,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return NextResponse.json({ error: "Falha ao enviar e-mail", details: error }, { status: 500 })
    }

    console.log("[v0] Email sent successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

function buildEmailHTML(contact: any, assessment: any): string {
  const riskColor =
    assessment.level === "critical"
      ? "#dc2626"
      : assessment.level === "high"
        ? "#ea580c"
        : assessment.level === "medium"
          ? "#ca8a04"
          : "#16a34a"

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diagnóstico Patrimonial</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #1B8B9E; font-size: 28px; font-weight: 700;">Rocchi Naves Advogados</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px;">Diagnóstico Patrimonial - Reforma Tributária</p>
            </td>
          </tr>

          <!-- Contact Info Box - Prominent for easy forwarding -->
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #1B8B9E15; border-left: 4px solid #1B8B9E; border-radius: 8px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 10px 0; color: #1B8B9E; font-size: 18px; font-weight: 700;">📋 Dados do Cliente</h3>
                    <p style="margin: 5px 0; color: #1a1a1a; font-size: 16px;"><strong>Nome:</strong> ${contact.name}</p>
                    <p style="margin: 5px 0; color: #1a1a1a; font-size: 16px;">
                      <strong>E-mail:</strong> 
                      <a href="mailto:${contact.email}" style="color: #1B8B9E; text-decoration: none;">${contact.email}</a>
                    </p>
                    ${contact.phone ? `<p style="margin: 5px 0; color: #1a1a1a; font-size: 16px;"><strong>Telefone:</strong> ${contact.phone}</p>` : ""}
                    <p style="margin: 15px 0 0 0; padding: 10px; background-color: #fff3cd; border-radius: 4px; color: #856404; font-size: 13px;">
                      💡 <strong>Dica:</strong> Clique em "Responder" para enviar o relatório completo diretamente ao cliente
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Risk Level -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="20" cellspacing="0" style="background-color: ${riskColor}15; border-left: 4px solid ${riskColor}; border-radius: 8px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 10px 0; color: ${riskColor}; font-size: 20px; font-weight: 700;">${assessment.title}</h3>
                    <p style="margin: 0; color: #1a1a1a; font-size: 16px; line-height: 1.6;">${assessment.description}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            assessment.risks && assessment.risks.length > 0
              ? `
          <!-- Risks -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">⚠️ Principais Riscos Identificados</h3>
              <ul style="margin: 0; padding-left: 20px; color: #666666; font-size: 15px; line-height: 1.8;">
                ${assessment.risks.map((risk: string) => `<li style="margin-bottom: 8px;">${risk}</li>`).join("")}
              </ul>
            </td>
          </tr>
          `
              : ""
          }

          ${
            assessment.opportunities && assessment.opportunities.length > 0
              ? `
          <!-- Opportunities -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">✅ Oportunidades de Melhoria</h3>
              <ul style="margin: 0; padding-left: 20px; color: #666666; font-size: 15px; line-height: 1.8;">
                ${assessment.opportunities.map((opp: string) => `<li style="margin-bottom: 8px;">${opp}</li>`).join("")}
              </ul>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Next Steps -->
          <tr>
            <td style="padding: 30px; background-color: #f9f9f9; text-align: center;">
              <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 20px; font-weight: 700;">Próximos Passos</h3>
              <p style="margin: 0; color: #666666; font-size: 15px; line-height: 1.6;">
                Entre em contato com o cliente para apresentar soluções personalizadas de proteção patrimonial e otimização tributária.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #1a1a1a; text-align: center;">
              <p style="margin: 0; color: #1B8B9E; font-size: 14px; font-weight: 600;">Rocchi Naves Advogados</p>
              <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                © 2025 Todos os direitos reservados
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
