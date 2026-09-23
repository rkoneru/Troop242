## 2026-03-21 - Accessible Copy Feedback and Explicit Labeling in Referral Interfaces
**Learning:** In dynamic link-sharing and invitation management interfaces, read-only inputs and action buttons lack screen reader context and status notification when copied.
**Action:** Always connect `<label htmlFor="...">` to `<input id="...">`, set explicit `type="button"`, provide dynamic `aria-label`s for copy status, and include a polite `role="status"` live region for auditory clipboard updates.
