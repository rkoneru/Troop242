## 2026-06-14 - Mitigate Email Enumeration in Login
**Vulnerability:** Information leakage via specific Firebase Auth error messages.
**Learning:** Detailed error messages like 'auth/user-not-found' or 'auth/wrong-password' allow attackers to confirm the existence of registered email addresses, facilitating targeted attacks.
**Prevention:** Always use generic error messages (e.g., 'Invalid email or password') for authentication failures, regardless of the underlying cause.
