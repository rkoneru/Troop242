## 2025-05-15 - Enforcing No-Password Policy in Firestore
**Vulnerability:** Plaintext passwords were being stored in Firestore user documents by administrative and setup scripts, creating a risk of credential exposure if the database were compromised or read rules were misconfigured.
**Learning:** Even when using a secure authentication service like Firebase Auth, it's easy for legacy or convenience-focused setup scripts to duplicate sensitive data into the primary database.
**Prevention:** Use Firestore security rules with a `!('password' in data)` check to programmatically prevent the storage of sensitive fields, ensuring that the database remains a "zero-knowledge" zone for credentials.
