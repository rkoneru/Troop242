## 2025-05-15 - Firestore Privilege Escalation Prevention
**Vulnerability:** Users were able to self-promote to 'admin' or 'leader' roles because Firestore rules allowed 'write' access to own documents without checking for field immutability.
**Learning:** Generic 'allow write' rules on user profiles are dangerous if they don't explicitly prevent modification of sensitive fields like 'role' or 'status'.
**Prevention:** Always split 'write' into 'create' and 'update'. Use 'request.resource.data.field == resource.data.field' in 'update' rules to enforce immutability of authorization fields.
