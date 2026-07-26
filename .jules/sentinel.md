# Sentinel's Journal - Security Learnings

## 2026-07-26 - Predictable Invitation Codes and Temporary Passwords
**Vulnerability:** Use of cryptographically insecure `Math.random()` for generating sensitive/restrictive invitation codes and temporary leader/scout passwords, leading to predictable tokens that could allow unauthorized account creation.
**Learning:** Developers frequently use `Math.random().toString(36)` as a quick way to generate alphanumeric strings, unaware that `Math.random()` is not cryptographically secure and can be predicted if the seed is known.
**Prevention:** Always use the Web Crypto API (`crypto.getRandomValues`) to generate random secrets or temporary passwords in browser environments.
