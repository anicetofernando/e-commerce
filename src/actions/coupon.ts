"use server";

import { prisma } from "@/lib/db";
import { applyCouponSchema } from "@/lib/validation";
import { evaluateCoupon, toCouponRecord } from "@/lib/coupon";

export type ApplyCouponResult =
  | { success: true; code: string; discountAmount: number }
  | { success: false; message: string };

export async function applyCoupon(code: string, subtotal: number): Promise<ApplyCouponResult> {
  const validated = applyCouponSchema.safeParse({ code });
  if (!validated.success) {
    return { success: false, message: "Introduza um código válido." };
  }

  const normalizedCode = validated.data.code.toUpperCase();
  const coupon = await prisma.coupon.findUnique({ where: { code: normalizedCode } });
  const evaluation = evaluateCoupon(coupon ? toCouponRecord(coupon) : null, subtotal);

  if (!evaluation.valid) {
    return { success: false, message: evaluation.message };
  }

  return { success: true, code: normalizedCode, discountAmount: evaluation.discountAmount };
}
