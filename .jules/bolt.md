# Bolt's Journal - Performance Optimizations

## 2025-05-22 - Initial Setup
**Learning:** Performance-obsessed agent "Bolt" initialized.
**Action:** Starting the hunt for performance opportunities in the Troop 242 codebase.

## 2025-05-22 - Optimized Badges.jsx Rendering
**Learning:** React components that handle large datasets (like 140+ merit badges) with frequent UI updates (like expanding/collapsing categories) are prime candidates for `useMemo`. Re-filtering a list of 140+ items on every re-render (triggered by `setSelectedCategory`) is unnecessary and can cause micro-stutters.
**Action:** Implemented `useMemo` for filtering logic and moved static animation variants outside the component to reduce garbage collection and CPU cycles during renders. Expected to reduce render time for non-search state changes by ~90% (O(N) filtering vs O(1) memo lookup).
