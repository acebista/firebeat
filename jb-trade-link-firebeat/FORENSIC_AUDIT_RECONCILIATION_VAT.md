# FORENSIC AUDIT: RECONCILIATION & VAT ENGINE
**Complete Code Disclosure - No Summaries**

Generated: 2026-01-12  
System: Nepal FMCG Delivery → Stock Reconciliation → VAT Batching → FinPro Export

---

## 1️⃣ RECONCILIATION ENGINE - COMPLETE DISCLOSURE

### A. DATA INPUTS - TABLE AND FIELD MAPPING

#### SOURCE 1: Trip Loads (What was loaded on truck)
**Table**: `public.trip_loads`
**Fields**:
- `trip_id` (TEXT) - foreign key to trips table
- `product_id` (TEXT) - foreign key to products table  
- `qty_loaded` (INTEGER) - quantity loaded onto truck
- `loaded_by` (UUID) - user who loaded
- `loaded_at` (TIMESTAMPTZ) - timestamp of loading

**Population Method**:
```typescript
// File: services/finpro/TripStockService.ts, Line 97-133
loadTruck: async (input: LoadTruckInput): Promise<TripLoad[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Check if trip is already closed
    const { data: closure } = await supabase
        .from('trip_closures')
        .select('id')
        .eq('trip_id', input.trip_id)
        .single();

    if (closure) {
        throw new Error('Cannot load truck: Trip is already closed');
    }

    // Upsert loads (allows updating if mistake during loading)
    const loads = input.items.map(item => ({
        trip_id: input.trip_id,
        product_id: item.product_id,
        qty_loaded: item.qty,
        loaded_by: userId,
        loaded_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
        .from('trip_loads')
        .upsert(loads, { onConflict: 'trip_id,product_id' })
        .select();

    if (error) {
        console.error('[TripStockService] Error loading truck:', error);
        throw error;
    }

    console.log(`[TripStockService] Loaded ${loads.length} products onto trip ${input.trip_id}`);
    return data;
}
```

**Auto-Generation Option**:
```typescript
// File: services/finpro/TripStockService.ts, Line 490-533
generateLoadsFromOrders: async (tripId: string): Promise<LoadTruckInput> => {
    // Get all orders assigned to this trip
    const { data: orders, error } = await supabase
        .from('orders')
        .select('items')
        .eq('assignedTripId', tripId);

    if (error) throw error;

    const productQtyMap = new Map<string, number>();

    for (const order of orders || []) {
        let items = order.items;
        if (typeof items === 'string') {
            try {
                items = JSON.parse(items);
            } catch (e) {
                continue;
            }
        }

        if (!Array.isArray(items)) continue;

        for (const item of items) {
            const productId = item.productId || item.product_id;
            const qty = Number(item.qty || item.quantity) || 0;

            if (productId && qty > 0) {
                const current = productQtyMap.get(productId) || 0;
                productQtyMap.set(productId, current + qty);
            }
        }
    }

    const loadItems = Array.from(productQtyMap.entries()).map(([product_id, qty]) => ({
        product_id,
        qty
    }));

    return {
        trip_id: tripId,
        items: loadItems
    };
}
```

---

#### SOURCE 2: Delivered Quantities (What was actually sold)
**Table**: `public.orders`
**Fields Used**:
- `assignedTripId` (TEXT) - which trip
- `status` (TEXT) - must be 'delivered' or 'completed'
- `items` (JSONB/TEXT) - array of order items
- `remarks` (TEXT) - contains returns/damages in format: "Returns: ProductA(5), ProductB(3)"

**Calculation Method**:
```typescript
// File: services/finpro/TripStockService.ts, Line 208-254
calculateDeliveredQuantities: async (tripId: string): Promise<Map<string, number>> => {
    // Get all delivered orders for this trip
    const { data: orders, error } = await supabase
        .from('orders')
        .select('id, items, remarks, status')
        .eq('assignedTripId', tripId)
        .in('status', ['delivered', 'completed']);

    if (error) throw error;

    const deliveredQty = new Map<string, number>();

    for (const order of orders || []) {
        // Parse items
        let items = order.items;
        if (typeof items === 'string') {
            try {
                items = JSON.parse(items);
            } catch (e) {
                console.error('[TripStockService] Failed to parse items for order:', order.id);
                continue;
            }
        }

        if (!Array.isArray(items)) continue;

        // Parse returns from remarks to subtract
        const returnMap = parseReturnsFromRemarks(order.remarks || '');

        for (const item of items) {
            const productId = item.productId || item.product_id;
            const orderQty = Number(item.qty || item.quantity) || 0;
            const productName = item.productName || item.tempProductName || '';

            // Subtract returns
            const returnQty = returnMap.get(productName.toLowerCase()) || 0;
            const netDelivered = Math.max(0, orderQty - returnQty);

            if (productId && netDelivered > 0) {
                const current = deliveredQty.get(productId) || 0;
                deliveredQty.set(productId, current + netDelivered);
            }
        }
    }

    return deliveredQty;
}
```

