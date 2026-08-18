export type CouponRecord = {
  code: string;
  type: "PERCENTAGEM" | "FIXO";
  value: number;
  minOrderValue: number | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date | null;
};

export type CouponEvaluation =
  | { valid: true; discountAmount: number }
  | { valid: false; message: string };

type PrismaCoupon = {
  code: string;
  type: "PERCENTAGEM" | "FIXO";
  value: unknown;
  minOrderValue: unknown;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date | null;
};

export function toCouponRecord(coupon: PrismaCoupon): CouponRecord {
  return {
    code: coupon.code,
    type: coupon.type,
    value: Number(coupon.value),
    minOrderValue: coupon.minOrderValue !== null && coupon.minOrderValue !== undefined ? Number(coupon.minOrderValue) : null,
    maxUses: coupon.maxUses,
    usedCount: coupon.usedCount,
    isActive: coupon.isActive,
    expiresAt: coupon.expiresAt,
  };
}

/**
 * Pure function so it can be unit-tested without touching the database.
 * The discount is always clamped to the subtotal (never goes negative or
 * exceeds the order value).
 */
export function evaluateCoupon(coupon: CouponRecord | null, subtotal: number, now: Date = new Date()): CouponEvaluation {
  if (!coupon) {
    return { valid: false, message: "Código de desconto inválido." };
  }
  if (!coupon.isActive) {
    return { valid: false, message: "Este código de desconto já não está ativo." };
  }
  if (coupon.expiresAt && coupon.expiresAt.getTime() < now.getTime()) {
    return { valid: false, message: "Este código de desconto expirou." };
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, message: "Este código de desconto atingiu o limite de utilizações." };
  }
  if (coupon.minOrderValue !== null && subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      message: `Este código exige um valor mínimo de compra de ${coupon.minOrderValue.toLocaleString("pt-PT")} MZN.`,
    };
  }

  const rawDiscount = coupon.type === "PERCENTAGEM" ? (subtotal * coupon.value) / 100 : coupon.value;
  const discountAmount = Math.min(Math.max(rawDiscount, 0), subtotal);

  return { valid: true, discountAmount };
}
