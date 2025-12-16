# Extended Compensation System: Deployment Checklist

**Date**: December 7, 2025  
**Status**: Ready for Deployment  
**Estimated Duration**: 1.5-2 hours

---

## Pre-Deployment

### Code Preparation
- [ ] All files created in workspace
  - `types/hr-extended.ts` ✓
  - `utils/commissionCalculator-extended.ts` ✓
  - `services/hr-extended.ts` ✓
  - `extended_compensation_migration.sql` ✓
  - `__tests__/commissionCalculator-extended.test.ts` ✓

- [ ] Code review completed
  - [ ] All types are comprehensive
  - [ ] Calculator logic is correct
  - [ ] Service methods follow patterns
  - [ ] SQL migration is idempotent
  - [ ] Tests cover all scenarios

- [ ] Documentation reviewed
  - [ ] EXTENDED_COMPENSATION_README.md
  - [ ] QUICK_START_EXTENDED_COMPENSATION.md
  - [ ] EXTENDED_COMPENSATION_COMPLETE_PACKAGE.md

### Environment Preparation
- [ ] Staging environment available
- [ ] Database backups configured
- [ ] Monitoring/alerting ready
- [ ] Rollback procedure documented

---

## Phase 1: Database Migration (15 minutes)

### Step 1.1: Backup Database
- [ ] Navigate to Supabase dashboard
- [ ] Go to Settings → Backups
- [ ] Create manual backup
- [ ] Verify backup completed
- [ ] Save backup details

### Step 1.2: Run Phase 1 - Commission Rates Extension
**In Supabase SQL Editor**, run:

```sql
-- PHASE 1: Commission Rates Table Extension
-- Add new columns for dual mode support

ALTER TABLE commission_rates 
ADD COLUMN IF NOT EXISTS mode text DEFAULT 'slab'
  CHECK (mode IN ('slab', 'level'));

ALTER TABLE commission_rates 
ADD COLUMN IF NOT EXISTS set_name text;

ALTER TABLE commission_rates 
ADD COLUMN IF NOT EXISTS apply_to text DEFAULT 'company'
  CHECK (apply_to IN ('company', 'product', 'custom'));

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_commission_rates_company_mode 
ON commission_rates(company_id, mode, is_active)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_commission_rates_set_name 
ON commission_rates(set_name) 
WHERE set_name IS NOT NULL AND is_active = true;

CREATE INDEX IF NOT EXISTS idx_commission_rates_mode_active 
ON commission_rates(mode, is_active)
WHERE is_active = true;
```

- [ ] Query executed successfully
- [ ] No errors in output
- [ ] Scroll to verify completion message

### Step 1.3: Verify Phase 1
Run validation query:

```sql
-- Verify columns exist
SELECT 
  column_name, 
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'commission_rates'
AND column_name IN ('mode', 'set_name', 'apply_to')
ORDER BY ordinal_position;
```

- [ ] `mode` column exists (text, default='slab')
- [ ] `set_name` column exists (text)
- [ ] `apply_to` column exists (text, default='company')
- [ ] All indexes created successfully

### Step 1.4: Run Phase 2 - Sales Returns Tracking

**Choose ONE option**:

**Option A** (Simpler) - Add returns column to orders:
```sql
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS sales_returns numeric DEFAULT 0
  CHECK (sales_returns >= 0);

CREATE INDEX IF NOT EXISTS idx_orders_net_sales 
ON orders((totalAmount - COALESCE(sales_returns, 0)));
```

- [ ] Column added to orders
- [ ] Index created
- [ ] No errors

