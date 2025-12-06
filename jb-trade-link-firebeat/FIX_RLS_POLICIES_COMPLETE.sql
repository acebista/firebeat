-- =====================================================
-- COMPLETE RLS POLICY FIX FOR ALL TABLES
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. DROP ALL EXISTING POLICIES
-- =====================================================

-- Users table
DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to read all users" ON public.users;
DROP POLICY IF EXISTS "Allow users to update their own data" ON public.users;
DROP POLICY IF EXISTS "Allow admins to update all users" ON public.users;

-- Products table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.products;

-- Customers table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.customers;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.customers;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.customers;

-- Orders table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.orders;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.orders;

-- Companies table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.companies;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.companies;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.companies;

-- Trips table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.trips;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.trips;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.trips;

-- Purchases table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.purchases;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.purchases;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.purchases;

-- Returns table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.returns;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.returns;

-- Damage logs table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.damage_logs;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.damage_logs;

-- 2. ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.damage_logs ENABLE ROW LEVEL SECURITY;

-- 3. CREATE PERMISSIVE POLICIES FOR AUTHENTICATED USERS
-- =====================================================
-- These policies allow full access for authenticated users
-- In production, you should restrict based on roles

-- USERS TABLE
CREATE POLICY "Allow authenticated users full access to users"
ON public.users
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- PRODUCTS TABLE
CREATE POLICY "Allow authenticated users full access to products"
ON public.products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- CUSTOMERS TABLE
CREATE POLICY "Allow authenticated users full access to customers"
ON public.customers
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ORDERS TABLE
CREATE POLICY "Allow authenticated users full access to orders"
ON public.orders
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- COMPANIES TABLE
CREATE POLICY "Allow authenticated users full access to companies"
ON public.companies
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- TRIPS TABLE
CREATE POLICY "Allow authenticated users full access to trips"
ON public.trips
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- PURCHASES TABLE
CREATE POLICY "Allow authenticated users full access to purchases"
ON public.purchases
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- RETURNS TABLE
CREATE POLICY "Allow authenticated users full access to returns"
ON public.returns
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- DAMAGE_LOGS TABLE
CREATE POLICY "Allow authenticated users full access to damage_logs"
ON public.damage_logs
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. VERIFY POLICIES
-- =====================================================
-- Run this to check all policies are created correctly

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- EXPECTED OUTPUT:
-- You should see one policy per table with:
-- - permissive = 'PERMISSIVE'
-- - roles = {authenticated}
-- - cmd = 'ALL'
-- - qual = 'true'
-- - with_check = 'true'
-- =====================================================

-- 5. TEST THE POLICIES
-- =====================================================
-- After running this script, test by:
-- 1. Logging into your app
-- 2. Try to update a user
-- 3. Should work without 403 errors

-- =====================================================
-- PRODUCTION HARDENING (DO THIS LATER)
-- =====================================================
-- The above policies are PERMISSIVE for development.
-- For production, implement role-based policies like:

/*
-- Example: Admin-only user updates
CREATE POLICY "Only admins can update users"
ON public.users
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Example: Sales can only see their own orders
CREATE POLICY "Sales can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  salespersonId = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'delivery')
  )
);
*/

-- =====================================================
-- NOTES:
-- 1. This script gives full access to authenticated users
-- 2. This is suitable for development and internal tools
-- 3. For production with external users, add role-based restrictions
-- 4. Always test in a staging environment first
-- =====================================================
