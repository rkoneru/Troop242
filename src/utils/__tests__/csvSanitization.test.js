/**
 * Unit tests for CSV formula injection sanitization logic
 */

import { sanitizeCsvCell } from '../csvSanitization';

describe('CSV Sanitization', () => {
  it('should handle normal strings properly', () => {
    expect(sanitizeCsvCell('John Doe')).toBe('"John Doe"');
    expect(sanitizeCsvCell('scout@example.com')).toBe('"scout@example.com"');
  });

  it('should handle null and undefined values', () => {
    expect(sanitizeCsvCell(null)).toBe('""');
    expect(sanitizeCsvCell(undefined)).toBe('""');
  });

  it('should escape formula injection characters by prefixing with single quote', () => {
    expect(sanitizeCsvCell('=1+1')).toBe('"\'=1+1"');
    expect(sanitizeCsvCell('+10-5')).toBe('"\'%s"'.replace('%s', '+10-5'));
    expect(sanitizeCsvCell('-SUM(A1:A10)')).toBe('"\'%s"'.replace('%s', '-SUM(A1:A10)'));
    expect(sanitizeCsvCell('@SUM(A1:A10)')).toBe('"\'@SUM(A1:A10)"');
    expect(sanitizeCsvCell('\tcmd.exe')).toBe('"\'' + '\tcmd.exe"');
    expect(sanitizeCsvCell('\rcalc.exe')).toBe('"\'' + '\rcalc.exe"');
  });

  it('should correctly escape embedded double quotes', () => {
    expect(sanitizeCsvCell('John "Eagle Scout" Doe')).toBe('"John ""Eagle Scout"" Doe"');
    expect(sanitizeCsvCell('=1+"2"')).toBe('"\'=1+""2"""');
  });
});
