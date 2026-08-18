"use server";

import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
import { sendEmail } from "@/lib/email";
import { contactReceivedEmail } from "@/lib/email-templates";
import type { AuthFormState } from "@/actions/auth";

export async function submitContactForm(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validated = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, email, phone, subject, message } = validated.data;

  await prisma.contactMessage.create({
    data: { name, email, phone: phone || null, subject, message },
  });

  await sendEmail({ to: email, subject: "Recebemos a sua mensagem", html: contactReceivedEmail(name) });

  return { message: "Mensagem enviada com sucesso. A nossa equipa entrará em contacto em breve." };
}
