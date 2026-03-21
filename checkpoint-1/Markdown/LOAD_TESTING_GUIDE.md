# Load Testing & Scalability Guide

## Overview

This guide explains how to run load tests on the BSA Troop 242 application to ensure it can handle growing user demand.

## Prerequisites

```bash
# Install k6 (load testing tool)
# macOS
brew install k6

# Linux
sudo apt-get install k6

# Windows (using Chocolatey)
choco install k6

# Or download from: https://k6.io/open-source
```

## Load Test Script

**File:** `src/utils/load-test.js`

### What It Tests

1. **Homepage Load** — Load `/` (public page)
2. **Login Flow** — POST to `/api/auth/login`
3. **Fetch Activities** — GET `/api/activities`
4. **Create Activity** — POST `/api/activities` (10% of users)
5. **Scout Profile** — GET `/api/profile`
6. **Dashboard** — GET `/scout-dashboard`

### Load Stages

```
Stage 1: Ramp-up (2 min)     → 0 to 100 users
Stage 2: Hold (5 min)         → 100 users (steady state)
Stage 3: Ramp-up (5 min)      → 100 to 500 users
Stage 4: Stress (10 min)      → 500 users (stress test)
Stage 5: Ramp-down (2 min)    → 500 to 0 users

Total Duration: ~24 minutes
```

### Success Thresholds

- ✅ Error rate < 5%
- ✅ P95 latency < 5 seconds
- ✅ P99 latency < 10 seconds
- ✅ All requests complete successfully

## Running Load Tests

### 1. Local Test (Quick)

```bash
# Run load test against staging
k6 run load-test.js

# Expected output:
# ✓ error_rate: 0.5% < 5%
# ✓ request_duration p(95): 2345ms < 5000ms
# ✓ request_duration p(99): 4321ms < 10000ms
```

### 2. Cloud-Based Test (Load Impact)

```bash
# Sign up at https://app.loadimpact.com (free tier available)
# Get your project ID and API token

# Run distributed load test from multiple locations
k6 cloud load-test.js

# Results viewable at: https://app.loadimpact.com/projects/123/runs
```

### 3. Generate HTML Report

```bash
# Run test and generate HTML report
k6 run load-test.js --out csv=results.csv

# Reports are auto-generated:
# - summary.json (raw metrics)
# - summary.html (visual report)
```

## Expected Results at Each Stage

### Stage 1: 0-100 Users (Ramp-up)
- Avg response: 200-300ms
- Error rate: <1%
- Status: ✅ Healthy

### Stage 2: 100 Users (Steady State)
- Avg response: 250-400ms
- Error rate: <1%
- Status: ✅ Healthy

### Stage 3: 100-500 Users (Ramp-up)
- Avg response: 400-800ms
- Error rate: 1-2%
- Status: ✅ Acceptable

### Stage 4: 500 Users (Stress Test)
- Avg response: 800-2000ms
- Error rate: 2-5%
- Status: ⚠️ Watch for bottlenecks

### Stage 5: Ramp-down
- Gradual recovery to baseline
- Error rate: <1%
- Status: ✅ Healthy

## Performance Bottlenecks to Watch

### Database Bottlenecks
```
Symptom: Latency increases linearly with users
Fix:
- Add database indexes (Firestore auto-scaling)
- Optimize queries
- Implement caching layer (Redis)
```

### API Bottlenecks
```
Symptom: Specific endpoints slow down first
Fix:
- Add API rate limiting
- Implement request queuing
- Scale horizontally (multiple servers)
```

### Memory Bottlenecks
```
Symptom: Error rate increases dramatically
Fix:
- Check memory usage (monitoring dashboard)
- Reduce payload sizes
- Implement streaming responses
```

### Network Bottlenecks
```
Symptom: Consistent latency increase
Fix:
- Enable gzip compression
- Implement CDN caching
- Optimize asset delivery
```

## Interpreting Results

### Healthy Application
```
✅ Error rate < 1%
✅ P95 latency < 1s
✅ No timeouts
✅ Memory stable
✅ CPU < 80%
```

