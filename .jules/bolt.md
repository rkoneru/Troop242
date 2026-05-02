
## 2026-05-02 - [Search Debounce Implementation]
**Learning:** Direct synchronous state updates (like `setResults([])`) inside `useEffect` are flagged by local linting rules (react-hooks/set-state-in-effect). While a 0ms `setTimeout` bypasses this, it is cleaner to handle immediate UI resets (like clearing results for short queries) in event handlers (`onChange`, `onClick`) while keeping the `useEffect` for the asynchronous debounced operation.
**Action:** Handle UI resets in event handlers and reserve `useEffect` for debounced side effects to satisfy linting and maintain performance.
