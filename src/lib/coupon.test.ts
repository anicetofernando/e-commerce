import { describe, it, expect } from "vitest";
import { evaluateCoupon, toCouponRecord, type CouponRecord } from "@/lib/coupon";

const NOW = new Date("2026-08-18T12:00:00Z");

function makeCoupon(overrides: Partial<CouponRecord> = {}): CouponRecord {
  return {
    code: "DESCONTO10",
    type: "PERCENTAGEM",
    value: 10,
    minOrderValue: null,
    maxUses: null,
    usedCount: 0,
    isActive: true,
    expiresAt: null,
    ...overrides,
  };
}

describe("evaluateCoupon", () => {
  it("rejects an unknown coupon", () => {
    const result = evaluateCoupon(null, 1000, NOW);
    expect(result.valid).toBe(false);
  });

  it("rejects an inactive coupon", () => {
    const result = evaluateCoupon(makeCoupon({ isActive: false }), 1000, NOW);
    expect(result.valid).toBe(false);
  });

  it("rejects an expired coupon", () => {
    const result = evaluateCoupon(makeCoupon({ expiresAt: new Date("2026-01-01") }), 1000, NOW);
    expect(result.valid).toBe(false);
  });

  it("accepts a coupon that expires in the future", () => {
    const result = evaluateCoupon(makeCoupon({ expiresAt: new Date("2027-01-01") }), 1000, NOW);
    expect(result.valid).toBe(true);
  });

  it("rejects a coupon that has hit its usage limit", () => {
    const result = evaluateCoupon(makeCoupon({ maxUses: 5, usedCount: 5 }), 1000, NOW);
    expect(result.valid).toBe(false);
  });

  it("accepts a coupon just under its usage limit", () => {
    const result = evaluateCoupon(makeCoupon({ maxUses: 5, usedCount: 4 }), 1000, NOW);
    expect(result.valid).toBe(true);
  });

  it("rejects when the subtotal is below the minimum order value", () => {
    const result = evaluateCoupon(makeCoupon({ minOrderValue: 2000 }), 1000, NOW);
    expect(result.valid).toBe(false);
  });

  it("computes a percentage discount off the subtotal", () => {
    const result = evaluateCoupon(makeCoupon({ type: "PERCENTAGEM", value: 20 }), 1000, NOW);
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.discountAmount).toBe(200);
  });

  it("computes a fixed discount", () => {
    const result = evaluateCoupon(makeCoupon({ type: "FIXO", value: 300 }), 1000, NOW);
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.discountAmount).toBe(300);
  });

  it("clamps a fixed discount so it never exceeds the subtotal", () => {
    const result = evaluateCoupon(makeCoupon({ type: "FIXO", value: 5000 }), 1000, NOW);
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.discountAmount).toBe(1000);
  });
});

describe("toCouponRecord", () => {
  it("converts Prisma Decimal-like fields to numbers", () => {
    const record = toCouponRecord({
      code: "TESTE",
      type: "FIXO",
      value: "150.5" as unknown as number,
      minOrderValue: "500" as unknown as number,
      maxUses: 10,
      usedCount: 2,
      isActive: true,
      expiresAt: null,
    });
    expect(record.value).toBe(150.5);
    expect(record.minOrderValue).toBe(500);
  });

  it("keeps a null minOrderValue as null", () => {
    const record = toCouponRecord({
      code: "TESTE",
      type: "FIXO",
      value: 100,
      minOrderValue: null,
      maxUses: null,
      usedCount: 0,
      isActive: true,
      expiresAt: null,
    });
    expect(record.minOrderValue).toBeNull();
  });
});
