# Developer Handoff - Dual Commission Mode System

**Date**: December 7, 2025  
**Version**: 1.0  
**Status**: Complete & Production Ready

---

## SYSTEM OVERVIEW

This document provides a comprehensive overview of the dual commission mode system for developers maintaining or enhancing the compensation module.

### What This System Does

The system allows each company to choose between **two commission calculation methods**:

1. **Slab Mode (Tiered/Progressive)**
   - Sales divided into bands, each band gets its own rate
   - More complex but more motivating
   - Example: 0-10k @ 5%, 10-50k @ 7%, 50k+ @ 10%

2. **Level Mode (Bracket-Based)**
   - Find which band contains total sales, apply that rate to entire amount
   - Simpler calculation
   - Example: $45k sales in 10-50k bracket → $45k × 7% = $3,150

### Key Features

✅ **Per-Company Configuration** - Each company can set different commission modes  
✅ **Net Sales Calculation** - Returns are deducted before commission calculation  
✅ **Enhanced UI** - Clear visual representation with color-coded badges  
✅ **Historical Tracking** - Each rate stores which mode it uses  
✅ **Zero TypeScript Errors** - Fully typed codebase  

---

## ARCHITECTURE

### Component Hierarchy

```
Admin Panel
├── CommissionRateManager (sets commission modes)
│   ├── Modal Form
│   │   ├── Mode Selector Dropdown
│   │   ├── Min Amount Input
│   │   ├── Max Amount Input
│   │   └── Rate % Input
│   └── Commission Rates Table
│       ├── Salesperson Column
│       ├── Mode Badge (Blue=Slab, Green=Level)
│       └── Edit/Delete Actions
│
└── HRPanel (displays compensation with net sales)
    ├── Filters (Date Range, Salesperson, Active Only)
    ├── Summary Card (Gross/Returns/Net/Commission/Salary/Payout)
    ├── Compensation Details Table
    │   ├── Salesperson Column
    │   ├── Gross Sales Column
    │   ├── Returns Column
    │   ├── Net Sales Column
    │   ├── Mode Badge Column
    │   ├── Commission Column
    │   └── Payout Column
    └── Commission Modes Summary (Slab vs Level breakdown)
```

### Data Flow

```
Database
├── commission_rates (with mode field)
├── orders (with totalAmount)
├── returns (with salesperson_id, amount)
└── users (with commission_rate_set)
    ↓
SalesServiceExtended
├── calculateUserCompensation()
│   ├── Get user data
│   ├── Get net sales (orders - returns)
│   ├── Load commission rates by mode
│   ├── Calculate commission using mode
│   └── Return CompensationDetail
│
└── calculateBulkCompensation()
    ├── Process multiple users
    ├── Aggregate summary data
    └── Return array + summary

HRPanel Component
├── Fetches bulk compensation data
├── Displays in formatted table
├── Shows mode badges
└── Displays summary totals
```

---

## KEY FILES & LOCATIONS

### Frontend Components

| File | Purpose | Key Functions |
|------|---------|---|
| `components/admin/CommissionRateManager.tsx` | Manage commission rates with mode selection | Mode selector, table display, CRUD operations |
| `components/admin/HRPanel.tsx` | Display compensation data with net sales | Data fetching, filtering, table display |

### Types

| File | Purpose | Key Exports |
|------|---------|---|
| `types/hr.ts` | Basic HR types | CommissionRate, UpsertCommissionRatePayload |
| `types/hr-extended.ts` | Extended compensation types | CompensationDetail, CommissionMode, NetSalesBreakdown |

### Services

| File | Purpose | Key Methods |
|------|---------|---|
| `services/hr.ts` | Basic HR operations | CommissionRateService, UserCompensationService |
| `services/hr-extended.ts` | Extended compensation logic | calculateUserCompensation(), calculateBulkCompensation() |

### Utilities

| File | Purpose | Key Functions |
|------|---------|---|
| `utils/commissionCalculator-extended.ts` | Calculation logic | calculateCommissionWithReturns(), validateSlabBands(), validateLevelBands() |

---

## CODE EXAMPLES

### Reading Commission Data with Mode

```typescript
// Get all commission rates for a company
const rates = await CommissionRateService.getActiveByCompany(companyId);

// Rates now include mode field:
// {
//   id: 'rate_123',
//   company_id: 'company_456',
//   mode: 'slab',  // or 'level'
//   min_amount: 0,
//   max_amount: 10000,
//   rate_pct: 5,
//   ...
// }

// Filter by mode if needed
const slabRates = rates.filter(r => r.mode === 'slab');
const levelRates = rates.filter(r => r.mode === 'level');
```

