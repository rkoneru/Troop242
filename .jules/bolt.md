## 2025-05-18 - Single-Pass Map Aggregation for Financial Ledger Data
**Learning:** Re-computing scout-level financial balances using per-item `array.filter()` and `array.reduce()` inside render loops scales quadratically $O(S \times (D + P))$ and re-runs on every controlled form input keystroke.
**Action:** Compute financial totals and building lookup maps in a single linear $O(D + P)$ pass using `useMemo` dependent on underlying data arrays.
