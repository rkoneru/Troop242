import { sanitizeCsvCell } from '../csvSanitization';

describe('sanitizeCsvCell', () => {
  it('should handle null and undefined', () => {
    expect(sanitizeCsvCell(null)).toBe('""');
    expect(sanitizeCsvCell(undefined)).toBe('""');
  });

  it('should wrap normal strings in double quotes', () => {
    expect(sanitizeCsvCell('John Scout')).toBe('"John Scout"');
  });

  it('should escape internal double quotes', () => {
    expect(sanitizeCsvCell('John "Eagle" Scout')).toBe('"John ""Eagle"" Scout"');
  });

  it('should prefix formula trigger characters with a single quote', () => {
    expect(sanitizeCsvCell('=1+2')).toBe('"\'=1+2"');
    expect(sanitizeCsvCell('+12345')).toBe('"\'+12345"');
    expect(sanitizeCsvCell('-10')).toBe('"\'-10"');
    expect(sanitizeCsvCell('@SUM(A1:A10)')).toBe('"\'@SUM(A1:A10)"');
    expect(sanitizeCsvCell('\tcmd')).toBe('"\'\tcmd"');
    expect(sanitizeCsvCell('\rcmd')).toBe('"\'\rcmd"');
  });

  it('should convert numbers to string and wrap in quotes', () => {
    expect(sanitizeCsvCell(123)).toBe('"123"');
  });
});
