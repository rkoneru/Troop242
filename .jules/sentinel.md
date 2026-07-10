## 2025-05-15 - Plaintext Password Storage in Firestore
**Vulnerability:** Administrative setup scripts (`add-leader.js`, `create-test-accounts.js`, etc.) were storing user passwords in plaintext within the `users` collection in Firestore.
**Learning:** The application likely used these fields for legacy debugging or as a fallback, even though Firebase Auth handles secure password storage. This created a significant credential exposure risk if Firestore data was leaked or improperly accessed.
**Prevention:** Always rely on dedicated authentication services (like Firebase Auth) for credential management. Enforce document schemas via Firestore security rules to explicitly reject sensitive fields like `password` from being stored in the database.

## 2025-05-15 - Unrestricted Client-Side Audit Log Creation
**Vulnerability:** Firestore rules for the `auditLogs` collection used `allow create: if true;`, permitting any authenticated (or even unauthenticated) user to inject arbitrary log entries.
**Learning:** Permissive rules are often left in place during development to simplify testing of logging functionality. However, audit logs must be immutable and only writable by trusted system components to maintain their integrity.
**Prevention:** Restrict `create` access on audit and sensitive logging collections to `false` in client-side rules. Use the Admin SDK within Cloud Functions or trusted backend environments to write these logs, as the Admin SDK bypasses security rules.
