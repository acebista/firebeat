# 🎯 Extended Compensation System: Dual Modes + Net Sales Plan

**Date**: December 7, 2025  
**Status**: Planning & Design Phase  
**Scope**: Commission Modes (Slab/Level) + Net Sales Calculation

---

## 📋 Overview

Extend the compensation system to support:
1. **Dual Commission Modes**: Slab (tiered sum) vs. Level (single band application)
2. **Net Sales Calculation**: Commission based on (Gross Sales - Returns)
3. **Enhanced UI/UX**: Mode selection, visualization, and validation

---

## 🗄️ Phase 1: Data Model Updates

### 1.1 Commission Rates Table Extension

**New Columns**:

```sql
ALTER TABLE commission_rates ADD COLUMN IF NOT EXISTS mode text DEFAULT 'slab' 
  CHECK (mode IN ('slab', 'level'));
  
ALTER TABLE commission_rates ADD COLUMN IF NOT EXISTS set_name text;

ALTER TABLE commission_rates ADD COLUMN IF NOT EXISTS apply_to text 
  DEFAULT 'company' 
  CHECK (apply_to IN ('company', 'product', 'custom'));

ALTER TABLE commission_rates ADD COLUMN IF NOT EXISTS updated_at timestamp 
  DEFAULT NOW();
```

**Migration SQL**:
```sql
-- Create new columns
ALTER TABLE commission_rates 
ADD COLUMN IF NOT EXISTS mode text DEFAULT 'slab';

ALTER TABLE commission_rates 
ADD COLUMN IF NOT EXISTS set_name text;

ALTER TABLE commission_rates 
ADD COLUMN IF NOT EXISTS apply_to text DEFAULT 'company';

-- Add constraint
ALTER TABLE commission_rates 
ADD CONSTRAINT valid_mode 
CHECK (mode IN ('slab', 'level'));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_commission_rates_company_mode 
ON commission_rates(company_id, mode, is_active);

CREATE INDEX IF NOT EXISTS idx_commission_rates_set_name 
ON commission_rates(set_name) WHERE set_name IS NOT NULL;
```

**TypeScript Types Update**:

```typescript
// types/hr.ts - Updated CommissionRate
export interface CommissionRate {
  id: string;
  company_id: string | null;
  company_name: string | null;
  name: string;
  min_amount: number;
  max_amount: number | null;
  rate_pct: number;
  is_active: boolean;
  
  // NEW FIELDS
  mode: 'slab' | 'level';           // Calculation mode
  set_name?: string | null;          // Rate set grouping (optional)
  apply_to?: 'company' | 'product' | 'custom';  // Scope
  
  created_at: string;
  updated_at?: string;
}

// NEW: Configuration per rate set
export interface CommissionRateSet {
  id: string;
  company_id: string | null;
  set_name: string;
  mode: 'slab' | 'level';
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// NEW: Level band configuration
export interface LevelBand {
  band_index: number;
  min_sales: number;
  max_sales: number;
  rate_pct: number;
  label?: string;
}
```

### 1.2 Orders Table Extension (for Returns Tracking)

**Option A: Add Returns Column to Orders**
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS sales_returns numeric DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS net_sales_amount numeric 
  GENERATED ALWAYS AS (totalAmount - COALESCE(sales_returns, 0)) STORED;