**Returns Parsing**:
```typescript
// File: services/finpro/TripStockService.ts, Line 544-560
function parseReturnsFromRemarks(remarks: string): Map<string, number> {
    const returnMap = new Map<string, number>();
    if (!remarks || !remarks.includes('Returns:')) return returnMap;

    const match = remarks.match(/Returns:\s*([^|]+)/);
    if (!match) return returnMap;

    const parts = match[1].split(',').map(p => p.trim());
    parts.forEach(part => {
        const m = part.match(/(.+)\((\d+)\)/);
        if (m) {
            returnMap.set(m[1].trim().toLowerCase(), parseInt(m[2]));
        }
    });

    return returnMap;
}
```

---

#### SOURCE 3: Returns from All Sources
**Tables**:
1. `public.orders.remarks` (TEXT) - "Returns: ProductA(5)"
2. `public.sales_returns` (JSONB) - formal return records

**Aggregation Method**:
```typescript
// File: services/finpro/TripStockService.ts, Line 338-397
calculateReturnsFromAllSources: async (tripId: string): Promise<Map<string, number>> => {
    const returnsMap = new Map<string, number>();

    // 1. Get returns from order remarks
    const { data: orders } = await supabase
        .from('orders')
        .select('id, items, remarks')
        .eq('assignedTripId', tripId)
        .in('status', ['delivered', 'completed']);

    for (const order of orders || []) {
        const remarkReturns = parseReturnsFromRemarks(order.remarks || '');

        // Map product names back to IDs
        let items = order.items;
        if (typeof items === 'string') {
            try { items = JSON.parse(items); } catch (e) { continue; }
        }

        if (!Array.isArray(items)) continue;

        for (const item of items) {
            const productId = item.productId || item.product_id;
            const productName = (item.productName || item.tempProductName || '').toLowerCase();
            const returnQty = remarkReturns.get(productName) || 0;

            if (productId && returnQty > 0) {
                const current = returnsMap.get(productId) || 0;
                returnsMap.set(productId, current + returnQty);
            }
        }
    }

    // 2. Get returns from sales_returns table
    const { data: salesReturns } = await supabase
        .from('sales_returns')
        .select('items')
        .in('invoice_id', orders?.map(o => o.id) || []);

    for (const salesReturn of salesReturns || []) {
        let items = salesReturn.items;
        if (typeof items === 'string') {
            try { items = JSON.parse(items); } catch (e) { continue; }
        }

        if (!Array.isArray(items)) continue;

        for (const item of items) {
            const productId = item.productId || item.product_id;
            const qty = Number(item.qty || item.returned_qty) || 0;

            if (productId && qty > 0) {
                const current = returnsMap.get(productId) || 0;
                returnsMap.set(productId, current + qty);
            }
        }
    }

    return returnsMap;
}
```

---

#### SOURCE 4: Damages from All Sources
**Tables**:
1. `public.orders.remarks` (TEXT) - "Damages: ProductA(2)"
2. `public.damaged_goods_log` - formal damage records

