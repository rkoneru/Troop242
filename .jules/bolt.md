## 2026-05-13 - Memoization of Large Filtered Lists
**Learning:** In components like `Badges.jsx` that render and filter large datasets (~150 items), failing to memoize the filtered results causes expensive O(N) operations on every render, even when the filter criteria haven't changed. This is especially noticeable when other local state (like UI expansion toggles) changes frequently.

**Action:** Always wrap heavy data processing or filtering logic in `useMemo` and move static configuration objects (like animation variants) outside the component scope to avoid unnecessary pressure on the React reconciler.
