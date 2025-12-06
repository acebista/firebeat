-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- DROP existing policies to avoid errors
DROP POLICY IF EXISTS "Allow authenticated users to read all profiles" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile by email" ON public.users;

-- 1. Allow reading all profiles (Required for login & lists)
CREATE POLICY "Allow authenticated users to read all profiles" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (true);

-- 2. Allow updating own profile by ID (Standard case)
CREATE POLICY "Allow users to update own profile" 
ON public.users 
FOR UPDATE 
TO authenticated 
USING (auth.uid()::text = id);

-- 3. Allow updating own profile by EMAIL (Self-Healing case)
-- This allows a user to "claim" a row if the email matches their Auth email
-- This is critical for the ID sync logic to work
CREATE POLICY "Allow users to update own profile by email" 
ON public.users 
FOR UPDATE 
TO authenticated 
USING (email = (select email from auth.users where id = auth.uid()));

-- Force schema cache reload
NOTIFY pgrst, 'reload config';
