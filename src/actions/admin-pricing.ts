"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export type PricingFormState = { message?: string; error?: string } | undefined;

const MAX_FIELD_LENGTH = 200;

// Only ever accept field keys this page actually renders. useActionState
// submits the form with React's own routing metadata mixed into the same
// FormData (keys like "$ACTION_KEY"), and looping over every entry blindly
// saved that internal bookkeeping into the JSON blob alongside the real
// prices. An allowlist is the fix — not a blocklist that has to keep up
// with whatever React's action-encoding scheme introduces next.
const FIELD_KEY_PATTERN =
  /^(?:(?:en|pt)-eq-(?:r\d+-(?:equip|service|sem)|h\d+-(?:un|hours))|(?:en|pt)-lb-(?:labor|tire|extra|forklift)-\d+-(?:lbl|val)|shared-(?:diesel|fx))$/;

export async function savePricingTable(_prevState: PricingFormState, formData: FormData): Promise<PricingFormState> {
  await requireAdmin();

  const data: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;
    if (!FIELD_KEY_PATTERN.test(key)) continue;
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
