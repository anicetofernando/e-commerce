import { CONTACT_INFO } from "@/lib/constants";

function layout(title: string, bodyHtml: string) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <h1 style="font-size: 20px; margin-bottom: 4px;">${CONTACT_INFO.companyName}</h1>
      <h2 style="font-size: 16px; color: #444; margin-top: 0;">${title}</h2>
      ${bodyHtml}
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e5e5;" />
      <p style="font-size: 12px; color: #888;">${CONTACT_INFO.companyName} · ${CONTACT_INFO.address}</p>
    </div>
  `;
}

export function passwordResetEmail(resetUrl: string) {
  return layout(
    "Recuperação de Palavra-passe",
    `
      <p>Recebemos um pedido para repor a sua palavra-passe. Clique no botão abaixo para escolher uma nova (o link expira em 1 hora):</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="background:#dc2626;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">Repor Palavra-passe</a>
      </p>
      <p>Se não fez este pedido, pode ignorar este email.</p>
    `,
  );
}

export function orderConfirmationEmail(params: { orderNumber: string; customerName: string; total: string }) {
  return layout(
    "Encomenda Recebida",
    `
      <p>Olá ${params.customerName},</p>
      <p>Obrigado pela sua encomenda! Recebemos o pedido <strong>${params.orderNumber}</strong> no valor de <strong>${params.total}</strong>.</p>
      <p>A nossa equipa irá contactá-lo em breve para confirmar o pagamento e a entrega.</p>
    `,
  );
}

export function contactReceivedEmail(name: string) {
  return layout(
    "Mensagem Recebida",
    `
      <p>Olá ${name},</p>
      <p>Recebemos a sua mensagem e a nossa equipa entrará em contacto em breve.</p>
    `,
  );
}
