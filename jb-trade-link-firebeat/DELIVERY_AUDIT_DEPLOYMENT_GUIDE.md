# DELIVERY AUDIT - DEPLOYMENT GUIDE

## Overview
This document provides step-by-step instructions for deploying the delivery audit fixes from staging to production.

**Status**: ✅ Ready for deployment after staging tests pass  
**Risk Level**: LOW (Backward compatible, no breaking changes)  
**Rollback Difficulty**: EASY (Can revert immediately if issues occur)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. Backup Verification
- [ ] Full production database backup completed
- [ ] Backup verified (restore tested)
- [ ] Backup location documented
- [ ] Backup retention policy confirmed

**Command to verify backup:**
```bash
# Check backup size and timestamp
ls -lh /path/to/backups/prod-backup-*.sql

# Verify backup is readable
head -100 /path/to/backups/prod-backup-*.sql
```

### 2. Code Review
- [ ] All changes reviewed by technical lead
- [ ] Security review completed
- [ ] Performance implications assessed
- [ ] No breaking changes identified
- [ ] Backward compatibility verified

### 3. Testing Completion
- [ ] Staging tests 100% passed
- [ ] All critical test scenarios passed
- [ ] Edge cases tested
- [ ] Performance validated
- [ ] UAT approved

### 4. Team Preparation
- [ ] Team notified of deployment time
- [ ] On-call engineer available
- [ ] Support team briefed
- [ ] Monitoring team prepared
- [ ] Documentation ready

### 5. Communication
- [ ] Stakeholders notified
- [ ] Change management ticket created
- [ ] Rollback procedure documented
- [ ] Emergency contacts listed

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Deployment Window Preparation (5 minutes)

```bash
# 1. Set deployment time window
DEPLOYMENT_TIME="2024-01-XX 02:00 UTC"  # Off-peak time

# 2. Create change ticket
echo "Change: Deploy delivery audit fixes v1.0"
echo "Time: ${DEPLOYMENT_TIME}"
echo "Impact: Delivery tracking system - low risk"

# 3. Notify team
echo "Deployment starting at: ${DEPLOYMENT_TIME}"
```

### Step 2: Pre-Deployment Health Check (5 minutes)

**Run these queries to verify production baseline:**

```sql
-- Check current health
SELECT 
  'orders' as table_name,
  COUNT(*) as record_count,
  MAX(updatedAt) as latest_update
FROM orders
UNION ALL
SELECT 
  'delivery_orders' as table_name,
  COUNT(*) as record_count,
  MAX(createdAt) as latest_update
FROM delivery_orders
UNION ALL
SELECT 
  'damage_logs' as table_name,
  COUNT(*) as record_count,
  MAX(createdAt) as latest_update
FROM damage_logs
UNION ALL
SELECT 
  'returns' as table_name,
  COUNT(*) as record_count,
  MAX(createdAt) as latest_update
FROM returns
UNION ALL
SELECT 
  'return_items' as table_name,
  COUNT(*) as record_count,
  MAX(createdAt) as latest_update
FROM return_items;

-- Check error logs for any issues
SELECT 'Checking for errors in last 1 hour' as check_name;
-- Query your error logging system
```

### Step 3: Deploy Code (10-15 minutes)

**Option A: Using Git/CI-CD**

```bash
# 1. Navigate to deployment directory
cd /path/to/jb-trade-link-firebeat

# 2. Pull latest changes from main branch
git checkout main
git pull origin main

# 3. Build application
npm run build
# or
yarn build

# 4. Run pre-deployment tests
npm run test
# or
yarn test

# 5. Deploy to production
npm run deploy:prod
# or
yarn deploy:prod
```

**Option B: Manual Deployment**

```bash
# 1. Stop the application
sudo systemctl stop jb-trade-link-firebeat

# 2. Backup current code
cp -r /app/jb-trade-link-firebeat /app/jb-trade-link-firebeat.backup.$(date +%Y%m%d-%H%M%S)

# 3. Copy new code
cp -r /deployment/jb-trade-link-firebeat /app/

# 4. Install dependencies (if needed)
cd /app/jb-trade-link-firebeat
npm install --production

# 5. Rebuild if needed
npm run build

# 6. Start the application
sudo systemctl start jb-trade-link-firebeat

# 7. Verify startup
sleep 10 && systemctl status jb-trade-link-firebeat
```

