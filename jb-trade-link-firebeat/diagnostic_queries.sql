-- Diagnostic Queries for Remaining Issues
-- Run these in Supabase SQL Editor to diagnose problems

-- ============================================
-- 1. CHECK TRIPS TABLE SCHEMA
-- ============================================
-- This will show actual column names in trips table
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'trips'
ORDER BY ordinal_position;

-- Expected columns: routeIds, routeNames (as text arrays)
-- If different, code needs to be updated to match


-- ============================================
-- 2. CHECK SALES USERS FOR FILTER
-- ============================================
-- This will show if any sales users exist
SELECT 
  id,
  name,
  email,
  role,
  "isActive",
  "createdAt"
FROM users 
WHERE role = 'sales'
ORDER BY name;

-- Should return at least one user
-- If empty, create a sales user first


-- ============================================
-- 3. CHECK ORDERS HAVE ITEMS
-- ============================================
-- This will show if orders have items populated
SELECT 
  id,
  "customerName",
  "totalAmount",
  discount,
  jsonb_array_length(items) as item_count,
  items
FROM orders 
WHERE date = CURRENT_DATE
LIMIT 5;

-- items should be a JSONB array with objects
-- Each item should have: productId, productName, companyId, companyName, qty, rate, total


-- ============================================
-- 4. CHECK ITEM STRUCTURE IN ORDERS
-- ============================================
-- This will show the structure of items in orders
SELECT 
  id,
  jsonb_pretty(items) as items_structure
FROM orders 
WHERE items IS NOT NULL 
  AND jsonb_array_length(items) > 0
LIMIT 1;

-- Verify each item has:
-- - productId
-- - productName  
-- - companyId
-- - companyName
-- - qty
-- - rate
-- - total


-- ============================================
-- 5. CHECK ORDERS TABLE SCHEMA
-- ============================================
-- Verify orders table has all required columns
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- Should have: id, customerId, customerName, salespersonId, salespersonName,
--              date, totalItems, totalAmount, discount, status, items, remarks


-- ============================================
-- 6. CHECK USERS TABLE SCHEMA
-- ============================================
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;


-- ============================================
-- 7. TEST DISCOUNT CALCULATION
-- ============================================
-- Verify discount is stored correctly
SELECT 
  id,
  "customerName",
  "totalAmount",
  discount,
  ("totalAmount" + COALESCE(discount, 0)) as subtotal,
  CASE 
    WHEN ("totalAmount" + COALESCE(discount, 0)) > 0 
    THEN ROUND((discount / ("totalAmount" + discount) * 100)::numeric, 2)
    ELSE 0
  END as discount_pct
FROM orders
WHERE discount > 0
ORDER BY date DESC
LIMIT 10;

-- Should show:
-- - totalAmount: Final amount (after discount)
-- - discount: Discount amount
-- - subtotal: Original amount (before discount)
-- - discount_pct: Calculated percentage


-- ============================================
-- 8. CHECK FOR ORPHANED DATA
-- ============================================
-- Check if orders reference non-existent customers
SELECT 
  o.id,
  o."customerName",
  o."customerId",
  c.id as customer_exists
FROM orders o
LEFT JOIN customers c ON o."customerId" = c.id
WHERE c.id IS NULL
LIMIT 10;

-- Should return 0 rows
-- If rows returned, some orders have invalid customer IDs


-- ============================================
-- 9. CHECK RECENT ORDERS
-- ============================================
-- See most recent orders to verify data is being saved
SELECT 
  id,
  "customerName",
  "salespersonName",
  date,
  "totalItems",
  "totalAmount",
  discount,
  status,
  jsonb_array_length(items) as item_count
FROM orders
ORDER BY date DESC, id DESC
LIMIT 10;


-- ============================================
-- 10. FIX MISSING COLUMNS (IF NEEDED)
-- ============================================
-- Uncomment and run if columns are missing:

-- Add discount column if missing:
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount numeric DEFAULT 0;

-- Add GPS column if missing:
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS "GPS" text;

-- Add time column if missing:
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS time timestamp with time zone;

-- Add routeIds to trips if missing:
-- ALTER TABLE trips ADD COLUMN IF NOT EXISTS "routeIds" text[];

-- Add routeNames to trips if missing:
-- ALTER TABLE trips ADD COLUMN IF NOT EXISTS "routeNames" text[];
