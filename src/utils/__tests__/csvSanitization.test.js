import { sanitizeCsvCell } from '../csvSanitization';

describe('sanitizeCsvCell', () => {
  it('should return empty quoted string for null or undefined', () => {
    expect(sanitizeCsvCell(null)).toBe('');
    expect(sanitizeCsvCell(undefined)).toBe('');
  });

  it('should wrap safe plain text in quotes', () => {
    expect(sanitizeCsvCell('John Doe')).toBe('"John Doe"');
    expect(sanitizeCsvCell('Eagle')).toBe('"Eagle"');
  });

  it('should escape double quotes inside cell values', () => {
    expect(sanitizeCsvCell('John "Scout" Doe')).toBe('"John ""Scout"" Doe"');
  });

  it('should prefix cells starting with = with a single quote', () => {
    expect(sanitizeCsvCell('=1+2')).toBe('"' + "'" + '=1+2"');
    expect(sanitizeCsvCell('=CMD|\' /C calc\'!\'A1\'')).toBe('"' + "'" + '=CMD|\' /C calc\'!\'A1\'"');
  });

  it('should prefix cells starting with + with a single quote', () => {
    expect(sanitizeCsvCell('+SUM(1,2)')).toBe('"' + "'" + '+SUM(1,2)"');
  });

  it('should prefix cells starting with - with a single quote', () => {
    expect(sanitizeCsvCell('-1+1')).toBe('"' + "'" + '-1+1"');
  });

  it('should prefix cells starting with @ with a single quote', () => {
    expect(sanitizeCsvCell('@SUM(1,2)')).toBe('"' + "'" + '@SUM(1,2)"');
  });

  it('should prefix cells starting with whitespace followed by trigger character', () => {
    expect(sanitizeCsvCell('  =1+2')).toBe('"' + "'" + '  =1+2"');
  });

  it('should handle numbers correctly', () => {
    expect(sanitizeCsvCell(12345)).toBe('"12345"');
  });
});
