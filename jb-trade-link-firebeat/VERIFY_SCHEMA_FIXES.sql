-- VERIFY AND FIX REMAINING SCHEMA ISSUES
-- Run this to check if previous fixes were applied

-- ============================================
-- 1. CHECK CURRENT SCHEMA
-- ============================================

-- Check trips table columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'trips' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Expected to see: routeIds, routeNames, vehicleId, totalCases


-- ============================================
-- 2. IF COLUMNS ARE MISSING, ADD THEM
-- ============================================

-- Add all missing columns to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "routeIds" text[];
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "routeNames" text[];  
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "vehicleId" text;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "totalCases" numeric;

-- Verify orderIds is text array (not jsonb)
-- If still jsonb, run these:
-- ALTER TABLE trips RENAME COLUMN "orderIds" TO "orderIds_old";
-- ALTER TABLE trips ADD COLUMN "orderIds" text[];


-- ============================================
-- 3. REFRESH SCHEMA CACHE (CRITICAL!)
-- ============================================

-- This tells Supabase to reload the schema
NOTIFY pgrst, 'reload schema';

-- IMPORTANT: After running this, also:
-- 1. Go to Supabase Dashboard
-- 2. Settings → Database
-- 3. Click "Restart" button
-- OR wait 5 minutes for cache to refresh automatically


-- ============================================
-- 4. VERIFY FIXES WORKED
-- ============================================

-- This should show routeIds as ARRAY type
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'trips' 
  AND column_name IN ('routeIds', 'routeNames', 'vehicleId', 'totalCases', 'orderIds');


-- ============================================
-- 5. CHECK ORDERS SCHEMA
-- ============================================

-- Verify customerId is UUID
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name = 'customerId';

-- Should show: uuid
-- If still text, run:
-- ALTER TABLE orders ALTER COLUMN "customerId" TYPE uuid USING "customerId"::uuid;
