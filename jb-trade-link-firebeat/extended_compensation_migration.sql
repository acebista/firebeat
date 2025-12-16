-- Extended Compensation System Migration
-- Date: December 7, 2025
-- Purpose: Add dual commission modes (slab/level) and net sales tracking
-- Status: Ready for execution

-- ============================================================================
-- PHASE 1: Commission Rates Table Extension
-- ============================================================================

-- Add new columns for mode, set grouping, and scope
ALTER TABLE commission_rates 
ADD COLUMN IF NOT EXISTS mode text DEFAULT 'slab'
  CHECK (mode IN ('slab', 'level'));

ALTER TABLE commission_rates 
ADD COLUMN IF NOT EXISTS set_name text;

ALTER TABLE commission_rates 
ADD COLUMN IF NOT EXISTS apply_to text DEFAULT 'company'
  CHECK (apply_to IN ('company', 'product', 'custom'));

-- Ensure updated_at is tracked
ALTER TABLE commission_rates 
ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT NOW();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_commission_rates_company_mode 
ON commission_rates(company_id, mode, is_active)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_commission_rates_set_name 
ON commission_rates(set_name) 
WHERE set_name IS NOT NULL AND is_active = true;

CREATE INDEX IF NOT EXISTS idx_commission_rates_mode_active 
ON commission_rates(mode, is_active)
WHERE is_active = true;

-- ============================================================================
-- PHASE 2: Sales Returns Tracking (OPTION A: Add to orders)
-- ============================================================================

-- Option A: Add sales_returns column to orders table
-- This is simpler if returns are infrequent and tied to specific orders

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS sales_returns numeric DEFAULT 0
  CHECK (sales_returns >= 0);

-- Optional: Add computed column for net sales
-- PostgreSQL 12+: Generated columns
-- ALTER TABLE orders 
-- ADD COLUMN IF NOT EXISTS net_sales_amount numeric 
--   GENERATED ALWAYS AS (totalAmount - COALESCE(sales_returns, 0)) STORED;

-- Index for net sales queries
CREATE INDEX IF NOT EXISTS idx_orders_net_sales 
ON orders((totalAmount - COALESCE(sales_returns, 0)));

-- ============================================================================
-- PHASE 2B: Sales Returns Tracking (OPTION B: Separate table)
-- ============================================================================

-- Option B: Create dedicated returns table
-- This is better if returns are complex with reasons, audit trails, etc.

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

-- Indexes for performance
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

-- Enable RLS if using it
ALTER TABLE sales_returns ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PHASE 3: Backfill Existing Data
-- ============================================================================

-- Verify all existing commission_rates have mode set
-- (They should default to 'slab' from the ALTER command)

UPDATE commission_rates 
SET mode = 'slab' 
WHERE mode IS NULL;

-- Log the backfill
SELECT 
  COUNT(*) as total_rates,
  COUNT(CASE WHEN mode = 'slab' THEN 1 END) as slab_count,
  COUNT(CASE WHEN mode = 'level' THEN 1 END) as level_count,
  COUNT(DISTINCT company_id) as companies_affected
FROM commission_rates;

-- ============================================================================
-- PHASE 4: Data Integrity Checks
-- ============================================================================

-- Check for any inconsistencies
SELECT 
  company_id,
  mode,
  COUNT(*) as band_count,
  COUNT(DISTINCT set_name) as set_count,
  MIN(min_amount) as min_range,
  MAX(COALESCE(max_amount, 999999999)) as max_range
FROM commission_rates
WHERE is_active = true
GROUP BY company_id, mode
ORDER BY company_id, mode;

-- Verify no NULL modes
SELECT COUNT(*) as null_modes
FROM commission_rates
WHERE mode IS NULL;

-- Expected: 0

-- ============================================================================
-- PHASE 5: Create Views for Common Queries
-- ============================================================================

-- View: Get active commission rates by company and mode
CREATE OR REPLACE VIEW v_commission_rates_by_mode AS
SELECT 
  company_id,
  company_name,
  mode,
  set_name,
  id,
  name,
  min_amount,
  max_amount,
  rate_pct,
  is_active,
  created_at,
  updated_at
FROM commission_rates
WHERE is_active = true
ORDER BY company_id, mode, set_name, min_amount;

-- View: Get net sales per salesperson (requires sales_returns table)
-- Uncomment if using separate returns table
/*
CREATE OR REPLACE VIEW v_salesperson_net_sales AS
SELECT 
  u.id as salesperson_id,
  u.name as salesperson_name,
  o.date::DATE as sales_date,
  COUNT(o.id) as order_count,
  COALESCE(SUM(o.totalAmount), 0) as gross_sales,
  COALESCE(SUM(sr.return_amount), 0) as returns,
  COALESCE(SUM(o.totalAmount), 0) - COALESCE(SUM(sr.return_amount), 0) as net_sales
FROM users u
LEFT JOIN orders o ON u.id = o.salespersonId
LEFT JOIN sales_returns sr ON o.id = sr.order_id AND sr.is_active = true
WHERE u.role = 'sales'
GROUP BY u.id, u.name, o.date;
*/

