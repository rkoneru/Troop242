## 2025-05-14 - Credential leakage in Firestore

**Vulnerability:** Several administrative and test scripts were persisting plaintext passwords in the Firestore `users` collection during account creation or reset. Additionally, these passwords were being logged during account verification.

**Learning:** When using a dedicated authentication service like Firebase Auth, there is a risk that developers might redundantly store credentials in the primary database (Firestore) for convenience or as a fallback. This bypasses the security benefits of the auth service (hashing, salting, secure storage) and creates a high-impact vulnerability where a database leak or overly permissive read rules could expose all user passwords.

**Prevention:**
1. Never store passwords or sensitive credentials in Firestore.
2. Use Firestore security rules to explicitly forbid the presence of sensitive fields like `password` in user documents.
3. Review administrative and utility scripts during security audits, as they often contain "quick fixes" or hardcoded data that bypass standard security practices.
4. Sanitize all logging to ensure that sensitive fields are never printed to the console or stored in log files.
