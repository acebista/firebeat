# Frontend Integration - Testing Guide

**Date**: December 7, 2025  
**Version**: 1.0  
**Status**: Ready for Testing

---

## QUICK TEST PROCEDURE (5 minutes)

### 1. Test CommissionRateManager Mode Selection ✅

**Steps**:
```
1. Navigate to Admin → Company Settings → Commission Rates
2. Click "Add New Rate"
3. Fill in form:
   - Commission Mode: "Slab (Tiered)"
   - Min Amount: 0
   - Max Amount: 10000
   - Rate %: 5
4. Click Save
5. Verify:
   - Rate appears in table
   - Mode shows as "SLAB" with blue badge
   - Blue background confirms slab mode
```

**Expected Result**: Mode badge displays "SLAB" in blue

---

### 2. Test Mode Edit Workflow ✅

**Steps**:
```
1. In Commission Rates table, click Edit on a SLAB rate
2. Change mode to "Level (Bracket)"
3. Verify dropdown shows "Level" selected
4. Click Save
5. Return to table
6. Verify:
   - Mode badge changed to "LEVEL" in green
   - All other data preserved
```

**Expected Result**: Mode badge changes from blue to green

---

### 3. Test HRPanel with New Columns ✅

**Steps**:
```
1. Navigate to Admin → HR Panel
2. Verify date range is set to current month
3. Verify salespeople list loads
4. Look at Compensation Summary table columns:
   - Salesperson
   - Company
   - Gross Sales
   - Returns
   - Net Sales
   - Mode (with badge)
   - Commission
   - Base Salary
   - Total Payout
5. Verify data loads and displays
```

**Expected Result**: All 9 columns visible with data populated

---

### 4. Test Net Sales Calculation ✅

**Steps**:
```
1. Find a salesperson with orders and returns in date range
2. Look at table row:
   - Gross Sales = $50,000
   - Returns = ($2,000)
   - Net Sales = $48,000
3. Verify: Net Sales = Gross Sales - Returns
```

**Expected Result**: Math is correct: $50,000 - $2,000 = $48,000

---

### 5. Test Summary Card ✅

**Steps**:
```
1. In HR Panel, look at summary card at top
2. Verify 6 values display:
   - Gross Sales: Sum of all gross
   - Returns: Sum of all returns
   - Net Sales: Sum of all net (Gross - Returns)
   - Commission: Sum of all commission
   - Base Salary: Sum of all base salaries
   - Total Payout: Sum of all payouts
3. Verify math: Total Payout = Total Base Salary + Total Commission
```

**Expected Result**: All calculations correct and totals match

---

### 6. Test Mode Summary Section ✅

**Steps**:
```
1. Scroll down past compensation table
2. Find "Commission Modes Summary" section
3. Should see two boxes:
   - Left box: "Slab Mode (Tiered)" with blue border
   - Right box: "Level Mode (Bracket)" with green border
4. Each shows:
   - Count of salespeople using that mode
   - List of names with their Sales → Commission
```

**Expected Result**: Modes correctly grouped with proper colors

---

### 7. Test Date Range Filtering ✅

**Steps**:
```
1. In HR Panel, change date range
2. Click a different month
3. Wait for data to load
4. Verify:
   - Different salespeople appear (if they have orders in new range)
   - Compensation amounts change
   - Only orders in date range included
```

**Expected Result**: Data updates to reflect new date range

---

### 8. Test Salesperson Filter ✅

**Steps**:
```
1. In HR Panel, click "Select Salesperson" dropdown
2. Choose one specific salesperson
3. Wait for data to load
4. Verify:
   - Only that salesperson shows in table
   - Summary updates to show only their data
5. Clear filter and verify all show again
```

**Expected Result**: Filtering works correctly

---

### 9. Test Active Only Filter ✅

**Steps**:
```
1. Check "Active Only" checkbox
2. Wait for data to load
3. Verify only active salespeople show
4. Uncheck and verify all show again
```

**Expected Result**: Inactive salespeople hidden when filter enabled

---

### 10. Test Error Handling ✅

**Steps**:
```
1. Set invalid date range (end before start)
2. Verify error message displays
3. Try with valid range - should clear error
4. Watch browser console for any errors
```

**Expected Result**: Graceful error handling with user-friendly messages

---

## DETAILED TEST SCENARIOS

### Scenario A: Slab Mode Commission

**Setup**:
```
Commission Rate:
- Slab Mode
- 0 to 10,000: 5%
- 10,000 to 50,000: 7%
- 50,000+: 10%

Salesperson: John Doe
Gross Sales: $45,000
Returns: $1,000
Net Sales: $44,000
```

**Expected Commission** (Slab):
```
- 0 to 10,000: 10,000 × 5% = 500
- 10,000 to 44,000: 34,000 × 7% = 2,380
- Total: $2,880
```

**Test Steps**:
1. Set up rates with Slab mode
2. Create order of $45,000
3. Create return of $1,000
4. Check HRPanel
5. Verify commission = $2,880
6. Verify mode badge = "SLAB"

---

### Scenario B: Level Mode Commission

**Setup**:
```
Commission Rate:
- Level Mode
- 0 to 10,000: 5%
- 10,000 to 50,000: 7%
- 50,000+: 10%

Salesperson: Jane Smith
Gross Sales: $45,000
Returns: $1,000
Net Sales: $44,000
```

