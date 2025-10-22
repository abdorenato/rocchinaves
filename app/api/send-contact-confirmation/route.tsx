import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, phone } = body

    if (!fullName || !email || !phone) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const emailFrom = process.env.EMAIL_FROM || "Rocchi Naves <onboarding@resend.dev>"
    const firmEmail = "renatocamarotta@gmail.com"

    // Email HTML for client
    const clientEmailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Cadastro - Diagnóstico Patrimonial</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #1B8B9E 0%, #156b7a 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Diagnóstico Patrimonial</h1>
              <p style="margin: 10px 0 0; color: #e0f2f5; font-size: 16px;">Reforma Tributária</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Olá, ${fullName}!</h2>
              
              <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Obrigado por iniciar seu diagnóstico patrimonial conosco. Recebemos seus dados com sucesso!
              </p>
              
              <div style="background-color: #f0f9fa; border-left: 4px solid #1B8B9E; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px; color: #1a1a1a; font-weight: 600; font-size: 16px;">Próximos passos:</p>
                <ol style="margin: 10px 0 0; padding-left: 20px; color: #4a5568; font-size: 15px; line-height: 1.8;">
                  <li>Responda às 11 perguntas do diagnóstico</li>
                  <li>Receba seu relatório personalizado por e-mail</li>
                  <li>Nossa equipe entrará em contato para discutir as oportunidades identificadas</li>
                </ol>
              </div>
              
              <p style="margin: 30px 0 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                Em breve você receberá um relatório completo com a análise dos riscos e oportunidades relacionados à reforma tributária para seu patrimônio imobiliário.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #718096; font-size: 14px; text-align: center;">
                <strong style="color: #1a1a1a;">Rocchi Naves Advogados</strong><br>
                Especialistas em Direito Tributário e Patrimonial
              </p>
              <p style="margin: 15px 0 0; color: #a0aec0; font-size: 12px; text-align: center;">
                Este é um e-mail automático. Por favor, não responda.
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

    // Email HTML for law firm
    const firmEmailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Novo Lead - Diagnóstico Patrimonial</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px;">
          <tr>
            <td style="padding: 30px; background-color: #1B8B9E; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">🎯 Novo Lead Capturado</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 20px;">Dados do Cliente:</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px; background-color: #f8f9fa; border: 1px solid #e2e8f0; font-weight: 600; color: #4a5568;">Nome:</td>
                  <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e2e8f0; color: #1a1a1a;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; background-color: #f8f9fa; border: 1px solid #e2e8f0; font-weight: 600; color: #4a5568;">E-mail:</td>
                  <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e2e8f0; color: #1a1a1a;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; background-color: #f8f9fa; border: 1px solid #e2e8f0; font-weight: 600; color: #4a5568;">Telefone:</td>
                  <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e2e8f0; color: #1a1a1a;">${phone}</td>
                </tr>
              </table>
              
              <div style="margin-top: 30px; padding: 20px; background-color: #fff7ed; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>Status:</strong> Cliente iniciou o diagnóstico. Aguardando conclusão das perguntas para envio do relatório completo.
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    // Only send notification to law firm with all client details
    // Once domain is verified, can re-enable client confirmation email

    // Send notification to law firm with client details
    await resend.emails.send({
      from: emailFrom,
      to: [firmEmail],
      replyTo: email, // Allow direct reply to client
      subject: `Novo Lead: ${fullName}`,
      html: firmEmailHTML,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    return NextResponse.json({ error: "Erro ao enviar e-mail" }, { status: 500 })
  }
}
