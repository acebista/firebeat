# HR & Commission System - API Reference

**Complete API documentation for all HR, Commission, and Sales operations**

---

## TABLE OF CONTENTS
1. Commission Rate Service
2. User Compensation Service
3. Sales Service
4. Commission Calculator
5. Type Definitions
6. Database Queries

---

## 1. COMMISSION RATE SERVICE

**Location**: `/services/hr.ts` (lines 1-118)  
**Import**: `import { CommissionRateService } from '@/services/hr'`

### getAll()
Fetch all active commission rates across all companies.

```typescript
// Usage
const rates = await CommissionRateService.getAll();

// Returns
CommissionRate[] // sorted by min_amount ascending
[
  {
    id: "rate_001",
    company_id: null,
    company_name: null,
    name: "Default - 0-1000",
    min_amount: 0,
    max_amount: 1000,
    rate_pct: 3.0,
    is_active: true,
    created_at: "2025-12-06T00:00:00Z"
  },
  ...
]

// Error handling
try {
  const rates = await CommissionRateService.getAll();
} catch (error) {
  console.error('Error fetching rates:', error);
  toast.error('Failed to load commission rates');
}
```

### getActiveByCompany(companyId)
Fetch commission rates for a specific company.

```typescript
// Usage
const companyId = "parle"; // or null for default rates
const rates = await CommissionRateService.getActiveByCompany(companyId);

// Parameters
companyId: string | null  // Company ID, or null for company-agnostic rates

// Returns
CommissionRate[]  // Only is_active = true, sorted by min_amount

// Example with null (default rates)
const defaultRates = await CommissionRateService.getActiveByCompany(null);

// Example with specific company
const parleRates = await CommissionRateService.getActiveByCompany("parle");
```

### getDefaultSlabs()
Fetch default commission slabs (company_id = null).

```typescript
// Usage
const defaultSlabs = await CommissionRateService.getDefaultSlabs();

// Returns
CommissionRate[]  // Only where company_id IS NULL

// Use case: Fallback rates when company has no specific rates
const companyRates = await CommissionRateService.getActiveByCompany(companyId);
if (companyRates.length === 0) {
  const defaults = await CommissionRateService.getDefaultSlabs();
  // Use defaults for calculation
}
```

### upsert(payload)
Create or update a commission rate.

```typescript
// Usage - Create new rate
const newRate = await CommissionRateService.upsert({
  company_id: "parle",
  company_name: "Parle",
  name: "Parle - 1000-5000",
  min_amount: 1000,
  max_amount: 5000,
  rate_pct: 4.0,
  is_active: true
});

// Usage - Update existing rate
const updatedRate = await CommissionRateService.upsert({
  id: "rate_123",  // Include ID to update
  company_id: "parle",
  company_name: "Parle",
  name: "Parle - 1000-5000",
  min_amount: 1000,
  max_amount: 5000,
  rate_pct: 4.5,  // Changed from 4.0
  is_active: true
});

// Parameters
payload: UpsertCommissionRatePayload
{
  id?: string;              // Include to update, omit to create
  company_id: string | null;
  company_name: string | null;
  name: string;
  min_amount: number;
  max_amount: number | null;
  rate_pct: number;
  is_active?: boolean;
}

// Returns
CommissionRate  // The saved rate with ID and timestamps

// Error handling
try {
  const rate = await CommissionRateService.upsert(payload);
  toast.success('Rate saved successfully');
  // Reload rates or update local state
} catch (error) {
  console.error('Save failed:', error);
  toast.error('Failed to save commission rate');
}
```

### upsertMany(payloads)
Bulk create or update multiple commission rates.

