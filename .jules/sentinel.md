## 2025-05-18 - Input Validation in MemberLogin
**Vulnerability:** Unvalidated user inputs (`email` and `password`) passed directly to authentication routines without schema validation.
**Learning:** React state inputs in authentication forms should be strictly validated using schema validators (like Zod) before invoking auth methods.
**Prevention:** Always validate all form payload fields using Zod schemas (`authSchemas.login`) before initiating authentication or standard database requests.
