## 2025-05-15 - Email Enumeration Mitigation in MemberLogin
**Vulnerability:** The login page returned distinct error messages for "User not found" versus "Wrong password," allowing attackers to verify if an email exists in the system.
**Learning:** Firebase Auth error codes (`auth/user-not-found`, `auth/wrong-password`, `auth/invalid-credential`) are useful for developers but should be abstracted for end-users to follow security best practices. Testing this requires careful mocking of Firebase's promise-based rejection objects.
**Prevention:** Always use generic authentication error messages (e.g., "Invalid email or password") and ensure that test suites verify this behavior across all relevant error codes.
