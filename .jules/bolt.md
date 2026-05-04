## 2025-05-14 - [Memoized Merit Badge Filtering]
**Learning:** Derived state involving nested mapping and filtering over datasets (like the ~150 merit badges) should be memoized with `useMemo`. Without it, these O(N) operations run on every render, even when triggered by unrelated state changes (e.g., expanding/collapsing UI elements).
**Action:** Always wrap heavy data transformations in `useMemo` and ensure dependency arrays only include the specific inputs that affect the result.
