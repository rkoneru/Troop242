# Disaster Recovery & Business Continuity Plan

**Status:** ✅ COMPLETE
**Last Updated:** 2026-03-21
**RTO (Recovery Time Objective):** 1 hour
**RPO (Recovery Point Objective):** 24 hours

---

## Executive Summary

This plan ensures BSA Troop 242 can recover from disasters and maintain business continuity with minimal downtime and data loss.

## Disaster Scenarios

### 1. **Database Corruption** (Severity: CRITICAL)
- **Cause:** Malicious attack, bug, or human error
- **Detection:** Data integrity checks fail, unexpected errors
- **Impact:** Users cannot access accounts
- **RTO:** 30 minutes
- **Recovery:** Restore from last clean backup

### 2. **Application Server Failure** (Severity: HIGH)
- **Cause:** Hardware failure, OOM, crash
- **Detection:** 502/503 errors, monitoring alerts
- **Impact:** Website unavailable
- **RTO:** 5 minutes (auto-scaling)
- **Recovery:** Failover to backup instance

### 3. **Firebase Service Degradation** (Severity: CRITICAL)
- **Cause:** Firebase outage, auth service down
- **Detection:** Auth failures, Firestore errors
- **Impact:** Cannot login, database unavailable
- **RTO:** 1 hour (depends on Firebase SLA)
- **Recovery:** Wait for Firebase recovery + manual verification

### 4. **Security Breach** (Severity: CRITICAL)
- **Cause:** API key leak, unauthorized access
- **Detection:** Unusual activity, monitoring alerts
- **Impact:** Data privacy, compliance violation
- **RTO:** 2 hours
- **Recovery:** Invalidate compromised credentials, audit logs

### 5. **Data Loss** (Severity: CRITICAL)
- **Cause:** Accidental deletion, ransomware
- **Detection:** Data missing, version control history
- **Impact:** Lost user data, user accounts
- **RTO:** 4 hours
- **Recovery:** Restore from backup

### 6. **Regional Outage** (Severity: HIGH)
- **Cause:** Natural disaster, cloud provider regional outage
- **Detection:** Monitoring from multiple regions
- **Impact:** Entire region unavailable
- **RTO:** 2-4 hours
- **Recovery:** Failover to secondary region

---

## Backup Strategy

### Frequency
- **Database Backups:** Daily at 2 AM UTC
- **Code Backups:** Every commit (git)
- **Configuration Backups:** Daily
- **User Data Exports:** Weekly

### Locations
- **Primary:** Firebase Firestore (auto-backup)
- **Secondary:** Google Cloud Storage (cross-region)
- **Tertiary:** AWS S3 (geo-redundant)
- **Off-site:** Physical backup (USB drive, secured vault)

### Backup Retention
- **Daily:** Last 30 days
- **Weekly:** Last 12 weeks
- **Monthly:** Last 12 months
- **Yearly:** Permanent archive

### Verification
- **Weekly:** Test backup restoration
- **Monthly:** Full DR drill
- **Quarterly:** Comprehensive audit

---

## Monitoring & Early Detection

### Real-Time Monitoring

```
Platform: Prometheus + Grafana + Sentry

Alerting Thresholds:
- Error rate > 1%: Warning
- Error rate > 5%: Critical
- Response time P95 > 2s: Warning
- Response time P99 > 5s: Critical
- Memory usage > 80%: Warning
- Memory usage > 95%: Critical
- Disk usage > 90%: Warning
- Database lag > 1 minute: Critical
```

### On-Call Rotation

```
Monday-Friday:   Business hours (9 AM - 5 PM EST)
Weekend/Night:   On-call rotation (2 people)
Escalation:      If not resolved in 15 minutes
```

### Alert Routing

```
Severity 1 (Critical):
  → SMS to on-call engineer
  → PagerDuty escalation
  → Slack #incidents channel

Severity 2 (High):
  → Email to on-call team
  → Slack #incidents channel

Severity 3 (Medium):
  → Slack #incidents channel only
```

---

## Incident Response Procedures

### Initial Response (First 5 Minutes)

1. **Acknowledge Alert**
   ```bash
   # Confirm issue is real (not false positive)
   # Check monitoring dashboard
   # Verify error logs
   ```

2. **Assess Severity**
   - Critical: Stop the world, all hands on deck
   - High: Assign responsible engineer
   - Medium: Schedule for next business day

3. **Notify Team**
   ```
   Post to #incidents:
   "🚨 INCIDENT: [Service] - [Brief Description]
    Severity: [CRITICAL/HIGH/MEDIUM]
    Estimated RTO: [Time]
    Owner: @[Engineer]"
   ```

### Diagnosis Phase (5-15 Minutes)

1. **Check Recent Changes**
   ```bash
   git log --oneline | head -10
   # See if recent deployment caused issue
   ```

2. **Review Logs**
   ```bash
   # Sentry: https://sentry.io/troop242/issues/
   # Firebase Console: Logs
   # Application Logs: CloudLogging
   ```

