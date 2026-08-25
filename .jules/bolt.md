## 2026-03-21 - Optimize activity signup lookups with Set memoization
**Learning:** Checking signup status by calling `activities.find(...).signedUp.some(...)` inside render loops or helper functions causes $O(N^2)$ lookups when iterating over activity cards or calculating header counts.
**Action:** Memoize user signed-up item IDs into a `Set` using `useMemo` depending on `[activities, user?.uid]` to perform $O(1)$ set lookups during card rendering and stats calculations.
