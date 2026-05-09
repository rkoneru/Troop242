## 2025-05-14 - [Memoization of Large Dataset Filtering]
**Learning:** In components rendering ~150+ items (like merit badges), filtering logic and metadata derivation (regex, lookups) inside the render loop significantly impact performance when unrelated state (like UI toggles) changes.
**Action:** Move expensive data derivation to module-level constants or useMemo, and memoize filtered results to prevent redundant processing.