**Expected Commission** (Level):
```
- Net Sales $44,000 falls in 10k-50k bracket
- Entire amount gets 7%
- 44,000 × 7% = $3,080
```

**Test Steps**:
1. Set up rates with Level mode
2. Create order of $45,000
3. Create return of $1,000
4. Check HRPanel
5. Verify commission = $3,080
6. Verify mode badge = "LEVEL"

---

### Scenario C: Multiple Salespeople Mixed Modes

**Setup**:
```
Salesperson 1: John Doe (Slab mode)
- Gross: $50,000, Returns: $2,000, Net: $48,000
- Commission: $3,500

Salesperson 2: Jane Smith (Level mode)
- Gross: $30,000, Returns: $500, Net: $29,500
- Commission: $2,065

Summary Should Show:
- Total Gross: $80,000
- Total Returns: ($2,500)
- Total Net: $77,500
- Total Commission: $5,565
```

**Test Steps**:
1. Set up two different rate sets (one Slab, one Level)
2. Assign John to Slab, Jane to Level
3. Create orders for both
4. Check HRPanel
5. Verify summary totals are correct
6. Verify both modes show in "Commission Modes Summary"

---

## REGRESSION TESTING

### Verify Existing Features Still Work

- [ ] **Login**: User can log in
- [ ] **Admin Access**: Admin can access all panels
- [ ] **Salespeople List**: Salespeople load correctly
- [ ] **Date Selection**: Can select any date range
- [ ] **Filters**: Active/Inactive filter works
- [ ] **Table Display**: All columns visible and aligned
- [ ] **Responsive Design**: Works on mobile/tablet
- [ ] **Toast Messages**: Notifications display correctly

---

## BROWSER COMPATIBILITY

Test in each browser:

| Browser | Version | Tested | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | [ ] | |
| Safari | Latest | [ ] | |
| Firefox | Latest | [ ] | |
| Edge | Latest | [ ] | |

---

## PERFORMANCE TESTING

### Load Times

| Scenario | Expected | Actual | Pass |
|----------|----------|--------|------|
| Load HRPanel (10 people) | < 2s | | |
| Load HRPanel (50 people) | < 5s | | |
| Load CommissionRateManager | < 1s | | |
| Change date range | < 2s | | |

---

## DATA VALIDATION

### Verify Database Data

**SQL Queries to Run**:

```sql
-- Check commission rates with mode
SELECT id, company_id, name, mode, min_amount, rate_pct
FROM commission_rates
WHERE is_active = true
ORDER BY company_id, min_amount;

-- Check returns table populated
SELECT COUNT(*) as return_count
FROM returns
WHERE salesperson_id IS NOT NULL;

-- Check orders with gross sales
SELECT id, salespersonId, totalAmount
FROM orders
WHERE totalAmount > 0
LIMIT 10;
```

---

## SIGN-OFF CHECKLIST

**Before Deploying to Production**:

- [ ] All 10 quick tests passed
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Database queries return expected data
- [ ] All columns display correctly
- [ ] Calculations are accurate
- [ ] Mode badges display correctly
- [ ] Summary totals are correct
- [ ] Filters work as expected
- [ ] Error handling works
- [ ] Responsive design works
- [ ] All browsers tested

---

## KNOWN LIMITATIONS

### Current Release
- Sales items table removed (can be added back with full order details)
- Commission modes summary is text-based (not expandable tables)
- No historical data view (only current period)

### Planned Future Enhancements
- Export to PDF/CSV
- Historical commission tracking
- Commission rate change audit log
- Returns logging UI
- Commission forecast/projection

---

## TROUBLESHOOTING

### Problem: No data shows in HRPanel

**Checklist**:
- [ ] Date range includes actual orders
- [ ] At least one salesperson is active
- [ ] Commission rates exist
- [ ] Browser console shows no errors
- [ ] Check network tab for failed requests

**Debug Steps**:
```
1. Open browser console (F12)
2. Check for any error messages
3. Check Network tab for API calls
4. Verify date range is correct
5. Check that salespeople list populates
```

---

### Problem: Mode not showing in CommissionRateManager

**Checklist**:
- [ ] Refresh page
- [ ] Clear browser cache
- [ ] Check that mode dropdown appears
- [ ] Verify mode is selected before save
- [ ] Check database for mode value

**Debug Steps**:
```
1. Inspect element on mode dropdown
2. Verify form includes mode field
3. Check network request includes mode
4. Check database commission_rates table
```

---

### Problem: Commission calculation is wrong

**Checklist**:
- [ ] Verify correct mode (slab vs level)
- [ ] Check rate bands are correct
- [ ] Verify returns are being deducted
- [ ] Check net sales calculation
- [ ] Compare manual calculation with system

**Manual Calculation**:
```
Slab: (Band 1 amount × Band 1 rate) + (Band 2 amount × Band 2 rate) + ...
Level: Total amount × (rate of band containing total)
```

---

## SUPPORT CONTACT

For issues or questions:
1. Check this guide first
2. Review console errors
3. Check database data
4. Contact development team

---

**Last Updated**: December 7, 2025  
**Tested By**: [Your Name]  
**Date Tested**: ___________  
**Result**: ✅ PASS / ⚠️ ISSUES / ❌ FAIL