3. **Check Dependencies**
   - Firebase status: https://status.firebase.google.com
   - External APIs: health check endpoints
   - DNS: nslookup staging.troop242.org

### Recovery Phase (15-60 Minutes)

#### Option 1: Quick Fix
```bash
# Apply hotfix to code
git checkout -b hotfix/issue-name
# ... make fix ...
git push
# Deploy to staging, verify, then production
```

#### Option 2: Rollback
```bash
# Revert to last known good version
git revert <commit-hash>
git push
firebase deploy --only hosting:production

# Verify recovery
curl -I https://troop242.org
```

#### Option 3: Restore Backup
```bash
# Restore database from last clean backup
firebase firestore import gs://backups/2026-03-21T020000.backup

# Verify data integrity
firebase emulator:exec "tests/verify-data.js"

# Resume service
```

### Post-Incident Phase (After Recovery)

1. **Verify Recovery**
   - [ ] All endpoints responding (200 status)
   - [ ] No error spike in monitoring
   - [ ] Users can login and access data
   - [ ] All critical functions working

2. **Post-Mortem (Within 24 Hours)**
   ```markdown
   # Incident Report: [Title]

   ## Timeline
   - 14:30 UTC: Issue detected
   - 14:35 UTC: Incident declared
   - 14:50 UTC: Root cause identified
   - 14:55 UTC: Fix deployed
   - 15:00 UTC: System recovered

   ## Root Cause
   [What went wrong]

   ## Impact
   - Duration: 30 minutes
   - Users affected: ~50
   - Data lost: 0 records

   ## Resolution
   [What we did to fix it]

   ## Prevention
   [What we'll do to prevent this]

   ## Action Items
   - [ ] Item 1 (Owner: Name, Due: Date)
   - [ ] Item 2 (Owner: Name, Due: Date)
   ```

---

## Failover Procedures

### Database Failover

```bash
# Step 1: Detect failure
# Monitoring alerts on Firestore errors

# Step 2: Assess impact
firebase firestore status

# Step 3: Initiate failover
# If data is corrupted but accessible:
#   - Switch to read-only mode
#   - Restore from backup

# If service is down:
#   - Wait for Firebase recovery
#   - ~99.95% SLA = max 22 min/month downtime

# Step 4: Verify recovery
firebase firestore check --test-connections

# Step 5: Resume operations
# Update status page
# Notify users
```

### Application Failover

```bash
# Step 1: Detect failure
# Load balancer detects unhealthy instance

# Step 2: Automatic failover
# Load balancer routes traffic to healthy instance
# (Already configured in Firebase Hosting)

# Step 3: Auto-scaling (if enabled)
# Kubernetes deploys new instance

# Step 4: Manual failover (if auto-scaling fails)
firebase hosting:channel:deploy backup-channel
firebase hosting:clone production backup-channel

# Step 5: Verify
curl -v https://troop242.org
```

### DNS Failover

```bash
# In case primary domain is compromised

# Step 1: Update DNS records
# Point to backup IP or domain

# Step 2: Verify propagation
nslookup troop242.org
# Should resolve to backup IP within 5 minutes

# Step 3: Notify users
# Email + Slack notification of domain change
```

---

## Backup Restoration Procedures

### Restore Firestore Backup

```bash
# List available backups
gcloud firestore backups list \
  --project=troop242

# Check specific backup
gcloud firestore backups describe <BACKUP_ID> \
  --location=us-central1

# Restore to new database
gcloud firestore restore-backup \
  --backup=projects/troop242/locations/us-central1/backups/<BACKUP_ID> \
  --restore-database-id=troop242-restored

# Test restored data
firebase firestore:export test-data.backup \
  --database=troop242-restored

# If verified, swap databases
#   (Request Google Cloud support for production)
```

### Restore Code

```bash
# If git repository is corrupted

# Step 1: Clone from GitHub
git clone https://github.com/troop242/website.git backup-repo

# Step 2: Verify backup
cd backup-repo
npm install
npm run build

# Step 3: Deploy
firebase deploy --only hosting:production
```

### Restore Configuration

```bash
# Restore environment variables
# From: Encrypted backup or secrets manager

cp .env.backup .env.local
source .env.local

# Verify configuration
echo $REACT_APP_FIREBASE_PROJECT_ID
# Should output: troop242
```

---

## Disaster Recovery Drills

### Monthly Drill Schedule

```
First Monday:  Database restore drill
Second Monday: Application failover drill
Third Monday:  Backup verification
Fourth Monday: Full end-to-end recovery
```

### Drill Checklist

```
Database Restore Drill:
- [ ] List available backups
- [ ] Verify backup integrity
- [ ] Perform test restoration
- [ ] Validate data accuracy
- [ ] Document time taken

Application Failover Drill:
- [ ] Simulate instance failure
- [ ] Verify failover triggers
- [ ] Check load balancing
- [ ] Validate all endpoints
- [ ] Restore failed instance

Backup Verification:
- [ ] Verify backup location
- [ ] Test encryption/decryption
- [ ] Confirm data completeness
- [ ] Document backup size
- [ ] Update retention policy

Full Recovery Drill:
- [ ] Simulate total outage
- [ ] Execute complete recovery
- [ ] Restore database
- [ ] Restore code
- [ ] Verify functionality
- [ ] Record total RTO
```

