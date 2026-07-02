## 2025-05-15 - Firestore Privilege Escalation
**Vulnerability:** Authenticated users could update their own `role` and `status` fields in the `users` collection, allowing them to grant themselves administrative privileges.
**Learning:** Standard "allow write: if isOwnUser(uid)" rules are insufficient when a document contains authorization metadata.
**Prevention:** Always enforce immutability on sensitive fields like `role` and `status` for non-admin users: `request.resource.data.role == resource.data.role`.

## 2025-05-15 - Plaintext Password Storage in Firestore
**Vulnerability:** Several administrative scripts were storing user passwords in plaintext in Firestore documents, and the `isValidUser` rule did not prevent this.
**Learning:** Firestore is not a secure place for credentials, even with strict read rules.
**Prevention:** Add `!('password' in data)` to Firestore validation rules and ensure administrative scripts only use Firebase Auth for credential management.
