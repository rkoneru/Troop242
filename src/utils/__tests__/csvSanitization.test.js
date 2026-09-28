import { sanitizeCsvCell } from '../csvSanitization';

describe('sanitizeCsvCell', () => {
  it('handles null and undefined values gracefully', () => {
    expect(sanitizeCsvCell(null)).toBe('');
    expect(sanitizeCsvCell(undefined)).toBe('');
  });

  it('leaves normal strings unchanged', () => {
    expect(sanitizeCsvCell('John Doe')).toBe('John Doe');
    expect(sanitizeCsvCell('scout@example.com')).toBe('scout@example.com');
  });

  it('escapes double quotes', () => {
    expect(sanitizeCsvCell('John "Eagle" Scout')).toBe('John ""Eagle"" Scout');
  });

  it('prefixes formula injection characters (=, +, -, @, \\t, \\r) with single quote', () => {
    expect(sanitizeCsvCell('=1+1')).toBe("'=1+1");
    expect(sanitizeCsvCell('+1+1')).toBe("'+1+1");
    expect(sanitizeCsvCell('-1+1')).toBe("'-1+1");
    expect(sanitizeCsvCell('@SUM(1,2)')).toBe("'@SUM(1,2)");
    expect(sanitizeCsvCell('\tcmd')).toBe("'\tcmd");
    expect(sanitizeCsvCell('\rcmd')).toBe("'\rcmd");
  });

  it('handles combined formula injection and double quotes', () => {
    expect(sanitizeCsvCell('=cmd|" /C calc"!"A1"')).toBe('\'=cmd|"" /C calc""!""A1""');
  });
});
