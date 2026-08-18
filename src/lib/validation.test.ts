import { describe, it, expect } from "vitest";
import { signupSchema, checkoutSchema, adminCouponSchema, resetPasswordSchema, adminOrderUpdateSchema, adminSiteSettingsSchema } from "@/lib/validation";

describe("signupSchema", () => {
  const validBase = { name: "João Silva", email: "joao@example.com", password: "senha123" };

  it("accepts a valid signup payload", () => {
    expect(signupSchema.safeParse(validBase).success).toBe(true);
  });

  it("rejects a password without a digit", () => {
    const result = signupSchema.safeParse({ ...validBase, password: "senhasenha" });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = signupSchema.safeParse({ ...validBase, password: "abc123" });
    expect(result.success).toBe(false);
  });

  it("lowercases the email", () => {
    const result = signupSchema.safeParse({ ...validBase, email: "JOAO@Example.com" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("joao@example.com");
  });
});

describe("checkoutSchema", () => {
  const validBase = {
    customerName: "Maria Fernandes",
    customerEmail: "maria@example.com",
    customerPhone: "841234567",
    province: "MAPUTO_CIDADE",
    city: "Maputo",
    neighborhood: "Polana",
    street: "Av. Julius Nyerere, 123",
    paymentMethod: "TRANSFERENCIA_BANCARIA",
  };

  it("accepts a valid order without a coupon code", () => {
    expect(checkoutSchema.safeParse(validBase).success).toBe(true);
  });

  it("accepts an optional coupon code", () => {
    const result = checkoutSchema.safeParse({ ...validBase, couponCode: "PROMO10" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid province enum value", () => {
    const result = checkoutSchema.safeParse({ ...validBase, province: "LISBOA" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing street", () => {
    const withoutStreet: Record<string, unknown> = { ...validBase };
    delete withoutStreet.street;
    const result = checkoutSchema.safeParse(withoutStreet);
    expect(result.success).toBe(false);
  });

  it("accepts the international card payment method", () => {
    const result = checkoutSchema.safeParse({ ...validBase, paymentMethod: "CARTAO" });
    expect(result.success).toBe(true);
  });
});

describe("adminCouponSchema", () => {
  it("uppercases the coupon code", () => {
    const result = adminCouponSchema.safeParse({ code: "verao2026", type: "PERCENTAGEM", value: 15 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.code).toBe("VERAO2026");
  });

  it("rejects a non-positive value", () => {
    const result = adminCouponSchema.safeParse({ code: "TESTE", type: "FIXO", value: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects a code shorter than 3 characters", () => {
    const result = adminCouponSchema.safeParse({ code: "AB", type: "FIXO", value: 100 });
    expect(result.success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("applies the same password strength rules as signup", () => {
    expect(resetPasswordSchema.safeParse({ password: "novaSenha1" }).success).toBe(true);
    expect(resetPasswordSchema.safeParse({ password: "semdigito" }).success).toBe(false);
  });
});

describe("adminOrderUpdateSchema", () => {
  it("accepts an update without a tracking number", () => {
    const result = adminOrderUpdateSchema.safeParse({ status: "CONFIRMADA", paymentStatus: "PAGO" });
    expect(result.success).toBe(true);
  });

  it("accepts an optional tracking number and carrier", () => {
    const result = adminOrderUpdateSchema.safeParse({
      status: "ENVIADA",
      paymentStatus: "PAGO",
      trackingNumber: "TRK123456",
      carrier: "DHL",
    });
    expect(result.success).toBe(true);
  });
});

describe("adminSiteSettingsSchema", () => {
  const validBase = {
    companyName: "Albimaq, Lda",
    phonePrimary: "+258842227299",
    email: "vendas@albimaq.co.mz",
    address: "Beira, Moçambique",
    hours: "Segunda a Sexta: 08h-17h30",
    usdExchangeRate: 64,
  };

  it("accepts a valid exchange rate", () => {
    expect(adminSiteSettingsSchema.safeParse(validBase).success).toBe(true);
  });

  it("rejects a non-positive exchange rate", () => {
    const result = adminSiteSettingsSchema.safeParse({ ...validBase, usdExchangeRate: 0 });
    expect(result.success).toBe(false);
  });
});
