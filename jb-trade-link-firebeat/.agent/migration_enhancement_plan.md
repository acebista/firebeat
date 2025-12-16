# Migration Tool Enhancement Plan: Strict Customer Resolution & Verification

## Problem
The previous migration logic allowed "collapsing" of multiple CSV orders into a single existing customer record. This happened because:
1.  Many CSV rows lacked unique customer identifiers (PAN, Phone).
2.  The logic fell back to `GPS` coordinates.
3.  A hardcoded "default" GPS (`27.715034, 85.324468`) is common in the data/system.
4.  Multiple different customers with this default GPS were being resolved to the *same* single database customer record that shared those coordinates.

## Solution Implemented

### 1. defined `DEFAULT_GPS` Constant
We explicitly defined:
```typescript
const DEFAULT_GPS = "27.715034, 85.324468";
```

### 2. Strict Resolution Hierarchy (Step 3 & Step 4)
We modified `handleStep3` (Customer Deduplication) and `handleStep4` (Order Import) to strictly follow this resolution order:

1.  **ID Mapping**: Check if we already mapped this CSV `customerId` to a DB `id` (from Step 3).
2.  **GPS**: Check `locationText` match **ONLY IF** it is valid AND `!== DEFAULT_GPS`.
3.  **PAN**: Check `panNumber` match.
4.  **Phone**: Check `phone` match.
5.  **Name**: Check exact case-insensitive Name match.

**Crucially**: If a customer has the default GPS, we **SKIP** the GPS lookup entirely and force the logic to look for PAN, Phone, or Name. This prevents them from merging with other "default GPS" customers.

### 3. Emergency Fallback (Step 4)
If an order's customer *still* cannot be resolved after all checks:
- Instead of failing or assigning to a default, we now likely **create a new customer on the fly** for that specific order.
- This ensures data safety (no lost orders) while preventing incorrect merges.
- These events are logged as `CreatedOnFly`.

### 4. Enhanced Verification (Post-Migration)
We added a comprehensive verification report to Step 4:
- **Comparison**: Fetches ALL orders from DB (paged).
- **Name Mismatch**: Compares `CSV.customerName` vs `DB.customerName` for every invoice and reports discrepancies.
- **Top Customers**: Lists the top 5 customers by order count. If you see one customer with 1000+ orders where others have 10-50, it indicates a remaining collapse issue.
- **Salesperson Totals**: Retained the existing per-salesperson total checks.

## How to Test
1.  Run the Migration tool.
2.  Upload `EmployeeDailySales.csv`.
3.  Select "Clean Slate" or "Update/Upsert".
4.  Watch the logs in Step 3 and Step 4.
5.  **Verify**: At the end of Step 4, check the "Sales Verification Report".
    - Look for "Customer name mismatches".
    - Check "Top Customers by Order Count" - ensure the distribution looks realistic.
