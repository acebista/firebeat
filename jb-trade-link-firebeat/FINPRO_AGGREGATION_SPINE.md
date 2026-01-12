# FinPro Aggregation Spine
## Nepal FMCG Delivery → VAT Aggregation → FinPro Export Engine

**Version**: 1.0.0  
**Date**: 2026-01-12  
**Status**: Production Ready  

---

## 1. Executive Summary

This document describes the **Financial Spine** that transforms the operational delivery tracking system into a FinPro-ready VAT aggregation engine.

### What This System Does
- **Tracks every unit** loaded onto trucks and returned unsold
- **Tracks every rupee** collected via cash, QR, cheque, or credit
- **Applies IRD rules** (50k threshold, PAN, payment types)
- **Generates export batches** for FinPro (IRD-approved billing software)

### What This System Does NOT Do
- ❌ Generate VAT invoices (that's FinPro's job)
- ❌ Assign invoice numbers (that's FinPro's job)
- ❌ Manage fiscal years (that's FinPro's job)

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       FINPRO AGGREGATION SPINE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────┐                                                     │
│  │  TRIP LOADING  │ ← Admin loads truck before dispatch                 │
│  │  trip_loads    │                                                     │
│  └───────┬────────┘                                                     │
│          │                                                               │
│          ▼                                                               │
│  ┌────────────────────────────────────────────┐                         │
│  │           DELIVERY OPERATIONS              │                         │
│  │  (Existing System - unchanged)             │                         │
│  │  - Orders delivered                        │                         │
│  │  - Payments collected                      │                         │
│  │  - Returns/damages recorded                │                         │
│  └───────────────────┬────────────────────────┘                         │
│                      │                                                   │
│                      ▼                                                   │
│  ┌────────────────┐  ┌────────────────┐                                 │
│  │ TRIP UNLOADING │  │ RECONCILIATION │                                 │
│  │ trip_unloads   │  │ Load = Del +   │                                 │
│  │ (unsold, dmg)  │  │   Unsold + Dmg │                                 │
│  └───────┬────────┘  └───────┬────────┘                                 │
│          │                   │                                          │
│          └─────────┬─────────┘                                          │
│                    ▼                                                     │
│  ┌────────────────────────────────────────────┐                         │
│  │           TRIP CLOSURE                      │ ← Admin closes trip    │
│  │  trip_closures                              │   (IMMUTABLE after)    │
│  │  - Validates reconciliation                 │                        │
│  │  - Calculates financial totals              │                        │
│  │  - Locks trip from edits                    │                        │
│  └─────────────────┬──────────────────────────┘                         │
│                    │                                                     │
│                    ▼                                                     │
│  ┌────────────────────────────────────────────┐                         │
│  │       FINPRO BATCH GENERATION              │ ← Nightly job          │
│  │  finpro_batches + finpro_batch_lines       │                        │
│  │                                            │                        │
│  │  Rules Applied:                            │                        │
│  │  • PAN → Individual batch                  │                        │
│  │  • Cheque → Individual batch               │                        │
│  │  • Credit → Individual batch               │                        │
│  │  • Mixed → Individual batch               │                        │
│  │  • Cash/QR > 50k → Individual batch        │                        │
│  │  • Small Cash/QR → Merged batch            │                        │
│  └─────────────────┬──────────────────────────┘                         │
│                    │                                                     │
│                    ▼                                                     │
│  ┌────────────────────────────────────────────┐                         │
│  │           JSON EXPORT                       │                        │
│  │  {                                          │                        │
│  │    date: "2026-01-12",                      │                        │
│  │    invoices: [                              │                        │
│  │      { type: "MERGED_CASH", total: 49870,  │                        │
│  │        lines: [...] }                       │                        │
│  │    ]                                        │                        │
│  │  }                                          │                        │
│  └─────────────────┬──────────────────────────┘                         │
│                    │                                                     │
│                    ▼                                                     │
│            ┌──────────────┐                                             │
│            │   FINPRO     │ ← IRD-Approved Billing Software             │
│            │  (External)  │   Creates legal VAT invoices                │
│            └──────────────┘                                             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema

### 3.1 New Tables

| Table | Purpose |
|-------|---------|
| `trip_loads` | Products loaded onto truck before dispatch |
| `trip_unloads` | Products returned (unsold + damaged) after delivery |
| `trip_closures` | Formal trip closure record (IMMUTABLE) |
| `finpro_batches` | Aggregated batches for FinPro export |
| `finpro_batch_lines` | Line items within each batch |

### 3.2 Key Relationships

```sql
trip_loads.trip_id → trips.id
trip_unloads.trip_id → trips.id
trip_closures.trip_id → trips.id
finpro_batches.source_order_ids → orders.id[]
finpro_batch_lines.batch_id → finpro_batches.id
finpro_batch_lines.source_order_id → orders.id
```

### 3.3 RLS Policies

