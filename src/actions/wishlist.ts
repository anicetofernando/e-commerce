"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function toggleWishlist(productId: string, pathToRevalidate?: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false as const, requiresAuth: true as const };
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    if (pathToRevalidate) revalidatePath(pathToRevalidate);
    return { success: true as const, wishlisted: false };
  }

  await prisma.wishlistItem.create({ data: { userId: user.id, productId } });
  if (pathToRevalidate) revalidatePath(pathToRevalidate);
  return { success: true as const, wishlisted: true };
}

export async function getWishlistProductIds() {
  const user = await getCurrentUser();
  if (!user) return [];
  const items = await prisma.wishlistItem.findMany({ where: { userId: user.id }, select: { productId: true } });
  return items.map((i) => i.productId);
}
