# Sentinel Security Journal

## 2026-03-05 - Insecure Random Token and Password Generation (Math.random)
**Vulnerability:** The application was using `Math.random()` to generate invitation codes (in `SendInvitations.jsx`) and temporary passwords (in `LeaderDashboard.jsx`). `Math.random()` is a pseudo-random number generator that is cryptographically weak, meaning its output is highly predictable and can lead to token enumeration, invitation bypasses, and account takeover.
**Learning:** Developers often use `Math.random()` for convenience when generating quick codes or temporary credentials, without considering the predictability and security implications in multi-user systems.
**Prevention:** Always use the Web Crypto API's cryptographically secure pseudo-random number generator (`window.crypto.getRandomValues`) for security-sensitive tokens, IDs, and temporary passwords. Format the resulting array into hexadecimal or a secure character set with correct padding to guarantee length requirements.
