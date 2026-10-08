/**
 * Sanitizes a cell value for safe CSV export.
 * Prevents CSV Formula Injection (Formula Injection) by prefixing sensitive leading characters
 * (=, +, -, @, \t, \r) with a single quote (') and properly escaping double quotes.
 *
 * @param {any} value - The input cell value to sanitize
 * @returns {string} - CSV-safe quoted cell string
 */
export function sanitizeCsvCell(value) {
  if (value === null || value === undefined) {
    return '""';
  }

  let str = String(value);

  // Check if string starts with dangerous formula injection characters
  if (/^[=+@\-\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escape internal double quotes by doubling them
  const escaped = str.replace(/"/g, '""');

  return `"${escaped}"`;
}
