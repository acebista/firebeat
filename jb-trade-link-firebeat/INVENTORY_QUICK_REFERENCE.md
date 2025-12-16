# Inventory Module - Quick Reference

## Access the Module

**URL**: `http://localhost:5173/#/admin/inventory` (or production URL)

**Sidebar**: Admin → Inventory (Boxes icon)

---

## Features at a Glance

### 📊 Summary Tab
- **View**: Complete inventory report
- **Shows**: Opening stock → Add purchases/returns → Subtract sales/damage/adjustments → Current stock
- **Filters**: Date range, search by product/company/SKU
- **Cards**: Opening | In | Out | Net Change | Current Stock (totals)

### 📈 Movements Tab
- **View**: Timeline of all inventory transactions
- **Types**: Purchase (green) | Sale (blue) | Return (amber) | Damage (red) | Adjustment (purple)
- **Shows**: Date, Type, Quantity ±, Product, Company, Reference
- **Filters**: Date range, search

### ⚙️ Adjustments Tab (Admin Only)
**Two Forms:**
1. **Manual Adjustment**
   - Product + Quantity (±) + Reason (audit/loss/leakage/other) + Note
   - Creates manual adjustment record

2. **Opening Stock**
   - Product + Quantity + Effective Date
   - Sets opening position for date range

### 🚚 Stock in Transit Tab
**View 1: By Product**
- Product | Company | SKU | Qty in Transit | # Trips | # Orders

**View 2: By Trip/Order**
- Expandable cards showing destination, dispatcher, items
- Status: Dispatched | Shipped | Out for Delivery

---

## Key Formulas

### Current Stock Calculation
```
Current Stock = Opening Stock + Total In - Total Out

Where:
  Opening Stock = Latest opening on or before report start date
  Total In = Purchases + Returns + Positive Adjustments
  Total Out = Sales + Damages + Negative Adjustments
```

### Stock in Transit
```
Items are in transit if:
  Order/Trip Status ∈ {dispatched, shipped, out_for_delivery}
  AND dispatch_date ∈ [start_date, end_date]

Items NOT in transit if:
  Status ∈ {delivered, completed, returned, cancelled}
```

---

## Common Tasks

### Create Manual Adjustment
1. Open Inventory → Adjustments Tab
2. Click "Manual Adjustment"
3. Select Product
4. Enter Quantity (+ or -)
5. Select Reason
6. Add optional Note
7. Click "Record Adjustment"
8. ✅ Success toast appears

### Set Opening Stock for New Period
1. Open Inventory → Adjustments Tab
2. Click "Set Opening Stock"
3. Select Product
4. Enter Opening Quantity
5. Set Effective Date
6. Click "Set Opening Stock"
7. ✅ Success toast appears

### View Items In Transit
1. Open Inventory → Stock in Transit Tab
2. See "By Product" view (aggregated)
3. Or switch to "By Trip/Order" view
4. Use date filters to narrow results
5. Click trip card to expand details

### Find Specific Movement
1. Open Inventory → Movements Tab
2. Use search (product name, company, or order ID)
3. Select date range
4. Scroll timeline to find transaction

---

## Access Rules

| Feature | Non-Admin | Admin |
|---------|---|---|
| Summary Report | ✅ View | ✅ View |
| Movements | ✅ View | ✅ View |
| Stock in Transit | ✅ View | ✅ View |
| Create Adjustment | ❌ | ✅ |
| Set Opening Stock | ❌ | ✅ |
| Adjustments Tab | ❌ (hidden) | ✅ |

---

## Data Sources

Inventory Summary pulls from:
- **Opening Stock**: `inventory_opening` table (by effective_date)
- **Purchases In**: `purchases` table
- **Sales Out**: `orders` table (order_items)
- **Returns In**: `returns` table
- **Damages Out**: `damage_logs` table
- **Adjustments**: `inventory_adjustments` table (in or out)

---

## Filters & Search

**Date Range:**
- Start Date: Beginning of period (search start_date ≤ report_date)
- End Date: Ending of period (search end_date ≥ report_date)
- For Stock in Transit: Uses dispatch_date

**Search:**
- Summary/Movements: Product name, Company, SKU
- Stock in Transit: Product name, Company, SKU (by product) OR Destination, Customer (by trip)

---

## Status Indicators

### Movement Types (Color-Coded)
- 🟢 **Purchase**: Green (stock increase)
- 🔵 **Sale**: Blue (stock decrease)
- 🟡 **Return**: Amber (stock increase, partial reversal)
- 🔴 **Damage**: Red (stock decrease, loss)
- 🟣 **Adjustment**: Purple (manual correction)

### Stock in Transit Status
- 🔵 **Dispatched**: Left warehouse
- 🟦 **Shipped**: In transit
- 🟨 **Out for Delivery**: Last mile
- (Gray = Delivered, Returned, Cancelled, Completed)

---

## Tips & Tricks

✅ **Use date range efficiently**
- Summary reports: Monthly, quarterly, or custom ranges
- Movements tab: Narrow to specific days for detailed audit

✅ **Search saves time**
- Try partial product names
- Use company codes in search
- Filter before scrolling large datasets

✅ **Opening stock strategy**
- Set once per quarter or per audit period
- Effective date should match physical count date
- Can override with upsert (update if same date)

✅ **Adjustment reasons**
- **Audit**: Found discrepancy during count
- **Loss**: Theft or missing items
- **Leakage**: Damaged/spoiled in storage
- **Other**: Miscellaneous

✅ **Stock in transit overview**
- Daily check: Flip to By Trip view for dispatcher
- Weekly: Run by product to identify slow movers
- Use for reconciliation vs delivery confirmations

---

## Troubleshooting

**Problem**: No items appearing in Summary
- **Check**: Date range includes products
- **Check**: Opening stock might be zero, search filters
- **Try**: Widen date range or remove search filter

**Problem**: Stock in Transit shows zero
- **Check**: All orders/trips marked as delivered
- **Check**: Date range doesn't match dispatch dates
- **Try**: Look at past 30 days instead

**Problem**: Adjustment form won't submit
- **Check**: Quantity must be non-zero
- **Check**: Product must be selected
- **Check**: You must have admin access
- **Try**: Refresh page and retry

**Problem**: Opening Stock not updating
- **Check**: Same product/date combo? (upserts, doesn't fail)
- **Check**: Effective date is in past or today
- **Try**: Adjust date by one day if exact date exists

---

## Reports & Export

Currently:
- 📊 View in browser (Summary table)
- 📋 Copy table data to clipboard (browser copy)
- 🖨️ Print page (browser print)

Future:
- 📥 CSV export
- 📄 PDF reports
- 📊 Scheduled email digests

---

## Performance Notes

- Large catalogs (100+ products): Loads progressively
- Date ranges: Indexed for speed
- Transit scan: Real-time from active orders/trips
- Typical load time: < 2 seconds for 1000 products

---

## Support

**Documentation**: See `INVENTORY_MODULE.md` for comprehensive guide
**Issues**: Check access control (RLS policies)
**Admin Needed**: Contact system admin for mutation permissions
