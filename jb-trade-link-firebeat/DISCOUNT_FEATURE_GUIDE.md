# Discount Feature - Quick Reference

## How It Works

### Database Storage
- **Column**: `discount` (numeric)
- **Type**: Amount (₹), not percentage
- **Location**: `orders` table
- **Example**: `500.00` means ₹500 discount

### User Interface

#### Creating Order (Sales Page)
```
Cart Summary:
├─ Subtotal: ₹5,000.00
├─ Discount ₹: [500.00] ← User enters amount
│  └─ Shows: (10.0%) ← Auto-calculated percentage
└─ Total Payable: ₹4,500.00
```

**Input Field**:
- Label: "Discount ₹:"
- Type: Number input
- Min: 0
- Max: Subtotal amount
- Step: 0.01 (allows decimals)
- Shows percentage equivalent in green

#### Viewing Order (Admin Page)
```
Order Items Table Footer:
├─ Subtotal: ₹5,000.00 (calculated as totalAmount + discount)
├─ Discount: -₹500.00 (shown in red if > 0)
└─ Grand Total: ₹4,500.00 (this is totalAmount)
```

#### Sales Report
```
Columns:
├─ Subtotal (before discount)
├─ Disc (discount amount)
└─ Grand Total (after discount)
```

## Code Examples

### Saving Order with Discount
```typescript
const orderData = {
  // ... other fields
  totalAmount: finalTotal,        // ₹4,500 (after discount)
  discount: orderDiscountAmount,  // ₹500
  // ...
};
```

### Calculating Subtotal from Order
```typescript
const subtotal = order.totalAmount + (order.discount || 0);
// ₹4,500 + ₹500 = ₹5,000
```

### Showing Discount Percentage
```typescript
const discountPct = (discount / subtotal) * 100;
// (₹500 / ₹5,000) * 100 = 10%
```

## Database Queries

### Get orders with discount
```sql
SELECT 
  id,
  "customerName",
  "totalAmount",
  discount,
  ("totalAmount" + COALESCE(discount, 0)) as subtotal
FROM orders
WHERE discount > 0;
```

### Total discount given today
```sql
SELECT 
  SUM(discount) as total_discount,
  COUNT(*) as orders_with_discount
FROM orders
WHERE date = CURRENT_DATE
  AND discount > 0;
```

## Migration from Percentage to Amount

If you have old data with percentage, convert it:

```sql
-- If you had discountPct column before
UPDATE orders
SET discount = ("totalAmount" * "discountPct") / (100 - "discountPct")
WHERE "discountPct" > 0;

-- Then drop the old column
ALTER TABLE orders DROP COLUMN IF EXISTS "discountPct";
```

## Validation Rules

### Frontend
- Discount cannot be negative
- Discount cannot exceed subtotal
- Discount is optional (defaults to 0)

### Backend
- Stored as numeric (allows decimals)
- NULL treated as 0
- No maximum limit (trust admin)

## Common Scenarios

### Scenario 1: No Discount
```
Subtotal: ₹5,000
Discount: ₹0 (or NULL)
Total: ₹5,000
```

### Scenario 2: Fixed Amount Discount
```
Subtotal: ₹5,000
Discount: ₹500
Total: ₹4,500
Percentage: 10%
```

### Scenario 3: Percentage-based (user calculates)
```
User wants 15% off ₹5,000
User calculates: ₹5,000 × 0.15 = ₹750
User enters: ₹750 in discount field
System shows: (15.0%)
Total: ₹4,250
```

## Troubleshooting

### Issue: Can't save order
**Error**: `PGRST204: Could not find the 'discountPct' column`
**Fix**: Make sure you're using `discount` not `discountPct` in code

### Issue: Discount not showing in reports
**Check**:
1. Is `discount` column in database?
2. Is discount > 0 for the order?
3. Is report query including discount field?

### Issue: Wrong calculations
**Debug**:
```typescript
console.log('Subtotal:', subtotalAmount);
console.log('Discount:', orderDiscountAmount);
console.log('Final:', finalTotal);
console.log('Check:', subtotalAmount - orderDiscountAmount === finalTotal);
```

## Best Practices

1. **Always validate** discount ≤ subtotal
2. **Show percentage** for user confirmation
3. **Store amount** for accuracy
4. **Handle NULL** as 0 in calculations
5. **Display in red** to indicate reduction
6. **Log changes** for audit trail (future enhancement)

## Future Enhancements

Possible improvements:
- [ ] Discount approval workflow for large amounts
- [ ] Discount reason dropdown
- [ ] Customer-specific discount limits
- [ ] Automatic discounts based on customer tier
- [ ] Discount analytics dashboard
- [ ] Discount history per customer
