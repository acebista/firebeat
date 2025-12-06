# 🚀 Quick Start Guide

## Current Status
✅ Service file renamed (`firestore.ts` → `db.ts`)  
✅ Dashboard connected to real data  
✅ Auth timeout added (prevents infinite loading)  
✅ Smart migration system ready  
✅ Data parsed: 17 companies, 208 products, 2,026 customers, 12,237 orders  

## Next Steps (In Order)

### 1️⃣ Fix Login Issue (5 minutes)
**Problem**: Login hangs due to RLS policies  
**Solution**: Run this in Supabase SQL Editor:

```sql
-- Quick fix: Temporarily disable RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Or use the full fix in fix_rls_policies.sql
```

**Then**: Refresh browser and login with `ace.bista@gmail.com` / `Sachu123!`

---

### 2️⃣ Apply Database Schema (5 minutes)
**Location**: Supabase Dashboard → SQL Editor  
**File**: `supabase_schema.sql`  
**Action**: Copy contents, paste, and run

**Verify**: Check that these tables exist:
- users
- customers  
- products
- companies
- orders
- trips
- purchases
- returns
- return_items
- damage_logs

---

### 3️⃣ Run Migration (10 minutes)
**URL**: `http://localhost:5173/#/admin/migration`  
**Action**: Click "Start Migration"  
**Wait**: ~10 minutes for 12,237 orders

**Expected Result**:
```
✅ Companies: 17 imported
✅ Products: 208 imported  
✅ Customers: 2,026 imported (deduplicated)
✅ Orders: 12,237 imported
```

---

### 4️⃣ Verify Migration (5 minutes)
Run in Supabase SQL Editor:

```sql
-- Check counts
SELECT 
  (SELECT COUNT(*) FROM companies) as companies,
  (SELECT COUNT(*) FROM products) as products,
  (SELECT COUNT(*) FROM customers) as customers,
  (SELECT COUNT(*) FROM orders) as orders;

-- Should show:
-- companies: 17
-- products: 208
-- customers: ~2,026
-- orders: 12,237
```

---

## 🆘 Quick Fixes

### Can't Login
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### Migration Fails
1. Check browser console (F12)
2. Verify RLS policies are disabled
3. Check network connectivity

### App Shows "Loading..."
- Wait 5 seconds (timeout will trigger)
- Or refresh browser (Cmd+Shift+R)

---

## 📚 Documentation

- **Migration Details**: `MIGRATION_GUIDE.md`
- **Migration Summary**: `MIGRATION_SUMMARY.md`
- **Production Checklist**: `PRODUCTION_CHECKLIST.md`
- **RLS Fix**: `fix_rls_policies.sql`

---

## 🎯 Success Checklist

- [ ] Can login successfully
- [ ] Dashboard shows real data
- [ ] Migration completed without errors
- [ ] Customer count is ~2,026
- [ ] Orders count is 12,237
- [ ] Can view products page
- [ ] Can view customers page
- [ ] Can view orders page

---

## 🔗 Quick Links

- **Admin Dashboard**: `http://localhost:5173/#/admin/dashboard`
- **Migration Page**: `http://localhost:5173/#/admin/migration`
- **Test Page**: `http://localhost:5173/#/test`
- **Supabase Dashboard**: `https://supabase.com/dashboard`

---

## 💡 Tips

1. **Always check browser console** for detailed errors
2. **RLS policies** are the #1 cause of issues
3. **Migration is idempotent** - safe to re-run
4. **Backup before migration** (Supabase auto-backs up daily)

---

**Ready?** Start with Step 1️⃣ above! 🚀
