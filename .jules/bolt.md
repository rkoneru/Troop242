## 2025-05-18 - Hoist Framer Motion Variants and Memoize Data Loading in Page Components
**Learning:** In page components rendered during navigation (such as `About.jsx`), defining animation variants inside the component function and reading/parsing `localStorage` synchronously inside inline render functions causes unnecessary object re-allocations and redundant `localStorage` lookups on every re-render frame.
**Action:** Always hoist static Framer Motion `containerVariants` and `itemVariants` to module scope, and memoize `localStorage` reads using `useMemo` hooks.
