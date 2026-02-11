/**
 * Rate Limiting Utility
 * 
 * Prevents API abuse and DDoS attacks
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (for production, use Redis)
const store: RateLimitStore = {};

// Default rate limits
const DEFAULT_LIMITS: Record<string, RateLimitConfig> = {
  // Authentication endpoints - stricter
  "/api/auth/login": { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 min
  "/api/auth/signup": { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 signups per hour
  "/api/auth/forgot-password": { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 per hour

  // Payment endpoints - very strict
  "/api/payments/create-order": { windowMs: 60 * 1000, maxRequests: 10 }, // 10 per minute
  "/api/payments/verify": { windowMs: 60 * 1000, maxRequests: 10 },

  // Bill fetching - moderate
  "/api/bills/fetch": { windowMs: 60 * 1000, maxRequests: 5 }, // 5 per minute

  // General API - lenient
  default: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 per minute
};

export function getRateLimitKey(identifier: string, path: string): string {
  return `${identifier}:${path}`;
}

export function checkRateLimit(
  identifier: string,
  path: string
): { allowed: boolean; remaining: number; resetTime: number } {
  const config = DEFAULT_LIMITS[path] || DEFAULT_LIMITS.default;
  const key = getRateLimitKey(identifier, path);
  const now = Date.now();

  // Get or create entry
  let entry = store[key];

  if (!entry || entry.resetTime < now) {
    // Reset or create
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    store[key] = entry;
  }

  // Check limit
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

// Cleanup old entries periodically (server-side only)
if (typeof window === "undefined") {
  // Only run cleanup in Node.js environment
  if (typeof setInterval !== "undefined") {
    setInterval(() => {
      const now = Date.now();
      Object.keys(store).forEach((key) => {
        if (store[key].resetTime < now) {
          delete store[key];
        }
      });
    }, 60 * 1000); // Cleanup every minute
  }
}

