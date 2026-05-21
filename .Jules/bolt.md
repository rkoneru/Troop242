## 2025-05-15 - [Optimizing Heavy Filtering in Badges.jsx]
**Learning:** Recalculating filters for datasets of ~150 items (merit badges) on every render is a significant bottleneck, especially when unrelated state (like toggling a category expansion) triggers a re-render. Hoisting static animation variants and memoizing the filter logic measurably improves UI responsiveness.
**Action:** Always use `useMemo` for filtering operations over 50+ items and hoist static configuration objects (like Framer Motion variants) out of the component body.
