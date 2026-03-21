# 🔴 CRITICAL VULNERABILITIES FOUND

**Severity:** CRITICAL/HIGH
**Date Discovered:** 2026-03-21
**Status:** REQUIRES IMMEDIATE ACTION

---

## Summary

**3 CRITICAL security vulnerabilities discovered** during comparison of Claude Code audit with automated security scan. These must be fixed BEFORE any production deployment.

| Issue | File | Line | Severity | CVSS |
|-------|------|------|----------|------|
| Plaintext password stored in Firestore | RegisterWithInvite.jsx | 129 | 🔴 CRITICAL | 9.1 |
| Committed Firebase service account key | serviceAccountKey.json | — | 🔴 CRITICAL | 9.8 |
| Static hardcoded invite codes | ReferralLinks.jsx + RegisterWithInvite.jsx | 20-59 | 🔴 CRITICAL | 7.5 |

---

## 🔴 VULNERABILITY #1: Plaintext Password Storage

### Location
**File:** [RegisterWithInvite.jsx:129](src/pages/RegisterWithInvite.jsx#L129)

### The Problem
```jsx
// VULNERABLE CODE (Line 129)
await setDoc(doc(db, 'users', user.uid), {
  uid: user.uid,
  email: email,
  name,
  role: inviteData.role,
  status: 'approved',
  password, // ← CRITICAL: Plaintext password stored in Firestore!
  joinDate: new Date().toISOString(),
  phone: '',
  createdAt: new Date().toISOString()
});
```

### Why This Is Critical
1. **Passwords should NEVER be stored in plaintext** — even in Firestore
2. **Firebase Auth already handles passwords securely** — no need to store again
3. **If Firestore is compromised** → all 1000+ user passwords leaked
4. **Violates:**
   - OWASP Top 10 (A02 - Cryptographic Failures)
   - NIST security guidelines
   - Basic password security best practices
   - Likely violates GDPR/CCPA privacy rules

### Attack Scenario
```
1. Attacker gains unauthorized Firestore read access
2. Reads 'users' collection → gets all emails + plaintext passwords
3. Uses credentials to:
   - Access the app as any user
   - Access linked email accounts (Gmail, Outlook, etc.)
   - Target users with password reuse on other sites
4. Total account compromise
```

### The Fix
**Remove password from Firestore storage entirely. Firebase Auth handles it.**

```jsx
// CORRECTED CODE
try {
  // Firebase Auth securely hashes password
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Only store non-sensitive user data in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: email,
    name,
    role: inviteData.role,
    status: 'approved',
    // ❌ REMOVE: password field
    joinDate: new Date().toISOString(),
    phone: '',
    createdAt: new Date().toISOString()
  });

  // Rest of code...
} catch (err) {
  // Error handling...
}
```

### Verification
```bash
# Check if password field is stored anywhere else:
grep -r "password" src/ --include="*.jsx" --include="*.js" | grep -v "Firebase\|createUser\|resetPassword"

# Check Firestore rules for password exposure:
grep -r "password" src/firebase/firestore.rules
```

### Timeline
- **IMMEDIATE:** Remove password field from Firestore
- **Within 1 hour:** Audit Firestore for existing data with password field
- **Within 4 hours:** Force password reset (if already compromised)
- **Within 1 day:** Update all documentation and security guidelines

---

## 🔴 VULNERABILITY #2: Committed Firebase Service Account Key

### Location
**File:** [serviceAccountKey.json](src/firebase/serviceAccountKey.json) (entire file)

### The Problem
```json
{
  "type": "service_account",
  "project_id": "troop242-54e6a",
  "private_key_id": "b0a3802ff759111db9cb01d15cd021ff4afb6dcd",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG...",  // ← FULL PRIVATE KEY EXPOSED
  "client_email": "firebase-adminsdk-fbsvc@troop242-54e6a.iam.gserviceaccount.com",
  "client_id": "111398298955118175067",
  ...
}
```

### Why This Is Critical
1. **Service account = Full Firebase Admin access**
2. **Private key = Can't be unlearned** — anyone with this can:
   - Read ALL user data (unencrypted)
   - Write/delete activities, profiles, progress data
   - Modify Firestore security rules
   - Export entire database
   - Create new admin accounts
   - Impersonate the system

3. **Key is in git history** → Accessible to:
   - Anyone who clones the repo
   - Anyone who has repository access (even revoked users)
   - Anyone who checks git history: `git log --all -- serviceAccountKey.json`

4. **Automated scanners will find this** → GitHub/GitLab will alert, GitHub security will disable

### Attack Scenario
```
1. Attacker clones repo or sees GitHub alert
2. Extracts serviceAccountKey.json
3. Uses key to initialize Firebase Admin SDK:
   import admin from 'firebase-admin';
   admin.initializeApp({
     credential: admin.credential.cert(require('./serviceAccountKey.json'))
   });

4. Can now:
   - Read all user passwords (if stored, see Vuln #1)
   - Modify any activity, delete scout data
   - Change Firestore security rules to allow public access
   - Create backdoor admin accounts
   - Exfiltrate entire database to their server
   - No logs, no audit trail
```

### The Fix

#### Step 1: Remove from Git History (IMMEDIATE)
```bash
# WARNING: This rewrites history and will affect all clones

# Option A: Using git filter-branch
git filter-branch --tree-filter 'rm -f src/firebase/serviceAccountKey.json' HEAD

# Option B: Using git-filter-repo (safer, recommended)
git install-filter-repo  # If not installed
git filter-repo --path src/firebase/serviceAccountKey.json --invert-paths

# Force push to origin (after notifying team)
git push origin --force --all
git push origin --force --tags

# All team members must re-clone:
cd ~/
rm -rf Troop242  # Delete old clone
git clone https://github.com/yourrepo/Troop242  # Fresh clone
```

#### Step 2: Rotate the Firebase Key (IMMEDIATE)
```
1. Go to Firebase Console:
   https://console.firebase.google.com → troop242-54e6a

2. Settings → Service Accounts → Firebase Admin SDK

3. Click "Generate New Private Key" (this disables the old one)
   ❌ Old key: b0a3802ff759111db9cb01d15cd021ff4afb6dcd (DISABLED)
   ✅ New key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (ACTIVE)

4. Save new key securely (see Step 3)
```

#### Step 3: Store Key Securely (Going Forward)
**Option A: GitHub Secrets (for CI/CD only)**
```bash
# 1. Copy new serviceAccountKey.json content
cat ~/Downloads/serviceAccountKey.json | base64

# 2. Go to GitHub → Settings → Secrets and variables → Actions

# 3. Add secret: FIREBASE_SERVICE_ACCOUNT_KEY
# Paste the base64 content

# 4. Use in GitHub Actions:
env:
  FIREBASE_SERVICE_ACCOUNT_KEY: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_KEY }}

# 5. Decode in CI script:
echo $FIREBASE_SERVICE_ACCOUNT_KEY | base64 -d > /tmp/serviceAccountKey.json
```

**Option B: Environment Variable (Local Development)**
```bash
# 1. Create .env.local (already in .gitignore):
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

# 2. Load in code:
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY
);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

# 3. Never commit this file
echo "FIREBASE_SERVICE_ACCOUNT_KEY=<your-key-here>" >> ~/.env.local
```

**Option C: Use Firebase Emulator (Development)**
```bash
# For local development, don't need real service account:
firebase emulators:start --only firestore,auth

# No credentials needed for testing
```

#### Step 4: Update .gitignore
```bash
# Add to .gitignore:
serviceAccountKey.json
*.serviceAccountKey.json
firebase-key.json
firebase-*-key.json
```

#### Step 5: Audit Commit History
```bash
# Verify key is removed:
git log --all --name-only | grep serviceAccount
# Should return nothing

# Check for other key files:
git log --all -- "*key*.json" "*secret*" | head -20

# Search commit contents for private keys:
git log -p | grep -i "private_key\|begin.*private"
```

#### Step 6: Notify Team & Users
- [ ] Tell all developers to re-clone repo
- [ ] Disable/rotate Firebase keys
- [ ] Update CI/CD secrets
- [ ] Document new secure key management process
- [ ] **Optional:** Force password reset for all users (if passwords were exposed in Firestore)

### Timeline
- **5 minutes:** Remove from git history
- **10 minutes:** Rotate Firebase key
- **15 minutes:** Add to .gitignore
- **30 minutes:** Update CI/CD secrets
- **1 hour:** Notify team + full audit
- **CRITICAL:** Do NOT merge to main until resolved

---

## 🔴 VULNERABILITY #3: Static Hardcoded Invite Codes

### Location
**Files:**
- [ReferralLinks.jsx:20-22](src/pages/ReferralLinks.jsx#L20-L22) — `leaderCode = 'LEADER01'`, `scoutCode = 'SCOUT01'`
- [RegisterWithInvite.jsx:35-58](src/pages/RegisterWithInvite.jsx#L35-L58) — Hardcoded code checks

### The Problem
```jsx
// ReferralLinks.jsx:20-22 (VULNERABLE)
const leaderCode = 'LEADER01';  // ← Static, predictable, reusable
const scoutCode = 'SCOUT01';    // ← Anyone can guess these

// RegisterWithInvite.jsx:35-58 (VULNERABLE)
if (code === 'LEADER01') {
  setInviteData({
    code: 'LEADER01',
    role: 'leader',
    status: 'permanent',  // ← Permanent, never expires
    inviteId: null,
    email: ''
  });
  setStep('register');
  return;
}

if (code === 'SCOUT01') {
  setInviteData({
    code: 'SCOUT01',
    role: 'scout',
    status: 'permanent',
    inviteId: null,
    email: ''
  });
  setStep('register');
  return;
}
```

### Why This Is Critical
1. **Predictable codes:** Anyone can guess `LEADER01`, `SCOUT01`
2. **Permanent/non-expiring:** No time limit, no usage limit
3. **No rate limiting:** Can create unlimited accounts
4. **No tracking:** Can't see who used the code or when
5. **Escalation path:** Normal scout can become leader with single login

### Attack Scenario
```
Attacker A (knows public code LEADER01):
1. Visit https://troop242.app/register?code=LEADER01
2. Creates account with email attacker@example.com
3. Sets password, becomes LEADER
4. Can now:
   - View all scout progress/personal data
   - Create fake activities to collect money
   - Modify scout ranks/badges
   - Export entire scout database
   - Delete audit logs (if possible)

Attacker B (mass account creation):
1. Writes bot to auto-create 1000 scout accounts with SCOUT01
2. Floods activities with fake signups
3. Crashes Firestore quota
4. Troop operations disrupted
```

### The Fix

#### Step 1: Replace Static Codes with Generated Tokens
```jsx
// CreateInvitationForm.jsx (new component)
import { useState } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import crypto from 'crypto';  // or use nanoid

const generateSecureCode = () => {
  // Generate 12-character cryptographically random code
  return crypto.randomBytes(9).toString('hex').toUpperCase();
  // e.g., "7A2F9E4B5C1D"
};

export async function createInvitation(role, expiresInDays = 30) {
  const code = generateSecureCode();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  await setDoc(doc(db, 'invitations', code), {
    code,
    role,  // 'scout' or 'leader'
    status: 'pending',  // pending, used, expired
    createdAt: Timestamp.now(),
    expiresAt: Timestamp.fromDate(expiresAt),
    usedBy: null,
    usedAt: null,
    createdBy: currentLeaderUid
  });

  return code;
}
```

#### Step 2: Update RegisterWithInvite.jsx
```jsx
// RegisterWithInvite.jsx (updated)
const verifyInvite = async () => {
  if (!inviteCode) {
    setError('No invitation code provided');
    return;
  }

  setLoading(true);
  try {
    const code = inviteCode.toUpperCase();

    // Remove hardcoded code checks (LEADER01, SCOUT01)
    // ❌ DELETE lines 35-59

    // Only check dynamic invitations from Firestore
    const inviteSnap = await getDoc(doc(db, 'invitations', code));

    if (!inviteSnap.exists()) {
      setError('Invalid invitation code');
      setLoading(false);
      return;
    }

    const invite = inviteSnap.data();

    // Check if expired
    if (invite.expiresAt.toDate() < new Date()) {
      setError('This invitation has expired');
      setLoading(false);
      return;
    }

    // Check if already used
    if (invite.status !== 'pending') {
      setError('This invitation has already been used');
      setLoading(false);
      return;
    }

    setInviteData({ ...invite, inviteId: code });
    setStep('register');
  } catch (err) {
    setError('Error verifying invitation: ' + err.message);
  }
  setLoading(false);
};
```

#### Step 3: Update ReferralLinks.jsx
```jsx
// ReferralLinks.jsx (updated)
import { useState } from 'react';
import { createInvitation } from '../utils/invitations';

export default function ReferralLinks() {
  const [generatedLinks, setGeneratedLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  // ❌ DELETE hardcoded codes (LEADER01, SCOUT01)
  // const leaderCode = 'LEADER01';
  // const scoutCode = 'SCOUT01';

  const generateLeaderLink = async () => {
    setLoading(true);
    try {
      const code = await createInvitation('leader', 30);  // Expires in 30 days
      const url = `${window.location.origin}/register?code=${code}`;
      setGeneratedLinks([...generatedLinks, { code, role: 'leader', url }]);
    } catch (err) {
      alert('Error generating link: ' + err.message);
    }
    setLoading(false);
  };

  const generateScoutLink = async () => {
    setLoading(true);
    try {
      const code = await createInvitation('scout', 30);
      const url = `${window.location.origin}/register?code=${code}`;
      setGeneratedLinks([...generatedLinks, { code, role: 'scout', url }]);
    } catch (err) {
      alert('Error generating link: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <button onClick={generateLeaderLink} disabled={loading}>
        Generate Leader Invite Link
      </button>
      <button onClick={generateScoutLink} disabled={loading}>
        Generate Scout Invite Link
      </button>

      {generatedLinks.map(link => (
        <div key={link.code}>
          <p>{link.role.toUpperCase()}: {link.code}</p>
          <p>Expires: 30 days</p>
          <input type="text" readOnly value={link.url} />
          <button onClick={() => navigator.clipboard.writeText(link.url)}>
            Copy Link
          </button>
        </div>
      ))}
    </>
  );
}
```

#### Step 4: Add Rate Limiting (Firestore Rules)
```
match /invitations/{code} {
  // Only allow creation by leaders/admins
  allow create: if request.auth.uid != null &&
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['leader', 'admin'];

  // Allow read/verify by anyone (for registration flow)
  allow read: if true;

  // Only allow updates to mark as used
  allow update: if request.resource.data.status == 'used' &&
                   resource.data.status == 'pending';
}
```

#### Step 5: Add Invitation Management Dashboard
Leaders should be able to:
- View active invitations (code, created date, expires date, status)
- Revoke invitations (change status to 'revoked')
- See who used each invitation
- Generate new ones with custom expiration

### Timeline
- **30 minutes:** Implement generateSecureCode() utility
- **1 hour:** Update RegisterWithInvite.jsx to remove hardcoded codes
- **1 hour:** Update ReferralLinks.jsx to generate dynamic codes
- **30 minutes:** Add Firestore rules for invitation validation
- **1 hour:** Test invitation flow end-to-end
- **CRITICAL:** Deploy before accepting new invitations

---

## Remediation Checklist

### IMMEDIATE (Next 4 hours)
- [ ] **Vuln #1:** Remove `password` field from RegisterWithInvite.jsx line 129
- [ ] **Vuln #1:** Check if password data is already in Firestore
  ```bash
  # Query in Firestore console:
  SELECT * FROM users WHERE password != ''
  # Delete any documents with password field
  ```
- [ ] **Vuln #2:** Remove serviceAccountKey.json from git history
- [ ] **Vuln #2:** Rotate Firebase service account key
- [ ] **Vuln #2:** Add serviceAccountKey.json to .gitignore
- [ ] **Vuln #3:** Remove LEADER01/SCOUT01 hardcoded checks
- [ ] Test all flows work after changes

### TODAY (Next 8 hours)
- [ ] Implement dynamic invitation code generation
- [ ] Add invitation expiration (30-day default)
- [ ] Update Firestore rules for invitation validation
- [ ] Create GitHub secrets for FIREBASE_SERVICE_ACCOUNT_KEY
- [ ] Update CI/CD to use secrets (not files)
- [ ] Document new secure patterns in SECURITY.md

### THIS WEEK (Next 3 days)
- [ ] Audit all Firestore documents for password fields
- [ ] Verify no other secrets in git history
- [ ] Set up secret scanning (GitHub Advanced Security)
- [ ] Force password reset for all users (if passwords were exposed)
- [ ] Implement rate limiting on account creation
- [ ] Add invitation usage audit logging

### THIS MONTH
- [ ] Conduct full security review with automated tools
- [ ] Implement proper authentication/authorization testing
- [ ] Add security guidelines to CLAUDE.md
- [ ] Train team on secure coding practices
- [ ] Schedule monthly security audits

---

## Evidence

### Proof of Issue #1 (Plaintext Password)
```jsx
// RegisterWithInvite.jsx:129
password, // Fallback for Firestore login
```
**Status:** ✅ CONFIRMED IN CODE

### Proof of Issue #2 (Service Account Key)
```bash
$ ls -la src/firebase/serviceAccountKey.json
-rw-r--r-- 1 Rakesh 197609 1234 Mar 16 09:52 src/firebase/serviceAccountKey.json

$ file src/firebase/serviceAccountKey.json
JSON text data

$ grep "private_key" src/firebase/serviceAccountKey.json
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG..."
```
**Status:** ✅ CONFIRMED IN CODE

### Proof of Issue #3 (Static Codes)
```jsx
// ReferralLinks.jsx:20-22
const leaderCode = 'LEADER01';
const scoutCode = 'SCOUT01';

// RegisterWithInvite.jsx:35-58
if (code === 'LEADER01') { ... }
if (code === 'SCOUT01') { ... }
```
**Status:** ✅ CONFIRMED IN CODE

---

## Impact Assessment

| Vulnerability | Confidentiality | Integrity | Availability | User Impact |
|---|---|---|---|---|
| **Plaintext Password** | 🔴 HIGH | 🔴 HIGH | 🟡 MEDIUM | All users can be impersonated |
| **Service Account Key** | 🔴 CRITICAL | 🔴 CRITICAL | 🔴 CRITICAL | Full database compromise possible |
| **Static Invite Codes** | 🟡 MEDIUM | 🔴 HIGH | 🟡 MEDIUM | Unauthorized account creation |

---

## References

- **OWASP Top 10:** A02:2021 – Cryptographic Failures, A01:2021 – Broken Access Control
- **CWE-256:** Plaintext Storage of Password
- **CWE-798:** Use of Hard-Coded Credentials
- **CWE-330:** Use of Insufficiently Random Values
- **Firebase Security Best Practices:** https://firebase.google.com/docs/rules/basics

---

**Report Generated:** 2026-03-21
**Next Review:** After fixes applied (within 24 hours)
**Status:** 🔴 CRITICAL — DO NOT DEPLOY TO PRODUCTION
