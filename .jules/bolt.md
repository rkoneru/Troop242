## 2026-03-22 - Memoize activity and event list transformations in ActivitiesPage
**Learning:** In `ActivitiesPage.jsx`, inline array `.filter()` and `.sort()` calls recalculated upcoming activities, events, and user signup states on every render pass, triggering unnecessary date instantiations (`new Date()`).
**Action:** Consolidate data derivation into a single `useMemo` block keyed on `[allItems, user?.uid]` to optimize render speed and maintain reference stability.
