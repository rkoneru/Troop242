import { search } from '../SearchIndex';

describe('SearchIndex', () => {
  it('returns empty array for empty or short queries', () => {
    expect(search('')).toEqual([]);
    expect(search(' ')).toEqual([]);
    expect(search('a')).toEqual([]);
  });

  it('finds exact title matches and scores them highest', () => {
    const results = search('Home');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe('Home');
    expect(results[0].score).toBeGreaterThanOrEqual(100);
  });

  it('finds results case-insensitively', () => {
    const resultsLower = search('eagle');
    const resultsUpper = search('EAGLE');
    expect(resultsLower.length).toBeGreaterThan(0);
    expect(resultsLower).toEqual(resultsUpper);
  });

  it('finds results matching partial terms in title or excerpt', () => {
    const results = search('camping');
    expect(results.length).toBeGreaterThan(0);
    const hasCamping = results.some(
      (r) => r.title.toLowerCase().includes('camping') || r.excerpt.toLowerCase().includes('camping')
    );
    expect(hasCamping).toBe(true);
  });

  it('limits results to a maximum of 6', () => {
    const results = search('scout');
    expect(results.length).toBeLessThanOrEqual(6);
  });

  it('correctly ranks results by score descending', () => {
    const results = search('rank');
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
    }
  });
});
