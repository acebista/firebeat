# Challan QR Code + Landscape Mode - Testing Guide

**Status**: Ready to Test | **Estimated Test Time**: 15-20 minutes

---

## Quick Start Testing

### 1. Basic Print Test (Portrait Mode)

**Steps**:
1. Navigate to Challan Report page
2. Ensure at least one valid challan exists (status = MATCH)
3. Verify "Portrait" button is selected (highlighted in blue)
4. Click "Print All Valid Challans"
5. In print preview, verify:
   - [ ] Page size shows as A4 Portrait
   - [ ] QR code visible in top-right corner (if customer has location)
   - [ ] "Customer Location" label below QR code
   - [ ] All text is readable
   - [ ] Tables are properly formatted
   - [ ] Black border around challan

**Expected**: Print preview shows portrait-oriented challan with QR code

---

### 2. Landscape Mode Test

**Steps**:
1. From Challan Report page
2. Click "Landscape" button (should highlight in blue)
3. Click "Print All Valid Challans"
4. In print preview, verify:
   - [ ] Page orientation rotated 90°
   - [ ] Page size shows as A4 Landscape
   - [ ] QR code still in top-right corner
   - [ ] All content fits without overflow
   - [ ] Table columns are properly sized

**Expected**: Print preview shows landscape-oriented challan with QR code

---

### 3. Single Challan Print Test

**Steps**:
1. From Challan Report table
2. Click the "Print" button for a specific valid challan row
3. Verify orientation matches current selection (Portrait/Landscape)
4. Print preview should show:
   - [ ] Only one challan
   - [ ] QR code positioned correctly
   - [ ] All details filled in

**Expected**: Single challan prints in selected orientation

---

### 4. QR Code Generation Test

**Requirements**: Customer must have location data in format: `"latitude,longitude"`

**Steps**:
1. Edit customer record to have location (e.g., "27.7172,85.3240")
2. Create or find an order for that customer
3. Generate challan print preview
4. Verify:
   - [ ] QR code appears in top-right corner
   - [ ] QR code is 120×120px with border
   - [ ] "Customer Location" label visible below
   - [ ] QR code doesn't overlap other content

**Test QR Code Functionality**:
1. Take a screenshot of the print preview
2. Scan the QR code with mobile phone
3. Should open Google Maps with customer location

**Expected**: QR code correctly encodes and links to customer location

---

### 5. QR Code Missing Test (No Location)

**Steps**:
1. Find a customer with NO location data (location = NULL or empty)
2. Create order for that customer
3. Generate challan print preview
4. Verify:
   - [ ] No QR code appears
   - [ ] No error messages shown
   - [ ] Challan prints normally without QR area
   - [ ] All other content displays correctly

**Expected**: Challan prints without QR code when location is empty

---

### 6. Batch Print Test (Multiple Challans)

**Steps**:
1. Ensure at least 3 valid challans exist
2. Select Portrait orientation
3. Click "Print All Valid Challans"
4. In print preview, verify:
   - [ ] All challan pages visible
   - [ ] Page breaks between challans are clean
   - [ ] Each challan has its QR code
   - [ ] Last challan doesn't have extra page break

**Expected**: Multiple challans print with proper page breaks

---

### 7. Orientation Persistence Test

**Steps**:
1. Select Landscape orientation
2. Print one challan (single print)
3. Go back to report page
4. Verify Landscape button is still selected
5. Print another challan
6. Should still be in landscape mode

**Expected**: Orientation selection persists across print operations

---

### 8. Toggle Button UI Test

**Steps**:
1. Verify Portrait button styling (when selected)
   - [ ] Button background is indigo-600
   - [ ] Button text is white
   - [ ] Layout icon visible
2. Click Landscape button
3. Verify Landscape button styling (when selected)
   - [ ] Button background is indigo-600
   - [ ] Button text is white
   - [ ] Layout icon is rotated 90°
4. Verify deselected button styling
   - [ ] Button background is white
   - [ ] Button text is gray-700
   - [ ] Hover effect works (bg-gray-100)

**Expected**: Toggle buttons have proper visual states

---

### 9. Real-World Print Test

**Steps**:
1. Send print preview to actual printer
2. Set printer to appropriate paper size
3. For portrait: A4 (210 × 297 mm)
4. For landscape: A4 (297 × 210 mm)
5. Print and verify physical output:
   - [ ] QR code is clear and scannable
   - [ ] Text is readable
   - [ ] No clipping or overflow
   - [ ] Margins are appropriate
   - [ ] Black border is visible

**Expected**: Printed challan is clear, complete, and scannable

---

### 10. Error Handling Test

**Steps**:

**Test A - No Valid Challans**:
1. Filter/ensure no valid challans exist
2. Click "Print All Valid Challans"
3. Verify toast notification: "No valid challans to print"
4. No print window opens

**Test B - No Customers Loaded**:
1. Wait for page to load
2. Verify customers data loads
3. Try printing
4. Verify no errors in browser console

**Expected**: Graceful error handling with user notifications

---

## Visual Regression Testing

### Portrait Mode Reference
```
┌─────────────────────────┐
│  J.B Trade Link         │
│  Delivery Challan       │
│  Phone: 9802379658      │
│  Customer Copy      QR  │
│                        QR│
├─────────────────────────┤
│ Invoice No: INV-001     │
│ Salesman: John Doe      │
│ Customer: ABC Company   │
├─────────────────────────┤
│ # │ Product │ Qty │...  │
│───┼─────────┼─────┼──... │
│ 1 │ Item A  │  5  │...  │
├─────────────────────────┤
│ Sub Total: Rs. 5000     │
│ Grand Total: Rs. 4500   │
├─────────────────────────┤
│ For J.B Trade Link:     │
│ _________________       │
│                         │
│ Customer Signature:     │
│ _________________       │
└─────────────────────────┘
Page Height: 297mm | Page Width: 210mm
```

