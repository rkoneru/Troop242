# Bolt's Performance Journal

## 2025-05-15 - Search Debouncing & Test Environment
**Learning:** Implementing debouncing in `SearchWidget.jsx` significantly reduces redundant computations during rapid user input. Additionally, modern React 19 and React Router 7 dependencies require `TextEncoder`, `TextDecoder`, and `IntersectionObserver` polyfills in the Jest environment (`setupTests.js`) to prevent suite-wide failures.
**Action:** Apply debounce patterns to all high-frequency input handlers and ensure the test environment is pre-configured with modern Web API polyfills.
