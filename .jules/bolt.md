## 2026-03-31 - React Rules of Hooks with Early Returns in Dashboard Components
**Learning:** When memoizing calculations or handlers in components with status-based early returns (e.g. pending approval states in `ScoutDashboard`), hooks placed after early returns trigger `react-hooks/rules-of-hooks` errors.
**Action:** Always place all `useMemo` and `useCallback` hook declarations at the very top of component function bodies before any conditional return checks.
