# ⚠️ CRITICAL: Fix for "Column Not Found" Error

## The Issue
You are seeing this error:
`Could not find the 'password' column of 'users' in the schema cache`

This happens because even though you might have added the column, **Supabase's API cache hasn't updated yet**, or the column might not be in the correct table/schema.

## ✅ The Fix

I have created a SQL script that will:
1. Ensure the `password` column exists in the correct table (`public.users`).
2. **Force Supabase to reload its schema cache**.

### 🚀 Step 1: Run the SQL Script
1. Go to your **Supabase Dashboard**.
2. Go to the **SQL Editor**.
3. Copy and paste the content of the file `ADD_PASSWORD_COLUMN.sql` (I created this file in your project).
4. Click **RUN**.

**Content of the script:**
```sql
-- Add password column if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "password" text;

-- Force schema cache reload (CRITICAL STEP)
NOTIFY pgrst, 'reload config';
```

### 🚀 Step 2: Refresh Your App
After running the script:
1. Refresh your browser page.
2. Try updating the user password again.

---

## 📝 Code Updates Completed
I have also updated your code to handle the password field correctly:
1. **Updated `types.ts`**: Added `password` field to `User` interface.
2. **Updated `Users.tsx`**: 
   - Removed `any` casts (better type safety).
   - Logic to only send password if it's not empty is preserved.

**Please run the SQL script now to fix the error!**
