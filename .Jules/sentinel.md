## 2026-05-19 - [Secure Randomness and Rule Hardening]
**Vulnerability:** Use of `Math.random()` for sensitive data (invite codes, temporary passwords) and overly permissive `auditLogs` Firestore rules.
**Learning:** Even if "public" config is used in Firebase, sensitive identifiers and credentials must be generated with CSPRNG (`crypto.getRandomValues()`) to prevent predictability and brute-force attacks.
**Prevention:** Always use a centralized security utility for randomness and ensure Firestore rules follow the principle of least privilege, explicitly denying client-side creation for system logs.
