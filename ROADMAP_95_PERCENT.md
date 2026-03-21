# 95% Code Quality Roadmap

**Goal:** Achieve 95/100 overall quality score
**Timeline:** 12-14 weeks
**Current Score:** 54/100 (C+)
**Target Score:** 95/100 (A)

---

## Phase 1: Security Hardening (Weeks 1-3)

### 1.1 Firestore Security Rules (3-4 days)
**Current:** Permissive rules allowing any authenticated user to read/write all data
**Target:** Strict role-based access control with field validation

```
Priority: CRITICAL — Blocks production deployment
Effort: 3-4 days
Impact: Security grade D → B
```

**Implementation:**

1. **Role-Based Access Control Matrix**
   - Scout: read activities, read own profile, write signups, read own progress
   - Leader: read/write activities, read scouts (assigned), update progress
   - Admin: full access with audit logging

2. **Field-Level Validation**
   - activities: validate title length, date format, spots number
   - users: validate email format, role enum values
   - invitations: validate expiration, prevent duplicate usage

3. **Resource Ownership Checks**
   - Leaders only modify activities they created
   - Scouts only modify their own signups
   - Admins can override all

**Files to Create/Modify:**
- `src/firebase/firestore.rules` (rewrite, ~100 lines)
- `src/firebase/firestore.indexes.json` (add indexes, ~40 lines)

**Deploy & Test:**
```bash
firebase deploy --only firestore:rules
# Test all CRUD operations with different roles
```

---

### 1.2 Input Validation & Sanitization (2-3 days)
**Current:** Forms accept any input without validation
**Target:** Strict validation on all user inputs

**Implementation:**

1. **Create validation schema** (`src/utils/validation.js`, 150 lines)
```javascript
export const schemas = {
  activity: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(1000),
    date: z.coerce.date().min(new Date()),
    spots: z.number().min(1).max(500),
    dues: z.number().min(0).max(10000)
  }),
  scout: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().optional(),
  })
};
```

2. **Apply to all forms**
   - LeaderDashboard (activities, scouts) — 30 min
   - RegisterWithInvite (email, name, password) — 20 min
   - AdminDashboard (stats, announcements, events) — 30 min
   - ReferralLinks (already good) — 10 min

3. **Display user-friendly error messages**
   - "Title must be 3-100 characters" (not "validation failed")
   - Highlight invalid fields
   - Real-time validation on blur

**Effort:** 2-3 days
**Impact:** Security grade D → C+

---

### 1.3 Error Boundaries (1 day)
**Current:** No error boundaries — single component crash crashes entire app
**Target:** Graceful error recovery with user-friendly messages

**Implementation:**

1. **Create ErrorBoundary component** (`src/components/ErrorBoundary.jsx`, 60 lines)
```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Component error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

2. **Wrap key sections in App.jsx**
   - ProtectedRoute components — 1 min each
   - Page-level boundaries — 1 min each
   - Form submissions — 1 min each

3. **Create ErrorFallback UI**
   - Show error message to user
   - Provide "Retry" button
   - Log to error tracking service

**Effort:** 1 day
**Impact:** Reliability grade D → C+, UX improvement

---

## Phase 2: Testing Infrastructure (Weeks 2-4)

### 2.1 Jest & Testing Library Setup (2-3 days)
**Current:** 0% test coverage
**Target:** 80% coverage of critical paths

**Installation:**
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @babel/preset-env @babel/preset-react
```

**Setup files:**
- `jest.config.js` (25 lines)
- `babel.config.js` (10 lines)
- `src/setupTests.js` (5 lines)

**Test directory structure:**
```
src/__tests__/
  ├── contexts/
  │   └── AuthContext.test.jsx
  ├── utils/
  │   ├── adminData.test.js
  │   ├── validation.test.js
  │   └── invitations.test.js
  └── pages/
      ├── RegisterWithInvite.test.jsx
      └── MemberLogin.test.jsx
```

**Effort:** 2-3 days
**Impact:** Testing grade F → C (visible, measurable progress)

---

### 2.2 Unit Tests for Critical Paths (3-4 days)
**Target:** 80% coverage of:
- Authentication (login, registration, logout)
- Authorization (role-based access)
- Data mutations (create, update, delete)
- Validations (input, invitations)

**Test files to create:**

1. **src/__tests__/contexts/AuthContext.test.jsx** (100 lines)
```javascript
describe('AuthContext', () => {
  it('should load user on mount', async () => { });
  it('should handle login', async () => { });
  it('should handle logout', async () => { });
  it('should set correct role', async () => { });
});
```

2. **src/__tests__/utils/invitations.test.js** (80 lines)
```javascript
describe('Invitations', () => {
  it('should generate unique codes', () => { });
  it('should verify valid invitations', async () => { });
  it('should reject expired codes', async () => { });
  it('should prevent reuse', async () => { });
});
```

