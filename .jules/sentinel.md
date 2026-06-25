## 2025-05-15 - Hardening against plaintext password storage

**Vulnerability:** Administrative scripts were persisting plaintext passwords in the Firestore `users` collection alongside Firebase Auth creation.

**Learning:** Relying on developer discipline to avoid sensitive data persistence is fragile. Security rules can act as a final gatekeeper to enforce data schemas that exclude sensitive fields.

**Prevention:** Added `!('password' in data)` to Firestore `isValidUser` rules to reject any client or admin-side write that attempts to include a plaintext password field. Scrubbed all administrative scripts to remove the redundant and insecure password persistence.
