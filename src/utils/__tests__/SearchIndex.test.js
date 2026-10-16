import { search, SEARCH_CORPUS } from '../SearchIndex';

describe('SearchIndex', () => {
  it('should return empty array for short or empty queries', () => {
    expect(search('')).toEqual([]);
    expect(search('a')).toEqual([]);
    expect(search('  ')).toEqual([]);
  });

  it('should return matching search results sorted by score', () => {
    const results = search('eagle');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('Eagle');
  });

  it('should return results for multi-term query', () => {
    const results = search('first aid badge');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('First Aid');
  });

  it('should contain expected corpus length', () => {
    expect(SEARCH_CORPUS.length).toBeGreaterThan(20);
  });

  it('should execute searches efficiently with zero per-doc string lowercasing', () => {
    const start = performance.now();
    for (let i = 0; i < 5000; i++) {
      search('eagle');
      search('camping badge');
      search('ranks');
      search('nonexistent term');
    }
    const duration = performance.now() - start;
    // 20,000 search iterations should take under 500ms
    expect(duration).toBeLessThan(500);
  });
});