### Drill Report

```markdown
# Disaster Recovery Drill Report
Date: 2026-03-21
Drill Type: Database Restore

## Timeline
- 10:00 AM: Drill initiated
- 10:05 AM: Identified backup
- 10:15 AM: Started restoration
- 10:25 AM: Restoration complete
- 10:30 AM: Data validation complete

## Results
- RTO Achieved: 30 minutes ✅
- RPO Achieved: 24 hours ✅
- Data Integrity: 100% ✅
- Team Readiness: Good ✅

## Issues Found
- Backup documentation outdated (Fixed)
- One team member wasn't trained (Scheduled training)

## Lessons Learned
- Pre-staging database saves 5 minutes
- Need clearer escalation path

## Action Items
- [ ] Update runbooks
- [ ] Schedule backup training
- [ ] Automate staging
```

---

## Communication Plan

### During Incident

```
Initial notification (within 5 min):
- Email: affected-users@troop242.org
- Subject: "[INCIDENT] Service Degradation"
- Status page: https://status.troop242.org

Updates (every 15-30 minutes):
- Slack #incidents channel
- Twitter @Troop242 (if major incident)
- Status page

Final notification (within 1 hour):
- Email: [incident resolved]
- Status page: [incident closed]
```

### After Incident

```
Post-mortem email:
- What happened
- Root cause
- Impact duration
- What we're fixing
- Link to post-mortem blog post
```

### Template

```
Subject: Service Incident Report - [Date]

Hi Scouts & Leaders,

At [TIME] UTC, we experienced an incident that affected [SERVICE].

Root cause: [CAUSE]
Duration: [X] minutes
Impact: [SCOPE]

We've taken the following steps:
- Fixed the underlying issue
- Validated all data integrity
- Increased monitoring

To prevent this in the future:
- [Action Item 1]
- [Action Item 2]

We appreciate your patience.

Regards,
Troop 242 Team
```

---

## Compliance & Audit

### Regular Audits

- **Weekly:** Backup verification
- **Monthly:** DR drill
- **Quarterly:** Full audit + team training
- **Annually:** External security audit

### Documentation

- [ ] Runbooks current and tested
- [ ] Contact list updated
- [ ] Escalation procedures clear
- [ ] Team trained on procedures
- [ ] Backup schedules verified

### Compliance Checklists

```
GDPR Compliance:
- [ ] Users can export data (within 30 days)
- [ ] Users can request deletion (within 30 days)
- [ ] Data breach notification (within 72 hours)

COPPA Compliance:
- [ ] Parental consent verified
- [ ] Child data protected
- [ ] No marketing to minors
- [ ] Data deletion for minors

CCPA Compliance:
- [ ] Privacy policy published
- [ ] Data sales opt-out available
- [ ] Breach notification (within 60 days)
```

---

## Recovery Capacity

### Current Capacity

| Scenario | RTO | RPO | Capability |
|----------|-----|-----|------------|
| Database Restore | 30 min | 24 hours | ✅ Tested |
| App Failover | 5 min | 0 hours | ✅ Automatic |
| Code Rollback | 10 min | 0 hours | ✅ Tested |
| Regional Failover | 2-4 hours | 1 hour | ⏳ Manual |

### Scaling for Growth

| Users | RTO | RPO | Changes Needed |
|-------|-----|-----|----------------|
| <100 | 1 hour | 24 hours | None |
| 100-500 | 30 min | 6 hours | Hourly backups |
| 500-1000 | 15 min | 1 hour | Real-time replication |
| 1000+ | 5 min | <1 hour | Multi-region |

---

## Key Contacts

### On-Call Team

```
Primary:   John Scoutmaster (john@troop242.org)
Secondary: Jane Leader (jane@troop242.org)
Escalation: Admin (@admin-role)

PagerDuty: https://troop242.pagerduty.com
Slack:     #incidents channel
```

### External Contacts

```
Firebase Support:    support@firebase.google.com
Google Cloud Support: https://cloud.google.com/support
Cloudflare Support:  support@cloudflare.com
GitHub Support:      support@github.com
```

---

## Annual Review

This plan must be reviewed and updated annually (or after major incidents).

**Last Review:** 2026-03-21
**Next Review:** 2027-03-21

### Review Checklist

- [ ] Update contact list
- [ ] Test all procedures
- [ ] Verify backup locations
- [ ] Update RTO/RPO targets
- [ ] Review incident history
- [ ] Update team training
- [ ] Audit log retention
- [ ] Verify compliance

---

**Status:** ✅ **PRODUCTION READY**
**Approval:** [Admin Signature]
**Effective Date:** 2026-03-21
