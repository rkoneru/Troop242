## 2025-05-15 - [Mitigate Email Enumeration]
**Vulnerability:** The login form was returning specific Firebase Auth errors, allowing an attacker to determine if an email address was registered.
**Learning:** Firebase Auth provides specific error codes ('auth/user-not-found', etc.) by default. These must be caught and mapped to a generic message to prevent account discovery.
**Prevention:** Always use generic error messages for authentication failures. Ensure tests verify that specific error details are masked.