```typescript
// Usage - Bulk insert
const rates = await CommissionRateService.upsertMany([
  {
    company_id: "parle",
    company_name: "Parle",
    name: "Parle - 0-1000",
    min_amount: 0,
    max_amount: 1000,
    rate_pct: 3.0
  },
  {
    company_id: "parle",
    company_name: "Parle",
    name: "Parle - 1000-5000",
    min_amount: 1000,
    max_amount: 5000,
    rate_pct: 4.0
  },
  {
    company_id: "parle",
    company_name: "Parle",
    name: "Parle - 5000+",
    min_amount: 5000,
    max_amount: null,
    rate_pct: 5.0
  }
]);

// Parameters
payloads: UpsertCommissionRatePayload[]

// Returns
CommissionRate[]  // All saved rates

// Use case: Bulk rate updates
// Good for: Importing rates from CSV, resetting company rates
```

### delete(id)
Soft delete a commission rate (sets is_active = false).

```typescript
// Usage
await CommissionRateService.delete("rate_123");

// Parameters
id: string  // Rate ID to delete

// Returns
void  // No return value, check success via toast/try-catch

// Database effect
// UPDATE commission_rates SET is_active = false WHERE id = 'rate_123'

// Note: This is a soft delete - rate record remains in database
// To permanently delete, use hardDelete()

// Error handling
try {
  await CommissionRateService.delete(rateId);
  toast.success('Rate deleted');
  // Reload rates
  const updated = await CommissionRateService.getActiveByCompany(companyId);
  setRates(updated);
} catch (error) {
  toast.error('Failed to delete rate');
}
```

### hardDelete(id)
Permanently delete a commission rate from database.

```typescript
// Usage
await CommissionRateService.hardDelete("rate_123");

// Parameters
id: string  // Rate ID to permanently delete

// Returns
void

// Database effect
// DELETE FROM commission_rates WHERE id = 'rate_123'

// Warning: This is permanent and cannot be undone
// Prefer using delete() for audit trail

// Use case: Clean up test/duplicate data
```

---

## 2. USER COMPENSATION SERVICE

**Location**: `/services/hr.ts` (lines 120-171)  
**Import**: `import { UserCompensationService } from '@/services/hr'`

### getSalespeople()
Fetch all salespeople with compensation information.

```typescript
// Usage
const salespeople = await UserCompensationService.getSalespeople();

// Returns
UserCompensation[]
[
  {
    id: "user_001",
    name: "John Doe",
    email: "john@example.com",
    company_id: "parle",
    company_name: "Parle",
    role: "sales",
    isActive: true,
    base_salary: 20000,
    comp_plan_type: "commission",
    commission_rate_set: "parle_rates"
  },
  ...
]

// Sorted by name ascending
// Only includes role = 'sales'
```

### getById(userId)
Get specific salesperson's compensation information.

```typescript
// Usage
const salesperson = await UserCompensationService.getById("user_001");

// Parameters
userId: string  // User ID

// Returns
UserCompensation
{
  id: "user_001",
  name: "John Doe",
  email: "john@example.com",
  company_id: "parle",
  company_name: "Parle",
  role: "sales",
  isActive: true,
  base_salary: 20000,
  comp_plan_type: "commission",
  commission_rate_set: "parle_rates"
}

// Error handling
try {
  const user = await UserCompensationService.getById(userId);
  return user.base_salary;
} catch (error) {
  console.error('User not found:', error);
  return 0; // Default value
}
```

### update(payload)
Update user's compensation information.

```typescript
// Usage
await UserCompensationService.update({
  id: "user_001",
  base_salary: 25000,
  comp_plan_type: "commission",
  commission_rate_set: "parle_rates"
});

// Parameters
payload: UpdateUserCompensationPayload
{
  id: string;
  base_salary: number | null;
  comp_plan_type: 'fixed' | 'commission';
  commission_rate_set: string | null;
}

// Returns
void

// Use case: Update salesperson compensation plan
// - Increase base salary
// - Change from fixed to commission
// - Assign different commission rate set

// Error handling
try {
  await UserCompensationService.update(payload);
  toast.success('Compensation updated');
} catch (error) {
  toast.error('Failed to update compensation');
}
```

---

## 3. SALES SERVICE

**Location**: `/services/hr.ts` (lines 173-338)  
**Import**: `import { SalesService } from '@/services/hr'`

