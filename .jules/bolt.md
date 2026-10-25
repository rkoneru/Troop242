## 2026-03-31 - Memoizing React Component Calculations and Callbacks

**Learning:** When optimizing React wizard components (like `RankTrackerWizard.jsx`), pre-calculating nested completion counts across all categories/ranks using `useMemo` avoids redundant $O(N \times M)$ iterations when local state changes (e.g. expanding notes or typing into input fields).

**Action:** Ensure asynchronous side effects (like Firestore `setDoc`) are kept outside `setState` updater functions to avoid side-effect execution during speculative re-renders or React Strict Mode passes.
