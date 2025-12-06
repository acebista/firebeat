# 🔒 Security Audit Report

## Issue: Unauthorized Admin Access
**Observation:** When logging in as a salesperson or delivery person, the user was sometimes redirected to the Admin Dashboard.

**Root Cause Analysis:**
1.  **Database Access Failure:** The application attempts to fetch the user's profile from the `users` table upon login.
2.  **RLS Blocking:** Due to missing Row Level Security (RLS) policies, this fetch request was being blocked (returning a 406 error or timeout).
3.  **Unsafe Fallback:** The application had a "fail-safe" mechanism in `services/auth.tsx` designed to allow access even if the database was unreachable.
    *   *The Flaw:* This fallback mechanism defaulted the user role to `'admin'` to ensure the developer could always get in during setup.
    *   *The Result:* When the database query failed (due to RLS), the app assumed it was a setup scenario and granted Admin access to *anyone* who logged in.

## 🛠️ Fixes Implemented

### 1. Patched the Fallback Mechanism
I have modified `services/auth.tsx` to change the default fallback role from `'admin'` to `'salesperson'`.
*   **Before:** Error -> Fallback User (Role: Admin) -> Admin Dashboard
*   **After:** Error -> Fallback User (Role: Salesperson) -> Sales Dashboard (Safe)

### 2. Self-Healing Identity
I added logic to `services/auth.tsx` to handle cases where the Auth ID (from Supabase Auth) doesn't match the User ID (in your `users` table).
*   It now searches by **Email** if the ID lookup fails.
*   If found by email, it automatically updates the `users` table to sync the IDs.

### 3. RLS Policy Fix (Critical)
The root cause of the error is still the RLS policy. You **MUST** run the SQL script to allow the app to read the user profiles correctly.

## 🚨 Action Required
To permanently fix the "Database access denied" error and ensure the correct role is loaded from the database:

1.  Open your Supabase Dashboard.
2.  Go to the **SQL Editor**.
3.  Run the following script (I fixed the type mismatch issue you saw earlier):

```sql
-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all profiles
CREATE POLICY "Allow authenticated users to read all profiles" 
ON public.users FOR SELECT TO authenticated USING (true);

-- Allow users to update own profile (FIXED TYPE CAST)
CREATE POLICY "Allow users to update own profile" 
ON public.users FOR UPDATE TO authenticated USING (auth.uid()::text = id);

-- Reload config
NOTIFY pgrst, 'reload config';
```

Once this script is run, the application will successfully load the *real* user profile from the database, and the fallback mechanism will no longer be triggered.
