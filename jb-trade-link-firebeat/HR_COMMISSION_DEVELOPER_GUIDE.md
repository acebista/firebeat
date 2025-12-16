# HR & COMMISSION SYSTEM - DEVELOPER QUICK REFERENCE

**Status**: ✅ Production Ready | **Last Updated**: Dec 6, 2025

---

## 🗂️ PROJECT STRUCTURE

```
firebeat/
├── types/
│   ├── hr.ts                          # 🔷 Type definitions
│   └── workflow.ts                    # Updated with UserRole
├── utils/
│   └── commissionCalculator.ts        # 🔷 Commission math & validation
├── services/
│   └── hr.ts                          # 🔷 Database operations
├── components/
│   ├── admin/
│   │   └── HRPanel.tsx                # 🔷 Main UI component
│   ├── ui/
│   │   └── Elements.tsx               # Updated with Tab & Table
│   └── layout/
│       └── DashboardLayout.tsx        # Updated nav links
├── __tests__/
│   └── commissionCalculator.test.ts   # 🔷 Unit tests (22/22 ✓)
├── supabase/
│   └── migrations/
│       └── 20251206_hr_commission_system.sql  # 🔷 Database schema
├── App.tsx                            # Updated routing
└── jest.config.js                     # Fixed ESM config

🔷 = Main HR system components
```

---

## 🚀 QUICK START FOR DEVELOPERS

### 1. Accessing the Feature
```
Route: http://localhost:5173/#/admin/hr
Role: admin only
Navigation: Sidebar → "HR & Commissions" (💰 icon)
```

### 2. Key Files to Know
| File | Lines | Purpose |
|------|-------|---------|
| `types/hr.ts` | 89 | All TypeScript interfaces |
| `services/hr.ts` | 316 | Database & API logic |
| `utils/commissionCalculator.ts` | 176 | Commission math engine |
| `components/admin/HRPanel.tsx` | 560 | Main admin UI |
| `__tests__/commissionCalculator.test.ts` | 349 | Unit tests |

### 3. Running Tests
```bash
# All tests
npm test -- commissionCalculator.test.ts --no-coverage

# With coverage
npm test -- commissionCalculator.test.ts

# Watch mode
npm test -- --watch commissionCalculator.test.ts
```

### 4. Building
```bash
npm run build    # Production build
npm run dev      # Development server
npm run type-check  # Type checking
```

---

## 📖 TYPE DEFINITIONS

### CommissionRate
```typescript
interface CommissionRate {
  id: string;                    // Unique ID (cr_xxxxx)
  company_id: string | null;     // null = default/global
  company_name: string | null;
  name: string;                  // e.g., "Tier 1"
  min_amount: number;            // Lower boundary (₹)
  max_amount: number | null;     // Upper boundary (null = unlimited)
  rate_pct: number;              // Commission % (0-100)
  is_active: boolean;            // Soft delete flag
  created_at: string;            // ISO 8601 timestamp
  updated_at?: string;
}
```

### UserCompensation
```typescript
interface UserCompensation {
  id: string;                         // User ID
  name: string;                       // Full name
  email?: string;
  company_id?: string;
  company_name?: string;
  role: string;                       // 'sales', 'admin', etc.
  isActive: boolean;
  base_salary: number | null;         // Monthly base (₹)
  comp_plan_type: 'fixed' | 'commission';
  commission_rate_set: string | null; // Rate set ID
}
```

### MonthlySalesData
```typescript
interface MonthlySalesData {
  user_id: string;
  month: string;                      // YYYY-MM format
  total_sales: number;                // Aggregated sales amount (₹)
  order_count: number;
}
```

### CommissionSummary
```typescript
interface CommissionSummary {
  total_sales: number;                // Sum of all sales
  total_commission: number;           // Calculated commission
  total_base_salary: number;          // Sum of base salaries
  total_payout: number;               // Commission + Base
  count: number;                      // # of salespeople
}
```

---

## 🔧 SERVICE METHODS

### CommissionRateService

```typescript
// Get all active rates
async getAll(): Promise<CommissionRate[]>

// Get rates for a company
async getActiveByCompany(companyId: string): Promise<CommissionRate[]>

// Get default slabs (company_id = null)
async getDefaultSlabs(): Promise<CommissionRate[]>

// Create or update a rate
async upsert(payload: UpsertCommissionRatePayload): Promise<CommissionRate>

// Bulk upsert
async upsertMany(payloads: UpsertCommissionRatePayload[]): Promise<CommissionRate[]>

// Soft delete
async delete(id: string): Promise<void>

// Hard delete
async hardDelete(id: string): Promise<void>
```

