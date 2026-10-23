import { sanitizeCsvCell } from '../csvSanitization';

describe('sanitizeCsvCell', () => {
  test('returns quoted empty string for null or undefined', () => {
    expect(sanitizeCsvCell(null)).toBe('""');
    expect(sanitizeCsvCell(undefined)).toBe('""');
  });

  test('quotes standard string values', () => {
    expect(sanitizeCsvCell('John Doe')).toBe('"John Doe"');
    expect(sanitizeCsvCell('12345')).toBe('"12345"');
  });

  test('escapes internal double quotes by doubling them', () => {
    expect(sanitizeCsvCell('John "Eagle" Doe')).toBe('"John ""Eagle"" Doe"');
  });

  test('prefixes formula trigger characters with a single quote', () => {
    expect(sanitizeCsvCell('=1+1')).toBe('"\'=1+1"');
    expect(sanitizeCsvCell('=SUM(A1:A10)')).toBe('"\'=SUM(A1:A10)"');
    expect(sanitizeCsvCell('+1234567890')).toBe('"\'=1234567890"'.replace('=', '+'));
    expect(sanitizeCsvCell('-cmd|\' /C calc\'!A0')).toBe('"\'=cmd|\' /C calc\'!A0"'.replace('=', '-'));
    expect(sanitizeCsvCell('@SUM(1,2)')).toBe('"\'@SUM(1,2)"');
    expect(sanitizeCsvCell('\ttabInjected')).toBe('"\'\ttabInjected"');
  });

  test('handles numeric values properly', () => {
    expect(sanitizeCsvCell(100)).toBe('"100"');
    expect(sanitizeCsvCell(-5)).toBe('"\'=5"'.replace('=', '-'));
  });
});
