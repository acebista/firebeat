-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- DROP existing policies to avoid errors
DROP POLICY IF EXISTS "Allow authenticated users to read all profiles" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;

-- Create policy to allow authenticated users to read all user profiles
CREATE POLICY "Allow authenticated users to read all profiles" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow users to update their own profile
CREATE POLICY "Allow users to update own profile" 
ON public.users 
FOR UPDATE 
TO authenticated 
USING (auth.uid()::text = id);

-- Create policy to allow admins to do everything (optional, but good practice)
-- Note: This assumes you have a way to identify admins in the auth.users metadata or similar, 
-- but for now, the read policy above covers most needs. 
-- If you need strict admin-only write access, you'd need a more complex policy.

-- Force schema cache reload
NOTIFY pgrst, 'reload config';