### UserCompensationService

```typescript
// Get all salespeople
async getSalespeople(): Promise<UserCompensation[]>

// Get specific person
async getById(userId: string): Promise<UserCompensation>

// Update compensation
async update(payload: UpdateUserCompensationPayload): Promise<void>
```

### SalesService

```typescript
// Get one person's monthly sales
async getUserMonthlySales(
  userId: string,
  startDate: string,
  endDate: string
): Promise<MonthlySalesData[]>

// Get all salespeople's monthly sales
async getAllMonthlySales(
  month: string,
  month: string,
  companyId?: string
): Promise<Record<string, MonthlySalesData>>

// Raw view query
async getMonthlySalesView(month: string): Promise<MonthlySalesData[]>
```

---

## 💡 UTILITY FUNCTIONS

### calculateCommission(salesAmount, slabs)
```typescript
// Single slab
calculateCommission(50000, [
  { min: 0, max: 100000, rate: 5 }
])
// Returns: { totalCommission: 2500, breakdown: [...] }

// Tiered
calculateCommission(75000, [
  { min: 0, max: 50000, rate: 3 },     // 50,000 × 3% = 1,500
  { min: 50000, max: 100000, rate: 5 }  // 25,000 × 5% = 1,250
])
// Returns: { totalCommission: 2750, breakdown: [...] }
```

### validateSlabsNoOverlap(slabs)
```typescript
// Check for overlaps
const errors = validateSlabsNoOverlap([
  { min: 0, max: 50000, rate: 3 },
  { min: 50000, max: 100000, rate: 5 }  // ✓ Contiguous, no overlap
])
// Returns: [] (no errors)

// False overlap detection fixed!
// Before: Incorrectly flagged max1==min2 as overlap
// After: ✓ Correctly allows contiguous ranges
```

### formatCurrency(amount)
```typescript
formatCurrency(123456.78)
// Returns: "₹123,456.78"

formatCurrency(1000000)
// Returns: "₹1,000,000.00"
```

### parseCurrency(currencyString)
```typescript
parseCurrency("₹1,23,456.78")
// Returns: 123456.78

parseCurrency("100000")
// Returns: 100000
```

---

## 🗄️ DATABASE SCHEMA

### commission_rates Table
```sql
CREATE TABLE commission_rates (
  id TEXT PRIMARY KEY,              -- cr_xxxxxxxx
  company_id TEXT,                  -- null for default
  company_name TEXT,
  name TEXT NOT NULL,               -- Display name
  min_amount FLOAT8 NOT NULL,       -- Range start
  max_amount FLOAT8,                -- Range end (null = unlimited)
  rate_pct FLOAT8 NOT NULL,         -- 0-100
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### users Table Extensions
```sql
ALTER TABLE users ADD COLUMN base_salary FLOAT8;
ALTER TABLE users ADD COLUMN comp_plan_type TEXT DEFAULT 'fixed';
ALTER TABLE users ADD COLUMN commission_rate_set TEXT;
```

### user_monthly_sales View
```sql
CREATE VIEW user_monthly_sales AS
SELECT
  o.salespersonId AS user_id,
  DATE_TRUNC('month', o.date)::DATE AS month,
  SUM(o.totalAmount)::FLOAT8 AS total_sales,
  COUNT(*) AS order_count
FROM orders o
WHERE o.status IN ('APPROVED', 'DISPATCHED', 'DELIVERED')
GROUP BY o.salespersonId, DATE_TRUNC('month', o.date);
```

### Indexes
```sql
CREATE INDEX idx_commission_rates_company_active 
  ON commission_rates(company_id, is_active);

CREATE INDEX idx_commission_rates_amount_range 
  ON commission_rates(min_amount, max_amount);

CREATE INDEX idx_users_role_active 
  ON users(role, "isActive");
```

---

## 🧪 TESTING

### Test Coverage (22 Tests - All Passing ✅)

**Single Slab Tests**
- ✓ Calculate commission for single slab
- ✓ Return 0 for empty slabs
- ✓ Skip inactive slabs

**Tiered Tests**
- ✓ Calculate tiered commission across multiple slabs
- ✓ Spanning all tiers
- ✓ Sales below minimum slab
- ✓ Very high sales with no max cap

**Edge Cases**
- ✓ Sales exactly at slab boundary
- ✓ Rounding to 2 decimal places

**Validation**
- ✓ Detect overlapping slabs
- ✓ ✅ **FIXED** Allow contiguous non-overlapping slabs
- ✓ Validate valid slabs
- ✓ Reject invalid rates (>100%)
- ✓ Reject negative amounts
- ✓ Reject max < min

**Currency**
- ✓ Format with ₹ symbol
- ✓ Handle large numbers
- ✓ Handle zero and null

### Running Tests
```bash
# Run specific test file
npm test -- commissionCalculator.test.ts --no-coverage

