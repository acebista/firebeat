-- =====================================================
-- CLEANUP DUPLICATE RLS POLICIES
-- Run this to remove conflicting old policies
-- =====================================================

-- The issue: You have multiple policies on users table
-- Some are restrictive (only allow own profile updates)
-- Some are permissive (allow all updates)
-- This causes conflicts!

-- =====================================================
-- REMOVE OLD RESTRICTIVE POLICIES FROM USERS TABLE
-- =====================================================

-- These policies are TOO RESTRICTIVE and conflict with the new permissive policy
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile by email" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to read all profiles" ON public.users;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON public.users;

-- Keep only these two policies for users:
-- 1. "Allow authenticated users full access to users" (for all operations)
-- 2. "Enable update for admins" (additional admin check - this is OK to keep)

-- =====================================================
-- REMOVE DUPLICATE POLICIES FROM ORDERS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.orders;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON public.orders;

-- Keep only: "Allow authenticated users full access to orders"

-- =====================================================
-- VERIFY CLEANUP
-- =====================================================

SELECT 
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- EXPECTED RESULT AFTER CLEANUP:
-- =====================================================
-- Each table should have ONLY ONE policy (except users which has 2):
--
-- companies:    1 policy - "Allow authenticated users full access to companies"
-- customers:    1 policy - "Allow authenticated users full access to customers"
-- damage_logs:  1 policy - "Allow authenticated users full access to damage_logs"
-- orders:       1 policy - "Allow authenticated users full access to orders"
-- products:     1 policy - "Allow authenticated users full access to products"
-- purchases:    1 policy - "Allow authenticated users full access to purchases"
-- returns:      1 policy - "Allow authenticated users full access to returns"
-- trips:        1 policy - "Allow authenticated users full access to trips"
-- users:        2 policies:
--               - "Allow authenticated users full access to users"
--               - "Enable update for admins" (optional, can keep or remove)
--
-- =====================================================

-- =====================================================
-- OPTIONAL: Remove the admin-only policy if you want
-- =====================================================
-- If you want ALL authenticated users to update users (not just admins),
-- uncomment this line:

-- DROP POLICY IF EXISTS "Enable update for admins" ON public.users;

-- =====================================================
-- TEST AFTER CLEANUP
-- =====================================================
-- After running this script:
-- 1. Refresh your application
-- 2. Try to update a user
-- 3. Should work without 403 errors!
-- =====================================================
