## 2025-05-18 - Memoize Leader Dashboard Activity/Event Lists
**Learning:** In React dashboards with rich form state (such as input text fields), inline array sorting and date parsing during JSX render loops execute on every single keystroke.
**Action:** Memoize sorted arrays (`sortedTroopActivities`, `sortedEvents`, `approvedScouts`) using `useMemo` hooks dependent on data state rather than form input state.
