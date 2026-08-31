## 2026-03-21 - Memoize sorted activities, events, and scouts in LeaderDashboard

**Learning:** In `src/pages/LeaderDashboard.jsx`, rendering tabs (Activities, Events, Signups, Progress) performed inline `.slice().sort(...)` and `.filter(...).sort(...)` array transformations inside JSX. This triggered redundant array copying, date parsing (`new Date(a.date)`), string comparison (`localeCompare`), and array sorting on every component re-render (such as state updates during input typing or modal toggles).

**Action:** Wrap derived sorted arrays (`sortedTroopActivities`, `sortedEvents`, `approvedScouts`) in `useMemo` hooks depending on `[troopActivities]`, `[events]`, and `[scoutsData]`.
