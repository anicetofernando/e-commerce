"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

async function refreshProductRating(productId: string) {
  const agg = await prisma.review.aggregate({
    where: { productId, isApproved: true },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      averageRating: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : 0,
      reviewCount: agg._count,
    },
  });
}

export async function approveReview(id: string) {
  await requireAdmin();
  const review = await prisma.review.update({ where: { id }, data: { isApproved: true } });
  await refreshProductRating(review.productId);
  revalidatePath("/admin/avaliacoes");
}

export async function rejectReview(id: string) {
  await requireAdmin();
  const review = await prisma.review.update({ where: { id }, data: { isApproved: false } });
  await refreshProductRating(review.productId);
  revalidatePath("/admin/avaliacoes");
}

export async function deleteReview(id: string) {
  await requireAdmin();
  const review = await prisma.review.delete({ where: { id } });
  await refreshProductRating(review.productId);
  revalidatePath("/admin/avaliacoes");
}