### Step 4: Post-Deployment Verification (10 minutes)

**Immediate Checks:**

```bash
# 1. Check application is running
curl -s http://localhost:3000/health | jq .

# 2. Check logs for errors
tail -100 /var/log/jb-trade-link-firebeat/error.log

# 3. Check application responds
curl -s http://localhost:3000/api/v1/health

# 4. Verify database connection
# Monitor application logs for "Connected to database"
tail -50 /var/log/jb-trade-link-firebeat/app.log | grep -i database
```

**Database Verification Queries:**

```sql
-- Verify all tables accessible
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM delivery_orders;
SELECT COUNT(*) FROM damage_logs;
SELECT COUNT(*) FROM returns;
SELECT COUNT(*) FROM return_items;

-- Verify no recent data loss
SELECT COUNT(*) FROM orders WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 1 DAY);
SELECT COUNT(*) FROM delivery_orders WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 1 DAY);

-- Run a sample delivery scenario
-- See validation queries below
```

### Step 5: Smoke Testing (15-20 minutes)

**Run critical smoke tests:**

```bash
# 1. Test delivery marking (manual or automated)
# Complete 3-5 test deliveries with different payment methods

# 2. Test data integrity
# Verify damages, returns, and order statuses are recorded

# 3. Test UI responsiveness
# Load delivery tracking dashboard
# Verify no console errors
```

**UI Smoke Tests:**
1. Navigate to `/delivery-tracking`
2. Click "Mark as Delivered" button
3. Verify form loads correctly
4. Check payment method dropdown (should show QR and Credit only, no UPI)
5. Submit form
6. Verify data saved

### Step 6: Validation Queries (10-15 minutes)

**Run these queries to verify the fixes are working:**

```sql
-- Query 1: Recent deliveries with status sync
SELECT 
  o.orderId,
  o.status as orderStatus,
  do.status as deliveryStatus,
  o.paymentMethod,
  o.updatedAt,
  CASE 
    WHEN o.status = 'delivered' THEN '✓ PASS'
    ELSE '✗ FAIL' 
  END as validation
FROM orders o
LEFT JOIN delivery_orders do ON o.orderId = do.orderId
WHERE o.updatedAt >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
ORDER BY o.updatedAt DESC
LIMIT 10;

-- Query 2: Recent damages logged
SELECT 
  COUNT(*) as damageCount,
  MAX(createdAt) as latestDamage
FROM damage_logs
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 1 HOUR);

-- Query 3: Recent returns processed
SELECT 
  COUNT(*) as returnCount,
  MAX(createdAt) as latestReturn
FROM returns
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 1 HOUR);

-- Query 4: Verify no UPI payments
SELECT 
  COUNT(*) as upiCount
FROM delivery_orders
WHERE paymentMode = 'UPI'
AND createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR);

-- Query 5: Payment method distribution
SELECT 
  paymentMode,
  COUNT(*) as count
FROM delivery_orders
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
GROUP BY paymentMode;
```

**Expected Results:**
- Query 1: Recent orders show status='delivered' ✓
- Query 2: Recent damages show count > 0 (if any delivered) ✓
- Query 3: Recent returns show count > 0 (if any returned) ✓
- Query 4: UPI count = 0 ✓
- Query 5: Shows only QR, Credit, Cheque (no UPI) ✓

---

## 📊 MONITORING DURING FIRST 24 HOURS

### Real-time Monitoring (First 2 hours)

**Every 15 minutes:**
```bash
# Check application health
curl -s http://localhost:3000/health | jq .

# Check error rate
tail -20 /var/log/jb-trade-link-firebeat/error.log | wc -l
```

**Every 30 minutes:**
```bash
# Run validation queries
mysql -u user -p database < validation-checks.sql
```

### Hourly Monitoring (First 24 hours)