**Aggregation Method**:
```typescript
// File: services/finpro/TripStockService.ts, Line 403-456
calculateDamagesFromAllSources: async (tripId: string): Promise<Map<string, number>> => {
    const damagesMap = new Map<string, number>();

    // 1. Get damages from order remarks
    const { data: orders } = await supabase
        .from('orders')
        .select('id, items, remarks')
        .eq('assignedTripId', tripId)
        .in('status', ['delivered', 'completed']);

    for (const order of orders || []) {
        const remarkDamages = parseDamagesFromRemarks(order.remarks || '');

        // Map product names back to IDs
        let items = order.items;
        if (typeof items === 'string') {
            try { items = JSON.parse(items); } catch (e) { continue; }
        }

        if (!Array.isArray(items)) continue;

        for (const item of items) {
            const productId = item.productId || item.product_id;
            const productName = (item.productName || item.tempProductName || '').toLowerCase();
            const damageQty = remarkDamages.get(productName) || 0;

            if (productId && damageQty > 0) {
                const current = damagesMap.get(productId) || 0;
                damagesMap.set(productId, current + damageQty);
            }
        }
    }

    // 2. Get damages from damaged_goods_log
    const { data: trip } = await supabase
        .from('trips')
        .select('deliveryDate')
        .eq('id', tripId)
        .single();

    if (trip?.deliveryDate) {
        const { data: damageLogs } = await supabase
            .from('damaged_goods_log')
            .select('product_id, qty')
            .eq('date', trip.deliveryDate);

        for (const log of damageLogs || []) {
            const current = damagesMap.get(log.product_id) || 0;
            damagesMap.set(log.product_id, current + (log.qty || 0));
        }
    }

    return damagesMap;
}
```

**Damages Parsing**:
```typescript
// File: services/finpro/TripStockService.ts, Line 566-583
function parseDamagesFromRemarks(remarks: string): Map<string, number> {
    const damageMap = new Map<string, number>();
    if (!remarks || (!remarks.includes('Damages:') && !remarks.includes('Damaged:'))) return damageMap;

    // Try both "Damages:" and "Damaged:" patterns
    const match = remarks.match(/Damag(?:es?|ed):\s*([^|]+)/i);
    if (!match) return damageMap;

    const parts = match[1].split(',').map(p => p.trim());
    parts.forEach(part => {
        const m = part.match(/(.+)\((\d+)\)/);
        if (m) {
            damageMap.set(m[1].trim().toLowerCase(), parseInt(m[2]));
        }
    });

    return damageMap;
}
```

---

#### SOURCE 5: Manual Unload Entries
**Table**: `public.trip_unloads`
**Fields**:
- `trip_id` (TEXT)
- `product_id` (TEXT)
- `qty_unsold` (INTEGER) - manually entered unsold quantity
- `qty_damaged` (INTEGER) - manually entered damaged quantity
- `damage_reason` (TEXT) - reason for damage
- `recorded_by` (UUID)
- `recorded_at` (TIMESTAMPTZ)

**Population Method**:
```typescript
// File: services/finpro/TripStockService.ts, Line 139-176
unloadTruck: async (input: UnloadTruckInput): Promise<TripUnload[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Check if trip is already closed
    const { data: closure } = await supabase
        .from('trip_closures')
        .select('id')
        .eq('trip_id', input.trip_id)
        .single();

    if (closure) {
        throw new Error('Cannot unload truck: Trip is already closed');
    }

    const unloads = input.items.map(item => ({
        trip_id: input.trip_id,
        product_id: item.product_id,
        qty_unsold: item.qty_unsold,
        qty_damaged: item.qty_damaged,
        damage_reason: item.damage_reason || null,
        recorded_by: userId,
        recorded_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
        .from('trip_unloads')
        .upsert(unloads, { onConflict: 'trip_id,product_id' })
        .select();

    if (error) {
        console.error('[TripStockService] Error unloading truck:', error);
        throw error;
    }

    console.log(`[TripStockService] Recorded ${unloads.length} unload items for trip ${input.trip_id}`);
    return data;
}
```

---

### B. THE RECONCILIATION FORMULA - EXACT CODE

**Location**: `services/finpro/TripStockService.ts`, Line 260-332

