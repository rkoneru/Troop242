## 2026-06-21 - Plaintext Password Persistence in Administrative Scripts
**Vulnerability:** Administrative scripts (`add-leader.js`, `create-test-accounts.js`, etc.) were persisting plaintext passwords in the Firestore `users` collection, despite authentication being handled by Firebase Auth.
**Learning:** Security audits must include auxiliary scripts and "one-off" tools, not just the main application code, as they often operate with higher privileges and may bypass standard security controls.
**Prevention:** Enforce strict Schema validation at the database level (Firestore Rules) to reject sensitive fields like `password` and use centralized user creation utilities that follow the security model.
