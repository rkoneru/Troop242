## 2025-05-15 - Missing Search Debounce
**Learning:** Found that `SearchWidget.jsx` was performing search operations on every keystroke. While local search is fast, it triggers redundant state updates and re-renders of the results list for every character typed, which is inefficient during rapid typing. Codebase standards recommend a 300ms debounce.
**Action:** Implement 300ms debounce in `SearchWidget.jsx` using `setTimeout` within `useEffect`.
