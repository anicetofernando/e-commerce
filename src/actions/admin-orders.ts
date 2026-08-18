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

  const current = await prisma.order.findUnique({
    where: { id },
    select: { status: true, items: { select: { productId: true, quantity: true } } },
  });
  if (!current) {
    return { message: "Encomenda não encontrada." };
  }

  const enteringCancelled = current.status !== "CANCELADA" && validated.data.status === "CANCELADA";
  const leavingCancelled = current.status === "CANCELADA" && validated.data.status !== "CANCELADA";

  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id }, data: validated.data });

    if (enteringCancelled || leavingCancelled) {
      // Cancelling releases reserved stock back to inventory; reversing a
      // cancellation reserves it again (skipping items whose product was
      // since deleted).
      const delta = enteringCancelled ? 1 : -1;
      for (const item of current.items) {
        if (!item.productId) continue;
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity * delta } },
        });
      }
    }
  });

  revalidatePath("/admin/encomendas");
  revalidatePath(`/admin/encomendas/${id}`);
  revalidatePath("/admin/produtos");
  return { message: "Encomenda atualizada com sucesso." };
}
