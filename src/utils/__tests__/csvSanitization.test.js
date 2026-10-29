import { sanitizeCsvCell } from '../csvSanitization';

describe('sanitizeCsvCell', () => {
  it('should handle null and undefined values safely', () => {
    expect(sanitizeCsvCell(null)).toBe('""');
    expect(sanitizeCsvCell(undefined)).toBe('""');
  });

  it('should quote standard string values', () => {
    expect(sanitizeCsvCell('John Doe')).toBe('"John Doe"');
    expect(sanitizeCsvCell('Scout')).toBe('"Scout"');
  });

  it('should handle numbers and booleans correctly', () => {
    expect(sanitizeCsvCell(123)).toBe('"123"');
    expect(sanitizeCsvCell(true)).toBe('"true"');
  });

  it('should escape internal double quotes', () => {
    expect(sanitizeCsvCell('John "Eagle" Doe')).toBe('"John ""Eagle"" Doe"');
  });

  it('should escape formula injection triggers with a leading single quote', () => {
    // Formula starting with =
    expect(sanitizeCsvCell('=1+2')).toBe('"\'=1+2"');
    // Formula starting with +
    expect(sanitizeCsvCell('+1234567890')).toBe('"\'+1234567890"');
    // Formula starting with -
    expect(sanitizeCsvCell('-1+1')).toBe('"\' -1+1"'.replace(' ', ''));
    // Formula starting with @
    expect(sanitizeCsvCell('@SUM(1,2)')).toBe('"\'@SUM(1,2)"');
    // Starts with tab
    expect(sanitizeCsvCell('\tcmd')).toBe('"\'\tcmd"');
  });

  it('should prevent malicious DDE / CMD execution payload injection', () => {
    const maliciousPayload = '=cmd|\' /C calc\'!A0';
    expect(sanitizeCsvCell(maliciousPayload)).toBe('"\'=cmd|\' /C calc\'!A0"');
  });
});
