# Sentinel's Security Journal

## 2025-05-14 - [Plaintext Password Storage in Firestore]
**Vulnerability:** Several administrative and setup scripts (`add-leader.js`, `src/firebase/create-admin-account.js`, `src/firebase/create-test-accounts.js`, `src/firebase/reset-passwords.js`) were storing plaintext passwords in the Firestore `users` collection.
**Learning:** Even when the primary authentication flow uses a secure service like Firebase Auth, legacy or maintenance scripts can inadvertently create security gaps by mirroring sensitive data into less secure storage (Firestore) for "convenience" or "fallback" purposes.
**Prevention:** Implement strict Firestore security rules (`!('password' in data)`) to enforce a schema that explicitly forbids sensitive fields, and ensure all update operations use `FieldValue.delete()` to purge existing instances of such data during transitions to a more secure architecture.
