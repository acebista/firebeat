-- SIMPLIFIED SCHEMA FIXES
-- Run these one at a time in Supabase SQL Editor

-- ============================================
-- FIX 1: ORDERS.CUSTOMERID TO UUID
-- ============================================
-- Change orders.customerId from text to uuid
ALTER TABLE orders 
ALTER COLUMN "customerId" TYPE uuid USING "customerId"::uuid;


-- ============================================
-- FIX 2: TRIPS.ORDERIDS - TWO STEP PROCESS
-- ============================================

-- Step 2a: Rename old column
ALTER TABLE trips RENAME COLUMN "orderIds" TO "orderIds_old";

-- Step 2b: Create new column with correct type
ALTER TABLE trips ADD COLUMN "orderIds" text[];

-- Step 2c: Migrate data (run this separately if you have existing trips)
-- UPDATE trips 
-- SET "orderIds" = ARRAY(
--   SELECT jsonb_array_elements_text("orderIds_old")
-- )
-- WHERE "orderIds_old" IS NOT NULL;

-- Step 2d: Drop old column (optional - do this later after verifying)
-- ALTER TABLE trips DROP COLUMN "orderIds_old";


-- ============================================
-- FIX 3: ADD MISSING TRIP COLUMNS
-- ============================================
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "routeIds" text[];
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "routeNames" text[];
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "vehicleId" text;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "totalCases" numeric;


-- ============================================
-- FIX 4: REFRESH SCHEMA CACHE
-- ============================================
NOTIFY pgrst, 'reload schema';


-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check orders.customerId is now UUID
SELECT 
  column_name, 
  data_type
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name = 'customerId';
-- Should show: uuid


-- Check trips columns
SELECT 
  column_name, 
  data_type
FROM information_schema.columns 
WHERE table_name = 'trips'
  AND table_schema = 'public'
ORDER BY ordinal_position;
-- Should show orderIds as ARRAY


-- Test customer-order join
SELECT 
  o.id,
  o."customerName",
  c.name as actual_customer_name
FROM orders o
LEFT JOIN customers c ON o."customerId" = c.id
LIMIT 5;
-- Should work without error
