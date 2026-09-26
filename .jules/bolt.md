## 2025-05-18 - Memoizing array lookups and animation variants in list pages
**Learning:** Checking item status using `array.find(...).some(...)` inside `map()` or component body creates $O(N^2)$ nested iterations on every render frame. Pre-computing a `Set` of signed-up IDs via `useMemo` reduces check operations from $O(N^2)$ to $O(1)$.
**Action:** When rendering lists with status checks, create a memoized lookup `Set` or map using `useMemo` and hoist static Framer Motion animation variants to module scope.
