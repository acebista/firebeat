# Nepal FMCG VAT, Dispatch & Reconciliation Engine
## Financial Systems Compliance Audit Report

**Auditor**: Senior Financial Systems Auditor  
**Audit Date**: 2026-01-12  
**Scope**: Business Logic, State Transitions, Financial Compliance  
**Framework**: IRD Nepal VAT Act, Electronic Billing Requirements  

---

## EXECUTIVE SUMMARY

| Category | Rating |
|----------|--------|
| **Overall System Deployability** | ⚠️ **HIGH RISK - NOT PRODUCTION READY** |
| **IRD Compliance** | 🔴 **CRITICAL GAPS** |
| **Inventory Integrity** | 🔴 **FATAL DEFICIENCY** |
| **Payment Integrity** | 🟡 **MEDIUM RISK** |
| **Audit Trail** | 🟡 **MODERATE GAPS** |

### Verdict
**This system is NOT legally deployable in Nepal without significant remediation.**

The codebase lacks fundamental financial controls required for IRD-compliant VAT billing. While operational delivery tracking exists, the system has no true VAT invoice generation engine, no inventory reconciliation logic, and allows mutable financial records.

---

## PART 1: SYSTEM FLOW RECONSTRUCTION

### 1.1 Reconstructed Data Pipeline (From Code Analysis)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CURRENT SYSTEM FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐     ┌──────────────┐     ┌─────────────────┐                 │
│  │  Sales   │────>│  Order       │────>│ Dispatch Trip   │                 │
│  │  Staff   │     │  (orders)    │     │ (trips)         │                 │
│  └──────────┘     └──────────────┘     └─────────────────┘                 │
│                          │                      │                           │
│                          │  status: 'approved'  │  status: 'dispatched'     │
│                          ▼                      ▼                           │
│                   ┌──────────────────────────────────────┐                 │
│                   │     DeliveryOrderDetails.tsx         │                 │
│                   │     (Delivery User Mobile App)       │                 │
│                   └──────────────────────────────────────┘                 │
│                          │                                                  │
│           ┌──────────────┼──────────────┬──────────────┐                   │
│           ▼              ▼              ▼              ▼                   │
│     ┌──────────┐  ┌──────────┐  ┌──────────────┐ ┌───────────┐            │
│     │ DELIVER  │  │ PARTIAL  │  │ RESCHEDULE   │ │  FAILED   │            │
│     │  (Full)  │  │ DELIVERY │  │              │ │           │            │
│     └──────────┘  └──────────┘  └──────────────┘ └───────────┘            │
│           │              │              │              │                   │
│           ▼              ▼              ▼              ▼                   │
│     ┌──────────────────────────────────────────────────────────┐          │
│     │                orders.status = 'delivered'               │          │
│     │                orders.payment_collected = X              │          │
│     │                orders.payment_method_at_delivery = Y     │◄── MUTABLE│
│     │                orders.remarks = "Returns: ..., Damages:" │          │
│     └──────────────────────────────────────────────────────────┘          │
│                          │                                                  │
│                          ▼                                                  │
│     ┌──────────────────────────────────────────────────────────┐          │
│     │              invoice_payments (Ledger)                   │          │
│     │              - Created on delivery                       │          │
│     │              - Can be DELETED and re-created ← DANGEROUS │          │
│     └──────────────────────────────────────────────────────────┘          │
│                          │                                                  │
│                          ▼                                                  │
│     ┌──────────────────────────────────────────────────────────┐          │
│     │              Reports.tsx / vatBilling.ts                 │          │
│     │              - Generates "VAT Bills" CLIENT-SIDE         │◄── FAKE  │
│     │              - NOT persisted to database                 │          │
│     │              - Recalculated on each page load            │          │
│     └──────────────────────────────────────────────────────────┘          │
│                                                                             │
│      ❌ NO vat_invoices TABLE EXISTS                                        │
│      ❌ NO vat_invoice_lines TABLE EXISTS                                   │
│      ❌ NO trip_inventory TABLE EXISTS                                      │
│      ❌ NO fiscal_year / invoice_number sequencing                          │
│      ❌ NO EOD Aggregator / Batch Job                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Key Findings from Flow Analysis

1. **Orders ARE VAT Invoices**: The system conflates operational orders with legal tax documents. There is no separate `vat_invoices` table. The `orders` table serves both purposes.

2. **Client-Side VAT Bill Generation**: `utils/vatBilling.ts` generates VAT bills **on-the-fly** during report rendering. These are NOT persisted. They are ephemeral report artifacts.

3. **No Immutability**: Delivered orders can be freely edited via `handleUpdateDelivery()`. Payment amounts, totals, and statuses are fully mutable.

4. **No Stock Loading Snapshot**: There is no `trip_inventory` or `loading_sheet` table. The system cannot answer: "What products were loaded on Truck X this morning?"

---

## PART 2: MANDATORY RULE COMPLIANCE TABLE

