/**
 * Input Sanitization Utility
 *
 * Sanitizes user inputs to prevent XSS and injection attacks.
 * Uses simple regex-based sanitization that works in all runtimes
 * (Node.js, Edge, browser) without heavy dependencies like jsdom.
 */

/**
 * Strip HTML tags from a string
 */
function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Sanitize HTML content — strips all tags (no DOMPurify needed since
 * we never render user-supplied HTML)
 */
export function sanitizeHtml(dirty: string): string {
  return stripHtmlTags(dirty);
}

/**
 * Sanitize text input (removes HTML)
 */
export function sanitizeText(input: string): string {
  return stripHtmlTags(input);
}

/**
 * Sanitize email
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().replace(/[^a-z0-9@._-]/gi, "");
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, "");
}

/**
 * Sanitize consumer number
 */
export function sanitizeConsumerNumber(consumerNumber: string): string {
  return consumerNumber.replace(/[^A-Z0-9]/gi, "").toUpperCase();
}

/**
 * Sanitize free-text search terms used in query filters.
 */
export function sanitizeSearchTerm(input: string): string {
  return sanitizeText(input)
    .replace(/[^a-zA-Z0-9@.\-\s+]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(input: string | number): number {
  const num = typeof input === "string" ? parseFloat(input) : input;
  if (isNaN(num) || !isFinite(num)) {
    return 0;
  }
  return num;
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === "string") {
    return sanitizeText(obj) as T;
  }
  if (typeof obj === "number") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject) as T;
  }
  if (obj && typeof obj === "object") {
    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized as T;
  }
  return obj;
}
