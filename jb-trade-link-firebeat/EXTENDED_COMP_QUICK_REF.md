# Quick Reference: Extended Compensation System

## 🎯 What Works Now

### Net Sales Calculation
```
Gross Sales - Returns = Net Sales (for commission)
```

### Dual Commission Modes
- **Slab**: Tiered (0-10k @ 5%, 10-50k @ 7%, 50k+ @ 10%)
- **Level**: Bracket (entire amount at rate based on bracket)

---

## 📊 Service Methods to Use

### Get Net Sales
```typescript
const { grossSales, returns, netSales, orderCount, returnCount } = 
  await SalesServiceExtended.getNetSalesByUser(userId, startDate, endDate);
```

### Get Full Compensation
```typescript
const {
  grossSales,
  returns,
  netSales,
  totalCommission,
  totalPayout
} = await SalesServiceExtended.calculateUserCompensation(userId, startDate, endDate);
```

### Get Multiple Users
```typescript
const { compensations, summary } = 
  await SalesServiceExtended.calculateBulkCompensation(
    [userId1, userId2],
    startDate,
    endDate
  );

// compensations[0] = CompensationDetail
// summary = { totalGrossSales, totalReturns, totalNetSales, ... }
```

### Log a Return
```typescript
await SalesReturnService.create({
  order_id: 'ord_123',
  salesperson_id: 'user_456',
  company_id: 'comp_789',
  return_amount: 5000,
  return_date: '2025-12-05',
  reason: 'Damaged'
});
```

---

## 🗄️ Database Tables

### Returns Table (Enhanced)
- Tracks all returns with salesperson attribution
- New columns: `salesperson_id`, `company_id`, `is_active`, `updated_at`
- Commission calculation uses `totalReturnAmount`

### Return Items Table (Enhanced)
- Line-item details for each return
- New columns: `created_at`, `updated_at` (audit trail)

### Orders Table (Enhanced)
- New column: `sales_returns` (optional denormalization)
- Used for quick net sales calculation

---

## 🏗️ File Structure

```
types/
├── hr-extended.ts ...................... Type definitions
utils/
├── commissionCalculator-extended.ts .... Calculation logic
services/
├── hr-extended.ts ...................... Service layer
┆
components/
├── (HRPanel - needs update)
├── (CommissionRateManager - needs update)
└── (Returns UI - optional)
```

---

## ✅ Status

- [x] Database migrations applied
- [x] Service layer updated
- [x] Types defined and verified
- [ ] Frontend components updated (next step)

---

## 🚀 Next: Frontend Integration

### HRPanel
Display columns: Gross | Returns | Net | Mode | Commission | Payout

### CommissionRateManager
Add mode selector for slab/level

### Returns Logging (Optional)
Form to create returns with salesperson attribution

---

## 📝 Example: Commission Calculation

**Scenario**: Sales rep with $50,000 sales, $5,000 return

**Net Sales**: $50,000 - $5,000 = $45,000

**Slab Mode** (0-10k @ 5%, 10-50k @ 7%, 50k+ @ 10%):
- 0-10k: 10,000 × 5% = $500
- 10-45k: 35,000 × 7% = $2,450
- **Total: $2,950**

**Level Mode** (if $45k falls in 10-50k @ 7%):
- 45,000 × 7% = **$3,150**

Commission is calculated on **net sales**, not gross!

---

## 🐛 Troubleshooting

**Q: Commission not changing after return?**  
A: Make sure `salesperson_id` is populated on return record. Re-calculate compensation.

**Q: Wrong commission amount?**  
A: Check commission mode (slab vs level). Verify bands are configured correctly.

**Q: Type errors?**  
A: Ensure you're importing from `types/hr-extended.ts` and `services/hr-extended.ts`.

---

## 📞 Quick Links

- **Full Guide**: START_EXTENDED_COMPENSATION_HERE.md
- **API Details**: services/hr-extended.ts (JSDoc comments)
- **Types**: types/hr-extended.ts (fully documented)
- **Calculator**: utils/commissionCalculator-extended.ts (with examples)
- **Migration Details**: MIGRATION_APPLIED_SUMMARY.md
- **Implementation Steps**: IMPLEMENTATION_CHECKLIST.md

---

**Everything is ready. Just need to update the UI components.**
