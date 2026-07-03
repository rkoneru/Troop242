## 2025-05-15 - Email Enumeration Hardening
**Vulnerability:** The login page returned specific errors for "User not found" vs "Wrong password", allowing attackers to verify valid email addresses.
**Learning:** Firebase Auth provides granular error codes that are helpful for debugging but risky in production if exposed directly to the UI.
**Prevention:** Always map authentication-related error codes (`auth/user-not-found`, `auth/wrong-password`, `auth/invalid-email`, `auth/invalid-credential`) to a single generic message like "Invalid email or password".

## 2025-05-15 - Firestore Fail-safe for Plaintext Passwords
**Vulnerability:** Accidental storage of plaintext passwords in the `users` collection if a developer includes a `password` field in a `setDoc` or `updateDoc` call.
**Learning:** Firestore security rules can act as a final layer of defense by validating that sensitive fields (like `password`) are never present in the data being written.
**Prevention:** Use `!('password' in data)` in Firestore validation helpers for user-related collections to ensure only expected fields are stored.
