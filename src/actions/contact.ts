"use server";

import { prisma } from "@/lib/db";
import { contactSchema, newsletterSchema } from "@/lib/validation";
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

  return { message: "Mensagem enviada com sucesso. A nossa equipa entrará em contacto em breve." };
}

export async function subscribeNewsletter(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validated = newsletterSchema.safeParse({ email: formData.get("email") });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email } = validated.data;

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  return { message: "Subscrição efetuada com sucesso!" };
}
