/**
 * Sanitizes cell values for CSV export to prevent CSV Formula Injection (Formula Injection)
 * and ensure proper double-quote escaping.
 *
 * CSV Formula Injection occurs when untrusted user input starting with
 * =, +, -, @, \t, or \r is opened in spreadsheet software (Excel, Calc, Sheets).
 */
export function sanitizeCsvCell(value) {
  if (value === null || value === undefined) {
    return '""';
  }
  const str = String(value);
  // Neutralize formula triggers (=, +, -, @, \t, \r) by prefixing with a single quote
  const safeStr = /^[=+@\t\r-]/.test(str) ? `'${str}` : str;
  // Escape double quotes by doubling them
  return `"${safeStr.replace(/"/g, '""')}"`;
}
