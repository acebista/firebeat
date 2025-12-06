-- CRITICAL SCHEMA FIXES
-- Run these in Supabase SQL Editor to fix type mismatches

-- ============================================
-- 1. FIX ORDERS.CUSTOMERID TYPE MISMATCH
-- ============================================
-- Problem: customers.id is UUID, but orders.customerId is text
-- This causes the join error: "operator does not exist: text = uuid"

-- Option A: Change orders.customerId to UUID (RECOMMENDED)
ALTER TABLE orders 
ALTER COLUMN "customerId" TYPE uuid USING "customerId"::uuid;

-- Option B: If above fails due to invalid UUIDs, first fix the data:
-- UPDATE orders SET "customerId" = gen_random_uuid()::text WHERE "customerId" IS NULL OR "customerId" = '';
-- Then run Option A


-- ============================================
-- 2. FIX TRIPS.ORDERIDS TYPE
-- ============================================
-- Problem: Code expects text[], but database has jsonb

-- Option A: Change to text array (matches code)
ALTER TABLE trips 
ALTER COLUMN "orderIds" TYPE text[] USING 
  CASE 
    WHEN "orderIds" IS NULL THEN ARRAY[]::text[]
    WHEN jsonb_typeof("orderIds") = 'array' THEN 
      ARRAY(SELECT jsonb_array_elements_text("orderIds"))
    ELSE ARRAY[]::text[]
  END;

-- Option B: Add missing columns if they don't exist
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "routeIds" text[];
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "routeNames" text[];
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "vehicleId" text;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "totalCases" numeric;


-- ============================================
-- 3. VERIFY FIXES
-- ============================================
-- Check customers and orders join now works
SELECT 
  o.id,
  o."customerName",
  c.name as customer_name_from_table
FROM orders o
LEFT JOIN customers c ON o."customerId" = c.id
LIMIT 5;

-- Should return rows without error


-- ============================================
-- 4. CHECK TRIPS SCHEMA
-- ============================================
SELECT 
  column_name, 
  data_type
FROM information_schema.columns 
WHERE table_name = 'trips'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Should show:
-- orderIds: ARRAY or text[]
-- routeIds: ARRAY or text[]
-- routeNames: ARRAY or text[]


-- ============================================
-- 5. FIX USERS TABLE (if needed)
-- ============================================
-- You have both auth.users and public.users
-- Make sure public.users has correct schema

-- Check which users table you're using
SELECT 
  table_schema,
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'users'
  AND column_name IN ('id', 'name', 'email', 'role', 'isActive')
  AND table_schema = 'public'
ORDER BY table_schema, ordinal_position;

-- If public.users.id is UUID but code expects text:
-- ALTER TABLE public.users ALTER COLUMN id TYPE text;
-- (But this might break auth - be careful!)


-- ============================================
-- 6. REFRESH SUPABASE SCHEMA CACHE
-- ============================================
-- After making changes, refresh the schema cache
NOTIFY pgrst, 'reload schema';

-- Or restart your Supabase project from dashboard
