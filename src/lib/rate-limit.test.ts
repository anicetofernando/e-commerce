import { describe, it, expect } from "vitest";
import { isWithinCooldown } from "@/lib/rate-limit";

const TTL_MS = 60 * 60 * 1000;
const COOLDOWN_MS = 2 * 60 * 1000;

describe("isWithinCooldown", () => {
  it("returns false when no token has ever been issued", () => {
    expect(isWithinCooldown(null, TTL_MS, COOLDOWN_MS)).toBe(false);
  });

  it("returns true right after a token was issued", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const expiresAt = new Date(now.getTime() + TTL_MS); // issued at `now`
    expect(isWithinCooldown(expiresAt, TTL_MS, COOLDOWN_MS, now)).toBe(true);
  });

  it("returns true just under the cooldown boundary", () => {
    const issuedAt = new Date("2026-01-01T12:00:00Z");
    const expiresAt = new Date(issuedAt.getTime() + TTL_MS);
    const now = new Date(issuedAt.getTime() + COOLDOWN_MS - 1000);
    expect(isWithinCooldown(expiresAt, TTL_MS, COOLDOWN_MS, now)).toBe(true);
  });

  it("returns false once the cooldown window has passed", () => {
    const issuedAt = new Date("2026-01-01T12:00:00Z");
    const expiresAt = new Date(issuedAt.getTime() + TTL_MS);
    const now = new Date(issuedAt.getTime() + COOLDOWN_MS + 1000);
    expect(isWithinCooldown(expiresAt, TTL_MS, COOLDOWN_MS, now)).toBe(false);
  });

  it("returns false long after the token has expired", () => {
    const issuedAt = new Date("2026-01-01T12:00:00Z");
    const expiresAt = new Date(issuedAt.getTime() + TTL_MS);
    const now = new Date(expiresAt.getTime() + 1000);
    expect(isWithinCooldown(expiresAt, TTL_MS, COOLDOWN_MS, now)).toBe(false);
  });
});
