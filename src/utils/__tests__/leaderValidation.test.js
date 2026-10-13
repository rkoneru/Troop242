import { sanitizeInput } from '../leaderValidation';

describe('sanitizeInput', () => {
  it('should escape HTML special characters to prevent XSS', () => {
    const input = '<script>alert("xss" & \'test\')</script>';
    const expected = '&lt;script&gt;alert(&quot;xss&quot; &amp; &#x27;test&#x27;)&lt;&#x2F;script&gt;';
    expect(sanitizeInput(input)).toBe(expected);
  });

  it('should escape forward slashes correctly', () => {
    const input = '</div';
    expect(sanitizeInput(input)).toBe('&lt;&#x2F;div');
  });

  it('should return non-string inputs unchanged', () => {
    expect(sanitizeInput(123)).toBe(123);
    expect(sanitizeInput(null)).toBeNull();
    expect(sanitizeInput(undefined)).toBeUndefined();
    expect(sanitizeInput(true)).toBe(true);
  });

  it('should return plain safe text unchanged', () => {
    const input = 'Hello World 123';
    expect(sanitizeInput(input)).toBe('Hello World 123');
  });
});
