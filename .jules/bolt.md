## 2025-05-15 - Debounce Search Input
**Learning:** Adding a 300ms debounce to the global search input significantly reduces redundant computations in the `search` function. Without debouncing, every single keystroke triggers a full search of the `SEARCH_CORPUS`, which, while small now, could lead to UI stuttering as the corpus grows or on lower-end devices.
**Action:** Always implement debouncing for search inputs that trigger local or remote filtering to preserve main thread responsiveness.
