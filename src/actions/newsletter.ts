"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { newsletterSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import type { AuthFormState } from "@/actions/auth";

export async function subscribeNewsletter(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validated = newsletterSchema.safeParse({ email: formData.get("email") });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: validated.data.email },
    create: { email: validated.data.email },
    update: {},
  });

  return { message: "Subscrição efetuada com sucesso! Obrigado por se juntar a nós." };
}

export async function deleteNewsletterSubscriber(id: string) {
  await requireAdmin();
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}
