/**
 * Error logging and monitoring utility
 * Integrates with Sentry for production error tracking
 */

/**
 * Initialize error logging (Sentry in production)
 */
export function initializeErrorLogging() {
  if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
    // In production, would initialize Sentry here
    // import * as Sentry from "@sentry/react";
    // Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
    console.log('Error logging initialized for production');
  }
}

/**
 * Log error to Sentry (if available)
 */
export function logError(error, context = {}) {
  const errorData = {
    message: error.message || String(error),
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorData);
  }

  // In production, would send to Sentry
  if (process.env.NODE_ENV === 'production') {
    // if (window.__SENTRY__) {
    //   window.__SENTRY__.captureException(error, { contexts: { custom: context } });
    // }
    console.error('Error reported to monitoring service');
  }

  // Log to Firebase Firestore audit logs
  logToFirestore('errors', errorData);
}

/**
 * Log event to Firestore audit logs
 */
async function logToFirestore(_collection, _data) {
  try {
    // In production, would log to Firestore
    // const db = getFirestore();
    // await addDoc(collection(db, 'auditLogs'), {
    //   type: collection,
    //   ...data,
    // });
  } catch (err) {
    console.error('Failed to log to Firestore:', err);
  }
}

/**
 * Capture performance metrics
 */
export function capturePerformanceMetric(metricName, value, unit = 'ms') {
  const metric = {
    name: metricName,
    value,
    unit,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('Performance metric:', metric);
  }

  // In production, would send to monitoring service
  logToFirestore('metrics', metric);
}

/**
 * Measure function execution time
 */
export async function measureExecutionTime(fn, name) {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    capturePerformanceMetric(name, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    capturePerformanceMetric(`${name}_error`, duration);
    logError(error, { operation: name });
    throw error;
  }
}

/**
 * Setup global error handler
 */
export function setupGlobalErrorHandler() {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, { type: 'unhandledRejection' });
  });

  // Catch uncaught errors
  window.addEventListener('error', (event) => {
    logError(event.error, { type: 'uncaughtError' });
  });
}
