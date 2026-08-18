## 2026-03-31 - Secure Random Token Generation for Invitations and Passwords
**Vulnerability:** Use of `Math.random()` to generate invitation codes and temporary passwords created predictable token strings, allowing potential token guessing and invitation bypass.
**Learning:** Standard JavaScript `Math.random()` is not a cryptographically secure random number generator (CSPRNG).
**Prevention:** Always use `window.crypto.getRandomValues()` (Web Crypto API) or equivalent CSPRNG when generating tokens, temporary passwords, or invitation codes.
