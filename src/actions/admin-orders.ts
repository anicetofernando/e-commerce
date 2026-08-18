"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { adminOrderUpdateSchema } from "@/lib/validation";
import type { AuthFormState } from "@/actions/auth";

export async function updateOrderStatus(id: string, _prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();

  const validated = adminOrderUpdateSchema.safeParse({
    status: formData.get("status"),
    paymentStatus: formData.get("paymentStatus"),
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await prisma.order.update({ where: { id }, data: validated.data });

  revalidatePath("/admin/encomendas");
  revalidatePath(`/admin/encomendas/${id}`);
  return { message: "Encomenda atualizada com sucesso." };
}
