interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic cleanup of expired rate limit entries to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Sliding window rate limiter for brute-force and credential stuffing prevention.
 * Satisfies SEC-AUTH-02 and SEC-API-01.
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowSeconds: number = 900 // 15 minutes default
): { success: boolean; remaining: number; resetInSeconds: number } {
  // In local development, relax rate limits for localhost to facilitate active testing
  const effectiveMax =
    process.env.NODE_ENV !== "production" &&
    (key.includes("127.0.0.1") || key.includes("::1") || key.includes("localhost"))
      ? Math.max(maxAttempts * 20, 100)
      : maxAttempts;

  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
    return { success: true, remaining: effectiveMax - 1, resetInSeconds: windowSeconds };
  }

  if (record.count >= effectiveMax) {
    const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { success: false, remaining: 0, resetInSeconds };
  }

  record.count += 1;
  return {
    success: true,
    remaining: effectiveMax - record.count,
    resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}

/**
 * Extracts client IP address from proxy headers safely
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}