| Rule | Implemented? | Evidence | Risk Level |
|------|--------------|----------|------------|
| **A. Reschedule Isolation** | ✅ PARTIAL | `handleReschedule()` sets `assignedTripId: undefined`, clears from trip | 🟡 MEDIUM |
| | | Rescheduled orders DO require manual re-assignment | |
| | ⚠️ BUT | No new order clone is created—same order ID mutated | Double-billing possible if systems sync poorly |
| **B. Truck Reconciliation** | ❌ NOT IMPLEMENTED | No `trip_inventory` table exists | 🔴 FATAL |
| | | No `loaded_qty` field anywhere in codebase | |
| | | No unload calculation: `Unload = Load - Net + Returns` | |
| **C. Qty-to-Invoice Integrity** | ❌ NO ENFORCEMENT | Invoice qty derived from `order.items` which is mutable | 🔴 CRITICAL |
| | | Returns/damages parsed from remarks string, not structured data | |
| | | `sum(invoice_lines.qty) == sum(delivered.qty)` NOT checked | |
| **D. Payment Integrity** | ⚠️ WEAK | `invoice_payments` table exists | 🟡 MEDIUM |
| | | Payments CAN be deleted (`PaymentsService.deletePayment`) | |
| | | No server-side reconciliation: `sum(invoices) == sum(payments)` | |
| **E. NPR 50,000 Rule** | ✅ YES | `vatBilling.ts` line 116: `const THRESHOLD = 50000` | 🟢 LOW |
| | | Logic checks: `combinedTargetCollection + targetPayment > THRESHOLD` | |
| | | Cheque/Credit forced to Individual Bill | |
| **F. VAT Back-Calculation** | ✅ YES | `vatBilling.ts` line 99: `rateBeforeVat = rate / (1 + VAT_RATE)` | 🟢 LOW |
| | | Per-line calculation to avoid rounding drift | |

---

## PART 3: CRITICAL VIOLATIONS

### VIOLATION #1: NO PERSISTENT VAT INVOICES (FATAL)

**Location**: Entire codebase  
**Evidence**: 
```bash
grep -r "vat_invoice" --include="*.ts" --include="*.tsx" 
# Returns: 0 results
```

**Explanation**: The system has NO `vat_invoices` table. The `generateVatBills()` function in `utils/vatBilling.ts` produces ephemeral JavaScript objects that are:
- Never saved to database
- Regenerated on every report load
- Not sequentially numbered
- Not linked to a fiscal year

**IRD Impact**: Nepal IRD requires:
1. Sequential, gapless invoice numbers
2. Immutable invoice records
3. Database-backed audit trail

**Risk**: Any IRD audit will find ZERO tax invoices in the database. The business cannot prove what was billed.

---

### VIOLATION #2: NO INVENTORY LOADING/RECONCILIATION (FATAL)

**Location**: `services/db.ts` (TripService)  
**Evidence**:
```typescript
// TripService contains:
export const TripService = {
  getAll: () => fetchCollection<DispatchTrip>(COLS.TRIPS),
  getById: async (id: string) => {...},
  add: async (trip: Omit<DispatchTrip, 'id'>) => {...},
  update: async (id: string, data: Partial<DispatchTrip>) => {...},
  // NO loadTruckInventory() method
  // NO recordUnload() method
  // NO reconcileTrip() method
};
```

**Explanation**: No mechanism exists to record what products were loaded onto a truck. The formula:

```
Expected_Unload = Loaded_Qty − Net_Delivered + Market_Returns
```

CANNOT be computed because `Loaded_Qty` is never captured.

**Risk**: 
- Drivers can steal inventory with no detection
- Stock discrepancies are untrackable
- EOD reconciliation is impossible

---

### VIOLATION #3: MUTABLE FINANCIAL RECORDS (CRITICAL)

**Location**: `pages/delivery/DeliveryOrderDetails.tsx` lines 431-607  
**Evidence**:
```typescript
const handleUpdateDelivery = async () => {
    // ...
    await OrderService.update(order.id, updateData); // MUTABLE
    
    // Payments are DELETED and re-created
    const existingPayments = await PaymentsService.getPaymentsByInvoice(order.id, true);
    for (const p of existingPayments) {
        await PaymentsService.deletePayment(p.id); // DANGEROUS
    }
    // ...new payments created
};
```

**Explanation**: A delivery user can:
1. Mark an order as delivered for ₹10,000
2. Later "edit" and change payment to ₹5,000
3. The original ₹10,000 payment is PERMANENTLY DELETED

**IRD Impact**: This violates the fundamental principle of financial record immutability. Voiding should create a reversal entry, not delete history.

---

### VIOLATION #4: RETURNS/DAMAGES STORED AS TEXT (HIGH)

