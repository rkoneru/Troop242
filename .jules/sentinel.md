## 2026-03-21 - Insecure Randomness in Token & Password Generation
**Vulnerability:** Use of `Math.random()` for generating invitation codes and temporary passwords (`Math.random().toString(36)...`).
**Learning:** PRNGs like `Math.random()` are predictable and can allow attackers to brute-force or predict invitation tokens and temporary credentials.
**Prevention:** Always use Cryptographically Secure Pseudo-Random Number Generators (CSPRNG) like `crypto.getRandomValues()` for security-sensitive tokens, passwords, and IDs.
