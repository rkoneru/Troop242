## 2026-03-31 - Remove Hardcoded Firebase API Key and Fallback Config
**Vulnerability:** `fallbackFirebaseConfig` contained hardcoded API key (`AIzaSyCN...`), project ID, app ID, and auth domain in `src/firebase/firebase.js`.
**Learning:** Having fallback objects with hardcoded credentials in source control risks exposing project API keys or leaking project credentials if environment variables fail to load.
**Prevention:** Always require credentials to be injected explicitly through environment variables (`VITE_FIREBASE_*`) without committing hardcoded fallback credentials to source code.
