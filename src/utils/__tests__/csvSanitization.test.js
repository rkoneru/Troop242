import { sanitizeCsvCell } from '../csvSanitization';

describe('sanitizeCsvCell', () => {
  it('should handle null and undefined', () => {
    expect(sanitizeCsvCell(null)).toBe('""');
    expect(sanitizeCsvCell(undefined)).toBe('""');
  });

  it('should wrap normal strings in double quotes', () => {
    expect(sanitizeCsvCell('John Doe')).toBe('"John Doe"');
    expect(sanitizeCsvCell('12345')).toBe('"12345"');
  });

  it('should prefix formula trigger characters with a single quote', () => {
    expect(sanitizeCsvCell('=1+1')).toBe('"\'=1+1"');
    expect(sanitizeCsvCell('+123')).toBe('"\'+123"');
    expect(sanitizeCsvCell('-123')).toBe('"\'-123"');
    expect(sanitizeCsvCell('@SUM(A1:A10)')).toBe('"\'@SUM(A1:A10)"');
    expect(sanitizeCsvCell('\tTabbed')).toBe('"\'\tTabbed"');
    expect(sanitizeCsvCell('\rCarriage')).toBe('"\'\rCarriage"');
  });

  it('should escape internal double quotes', () => {
    expect(sanitizeCsvCell('John "Scout" Doe')).toBe('"John ""Scout"" Doe"');
  });
});