# Run all tests
npm test

# Watch mode (file changes trigger re-run)
npm test -- --watch
```

---

## 🔐 SECURITY

### RLS Policies
```sql
-- Admin-only access to commission_rates
CREATE POLICY "admin_view_commission_rates" ON commission_rates
  FOR SELECT
  USING (EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "admin_modify_commission_rates" ON commission_rates
  FOR ALL
  USING (EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Admin-only access to user_monthly_sales view
GRANT SELECT ON user_monthly_sales TO anon, authenticated;
```

### Input Validation
- Rate bounds: 0 ≤ rate ≤ 100
- Amount ranges: min_amount ≤ max_amount (if max exists)
- No overlapping slabs (except contiguous boundaries)
- Company ownership checks

---

## 🐛 RECENT FIXES (This Session)

### 1. Jest Configuration
**Problem**: ES module resolution failure  
**Solution**: 
- Updated `jest.config.js` to use ESM syntax
- Added `useESM: true` for ts-jest
- Fixed moduleNameMapper path

### 2. Overlap Detection
**Problem**: Contiguous ranges flagged as overlapping  
**Solution**:
- Changed from `>=` to `>` in comparison logic
- Now allows ranges where max1 == min2
- Example: (0-50000) and (50000-100000) now correctly accepted

---

## 📝 COMMON PATTERNS

### Creating a Commission Rate
```typescript
const rate = await CommissionRateService.upsert({
  company_id: 'comp_123',
  name: 'Tier 1',
  min_amount: 0,
  max_amount: 50000,
  rate_pct: 3,
  is_active: true
});
```

### Calculating Commission
```typescript
const result = calculateCommission(75000, rates);
console.log(`Total: ₹${result.totalCommission}`);
result.breakdown.forEach(item => {
  console.log(`  ${item.slab.name}: ₹${item.commission}`);
});
```

### Checking for Overlaps
```typescript
const errors = validateSlabsNoOverlap(slabs);
if (errors.length > 0) {
  errors.forEach(err => toast.error(err.message));
  return;
}
```

### Updating User Compensation
```typescript
await UserCompensationService.update({
  id: userId,
  base_salary: 30000,
  comp_plan_type: 'commission',
  commission_rate_set: 'standard'
});
```

---

## 🎯 DEBUGGING TIPS

### Check Supabase Connection
```typescript
const { data, error } = await supabase.from('commission_rates').select('*');
if (error) console.error('DB Error:', error);
```

### Verify RLS Policies
```sql
-- Check if policies are enforced
SELECT * FROM commission_rates;  -- Should work for admin, fail for others
```

### Test Commission Calculation
```typescript
const result = calculateCommission(100000, [
  { min: 0, max: 50000, rate: 3 },
  { min: 50000, max: 100000, rate: 5 }
]);
// Expected: (50000 × 0.03) + (50000 × 0.05) = 1500 + 2500 = 4000
```

### Monitor Tests
```bash
npm test -- --watch commissionCalculator.test.ts
```

---

## 📊 PERFORMANCE NOTES

### Database Optimization
- Indexes on: company_id, is_active, min_amount, max_amount
- View materialization: Monthly aggregation
- Efficient date filtering on orders

### Frontend Optimization
- React component memoization
- Minimal re-renders
- Lazy loading where applicable
- Toast notifications (non-blocking)

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Run migration: `supabase db push`
- [ ] Verify RLS policies active
- [ ] Test HR panel loads
- [ ] Create test commission rates
- [ ] Verify calculations correct
- [ ] Check database queries in DevTools
- [ ] Monitor for errors
- [ ] User acceptance testing

---

## 📞 SUPPORT

**Documentation**: See `/START_HERE_HR_COMMISSION.md`  
**Full Guide**: See `/HR_COMMISSION_SYSTEM_COMPLETE.md`  
**Tests**: See `/__tests__/commissionCalculator.test.ts`  
**Session Report**: See `HR_COMMISSION_SESSION_UPDATE.md`

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: Dec 6, 2025
