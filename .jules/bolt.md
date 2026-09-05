## 2026-03-31 - Memoizing Category & Progress Metrics in MiscAwardsTracker

**Learning:** Component renders executing $O(C \times A)$ array filtering inside list iterations (such as `.map` over categories calculating `.filter` over items) cause unneeded calculations on every render state change.
**Action:** Memoize per-category and total progress metrics using `useMemo` dependent on state variables so computations execute only when source data changes.
