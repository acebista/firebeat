# Challan QR Code Fix - Testing Guide

**Status**: Ready for Testing  
**Date**: December 7, 2025  
**Files Modified**: 2  
**TypeScript Errors**: 0  

---

## 📋 Test Checklist

### Pre-Test Verification

- [ ] Code changes applied
- [ ] TypeScript compilation passes (`npm run build`)
- [ ] Browser console is clean
- [ ] Orders with GPS coordinates exist in database

### Database Verification

```sql
-- Check if orders have GPS data
SELECT id, "customerName", "GPS" 
FROM orders 
WHERE "GPS" IS NOT NULL 
LIMIT 5;

-- Expected: Should see at least some orders with GPS in format "27.7, 85.3"
```

---

## 🧪 Test Scenarios

### Test 1: Single Challan Print with QR Code

**Setup**:
- Navigate to Challan Report page
- Ensure you have orders with status = 'completed'

**Steps**:
1. Click the print icon on any order row
2. A print preview window opens
3. Look at the top-right corner
4. **Verify**: QR code appears with "Customer Location" label

**Expected Result**:
- ✅ QR code visible in top-right
- ✅ 120×120px with border
- ✅ Label "Customer Location" below QR
- ✅ No console errors

---

### Test 2: Batch Print with Multiple Challans

**Setup**:
- Navigate to Challan Report
- Ensure you have 3+ orders with status = 'completed'

**Steps**:
1. Click "Print All Valid Challans" button
2. Print preview opens with multiple pages
3. Check each page

**Expected Result**:
- ✅ QR code on every challan page
- ✅ QR in top-right corner
- ✅ Page breaks between challans
- ✅ All QR codes properly positioned

---

### Test 3: QR Code Scannability

**Setup**:
- Have Test 1 print preview open
- Mobile device with QR scanner

**Steps**:
1. Take screenshot of print preview
2. Use phone QR scanner on the screenshot
3. Verify it opens Google Maps

**Expected Result**:
- ✅ QR scans successfully
- ✅ Google Maps opens
- ✅ Shows customer location
- ✅ Pin is on the correct GPS coordinates

---

### Test 4: Missing GPS Handling

**Setup**:
- Create/find an order without GPS data

**Steps**:
1. Try to print a challan without GPS
2. Observe print preview

**Expected Result**:
- ✅ Challan prints normally
- ✅ No QR code (graceful fallback)
- ✅ No console errors
- ✅ Other challan data intact

---

### Test 5: Orientation Toggle with QR

**Setup**:
- Have Challan Report open

**Steps**:
1. Click "Portrait" button (if in landscape)
2. Click "Print All Valid Challans"
3. Verify QR position
4. Close print preview
5. Click "Landscape" button
6. Click "Print All Valid Challans" again
7. Verify QR position

**Expected Result**:
- ✅ QR code in top-right in portrait mode
- ✅ QR code in top-right in landscape mode
- ✅ QR remains positioned correctly in both orientations
- ✅ No layout overflow

---

### Test 6: GPS Format Validation

**Database Check**:
```sql
-- Check various GPS formats
SELECT DISTINCT "GPS" 
FROM orders 
WHERE "GPS" IS NOT NULL 
LIMIT 10;
```

**Expected Formats**:
- ✅ `"27.715034, 85.324468"` (standard, with space)
- ✅ `"27.715034,85.324468"` (without space)
- ✅ Should handle both gracefully

**Test Both**:
1. Print challan with space format
2. Print challan without space format
3. Verify QR generates correctly for both

---

### Test 7: Performance Test

**Setup**:
- Have 50+ valid orders

**Steps**:
1. Click "Print All Valid Challans"
2. Time how long it takes to open print preview
3. Check browser console for warnings
4. Monitor memory usage

**Expected Result**:
- ✅ Print preview opens within 5 seconds
- ✅ No console warnings
- ✅ Browser doesn't lag
- ✅ All QR codes load properly

---

### Test 8: Cross-Browser Testing

**Browsers to Test**:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Steps** (same for each browser):
1. Navigate to Challan Report
2. Click "Print All Valid Challans"
3. Check QR code appearance

**Expected Result**:
- ✅ QR appears correctly
- ✅ No browser-specific issues
- ✅ Print preview renders identically

---

## 🐛 Troubleshooting

### Issue: QR Code Not Appearing

**Checklist**:
1. Check database: `SELECT "GPS" FROM orders WHERE id = 'order-id'`
   - If NULL → No GPS data for this order
   - If value → Should have GPS

2. Check console:
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Should see no errors related to QR

3. Check order object:
   - Log the order to console
   - Verify `order.GPS` has value
   - Verify format: `"lat, lng"`

### Issue: QR Code Shows But Doesn't Scan

**Fix**:
1. Verify GPS format in database
2. Should be exactly: `"latitude,longitude"` or `"latitude, longitude"`
3. Invalid formats: `"latitude|longitude"` or other separators

### Issue: QR Code Positioned Incorrectly

**Check**:
1. Print preview shows it in wrong position?
2. Try both portrait and landscape
3. Check browser zoom level (should be 100%)
4. Try different printer drivers

### Issue: Print Preview Hangs

**Fix**:
1. Check network tab (F12 DevTools)
2. QR code API might be slow/blocked
3. Try with different browser
4. Check internet connection

---

## ✅ Sign-Off Checklist

**Developer**:
- [ ] Code changes reviewed
- [ ] TypeScript compilation: 0 errors
- [ ] Browser console: Clean
- [ ] All functions updated (component, printChallan, printChallans)

**QA Tester**:
- [ ] Test 1: Single challan with QR (Pass/Fail)
- [ ] Test 2: Batch print with QR (Pass/Fail)
- [ ] Test 3: QR scannability (Pass/Fail)
- [ ] Test 4: Missing GPS handling (Pass/Fail)
- [ ] Test 5: Orientation toggle (Pass/Fail)
- [ ] Test 6: GPS format validation (Pass/Fail)
- [ ] Test 7: Performance (Pass/Fail)
- [ ] Test 8: Cross-browser (Pass/Fail)

**Result**: ✅ All tests passed / ❌ Failures found (list below)

---

## 📝 Test Results Template

**Date**: _______________
**Tester**: _______________
**Browser/Version**: _______________
**Database**: _______________

| Test | Expected | Actual | Pass/Fail | Notes |
|------|----------|--------|-----------|-------|
| 1. Single QR | QR in top-right | | | |
| 2. Batch QR | QR on each page | | | |
| 3. QR Scan | Opens Maps | | | |
| 4. No GPS | Graceful fallback | | | |
| 5. Orientation | QR positioned correctly | | | |
| 6. GPS Format | Both formats work | | | |
| 7. Performance | <5 sec to preview | | | |
| 8. Cross-browser | Works in all browsers | | | |

---

## 🚀 Deployment

**Ready to Deploy When**:
- ✅ All 8 tests passed
- ✅ No critical issues
- ✅ QA sign-off obtained

**Deployment Steps**:
1. Merge code changes
2. Deploy to production
3. Monitor for errors (24 hours)
4. Gather user feedback

---

## 📞 Support

**If Tests Fail**:
1. Check `CHALLAN_QR_FIX_COMPLETE.md` for detailed explanation
2. Review database schema verification section
3. Check console errors (F12 DevTools)
4. Verify GPS data format in database

**If QR Code Doesn't Scan**:
1. Check coordinates are valid latitude/longitude
2. Test URL manually: `https://www.google.com/maps?q=27.715034,85.324468`
3. Verify internet connection (QR API needs it)

---

**Testing Complete When All Tests Pass ✅**
