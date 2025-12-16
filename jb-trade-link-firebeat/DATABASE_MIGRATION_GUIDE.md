# Database Migration Guide - User Compensation Fields

**Status**: Ready to Execute  
**Time to Complete**: ~2 minutes  
**Date**: December 6, 2025

---

## Quick Start

Execute this SQL in your Supabase SQL Editor to add the compensation columns:

```sql
-- Add compensation fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS base_salary numeric;
ALTER TABLE users ADD COLUMN IF NOT EXISTS comp_plan_type text DEFAULT 'commission';
ALTER TABLE users ADD COLUMN IF NOT EXISTS commission_rate_set text;
```

---

## Step-by-Step Instructions

### 1. Open Supabase Dashboard
- Go to [app.supabase.com](https://app.supabase.com)
- Select your project

### 2. Navigate to SQL Editor
- Click **SQL Editor** in left sidebar
- Click **New Query** button

### 3. Copy & Paste Migration SQL
Copy the SQL below and paste it into the query editor:

```sql
-- Add compensation fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS base_salary numeric;
ALTER TABLE users ADD COLUMN IF NOT EXISTS comp_plan_type text DEFAULT 'commission';
ALTER TABLE users ADD COLUMN IF NOT EXISTS commission_rate_set text;
```

### 4. Execute the Query
- Click the **RUN** button (blue play icon)
- You should see: `✓ Success. No rows returned.`

### 5. Verify Columns Were Added
Navigate to: **Database** → **users** table → **Structure** tab

You should see these new columns:
- ✅ `base_salary` (numeric, nullable)
- ✅ `comp_plan_type` (text, default: 'commission')
- ✅ `commission_rate_set` (text, nullable)

---

## What These Columns Store

| Column | Type | Purpose | Default | Example |
|--------|------|---------|---------|---------|
| `base_salary` | numeric | Monthly base salary in ₹ | NULL | 20000 |
| `comp_plan_type` | text | Compensation plan type | 'commission' | 'fixed' or 'commission' |
| `commission_rate_set` | text | Reference to rate set | NULL | "company-001-rates" |

---

## After Migration

### Update RLS Policies (if needed)

Verify the RLS policy on the `users` table allows admins to:
1. **SELECT** compensation fields
2. **UPDATE** compensation fields

**Check these steps**:
1. Go to **Database** → **users** table
2. Click **Auth** tab
3. Verify there's a policy for admin role with:
   - ✅ SELECT permission
   - ✅ UPDATE permission

If using the default policy, it should work automatically. If you have custom policies, ensure they include these new columns.

### Test the Feature

#### 1. Access User Management
- Navigate to `/admin/users`
- Click "Edit" on any salesperson

#### 2. Set Compensation
- In the modal, find the **Compensation** section
- Set Plan Type: "Fixed / Salary"
- Set Base Salary: "20000"
- Click "Update Profile"

#### 3. Verify in Supabase
- Go to **Database** → **users** table → **Data** tab
- Find the user you just edited
- Verify the `base_salary` and `comp_plan_type` columns have values

#### 4. Test HR Panel
- Navigate to `/admin/hr`
- Verify the page loads without 400 errors
- You should see compensation data with the new salary values

---

## Troubleshooting

### Error: "Permission denied"
**Cause**: RLS policy preventing the operation  
**Fix**: 
1. Go to **users** table → **Auth** tab
2. Ensure there's a policy allowing your role to SELECT and UPDATE

### Error: "Column already exists"
**Cause**: The columns were already added  
**Fix**: This is fine! The `IF NOT EXISTS` clause prevents errors. Your database is ready.

### Columns not showing in table view
**Cause**: Browser cache or stale data  
**Fix**: Refresh the page (Cmd+R) in Supabase

---

## Alternative: Full Column Definitions

If you want more control over column properties, use this instead:

```sql
-- Add base_salary column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS base_salary numeric DEFAULT 0;

-- Add comp_plan_type column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS comp_plan_type text NOT NULL DEFAULT 'commission' 
CHECK (comp_plan_type IN ('fixed', 'commission'));

-- Add commission_rate_set column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS commission_rate_set text;

-- Optional: Add constraints or indexes
ALTER TABLE users 
ADD CONSTRAINT positive_salary CHECK (base_salary >= 0);

CREATE INDEX IF NOT EXISTS idx_users_comp_plan_type 
ON users(comp_plan_type);
```

---

## Rollback (if needed)

If you need to remove these columns (not recommended):

```sql
ALTER TABLE users DROP COLUMN IF EXISTS base_salary;
ALTER TABLE users DROP COLUMN IF EXISTS comp_plan_type;
ALTER TABLE users DROP COLUMN IF EXISTS commission_rate_set;
```

---

## Next Steps After Migration

1. ✅ **Database Migration** - Add columns (this document)
2. 🧪 **Manual Testing** - Test User Management and HR Panel
3. 📊 **Verify RLS Policies** - Ensure admin can read/write
4. 🚀 **Deploy** - Push to production

---

## Support

If you encounter any issues:

1. Check the Supabase error message in the SQL editor
2. Verify you have admin/owner access to the project
3. Ensure the `users` table exists and has proper RLS policies
4. Check the browser console (F12) for any JavaScript errors

---

**Migration Last Updated**: December 6, 2025  
**Estimated Time**: 2 minutes  
**Complexity**: Very Low ⭐
