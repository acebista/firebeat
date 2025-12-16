# Inventory Module Documentation

## Overview

The Inventory Module provides comprehensive tracking and management of inventory across the Firebeat platform. It includes inventory summaries, detailed movement history, manual adjustments, and real-time tracking of stock in transit.

## Database Schema

### Tables

#### `inventory_adjustments`
Manual inventory adjustments for loss, leakage, audit discrepancies, or other reasons.

```sql
CREATE TABLE inventory_adjustments (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  qty_delta NUMERIC NOT NULL,  -- Positive or negative
  reason TEXT NOT NULL,         -- loss, leakage, audit, other
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_inventory_adjustments_product_id ON inventory_adjustments(product_id);
CREATE INDEX idx_inventory_adjustments_created_at ON inventory_adjustments(created_at);
```

#### `inventory_opening`
Opening stock positions for products at specific dates.

```sql
CREATE TABLE inventory_opening (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  opening_qty NUMERIC NOT NULL,
  effective_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT one_opening_per_product_per_date UNIQUE(product_id, effective_date)
);

CREATE INDEX idx_inventory_opening_product_id ON inventory_opening(product_id);
CREATE INDEX idx_inventory_opening_effective_date ON inventory_opening(effective_date);
```

### Row-Level Security (RLS)

- **Admins only**: Can INSERT, UPDATE, DELETE adjustments and opening stock
- **Authenticated users**: Can SELECT (read) all records

## Services

### `inventoryService.ts`

Core service for all inventory operations.

#### Key Functions

**`getInventorySummary(startDate, endDate, search?)`**
- Generates comprehensive inventory report
- For each product: opening stock + inflows - outflows = current stock
- Returns: `InventorySummaryItem[]`
- Data sources: opening stock, purchases, sales orders, returns, damages, adjustments

**`getInventoryMovements(startDate, endDate, productId?, search?)`**
- Fetches all inventory transactions in date range
- Movement types: purchase, sale, return, damage, adjustment
- Returns: `InventoryMovement[]` (sorted by date descending)

**`getStockInTransitByProduct(startDate?, endDate?, search?)`**
- Aggregates items currently dispatched but not delivered
- Includes order and trip tracking
- Returns: `StockInTransitByProduct[]` with qty and trip/order counts

**`getStockInTransitByTrip(startDate?, endDate?, search?)`**
- Groups in-transit items by trip/order
- Includes destination, dispatcher, delivery user, status
- Returns: `StockInTransitByTrip[]` with itemized lists

**`createInventoryAdjustment(adjustment)`**
- Admin-only mutation to record manual adjustments
- Validates qty_delta ≠ 0
- Returns: `InventoryAdjustment` with id and timestamps

**`setOpeningStock(opening)`**
- Admin-only mutation to set opening stock for a product on a date
- Upserts on unique(product_id, effective_date)
- Returns: `InventoryOpening` with id and timestamps

**`calculateCurrentStock(openingQty, movements)`**
- Pure utility function for stock calculation
- Formula: opening + Σ(movement quantities)
- Can result in negative stock if needed

## Components

### `InventoryModal` (`pages/inventory/InventoryModal.tsx`)

Main modal component with tabbed interface.

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback to close modal
- `isAdmin?: boolean` - Enables admin-only tabs

**Tabs:**
1. **Summary** - Inventory report by product
2. **Movements** - Transaction history timeline
3. **Adjustments** - Manual adjustments and opening stock (admin only)
4. **Stock in Transit** - Dispatched items tracking

### Tab Components

#### `SummaryTab`
- Date range and search filters
- Summary cards: opening, in, out, net change, current stock
- Sortable table with product details
- Color-coded quantity indicators

#### `MovementsTab`
- Timeline view of all movements
- Color-coded badges by type (purchase=green, sale=blue, return=amber, damage=red, adjustment=purple)
- Expandable details per transaction
- Filters: date range, search by product/company/reference

#### `AdjustmentsTab` (Admin Only)
**Manual Adjustment Form:**
- Product selector
- Adjustment quantity (+/-)
- Reason: audit, loss, leakage, other
- Optional notes
- Creates record in `inventory_adjustments` table

**Opening Stock Form:**
- Product selector
- Opening quantity (non-negative)
- Effective date
- Upserts into `inventory_opening` table

#### `StockInTransitTab`
**Two Views:**
1. **By Product:**
   - Aggregated qty in transit per product
   - Trip and order counts
   - Search and date filters

2. **By Trip/Order:**
   - Expandable trip/order cards
   - Destination, dispatcher, delivery user
   - Status badge (dispatched, shipped, out_for_delivery)
   - Itemized list of products and quantities

## Data Flow

### Inventory Summary Calculation

