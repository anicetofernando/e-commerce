"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export type PricingFormState = { message?: string; error?: string } | undefined;

const MAX_FIELD_LENGTH = 200;

export async function savePricingTable(_prevState: PricingFormState, formData: FormData): Promise<PricingFormState> {
  await requireAdmin();

  const data: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;
    if (value.length > MAX_FIELD_LENGTH) {
      return { error: `O valor de "${key}" é demasiado longo.` };
    }
    data[key] = value;
  }

  await prisma.pricingTable.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", data },
    update: { data },
  });

  revalidatePath("/admin/precos");
  return { message: "Tabela de preços guardada com sucesso." };
}