```bash
# Check application performance
# Monitor CPU, memory, database connections
top -b -n 1 | head -20

# Check new errors
grep -i "error\|exception" /var/log/jb-trade-link-firebeat/*.log | tail -50

# Check database size (shouldn't grow unexpectedly)
mysql -u user -p -e "SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) as size_mb FROM information_schema.tables WHERE table_schema = 'database' ORDER BY size_mb DESC;"
```

### Daily Monitoring (Days 2-7)

Run complete validation query suite daily:
- Check damage_logs population
- Check returns/return_items population
- Check order status synchronization
- Check payment method consistency
- Verify no orphaned data

---

## 🚨 ISSUE DETECTION & RESPONSE

### Issue: Application Won't Start

**Symptoms:**
- Application exits immediately
- Error logs show startup errors

**Response:**
```bash
# 1. Check logs for error
tail -100 /var/log/jb-trade-link-firebeat/error.log

# 2. Rollback immediately
sudo systemctl stop jb-trade-link-firebeat
cp -r /app/jb-trade-link-firebeat.backup.* /app/jb-trade-link-firebeat
sudo systemctl start jb-trade-link-firebeat

# 3. Investigate (after rollback)
# Check database connectivity
# Check configuration files
# Review deployment logs
```

### Issue: Database Connection Errors

**Symptoms:**
- Queries timeout
- Database unavailable messages
- Connection pool exhaustion

**Response:**
```bash
# 1. Check database connectivity
mysql -u user -p -h hostname -e "SELECT 1;"

# 2. Check connection pool status
# Monitor application metrics

# 3. If critical, rollback
# See rollback procedure below

# 4. Investigate
# Check database load
# Check network connectivity
# Check credentials
```

### Issue: Data Integrity Problems

**Symptoms:**
- Orphaned records in damage_logs/returns
- Order status not updating
- Payment methods not saved

**Response:**
```sql
-- 1. Identify affected records
SELECT COUNT(*) FROM damage_logs WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 1 HOUR);
SELECT COUNT(*) FROM returns WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 1 HOUR);

-- 2. Check consistency
SELECT COUNT(*) FROM orders WHERE updatedAt >= DATE_SUB(NOW(), INTERVAL 1 HOUR) 
AND status NOT IN ('delivered', 'returned', 'cancelled', 'delayed');

-- 3. If issues found:
-- - Stop accepting deliveries temporarily
-- - Investigate logs
-- - Consider rollback
-- - Manual correction if needed
```

### Issue: Performance Degradation

**Symptoms:**
- Slow response times
- Timeouts
- High CPU/memory usage

**Response:**
```bash
# 1. Identify bottleneck
top
iostat
mysql slow query log

# 2. Monitor database queries
# Check for missing indexes on new tables

# 3. Consider rollback if severe

# 4. Optimize if issue identified
# Add indexes if needed
# Optimize queries
```

---

## 🔄 ROLLBACK PROCEDURE

If you need to rollback the deployment:

### Quick Rollback (< 5 minutes)

```bash
# 1. Stop application
sudo systemctl stop jb-trade-link-firebeat

# 2. Restore previous version
rm -rf /app/jb-trade-link-firebeat
cp -r /app/jb-trade-link-firebeat.backup.LATEST /app/jb-trade-link-firebeat

# 3. Restart application
sudo systemctl start jb-trade-link-firebeat

# 4. Verify
sleep 10
systemctl status jb-trade-link-firebeat
curl -s http://localhost:3000/health

# 5. Notify team
echo "Rollback completed at $(date)"
```

### Complete Rollback (Including Database)

```sql
-- ONLY IF DATA CORRUPTION DETECTED

-- 1. Identify bad data
SELECT COUNT(*) as badRecords FROM damage_logs 
WHERE createdAt >= '2024-01-XX 02:00:00';

-- 2. If needed, restore from backup
-- Contact DBA for database restore

-- 3. Verify data integrity
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM delivery_orders;
```

---

## ✅ POST-DEPLOYMENT CHECKLIST

