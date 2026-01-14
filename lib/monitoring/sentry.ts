import * as Sentry from '@sentry/nextjs';

/**
 * Sentry error tracking utilities
 * Usage: import { captureError, captureMessage } from '@/lib/monitoring/sentry'
 */

/**
 * Capture an error with additional context
 * @example
 * try {
 *   await createReservation()
 * } catch (error) {
 *   captureError(error, { userId, projectId })
 * }
 */
export function captureError(
  error: Error | unknown,
  context?: Record<string, any>
) {
  if (context) {
    Sentry.setContext('Additional Context', context);
  }

  Sentry.captureException(error);
}

/**
 * Capture a message with severity level
 * @example captureMessage('User completed onboarding', 'info', { userId })
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, any>
) {
  if (context) {
    Sentry.setContext('Message Context', context);
  }

  Sentry.captureMessage(message, level);
}

/**
 * Set user context for error tracking
 * @example setUserContext({ id: '123', email: 'user@example.com' })
 */
export function setUserContext(user: {
  id: string;
  email?: string;
  name?: string;
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 * @example addBreadcrumb('User clicked reserve button', 'navigation')
 */
export function addBreadcrumb(
  message: string,
  category: string = 'default',
  level: 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

/**
 * Start a performance transaction
 * @example
 * const transaction = startTransaction('reservation-flow')
 * // ... do work
 * transaction.finish()
 */
export function startTransaction(name: string, op?: string) {
  return Sentry.startTransaction({
    name,
    op: op || 'custom',
  });
}

/**
 * Capture a performance measurement
 * @example capturePerformance('api-call', 'GET /api/projects', 450)
 */
export function capturePerformance(
  name: string,
  description: string,
  duration: number
) {
  const transaction = Sentry.startTransaction({
    name,
    op: 'performance',
  });

  transaction.setMeasurement(description, duration, 'millisecond');
  transaction.finish();
}