3. **src/__tests__/pages/RegisterWithInvite.test.jsx** (120 lines)
```javascript
describe('RegisterWithInvite', () => {
  it('should register with valid code', async () => { });
  it('should reject invalid code', async () => { });
  it('should hash password', async () => { });
});
```

4. **src/__tests__/pages/MemberLogin.test.jsx** (100 lines)

5. **src/__tests__/utils/validation.test.js** (150 lines)

**Run tests:**
```bash
npm test
# Target: >80% coverage on critical paths
```

**Effort:** 3-4 days
**Impact:** Testing grade C → A

---

### 2.3 Integration Tests (2-3 days)
**Target:** End-to-end flows work correctly

**Test files:**

1. **Registration Flow**
   - Generate invite code
   - Register with code
   - Verify user created
   - Verify code marked used

2. **Login Flow**
   - Login with credentials
   - Load profile
   - Redirect to correct dashboard

3. **Activity Creation & Signup**
   - Leader creates activity
   - Scout signs up
   - Activity shows in scout's list
   - Scout can unsign

**Effort:** 2-3 days
**Impact:** Reliability improvement, confidence boost

---

## Phase 3: Architecture Improvements (Weeks 5-8)

### 3.1 Component Refactoring (4-5 days)
**Current:** Monolithic pages (1,000-1,900 lines)
**Target:** Modular components (<400 lines each)

**Refactor LeaderDashboard.jsx** (1,937 lines):
```
LeaderDashboard/
├── index.jsx (200 lines) — tab router
├── ScoutsTab.jsx (400 lines) — scout management
├── ActivitiesTab.jsx (400 lines) — activity CRUD
├── ProgressTab.jsx (300 lines) — progress tracking
├── hooks/
│   ├── useScouts.js (50 lines)
│   ├── useActivities.js (50 lines)
│   └── useProgress.js (50 lines)
└── components/
    ├── ScoutCard.jsx
    ├── ActivityForm.jsx
    └── ProgressChart.jsx
```

**Similar refactors:**
- AdminDashboard.jsx → AdminDashboard/ (5 components)
- ScoutToolsPortal.jsx → ScoutToolsPortal/ (4 components)

**Effort:** 4-5 days
**Impact:** Architecture grade C → B+, maintainability boost

---

### 3.2 Extract Custom Hooks (2-3 days)
**Current:** Data fetching mixed with UI logic
**Target:** Separation of concerns with custom hooks

**Create hooks:**

1. **useFirebase.js** (100 lines)
```javascript
export function useFirebaseDocument(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, path),
      doc => { setData(doc.data()); setLoading(false); },
      err => { setError(err); setLoading(false); }
    );
    return unsubscribe;
  }, [path]);

  return { data, loading, error };
}
```

2. **useAuth.js** (already exists, enhance)
3. **useForm.js** (100 lines) — form state + validation
4. **useAsync.js** (80 lines) — async operations

**Effort:** 2-3 days
**Impact:** Code quality C → B, reusability

---

## Phase 4: Compliance & Privacy (Weeks 4-6)

### 4.1 Privacy Policy & COPPA Compliance (3-4 days)
**Current:** No privacy policy, COPPA violation for <13 users
**Target:** GDPR/COPPA compliant with parental consent

**Implementation:**

1. **Create Privacy Policy** (`src/pages/PrivacyPolicy.jsx`, 500 lines)
   - What data collected (email, name, rank, attendance)
   - Why collected (track advancement, coordinate activities)
   - How long stored (until deleted or 18 months)
   - Who can access (user, leaders, admins)
   - User rights (access, deletion, portability)

2. **Create Terms of Service** (300 lines)
   - Account responsibility
   - Prohibited conduct
   - Liability limitations
   - Changes to terms

3. **Implement Parental Consent** (4 days)
   - During signup: Ask if age <13
   - If <13: Require parent email verification
   - Send verification link to parent
   - Only activate account after parent confirms
   - Store parental consent records

4. **Implement Data Deletion** (2 days)
   - /profile page: "Delete Account" button
   - Confirmation dialog with 30-day grace period
   - Cloud Function to cascade delete:
     - User document
     - User profile
     - All signups
     - All progress
   - Log deletion for compliance

**Effort:** 3-4 days
**Impact:** Compliance grade D- → B

---

### 4.2 GDPR Compliance (2-3 days)
**For EU users:**

1. **Data Processing Agreement (DPA)**
   - Establish with Firebase
   - Document data flows
   - Define responsibilities

2. **Data Export Endpoint** (1 day)
   - POST /api/export-data/{userId}
   - Returns all user data as JSON
   - Include personal info, progress, signups

3. **Right to Be Forgotten** (1 day)
   - Already implemented via Data Deletion
   - Document in Privacy Policy