### getUserMonthlySales(userId, startDate, endDate)
Get specific salesperson's monthly sales for a date range.

```typescript
// Usage
const sales = await SalesService.getUserMonthlySales(
  "user_001",
  "2025-12-01",
  "2025-12-31"
);

// Parameters
userId: string      // Salesperson ID
startDate: string   // YYYY-MM-DD format (or YYYY-MM)
endDate: string     // YYYY-MM-DD format (or YYYY-MM)

// Returns
MonthlySalesData[]
[
  {
    user_id: "user_001",
    month: "2025-12",
    total_sales: 150000,
    order_count: 5
  },
  {
    user_id: "user_001",
    month: "2025-11",
    total_sales: 120000,
    order_count: 4
  }
]

// Note: Aggregated by month
// Only includes orders with status: APPROVED, DISPATCHED, or DELIVERED

// Example with YYYY-MM format
const sales = await SalesService.getUserMonthlySales(
  "user_001",
  "2025-12",  // Converted to 2025-12-01
  "2025-12"   // Converted to 2025-12-31
);
```

### getAllMonthlySales(startMonth, endMonth, companyId?)
Get all salespeople's monthly sales for a date range.

```typescript
// Usage - All salespeople, all companies
const allSales = await SalesService.getAllMonthlySales(
  "2025-12-01",
  "2025-12-31"
);

// Usage - All salespeople, specific company
const parleSales = await SalesService.getAllMonthlySales(
  "2025-12-01",
  "2025-12-31",
  "parle"
);

// Parameters
startMonth: string   // YYYY-MM-DD or YYYY-MM
endMonth: string     // YYYY-MM-DD or YYYY-MM
companyId?: string   // Optional company filter

// Returns
MonthlySalesData[]  // Aggregated by user + month
[
  {
    user_id: "user_001",
    month: "2025-12",
    total_sales: 150000,
    order_count: 5
  },
  {
    user_id: "user_002",
    month: "2025-12",
    total_sales: 200000,
    order_count: 6
  },
  ...
]

// Use case: HR Panel compensation calculations
// Fetches all orders for date range
// Groups by salesperson + month
// Sums amounts

// Important: Date format handling
// Both YYYY-MM and YYYY-MM-DD are supported
// Internally converted to proper PostgreSQL dates
```

### getMonthlySalesView(month)
Get raw monthly sales view data.

```typescript
// Usage
const view = await SalesService.getMonthlySalesView("2025-12");

// Parameters
month: string  // YYYY-MM format

// Returns
MonthlySalesData[]

// Note: This queries a pre-computed view
// More efficient than getAllMonthlySales for repeated queries

// Use case: Reporting, analytics
```

---

## 4. COMMISSION CALCULATOR

**Location**: `/utils/commissionCalculator.ts`  
**Import**: `import { calculateCommission, formatCurrency } from '@/utils/commissionCalculator'`

### calculateCommission(totalSales, rates)
Calculate commission based on slab structure.

```typescript
// Usage
const { commission, breakdown } = calculateCommission(
  150000,  // Total sales amount
  [
    { min_amount: 0, max_amount: 1000, rate_pct: 3 },
    { min_amount: 1000, max_amount: 5000, rate_pct: 4 },
    { min_amount: 5000, max_amount: null, rate_pct: 5 }
  ]
);

console.log(commission);  // 7050
console.log(breakdown);   // Array of slab calculations

// Parameters
totalSales: number  // Total sales amount (₹)
rates: CommissionRate[]  // Array of commission slabs

// Returns
{
  commission: number;           // Total commission amount
  breakdown: CommissionBreakdown[];  // Per-slab breakdown
}

// CommissionBreakdown structure
{
  slab_index: 0,
  min_amount: 0,
  max_amount: 1000,
  rate_pct: 3,
  sales_in_slab: 1000,
  commission_from_slab: 30
}

// Calculation example:
// Sales: ₹150,000
// Slab 1: 0-1000 @ 3% = 1000 × 0.03 = ₹30
// Slab 2: 1000-5000 @ 4% = 4000 × 0.04 = ₹160
// Slab 3: 5000+ @ 5% = 145000 × 0.05 = ₹7250
// Total: ₹7440

// Edge cases handled:
// - Overlapping ranges prevented
// - Open-ended upper bounds (null = unlimited)
// - Zero sales (returns 0)
// - Single slab rates
// - Multiple slabs
```

