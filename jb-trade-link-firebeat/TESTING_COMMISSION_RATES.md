# Commission Rate Management - Testing Guide

## Quick Test Checklist

### Setup
```bash
# 1. Build the project
cd /Users/babi/Downloads/firebeat-main/jb-trade-link-firebeat
npm run build

# 2. Start the development server
npm run dev

# 3. Login as admin
# Navigate to http://localhost:5173/admin/companies
```

### Test 1: Navigate to Companies Page
- [ ] Go to `/admin/companies`
- [ ] See list of companies
- [ ] Three action buttons visible in "Actions" column:
  - Edit (pencil icon)
  - **Settings (gear icon) ← NEW**
  - Toggle status (X or checkmark)

### Test 2: Open Commission Rates Manager
- [ ] Click Settings icon for any company
- [ ] Modal opens with title "Commission Rates - [Company Name]"
- [ ] Modal is large and readable
- [ ] Content depends on existing rates:
  - **If rates exist**: Table with columns (Min Amount, Max Amount, Rate %, Status, Actions)
  - **If no rates**: Empty state with "Add First Rate" button

### Test 3: Add a New Commission Rate
```
Company: Parle (example)
Rate 1: 0 to 1000 @ 3%
```

**Steps**:
- [ ] Click "Add Rate" button
- [ ] Form modal appears
- [ ] Enter values:
  - Min Amount: 0
  - Max Amount: 1000
  - Rate %: 3
- [ ] Preview shows: "0 to 1000 at 3%"
- [ ] Click "Add Rate"
- [ ] Success toast appears: "Commission rate added"
- [ ] Table refreshes with new rate
- [ ] Modal stays open for adding more rates
- [ ] Click "Cancel" to close modal

**Verify in Database**:
```sql
SELECT * FROM commission_rates 
WHERE company_id = 'parle' 
AND is_active = true
ORDER BY min_amount;

-- Expected result:
-- id | company_id | min_amount | max_amount | rate_pct | is_active
-- xxx | parle      | 0          | 1000       | 3        | true
```

### Test 4: Add Another Rate (Test Overlap Detection)
```
Rate 2: 1000 to 5000 @ 4%
```

**Steps**:
- [ ] Click "Add Rate" again
- [ ] Enter:
  - Min Amount: 1000
  - Max Amount: 5000
  - Rate %: 4
- [ ] Click "Add Rate"
- [ ] Succeeds - overlapping boundaries are allowed
- [ ] Two rates now visible in table

### Test 5: Validation - Test Overlap Error
```
Try to add invalid rate: 800 to 3000 @ 3.5%
(This overlaps with existing 1000-5000 rate)
```

**Steps**:
- [ ] Click "Add Rate"
- [ ] Enter values that overlap:
  - Min Amount: 800
  - Max Amount: 3000
  - Rate %: 3.5
- [ ] Click "Add Rate"
- [ ] **ERROR SHOWN**: "Range overlaps with existing rate: 1000 - 5000"
- [ ] Form doesn't close
- [ ] User can fix and try again

### Test 6: Edit a Rate
- [ ] Click Edit icon (pencil) for any rate
- [ ] Form modal opens with current values populated
- [ ] Change Rate % to different value (e.g., 3 → 3.5)
- [ ] Click "Update Rate"
- [ ] Toast: "Commission rate updated"
- [ ] Table refreshes with new value

### Test 7: Delete a Rate
- [ ] Click Delete icon (trash) for any rate
- [ ] Confirm dialog: "Are you sure you want to delete this commission rate?"
- [ ] Click OK
- [ ] Toast: "Commission rate deleted"
- [ ] Rate removed from table

**Verify in Database** (soft delete):
```sql
SELECT * FROM commission_rates 
WHERE company_id = 'parle';

-- The deleted rate should have is_active = false
```

### Test 8: Multiple Companies
- [ ] Add rates to different companies (e.g., Parle, ITC, Nestlé)
- [ ] Verify each company has separate rate slabs
- [ ] Rates from one company don't appear for others

### Test 9: HRPanel Integration
```
Navigate to HR Panel to verify commission calculations work
```

- [ ] Go to `/admin/hr`
- [ ] Select date range and salesperson
- [ ] Compensation table shows commission calculations
- [ ] Commissions calculated using rates from company
- [ ] Verify calculations are correct:
  
**Example**:
```
Sales: ₹15,000 from Parle
Rate 1: 0-1000 @ 3% = ₹30
Rate 2: 1000-5000 @ 4% = ₹160
Rate 3: 5000+ @ 5% = ₹500
Total Commission: ₹690
```

### Test 10: Build Verification
```bash
# Ensure build still passes
npm run build

# Expected output:
# ✓ 2840 modules transformed
# ✓ built in ~4-5s
# dist/index-*.js ... 1,753 kB gzip: 491 kB
```

---

## Common Issues & Solutions

### Issue: "Module not found" error
**Solution**: Run `npm run build` to refresh module cache

### Issue: Settings button not visible
**Solution**: 
- Clear browser cache
- Restart dev server
- Check that Companies.tsx has Settings import

### Issue: Rates not saving
**Solution**:
- Check browser console for errors
- Verify Supabase connection
- Check if commission_rates table exists in database
- Verify Row Level Security (RLS) policies allow writes

### Issue: Overlap validation not working
**Solution**:
- Verify the validateForm() function is being called
- Check console for validation errors
- Make sure existing rates are loaded before validating

---

## Expected Behavior Summary

| Action | Before | After |
|--------|--------|-------|
| View companies | ✅ Works | ✅ Works |
| Edit company | ✅ Works | ✅ Works |
| Add rates | ❌ Not on this page | ✅ NEW |
| Edit rates | ❌ Not on this page | ✅ NEW |
| Delete rates | ❌ Not on this page | ✅ NEW |
| Calculate commission | ✅ In HR Panel | ✅ Still works |

---

## Performance Expectations

- Page load: < 1 second
- Add rate: < 500ms
- Edit rate: < 500ms
- Delete rate: < 300ms
- Form validation: < 50ms
- Overlap check: < 10ms (for typical 3-5 rates per company)

---

## Success Criteria

✅ All tests pass
✅ No console errors
✅ Build passes
✅ Commission calculations still work
✅ Rates persist after page refresh
✅ Different companies have separate rates
✅ Overlap validation prevents invalid ranges
✅ Toast notifications appear on success/error
✅ UI is responsive and user-friendly
