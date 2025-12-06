# Testing Guide - Critical Fixes

## Test 1: Product Creation (Issue #1: Missing ID)

### Prerequisites
- Logged in as admin
- Navigate to Admin → Products

### Test Steps

1. **Add New Product**
   - Click "Add Product" button
   - Fill in form:
     - Product Name: "Test Product A"
     - Company: Select any company
     - Base Rate: 100
     - Discounted Rate: 80
     - Order Multiple: 5
     - Leave other fields as default
   - Click "Save Product"

2. **Verify Success**
   - ✅ Toast shows "Product added successfully"
   - ✅ Modal closes
   - ✅ Product appears in table immediately
   - ✅ Product has all fields populated
   - ✅ No console errors

3. **Verify in Supabase**
   - Open Supabase dashboard
   - Check `products` table
   - Verify new product has:
     - `id` with prefix "prod_" (e.g., "prod_a1b2c3d4")
     - All required fields populated
     - `currentStock` = 0
     - `secondaryAvailable` = false

### Expected Behavior
- Product saves immediately
- No loading delays
- Button shows "Save Product" (not "Saving...")

---

## Test 2: Form Validation (Issue #2: Schema Mismatches)

### Prerequisites
- Logged in as admin
- Navigate to Admin → Products
- Click "Add Product"

### Test 2.1: Missing Required Fields

1. **Leave Required Fields Empty**
   - Product Name: (empty)
   - Company: (not selected)
   - Base Rate: (empty)
   - Discounted Rate: (empty)
   - Click "Save Product"

2. **Verify Validation Errors**
   - ✅ Toast shows "Please fix validation errors"
   - ✅ Error messages appear under each field:
     - "Product name must be at least 2 characters"
     - "Company is required"
     - "Base rate must be non-negative"
     - "Discounted rate must be non-negative"
   - ✅ Modal stays open
   - ✅ Form data preserved

### Test 2.2: Invalid Numeric Values

1. **Enter Invalid Numbers**
   - Base Rate: "abc" (non-numeric)
   - Discounted Rate: -50 (negative)
   - Order Multiple: 0 (invalid)
   - Click "Save Product"

2. **Verify Validation Errors**
   - ✅ Toast shows "Please fix validation errors"
   - ✅ Error messages appear:
     - "Base rate must be non-negative"
     - "Discounted rate must be non-negative"
     - "Order multiple must be at least 1"
   - ✅ No attempt to save to Supabase

### Test 2.3: Secondary Scheme Fields

1. **Enable Secondary Scheme**
   - Find "Enable Scheme" checkbox in Schemes section
   - Click to enable
   - Fill in fields:
     - Secondary Disc %: 15
     - Qualifying Qty: 100
   - Click "Save Product"

2. **Verify Saves Successfully**
   - ✅ Toast shows success
   - ✅ Product appears in table
   - ✅ Supabase has:
     - `secondaryAvailable` = true
     - `secondaryDiscountPct` = 15
     - `secondaryQualifyingQty` = 100

---

## Test 3: Hard Refresh Session Preservation (Issue #3: Logout on Refresh)

### Prerequisites
- None (can be logged in or out)

### Test 3.1: Hard Refresh While Logged In

1. **Login to App**
   - Enter valid credentials
   - Click Sign In
   - ✅ Should see dashboard

2. **Perform Hard Refresh**
   - Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   - Wait 2-3 seconds

3. **Verify Session Preserved**
   - ✅ Loading overlay shows "Checking session..."
   - ✅ After loading completes, still logged in
   - ✅ Dashboard is visible (not redirected to login)
   - ✅ User info in header shows correct name/role

### Test 3.2: Hard Refresh While Logged Out

1. **Logout from App**
   - Click user menu
   - Click "Logout"
   - ✅ Redirected to login page

2. **Perform Hard Refresh**
   - Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   - Wait 2-3 seconds

3. **Verify Logout Persisted**
   - ✅ Still at login page
   - ✅ No unexpected redirects
   - ✅ Can login normally

### Test 3.3: Browser Tab Refresh (Soft Refresh)

1. **Login and Perform Soft Refresh**
   - Login to app
   - Press Ctrl+R (or Cmd+R on Mac)
   - Wait for page reload

2. **Verify Session Preserved**
   - ✅ Still logged in
   - ✅ No redirect to login
   - ✅ Loading overlay appears briefly

---

## Test 4: Inactivity Timeout (Bonus: 3-Hour Logout)

### Prerequisites
- Need to modify timeout for testing (default: 3 hours)
- Logged in as admin

### Test 4.1: Quick Timeout Test (For Development)

1. **Modify Timeout Value**
   - Edit: `services/auth/AuthProvider.tsx`
   - Find: `const INACTIVITY_TIMEOUT = 3 * 60 * 60 * 1000;`
   - Change to: `const INACTIVITY_TIMEOUT = 30 * 1000;` (30 seconds for testing)

