## 2025-05-15 - Optimizing Search with Debouncing
**Learning:** Rapid typing in the search input triggered the search index algorithm on every keystroke, causing unnecessary CPU cycles and potentially leading to a jittery UI if result sets changed frequently. This was particularly noticeable as the search corpus grew.
**Action:** Implemented a 300ms debounce in the SearchWidget's useEffect hook using setTimeout and clearTimeout. This ensures that the search index is only queried once the user has stopped typing for a short duration, significantly reducing the number of executions.
