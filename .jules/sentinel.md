## 2026-07-05 - [Hardened Firestore Rules]
**Vulnerability:** Privilege escalation via self-update of 'role' and 'status' fields in 'users' collection; client-side log injection in 'auditLogs'.
**Learning:** Broad 'write' rules on user documents can allow users to elevate their own privileges. Separating 'create' and 'update' with specific field immutability is essential.
**Prevention:** Always enforce immutability for sensitive fields like 'role' and 'status' in Firestore update rules, and restrict self-registration to the lowest privilege level. Disable client-side creation for system-critical collections like 'auditLogs'.
