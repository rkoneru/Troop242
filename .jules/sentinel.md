## 2025-05-15 - Plaintext Password Storage in Firestore
**Vulnerability:** Administrative and test setup scripts were storing user passwords in plaintext within Firestore documents.
**Learning:** While Firebase Authentication securely hashes passwords, developers often mistakenly store the same password in a custom `users` collection for convenience or "fallback" purposes, inadvertently exposing them.
**Prevention:** Remove all logic that writes passwords to Firestore. Use Firestore security rules to explicitly forbid the presence of a `password` field in user documents (`!('password' in data)`).