**Option B** (Recommended) - Create separate returns table:
```sql
CREATE TABLE IF NOT EXISTS sales_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  salesperson_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE SET NULL,
  return_amount numeric NOT NULL CHECK (return_amount > 0),
  return_date timestamp NOT NULL,
  reason text,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_returns_order_id 
ON sales_returns(order_id);

CREATE INDEX IF NOT EXISTS idx_sales_returns_salesperson_id 
ON sales_returns(salesperson_id);

CREATE INDEX IF NOT EXISTS idx_sales_returns_salesperson_date 
ON sales_returns(salesperson_id, return_date)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_sales_returns_company_date 
ON sales_returns(company_id, return_date)
WHERE is_active = true;

ALTER TABLE sales_returns ENABLE ROW LEVEL SECURITY;
```

- [ ] Option chosen (A or B)
- [ ] Table/columns created
- [ ] Indexes created
- [ ] No errors

### Step 1.5: Run Phase 3 - Backfill Existing Data

```sql
-- Backfill existing commission rates with default mode
UPDATE commission_rates 
SET mode = 'slab' 
WHERE mode IS NULL;

-- Verify backfill
SELECT COUNT(*), mode, is_active 
FROM commission_rates 
GROUP BY mode, is_active;
```

- [ ] Backfill query executed
- [ ] All existing rates have mode='slab'
- [ ] No NULL mode values
- [ ] Verification query shows expected counts

### Step 1.6: Database Verification
```sql
-- Full verification of schema
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name IN ('commission_rates', 'sales_returns', 'orders')
AND column_name IN ('mode', 'set_name', 'apply_to', 'sales_returns', 'return_amount')
ORDER BY table_name, ordinal_position;
```

- [ ] All expected columns present
- [ ] Data types correct
- [ ] Schema matches expected design

---

## Phase 2: Code Integration (10 minutes)

### Step 2.1: Service Integration
In `services/hr.ts`:

- [ ] Import new types from `hr-extended.ts`
```typescript
import {
  CommissionMode,
  CommissionRateSet,
} from '@/types/hr-extended';
```

- [ ] Import extended functions
```typescript
import {
  validateSlabBands,
  validateLevelBands,
  calculateCommissionWithReturns,
} from '@/utils/commissionCalculator-extended';
```

- [ ] Add methods to CommissionRateService:
  - [ ] `getByCompanyAndMode()`
  - [ ] `getByCompanyModeAndSet()`
  - [ ] `getAvailableSets()`

- [ ] Add/update SalesService methods:
  - [ ] `getNetSalesByUser()`
  - [ ] `getNetSalesByUserAndCompany()`
  - [ ] `calculateUserCompensation()`

### Step 2.2: Component Updates

**CommissionRateManager.tsx**:
- [ ] Add mode state variable
- [ ] Add mode selector to form
- [ ] Update payload to include mode
- [ ] Test mode selector appears

**HRPanel.tsx**:
- [ ] Import CompensationDetail type
- [ ] Add columns: Gross, Returns, Net, Mode
- [ ] Update table rendering
- [ ] Update data fetch to use new service
- [ ] Test new columns display

### Step 2.3: Type Imports
- [ ] Update all files using compensation data
- [ ] Add `hr-extended` imports where needed
- [ ] Remove old type imports if conflicting

---

## Phase 3: Testing (30 minutes)

### Step 3.1: Unit Tests
```bash
npm test -- commissionCalculator-extended.test.ts
```

- [ ] All 70+ tests pass
- [ ] No test failures
- [ ] Coverage report shows >90%

### Step 3.2: TypeScript Verification
```bash
npx tsc --noEmit
```

- [ ] No TypeScript errors
- [ ] No type mismatches
- [ ] All imports resolved

### Step 3.3: Build Test
```bash
npm run build
```

- [ ] Build succeeds
- [ ] No build errors
- [ ] Output is clean

### Step 3.4: Manual Testing - Commission Rates

1. **Navigate to Companies page**
   - [ ] Company list loads
   - [ ] Can select a company

2. **Commission Rate Manager**
   - [ ] Opens successfully
   - [ ] Can see existing rates
   - [ ] Mode selector visible
   - [ ] Can add new rate with mode='slab'
   - [ ] Can add new rate with mode='level'
   - [ ] Save works for both modes
   - [ ] Rates persist after reload

