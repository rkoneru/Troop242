## 2025-05-14 - JSDOM Environment Compatibility
**Learning:** Testing components that use React Router 7 or certain Firebase utilities in this project fails due to missing `TextEncoder` and `TextDecoder` in the JSDOM environment.
**Action:** Polyfill `TextEncoder` and `TextDecoder` in `src/setupTests.js` using the `util` package to enable reliable component testing across the codebase.