CREATE INDEX idx_orders_net_sales ON orders(net_sales_amount);
```

**Option B: Create Separate Returns Table**
```sql
CREATE TABLE IF NOT EXISTS sales_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  salesperson_id UUID NOT NULL REFERENCES users(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  return_amount numeric NOT NULL CHECK (return_amount > 0),
  return_date timestamp NOT NULL,
  reason text,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

CREATE INDEX idx_sales_returns_order ON sales_returns(order_id);
CREATE INDEX idx_sales_returns_salesperson ON sales_returns(salesperson_id, return_date);
CREATE INDEX idx_sales_returns_company ON sales_returns(company_id, return_date);
```

---

## 🔧 Phase 2: Service Layer Updates

### 2.1 Commission Calculator (Enhanced Signature)

**Updated Function Signature**:

```typescript
// utils/commissionCalculator.ts

export type CommissionMode = 'slab' | 'level';

/**
 * Enhanced commission calculation supporting both slab and level modes
 * 
 * SLAB MODE:
 *   - Breaks sales into bands
 *   - Each band's portion is calculated separately
 *   - Sum all band commissions
 *   - Example: 0-10k @ 5%, 10k-50k @ 7%, 50k+ @ 10%
 *     For 45k sales: (10k * 5%) + (35k * 7%) = 500 + 2450 = 2950
 * 
 * LEVEL MODE:
 *   - Finds which band the total sales falls into
 *   - Applies that band's rate to the ENTIRE sales amount
 *   - Example: 0-10k @ 5%, 10k-50k @ 7%, 50k+ @ 10%
 *     For 45k sales: 45k * 7% = 3150 (entire amount at level rate)
 * 
 * @param netSales - Total sales AFTER deducting returns
 * @param bands - Commission bands sorted by min_amount
 * @param mode - Calculation mode ('slab' or 'level')
 * @returns Commission amount and detailed breakdown
 */
export function calculateCommission(
  netSales: number,
  bands: CommissionRate[],
  mode: CommissionMode = 'slab'
): {
  totalCommission: number;
  breakdown: CommissionBreakdown[];
  mode: CommissionMode;
  salesBase: number;
} {
  if (!bands || bands.length === 0) {
    return { 
      totalCommission: 0, 
      breakdown: [],
      mode,
      salesBase: netSales 
    };
  }

  if (mode === 'level') {
    return calculateCommissionLevel(netSales, bands);
  } else {
    return calculateCommissionSlab(netSales, bands);
  }
}

/**
 * SLAB MODE: Tiered calculation
 * Sales are split across multiple bands
 */
function calculateCommissionSlab(
  netSales: number,
  bands: CommissionRate[]
): {
  totalCommission: number;
  breakdown: CommissionBreakdown[];
  mode: 'slab';
  salesBase: number;
} {
  // ... existing slab logic ...
  // But now operating on netSales instead of salesAmount
}

/**
 * LEVEL MODE: Single band application
 * Find the band that covers the sales amount
 * Apply its rate to the ENTIRE sales amount
 */
function calculateCommissionLevel(
  netSales: number,
  bands: CommissionRate[]
): {
  totalCommission: number;
  breakdown: CommissionBreakdown[];
  mode: 'level';
  salesBase: number;
} {
  const sortedBands = [...bands].sort((a, b) => a.min_amount - b.min_amount);
  let applicableBand: CommissionRate | null = null;

  // Find the band that covers this sales amount
  for (const band of sortedBands) {
    if (!band.is_active) continue;

    const bandMax = band.max_amount === null ? Infinity : band.max_amount;
    
    // Check if netSales falls within this band
    if (netSales >= band.min_amount && netSales < bandMax) {
      applicableBand = band;
      break;
    }
  }

  // If no band found, return 0
  if (!applicableBand) {
    return { 
      totalCommission: 0, 
      breakdown: [],
      mode: 'level',
      salesBase: netSales 
    };
  }

  // Apply the rate to the ENTIRE sales amount
  const commission = (netSales * applicableBand.rate_pct) / 100;
  
  return {
    totalCommission: parseFloat(commission.toFixed(2)),
    breakdown: [{
      slab_index: 0,
      min_amount: applicableBand.min_amount,
      max_amount: applicableBand.max_amount,
      rate_pct: applicableBand.rate_pct,
      sales_in_slab: netSales,  // Entire amount
      commission_from_slab: commission,
    }],
    mode: 'level',
    salesBase: netSales
  };
}
```

### 2.2 Commission Rate Service (Updated)

```typescript
// services/commissionRates.ts (NEW)

export const CommissionRateService = {
  /**
   * Fetch rates by company and mode
   */
  async getByCompanyAndMode(
    companyId: string | null,
    mode: CommissionMode = 'slab'
  ): Promise<CommissionRate[]> {
    const { data, error } = await supabase
      .from('commission_rates')
      .select('*')
      .eq('company_id', companyId)
      .eq('mode', mode)
      .eq('is_active', true)
      .order('min_amount', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch by company, mode, and optional set name
   */
  async getByCompanyModeAndSet(
    companyId: string | null,
    mode: CommissionMode,
    setName?: string | null
  ): Promise<CommissionRate[]> {
    let query = supabase
      .from('commission_rates')
      .select('*')
      .eq('company_id', companyId)
      .eq('mode', mode)
      .eq('is_active', true);

    if (setName) {
      query = query.eq('set_name', setName);
    }

    const { data, error } = await query.order('min_amount', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  /**
   * List all available rate sets for a company
   */
  async getAvailableSets(companyId: string | null): Promise<CommissionRateSet[]> {
    const { data, error } = await supabase
      .from('commission_rates')
      .select('company_id, set_name, mode')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .distinct();

    if (error) throw error;
    
    // Group by set_name and mode
    const sets = new Map<string, CommissionRateSet>();
    data?.forEach((row: any) => {
      const key = `${row.set_name || 'default'}-${row.mode}`;
      if (!sets.has(key)) {
        sets.set(key, {
          id: key,
          company_id: row.company_id,
          set_name: row.set_name || 'Default',
          mode: row.mode,
          is_active: true,
          created_at: new Date().toISOString(),
        });
      }
    });

    return Array.from(sets.values());
  },

  /**
   * Validate level bands for coverage and order
   */
  async validateLevelBands(bands: LevelBand[]): Promise<string[]> {
    const errors: string[] = [];

    if (bands.length === 0) {
      errors.push('At least one band is required');
      return errors;
    }

    // Sort by min_sales
    const sorted = [...bands].sort((a, b) => a.min_sales - b.min_sales);

    // Check first band starts at 0
    if (sorted[0].min_sales !== 0) {
      errors.push('First band must start at 0');
    }

    // Check contiguous coverage
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].max_sales !== sorted[i + 1].min_sales) {
        errors.push(
          `Gap or overlap between band ${i} and ${i + 1}: ` +
          `${sorted[i].max_sales} vs ${sorted[i + 1].min_sales}`
        );
      }
    }

    // Check no duplicate ranges
    const ranges = new Set(bands.map(b => `${b.min_sales}-${b.max_sales}`));
    if (ranges.size !== bands.length) {
      errors.push('Duplicate band ranges found');
    }

    return errors;
  },

  /**
   * Validate slab bands for no overlap
   */
  async validateSlabBands(bands: CommissionRate[]): Promise<string[]> {
    return validateSlabsNoOverlapWithErrors(bands);
  }
};
```

### 2.3 Sales & Returns Service (NEW)

```typescript
// services/sales.ts (NEW/EXTENDED)

export const SalesService = {
  /**
   * Calculate net sales for a user across date range
   * NET = Gross Orders - Returns (by status or separate returns table)
   */
  async getNetSalesByUser(
    userId: string,
    startDate: string,
    endDate: string,
    companyId?: string | null
  ): Promise<{
    grossSales: number;
    returns: number;
    netSales: number;
    orderCount: number;
    returnCount: number;
  }> {
    let ordersQuery = supabase
      .from('orders')
      .select('totalAmount')
      .eq('salespersonId', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .in('status', ['APPROVED', 'DISPATCHED', 'DELIVERED']);

    if (companyId) {
      // If orders table has company_id (add if needed)
      // ordersQuery = ordersQuery.eq('companyId', companyId);
    }

    const { data: orders, error: orderError } = await ordersQuery;
    if (orderError) throw orderError;

    const grossSales = (orders || []).reduce(
      (sum, o: any) => sum + o.totalAmount,
      0
    );
    const orderCount = orders?.length || 0;

    // Fetch returns (if using separate returns table)
    let returns = 0;
    let returnCount = 0;

    // Option A: If returns are in orders table (sales_returns column)
    // This would be calculated above

    // Option B: If returns are in separate table
    if (supabase.from('sales_returns')) {
      const { data: returnData } = await supabase
        .from('sales_returns')
        .select('return_amount')
        .eq('salesperson_id', userId)
        .gte('return_date', startDate)
        .lte('return_date', endDate)
        .eq('is_active', true);

      returns = (returnData || []).reduce(
        (sum, r: any) => sum + r.return_amount,
        0
      );
      returnCount = returnData?.length || 0;
    }

    const netSales = Math.max(0, grossSales - returns);

    return {
      grossSales,
      returns,
      netSales,
      orderCount,
      returnCount,
    };
  },

  /**
   * Get detailed net sales breakdown by company
   */
  async getNetSalesByUserAndCompany(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Array<{
    companyId: string;
    companyName: string;
    grossSales: number;
    returns: number;
    netSales: number;
  }>> {
    // Similar to above but grouped by company
    // This supports per-company commission rates
  }
};
```

---

## 🎨 Phase 3: UI/UX Updates

### 3.1 Commission Mode Selector (in Settings)

**Component**: `CommissionModeSelector.tsx`

```typescript
interface CommissionModeSelectorProps {
  companyId: string | null;
  currentMode: CommissionMode;
  onModeChange: (mode: CommissionMode) => void;
}

export const CommissionModeSelector: React.FC<CommissionModeSelectorProps> = ({
  companyId,
  currentMode,
  onModeChange,
}) => {
  return (
    <Card className="p-4 bg-blue-50 border-2 border-blue-200">
      <h3 className="font-semibold mb-3">Commission Mode</h3>
      <div className="space-y-3">
        
        {/* SLAB MODE */}
        <label className="flex items-center p-3 border-2 rounded cursor-pointer 
          hover:bg-blue-100 transition"
          style={{
            borderColor: currentMode === 'slab' ? '#3b82f6' : '#d1d5db'
          }}
        >
          <input
            type="radio"
            value="slab"
            checked={currentMode === 'slab'}
            onChange={(e) => onModeChange(e.target.value as CommissionMode)}
            className="w-4 h-4 mr-3"
          />
          <div>
            <div className="font-medium">Slab (Tiered)</div>
            <div className="text-sm text-gray-600">
              Commission calculated across multiple bands.
              Each portion of sales applies its band's rate.
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Example: 0-10k @ 5%, 10-50k @ 7%, 50k+ @ 10%
              → 45k sales = (10k × 5%) + (35k × 7%) = 2,950
            </div>
          </div>
        </label>

        {/* LEVEL MODE */}
        <label className="flex items-center p-3 border-2 rounded cursor-pointer 
          hover:bg-blue-100 transition"
          style={{
            borderColor: currentMode === 'level' ? '#3b82f6' : '#d1d5db'
          }}
        >
          <input
            type="radio"
            value="level"
            checked={currentMode === 'level'}
            onChange={(e) => onModeChange(e.target.value as CommissionMode)}
            className="w-4 h-4 mr-3"
          />
          <div>
            <div className="font-medium">Level (Brackets)</div>
            <div className="text-sm text-gray-600">
              Entire sales amount gets the rate for its bracket.
              Find the band containing your total sales.
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Example: 0-10k @ 5%, 10-50k @ 7%, 50k+ @ 10%
              → 45k sales = 45k × 7% = 3,150 (entire amount at level rate)
            </div>
          </div>
        </label>

        {/* WARNING */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <div className="font-semibold text-yellow-900">⚠️ Warning</div>
          <div className="text-yellow-800">
            Changing the mode will reinterpret all existing bands.
            Slab and Level modes calculate differently.
            Please review your bands after changing modes.
          </div>
        </div>

      </div>
    </Card>
  );
};
```

### 3.2 Band Editor (Mode-Specific)

**Slab Mode Editor** (existing, enhanced):
```typescript
// components/CommissionBandEditor.tsx
interface SlabEditorProps {
  bands: CommissionRate[];
  onBandsChange: (bands: CommissionRate[]) => void;
  companyId: string | null;
}

// Shows: Min, Max, Rate % columns
// Validates: No overlaps
// Highlights: Applied portions for sample sales
```

**Level Mode Editor** (new):
```typescript
interface LevelEditorProps {
  bands: CommissionRate[];
  onBandsChange: (bands: CommissionRate[]) => void;
  sampleSales?: number; // Show which band applies
  companyId: string | null;
}

// Shows: Min, Max, Rate % columns (consecutive bands)
// Validates: Coverage (0 to max), no gaps
// Preview: Highlights which band applies for sample sales amount
// Example: Sample sales = 45000 → highlights the 10k-50k band
```

### 3.3 HR Panel: Compensation Table (Updated)

**Columns**:
```
Salesperson | Gross Sales | Returns | Net Sales | Mode | Commission | Base | Payout
```

**Implementation**:
```typescript
interface CompensationDetail {
  // ... existing fields ...
  
  // NEW
  grossSales: number;
  returns: number;
  netSales: number;
  commissionMode: CommissionMode;
}

// In HR Panel render:
<tr>
  <td>{comp.salesperson}</td>
  <td>{formatCurrency(comp.grossSales)}</td>
  <td className="text-red-600">-{formatCurrency(comp.returns)}</td>
  <td className="font-semibold">{formatCurrency(comp.netSales)}</td>
  <td>
    <Badge variant={comp.commissionMode === 'slab' ? 'blue' : 'purple'}>
      {comp.commissionMode.toUpperCase()}
    </Badge>
  </td>
  <td className="text-green-600">{formatCurrency(comp.commission)}</td>
  <td>{formatCurrency(comp.baseSalary)}</td>
  <td className="font-bold">{formatCurrency(comp.payout)}</td>
</tr>

// Tooltip on column headers:
// "Commission = rate applied to Net Sales (Gross - Returns)"
```

---

## 🧪 Phase 4: Validation & Testing

### 4.1 Validation Functions

```typescript
// utils/commissionValidator.ts

export function validateModeSwitch(
  oldMode: CommissionMode,
  newMode: CommissionMode,
  bands: CommissionRate[]
): { warning: string; affected: number } | null {
  if (oldMode === newMode) return null;

  // Warn that bands will be reinterpreted
  return {
    warning: `Switching from ${oldMode} to ${newMode} mode. 
      Existing bands will be reinterpreted using ${newMode} logic.`,
    affected: bands.length,
  };
}

export function validateNetSalesCalculation(
  grossSales: number,
  returns: number
): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (returns < 0) {
    warnings.push('Returns cannot be negative');
  }

  if (returns > grossSales) {
    warnings.push('Returns exceed gross sales; net sales will be 0');
  }

  if (grossSales === 0 && returns > 0) {
    warnings.push('Unusual: returns but no sales');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
  };
}
```

### 4.2 Test Cases

**Unit Tests** (jest/vitest):

```typescript
// utils/__tests__/commissionCalculator.test.ts

describe('calculateCommission', () => {
  
  // SLAB MODE TESTS
  describe('Slab Mode', () => {
    const slabBands: CommissionRate[] = [
      { min: 0, max: 10000, rate: 5 },
      { min: 10000, max: 50000, rate: 7 },
      { min: 50000, max: null, rate: 10 },
    ];

    it('should calculate tiered commission for partial fills', () => {
      const result = calculateCommission(45000, slabBands, 'slab');
      // (10k - 0k) * 5% + (50k - 10k) * 7% = 500 + 2800 = 3300
      // Wait: 45k means it stops within the second band
      // (10k * 5%) + (35k * 7%) = 500 + 2450 = 2950
      expect(result.totalCommission).toBe(2950);
    });

    it('should handle returns reducing sales into lower band', () => {
      // Gross: 55k, Returns: 10k, Net: 45k
      const result = calculateCommission(45000, slabBands, 'slab');
      expect(result.totalCommission).toBe(2950);
      // Without returns, 55k would be: (10k*5%) + (40k*7%) + (5k*10%) = 4450
      // With returns, 45k: (10k*5%) + (35k*7%) = 2950
      // Difference shows impact of returns
    });

    it('should return 0 for empty bands', () => {
      const result = calculateCommission(10000, [], 'slab');
      expect(result.totalCommission).toBe(0);
    });

    it('should handle boundary values', () => {
      // Exactly at band boundary
      const result1 = calculateCommission(10000, slabBands, 'slab');
      expect(result1.breakdown[0].sales_in_slab).toBe(10000);

      const result2 = calculateCommission(50000, slabBands, 'slab');
      // 10k @ 5% + 40k @ 7% = 500 + 2800 = 3300
      expect(result2.totalCommission).toBe(3300);
    });
  });

  // LEVEL MODE TESTS
  describe('Level Mode', () => {
    const levelBands: CommissionRate[] = [
      { min: 0, max: 10000, rate: 5 },
      { min: 10000, max: 50000, rate: 7 },
      { min: 50000, max: null, rate: 10 },
    ];

    it('should apply entire sales to single band rate', () => {
      // 45k falls in 10k-50k band (7%)
      const result = calculateCommission(45000, levelBands, 'level');
      expect(result.totalCommission).toBe(3150);  // 45k * 7%
      expect(result.breakdown[0].sales_in_slab).toBe(45000);  // Entire amount
    });

    it('should select correct band for sales amount', () => {
      // Below first band max
      const result1 = calculateCommission(5000, levelBands, 'level');
      expect(result1.totalCommission).toBe(250);  // 5k * 5%

      // In middle band
      const result2 = calculateCommission(30000, levelBands, 'level');
      expect(result2.totalCommission).toBe(2100);  // 30k * 7%

      // In highest band
      const result3 = calculateCommission(100000, levelBands, 'level');
      expect(result3.totalCommission).toBe(10000);  // 100k * 10%
    });

    it('should handle returns moving sales to lower band', () => {
      // Gross: 55k, Returns: 10k, Net: 45k
      // 55k would be in 50k+ band (10%) = 5500
      // 45k is in 10k-50k band (7%) = 3150
      const result = calculateCommission(45000, levelBands, 'level');
      expect(result.totalCommission).toBe(3150);
    });

    it('should return 0 if no band covers sales', () => {
      const limitedBands: CommissionRate[] = [
        { min: 0, max: 10000, rate: 5 },
      ];
      const result = calculateCommission(15000, limitedBands, 'level');
      expect(result.totalCommission).toBe(0);
    });

    it('should handle boundary values', () => {
      // Exactly at band min
      const result1 = calculateCommission(10000, levelBands, 'level');
      expect(result1.totalCommission).toBe(700);  // 10k * 7%

      // Exactly at band max (exclusive)
      const result2 = calculateCommission(50000, levelBands, 'level');
      expect(result2.totalCommission).toBe(5000);  // 50k * 10%
    });
  });

  // NET SALES TESTS
  describe('Net Sales Calculation', () => {
    it('should subtract returns from gross sales', () => {
      const gross = 100000;
      const returns = 10000;
      const net = gross - returns;
      expect(net).toBe(90000);
    });

    it('should handle zero returns', () => {
      const result = calculateCommission(50000, levelBands, 'level');
      expect(result.salesBase).toBe(50000);
    });

    it('should handle high returns', () => {
      // Returns near/at gross sales
      const result = calculateCommission(100, levelBands, 'level');
      expect(result.totalCommission).toBeGreaterThanOrEqual(0);
    });
  });
});
```

**Integration Tests** (HR Panel flow):

```typescript
// components/__tests__/HRPanel.integration.test.ts

describe('HR Panel with Net Sales & Modes', () => {
  it('should calculate compensation correctly for slab mode', async () => {
    // Mock data
    const salesPerson = { id: '1', name: 'John', comp_plan_type: 'commission' };
    const orders = [
      { totalAmount: 50000, status: 'DELIVERED' },
    ];
    const returns = [
      { return_amount: 5000 },
    ];

    // Net sales = 50000 - 5000 = 45000
    // With slab bands [0-10k @ 5%, 10-50k @ 7%, 50k+ @ 10%]
    // Commission = (10k * 5%) + (35k * 7%) = 2950

    const netSales = 45000;
    const commission = calculateCommission(netSales, bands, 'slab');
    expect(commission.totalCommission).toBe(2950);
  });

  it('should display correct mode badge in table', async () => {
    // Render HR panel with mixed modes
    // Verify slab displays as "SLAB" badge
    // Verify level displays as "LEVEL" badge
  });

  it('should show gross, returns, net in compensation table', async () => {
    // Verify three columns display
    // Gross: 50000
    // Returns: -5000 (in red)
    // Net: 45000
  });
});
```

---

## 📊 Phase 5: Migration Strategy

### 5.1 Data Migration SQL

```sql
-- Step 1: Add new columns
ALTER TABLE commission_rates 
ADD COLUMN IF NOT EXISTS mode text DEFAULT 'slab',
ADD COLUMN IF NOT EXISTS set_name text,
ADD COLUMN IF NOT EXISTS apply_to text DEFAULT 'company',
ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT NOW();

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_commission_rates_company_mode 
ON commission_rates(company_id, mode, is_active);

CREATE INDEX IF NOT EXISTS idx_commission_rates_set_name 
ON commission_rates(set_name) WHERE set_name IS NOT NULL;

-- Step 3: Add returns tracking (choose A or B)

-- OPTION A: Add to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS sales_returns numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS net_sales_amount numeric 
  GENERATED ALWAYS AS (totalAmount - COALESCE(sales_returns, 0)) STORED;

-- OPTION B: Create returns table
CREATE TABLE IF NOT EXISTS sales_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  salesperson_id UUID NOT NULL REFERENCES users(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  return_amount numeric NOT NULL CHECK (return_amount > 0),
  return_date timestamp NOT NULL,
  reason text,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

CREATE INDEX idx_sales_returns_salesperson_date 
ON sales_returns(salesperson_id, return_date);

-- Step 4: Verify data integrity
SELECT 
  company_id,
  COUNT(*) as total_rates,
  COUNT(DISTINCT mode) as distinct_modes,
  array_agg(DISTINCT mode) as modes
FROM commission_rates
GROUP BY company_id;

-- Expected output: All rows should have mode='slab' (default)
```

### 5.2 Rollback Plan

```sql
-- If needed, revert changes
ALTER TABLE commission_rates DROP COLUMN IF EXISTS mode;
ALTER TABLE commission_rates DROP COLUMN IF EXISTS set_name;
ALTER TABLE commission_rates DROP COLUMN IF EXISTS apply_to;
ALTER TABLE commission_rates DROP COLUMN IF EXISTS updated_at;

DROP INDEX IF EXISTS idx_commission_rates_company_mode;
DROP INDEX IF EXISTS idx_commission_rates_set_name;

-- For returns
ALTER TABLE orders DROP COLUMN IF EXISTS sales_returns;
ALTER TABLE orders DROP COLUMN IF EXISTS net_sales_amount;

DROP TABLE IF EXISTS sales_returns;
```

---

## 🚀 Implementation Checklist

### Phase 1: Data Model
- [ ] Add `mode`, `set_name`, `apply_to` columns to commission_rates
- [ ] Add indexes for company_id, mode, set_name
- [ ] Create or extend returns tracking (orders or separate table)
- [ ] Run migration in dev environment
- [ ] Test data integrity

### Phase 2: Services
- [ ] Update CommissionRate types
- [ ] Implement calculateCommissionSlab() and calculateCommissionLevel()
- [ ] Update main calculateCommission() dispatcher
- [ ] Implement SalesService.getNetSalesByUser()
- [ ] Implement validation functions
- [ ] Add unit tests

### Phase 3: UI Components
- [ ] Create CommissionModeSelector component
- [ ] Enhance SlabEditor with validation
- [ ] Create LevelEditor component with preview
- [ ] Update HR Panel table (add Gross/Returns/Net columns)
- [ ] Add mode badges and tooltips
- [ ] Update Summary row calculations

### Phase 4: Integration
- [ ] Update HRPanel to fetch net sales
- [ ] Update HRPanel compensation calculation
- [ ] Test mode switching
- [ ] Test return value changes
- [ ] Verify console for warnings/errors

### Phase 5: Testing & Deployment
- [ ] Run full test suite
- [ ] Manual QA: test both modes
- [ ] Load testing with large datasets
- [ ] Document for admins
- [ ] Deploy to staging
- [ ] Deploy to production with rollback ready

---

## 📝 Documentation to Create

1. **Admin Guide**: How to switch modes, edit bands, understand impacts
2. **Developer Guide**: API usage, calculation examples, testing
3. **User Guide**: How compensation is calculated (with/without returns)
4. **Migration Notes**: What changed, backwards compatibility
5. **Troubleshooting**: Common issues and solutions

---

## ⚡ Quick Reference

### Key Differences: Slab vs. Level

| Aspect | Slab | Level |
|--------|------|-------|
| **Calculation** | Tiered sum across bands | Entire sales at one rate |
| **Use Case** | Incentivizes higher sales | Simpler, brackets-based |
| **45k Sales Example** | (10k × 5%) + (35k × 7%) = 2,950 | 45k × 7% = 3,150 |
| **Band Structure** | Min/Max ranges (tiered) | Consecutive brackets |
| **Admin Setup** | Prevent overlaps | Ensure continuous coverage |

### Net Sales Formula

```
Net Sales = Gross Sales - Returns
Commission = calculated on Net Sales (not Gross)
```

### Commission Formula by Mode

```typescript
// SLAB: Each portion gets its band rate
totalCommission = Σ(portionInBand × rate) for each band

// LEVEL: Entire sales gets its band rate
totalCommission = totalSales × applicableBandRate
```

---

**Status**: ✅ Plan Complete  
**Next**: Begin Phase 1 implementation

