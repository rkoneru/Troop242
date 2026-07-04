## 2025-05-14 - Privilege Escalation in User Profiles
**Vulnerability:** Users could modify their own `role` and `status` fields in the `users` collection because the `allow write` rule was too permissive.
**Learning:** Using a single `allow write` rule for both creation and updates without field-level validation allows users to promote themselves to 'admin' or 'leader'.
**Prevention:** Split `allow write` into `allow create` and `allow update`, and use `request.resource.data.diff(resource.data).affectedKeys()` or explicit field checks to ensure sensitive fields are immutable.

## 2025-05-14 - Insecure Client-Side Audit Logging
**Vulnerability:** The `auditLogs` collection allowed any client to create logs (`allow create: if true`).
**Learning:** Allowing clients to write to audit logs enables attackers to flood the logs or inject false information, undermining the integrity of the audit trail.
**Prevention:** Restrict `create` access to server-side processes (e.g., Cloud Functions) or Admin SDK, and ensure the rules enforce `allow create: if false` for client-side requests.

## 2025-05-14 - Email Enumeration via Auth Errors
**Vulnerability:** The login form returned specific error messages like "No account found with this email" and "Incorrect password".
**Learning:** Revealing whether an account exists allows attackers to harvest valid email addresses for targeted attacks.
**Prevention:** Use generic error messages like "Invalid email or password" for all authentication-related failures.