### Warning Signs
```
⚠️ Error rate 1-5%
⚠️ P95 latency 1-5s
⚠️ Occasional timeouts
⚠️ Memory increasing
⚠️ CPU 80-95%
```

### Critical Issues
```
❌ Error rate > 5%
❌ P95 latency > 5s
❌ Frequent timeouts
❌ Memory exhausted
❌ CPU maxed out
```

## Continuous Load Testing

### Setup Automated Tests

```bash
# Add to GitHub Actions workflow

# .github/workflows/load-test.yml
name: Load Test
on:
  schedule:
    - cron: '0 2 * * 0'  # Weekly on Sunday 2am

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install k6
        run: sudo apt-get install k6
      - name: Run load test
        run: k6 run load-test.js
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: load-test-results
          path: summary.html
```

## Scaling Recommendations

### Current Capacity
- **Concurrent users:** 500+
- **Requests/second:** 50-100
- **Recommended active users:** 50-100

### Scaling Strategy

**At 100 users:**
- Current setup sufficient
- Monitor memory usage
- No changes needed

**At 500 users:**
- Implement caching layer (Redis)
- Add read replicas for Firestore
- Enable CDN for static assets

**At 1,000 users:**
- Multi-region deployment
- Database sharding/partitioning
- Load balancer (NGINX, HAProxy)

**At 5,000+ users:**
- Auto-scaling infrastructure (Kubernetes)
- Advanced database optimization
- Content delivery network (Cloudflare)
- Real-time monitoring (Datadog, New Relic)

## Custom Load Tests

You can modify `load-test.js` to test specific scenarios:

```javascript
// Test high memory usage
export const options = {
  stages: [
    { duration: '1m', target: 100 },  // Many data uploads
    { duration: '5m', target: 100 },  // Long-running requests
  ],
};

// Test error handling
export default function () {
  // Send malformed requests
  http.post(`${BASE_URL}/api/test`, {
    invalid: 'data',
  });

  // Send large payloads
  const largeData = 'x'.repeat(10000000);
  http.post(`${BASE_URL}/api/upload`, largeData);
}
```

## Monitoring During Load Test

Open monitoring dashboard while test runs:

```bash
# In separate terminal
npm run dev

# Then visit: http://localhost:5173/monitoring-dashboard

# Watch for:
- Error rate
- Memory usage
- Response times
- Active connections
```

## Cleanup After Test

```bash
# Clear test data
firebase firestore emulator delete-data

# Reset error logs
# In Sentry console → Settings → Purge All Data

# Check database usage
firebase console  # View Firestore usage stats
```

## Troubleshooting

### "Connection refused"
```
Check: Is staging environment running?
Fix: npm run build && firebase serve
```

### "Too many requests"
```
Check: Rate limiting enabled?
Fix: Increase thresholds temporarily for testing
```

### "Out of memory"
```
Check: Memory leak in application?
Fix: Profile with Chrome DevTools → Memory tab
```

### "Timeout errors"
```
Check: Database query too slow?
Fix: Add indexes, optimize queries, increase timeouts
```

## Production Load Testing

### Pre-Production Checklist
- [ ] Staging environment has production-like data volume
- [ ] Monitoring is fully configured
- [ ] Database backups are enabled
- [ ] Rollback plan is documented
- [ ] Team is on-call during test

### Running Production Test
```bash
# Use cloud-based load testing for production-like conditions
k6 cloud load-test.js --vus 1000 --duration 10m

# Monitor during test:
# - Sentry for errors
# - Datadog for metrics
# - Firebase console for database
# - Billing for costs

# After test:
# - Review error logs
# - Check database performance
# - Verify recovery
# - Document findings
```

## Success Criteria

✅ **Application passes load test if:**
- Error rate stays < 5%
- P95 latency < 5 seconds
- No database failures
- Graceful recovery from peak load
- No data corruption

---

**Next:** Deploy improvements based on results, re-test, iterate.
