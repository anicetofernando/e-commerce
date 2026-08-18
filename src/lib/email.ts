import "server-only";
import { Resend } from "resend";
import { CONTACT_INFO } from "@/lib/constants";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/**
 * Sends a transactional email via Resend. If RESEND_API_KEY is not configured
 * (e.g. local dev), the email is logged instead of sent so the surrounding
 * flow (checkout, contact, password reset) never fails because of it.
 */
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY não definido — email para "${to}" não enviado. Assunto: ${subject}`);
    return { skipped: true };
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? `${CONTACT_INFO.companyName} <onboarding@resend.dev>`,
      to,
      subject,
      html,
    });
    return { skipped: false };
  } catch (error) {
    console.error("[email] Falha ao enviar email:", error);
    return { skipped: true };
  }
}
