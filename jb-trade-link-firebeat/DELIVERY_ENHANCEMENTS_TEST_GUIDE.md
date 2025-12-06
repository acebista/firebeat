

---

### Test 2: Damage Modal - Select Non-Invoice Product

**Setup:**
- Continue from Test 1
- Product dropdown is open
- Invoice has: Milk (5), Bread (3)

**Steps:**
1. Scroll dropdown to find a product NOT in invoice
2. Select any non-invoice product
3. Enter quantity: 2
4. Select reason: "Broken"
5. Click "Add Damage"

**Expected Results:**
✅ Product selected successfully
✅ Damage added to list
✅ Shows product name (from catalog)
✅ Shows quantity: 2
✅ Shows reason: Broken
✅ Deduction amount calculated
✅ Can close modal

**Pass/Fail:** ___________

---

### Test 3: Return Modal - Quantity Validation (Below Max)

**Setup:**
- Return to main delivery page
- Invoice has: Product X (5 units available)

**Steps:**
1. Click "Return" button
2. Select "Product X"
3. Enter return quantity: 3

**Expected Results:**
✅ Dropdown shows "Product X (Available: 5, Remaining: 5)"
✅ Label shows "Max: 5"
✅ Input field shows green border
✅ Success message shows: "✅ Valid return quantity"
✅ "Add Item Return" button is ENABLED
✅ Can click button and add return

**Pass/Fail:** ___________

---

### Test 4: Return Modal - Quantity Validation (Above Max)

**Setup:**
- Return modal is open
- Product X has 5 units in invoice

**Steps:**
1. Select "Product X" (5 units available)
2. Enter return quantity: 7

**Expected Results:**
✅ Input field shows RED border
✅ Error message shows: "❌ Return quantity must be 1 to 5"
✅ "Add Item Return" button is DISABLED (greyed out)
✅ Cannot click button
✅ Change to 5
✅ Border turns GREEN
✅ Success message shows

**Pass/Fail:** ___________

---

### Test 5: Return Modal - Max Quantity (Exactly)

**Setup:**
- Return modal is open
- Product X has 5 units

**Steps:**
1. Select "Product X"
2. Enter return quantity: 5

**Expected Results:**
✅ Input shows green border
✅ Success message shows
✅ Button enabled
✅ Can add return successfully

**Pass/Fail:** ___________

---

### Test 6: Return Modal - Zero Quantity

**Setup:**
- Return modal is open

**Steps:**
1. Select a product
2. Enter return quantity: 0

**Expected Results:**
✅ Input shows RED border
✅ Error message shows (should be invalid)
✅ Button stays DISABLED

**Pass/Fail:** ___________

---

### Test 7: Return Modal - Negative Quantity

**Setup:**
- Return modal is open

**Steps:**
1. Select a product
2. Try to enter: -5 (type in field)

**Expected Results:**
✅ Either prevents negative input OR
✅ Shows error if entered

**Pass/Fail:** ___________

---

### Test 8: Return Modal - Cumulative Validation

**Setup:**
- Return modal is open
- Product Y has 10 units in invoice
- Already added return of 6 units

**Steps:**
1. Select Product Y again
2. Try to enter: 5 (would be 6+5=11 > 10)

**Expected Results:**
✅ Error message shows:
   "Total return cannot exceed 10. Currently returning: 6, Trying to add: 5"
✅ Button disabled
✅ User cannot add return
✅ User corrects to 4
✅ Success message appears

**Pass/Fail:** ___________

---

### Test 9: Return Modal - Remaining Qty Display

**Setup:**
- Return modal is open
- Order has: Product Z (8 units)
- Already returned: 3 units

**Steps:**
1. Open return modal
2. Click product dropdown

**Expected Results:**
✅ Dropdown shows:
   "Product Z (Available: 8, Remaining: 5)"
✅ "Remaining" shows 5 (8 - 3 already returned)
✅ Max input will be 5
✅ Helps user know what's left

**Pass/Fail:** ___________

---

### Test 10: Return Modal - Multiple Different Products

**Setup:**
- Order has: Milk (5), Bread (3), Eggs (4)
- Return modal open

**Steps:**
1. Return 2 Milk units
2. Return 1 Bread unit
3. Return 2 Eggs units
4. Verify list shows all three

**Expected Results:**
✅ Can add multiple different products
✅ Each product tracked separately
✅ Each quantity validated independently
✅ All three show in return list
✅ Amounts calculated correctly

**Pass/Fail:** ___________

---

### Test 11: Damage Modal - Error Handling

