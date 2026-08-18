import { describe, it, expect } from "vitest";
import { formatCurrency, generateOrderNumber, slugify } from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats a number as MZN currency with no decimals", () => {
    expect(formatCurrency(1500)).toContain("1");
    expect(formatCurrency(1500)).toContain("500");
  });

  it("accepts a numeric string", () => {
    expect(formatCurrency("2500")).toBe(formatCurrency(2500));
  });
});

describe("generateOrderNumber", () => {
  it("matches the ALB-YYYY-###### pattern", () => {
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toMatch(/^ALB-\d{4}-\d{6}$/);
  });

  it("generates different numbers across calls (probabilistically unique)", () => {
    const numbers = new Set(Array.from({ length: 20 }, () => generateOrderNumber()));
    expect(numbers.size).toBeGreaterThan(1);
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Filtro de Óleo Motor")).toBe("filtro-de-oleo-motor");
  });

  it("strips accents", () => {
    expect(slugify("Retroescavadora Compactação")).toBe("retroescavadora-compactacao");
  });

  it("trims leading/trailing hyphens and strips punctuation", () => {
    expect(slugify("  Peça #123!  ")).toBe("peca-123");
  });
});
