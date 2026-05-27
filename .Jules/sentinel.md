## 2025-05-14 - [Plaintext Password Exposure in Administrative Scripts]
**Vulnerability:** User passwords were being stored in plaintext in the Firestore `users` collection and logged to the console during account creation, reset, and verification processes.
**Learning:** Even administrative scripts can introduce security risks by redundantly storing sensitive data that should be managed exclusively by specialized services like Firebase Auth.
**Prevention:** Always verify that sensitive credentials like passwords are not included in database write operations or non-secure logs. Use specialized identity providers for credential management and never store passwords in plaintext.
