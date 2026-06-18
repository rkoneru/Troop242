## 2025-05-22 - Plaintext passwords in Firestore
**Vulnerability:** Plaintext passwords were being stored in the `users` collection in Firestore by administrative and setup scripts, despite using Firebase Auth for authentication.
**Learning:** Even when using secure authentication providers like Firebase Auth, developers may inadvertently store sensitive data in secondary databases for convenience or by mistake during script creation.
**Prevention:** Always verify that user-provided secrets are only passed to the authentication provider and never persisted in application databases. Use Firestore rules to prevent the storage of a `password` field in the `users` collection.
