export interface EmailTemplateData {
  contact: {
    name: string
    email: string
    company?: string
    position?: string
    revenue?: string
    phone?: string
  }
  scores: {
    overall: number
    pillars: { pessoas: number; processos: number; plataformas: number }
    areas: { marketing: number; comunicacao: number; vendas: number }
  }
  narrative: {
    level: string
    headline: string
    body: string
  }
  gaps: Array<{
    pillar: string
    area: string
    text: string
    maturityLevel: string
  }>
  strengths: Array<{
    pillar: string
    area: string
    text: string
  }>
  isInternalCopy?: boolean
}

function getMaturityEmailColor(level: string): string {
  switch (level) {
    case "Voo Solo":
      return "#E44C4C"
    case "Turbulência":
      return "#FF9D00"
    case "Formação de Frota":
      return "#FFC94C"
    case "Torre de Controle":
      return "#6CC5D3"
    default:
      return "#6CC5D3"
  }
}

function getMaturityEmailIcon(level: string): string {
  switch (level) {
    case "Voo Solo":
      return "⚠️"
    case "Turbulência":
      return "⚡"
    case "Formação de Frota":
      return "🧭"
    case "Torre de Controle":
      return "🏁"
    default:
      return "✓"
  }
}

export function renderEmailHTML(data: EmailTemplateData): string {
  const { contact, scores, narrative, gaps, strengths, isInternalCopy } = data

  const levelColor = getMaturityEmailColor(narrative.level)
  const levelIcon = getMaturityEmailIcon(narrative.level)

  const gapsByMaturity: Record<string, typeof gaps> = {}
  gaps.forEach((gap) => {
    if (!gapsByMaturity[gap.maturityLevel]) {
      gapsByMaturity[gap.maturityLevel] = []
    }
    gapsByMaturity[gap.maturityLevel].push(gap)
  })

  const maturityLevels = [
    {
      level: "Voo Solo",
      description: "Prioridade crítica — estruturação básica necessária",
    },
    {
      level: "Turbulência",
      description: "Prioridade alta — integração e consistência necessárias",
    },
    {
      level: "Formação de Frota",
      description: "Prioridade média — otimização e padronização",
    },
  ]

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu Diagnóstico - Torre de Controle™</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Raleway', 'Helvetica Neue', Arial, sans-serif; background-color: #0D0D0D; color: #FFFFFF;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0D0D0D;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; border-radius: 8px; overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #6CC5D3;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #6CC5D3; text-transform: uppercase; letter-spacing: 1px;">
                TORRE DE CONTROLE™
              </h1>
              <p style="margin: 10px 0 0; font-size: 16px; color: #CCCCCC; letter-spacing: 0.5px;">
                RADAR DE MATURIDADE
              </p>
            </td>
          </tr>

          ${
            isInternalCopy
              ? `
          <tr>
            <td style="padding: 20px 30px; background-color: #0D0D0D; border-bottom: 1px solid #333;">
              <p style="margin: 0; font-size: 15px; color: #6CC5D3; font-weight: 600;">
                📩 Novo diagnóstico recebido de ${contact.name}${contact.company ? ` (${contact.company})` : ""} — Pontuação média ${scores.overall.toFixed(2)}/5.0
              </p>
            </td>
          </tr>
          `
              : ""
          }

          <tr>
            <td style="padding: 30px 30px 20px;">
              <p style="margin: 0; font-size: 17px; line-height: 1.6; color: #FFFFFF;">
                Olá, <strong style="color: #6CC5D3;">${contact.name}</strong>!
              </p>
              <p style="margin: 15px 0 0; font-size: 17px; line-height: 1.6; color: #CCCCCC;">
                Obrigado por completar o Diagnóstico Torre de Controle™. Aqui está sua análise completa sobre o nível de maturidade e integração entre Marketing, Comunicação e Vendas da sua empresa.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0D0D0D; border-radius: 8px; border: 1px solid ${levelColor};">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <p style="margin: 0; font-size: 15px; color: ${levelColor}; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                      SEU NÍVEL DE MATURIDADE
                    </p>
                    <h2 style="margin: 10px 0 5px; font-size: 36px; font-weight: 700; color: ${levelColor};">
                      ${narrative.level}
                    </h2>
                    <p style="margin: 0; font-size: 20px; color: #AAAAAA;">
                      Pontuação: ${scores.overall.toFixed(2)}/5.0
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 30px;">
              <h3 style="margin: 0 0 15px; font-size: 22px; font-weight: 700; color: ${levelColor};">
                ${levelIcon} ${narrative.headline}
              </h3>
              <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #EEEEEE;">
                ${narrative.body}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 30px;">
              <h3 style="margin: 0 0 15px; font-size: 22px; font-weight: 700; color: #FFFFFF; text-transform: uppercase;">
                Detalhamento das Pontuações
              </h3>
              
              <p style="margin: 0 0 10px; font-size: 16px; color: #FFFFFF; font-weight: 600;">
                Pilares (3Ps)
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #CCCCCC;">Pessoas</td>
                  <td align="right" style="padding: 8px 0; font-size: 15px; color: #FFFFFF; font-weight: 600;">${scores.pillars.pessoas.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #CCCCCC;">Processos</td>
                  <td align="right" style="padding: 8px 0; font-size: 15px; color: #FFFFFF; font-weight: 600;">${scores.pillars.processos.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #CCCCCC;">Plataformas</td>
                  <td align="right" style="padding: 8px 0; font-size: 15px; color: #FFFFFF; font-weight: 600;">${scores.pillars.plataformas.toFixed(2)}</td>
                </tr>
              </table>

              <p style="margin: 0 0 10px; font-size: 16px; color: #FFFFFF; font-weight: 600;">
                Áreas (M/C/V)
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #CCCCCC;">Marketing</td>
                  <td align="right" style="padding: 8px 0; font-size: 15px; color: #FFFFFF; font-weight: 600;">${scores.areas.marketing.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #CCCCCC;">Comunicação</td>
                  <td align="right" style="padding: 8px 0; font-size: 15px; color: #FFFFFF; font-weight: 600;">${scores.areas.comunicacao.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #CCCCCC;">Vendas</td>
                  <td align="right" style="padding: 8px 0; font-size: 15px; color: #FFFFFF; font-weight: 600;">${scores.areas.vendas.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            gaps.length > 0
              ? `
          <tr>
            <td style="padding: 20px 30px;">
              <h3 style="margin: 0 0 10px; font-size: 22px; font-weight: 700; color: #FFFFFF; text-transform: uppercase;">
                Oportunidades de Melhoria
              </h3>
              <p style="margin: 0 0 20px; font-size: 14px; color: #CCCCCC;">
                Organizadas por nível de maturidade — priorize as mais críticas
              </p>
              
              ${maturityLevels
                .map((maturityLevel) => {
                  const levelGaps = gapsByMaturity[maturityLevel.level]
                  if (!levelGaps || levelGaps.length === 0) return ""

                  const matLevelColor = getMaturityEmailColor(maturityLevel.level)
                  const matLevelIcon = getMaturityEmailIcon(maturityLevel.level)

                  return `
                  <div style="margin-bottom: 25px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                      <tr>
                        <td>
                          <h4 style="margin: 0; font-size: 18px; font-weight: 700; color: ${matLevelColor};">
                            ${matLevelIcon} ${maturityLevel.level}
                          </h4>
                          <p style="margin: 3px 0 0; font-size: 13px; color: #CCCCCC;">
                            ${maturityLevel.description}
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${levelGaps
                        .reduce((rows: any[], gap, index) => {
                          if (index % 2 === 0) {
                            rows.push([gap])
                          } else {
                            rows[rows.length - 1].push(gap)
                          }
                          return rows
                        }, [])
                        .map(
                          (row) => `
                        <tr>
                          ${row
                            .map(
                              (gap: any) => `
                            <td width="48%" valign="top" style="padding: 8px;">
                              <div style="background-color: #0D0D0D; border-left: 3px solid ${matLevelColor}; border-radius: 4px; padding: 12px;">
                                <p style="margin: 0 0 5px; font-size: 12px; color: ${matLevelColor}; font-weight: 600; text-transform: uppercase;">
                                  ${gap.pillar} × ${gap.area}
                                </p>
                                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #CCCCCC;">
                                  ${gap.text}
                                </p>
                              </div>
                            </td>
                          `,
                            )
                            .join("")}
                          ${row.length === 1 ? '<td width="48%"></td>' : ""}
                        </tr>
                      `,
                        )
                        .join("")}
                    </table>
                  </div>
                  `
                })
                .join("")}
            </td>
          </tr>
          `
              : ""
          }

          ${
            strengths.length > 0
              ? `
          <tr>
            <td style="padding: 20px 30px;">
              <h3 style="margin: 0 0 15px; font-size: 22px; font-weight: 700; color: #FFFFFF; text-transform: uppercase;">
                Seus Pontos Fortes
              </h3>
              <p style="margin: 0 0 15px; font-size: 14px; color: #CCCCCC;">
                Continue mantendo essas práticas
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                ${strengths
                  .reduce((rows: any[], strength, index) => {
                    if (index % 2 === 0) {
                      rows.push([strength])
                    } else {
                      rows[rows.length - 1].push(strength)
                    }
                    return rows
                  }, [])
                  .map(
                    (row) => `
                  <tr>
                    ${row
                      .map(
                        (strength: any) => `
                      <td width="48%" valign="top" style="padding: 8px;">
                        <div style="background-color: #0D0D0D; border-left: 3px solid #66CC99; border-radius: 4px; padding: 12px;">
                          <p style="margin: 0 0 5px; font-size: 12px; color: #66CC99; font-weight: 600; text-transform: uppercase;">
                            ${strength.pillar} × ${strength.area}
                          </p>
                          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #CCCCCC;">
                            ${strength.text}
                          </p>
                        </div>
                      </td>
                    `,
                      )
                      .join("")}
                    ${row.length === 1 ? '<td width="48%"></td>' : ""}
                  </tr>
                `,
                  )
                  .join("")}
              </table>
            </td>
          </tr>
          `
              : ""
          }

          <tr>
            <td style="padding: 20px 30px;">
              <h3 style="margin: 0 0 15px; font-size: 20px; font-weight: 700; color: #888888; text-transform: uppercase;">
                Informações do Diagnóstico
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0D0D0D; border-radius: 6px; padding: 15px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #888888;">Nome:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #CCCCCC; font-weight: 600;">${contact.name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #888888;">E-mail:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #CCCCCC; font-weight: 600;">${contact.email}</td>
                </tr>
                ${
                  contact.company
                    ? `
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #888888;">Empresa:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #CCCCCC; font-weight: 600;">${contact.company}</td>
                </tr>
                `
                    : ""
                }
                ${
                  contact.position
                    ? `
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #888888;">Cargo:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #CCCCCC; font-weight: 600;">${contact.position}</td>
                </tr>
                `
                    : ""
                }
                ${
                  contact.revenue
                    ? `
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #888888;">Faturamento anual:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #CCCCCC; font-weight: 600;">${contact.revenue}</td>
                </tr>
                `
                    : ""
                }
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #888888;">Data:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #CCCCCC; font-weight: 600;">${currentDate}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <hr style="border: 0; border-top: 1px solid #222222; margin: 0 0 25px;" />
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="80" valign="top" style="padding-right: 16px;">
                    <img src="/images/design-mode/renato-abdo.png" alt="Renato Abdo" width="80" height="80" style="border-radius: 50%; object-fit: cover; display: block;" />
                  </td>
                  <td valign="top">
                    <p style="margin: 0; font-size: 18px; color: #FFFFFF; font-weight: 700;">
                      Renato Abdo
                    </p>
                    <p style="margin: 4px 0 0; font-size: 15px; color: #6CC5D3; font-weight: 600;">
                      Estrategista de Negócios • Criador do Método Torre de Controle™
                    </p>
                    <p style="margin: 12px 0 0; font-size: 14px; line-height: 1.6; color: #AAAAAA;">
                      Especialista em crescimento e integração entre marketing, comunicação e vendas. Mais de 20 anos ajudando empresas a criarem sistemas de crescimento previsível.
                    </p>
                    <p style="margin: 20px 0 0;">
                      <a href="https://calendly.com/renato-abdo/sessao-estrategica" style="display: inline-block; background-color: #6CC5D3; color: #000000; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 15px;">
                        → Agendar Sessão Estratégica
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px; background-color: #0D0D0D; border-top: 2px solid #6CC5D3; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #CCCCCC;">
                Este diagnóstico foi gerado pela plataforma Torre de Controle™,
              </p>
              <p style="margin: 0 0 8px; font-size: 14px; color: #CCCCCC;">
                desenvolvida por Renato Abdo e L'eep Co.
              </p>
              <p style="margin: 0; font-size: 13px; color: #666666;">
                © ${new Date().getFullYear()} Torre de Controle™ — Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
