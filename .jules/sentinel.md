## 2026-06-15 - Prevent Email Enumeration in Login
**Vulnerability:** Specific error messages ('No account found with this email', 'Incorrect password') were revealing whether an email was registered.
**Learning:** Firebase Auth provides detailed error codes that developers often map directly to user-facing messages, unintentionally creating side-channels for account enumeration.
**Prevention:** Always group credential-related authentication errors into a single, generic "Invalid email or password" message for production environments.
