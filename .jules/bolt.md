## 2026-03-31 - Memoizing Large Static Category Arrays and Search Filtering

**Learning:** Large dataset pages like `Badges.jsx` (with 12 categories and 140+ badges) that perform multi-pass `.map()` and `.filter()` array operations directly within component renders trigger expensive array allocations and string comparisons on every render frame, even on unrelated state updates like toggling category expansion or hover effects.

**Action:** Wrap search/filter calculations in `useMemo` hooks scoped to the search term state, and hoist static Framer Motion variant objects outside the component to preserve stable object references across renders.
