# Bolt's Journal

## 2025-05-23 - Search and Filtering Optimizations

**Learning:** Global search widgets and large-list filtering are common bottlenecks in React apps. Even with small datasets, redundant computations on every keystroke or unrelated state change can cause cumulative lag, especially on lower-end devices.

**Action:**
1. Always debounce search inputs that trigger scoring or filtering logic (300ms is a good sweet spot).
2. Memoize expensive filtering logic that depends on search terms but is hosted in components with other independent states (like expanded/collapsed toggles).