**Location**: `pages/delivery/DeliveryOrderDetails.tsx` lines 352-357  
**Evidence**:
```typescript
if (damages.length > 0) {
    remarkText += ` | Damages: ${damages.map(d => 
        `${d.productName}(${d.quantity}) - ${d.reason}`).join(', ')}`;
}
if (returnItems.length > 0) {
    remarkText += ` | Returns: ${returnItems.map(r => 
        `${r.productName}(${r.returnQty})`).join(', ')}`;
}
```

**Explanation**: Returns and damages are concatenated into a free-text `remarks` field and parsed via regex:

```typescript
// vatBilling.ts lines 29-40
export const parseReturnsFromRemarks = (remarks: string): Map<string, number> => {
    const match = remarks.match(/Returns:\s*([^|]+)/);
    // ...regex parsing
};
```

**Risk**:
- Regex can fail on edge cases (product names with parentheses, special characters)
- No referential integrity to products table
- Quantities can be mis-parsed
- No audit trail of who recorded returns

---

### VIOLATION #5: NO EOD AGGREGATOR (CRITICAL)

**Location**: N/A (Does not exist)  
**Evidence**:
```bash
grep -r "nightly" --include="*.ts" --include="*.tsx"
grep -r "batch" --include="*.ts" --include="*.tsx"  
grep -r "aggregator" --include="*.ts" --include="*.tsx"
# No functional aggregator found
```

**Explanation**: The architecture specifies:
> "After all delivery users sync, a server-side batch job must run."

No such job exists. VAT bills are generated client-side on-demand. There is no:
- Day-close verification
- Stock-to-cash reconciliation check
- Blocking mechanism for mismatches

---

## PART 4: FRAUD VECTORS IDENTIFIED

| Fraud Vector | Present? | Code Location | Severity |
|--------------|----------|---------------|----------|
| VAT invoices can be edited after posting | ✅ YES | `OrderService.update()` | 🔴 CRITICAL |
| Delivery qty can change after invoice | ✅ YES | `handleUpdateDelivery()` | 🔴 CRITICAL |
| Payments can change after invoice | ✅ YES | `PaymentsService.deletePayment()` | 🔴 CRITICAL |
| Orders can re-enter VAT pool | ⚠️ POSSIBLE | No status lock mechanism | 🟡 MEDIUM |
| Duplicate billing | ⚠️ POSSIBLE | No invoice_id uniqueness check in VAT gen | 🟡 MEDIUM |
| Stock disappears without trace | ✅ YES | No trip_inventory ledger | 🔴 CRITICAL |

---

## PART 5: SEVERITY SCORE

### Overall: **HIGH / FATAL**

| Component | Score |
|-----------|-------|
| Data Model Completeness | 3/10 |
| IRD Compliance | 2/10 |
| Financial Controls | 3/10 |
| Audit Trail | 4/10 |
| Operational Functionality | 7/10 |

---

## PART 6: REMEDIATION REQUIREMENTS

### Tier 1: BLOCKING (Must fix before any production use)

1. **Create `vat_invoices` and `vat_invoice_lines` tables**
   - Immutable (no UPDATE/DELETE policies)
   - Sequential `invoice_number` per fiscal year
   - Link to source `order_id`

2. **Create `trip_inventory` table**
   - Capture `loaded_qty` at trip start
   - Track `returned_qty` and `damage_qty` at trip end
   - Enforce reconciliation formula

3. **Implement EOD Aggregator Service**
   - Server-side Supabase Edge Function
   - Block day close if: `sum(invoice_qty) ≠ sum(delivered_qty)`
   - Block day close if: `sum(invoice_value) ≠ sum(payments)`

4. **Remove `PaymentsService.deletePayment()`**
   - Replace with immutable `voidPayment()` that creates reversal entry
   - Never delete financial records

### Tier 2: HIGH PRIORITY

5. **Migrate returns/damages from remarks to structured tables**
   - Use existing `sales_returns` table properly
   - Link to `order_items` with FK

6. **Add RLS policies preventing delivery user from editing financials after trip completion**
   ```sql
   CREATE POLICY "delivery_cannot_edit_completed"
   ON orders FOR UPDATE
   USING (auth.uid() = delivered_by AND status != 'completed')
   ```

### Tier 3: RECOMMENDED

7. **Implement gapless invoice number generator**
   ```sql
   CREATE SEQUENCE vat_invoice_seq START 1;
   ```

8. **Add `trip_locked_at` timestamp to prevent late edits**

---

## CONCLUSION

This codebase implements a functional **delivery tracking system** but does NOT implement a **VAT-compliant billing system**. 

The critical gap is that VAT invoices exist only as ephemeral client-side calculations, not as immutable database records. For IRD compliance, the system must:

1. Persist VAT invoices at the moment of delivery completion
2. Make those records immutable
3. Link them to a sequential numbering system
4. Enforce stock reconciliation before allowing day closure

**Without these changes, this system cannot be legally deployed for commercial FMCG distribution in Nepal.**

---

*Audit completed by Senior Financial Systems Auditor*  
*Report generated: 2026-01-12*
