import { sanitizeCsvCell } from '../csvSanitization';

describe('sanitizeCsvCell', () => {
  it('handles null and undefined values safely', () => {
    expect(sanitizeCsvCell(null)).toBe('""');
    expect(sanitizeCsvCell(undefined)).toBe('""');
  });

  it('quotes normal text without formula characters', () => {
    expect(sanitizeCsvCell('John Scout')).toBe('"John Scout"');
    expect(sanitizeCsvCell(123)).toBe('"123"');
  });

  it('escapes double quotes inside cell values', () => {
    expect(sanitizeCsvCell('John "Eagle" Scout')).toBe('"John ""Eagle"" Scout"');
  });

  it('prefixes formula trigger characters with a single quote', () => {
    expect(sanitizeCsvCell('=1+2')).toBe('"' + "'=1+2" + '"');
    expect(sanitizeCsvCell('+12345')).toBe('"' + "'+12345" + '"');
    expect(sanitizeCsvCell('-12345')).toBe('"' + "'-12345" + '"');
    expect(sanitizeCsvCell('@SUM(A1:A10)')).toBe('"' + "'@SUM(A1:A10)" + '"');
    expect(sanitizeCsvCell('\tcmd')).toBe('"' + "'\tcmd" + '"');
    expect(sanitizeCsvCell('\rcmd')).toBe('"' + "'\rcmd" + '"');
  });

  it('handles leading spaces before formula trigger characters', () => {
    expect(sanitizeCsvCell('  =1+2')).toBe('"' + "'  =1+2" + '"');
  });
});