2. **Rebuild and Test**
   - Run: `npm run build`
   - Login to app
   - Don't interact with app for 30 seconds
   - ✅ Toast notification appears: "User inactive for 3 hours, logging out..."
   - ✅ Redirected to login page

3. **Restore Original Timeout**
   - Change back to: `const INACTIVITY_TIMEOUT = 3 * 60 * 60 * 1000;`

### Test 4.2: Activity Resets Timer

1. **With Modified Timeout (30 seconds)**
   - Login to app
   - Wait 10 seconds
   - Move mouse or press keyboard (generate activity)
   - Wait 10 more seconds
   - Still logged in? ✅ Yes
   - Wait 20 more seconds (total 40 from start)
   - ✅ Timer reset by activity, still logged in

---

## Test 5: Error Messages and Edge Cases

### Test 5.1: Network Error Handling

1. **Add Product with Network Issue**
   - Open DevTools → Network → Offline
   - Try to save product
   - ✅ Toast shows error message
   - ✅ Button shows "Save Product" (not stuck on "Saving...")

2. **Restore Network and Retry**
   - Turn network back on
   - Click Save again
   - ✅ Should work normally

### Test 5.2: Duplicate Product Name

1. **Create Product**
   - Add "Test Product X" from company "ABC"
   - ✅ Saves successfully

2. **Create Duplicate**
   - Add another "Test Product X" from company "ABC"
   - ✅ Should allow (same name, same company is valid)
   - Check Supabase: ✅ Both have different IDs

### Test 5.3: Edit Existing Product

1. **Find Product in Table**
   - Search for "Test Product A"
   - Click Edit (pencil icon)

2. **Modify and Save**
   - Change Base Rate to 150
   - Click "Save Product"
   - ✅ Toast shows "Product updated successfully"
   - ✅ Table updates with new price

3. **Verify Edit in Supabase**
   - Same ID as before (not created new)
   - Base Rate updated to 150

---

## Browser Console Checks

### Open DevTools Console (F12)

### Expected: No Errors
```
✅ No red errors
✅ No "undefined" warnings
✅ No "Cannot read property" messages
```

### Expected: Informational Logs (can be present)
```
✅ "Boot session error" (only if actually an error)
✅ "Checking session..." (during boot)
✅ "User inactive for 3 hours" (only after timeout)
```

### Not Expected
```
❌ "Property 'isInitialized' is missing"
❌ "Cannot read property 'id' of undefined"
❌ "Upsert failed" or duplicate key errors
❌ "ZodError" validation errors that weren't shown to user
```

---

## Supabase Verification

### Check Products Table

1. **Navigate to Supabase Dashboard**
   - Go to your project
   - Click "Table Editor"
   - Select "products"

2. **Verify Recent Products**
   - All new products have `id` starting with "prod_"
   - All required fields are present:
     - `name`, `companyId`, `baseRate`, `discountedRate`
     - `currentStock`, `stockOut`, `isActive`
     - `secondaryAvailable`, `discountEditable`
   - No products with `null` for required fields

3. **Check Sample Rows**
   | id | name | baseRate | discountedRate | currentStock | secondaryAvailable |
   |----|------|----------|----------------|--------------|-------------------|
   | prod_a1b2 | Test A | 100 | 80 | 0 | false |
   | prod_c3d4 | Test B | 200 | 150 | 50 | true |

---

## Manual Test Checklist

- [ ] Product created successfully with auto-generated ID
- [ ] Form validation catches missing/invalid fields
- [ ] Validation errors displayed to user
- [ ] Hard refresh preserves valid session
- [ ] Hard refresh confirms logout when no session
- [ ] Logout clears all auth data
- [ ] Inactivity timeout works (after modifying duration)
- [ ] No console errors
- [ ] Supabase has correct data with proper IDs
- [ ] Product edit preserves ID
- [ ] Network errors handled gracefully
- [ ] Build completes with 0 errors

---

## Quick Reference: Key Files

| File | Change | Impact |
|------|--------|--------|
| `services/db.ts` | ProductService.add generates ID | Products can be created |
| `utils/validation/schemas.ts` | Schema includes all fields | Form validation works |
| `services/auth/AuthProvider.tsx` | Added isInitialized flag | Session survives refresh |
| `App.tsx` | ProtectedRoute gates on isInitialized | No premature redirect |
| `pages/admin/Products.tsx` | Added isSaving state | Button shows loading |

---

## Troubleshooting

### Issue: "Save Product" button not responding
- Check console for errors
- Verify ProductService is imported correctly
- Check network tab for failed requests
- Try refreshing page

### Issue: Hard refresh logs out
- Verify `isInitialized` flag is being set
- Check boot effect completes before redirect
- Look for session validation errors

### Issue: Validation errors not showing
- Check schema includes the field
- Verify error handling in handleSave
- Check toast notifications are working

### Issue: Product has `null` values
- Verify schema has proper defaults
- Check form sends all fields
- Verify numeric conversion in handleSave

---

## Contact
If issues arise, check:
1. Browser console for error messages
2. Supabase dashboard for data issues
3. Network tab for failed requests
4. AuthProvider boot logs
