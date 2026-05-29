## 2026-05-29 - [Memoizing nested data transformations]
**Learning:** React components that perform multi-level map/filter operations on every render can cause noticeable lag during unrelated state updates (e.g. toggling UI elements).
**Action:** Use useMemo for data filtering/mapping and move animation variants (Framer Motion) outside the component to stabilize references and reduce CPU overhead.
