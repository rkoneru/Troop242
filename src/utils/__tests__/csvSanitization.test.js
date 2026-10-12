import { sanitizeCsvCell } from '../csvSanitization';

describe('sanitizeCsvCell', () => {
  it('should return empty string for null and undefined', () => {
    expect(sanitizeCsvCell(null)).toBe('');
    expect(sanitizeCsvCell(undefined)).toBe('');
  });

  it('should escape double quotes by doubling them', () => {
    expect(sanitizeCsvCell('Hello "World"')).toBe('Hello ""World""');
  });

  it('should prefix formula trigger characters (=, +, -, @, tab, CR) with single quote', () => {
    expect(sanitizeCsvCell('=1+2')).toBe("'=1+2");
    expect(sanitizeCsvCell('+100')).toBe("'+100");
    expect(sanitizeCsvCell('-50')).toBe("'-50");
    expect(sanitizeCsvCell('@SUM(A1:A10)')).toBe("'@SUM(A1:A10)");
    expect(sanitizeCsvCell('\ttab')).toBe("'\ttab");
    expect(sanitizeCsvCell('\rCR')).toBe("'\rCR");
  });

  it('should not alter normal string or numeric inputs', () => {
    expect(sanitizeCsvCell('John Scout')).toBe('John Scout');
    expect(sanitizeCsvCell('scout@example.com')).toBe('scout@example.com');
    expect(sanitizeCsvCell(12345)).toBe('12345');
  });
});