### Calculating Compensation

```typescript
// Single user
const compensation = await SalesServiceExtended.calculateUserCompensation(
  userId,
  '2025-01-01',
  '2025-01-31'
);

// Result includes:
// {
//   userId: 'user_123',
//   userName: 'John Doe',
//   grossSales: 50000,
//   returns: 2000,
//   netSales: 48000,
//   commissionMode: 'slab',
//   totalCommission: 3500,
//   totalPayout: 33500,
//   ...
// }

// Multiple users
const { compensations, summary } = await SalesServiceExtended.calculateBulkCompensation(
  ['user_1', 'user_2', 'user_3'],
  '2025-01-01',
  '2025-01-31'
);

// summary includes totals:
// {
//   totalGrossSales: 150000,
//   totalReturns: 5000,
//   totalNetSales: 145000,
//   totalCommission: 10336,
//   totalBaseSalary: 85000,
//   totalPayout: 95336,
//   userCount: 3
// }
```

### Creating Commission Rates with Mode

```typescript
const newRate = await CommissionRateService.upsert({
  company_id: 'company_456',
  name: 'Standard Slab',
  min_amount: 0,
  max_amount: 10000,
  rate_pct: 5,
  mode: 'slab',  // NEW: specify mode
  is_active: true
});
```

### Display Mode Badges in UI

```typescript
const ModeBadge = ({ mode }: { mode: 'slab' | 'level' }) => (
  <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
    mode === 'slab' ? 'bg-blue-500' : 'bg-green-500'
  }`}>
    {mode.toUpperCase()}
  </span>
);

// Usage
<Modebadge mode={compensation.commissionMode} />
// Renders either blue "SLAB" or green "LEVEL"
```

---

## COMMISSION CALCULATION LOGIC

### Slab Mode Algorithm

```typescript
function calculateSlabCommission(
  netSales: number,
  bands: CommissionRate[]
): number {
  let commission = 0;
  let remainingSales = netSales;
  let previousMax = 0;

  for (const band of bands) {
    const bandStart = band.min_amount;
    const bandEnd = band.max_amount ?? Infinity;
    
    // Calculate sales in this band
    const bandSales = Math.min(
      Math.max(remainingSales - (bandStart - previousMax), 0),
      bandEnd - bandStart
    );
    
    // Add commission from this band
    commission += bandSales * (band.rate_pct / 100);
    
    previousMax = bandEnd;
    remainingSales -= bandSales;
  }

  return commission;
}

// Example: $44,000 sales
// Band 1 (0-10k @ 5%): 10,000 × 0.05 = 500
// Band 2 (10k-50k @ 7%): 34,000 × 0.07 = 2,380
// Total: $2,880
```

### Level Mode Algorithm

```typescript
function calculateLevelCommission(
  netSales: number,
  bands: CommissionRate[]
): number {
  // Find which band contains the sales amount
  for (const band of bands) {
    const bandEnd = band.max_amount ?? Infinity;
    
    if (netSales <= bandEnd) {
      // Apply this band's rate to entire amount
      return netSales * (band.rate_pct / 100);
    }
  }
  
  // If we get here, use the highest band
  const lastBand = bands[bands.length - 1];
  return netSales * (lastBand.rate_pct / 100);
}

