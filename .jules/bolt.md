## 2026-03-21 - Memoizing Multi-Rank Completion Calculations in RankTrackerWizard

**Learning:** Unmemoized array traversals inside render loops (such as mapping over all ranks and calling `.forEach()` on every requirement array per render) cause redundant calculations whenever unrelated UI state changes (such as expanding notes textareas or toggling modals).

**Action:** Wrap state calculations across nested data structures (like `RANKS` and their requirements) in `useMemo` hooks dependent on the core state object (`rankChecks`), allowing rank buttons and progress indicators to consume cached counts directly.
