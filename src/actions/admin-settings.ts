"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { adminSiteSettingsSchema } from "@/lib/validation";
import type { AuthFormState } from "@/actions/auth";

export async function updateSiteSettings(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();

  const validated = adminSiteSettingsSchema.safeParse({
    companyName: formData.get("companyName"),
    phonePrimary: formData.get("phonePrimary"),
    phoneSecondary: formData.get("phoneSecondary") || "",
    whatsapp: formData.get("whatsapp") || "",
    email: formData.get("email"),
    address: formData.get("address"),
    hours: formData.get("hours"),
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const data = validated.data;
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      companyName: data.companyName,
      phonePrimary: data.phonePrimary,
      phoneSecondary: data.phoneSecondary || "",
      whatsapp: data.whatsapp || data.phonePrimary,
      email: data.email,
      address: data.address,
      hours: data.hours,
    },
    update: {
      companyName: data.companyName,
      phonePrimary: data.phonePrimary,
      phoneSecondary: data.phoneSecondary || "",
      whatsapp: data.whatsapp || data.phonePrimary,
      email: data.email,
      address: data.address,
      hours: data.hours,
    },
  });

  revalidatePath("/", "layout");
  return { message: "Definições atualizadas com sucesso." };
}
