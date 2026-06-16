# Sentinel Security Journal

## 2025-05-15 - Preventing Plaintext Password Storage in Firestore
**Vulnerability:** Administrative scripts and legacy code were storing plaintext passwords in the Firestore `users` collection, creating a data breach risk.
**Learning:** Even when using Firebase Auth for secure authentication, it's easy for developers to accidentally duplicate sensitive data (like passwords) into Firestore for "convenience" or "fallback" purposes.
**Prevention:** 1. Enforce security at the database level using Firestore rules (e.g., `!('password' in data)`) to programmatically reject documents containing sensitive fields. 2. Audit administrative and setup scripts to ensure they only pass sensitive credentials to the Auth service and not the database.