**Effort:** 2-3 days
**Impact:** Compliance → A

---

## Phase 5: Operations & DevOps (Weeks 7-9)

### 5.1 CI/CD Pipeline (3-4 days)
**Current:** No automated testing on PRs, manual deployments
**Target:** Full CI/CD with staging deployment

**GitHub Actions workflow** (`.github/workflows/ci.yml`, 100 lines):
```yaml
name: CI/CD

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: snyk/actions/setup@master
      - run: snyk auth ${{ secrets.SNYK_TOKEN }}
      - run: snyk test

  deploy-staging:
    if: github.ref == 'refs/heads/master' && github.event_name == 'push'
    needs: [test, security]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_STAGING }}
          projectId: troop242-staging
          channelId: staging
```

**Effort:** 3-4 days
**Impact:** DevOps grade D → B+

---

### 5.2 Error Logging & Monitoring (2-3 days)
**Current:** console.log only
**Target:** Structured logging to external service

**Setup Sentry:**
```bash
npm install --save @sentry/react
```

**Initialize in main.jsx:**
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({ maskAllText: true, blockAllMedia: true })
  ]
});
```

**Wrap routes:**
```javascript
<Sentry.ErrorBoundary>
  <ProtectedRoute>
    <Component />
  </ProtectedRoute>