```
1. Get latest opening_qty from inventory_opening (on or before startDate)
2. Fetch all movements (purchases, sales, returns, damages, adjustments) in date range
3. For each product:
   - total_in = Σ(purchases + returns + positive adjustments)
   - total_out = Σ(sales + damages + negative adjustments)
   - net_change = total_in - total_out
   - current_stock = opening_qty + net_change
4. Return summary table
```

### Stock in Transit Definition

**In Transit Statuses:** `dispatched`, `shipped`, `out_for_delivery`
**Excluded Statuses:** `delivered`, `completed`, `returned`, `cancelled`

Items appear in stock in transit when:
- Order or trip status is in the in-transit list
- Order/trip has dispatch_date in query range

Items disappear when:
- Status changes to delivered/returned/completed/cancelled
- Automatic on order/trip status update

## Usage Examples

### Get Inventory Summary

```typescript
import { getInventorySummary } from './services/inventory/inventoryService';

const summary = await getInventorySummary('2024-01-01', '2024-01-31', 'Widget');
summary.forEach(item => {
  console.log(`${item.product_name}: ${item.current_stock} units`);
});
```

### Create Adjustment

```typescript
import { createInventoryAdjustment } from './services/inventory/inventoryService';

await createInventoryAdjustment({
  product_id: 'prod-123',
  qty_delta: -5,
  reason: 'leakage',
  note: 'Leakage during transport, shipment ABC-123',
});
```

### Set Opening Stock

```typescript
import { setOpeningStock } from './services/inventory/inventoryService';

await setOpeningStock({
  product_id: 'prod-123',
  opening_qty: 500,
  effective_date: '2024-01-01',
});
```

### Get Stock in Transit

```typescript
import { getStockInTransitByProduct, getStockInTransitByTrip } from './services/inventory/inventoryService';

// By product
const byProduct = await getStockInTransitByProduct('2024-01-01', '2024-01-31');

// By trip
const byTrip = await getStockInTransitByTrip('2024-01-01', '2024-01-31');
byTrip.forEach(trip => {
  console.log(`Trip ${trip.trip_id} to ${trip.destination}: ${trip.items.length} product types`);
});
```

## Access Control

**Public Access:**
- None (inventory is restricted)

**Authenticated Users:**
- View all inventory reports (summary, movements, transit)
- Read-only access

**Admin Users:**
- Full access to all reports
- Can create manual adjustments
- Can set/update opening stock
- Subject to RLS policies

## Testing

### Unit Tests (`__tests__/inventory/inventoryService.test.ts`)

Test the `calculateCurrentStock` helper function:
- No movements: opening stock unchanged
- Positive movements only: opening + inflows
- Negative movements only: opening - outflows
- Mixed movements: complex scenarios
- Zero opening stock: from scratch calculations
- Negative results: oversold positions

### Manual Testing Checklist

**Summary Tab:**
- [ ] Date filter changes update report
- [ ] Search filters by product name, company, SKU
- [ ] Totals card shows correct sums
- [ ] Opening stock uses correct date logic

**Movements Tab:**
- [ ] Timeline displays transactions in reverse chronological order
- [ ] Movement types color-coded correctly
- [ ] Quantities show with +/- signs
- [ ] Search filters by product/company/reference

**Adjustments Tab:**
- [ ] Product dropdown populated with all products
- [ ] Quantity validation (non-zero)
- [ ] Reason options (audit, loss, leakage, other)
- [ ] Form submits and shows success toast
- [ ] Record appears in inventory_adjustments table

**Opening Stock Tab:**
- [ ] Date picker allows selecting any date
- [ ] Quantity must be non-negative
- [ ] Effective date controls report start point
- [ ] Upsert works (update if date exists)

**Stock in Transit Tab:**
- [ ] By Product: aggregates correctly
- [ ] By Trip: shows all in-transit orders/trips
- [ ] Status filter works (dispatched, shipped, out_for_delivery)
- [ ] Items disappear when status changes to delivered

**Access Control:**
- [ ] Non-admin users: see all tabs except Adjustments
- [ ] Admin users: see all tabs
- [ ] Adjustments tab shows "Admin access required" for non-admins
- [ ] RLS enforces write permissions

## Performance Considerations

1. **Date Range Filtering**: Indexes on created_at and effective_date ensure fast queries
2. **Product Aggregation**: Consider pagination for large product catalogs (100+ products)
3. **Stock in Transit**: May be heavy if many active trips/orders; consider caching for < 5 min
4. **Movement History**: Indexes on product_id enable fast product-specific queries

## Future Enhancements

1. **Batch Operations**: Import adjustments/opening stock from CSV
2. **Forecasting**: Predict future stock levels based on trends
3. **Alerts**: Low stock warnings, overstocking alerts
4. **Reconciliation**: Periodically audit physical vs system counts
5. **Export**: PDF/Excel reports
6. **Multi-warehouse**: Track inventory across multiple locations
7. **Serial Numbers**: Track individual items (for high-value goods)
8. **Lot Tracking**: Expiration dates, batch codes
