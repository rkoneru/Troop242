## 2025-05-18 - Hardcoded Firebase Credentials in Fallback Config
**Vulnerability:** Hardcoded API keys, auth domains, and project IDs in `fallbackFirebaseConfig` in `src/firebase/firebase.js`.
**Learning:** Hardcoded fallbacks were added to allow local testing without environment variables, but exposed project API keys and Firebase config directly in source control.
**Prevention:** Rely strictly on environment variables (`import.meta.env`) for service credentials and mock configuration files in unit test setup (`setupTests.js`).