3. **Rate List**
   - [ ] Shows mode column (new)
   - [ ] Shows set_name column (new)
   - [ ] Existing rates show mode='slab'

### Step 3.5: Manual Testing - HR Panel

1. **Navigate to HR Panel**
   - [ ] Panel loads successfully
   - [ ] Can select date range
   - [ ] Can select salesperson

2. **Verify Table Columns**
   - [ ] Shows: Name | Gross | Returns | Net | Mode | Commission | Base | Payout
   - [ ] New columns visible and not overlapping

3. **Verify Calculations**
   - Create test data:
     - Gross Sales: $50,000
     - Returns: $5,000
     - [ ] Gross shows: $50,000
     - [ ] Returns shows: $5,000
     - [ ] Net shows: $45,000
     - [ ] Commission calculated on $45,000, NOT $50,000
     - [ ] Mode badge shows correctly

4. **Test Both Modes**
   - [ ] Create slab mode rates
   - [ ] Create level mode rates
   - [ ] Verify both calculate correctly
   - [ ] Verify slab and level give different results

### Step 3.6: Edge Case Testing

**Test Cases**:
- [ ] Zero sales → 0 commission
- [ ] Returns > Gross → 0 commission
- [ ] Sales exactly at band boundary
- [ ] Negative returns (should convert to 0)
- [ ] Very large sales amounts
- [ ] Multiple salespeople

---

## Phase 4: Staging Deployment (20 minutes)

### Step 4.1: Deploy to Staging
```bash
# Build
npm run build

# Deploy to staging environment
# (Your deployment command here)
```

- [ ] Build completes
- [ ] No build errors
- [ ] Deployment succeeds
- [ ] Staging environment accessible

### Step 4.2: Staging Verification

1. **Database Connection**
   - [ ] Can connect to staging DB
   - [ ] New columns visible
   - [ ] New tables accessible

2. **Application Functions**
   - [ ] Load HR Panel
   - [ ] Load Commission Rates
   - [ ] View existing data
   - [ ] Create new rate (slab mode)
   - [ ] Create new rate (level mode)
   - [ ] Calculate compensation

3. **Data Integrity**
   - [ ] Existing data not corrupted
   - [ ] Existing rates functional
   - [ ] Backward compatibility works

4. **Performance**
   - [ ] Page load times acceptable
   - [ ] No database timeout errors
   - [ ] Queries complete in <1 second

---

## Phase 5: Production Deployment (15 minutes)

### Step 5.1: Final Backup
- [ ] Create final database backup
- [ ] Verify backup completion
- [ ] Save backup location

### Step 5.2: Production Deployment
```bash
npm run build
# Deploy to production
```

- [ ] Build succeeds
- [ ] Deployment succeeds
- [ ] Application is live
- [ ] No errors in logs

### Step 5.3: Post-Deployment Verification

1. **Application Health**
   - [ ] Application loads without errors
   - [ ] No console errors
   - [ ] No network errors

2. **Feature Verification**
   - [ ] HR Panel displays correctly
   - [ ] Commission Rates manager works
   - [ ] Can add rates with modes
   - [ ] Compensation calculations work

3. **Data Verification**
   - [ ] All existing data intact
   - [ ] Compensation still calculates
   - [ ] No data loss

4. **Monitoring**
   - [ ] Set up alerts for calculation errors
   - [ ] Monitor database performance
   - [ ] Check error logs hourly for 24 hours

---

## Rollback Procedures (If Needed)

### Quick Rollback
If issues occur immediately:

```bash
# Revert code
git revert <deployment-commit>

# OR: Restore from backup
# In Supabase: Settings → Backups → Restore
```

- [ ] Have backup ID ready
- [ ] Know rollback command
- [ ] Test rollback procedure before deploying

