import { describe, it, expect } from "vitest";
import { parseLenient, fmt2, computeRow } from "@/lib/pricing-calc";

describe("parseLenient", () => {
  it("returns 0 for empty/null/undefined input", () => {
    expect(parseLenient(null)).toBe(0);
    expect(parseLenient(undefined)).toBe(0);
    expect(parseLenient("")).toBe(0);
    expect(parseLenient("   ")).toBe(0);
  });

  it("parses a plain integer", () => {
    expect(parseLenient("100")).toBe(100);
  });

  it("treats a comma as the decimal separator", () => {
    expect(parseLenient("62,06")).toBeCloseTo(62.06);
  });

  it("treats a dot as a thousands separator when a comma is also present", () => {
    expect(parseLenient("1.234,56")).toBeCloseTo(1234.56);
  });

  it("strips internal whitespace", () => {
    expect(parseLenient(" 1 234,50 ")).toBeCloseTo(1234.5);
  });

  it("returns 0 for non-numeric input", () => {
    expect(parseLenient("abc")).toBe(0);
  });
});

describe("fmt2", () => {
  it("formats with a comma decimal separator and two decimals", () => {
    expect(fmt2(1234.5)).toBe("1.234,50");
  });

  it("adds thousands separators", () => {
    expect(fmt2(1000000)).toBe("1.000.000,00");
  });

  it("rounds to two decimal places", () => {
    expect(fmt2(1.005)).toBe("1,01");
  });
});

describe("computeRow", () => {
  const base = {
    sem: "100",
    semOrig: "100",
    comOrig: "130",
    totalOrig: "800",
    hours: "8",
    hoursOrig: "8",
    dieselPct: 30,
    dieselChanged: false,
    hoursChanged: false,
    noDiesel: false,
  };

  it("reproduces the original printed value when nothing changed (avoids rounding-artifact flags)", () => {
    const result = computeRow(base);
    expect(result.com).toBe(fmt2(130));
    expect(result.total).toBe(fmt2(800));
  });

  it("applies the flat diesel percentage once the shared field is edited", () => {
    const result = computeRow({ ...base, dieselChanged: true, dieselPct: 50 });
    expect(result.com).toBe(fmt2(150)); // 100 * 1.5
  });

  it("applies hours × unit price once hours are edited", () => {
    const result = computeRow({ ...base, hoursChanged: true, hours: "10" });
    expect(result.total).toBe(fmt2(1000)); // 100 * 10
  });

  it("omits the diesel column when noDiesel is set", () => {
    const result = computeRow({ ...base, noDiesel: true });
    expect(result.com).toBeNull();
  });

  it("scales com/total proportionally when the unit price changes but ratios stay pinned", () => {
    const result = computeRow({ ...base, sem: "200" });
    expect(result.com).toBe(fmt2(260)); // 200 * (130/100)
    expect(result.total).toBe(fmt2(1600)); // 200 * (800/100)
  });
});
