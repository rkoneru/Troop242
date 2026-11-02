/**
 * Unit tests for SearchIndex utility
 */

import { search, SEARCH_CORPUS } from '../SearchIndex';

describe('SearchIndex', () => {
  it('should return an empty array for empty or short queries', () => {
    expect(search('')).toEqual([]);
    expect(search(' ')).toEqual([]);
    expect(search('a')).toEqual([]);
    expect(search(null)).toEqual([]);
    expect(search(undefined)).toEqual([]);
  });

  it('should return matching documents for valid queries', () => {
    const results = search('camp');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe('Camping Merit Badge');
  });

  it('should prioritize exact and prefix title matches with highest scores', () => {
    const results = search('Eagle');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe('Eagle Scout Rank');
    expect(results[0].score).toBeGreaterThan(50);
  });

  it('should match multiple query terms', () => {
    const results = search('spring campout');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe('Spring Campout');
  });

  it('should return at most 6 results sorted in descending score order', () => {
    const results = search('scout');
    expect(results.length).toBeLessThanOrEqual(6);
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
    }
  });

  it('should preserve original document properties', () => {
    const results = search('ranks');
    expect(results.length).toBeGreaterThan(0);
    const item = results[0];
    expect(item).toHaveProperty('title');
    expect(item).toHaveProperty('excerpt');
    expect(item).toHaveProperty('url');
    expect(item).toHaveProperty('category');
    expect(item).toHaveProperty('icon');
    expect(item).toHaveProperty('score');
  });

  it('should export SEARCH_CORPUS with documents', () => {
    expect(Array.isArray(SEARCH_CORPUS)).toBe(true);
    expect(SEARCH_CORPUS.length).toBeGreaterThan(0);
  });
});
