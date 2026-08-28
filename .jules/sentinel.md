## 2026-03-31 - Insecure Token Generation using Math.random()
**Vulnerability:** Invitation codes (`SendInvitations.jsx`) and temporary passwords (`LeaderDashboard.jsx`) were generated using `Math.random()`.
**Learning:** `Math.random()` is PRNG-based and non-cryptographically secure, allowing potential attackers to predict invitation codes or temporary passwords.
**Prevention:** Use Web Crypto API (`crypto.getRandomValues`) to generate random bytes for security-sensitive tokens and credentials.