### formatCurrency(amount, locale, decimals)
Format number as currency.

```typescript
// Usage
const formatted = formatCurrency(15000);  // "₹15,000"
const precise = formatCurrency(15000.75, 'en-IN', 2);  // "₹15,000.75"

// Parameters
amount: number
locale?: string      // Default: 'en-IN'
decimals?: number    // Default: 0

// Returns
string  // Formatted currency string

// Examples
formatCurrency(1000);           // "₹1,000"
formatCurrency(1234567);        // "₹1,234,567"
formatCurrency(1234567.89);     // "₹1,234,568" (rounded)
formatCurrency(1234567.89, 'en-IN', 2);  // "₹1,234,567.89"
```

### validateRateSlabs(rates)
Validate commission rate structure for overlaps.

```typescript
// Usage
try {
  validateRateSlabs(rates);
  console.log('Valid rate structure');
} catch (error) {
  console.error('Invalid rates:', error);
  // error.message = "Range overlaps with existing rate: 1000 - 5000"
}

// Parameters
rates: CommissionRate[]

// Throws
SlabOverlapError if validation fails

// Validation rules:
// 1. No overlapping ranges
// 2. Ranges can be contiguous (0-1000, 1000-5000 OK)
// 3. Only one open-ended range (no max_amount)
// 4. Open-ended range must be last
// 5. min_amount < max_amount
```

---

## 5. TYPE DEFINITIONS

**Location**: `/types/hr.ts`

### CommissionRate
```typescript
interface CommissionRate {
  id: string;
  company_id: string | null;    // null = default rates
  company_name: string | null;
  name: string;
  min_amount: number;           // ₹ amount
  max_amount: number | null;    // null = unlimited
  rate_pct: number;             // 0-100
  is_active: boolean;           // Soft delete flag
  created_at: string;           // ISO timestamp
  updated_at?: string;
}
```

### UserCompensation
```typescript
interface UserCompensation {
  id: string;
  name: string;
  email?: string;
  company_id?: string;
  company_name?: string;
  role: string;               // 'sales', 'admin', etc.
  isActive: boolean;
  base_salary: number | null; // Monthly base salary (₹)
  comp_plan_type: 'fixed' | 'commission';
  commission_rate_set: string | null;
}
```

### MonthlySalesData
```typescript
interface MonthlySalesData {
  user_id: string;
  month: string;        // YYYY-MM
  total_sales: number;  // ₹ amount
  order_count: number;  // Number of orders
}
```

### UpsertCommissionRatePayload
```typescript
interface UpsertCommissionRatePayload {
  id?: string;
  company_id: string | null;
  company_name: string | null;
  name: string;
  min_amount: number;
  max_amount: number | null;
  rate_pct: number;
  is_active?: boolean;
}
```

### UpdateUserCompensationPayload
```typescript
interface UpdateUserCompensationPayload {
  id: string;
  base_salary: number | null;
  comp_plan_type: 'fixed' | 'commission';
  commission_rate_set: string | null;
}
```

---

## 6. DATABASE QUERIES

### Direct Supabase Queries (for reference)

#### Fetch active rates for company
```sql
SELECT * FROM commission_rates
WHERE company_id = $1 AND is_active = true
ORDER BY min_amount ASC
```

#### Insert/Update rate
```sql
INSERT INTO commission_rates (
  id, company_id, company_name, name, min_amount, max_amount, rate_pct, is_active
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (id) DO UPDATE SET
  min_amount = $5,
  max_amount = $6,
  rate_pct = $7,
  updated_at = NOW()
```

