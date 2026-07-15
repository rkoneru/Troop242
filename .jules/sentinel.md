## 2025-05-15 - Email Enumeration in Member Login
**Vulnerability:** The login form provided specific error messages for "user not found" and "wrong password", allowing an attacker to enumerate valid email addresses.
**Learning:** Firebase Auth's default error codes (`auth/user-not-found` and `auth/wrong-password`) were being mapped to user-facing strings that leaked account existence.
**Prevention:** Always use generic "Invalid email or password" messages for authentication failures.