| Table | Policy | Enforcement |
|-------|--------|-------------|
| `trip_loads` | Cannot modify after trip_closures exists | UPDATE/DELETE blocked |
| `trip_unloads` | Cannot modify after trip_closures exists | UPDATE/DELETE blocked |
| `trip_closures` | Admin insert only, immutable | Only variance approval updateable |
| `finpro_batches` | Cannot modify after exported_at is set | UPDATE blocked after export |
| `orders` | Cannot modify if trip is closed | UPDATE blocked on closed trips |
| `invoice_payments` | Cannot modify if order's trip is closed | UPDATE/DELETE blocked |

---

## 4. Business Rules Implemented

### 4.1 Stock Reconciliation Formula

```
VARIANCE = Loaded - Delivered - Unsold - Damaged
```

| Variance | Meaning | Action |
|----------|---------|--------|
| `0` | Perfect reconciliation | Trip can close normally |
| `> 0` | Missing stock | Requires admin approval with reason |
| `< 0` | Extra stock (impossible) | Data entry error, investigate |

### 4.2 Batch Classification Rules

| Rule # | Condition | Batch Type |
|--------|-----------|------------|
| 1 | Customer has PAN | `INDIVIDUAL_PAN` |
| 2 | Payment includes cheque | `INDIVIDUAL_CHEQUE` |
| 3 | Amount not fully paid (credit) | `INDIVIDUAL_CREDIT` |
| 4 | Multiple payment methods | `INDIVIDUAL_MIXED` |
| 5 | Cash + QR > ₹50,000 | `INDIVIDUAL_OVER_50K` |
| 6 | Small cash/QR only | `MERGED_CASH_QR` |

### 4.3 Merged Batch Rules

- Multiple small orders combined into one batch
- Each batch capped at ₹50,000 total
- Lines are aggregated by product + rate
- Source order IDs tracked for audit

---

## 5. Services Reference

### 5.1 TripStockService

```typescript
import { TripStockService } from './services/finpro';

// Load truck
await TripStockService.loadTruck({
    trip_id: 'trip_123',
    items: [
        { product_id: 'prod_1', qty: 100 },
        { product_id: 'prod_2', qty: 50 }
    ]
});

// Auto-generate loads from orders
const loads = await TripStockService.generateLoadsFromOrders('trip_123');
await TripStockService.loadTruck(loads);

// Record unloads
await TripStockService.unloadTruck({
    trip_id: 'trip_123',
    items: [
        { product_id: 'prod_1', qty_unsold: 10, qty_damaged: 2, damage_reason: 'Crushed' }
    ]
});

// Get reconciliation
const recon = await TripStockService.getStockReconciliation('trip_123');
// Returns: [{ product_id, product_name, qty_loaded, qty_delivered, qty_unsold, qty_damaged, variance }]
```

### 5.2 TripClosureService

```typescript
import { TripClosureService } from './services/finpro';

// Preview closure (doesn't actually close)
const preview = await TripClosureService.previewClosure('trip_123');
// preview.hasVariance, preview.financials, preview.reconciliation

// Close trip (normal - no variance)
const result = await TripClosureService.closeTrip({
    tripId: 'trip_123'
});

// Force close with variance
const result = await TripClosureService.closeTrip({
    tripId: 'trip_123',
    forceClose: true,
    varianceApprovalReason: 'Driver shortage approved by manager'
});

// Get trips ready for closure
const tripIds = await TripClosureService.getTripsReadyForClosure();
```

### 5.3 FinProAggregationService

```typescript
import { FinProAggregationService } from './services/finpro';

// Generate batches for a date
const result = await FinProAggregationService.generateFinProBatches({
    date: '2026-01-12'
});
// result.batches, result.summary

// Save batches to database
await FinProAggregationService.saveBatches(result.batches);

// Export for FinPro
const exportData = await FinProAggregationService.exportForFinPro('2026-01-12');
// exportData.invoices[].type, .total, .payment, .lines

// Mark as exported
await FinProAggregationService.markAsExported(['batch_id_1', 'batch_id_2'], 'FINPRO-2026-001');
```

---

## 6. React Hooks Reference

### 6.1 useTripStock

```tsx
const {
    loads,           // TripLoad[]
    unloads,         // TripUnload[]
    reconciliation,  // StockReconciliationRow[]
    loading,
    error,
    isClosed,
    loadTruck,       // (items) => Promise<boolean>
    unloadTruck,     // (items) => Promise<boolean>
    autoGenerateLoads, // () => Promise<boolean>
    refreshReconciliation
} = useTripStock(tripId);
```

### 6.2 useTripClosure

```tsx
const {
    closurePreview,  // CloseTripResult
    loading,
    error,
    previewClosure,  // () => Promise<void>
    closeTrip        // (force?, reason?) => Promise<boolean>
} = useTripClosure(tripId);
```

### 6.3 useFinProBatches

```tsx
const {
    batches,         // FinProBatch[]
    generateResult,  // GenerateBatchesResult
    loading,
    error,
    generateBatches, // (date, tripIds?) => Promise<boolean>
    saveBatches,     // () => Promise<boolean>
    loadBatches,     // (date) => Promise<void>
    exportForFinPro, // (date) => Promise<FinProExport>
    markAsExported,  // (ids, ref?) => Promise<boolean>
    deleteBatches    // (date) => Promise<boolean>
} = useFinProBatches();
```

