## 2026-03-22 - Remove Hardcoded Firebase Credentials
**Vulnerability:** Hardcoded API key and Firebase credentials in `src/firebase/firebase.js` fallback configuration object.
**Learning:** Hardcoded credentials in source files expose infrastructure details in source control and production bundles even when environment variable fallbacks are intended.
**Prevention:** Rely strictly on environment variables (`import.meta.env.VITE_FIREBASE_*`) for client configuration and mock the local config module in `setupTests.js` for unit test execution.
