# Sales Return Flow - Testing Guide

## Test Scenarios

### Scenario 1: Basic Flow - Single Invoice Return
**Steps:**
1. Navigate to `/admin/invoices/select-return`
2. Select today's date
3. Click "Load Invoices"
4. Click on any invoice to open return detail
5. Enter return quantities (good/damaged)
6. Click "Confirm Return"

**Expected Results:**
- ✅ Invoice list loads for selected date
- ✅ Return detail view opens with all product rows visible
- ✅ After confirmation, toast shows "Process Next" option (if more invoices exist)
- ✅ Invoice is marked with purple "✓ Returned" badge when returning to list
- ✅ Progress counter shows "1 processed this session • X remaining"

### Scenario 2: Sequential Processing (Multiple Invoices)
**Steps:**
1. Load invoices for a date with multiple eligible invoices
2. Process first invoice → Click "Process Next →" in toast
3. Process second invoice → Click "Process Next →" in toast
4. Continue until no more invoices

**Expected Results:**
- ✅ Each "Process Next" loads the next unprocessed invoice immediately
- ✅ No navigation to `/admin/returns` at any point
- ✅ Progress counter updates after each return
- ✅ When last invoice is processed, toast shows "No more unprocessed invoices"
- ✅ Returns to invoice list automatically

### Scenario 3: Back/Cancel Navigation
**Steps:**
1. Load invoices for a date
2. Open an invoice
3. Click the Back button (top-left arrow)
4. Verify you're back at the invoice list
5. Open another invoice
6. Click "Cancel" button (bottom)
7. Verify you're back at the invoice list

**Expected Results:**
- ✅ Both Back and Cancel return to the invoice list
- ✅ Same date filter is still applied
- ✅ Same invoices are still loaded
- ✅ Search term is preserved (if any)
- ✅ Processed badges are still visible

### Scenario 4: Session Persistence
**Steps:**
1. Load invoices for a date
2. Process 2-3 invoices
3. Refresh the page (F5 or Cmd+R)
4. Verify state is restored

**Expected Results:**
- ✅ Same date is selected
- ✅ Same invoices are loaded
- ✅ Processed badges are still visible
- ✅ Progress counter shows correct counts
- ✅ Search term is restored (if any was entered)

### Scenario 5: Search and Filter
**Steps:**
1. Load invoices for a date
2. Enter a search term (customer name or invoice ID)
3. Process one of the filtered invoices
4. Return to list
5. Verify search is still active

**Expected Results:**
- ✅ Search term is preserved
- ✅ Filtered results are maintained
- ✅ Processed invoice shows badge
- ✅ Progress counter reflects filtered list (not all invoices)

### Scenario 6: Clear Session
**Steps:**
1. Load invoices and process 2-3 returns
2. Click "Clear Session (X)" button in header
3. Verify all processed badges are removed

**Expected Results:**
- ✅ "Clear Session" button appears when invoices are processed
- ✅ Shows correct count in button label
- ✅ After clicking, all purple badges disappear
- ✅ Progress counter resets
- ✅ Toast confirms "Session cleared"

### Scenario 7: Edge Cases
**Steps:**
1. Load a date with only 1 invoice
2. Process that invoice
3. Verify behavior

**Expected Results:**
- ✅ Toast shows "No more unprocessed invoices"
- ✅ Automatically returns to invoice list
- ✅ No "Process Next" button appears

**Steps:**
1. Load a date with no eligible invoices
2. Verify empty state

**Expected Results:**
- ✅ Shows "No invoices found" message
- ✅ No errors in console

### Scenario 8: Quick Actions
**Steps:**
1. Open an invoice
2. Click "Return All (Good)" button
3. Verify all quantities are set to good
4. Click "Return All (Damaged)" button
5. Verify all quantities are set to damaged
6. Click "Clear All" button
7. Verify all quantities are reset to 0

**Expected Results:**
- ✅ All quick action buttons work correctly
- ✅ Return amount updates in real-time
- ✅ Summary panel reflects changes

## Browser Testing

Test in the following browsers:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

## Performance Checks

- [ ] Invoice list loads in < 2 seconds for dates with 50+ invoices
- [ ] No memory leaks when processing 10+ invoices in sequence
- [ ] Session storage doesn't exceed reasonable limits (< 5MB)

## Console Checks

During all tests, verify:
- [ ] No JavaScript errors in console
- [ ] No TypeScript errors
- [ ] No React warnings
- [ ] Diagnostic logs appear for products missing company data (expected)

## Regression Testing

Verify existing functionality still works:
- [ ] Can still navigate to `/admin/returns` from sidebar
- [ ] Returns list page (`/admin/returns`) displays correctly
- [ ] "Create Return" button on Returns page works
- [ ] Damaged goods logging still works
- [ ] Return data is correctly saved to database

## Known Limitations

1. **Session data is browser-specific**: If user opens in different browser/tab, session won't carry over
2. **No backend sync**: Processed tracking is client-side only; if another user processes the same invoice, it won't show as processed
3. **Date change clears processed list**: This is intentional to avoid confusion

## Success Criteria

✅ All test scenarios pass  
✅ No navigation to `/admin/returns` during return processing workflow  
✅ Session state persists across page refresh  
✅ "Process Next" workflow is smooth and intuitive  
✅ No TypeScript or runtime errors  
✅ Build completes successfully  
