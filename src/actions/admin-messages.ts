"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function markMessageRead(id: string, isRead: boolean) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { isRead } });
  revalidatePath("/admin/mensagens");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/mensagens");
}
