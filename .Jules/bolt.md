## 2025-05-15 - [Search Debounce Implementation]
**Learning:** JSDOM environment for this project lacks `TextEncoder` and `TextDecoder`, which are required by modern libraries like React Router 7.
**Action:** Polyfilled `TextEncoder` and `TextDecoder` in `src/setupTests.js` to enable component testing for `SearchWidget` and future components.