#### Soft delete rate
```sql
UPDATE commission_rates
SET is_active = false, updated_at = NOW()
WHERE id = $1
```

#### Fetch sales orders
```sql
SELECT salespersonId, totalAmount, date, companyId, status
FROM orders
WHERE status IN ('APPROVED', 'DISPATCHED', 'DELIVERED')
  AND date >= $1 AND date <= $2
  AND (companyId = $3 OR $3 IS NULL)
```

---

## USAGE EXAMPLES

### Complete Compensation Calculation
```typescript
// 1. Get salesperson
const user = await UserCompensationService.getById(userId);

// 2. Get sales for period
const sales = await SalesService.getUserMonthlySales(
  userId,
  "2025-12-01",
  "2025-12-31"
);

// 3. Get commission rates
const rates = await CommissionRateService.getActiveByCompany(
  user.company_id
);

// 4. Calculate commission
const totalSales = sales.reduce((sum, m) => sum + m.total_sales, 0);
const { commission, breakdown } = calculateCommission(totalSales, rates);

// 5. Calculate payout
const payout = (user.base_salary || 0) + commission;

// 6. Display
console.log({
  name: user.name,
  base_salary: user.base_salary,
  total_sales: totalSales,
  commission,
  payout,
  breakdown
});
```

### Manage Company Rates
```typescript
// In CommissionRateManager component

// 1. Load rates
useEffect(() => {
  const load = async () => {
    const rates = await CommissionRateService.getActiveByCompany(companyId);
    setRates(rates);
  };
  load();
}, [companyId]);

// 2. Add rate
const handleAdd = async (formData) => {
  const payload: UpsertCommissionRatePayload = {
    company_id: companyId,
    company_name: companyName,
    name: `${companyName} - ${formData.min}-${formData.max || '∞'}`,
    min_amount: formData.min,
    max_amount: formData.max,
    rate_pct: formData.rate,
    is_active: true
  };
  
  await CommissionRateService.upsert(payload);
  const updated = await CommissionRateService.getActiveByCompany(companyId);
  setRates(updated);
};

// 3. Delete rate
const handleDelete = async (rateId) => {
  await CommissionRateService.delete(rateId);
  const updated = await CommissionRateService.getActiveByCompany(companyId);
  setRates(updated);
};
```

---

## ERROR HANDLING PATTERNS

```typescript
// Pattern 1: Try-Catch with Toast
try {
  const result = await CommissionRateService.getAll();
  setRates(result);
} catch (error) {
  console.error('Error:', error);
  toast.error('Failed to load rates');
}

// Pattern 2: Service Error Propagation
// Services log errors and throw
// Components catch and handle

// Pattern 3: Validation Before Save
if (!validateForm()) {
  setError("Invalid data");
  return;
}

try {
  await CommissionRateService.upsert(payload);
  toast.success("Saved");
} catch (error) {
  toast.error("Save failed");
}
```

---

## TESTING PATTERNS

```typescript
// Test service directly
test('getActiveByCompany returns correct rates', async () => {
  const rates = await CommissionRateService.getActiveByCompany('parle');
  expect(rates).toHaveLength(3);
  expect(rates[0].min_amount).toBe(0);
});

// Test calculator
test('calculateCommission applies slabs correctly', () => {
  const result = calculateCommission(150000, rates);
  expect(result.commission).toBe(7050);
  expect(result.breakdown).toHaveLength(3);
});

// Test component integration
test('CommissionRateManager loads and displays rates', async () => {
  render(<CommissionRateManager companyId="parle" companyName="Parle" />);
  
  await waitFor(() => {
    expect(screen.getByText('₹1,000')).toBeInTheDocument();
  });
});
```

---

## SUMMARY

This API provides a complete system for:
- ✅ Managing commission rates per company
- ✅ Calculating commissions based on sales
- ✅ Managing user compensation
- ✅ Tracking sales data
- ✅ Validating rate structures

All methods include error handling, type safety, and database integration.
