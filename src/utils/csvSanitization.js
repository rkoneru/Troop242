/**
 * Escape cell values against CSV injection / formula injection
 * Prefixes formula trigger characters (=, +, -, @, \t, \r) with a single quote
 */
export function sanitizeCsvCell(val) {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  if (/^[=+@\-\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}