**Setup:**
- Network is slow or database issue

**Steps:**
1. Open Damage modal
2. Observe loading state
3. If error occurs, check toast

**Expected Results:**
✅ Shows loading indicator
✅ If fails: Shows "Failed to load products" toast
✅ Modal doesn't crash
✅ Can close gracefully

**Pass/Fail:** ___________

---

### Test 12: Complete Delivery with All Features

**Setup:**
- Fresh delivery order

**Steps:**
1. Add 2 damages (different products)
2. Add 3 returns (different products)
3. Fill all delivery fields
4. Click "Mark Delivered"

**Expected Results:**
✅ All damages shown in remarks
✅ All returns shown in remarks
✅ Amount calculated with deductions:
   Final = Base - Damages - Returns
✅ Order marked as delivered
✅ All data saved

**Pass/Fail:** ___________

---

## 📊 Test Results Summary

| Test # | Scenario | Status | Notes |
|--------|----------|--------|-------|
| 1 | Load all products | _____ | |
| 2 | Select non-invoice product | _____ | |
| 3 | Valid quantity | _____ | |
| 4 | Invalid quantity | _____ | |
| 5 | Max quantity | _____ | |
| 6 | Zero quantity | _____ | |
| 7 | Negative quantity | _____ | |
| 8 | Cumulative validation | _____ | |
| 9 | Remaining qty display | _____ | |
| 10 | Multiple products | _____ | |
| 11 | Error handling | _____ | |
| 12 | Complete delivery | _____ | |

**Total Tests:** 12
**Passed:** ____
**Failed:** ____
**Pass Rate:** _____%

---

## 🎨 Visual Verification

### Check These Visual Elements:

**Modal Appearance:**
- [ ] Modal opens smoothly
- [ ] Rounded corners visible
- [ ] Shadow appears
- [ ] Background darkened

**Product Dropdown:**
- [ ] Shows loading state initially
- [ ] Lists all products
- [ ] Scrollable if many products
- [ ] Selected product highlighted

**Return Quantity Input:**
- [ ] Shows "Max: X" in label
- [ ] Green border on valid input ✅
- [ ] Red border on invalid input ❌
- [ ] Clear error messages shown
- [ ] Success messages shown

**Buttons:**
- [ ] "Add" button enabled on valid
- [ ] "Add" button disabled (greyed) on invalid
- [ ] Hover effect visible
- [ ] Click registering

**Messages:**
- [ ] "✅ Valid return quantity" shown when valid
- [ ] "❌ Return quantity must be..." shown when invalid
- [ ] Error toasts appear if needed
- [ ] Text clear and readable

---

## 🔍 Data Verification

### Check Database/Storage:

**After adding damages:**
```
- Damages array populated
- Each damage has: productId, productName, quantity, reason
- Deduction amounts calculated correctly
```

**After adding returns:**
```
- ReturnItems array populated
- Each return has: productId, productName, originalQty, returnQty, rate
- Amount calculations correct
- Cannot exceed invoice qty
```

**After mark delivered:**
```
- Remarks field includes damages and returns
- Final amount shows deductions
- Order status = 'delivered'
- All fields saved
```

---

## ❌ Known Issues to Check

**Potential Issues:**
- [ ] Products fail to load (network error)
- [ ] Dropdown shows empty
- [ ] Validation doesn't prevent invalid input
- [ ] Button doesn't disable
- [ ] Border colors wrong
- [ ] Error messages not clear
- [ ] Cumulative validation fails
- [ ] Data not saved on delivery mark

---

## ✅ Sign-Off

**Tested By:** ___________________
**Date:** ___________________
**Status:** [ ] PASS [ ] FAIL

**Comments:**
```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```

**Approved For Production:** [ ] YES [ ] NO

**Approved By:** ___________________ **Date:** ___________

---

## 📝 Notes

### For Passing Tests:
- All 12 scenarios should pass
- Visual elements should work correctly
- Data should be accurate
- No errors in console

### For Failing Tests:
- Document exact failure
- Take screenshots if possible
- Check browser console for errors
- Verify network connectivity

### Common Issues:
1. **Products not loading:** Check ProductService availability
2. **Validation not working:** Check JavaScript console
3. **Border colors wrong:** Clear browser cache
4. **Button not responding:** Check for JavaScript errors

---

## 🚀 Ready for Production?

All tests passed → Ready to deploy ✅
Any test failed → Fix before deploy ❌

---

**Test Guide Version:** 1.0.0
**Created:** December 6, 2025
**Status:** Ready for Testing
