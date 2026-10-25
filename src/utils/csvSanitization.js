/**
 * CSV Sanitization Utility
 * Mitigates CSV Formula Injection (Excel Macro / Command Injection)
 */

/**
 * Sanitizes a single cell value for CSV export to prevent Formula Injection.
 * Prefixes formula triggers (=, +, -, @, \t, \r) with a single quote (') and escapes quotes.
 *
 * @param {any} cell - Value to sanitize
 * @returns {string} Escaped and sanitized string safe for CSV inclusion
 */
export function sanitizeCsvCell(cell) {
  if (cell === null || cell === undefined) {
    return '""';
  }

  let strVal = String(cell);

  // If string starts with formula trigger character, prefix with single quote
  const formulaTriggers = ['=', '+', '-', '@', '\t', '\r'];
  if (formulaTriggers.some(trigger => strVal.startsWith(trigger))) {
    strVal = `'${strVal}`;
  }

  // Escape internal double quotes by doubling them
  const escapedVal = strVal.replace(/"/g, '""');

  return `"${escapedVal}"`;
}