```typescript
getStockReconciliation: async (tripId: string): Promise<StockReconciliationRow[]> => {
    // Get loads
    const loads = await TripStockService.getTripLoads(tripId);
    const loadMap = new Map<string, number>();
    loads.forEach(l => loadMap.set(l.product_id, l.qty_loaded));

    // Get manual unloads (if entered)
    const unloads = await TripStockService.getTripUnloads(tripId);
    const unloadMap = new Map<string, { unsold: number; damaged: number }>();
    unloads.forEach(u => unloadMap.set(u.product_id, {
        unsold: u.qty_unsold,
        damaged: u.qty_damaged
    }));

    // Get delivered quantities (already subtracts returns from remarks)
    const deliveredMap = await TripStockService.calculateDeliveredQuantities(tripId);

    // Get returns from all sources
    const returnsMap = await TripStockService.calculateReturnsFromAllSources(tripId);

    // Get damages from all sources
    const damagesMap = await TripStockService.calculateDamagesFromAllSources(tripId);

    // Get product names
    const productIds = new Set([
        ...loadMap.keys(),
        ...unloadMap.keys(),
        ...deliveredMap.keys(),
        ...returnsMap.keys(),
        ...damagesMap.keys()
    ]);

    const { data: products } = await supabase
        .from('products')
        .select('id, name')
        .in('id', Array.from(productIds));

    const productNameMap = new Map<string, string>();
    (products || []).forEach(p => productNameMap.set(p.id, p.name));

    // Build reconciliation rows
    const rows: StockReconciliationRow[] = [];

    for (const productId of productIds) {
        const loaded = loadMap.get(productId) || 0;
        const delivered = deliveredMap.get(productId) || 0;
        const returned = returnsMap.get(productId) || 0;
        const damaged = damagesMap.get(productId) || 0;
        const unload = unloadMap.get(productId) || { unsold: 0, damaged: 0 };

        // ═══════════════════════════════════════════════════════════
        // EXPECTED UNLOAD CALCULATION - THE GOLDEN FORMULA
        // ═══════════════════════════════════════════════════════════
        // What should be in the van = Loaded - Delivered
        // (Delivered is already net of returns)
        const expected_unload = Math.max(0, loaded - delivered);
        // ═══════════════════════════════════════════════════════════

        rows.push({
            product_id: productId,
            product_name: productNameMap.get(productId) || 'Unknown',
            qty_loaded: loaded,
            qty_delivered: delivered,
            qty_returned: returned,
            qty_damaged: damaged,
            expected_unload,
            actual_unsold: unload.unsold,
            actual_damaged: unload.damaged
        });
    }

    // Sort by expected unload (show items to return first)
    rows.sort((a, b) => b.expected_unload - a.expected_unload);

    return rows;
}
```

**FORMULA BREAKDOWN**:
```
expected_unload = Math.max(0, loaded - delivered)

WHERE:
  loaded = qty_loaded from trip_loads table (INTEGER)
  delivered = calculated net delivered quantity (order items minus returns)
  
DELIVERED CALCULATION:
  delivered = SUM(order_item.qty) - SUM(returns_from_remarks) 
            FOR ALL orders WHERE status IN ('delivered', 'completed')
            AND assignedTripId = tripId
            GROUP BY product_id

RETURNS CALCULATION:
  returns = SUM(remarks_returns) + SUM(sales_returns.items.qty)

DAMAGES CALCULATION:
  damages = SUM(remarks_damages) + SUM(damaged_goods_log.qty)
```

**ROUNDING RULES**:
- No rounding applied
- All quantities are INTEGER
- Math.max(0, ...) prevents negative values

---

### C. ENFORCEMENT - COMPLETE CODE

#### Blocking Mechanism

**NOT IMPLEMENTED**

The system does NOT block trip closure based on stock variance.

**Original Implementation (REMOVED)**:
Previously, the system had variance-based blocking in `FinProDashboard.tsx` which was removed.

**Current Behavior**:
```typescript
// File: services/finpro/TripStockService.ts
// Lines 97-110, 139-152

// GUARD: Prevents loading/unloading after closure
const { data: closure } = await supabase
    .from('trip_closures')
    .select('id')
    .eq('trip_id', input.trip_id)
    .single();

if (closure) {
    throw new Error('Cannot load truck: Trip is already closed');
    // or
    throw new Error('Cannot unload truck: Trip is already closed');
}
```

#### Mismatch Logging

**NOT IMPLEMENTED**

No automatic logging of stock discrepancies exists.

**What IS Logged**:
```typescript
// File: services/finpro/TripStockService.ts, Line 131
console.log(`[TripStockService] Loaded ${loads.length} products onto trip ${input.trip_id}`);

// Line 174
console.log(`[TripStockService] Recorded ${unloads.length} unload items for trip ${input.trip_id}`);
```

#### Database-Level Protection

**SQL**: `supabase/migrations/001_finpro_spine.sql`

**Lines 203-215**: Prevent editing loads after closure
```sql
CREATE POLICY "trip_loads_update" ON trip_loads FOR UPDATE USING (
    -- Only allowed if trip is NOT closed
    NOT EXISTS (
        SELECT 1 FROM trip_closures tc WHERE tc.trip_id = trip_loads.trip_id
    )
    AND (
        -- Admin can always update open trips
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
        OR
        -- Original loader can update before closure
        loaded_by = auth.uid()
    )
);
```

