## 2025-05-18 - Module-level Pre-computation and Render-level Memoization

**Learning:** Search queries across static corpuses and component re-renders that filter/calculate date thresholds can spend substantial time creating temporary strings (`.toLowerCase()`) and running array filters on every render frame. Pre-computing normalized representations at module load time and memoizing derived data dependencies with `useMemo` prevents redundant string allocations and nested array traversals.

**Action:** Whenever operating on static or infrequently changing arrays, pre-compute lowercased search keys at module initialization and wrap expensive derive/filter operations in `useMemo`.
