/**
 * Sliding Window Token Rate Limiter
 * Provides DDoS, brute-force, and abusive traffic protection with standard HTTP headers.
 */

export interface RateLimitConfig {
  limit: number;
  windowMs: number; // in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // Unix epoch ms
  retryAfterSeconds?: number;
}

interface Bucket {
  count: number;
  resetTime: number;
}

// Memory cache for client IP buckets (anchored to globalThis in development)
const globalForRateLimit = globalThis as unknown as {
  rateLimitStore?: Map<string, Bucket>;
};
export const rateLimitStore =
  globalForRateLimit.rateLimitStore ?? new Map<string, Bucket>();

if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.rateLimitStore = rateLimitStore;
}

// Periodic cleanup of expired buckets every 5 minutes (Edge runtime safe)
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitStore.entries()) {
    if (now > bucket.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

if (cleanupTimer && typeof (cleanupTimer as any).unref === "function") {
  (cleanupTimer as any).unref();
}

export const RATE_LIMIT_PROFILES: Record<string, RateLimitConfig> = {
  auth: {
    limit: 15,
    windowMs: 60 * 1000, // 15 requests per minute
  },
  orders: {
    limit: 30,
    windowMs: 60 * 1000, // 30 requests per minute
  },
  upload: {
    limit: 25,
    windowMs: 60 * 1000, // 25 requests per minute
  },
  api: {
    limit: 120,
    windowMs: 60 * 1000, // 120 requests per minute
  },
  strict: {
    limit: 5,
    windowMs: 60 * 1000, // 5 requests per minute (for testing/sensitive triggers)
  },
};

/**
 * Checks and updates rate limit for a given key and profile
 */
export function checkRateLimit(key: string, profile: keyof typeof RATE_LIMIT_PROFILES = "api"): RateLimitResult {
  const config = RATE_LIMIT_PROFILES[profile] || RATE_LIMIT_PROFILES.api;
  const now = Date.now();
  const bucketKey = `${profile}:${key}`;

  let bucket = rateLimitStore.get(bucketKey);

  if (!bucket || now > bucket.resetTime) {
    bucket = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(bucketKey, bucket);

    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetTime: bucket.resetTime,
    };
  }

  bucket.count += 1;

  if (bucket.count > config.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetTime - now) / 1000));
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetTime: bucket.resetTime,
      retryAfterSeconds,
    };
  }

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - bucket.count,
    resetTime: bucket.resetTime,
  };
}

/**
 * Reset a specific rate limit key (useful for tests)
 */
export function resetRateLimit(key: string, profile?: keyof typeof RATE_LIMIT_PROFILES) {
  if (profile) {
    rateLimitStore.delete(`${profile}:${key}`);
  } else {
    for (const p of Object.keys(RATE_LIMIT_PROFILES)) {
      rateLimitStore.delete(`${p}:${key}`);
    }
  }
}