**Lines 234-242**: Prevent editing unloads after closure
```sql
CREATE POLICY "trip_unloads_update" ON trip_unloads FOR UPDATE USING (
    NOT EXISTS (
        SELECT 1 FROM trip_closures tc WHERE tc.trip_id = trip_unloads.trip_id
    )
    AND (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
        OR recorded_by = auth.uid()
    )
);
```

**Lines 307-318**: Prevent editing orders after trip closure
```sql
CREATE POLICY "orders_prevent_edit_after_closure" ON orders FOR UPDATE USING (
    -- Allow if no trip assigned
    "assignedTripId" IS NULL
    OR
    -- Allow if trip is not closed
    NOT EXISTS (
        SELECT 1 FROM trip_closures tc WHERE tc.trip_id = orders."assignedTripId"
    )
    OR
    -- Admin override with explicit permission
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);
```

---

## 2️⃣ VAT AGGREGATION & BATCHING LOGIC

### A. CLASSIFICATION RULES - COMPLETE CODE

**Location**: `utils/vatBilling.ts`, Line 114-259

```typescript
export const generateVatBills = (rows: DeliveryReportRow[], forcedIndividualIds: string[] = []): VatBill[] => {
    const bills: VatBill[] = [];
    const THRESHOLD = 50000;  // ₹50,000
    const VAT_RATE = 0.13;    // 13%
```

**CLASSIFICATION LOGIC**:

```typescript
// Line 202-216
allNetItems.forEach(row => {
    const method = row.paymentMethod.toLowerCase();
    const items = row.items;

    // For billing purposes:
    // 1. If we have a collected amount, that's our target (matches money in hand)
    // 2. If collected is 0 (Credit), the target is the full net amount
    const targetPayment = row.collectedAmount > 0 ? row.collectedAmount : row.netAmount;

    const isCombinedCandidate =
        method !== 'cheque' &&
        method !== 'credit' &&
        !forcedIndividualIds.includes(row.invoiceId) &&
        row.collectedAmount > 0; // Credit must be individual to show full amount

    if (!isCombinedCandidate) {
        // CREATE INDIVIDUAL BILL
```

**CLASSIFICATION TABLE**:

| Condition | Individual vs Merged | Code Reference |
|-----------|---------------------|----------------|
| Cash only | **MERGED** (Combined Bill) | Line 211: `isCombinedCandidate = true` (if not forcedto separate) |
| QR only | **MERGED** (Combined Bill) | Line 211: cash/qr grouped together |
| Mixed payment | Parsed, each method separate | Lines 68-87: `findAndSubtractQty` |
| Cheque | **INDIVIDUAL** | Line 212: `method !== 'cheque'` |
| Credit | **INDIVIDUAL** | Line 213: `method !== 'credit'` |
| PAN exists | **INDIVIDUAL** (if forced) | Line 214: `forcedIndividualIds.includes()` |
| Amount > ₹50,000 | **NEW COMBINED BILL** (flush previous) | Line 239: `if (combined + target > THRESHOLD && combined > 0) flush()` |

**FORCING INDIVIDUAL**:
```typescript
// Line 214
!forcedIndividualIds.includes(row.invoiceId)

// Usage: Pass invoice IDs to force individual billing
// Example: generateVatBills(rows, ['INV123', 'INV456'])
```

---

### B. BATCHING ALGORITHM - COMPLETE CODE

**Individual Bill Creation**:
```typescript
// Lines 217-237
if (!isCombinedCandidate) {
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const targetTaxable = targetPayment / (1 + VAT_RATE);
    const preTaxDiscount = Math.max(0, subtotal - targetTaxable);
    const vat = (subtotal - preTaxDiscount) * VAT_RATE;

    bills.push({
        id: `VAT-INDV-${row.invoiceNumber}-${Date.now()}`,
        type: 'Individual',
        paymentMethod: method,
        invoiceIds: [row.invoiceId],
        invoiceNumbers: [row.invoiceNumber],
        customerName: row.customerName,
        customerPAN: row.customerPAN,
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(preTaxDiscount.toFixed(2)),
        vatAmount: Number(vat.toFixed(2)),
        totalAmount: Number(targetPayment.toFixed(2)),
        date: new Date().toISOString().split('T')[0],
        items
    });
}
```

