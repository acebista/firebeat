# ✅ RLS Policy Fix Instructions

## The Error
You encountered: `ERROR: 42883: operator does not exist: uuid = text`

**Reason:** 
- `auth.uid()` returns a **UUID** type.
- Your `users` table uses **Text** for the `id` column.
- SQL cannot automatically compare these two different types.

## 🚀 The Fix
I have updated `fix_rls_policies.sql` to explicitly cast the UUID to text:
`auth.uid()::text = id`

## Action Required
Please run the updated script in your Supabase SQL Editor:

```sql
-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all user profiles
CREATE POLICY "Allow authenticated users to read all profiles" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow users to update their own profile
-- FIXED: Added ::text cast to match your table schema
CREATE POLICY "Allow users to update own profile" 
ON public.users 
FOR UPDATE 
TO authenticated 
USING (auth.uid()::text = id);

-- Force schema cache reload
NOTIFY pgrst, 'reload config';
```

After running this, the error will be gone and your app should load correctly!