</Sentry.ErrorBoundary>
```

**Log critical operations:**
```javascript
logger.info('User registered', { uid, email, role });
logger.error('Activity creation failed', error, { userId, activityId });
```

**Effort:** 2-3 days
**Impact:** Reliability grade D → B

---

### 5.3 Environment Separation (2-3 days)
**Current:** Single Firebase project
**Target:** Dev/Staging/Prod with different configs

**Setup:**

1. **Create 3 Firebase projects**
   - troop242-dev (development)
   - troop242-staging (pre-prod)
   - troop242-prod (production)

2. **Environment-specific configs**
   - `.env.development`
   - `.env.staging`
   - `.env.production`

3. **Deploy targets:**
   ```bash
   npm run build:dev    # .env.development
   npm run build:staging # .env.staging
   npm run build:prod   # .env.production

   firebase deploy -P dev
   firebase deploy -P staging
   firebase deploy -P prod
   ```

**Effort:** 2-3 days
**Impact:** DevOps grade B → A

---

## Phase 6: Performance Optimization (Weeks 10-12)

### 6.1 Code Splitting (3-4 days)
**Current:** 1.3 MB monolithic bundle
**Target:** 300-400 KB main chunk via code-splitting

**Implementation:**

1. **Lazy-load page routes** (1 day)
```javascript
const Home = lazy(() => import('./pages/Home'));
const LeaderDashboard = lazy(() => import('./pages/LeaderDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

<Routes>
  <Route path="/" element={<Suspense fallback={<Spinner />}><Home /></Suspense>} />
  <Route path="/leader-dashboard" element={<Suspense fallback={<Spinner />}><LeaderDashboard /></Suspense>} />
</Routes>
```

2. **Lazy-load heavy components** (1 day)
   - ScoutToolsPortal (1.2 MB) — only load on /scout-portal
   - GamesLanding (800 KB) — only load on /games
   - CampingGuide (600 KB) — only load on /camping-guide

3. **Tree-shake unused code** (1 day)
   - Remove unused dependencies
   - Unused animation variants
   - Unused theme colors

4. **Optimize Tailwind** (1 day)
   - Only include used utilities
   - Purge unused CSS

**Result:** 1.3 MB → 300-400 KB main chunk, 80-150 KB lazy chunks

**Effort:** 3-4 days
**Impact:** Performance grade D+ → A

---

### 6.2 Caching Strategy (2-3 days)
**Current:** No caching, every page load re-fetches data
**Target:** Smart caching with stale-while-revalidate

**Implementation:**

1. **Query-level caching hook** (50 lines)
```javascript
export function useCachedQuery(collectionPath, options = {}) {
  const cacheRef = useRef({ data: null, timestamp: 0 });
  const [data, setData] = useState(null);

  useEffect(() => {
    const now = Date.now();
    const cacheAge = now - cacheRef.current.timestamp;
    const ttl = options.ttl || 60000; // 60 seconds

    if (cacheRef.current.data && cacheAge < ttl) {
      setData(cacheRef.current.data);
      return;
    }

    // Fetch fresh data
    const unsubscribe = onSnapshot(
      collection(db, collectionPath),
      (snap) => {
        const newData = snap.docs.map(d => d.data());
        cacheRef.current = { data: newData, timestamp: now };
        setData(newData);
      }
    );

    return unsubscribe;
  }, [collectionPath]);

  return data;
}
```

2. **Service Worker for offline support** (100 lines)
   - Cache static assets
   - Cache API responses
   - Fallback for offline pages

3. **IndexedDB for local data** (80 lines)
   - Persist user data locally
   - Sync on reconnect

**Effort:** 2-3 days
**Impact:** Performance & UX improvement

---

## Phase 7: Accessibility (Weeks 11-12)

### 7.1 ARIA Labels & Semantic HTML (3-4 days)
**Current:** Missing ARIA labels, some divs used as buttons
**Target:** WCAG 2.1 AA compliance

**Implementation:**

1. **Add ARIA labels to buttons** (1 day)
```javascript
// Before
<button onClick={toggleMenu}>☰</button>

// After
<button onClick={toggleMenu} aria-label="Toggle navigation menu" aria-expanded={isOpen}>
  ☰
</button>
```

2. **Convert div buttons to semantic** (1 day)
```javascript
// Before
<div onClick={handleClick} className="button">Click me</div>

// After
<button onClick={handleClick} className="button">Click me</button>
```

3. **Add form labels** (1 day)
```javascript
// Before
<input type="text" placeholder="Name" />

// After
<label htmlFor="name">Name:</label>
<input id="name" type="text" required />
```

4. **Test with axe DevTools** (1 day)
   - Install Chrome extension
   - Run scan on each page
   - Fix all violations

**Effort:** 3-4 days
**Impact:** Accessibility grade C- → A

---

### 7.2 Keyboard Navigation & Focus (2-3 days)
**Current:** Tab order works but not optimized
**Target:** Full keyboard navigation support

1. **Add focus indicators** (CSS)
```css
button:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

a:focus {
  outline: 2px dashed var(--accent);
}
```

2. **Test Tab key navigation** (1 day)
   - All interactive elements accessible via Tab
   - Logical tab order
   - No keyboard traps

3. **Test keyboard-only usage** (1 day)
   - Can use app without mouse
   - All functions accessible
   - Proper focus management in modals

**Effort:** 2-3 days
**Impact:** Accessibility A

---

## Phase 8: Documentation & Deployment (Weeks 12-14)

### 8.1 Documentation (3-4 days)
- Update CLAUDE.md with new patterns
- Add JSDoc comments to new functions
- Update README with setup instructions
- Create DEPLOYMENT.md
- Create TESTING.md

### 8.2 Final Security Review (2-3 days)
- Run full security audit
- Verify all fixes applied
- Security scanning in CI/CD
- Penetration test checklist

### 8.3 Production Deployment (1-2 days)
- Deploy to staging
- Run full test suite
- Manual QA testing
- Monitor for 24 hours
- Deploy to production

---

## Summary Table

| Phase | Duration | Key Deliverables | Grade Impact |
|-------|----------|------------------|--------------|
| **Phase 1: Security** | 3 weeks | Firestore rules, validation, error boundaries | D→C |
| **Phase 2: Testing** | 2 weeks | Jest setup, 80% coverage, integration tests | F→A |
| **Phase 3: Architecture** | 4 weeks | Component refactoring, custom hooks | C→B+ |
| **Phase 4: Compliance** | 2 weeks | Privacy policy, COPPA, data deletion | D-→B |
| **Phase 5: DevOps** | 2 weeks | CI/CD, error logging, env separation | D→A |
| **Phase 6: Performance** | 2 weeks | Code-splitting, caching | D+→A |
| **Phase 7: Accessibility** | 2 weeks | ARIA labels, keyboard nav, WCAG AA | C-→A |
| **Phase 8: Launch** | 2 weeks | Documentation, final review, deploy | - |
| **TOTAL** | **14 weeks** | **Production-ready app** | **F→A (95/100)** |

---

## Current Progress
- ✅ Phase 0: Critical vulnerabilities fixed (3 of 3)
- ⏳ Phase 1: Security hardening (0/3)
- ⏳ Phase 2: Testing infrastructure (0/3)
- ⏳ Phase 3: Architecture improvements (0/2)
- ⏳ Phase 4: Compliance (0/2)
- ⏳ Phase 5: DevOps (0/3)
- ⏳ Phase 6: Performance (0/2)
- ⏳ Phase 7: Accessibility (0/2)
- ⏳ Phase 8: Launch (0/2)

---

## Success Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| **Overall Grade** | C+ (54) | A (95) | 14 weeks |
| **Security** | D (35) | A- (90) | 3 weeks |
| **Testing** | F (0) | A (95) | 4 weeks |
| **Reliability** | D (30) | A (90) | 5 weeks |
| **Performance** | D+ (40) | A (92) | 12 weeks |
| **Architecture** | C (65) | A (92) | 8 weeks |
| **Compliance** | D- (20) | A (95) | 6 weeks |
| **DevOps** | D (25) | A (95) | 9 weeks |
| **Accessibility** | C- (55) | A (95) | 12 weeks |

---

**Ready to execute this roadmap? I can start with Phase 1 (Security) immediately.**
