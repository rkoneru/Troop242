## 2024-05-23 - Email Enumeration Mitigation
**Vulnerability:** Specific Firebase Auth error messages (user-not-found vs wrong-password) allowed attackers to verify if an email was registered in the system.
**Learning:** Modern Firebase Auth may also return `auth/invalid-credential` for multiple failure modes, but explicit handling of legacy codes like `user-not-found` and `user-disabled` is still required to ensure consistent generic error reporting across all client environments.
**Prevention:** Group all account-existence-revealing error codes into a single generic "Invalid email or password" message in all login and password-reset flows.
