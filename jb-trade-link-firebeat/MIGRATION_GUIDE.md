# Smart Migration Guide

## Overview
This migration system intelligently imports your historical sales data while avoiding duplicates and maintaining data integrity.

## Features

### 1. **Smart Customer Deduplication**
Customers are matched using a priority system:
1. **PAN Number** (highest priority)
2. **Phone Number**
3. **Name** (case-insensitive)

If a match is found, the existing customer is reused instead of creating a duplicate.

### 2. **Company Extraction**
Companies are automatically extracted from product names:
- "H&s Bourbon 60gm" → Company: "H&s"
- "Parle-g 75gm" → Company: "Parle"
- "Monaco 300gm" → Company: "Monaco"

### 3. **Product Management**
- Products use sanitized IDs based on their full name
- Existing products are detected and skipped
- MRP is extracted from product names when available

### 4. **UUID Compliance**
- Customers use proper UUIDs (as per schema)
- Products use text IDs (as per schema)
- Orders reference correct customer UUIDs after deduplication

## Migration Data Summary

```
Companies: 17
Customers: 2,026 (deduplicated from 12,237 orders)
Products: 208
Orders: 12,237
Date Range: 2025-03-25 to 2025-11-23
```

## How to Run Migration

### Step 1: Verify Database Schema
Ensure your Supabase tables are created:
```sql
-- Run supabase_schema.sql in Supabase SQL Editor
```

### Step 2: Fix RLS Policies (if needed)
```sql
-- Run fix_rls_policies.sql to allow data insertion
```

### Step 3: Start Migration
1. Navigate to `/admin/migration` in your app
2. Click "Start Migration"
3. Wait for completion (may take 5-10 minutes)

## What Happens During Migration

### Phase 1: Analysis
- Loads all existing companies, products, and customers from database
- Identifies what already exists to avoid duplicates

### Phase 2: Companies
- Checks each company against existing data
- Only inserts new companies
- **Result**: No duplicates

### Phase 3: Products
- Checks each product by ID and name
- Only inserts new products
- **Result**: No duplicates

### Phase 4: Customers (Smart Merge)
- For each customer in CSV:
  1. Check if PAN number exists → Reuse
  2. Check if phone exists → Reuse
  3. Check if name exists → Reuse
  4. If no match → Create new customer
- Creates a mapping: `old_id → new_id`
- **Result**: Deduplicated customers

### Phase 5: Orders
- Updates all order.customerId using the mapping
- Ensures orders point to correct (possibly merged) customers
- **Result**: Accurate order history

## Expected Results

### Before Migration
- Database: Empty or partial data
- CSV: 12,237 orders with potential duplicates

### After Migration
- **Companies**: ~17 unique companies
- **Products**: ~208 unique products
- **Customers**: ~2,026 unique customers (down from potential 12,237)
- **Orders**: 12,237 orders correctly linked

## Deduplication Examples

### Example 1: Same PAN
```
CSV Row 1: "Rezi Kirana", Phone: 9841524680, PAN: 123456
CSV Row 2: "Rezi Store", Phone: 9999999999, PAN: 123456
→ Result: 1 customer (matched by PAN)
```

### Example 2: Same Phone
```
CSV Row 1: "Maya Store", Phone: 9841111111, PAN: null
CSV Row 2: "Maya Kirana", Phone: 9841111111, PAN: null
→ Result: 1 customer (matched by phone)
```

### Example 3: Same Name
```
CSV Row 1: "Karki Store", Phone: null, PAN: null
CSV Row 2: "karki store", Phone: null, PAN: null
→ Result: 1 customer (matched by name, case-insensitive)
```

## Troubleshooting

### Issue: "Database access denied"
**Solution**: Run `fix_rls_policies.sql` to fix Row Level Security

### Issue: "Migration stuck"
**Solution**: Check browser console for errors. Likely a network/timeout issue.

### Issue: "Duplicate customers still appearing"
**Cause**: Customers with different PAN, phone, AND name are treated as unique.
**Solution**: Manually merge in Supabase dashboard after migration.

### Issue: "Products not showing company"
**Cause**: Product name doesn't start with a known company prefix.
**Solution**: Update product.companyId manually or add company prefix to parser.

## Post-Migration Checklist

- [ ] Verify customer count matches expectations
- [ ] Check a few orders to ensure customer links are correct
- [ ] Verify products have correct companies assigned
- [ ] Check date range of orders
- [ ] Test creating a new order with migrated data
- [ ] Backup the database

## Re-running Migration

If you need to re-run:
1. **Option A**: Delete all data in Supabase (dangerous!)
2. **Option B**: The migration will skip existing records automatically

The migration is **idempotent** - running it multiple times won't create duplicates.

## Performance Notes

- **Batch Size**: 50 items per batch (configurable)
- **Estimated Time**: 
  - Companies: ~5 seconds
  - Products: ~30 seconds
  - Customers: ~2 minutes
  - Orders: ~5-8 minutes
- **Total**: ~10 minutes for full migration

## Data Integrity

### Customer ID Mapping
The migration maintains a map to ensure order integrity:
```javascript
{
  "old_uuid_1": "new_uuid_or_existing_uuid",
  "old_uuid_2": "new_uuid_or_existing_uuid",
  ...
}
```

All orders are updated to use the correct final customer IDs.

### Metadata Tracking
Each migrated record includes metadata:
```json
{
  "metadata": {
    "source": "migration",
    "originalName": "...",
    "dedupKey": "pan_123456"
  }
}
```

This helps track migration source and deduplication logic.

## Support

If migration fails:
1. Check browser console for detailed errors
2. Check Supabase logs in dashboard
3. Verify RLS policies are correct
4. Check network connectivity
5. Review `PRODUCTION_CHECKLIST.md`
