"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { reviewSchema } from "@/lib/validation";
import type { AuthFormState } from "@/actions/auth";

async function recalculateRating(productId: string) {
  const agg = await prisma.review.aggregate({
    where: { productId, isApproved: true },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      averageRating: agg._avg.rating ?? 0,
      reviewCount: agg._count,
    },
  });
}

export async function submitReview(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  const validated = reviewSchema.safeParse({
    productId: formData.get("productId"),
    rating: formData.get("rating"),
    title: formData.get("title"),
    comment: formData.get("comment"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { productId, rating, title, comment } = validated.data;

  await prisma.review.create({
    data: { productId, userId: user.id, rating, title, comment },
  });

  await recalculateRating(productId);

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { slug: true } });
  if (product) revalidatePath(`/produto/${product.slug}`);

  return { message: "Obrigado! A sua avaliação foi publicada." };
}