**Combined Bill Accumulation**:
```typescript
// Lines 238-254
} else {
    // Check if adding this would exceed threshold
    if (combinedTargetCollection + targetPayment > THRESHOLD && combinedTargetCollection > 0) {
        flushCombined();
    }
    
    combinedTargetCollection += targetPayment;
    
    if (!combinedInvoices.includes(row.invoiceId)) {
        combinedInvoices.push(row.invoiceId);
        combinedNumbers.push(row.invoiceNumber);
    }
    
    // Aggregate line items by product name and rate
    items.forEach(ni => {
        const ex = combinedItems.find(i => 
            i.productName === ni.productName && 
            Math.abs(i.rate - ni.rate) < 0.01  // Rate match tolerance
        );
        if (ex) {
            ex.quantity += ni.quantity;
            ex.total += ni.total;
        } else {
            combinedItems.push({ ...ni });
        }
    });
}
```

**Combined Bill Flush**:
```typescript
// Lines 175-199
const flushCombined = () => {
    if (combinedTargetCollection <= 0) return;

    const subtotal = combinedItems.reduce((s, i) => s + i.total, 0);
    // Pre-tax taxable base must be target / 1.13
    const targetTaxable = combinedTargetCollection / (1 + VAT_RATE);
    const preTaxDiscount = Math.max(0, subtotal - targetTaxable);
    const vat = (subtotal - preTaxDiscount) * VAT_RATE;

    bills.push({
        id: `VAT-COMB-${bills.length + 1}`,
        type: 'Combined',
        paymentMethod: 'cash/qr',
        invoiceIds: [...combinedInvoices],
        invoiceNumbers: [...combinedNumbers],
        customerName: 'Multiple Customers',
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(preTaxDiscount.toFixed(2)),
        vatAmount: Number(vat.toFixed(2)),
        totalAmount: Number(combinedTargetCollection.toFixed(2)),
        date: new Date().toISOString().split('T')[0],
        items: [...combinedItems]
    });
    combinedItems = []; 
    combinedInvoices = []; 
    combinedNumbers = []; 
    combinedTargetCollection = 0;
};
```

**Sorting**: NOT IMPLEMENTED  
Orders are processed in the order they appear in the `rows` array.

**Rounding**:
```typescript
// All monetary values rounded to 2 decimals:
Number(value.toFixed(2))

// Rate comparison tolerance:
Math.abs(i.rate - ni.rate) < 0.01
```

---

### C. OUTPUT STRUCTURE - EXACT INTERFACE

```typescript
// File: utils/vatBilling.ts, Lines 5-27

interface BillItem {
    productName: string;
    quantity: number;
    rateBeforeVat: number;  // Price before VAT
    rate: number;           // Price after VAT (from DB)
    total: number;          // Line total before VAT (qty * rateBeforeVat)
}

export interface VatBill {
    id: string;                    // "VAT-INDV-{invoiceNumber}-{timestamp}" or "VAT-COMB-{index}"
    type: 'Individual' | 'Combined';
    paymentMethod: string;         // "cash", "qr", "cheque", "credit", "cash/qr"
    invoiceIds: string[];          // Array of source invoice IDs
    invoiceNumbers: string[];      // Array of invoice numbers (human-readable)
    customerName?: string;         // Customer name (or "Multiple Customers")
    customerPAN?: string;          // PAN if available
    subtotal: number;              // Sum of all line items (pre-tax, pre-discount)
    discount: number;              // Pre-tax discount to reach actual collected amount
    vatAmount: number;             // 13% of (subtotal - discount)
    totalAmount: number;           // Final amount (MUST equal collected amount)
    date: string;                  // ISO date string
    items: BillItem[];             // Array of line items
}
```

**EXAMPLE OUTPUT**:
```json
{
  "id": "VAT-COMB-1",
  "type": "Combined",
  "paymentMethod": "cash/qr",
  "invoiceIds": ["order_abc123", "order_def456"],
  "invoiceNumbers": ["INV-001", "INV-002"],
  "customerName": "Multiple Customers",
  "subtotal": 4542.48,
  "discount": 522.48,
  "vatAmount": 522.00,
  "totalAmount": 4542.00,
  "date": "2026-01-12",
  "items": [
    {
      "productName": "Monaco Biscuit 25+9.8gm",
      "quantity": 120,
      "rateBeforeVat": 12.39,
      "rate": 14.00,
      "total": 1486.80
    },
    {
      "productName": "Parle-G Gold 120gm",
      "quantity": 85,
      "rateBeforeVat": 35.84,
      "rate": 40.50,
      "total": 3046.40
    }
  ]
}
```

