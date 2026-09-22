## 2026-03-21 - Memoize Search Results and Progress Counts in SkillsTrackerWizard
**Learning:** `searchAllSkills()` was called 3 times per render frame in `SkillsTrackerWizard`, creating redundant object allocations and $O(C \times S)$ string lowercasing on every render. Likewise, category progress calculation iterated through every skill in every category on every render frame.
**Action:** Use `useMemo` for search results and category progress counts dependent on `searchQuery` and `trackedSkills` respectively to eliminate redundant computations.
