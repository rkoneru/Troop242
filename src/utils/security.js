/**
 * Security utilities for Troop 242
 * Provides cryptographically secure functions for random string generation and other security tasks.
 */

/**
 * Generates a cryptographically secure random string.
 * @param {number} length - Desired length of the output string.
 * @returns {string} - Random string of specified length (uppercase alphanumeric).
 */
export function generateSecureRandomString(length = 12) {
  const array = new Uint8Array(length);
  // Use window.crypto for browser compatibility
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback if crypto is unavailable (should not happen in modern browsers)
    throw new Error('Cryptographically secure random number generation is not supported');
  }

  // Convert to base-36 and take the desired length
  return Array.from(array, (byte) => byte.toString(36).padStart(2, '0'))
    .join('')
    .slice(0, length)
    .toUpperCase();
}