---

## 7. FinPro Export Format

```json
{
  "date": "2026-01-12",
  "generated_at": "2026-01-12T14:30:00Z",
  "invoices": [
    {
      "type": "MERGED_CASH_QR",
      "total": 49870,
      "payment": {
        "cash": 35000,
        "qr": 14870
      },
      "lines": [
        {
          "sku": "MILK1L",
          "product_name": "Full Cream Milk 1L",
          "qty": 120,
          "rate": 55,
          "amount": 6600
        },
        {
          "sku": "BISCUIT",
          "product_name": "Digestive Biscuits",
          "qty": 200,
          "rate": 15,
          "amount": 3000
        }
      ]
    },
    {
      "type": "INDIVIDUAL_CREDIT",
      "customer_name": "Sharma General Store",
      "customer_pan": "123456789",
      "total": 25000,
      "payment": {
        "cash": 15000,
        "credit": 10000
      },
      "lines": [...]
    }
  ]
}
```

---

## 8. Operational Workflow

### 8.1 Morning: Truck Loading

1. Admin goes to **FinPro Dashboard** → **Trip Closure** tab
2. Selects trip that's going out for delivery
3. Clicks **"Auto-Load from Orders"** to generate loading list
4. Verifies quantities match physical loading
5. Truck departs

### 8.2 Evening: Trip Return

1. Truck returns, driver reports unsold items
2. Admin records unloads (unsold + damaged)
3. System calculates reconciliation automatically

### 8.3 Night: Trip Closure

1. Admin reviews stock reconciliation
2. If variance = 0: Click **"Close Trip"**
3. If variance ≠ 0: 
   - Investigate discrepancy
   - If approved write-off: Enter reason and **"Force Close"**
4. Trip is now locked - no more edits to orders/payments

### 8.4 EOD: FinPro Export

1. Admin goes to **FinPro Dashboard** → **FinPro Batches** tab
2. Selects date
3. Clicks **"Generate Batches"**
4. Reviews summary (individual vs merged)
5. Clicks **"Save Batches"** to persist
6. Clicks **"Export JSON"** to download
7. Imports JSON into FinPro
8. FinPro generates legal VAT invoices

---

## 9. Migration Path

### Step 1: Create Tables
```bash
# Run the migration
psql $DATABASE_URL < supabase/migrations/001_finpro_spine.sql
```

### Step 2: Add to Routes
```tsx
// In your router configuration
import { FinProDashboard } from './pages/admin/FinProDashboard';

<Route path="/admin/finpro" element={<FinProDashboard />} />
```

### Step 3: Add Navigation
```tsx
// In your admin sidebar
<NavLink to="/admin/finpro">
    <FileOutput className="h-4 w-4" />
    FinPro Dashboard
</NavLink>
```

---

## 10. Security Considerations

1. **Immutability**: Trip closures cannot be deleted or reopened
2. **Variance Audit**: All force-closes with variance are logged with reason and approver
3. **Export Lock**: Batches cannot be modified after export
4. **RLS Enforcement**: Database-level policies prevent tampering
5. **Order Lock**: Orders on closed trips cannot be edited (even by admin without DB access)

---

## 11. Audit Trail

All operations are tracked:

| Event | Location | Fields |
|-------|----------|--------|
| Truck loaded | `trip_loads.loaded_at`, `loaded_by` | User + timestamp |
| Truck unloaded | `trip_unloads.recorded_at`, `recorded_by` | User + timestamp |
| Trip closed | `trip_closures.closed_at`, `closed_by` | User + timestamp + financials snapshot |
| Variance approved | `trip_closures.variance_*` | Approver + reason + timestamp |
| Batch created | `finpro_batches.created_at`, `created_by` | User + timestamp |
| Batch exported | `finpro_batches.exported_at`, `exported_by` | User + timestamp + FinPro reference |

---

## 12. Quality Standards Met

| Standard | Implementation |
|----------|----------------|
| **Mathematically correct** | Golden formula enforced: Load = Del + Unsold + Dmg |
| **Impossible to tamper** | RLS policies + immutability after closure |
| **Auditable** | Complete audit trail with user + timestamp |
| **Scalable** | Indexes on all query paths, batch processing for 2000+ invoices |

---

## Appendix A: Troubleshooting

### "Trip closure blocked by variance"
- Review reconciliation grid
- Either correct unload quantities or use force-close with reason

### "Batches not generating"
- Ensure trips are closed (`trip_closures` exists)
- Check that orders have status 'delivered' or 'completed'

### "Cannot modify order"
- Order is on a closed trip
- This is by design - financial integrity

### "Export shows 0 batches"
- No closed trips for selected date
- Or batches haven't been saved yet

---

*Document generated by Financial Systems Engineer*  
*Implementation date: 2026-01-12*
