## 2025-05-15 - Preventing Plaintext Credential Leakage in Firestore
**Vulnerability:** Plaintext passwords were being mirrored from Firebase Auth into Firestore user documents during account creation and management.
**Learning:** Even when using secure authentication services like Firebase Auth, developers may accidentally "sync" sensitive fields to more accessible databases for convenience or by habit.
**Prevention:** Implement strict Firestore security rules that explicitly prohibit sensitive fields (like `password` or `secret`) using `!('field' in data)` in validation helpers. This ensures the database itself enforces the security boundary even if application code is misconfigured.