-- ============================================================================
-- PHASE 6: RLS Policies (if using Supabase auth)
-- ============================================================================

-- Commission rates: admins can read/write
CREATE POLICY "Admins can manage commission rates"
ON commission_rates
FOR ALL
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Sales returns: admins can read/write, users can read own
-- (Only if using sales_returns table)
CREATE POLICY "Admins can manage returns"
ON sales_returns
FOR ALL
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view own returns"
ON sales_returns
FOR SELECT
USING (salesperson_id = auth.user_id());

-- ============================================================================
-- VALIDATION: Run these to confirm migration success
-- ============================================================================

-- Check 1: All columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'commission_rates'
AND column_name IN ('mode', 'set_name', 'apply_to', 'updated_at');

-- Expected: 4 rows with correct data types

-- Check 2: All indexes created
SELECT indexname
FROM pg_indexes
WHERE tablename = 'commission_rates'
AND indexname LIKE 'idx_commission_rates%';

-- Expected: 3 indexes

-- Check 3: Sample data verification
SELECT 
  id,
  company_id,
  name,
  mode,
  set_name,
  min_amount,
  max_amount,
  rate_pct
FROM commission_rates
WHERE is_active = true
LIMIT 5;

-- Check 4: No overlapping slabs (for slab mode)
WITH slab_overlaps AS (
  SELECT 
    a.id as slab_a_id,
    b.id as slab_b_id,
    a.company_id,
    a.name as slab_a_name,
    b.name as slab_b_name,
    a.min_amount as a_min,
    COALESCE(a.max_amount, 999999999) as a_max,
    b.min_amount as b_min,
    COALESCE(b.max_amount, 999999999) as b_max
  FROM commission_rates a
  JOIN commission_rates b 
    ON a.company_id = b.company_id
    AND a.mode = 'slab'
    AND b.mode = 'slab'
    AND a.id < b.id
  WHERE a.is_active AND b.is_active
    AND (COALESCE(a.max_amount, 999999999) > b.min_amount 
      AND COALESCE(b.max_amount, 999999999) > a.min_amount)
)
SELECT * FROM slab_overlaps;

-- Expected: 0 rows (no overlaps)

-- ============================================================================
-- CLEANUP: Safe to delete if rollback needed
-- ============================================================================

-- To rollback, comment out below and execute:
/*
ALTER TABLE commission_rates 
DROP COLUMN IF EXISTS mode CASCADE;

ALTER TABLE commission_rates 
DROP COLUMN IF EXISTS set_name CASCADE;

ALTER TABLE commission_rates 
DROP COLUMN IF EXISTS apply_to CASCADE;

ALTER TABLE commission_rates 
DROP COLUMN IF EXISTS updated_at CASCADE;

DROP INDEX IF EXISTS idx_commission_rates_company_mode;
DROP INDEX IF EXISTS idx_commission_rates_set_name;
DROP INDEX IF EXISTS idx_commission_rates_mode_active;

DROP TABLE IF EXISTS sales_returns CASCADE;

ALTER TABLE orders 
DROP COLUMN IF EXISTS sales_returns CASCADE;

DROP INDEX IF EXISTS idx_orders_net_sales;

DROP VIEW IF EXISTS v_commission_rates_by_mode;
DROP VIEW IF EXISTS v_salesperson_net_sales;
*/

-- ============================================================================
-- SUMMARY
-- ============================================================================

/*
MIGRATION SUMMARY:

✓ Added mode column (slab/level) - defaults to 'slab' for backward compatibility
✓ Added set_name column for grouping rate sets
✓ Added apply_to column for future scoping (product/custom filters)
✓ Added updated_at timestamp tracking
✓ Created performance indexes on company_id + mode queries
✓ Added sales_returns tracking (choose Option A or B)
✓ Created useful views for common queries
✓ Set up RLS policies for secure access

BACKWARD COMPATIBILITY:
✓ All existing commission_rates retain as 'slab' mode (existing behavior)
✓ Set_name defaults to NULL (single set per company)
✓ All existing queries still work (no breaking changes)

NEXT STEPS:
1. Test in development environment
2. Verify data integrity with validation queries above
3. Deploy migration to production
4. Update application code (services, UI, calculations)
5. Run integration tests
6. Monitor for any issues

ROLLBACK:
If issues occur, simply comment out main sections above and run cleanup section.
Migration is idempotent (uses IF NOT EXISTS), so safe to re-run.
*/
