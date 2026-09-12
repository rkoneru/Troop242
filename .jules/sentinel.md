## 2025-05-18 - Insecure Transport Protocol for External Resources
**Vulnerability:** External Merit Badge worksheet PDF links were generated using unencrypted HTTP (`http://usscouts.org/usscouts/mb/worksheets/...`) instead of HTTPS.
**Learning:** Legacy hardcoded resource URLs in frontend utilities or page components can leak request details over plain text or trigger mixed-content warnings and active MITM risks.
**Prevention:** Always verify external URLs use `https://` schemas, enforce HTTPS for static data and dynamic URL helper functions across all application views.
