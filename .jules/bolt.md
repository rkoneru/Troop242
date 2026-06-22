## 2025-05-14 - Debounced Search Optimization
**Learning:** High-frequency state updates like typing in a search input can trigger excessive calculations and re-renders if the search logic is directly tied to the input state.
**Action:** Always implement a debounce (e.g., 300ms) for search functionality to improve UI responsiveness and reduce CPU usage during user input.