// Example: $44,000 sales
// Falls in band 2 (10k-50k @ 7%)
// Commission: 44,000 × 0.07 = $3,080
```

---

## DATABASE SCHEMA

### commission_rates table

```sql
CREATE TABLE commission_rates (
  id UUID PRIMARY KEY,
  company_id UUID,
  
  -- Commission structure
  name TEXT,
  min_amount NUMERIC,
  max_amount NUMERIC,
  rate_pct NUMERIC,
  
  -- NEW: Commission mode
  mode VARCHAR(10) DEFAULT 'slab',  -- 'slab' or 'level'
  
  -- Grouping
  set_name TEXT,
  apply_to VARCHAR(20) DEFAULT 'company',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

### returns table

```sql
CREATE TABLE returns (
  id UUID PRIMARY KEY,
  invoiceId TEXT,
  customerId TEXT,
  salesperson_id UUID,
  company_id UUID,
  totalReturnAmount NUMERIC,
  reason TEXT,
  createdAt TIMESTAMP,
  updated_at TIMESTAMP,
  is_active BOOLEAN
);
```

---

## TESTING STRATEGIES

### Unit Tests

```typescript
import { calculateCommissionWithReturns } from '@/utils/commissionCalculator-extended';

describe('calculateCommissionWithReturns', () => {
  it('should calculate slab mode correctly', () => {
    const bands = [
      { min_amount: 0, max_amount: 10000, rate_pct: 5 },
      { min_amount: 10000, max_amount: null, rate_pct: 7 }
    ];
    
    const result = calculateCommissionWithReturns(
      50000,  // gross
      2000,   // returns
      bands,
      'slab'
    );
    
    expect(result.totalCommission).toBe(3360);
  });

  it('should calculate level mode correctly', () => {
    const bands = [
      { min_amount: 0, max_amount: 10000, rate_pct: 5 },
      { min_amount: 10000, max_amount: 50000, rate_pct: 7 },
      { min_amount: 50000, max_amount: null, rate_pct: 10 }
    ];
    
    const result = calculateCommissionWithReturns(
      50000,  // gross
      2000,   // returns
      bands,
      'level'
    );
    
    expect(result.totalCommission).toBe(3360);
  });
});
```

### Integration Tests

```typescript
describe('HRPanel Integration', () => {
  it('should load compensation data with correct modes', async () => {
    // Setup: Create user with slab mode rates
    const userId = 'test_user_123';
    
    // Call service
    const comp = await SalesServiceExtended.calculateUserCompensation(
      userId,
      '2025-01-01',
      '2025-01-31'
    );
    
    // Verify
    expect(comp.commissionMode).toBe('slab');
    expect(comp.netSales).toBe(comp.grossSales - comp.returns);
    expect(comp.totalPayout).toBe(comp.baseSalary + comp.totalCommission);
  });
});
```

---

## COMMON MODIFICATIONS

### Adding a New Commission Mode

If you want to add a third mode (e.g., "Custom"):

1. **Update Type**:
```typescript
// types/hr-extended.ts
export type CommissionMode = 'slab' | 'level' | 'custom';
```

2. **Add Validation**:
```typescript
// utils/commissionCalculator-extended.ts
export function validateCustomBands(bands: CommissionRate[]): SlabValidationResult {
  // Your validation logic
}
```

3. **Add Calculation**:
```typescript
function calculateCustomCommission(
  netSales: number,
  bands: CommissionRate[]
): number {
  // Your calculation logic
  return commission;
}
```

4. **Update Service**:
```typescript
// services/hr-extended.ts
const commissionResult = calculateCommissionWithReturns(
  netSalesData.grossSales,
  netSalesData.returns,
  commissionBands,
  commissionMode  // Now includes 'custom'
);
```

5. **Update UI**:
```typescript
// components/admin/CommissionRateManager.tsx
<option value="custom">Custom Mode</option>

// Update badge colors
const badgeColor = mode === 'custom' ? 'bg-purple-500' : ...
```

### Adding Returns to Orders

If you want to associate returns directly with orders:

1. **Migration**:
```sql
ALTER TABLE orders ADD COLUMN return_amount NUMERIC DEFAULT 0;
```

2. **Update Service**:
```typescript
// Calculate returns from orders table instead of returns table
async getNetSalesByUser(...) {
  const orders = await supabase.from('orders').select('totalAmount, return_amount');
  const returns = orders.reduce((sum, o) => sum + (o.return_amount || 0), 0);
}
```

### Adding Commission History

To track how commissions changed over time:

1. **Create Table**:
```sql
CREATE TABLE commission_history (
  id UUID PRIMARY KEY,
  user_id UUID,
  period_start DATE,
  period_end DATE,
  gross_sales NUMERIC,
  returns NUMERIC,
  net_sales NUMERIC,
  commission_mode VARCHAR(10),
  total_commission NUMERIC,
  base_salary NUMERIC,
  total_payout NUMERIC,
  created_at TIMESTAMP
);
```

2. **Log on Calculation**:
```typescript
// When calculating, also insert into history
await supabase.from('commission_history').insert({
  user_id: userId,
  period_start: startDate,
  period_end: endDate,
  ...compensation
});
```

---

## PERFORMANCE CONSIDERATIONS

### Query Optimization

The system uses efficient queries:

```typescript
// Good: Single query with joins
const { data } = await supabase
  .from('orders')
  .select('id, totalAmount, date')
  .gte('date', startDate)
  .lte('date', endDate);

// Avoid: Multiple queries in loop
for (const order of orders) {
  const { data } = await supabase
    .from('order_details')
    .select('*')
    .eq('order_id', order.id);
  // This is O(n) queries - slow!
}
```

### Caching Opportunities

Consider caching for large datasets:

```typescript
// Cache commission rates (they change rarely)
const cacheKey = `commission_rates_${companyId}_${mode}`;
const cached = sessionStorage.getItem(cacheKey);
if (cached) return JSON.parse(cached);

const rates = await CommissionRateServiceExtended.getByCompanyAndMode(companyId, mode);
sessionStorage.setItem(cacheKey, JSON.stringify(rates));
return rates;
```

---

## DEBUGGING TIPS

### Enable Debug Logging

```typescript
// At top of service file
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) console.log('Calculating commission for user:', userId);

// In calculation
if (DEBUG) {
  console.log('Gross sales:', netSalesData.grossSales);
  console.log('Returns:', netSalesData.returns);
  console.log('Net sales:', netSalesData.netSales);
  console.log('Commission mode:', commissionMode);
  console.log('Commission bands:', commissionBands);
  console.log('Final commission:', commissionResult.totalCommission);
}
```

### Verify Database Data

```sql
-- Check if mode is populated
SELECT COUNT(*) as without_mode FROM commission_rates WHERE mode IS NULL;

-- Check latest rates for a company
SELECT * FROM commission_rates 
WHERE company_id = 'your_company_id' 
ORDER BY created_at DESC 
LIMIT 5;

-- Verify returns are being tracked
SELECT salesperson_id, COUNT(*) as return_count, SUM(totalReturnAmount) as total_returns
FROM returns
WHERE is_active = true
GROUP BY salesperson_id;
```

### Browser Debugging

```typescript
// In component to inspect compensation data
useEffect(() => {
  console.log('Compensation data:', state.compensationData);
  console.log('Summary:', {
    totalGross: state.compensationData.reduce((s, c) => s + c.grossSales, 0),
    totalReturns: state.compensationData.reduce((s, c) => s + c.returns, 0),
    totalNet: state.compensationData.reduce((s, c) => s + c.netSales, 0),
    totalComm: state.compensationData.reduce((s, c) => s + c.totalCommission, 0)
  });
}, [state.compensationData]);
```

---

## DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] All TypeScript compiles without errors
- [ ] All tests pass
- [ ] Database migrations applied (if any)
- [ ] Commission rates have mode values set
- [ ] At least one slab and one level rate exist for testing
- [ ] No console errors in browser
- [ ] HRPanel loads and displays data
- [ ] CommissionRateManager allows mode selection
- [ ] Mode badges display correct colors
- [ ] Calculations are accurate
- [ ] Returns are properly deducted
- [ ] Summary totals are correct
- [ ] Performance is acceptable (< 5s for 50 users)

---

## MAINTENANCE

### Regular Tasks

**Weekly**:
- Monitor error logs for any commission calculation issues
- Check that new commission rates are being created correctly

**Monthly**:
- Run commission calculations for all users to verify accuracy
- Compare HRPanel totals with accounting records

**Quarterly**:
- Review commission mode usage across companies
- Optimize queries if performance degrades

---

## SUPPORT & DOCUMENTATION

### Internal Docs
- `FRONTEND_INTEGRATION_COMPLETE.md` - Overview of frontend
- `FRONTEND_TESTING_GUIDE.md` - Testing procedures
- `EXTENDED_COMPENSATION_README.md` - Full technical documentation

### Key Contacts
- Frontend: [Developer Name]
- Backend: [Developer Name]
- DevOps: [Developer Name]
- Product: [Product Manager]

---

## QUICK REFERENCE

### Mode Decision Tree

```
Are you using tiered/progressive commission?
├─ YES: Use SLAB mode
│   └─ Each sales band gets its own rate
│   └─ Example: 0-10k @ 5%, 10k+ @ 7%
│
└─ NO: Use LEVEL mode
    └─ Find containing band, apply to all sales
    └─ Example: $8k sales in 0-10k band @ 5%
```

### Commission Formula Reference

```
SLAB MODE:
Commission = Σ(sales_in_band_i × rate_i)

LEVEL MODE:
Commission = total_sales × rate_of_containing_band

BOTH MODES:
NET SALES = Gross Sales - Returns
Commission uses NET SALES (not gross)
```

---

**Handoff Complete**  
**Next Review Date**: Q2 2026  
**Maintained By**: [Your Name]  
**Last Updated**: December 7, 2025
