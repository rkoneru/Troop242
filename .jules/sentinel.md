## 2025-05-18 - Excluding Plaintext Passwords from Firestore User Profiles
**Vulnerability:** User creation and password reset scripts stored plaintext `password` properties in Firestore `/users/{uid}` profile documents alongside creating or updating Firebase Auth credentials.
**Learning:** Firestore profile documents are readable by authenticated users and lack password hashing. Firebase Auth manages credential hashing securely out of the box.
**Prevention:** Ensure user creation and management scripts (`add-leader.js`, `create-admin-account.js`, etc.) only store profile attributes in Firestore and rely exclusively on Firebase Auth for credential handling.