### Landscape Mode Reference
```
┌──────────────────────────────────────┐
│  J.B Trade Link                  QR  │
│  Delivery Challan               QR  │
│  Phone: 9802379658             QR  │
│  Customer Copy                       │
├──────────────────────────────────────┤
│ Invoice No: INV-001                 │
│ Salesman: John Doe                  │
├──────────────────────────────────────┤
│ # │ Product │ Qty │ Rate │ Total  │ │
│───┼─────────┼─────┼──────┼────────┼ │
│ 1 │ Item A  │  5  │ 1000 │ 5000  │ │
├──────────────────────────────────────┤
│ Sub Total: Rs. 5000 | Disc: Rs. 500 │
│ Grand Total: Rs. 4500               │
├──────────────────────────────────────┤
│ For J.B Trade Link: _____ Customer: _│
└──────────────────────────────────────┘
Page Height: 210mm | Page Width: 297mm
```

---

## Performance Testing

### QR Code Loading Time
- [ ] QR code appears in preview within 500ms (single print)
- [ ] Multiple QR codes load within 1000ms (batch print)
- [ ] No visible delay before print dialog opens

### Print Dialog Response
- [ ] Print dialog opens within 1 second
- [ ] No browser freezing or lag
- [ ] Responsive to user interactions

---

## Cross-Browser Testing

### Chrome/Chromium
- [ ] Portrait mode prints correctly
- [ ] Landscape mode prints correctly
- [ ] QR codes render
- [ ] Print preview functional

### Firefox
- [ ] Portrait mode prints correctly
- [ ] Landscape mode prints correctly
- [ ] QR codes render
- [ ] Print preview functional

### Safari
- [ ] Portrait mode prints correctly
- [ ] Landscape mode prints correctly
- [ ] QR codes render
- [ ] Print preview functional

---

## Database Verification

### Check Customer Location Format

**SQL Query**:
```sql
SELECT id, name, location FROM customers 
WHERE location IS NOT NULL AND location != '' 
LIMIT 5;
```

**Expected Format**: `"27.7172,85.3240"` (latitude,longitude)

**Sample Data**:
```
| id | name | location |
|----|------|----------|
| 1  | ABC  | 27.7172,85.3240 |
| 2  | XYZ  | 28.2044,83.9856 |
```

---

## Browser Console

### Check for Warnings/Errors

During all tests, verify browser console (F12):
- [ ] No TypeScript compilation errors
- [ ] No unhandled promise rejections
- [ ] No undefined references
- [ ] No CORS warnings

**Expected**: Clean console with no errors

---

## Sign-Off Checklist

- [ ] All 10 test scenarios pass
- [ ] Portrait mode verified
- [ ] Landscape mode verified
- [ ] QR code with location works
- [ ] QR code missing gracefully handled
- [ ] Toggle UI works correctly
- [ ] Batch print works
- [ ] Single print works
- [ ] No browser errors
- [ ] Real printer output is acceptable

---

## Known Limitations

### Current Implementation
1. ✅ QR code size is fixed at 120×120px (can be customized in code)
2. ✅ Customer location must be in CSV format (no validation)
3. ✅ Default orientation is portrait (can be changed)
4. ✅ QR code API is external (qrserver.com - requires internet)

### Not Tested (Outside Scope)
- Very slow network connections
- Devices without internet access
- Extremely large batch prints (100+ challans)
- Non-standard paper sizes

---

## Troubleshooting

### QR Code Not Showing
**Possible Causes**:
1. Customer location is NULL/empty
2. Location format is incorrect (should be "lat,long")
3. Internet connection issue (QR API unreachable)
4. Browser blocks external images

**Solution**:
- Verify customer has location in database
- Use format: "27.7172,85.3240"
- Check network connection
- Allow external images in browser settings

### Wrong Page Size Printing
**Possible Causes**:
1. Browser print settings override page size
2. Printer doesn't support selected size
3. System print dialog overrides CSS

**Solution**:
- Check printer settings before printing
- Ensure paper size matches orientation
- Update printer driver if needed

### QR Code Scanning Issues
**Possible Causes**:
1. QR code is too small
2. Mobile camera can't focus
3. Incorrect location coordinates

**Solution**:
- Zoom in on QR code before scanning
- Try different mobile device
- Verify location coordinates in database

---

## Test Data

### Sample Customers with Locations
```sql
INSERT INTO customers (id, name, location) VALUES
(1, 'ABC Trading', '27.7172,85.3240'),
(2, 'XYZ Supplies', '28.2044,83.9856'),
(3, 'Test Customer', '27.6539,85.2384');
```

### Sample Orders
- Use existing orders linked to customers
- Ensure order status is valid (not cancelled)

---

## Final Checklist

Before marking as production-ready:

- [ ] All unit tests pass
- [ ] All 10 test scenarios pass
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] QR code generates correctly
- [ ] Both orientations work
- [ ] Print preview looks good
- [ ] Real printer output acceptable
- [ ] Documentation complete
- [ ] Code review approved

---

**Status**: Ready for Production Testing ✅

**Questions?** Refer to `CHALLAN_QR_LANDSCAPE_COMPLETE.md` for full documentation.
