interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();
const contactAttempts = new Map<string, RateLimitEntry>();

function cleanupExpiredEntries(store: Map<string, RateLimitEntry>) {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}

setInterval(() => {
  cleanupExpiredEntries(loginAttempts);
  cleanupExpiredEntries(contactAttempts);
}, 60000);

export function checkRateLimit(
  identifier: string,
  type: "login" | "contact" = "login",
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000,
): { allowed: boolean; remainingAttempts: number; resetAt: number } {
  const store = type === "login" ? loginAttempts : contactAttempts;
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || entry.resetAt < now) {
    const newEntry = { count: 1, resetAt: now + windowMs };
    store.set(identifier, newEntry);
    return {
      allowed: true,
      remainingAttempts: maxAttempts - 1,
      resetAt: newEntry.resetAt,
    };
  }

  if (entry.count >= maxAttempts) {
    return {
      allowed: false,
      remainingAttempts: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remainingAttempts: maxAttempts - entry.count,
    resetAt: entry.resetAt,
  };
}

export function resetRateLimit(identifier: string, type: "login" | "contact" = "login"): void {
  const store = type === "login" ? loginAttempts : contactAttempts;
  store.delete(identifier);
}
