## 2025-05-28 - [Search Debouncing]
**Learning:** The SearchWidget was performing a full index scan on every keystroke, which leads to unnecessary main-thread work and state updates during rapid typing. Centralized search utilities in this app should be called via debounced handlers to maintain responsiveness.
**Action:** Always implement debouncing (e.g., 300ms) for real-time search inputs that query large corpus arrays.

## 2025-05-28 - [Testing Environment Polyfills]
**Learning:** Testing React 19 / React Router 7 components in JSDOM requires manual polyfilling of `TextEncoder` and `TextDecoder` in `setupTests.js` to avoid ReferenceErrors during component mounting in tests.
**Action:** Ensure `setupTests.js` includes necessary Web API polyfills when adding new component tests.
