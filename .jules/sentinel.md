## 2025-05-15 - [Privilege Escalation and Information Leakage]
**Vulnerability:** Users could potentially promote their own roles or approve their own accounts via Firestore updates. Authentication error messages leaked whether an email was registered (Email Enumeration). Unauthorized clients could write spoofed audit logs.
**Learning:** Granular Firestore rules (splitting write into create/update) are essential for profile management. Generic error messages in authentication flows are a critical defense against enumeration.
**Prevention:** Always enforce default roles/status on document creation in Firestore rules. Use generic error messages for all authentication-related failures.
