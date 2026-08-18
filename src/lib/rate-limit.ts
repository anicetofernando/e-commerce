/**
 * True if a token issued with the given expiry (issuedAt = expiresAt - ttlMs)
 * is still within its cooldown window, i.e. a new one shouldn't be issued yet.
 */
export function isWithinCooldown(tokenExpiresAt: Date | null, ttlMs: number, cooldownMs: number, now: Date = new Date()): boolean {
  if (!tokenExpiresAt) return false;
  const issuedAt = tokenExpiresAt.getTime() - ttlMs;
  return now.getTime() - issuedAt < cooldownMs;
}
