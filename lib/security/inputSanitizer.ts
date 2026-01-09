/**
 * Input Sanitization Utility
 * 
 * Sanitizes user inputs to prevent XSS and injection attacks
 */

import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content
 * isomorphic-dompurify handles both client and server automatically
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty);
}

/**
 * Sanitize text input (removes HTML)
 */
export function sanitizeText(input: string): string {
  return sanitizeHtml(input).replace(/<[^>]*>/g, "");
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