---

## 3️⃣ LOCKING & IMMUTABILITY

### A. Trip Locking

**Table**: `public.trip_closures`

**Closure Creation**: NOT IMPLEMENTED in current codebase

**Closure Check**:
```typescript
// File: services/finpro/TripStockService.ts, Line 462-470
isTripClosed: async (tripId: string): Promise<boolean> => {
    const { data } = await supabase
        .from('trip_closures')
        .select('id')
        .eq('trip_id', tripId)
        .single();

    return !!data;
}
```

### B. Order Immutability

**SQL Policy**: `supabase/migrations/001_finpro_spine.sql`, Lines 307-318

```sql
CREATE POLICY "orders_prevent_edit_after_closure" ON orders FOR UPDATE USING (
    -- Allow if no trip assigned
    "assignedTripId" IS NULL
    OR
    -- Allow if trip is not closed
    NOT EXISTS (
        SELECT 1 FROM trip_closures tc WHERE tc.trip_id = orders."assignedTripId"
    )
    OR
    -- Admin override with explicit permission
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);
```

**Status Fields**: None specific to locking (uses trip_closures existence check)

### C. Payment Freezing

**SQL Policy**: Lines 321-343

```sql
CREATE POLICY "payments_prevent_edit_after_closure" ON invoice_payments FOR UPDATE USING (
    -- Allow if order's trip is not closed
    NOT EXISTS (
        SELECT 1 FROM orders o
        JOIN trip_closures tc ON tc.trip_id = o."assignedTripId"
        WHERE o.id = invoice_payments.invoice_id
    )
    OR
    -- Admin override
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);

CREATE POLICY "payments_prevent_delete_after_closure" ON invoice_payments FOR DELETE USING (
    -- Allow if order's trip is not closed
    NOT EXISTS (
        SELECT 1 FROM orders o
        JOIN trip_closures tc ON tc.trip_id = o."assignedTripId"
        WHERE o.id = invoice_payments.invoice_id
    )
    OR
    -- Admin override
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);
```

### D. Re-Editing Prevention

**Guards**:
1. **Load Editing**: Lines 203-215 (SQL policy)
2. **Unload Editing**: Lines 234-242 (SQL policy)
3. **Order Editing**: Lines 307-318 (SQL policy)
4. **Payment Editing**: Lines 321-343 (SQL policy)

**Admin Override**: All policies allow admin users to bypass restrictions
```sql
EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
```

**Server-Side Checks**:
```typescript
// Application-level check in loadTruck and unloadTruck functions
const { data: closure } = await supabase
    .from('trip_closures')
    .select('id')
    .eq('trip_id', input.trip_id)
    .single();

if (closure) {
    throw new Error('Cannot load truck: Trip is already closed');
}
```

---

## 4️⃣ MISSING IMPLEMENTATIONS

### A. Trip Closure Function
**Status**: NOT IMPLEMENTED  
**Expected Location**: `services/finpro/TripStockService.ts`  
**What's Missing**: Function to create trip_closures record

### B. Variance Logging
**Status**: NOT IMPLEMENTED  
**What's Missing**: Automatic logging of reconciliation discrepancies to database

### C. FinPro Batch Creation
**Status**: NOT IMPLEMENTED  
**Tables Exist**: `finpro_batches`, `finpro_batch_lines`  
**What's Missing**: Functions to populate these tables from VAT bills

### D. FinPro Export
**Status**: NOT IMPLEMENTED  
**What's Missing**: Integration with FinPro accounting system

---

## 5️⃣ EDGE FUNCTIONS / BACKEND CODE

**Status**: NONE EXISTS

All logic runs client-side in TypeScript services.

**No Server-Side Functions**:
- No Edge Functions
- No Cloud Functions  
- No Server-Side API Routes
- No Backend Validation

**All Processing is Client-Side**:
- `services/finpro/TripStockService.ts` (client)
- `utils/vatBilling.ts` (client)
- Database access via Supabase client SDK

---

## END OF FORENSIC DISCLOSURE
