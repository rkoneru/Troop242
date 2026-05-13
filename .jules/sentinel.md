## 2026-05-22 - Prevented User Enumeration in Member Login

**Vulnerability:** The login interface leaked information about whether an account existed by returning specific error messages for `auth/user-not-found` vs `auth/wrong-password`.

**Learning:** Providing precise error messages for authentication failures allows attackers to programmatically verify valid user email addresses (enumeration), which is a common precursor to brute-force or credential stuffing attacks.

**Prevention:** Always use generic authentication error messages (e.g., 'Invalid email or password') regardless of whether the user exists or the password was incorrect. This pattern should be consistently applied across all authentication entry points.