### Immediate (First Hour)
- [ ] Application running without errors
- [ ] All smoke tests passed
- [ ] Validation queries show ✓
- [ ] No spike in error logs
- [ ] Database performing normally
- [ ] Team notified of success

### Short-term (First 24 Hours)
- [ ] Hourly monitoring checks passed
- [ ] No critical issues reported
- [ ] Performance remains stable
- [ ] Payment methods working (QR only, no UPI)
- [ ] Delivery marking working
- [ ] Data flowing to damage_logs, returns tables

### Medium-term (Week 1)
- [ ] Daily validation queries passed
- [ ] No data integrity issues
- [ ] Users successfully using new features
- [ ] Support tickets minimal
- [ ] Performance metrics stable
- [ ] Monitoring alerts configured

### Long-term (Ongoing)
- [ ] Weekly data integrity audits
- [ ] Monthly performance reviews
- [ ] Quarterly security reviews
- [ ] Document any issues for future reference

---

## 📞 SUPPORT & ESCALATION

### During Deployment

**On-Call Engineer:**
- Name: [TBD]
- Phone: [TBD]
- Slack: @[TBD]

**Technical Lead:**
- Name: [TBD]
- Phone: [TBD]
- Slack: @[TBD]

**Database Administrator:**
- Name: [TBD]
- Phone: [TBD]
- Slack: @[TBD]

### Escalation Path

1. **First 15 minutes:** Try quick fix (check logs, verify connectivity)
2. **15-30 minutes:** Escalate to Technical Lead
3. **30+ minutes:** Escalate to Database Administrator
4. **If critical:** Execute rollback and investigate later

---

## 📝 DEPLOYMENT LOG TEMPLATE

```
# PRODUCTION DEPLOYMENT LOG

## Deployment Date: [DATE]
## Start Time: [TIME]
## End Time: [TIME]
## Duration: [MINUTES]

## Pre-Deployment
- Database backup: ✓ [Backup ID]
- Code review: ✓ [Reviewer]
- Staging tests: ✓ [All passed]

## Deployment Steps
- Code deployment: ✓ [Duration: X min]
- Application restart: ✓ [Duration: X min]
- Post-deployment checks: ✓ [All passed]

## Validation Results
- Application health: ✓ 
- Database connectivity: ✓
- Smoke tests: ✓ (5/5 passed)
- Validation queries: ✓ (All passed)

## Issues Encountered
- [None / List any issues]

## Monitoring Alerts
- [None / List any alerts]

## Deployed By: [Name]
## Verified By: [Name]
## Signed Off By: [Name]

## Notes:
[Any additional notes about the deployment]
```

---

## 🎯 SUCCESS CRITERIA

Deployment is considered successful when:

1. ✅ Application is running without errors
2. ✅ All smoke tests passed
3. ✅ Validation queries return expected results
4. ✅ No spike in error logs
5. ✅ Database performance normal
6. ✅ First 10 deliveries successfully recorded:
   - Delivery status synchronized to orders table
   - Payment method recorded correctly
   - Damage logs populated (if damages)
   - Return tables populated (if returns)
   - Activity timeline updated with correct orderId
7. ✅ No UPI payment option visible in UI
8. ✅ QR and Credit payment reference fields working
9. ✅ No users reporting issues within first 24 hours
10. ✅ Team sign-off obtained

---

## 📚 RELATED DOCUMENTATION

- `DELIVERY_AUDIT_COMPREHENSIVE.md` - Audit details
- `DELIVERY_AUDIT_FIXES_COMPLETE.md` - Implementation details
- `DELIVERY_AUDIT_VALIDATION_QUERIES.sql` - SQL validation queries
- `DELIVERY_AUDIT_TESTING_CHECKLIST.md` - Testing procedures
- Source files modified:
  - `services/delivery-orders.ts`
  - `components/delivery/MarkDeliveredModal.tsx`

---

## ✍️ DEPLOYMENT SIGN-OFF

**Prepared By:** [Name] | [Date]  
**Reviewed By:** [Name] | [Date]  
**Approved By:** [Name] | [Date]  
**Deployed By:** [Name] | [Date]  
**Verified By:** [Name] | [Date]
