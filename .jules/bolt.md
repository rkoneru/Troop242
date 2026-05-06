## 2026-05-06 - [Memoization & Debouncing in Heavy UI Components]
**Learning:** Pre-processing static metadata at the module level and using useMemo for filtering large datasets (e.g., ~150 merit badges) significantly reduces render-loop overhead. Debouncing search inputs to 300ms prevents redundant O(N) calculations on every keystroke.
**Action:** Always look for O(N) operations inside render loops and consider moving them to module-level constants or memoizing them based on relevant state.
