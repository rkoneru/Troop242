## 2025-05-14 - Mitigate Email Enumeration in Login
**Vulnerability:** Information leakage during authentication through specific Firebase Auth error codes (e.g., `auth/user-not-found` vs `auth/wrong-password`).
**Learning:** Returning specific errors allows attackers to verify which email addresses have accounts, facilitating targeted phishing or brute-force attacks.
**Prevention:** Always group authentication-related errors into a single, generic "Invalid email or password" message for the end user.
