import { sanitizeCsvCell } from '../csvSanitization';

describe('sanitizeCsvCell', () => {
  it('should enclose standard values in double quotes', () => {
    expect(sanitizeCsvCell('John Doe')).toBe('"John Doe"');
    expect(sanitizeCsvCell('12345')).toBe('"12345"');
  });

  it('should handle null and undefined', () => {
    expect(sanitizeCsvCell(null)).toBe('""');
    expect(sanitizeCsvCell(undefined)).toBe('""');
  });

  it('should escape internal double quotes', () => {
    expect(sanitizeCsvCell('John "Eagle" Doe')).toBe('"John ""Eagle"" Doe"');
  });

  it('should prefix formula trigger characters with a single quote', () => {
    expect(sanitizeCsvCell('=1+2')).toBe('"\'=1+2"');
    expect(sanitizeCsvCell('+100')).toBe('"\'+100"');
    expect(sanitizeCsvCell('-50')).toBe('"\'-50"');
    expect(sanitizeCsvCell('@SUM(A1:A5)')).toBe('"\'@SUM(A1:A5)"');
    expect(sanitizeCsvCell('\tTabbed')).toBe('"\'\tTabbed"');
  });
});