### Database Rollback
```sql
-- If needed, can undo migration with:
ALTER TABLE commission_rates DROP COLUMN IF EXISTS mode;
ALTER TABLE commission_rates DROP COLUMN IF EXISTS set_name;
ALTER TABLE commission_rates DROP COLUMN IF EXISTS apply_to;

DROP TABLE IF EXISTS sales_returns;
ALTER TABLE orders DROP COLUMN IF EXISTS sales_returns;

DROP INDEX IF EXISTS idx_commission_rates_company_mode;
DROP INDEX IF EXISTS idx_commission_rates_set_name;
DROP INDEX IF EXISTS idx_sales_returns_order_id;
```

---

## Post-Deployment Monitoring (24 hours)

### Hour 1-2: Continuous Monitoring
- [ ] Check error logs every 15 minutes
- [ ] Monitor database query times
- [ ] Check application responsiveness
- [ ] Verify compensation calculations

### Hour 2-6: Regular Monitoring
- [ ] Check logs hourly
- [ ] Review database performance
- [ ] Monitor user feedback
- [ ] Check for any reported issues

### Hour 6-24: Extended Monitoring
- [ ] Check logs daily
- [ ] Review key metrics
- [ ] Monitor for edge cases
- [ ] Ensure stability

### Success Indicators
- [ ] No error logs related to compensation
- [ ] Database performance normal
- [ ] Users reporting expected calculations
- [ ] No unexpected behavior
- [ ] All features working as designed

---

## Sign-Off Checklist

### Technical Lead
- [ ] Code reviewed
- [ ] Tests passed
- [ ] Staging deployment successful
- [ ] Production deployment successful

### Product Owner
- [ ] Features work as expected
- [ ] UI displays correctly
- [ ] Calculations are accurate
- [ ] User experience is good

### QA Team
- [ ] All test cases passed
- [ ] Edge cases handled
- [ ] No regression issues
- [ ] Documentation reviewed

---

## Post-Deployment Tasks

### Within 24 Hours
- [ ] All monitoring checks passed
- [ ] No critical issues reported
- [ ] User feedback collected
- [ ] Close any open issues

### Within 1 Week
- [ ] Full regression testing completed
- [ ] Performance metrics reviewed
- [ ] Documentation updated
- [ ] Team training completed

### Within 1 Month
- [ ] Usage metrics analyzed
- [ ] User adoption measured
- [ ] Enhancement opportunities identified
- [ ] Next phase planned

---

## Documentation & Handoff

### Updated Documentation
- [ ] README.md updated with new features
- [ ] API documentation updated
- [ ] User guide updated
- [ ] Troubleshooting guide created

### Team Training
- [ ] Developers trained on new code
- [ ] Support team trained on new features
- [ ] Managers trained on new UI
- [ ] Users trained on new features

### Backup & Recovery
- [ ] Rollback procedure documented
- [ ] Restore procedure documented
- [ ] Emergency contacts listed
- [ ] Escalation path defined

---

## Final Checklist

**Before You Start:**
- [ ] All team members notified
- [ ] Users informed of changes
- [ ] Backup scheduled
- [ ] Monitoring active

**During Deployment:**
- [ ] Follow each phase carefully
- [ ] Verify each step
- [ ] Document any issues
- [ ] Keep team informed

**After Deployment:**
- [ ] Monitor continuously
- [ ] Collect user feedback
- [ ] Fix any issues quickly
- [ ] Document lessons learned

---

## Success Criteria

Deployment is successful when:

✅ Database migration completes without errors  
✅ All code deploys successfully  
✅ All tests pass  
✅ HR Panel displays new columns  
✅ Commission calculations work correctly  
✅ Both modes calculate different results  
✅ Returns reduce commission  
✅ Existing data intact  
✅ No error logs  
✅ Users can access features  

---

**Estimated Total Time**: 1.5-2 hours

**Status**: ✅ READY TO DEPLOY

Good luck! 🚀
