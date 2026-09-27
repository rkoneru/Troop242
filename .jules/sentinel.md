## 2025-05-18 - Plaintext Password Storage in Firestore User Documents
**Vulnerability:** The script `add-leader.js` was storing unhashed user passwords in plaintext directly in Firestore user documents when creating leader accounts (`password: password`).
**Learning:** Firebase Auth handles user password hashing and authentication securely out-of-the-box. Developers mistakenly replicated password fields in Firestore user profile documents for convenience, creating database leaks of unhashed credentials.
**Prevention:** Never store plaintext or unhashed passwords in database collections or documents. Rely exclusively on dedicated identity and authentication providers (such as Firebase Auth) to manage credentials.
