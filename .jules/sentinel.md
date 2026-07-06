## 2025-05-15 - Hardening Authentication and Data Protection

**Vulnerability:** Email enumeration via granular error messages and potential plaintext password storage in Firestore.
**Learning:** Granular error handling in authentication flows (e.g., distinguishing between "user not found" and "wrong password") facilitates account enumeration. Additionally, while Firebase Auth is secure, application-level data stores (Firestore) can be accidentally polluted with sensitive data like plaintext passwords if not restricted at the database level.
**Prevention:** 1. Map common Firebase Auth error codes (`auth/user-not-found`, `auth/wrong-password`, `auth/invalid-email`, `auth/invalid-credential`) to a generic "Invalid email or password" message. 2. Implement strict Firestore security rules that explicitly forbid the presence of a "password" field in the users collection using `!('password' in data)`.
