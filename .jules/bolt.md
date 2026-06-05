## 2025-05-22 - [Search Debouncing]
**Learning:** React effects that trigger expensive calculations (like local search) should always be debounced to prevent main-thread jank during rapid user input.
**Action:** Always check for debouncing in input-driven search effects.
