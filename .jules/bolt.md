## 2026-03-31 - Memoizing Repeated JSX Utility Functions in Tracker Wizards
**Learning:** Functions called multiple times directly inside JSX conditionals (like `searchAllSkills()` in wizard components) perform redundant full-array traversals during each render frame, compounding re-renders when typing or expanding list items.
**Action:** Memoize array filtering and search computations using `useMemo` so calculations run once per dependency update rather than multiple times per render frame.
