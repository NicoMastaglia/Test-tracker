// CONTENT PER MODIFICARE I TEMPLATE DELLE EMAIL
// SETUP PASSWORD
// RESET PASSWORD
// ASSEGNAZIONE TASK
// ASSEGNAZIONE PROGETTO

// layout condiviso: stesso header/footer per tutte le email, solo l'accentColor
// e il contenuto centrale cambiano in base al tipo di notifica. Stili inline e
// tabelle (non flex/grid) perché i client email non supportano CSS moderno.
const emailLayout = ({ accentColor = "#10b981", eyebrow, heading, bodyHtml, ctaLabel, ctaLink, footnote }) => `
<div style="background:#f1f5f9;padding:32px 16px;font-family:Segoe UI, Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;border-collapse:collapse;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.08);">
    <tr>
      <td style="background:#0f172a;padding:20px 28px;">
        <span style="color:#ffffff;font-size:16px;font-weight:700;letter-spacing:0.02em;">Test&nbsp;Tracker</span>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 28px 8px;">
        ${eyebrow ? `<p style="margin:0 0 8px;color:${accentColor};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">${eyebrow}</p>` : ""}
        <h1 style="margin:0 0 16px;color:#0f172a;font-size:20px;font-weight:700;">${heading}</h1>
        <div style="color:#334155;font-size:14px;line-height:1.6;">${bodyHtml}</div>

        ${ctaLink ? `
        <table role="presentation" style="margin:24px 0 8px;">
          <tr>
            <td style="border-radius:8px;background:${accentColor};">
              <a href="${ctaLink}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">
                ${ctaLabel}
              </a>
            </td>
          </tr>
        </table>` : ""}
      </td>
    </tr>
    <tr>
      <td style="padding:20px 28px 28px;">
        ${footnote ? `<p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.5;">${footnote}</p>` : ""}
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px;border-top:1px solid #e2e8f0;">
        <p style="margin:0;color:#94a3b8;font-size:11px;">Questa è una notifica automatica di Test Tracker. Non rispondere a questa email.</p>
      </td>
    </tr>
  </table>
</div>
`;

const htmlContent = {

  setupPassword: (user, setupLink) => emailLayout({
    accentColor: "#10b981",
    eyebrow: "Benvenuto",
    heading: "Il tuo account è pronto",
    bodyHtml: `
      <p style="margin:0 0 8px;">Ciao <strong>${user.nome}</strong>,</p>
      <p style="margin:0;">Il tuo account è stato creato con ruolo <strong>${user.role}</strong>. Imposta la password per accedere alla piattaforma.</p>
    `,
    ctaLabel: "Configura il tuo account",
    ctaLink: setupLink,
    footnote: "Il link è valido per 48 ore. Se non hai richiesto questo account, ignora questa email.",
  }),

  resetPassword: (user, resetLink) => emailLayout({
    accentColor: "#f59e0b",
    eyebrow: "Reimposta password",
    heading: "Hai richiesto una nuova password",
    bodyHtml: `
      <p style="margin:0 0 8px;">Ciao <strong>${user.nome}</strong>,</p>
      <p style="margin:0;">Clicca il pulsante qui sotto per impostare una nuova password per il tuo account.</p>
    `,
    ctaLabel: "Reimposta password",
    ctaLink: resetLink,
    footnote: "Il link è valido per 48 ore. Se non hai richiesto tu questa modifica, ignora questa email: la tua password attuale resterà invariata.",
  }),

  projectAssignment: (user, link, options = {}) => emailLayout({
    accentColor: "#3b82f6",
    eyebrow: "Nuovo progetto",
    heading: "Sei stato assegnato a un progetto",
    bodyHtml: `
      <p style="margin:0 0 8px;">Ciao <strong>${user.nome}</strong>,</p>
      <p style="margin:0;">Sei stato assegnato al progetto <strong>${options.projectName}</strong>. Accedi alla piattaforma per vederne i dettagli.</p>
    `,
    ctaLabel: "Apri Test Tracker",
    ctaLink: link,
  }),

  taskAssignment: (user, link, options = {}) => emailLayout({
    accentColor: "#6366f1",
    eyebrow: "Nuova task",
    heading: "Ti è stata assegnata una task",
    bodyHtml: `
      <p style="margin:0 0 8px;">Ciao <strong>${user.nome}</strong>,</p>
      <p style="margin:0 0 12px;">Ti è stata assegnata una nuova task sul progetto <strong>${options.projectName}</strong>:</p>
      <div style="margin:0;padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;color:#0f172a;font-weight:600;">
        ${options.taskDescription || "Nessuna descrizione"}
      </div>
    `,
    ctaLabel: "Apri Test Tracker",
    ctaLink: link,
  }),

};

module.exports = { htmlContent };
