# Extended Compensation System: Service Implementation Guide

**Date**: December 7, 2025  
**Status**: Ready for Implementation  
**Phase**: Service Layer & Database Integration

---

## Overview

This guide covers implementing the service layer extensions to support:
- **Dual commission modes** (slab vs. level)
- **Net sales calculation** (gross sales - returns)
- **Enhanced data queries** with mode/set filtering

## Current State

✅ **Completed**:
- `types/hr-extended.ts` - Full type definitions with 394 lines
- `utils/commissionCalculator-extended.ts` - Complete calculator with 532 lines
- `extended_compensation_migration.sql` - Database migration ready
- Documentation files

⏳ **Pending**:
- Service method extensions in `services/hr.ts`
- UI components updates in `components/admin/`
- Database migration execution
- Testing

---

## Service Layer Implementation

### 1. Extend CommissionRateService

**File**: `services/hr.ts`

Add these methods to the `CommissionRateService` object:

```typescript
/**
 * Fetch commission rates for a company filtered by mode
 */
async getByCompanyAndMode(companyId: string | null, mode: CommissionMode): Promise<CommissionRate[]> {
  const { data, error } = await supabase
    .from('commission_rates')
    .select('*')
    .eq('company_id', companyId)
    .eq('mode', mode)
    .eq('is_active', true)
    .order('min_amount', { ascending: true });

  if (error) {
    console.error('Error fetching commission rates by mode:', error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch commission rate set for a company
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

  if (error) {
    console.error('Error fetching commission rate set:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get all available rate sets for a company
 */
async getAvailableSets(companyId: string | null): Promise<CommissionRateSet[]> {
  const { data, error } = await supabase
    .from('commission_rates')
    .select('id, company_id, set_name, mode, is_active')
    .eq('company_id', companyId)
    .eq('is_active', true)
    .not('set_name', 'is', null);

  if (error) {
    console.error('Error fetching rate sets:', error);
    throw error;
  }

  // Group by set_name and mode
  const sets = new Map<string, CommissionRateSet>();
  
  for (const rate of (data || [])) {
    const key = `${rate.set_name}-${rate.mode}`;
    if (!sets.has(key)) {
      sets.set(key, {
        id: rate.id,
        company_id: rate.company_id,
        set_name: rate.set_name!,
        mode: rate.mode as CommissionMode,
        is_active: rate.is_active,
        created_at: new Date().toISOString(),
      });
    }
  }

  return Array.from(sets.values());
}

/**
 * Validate slab bands - check for overlaps
 */
async validateSlabBands(bands: CommissionRate[]): Promise<string[]> {
  return validateSlabBands(bands); // Uses util function
}

/**
 * Validate level bands - check coverage and contiguity
 */
async validateLevelBands(bands: CommissionRate[]): Promise<string[]> {
  return validateLevelBands(bands); // Uses util function
}
```

**Import statements to add**:
```typescript
import {
  CommissionMode,
  CommissionRateSet,
  CommissionCalculationResult,
} from '@/types/hr-extended';
import {
  validateSlabBands,
  validateLevelBands,
  calculateCommission,
  calculateCommissionWithReturns,
} from '@/utils/commissionCalculator-extended';
```

---

### 2. Create SalesService Extensions

Add these methods to handle net sales calculations:

```typescript
export const SalesService = {
  /**
   * Get net sales (gross - returns) for a user in a date range
   */
  async getNetSalesByUser(
    userId: string,
    startDate: string,
    endDate: string,
    companyId?: string | null
  ): Promise<NetSalesBreakdown> {
    const startDateTime = `${startDate}T00:00:00Z`;
    const endDateTime = `${endDate}T23:59:59Z`;

    // Fetch orders
    let ordersQuery = supabase
      .from('orders')
      .select('id, totalAmount, sales_returns, salespersonId, date')
      .eq('salespersonId', userId)
      .gte('date', startDateTime)
      .lte('date', endDateTime);

    const { data: orders, error: ordersError } = await ordersQuery;

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      throw ordersError;
    }

    // Calculate totals
    let grossSales = 0;
    let returns = 0;
    const orderCount = orders?.length || 0;

    for (const order of (orders || [])) {
      grossSales += order.totalAmount || 0;
      returns += order.sales_returns || 0;
    }

    const netSales = grossSales - returns;

    // Fetch returns from separate table if exists
    let returnCount = 0;
    try {
      const { data: returnRecords } = await supabase
        .from('sales_returns')
        .select('id')
        .eq('salesperson_id', userId)
        .gte('return_date', startDateTime)
        .lte('return_date', endDateTime)
        .eq('is_active', true);

      returnCount = returnRecords?.length || 0;
    } catch (e) {
      // Table may not exist yet
      console.warn('sales_returns table not found, skipping');
    }

    return {
      grossSales,
      returns,
      netSales,
      orderCount,
      returnCount,
    };
  },

  /**
   * Get net sales breakdown for multiple users by company
   */
  async getNetSalesByUserAndCompany(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<NetSalesBreakdown[]> {
    const startDateTime = `${startDate}T00:00:00Z`;
    const endDateTime = `${endDate}T23:59:59Z`;

    // Get all companies user belongs to (via orders)
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, totalAmount, sales_returns, salespersonId, date, company_id')
      .eq('salespersonId', userId)
      .gte('date', startDateTime)
      .lte('date', endDateTime);

    if (error) {
      console.error('Error fetching orders by company:', error);
      throw error;
    }

    // Group by company
    const byCompany = new Map<string, {
      gross: number;
      returns: number;
      orderCount: number;
      returnCount: number;
    }>();

    for (const order of (orders || [])) {
      const companyId = order.company_id || 'default';
      const existing = byCompany.get(companyId) || {
        gross: 0,
        returns: 0,
        orderCount: 0,
        returnCount: 0,
      };

      existing.gross += order.totalAmount || 0;
      existing.returns += order.sales_returns || 0;
      existing.orderCount += 1;

      byCompany.set(companyId, existing);
    }

    // Convert to array
    return Array.from(byCompany.entries()).map(([, data]) => ({
      grossSales: data.gross,
      returns: data.returns,
      netSales: data.gross - data.returns,
      orderCount: data.orderCount,
      returnCount: data.returnCount,
    }));
  },

  /**
   * Calculate compensation for a user including commission
   */
  async calculateUserCompensation(
    userId: string,
    startDate: string,
    endDate: string,
    companyId?: string | null
  ): Promise<CompensationDetail> {
    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email, base_salary, comp_plan_type, commission_rate_set')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      throw userError;
    }

    // Get net sales
    const netSalesData = await this.getNetSalesByUser(
      userId,
      startDate,
      endDate,
      companyId
    );

    // Get commission rates for user's rate set
    let commissionMode: CommissionMode = 'slab';
    let commissionBands: CommissionRate[] = [];

    if (user.commission_rate_set) {
      const bands = await CommissionRateService.getByCompanyModeAndSet(
        companyId || null,
        'slab',
        user.commission_rate_set
      );
      commissionBands = bands;
      if (bands.length > 0) {
        commissionMode = bands[0].mode;
      }
    } else {
      // Use default company rates
      commissionBands = await CommissionRateService.getActiveByCompany(companyId || null);
    }

    // Calculate commission
    const commissionResult = calculateCommissionWithReturns(
      netSalesData.grossSales,
      netSalesData.returns,
      commissionBands,
      commissionMode
    );

    // Get company name
    const { data: company } = await supabase
      .from('companies')
      .select('name')
      .eq('id', companyId)
      .single();

    return {
      userId,
      userName: user.name,
      userEmail: user.email,
      baseSalary: user.base_salary || 0,
      companyId: companyId || '',
      companyName: company?.name || 'Default',
      commissionMode,
      rateSetName: user.commission_rate_set,
      startDate,
      endDate,
      grossSales: netSalesData.grossSales,
      returns: netSalesData.returns,
      netSales: netSalesData.netSales,
      salesItems: [], // Could populate from orders
      totalCommission: commissionResult.totalCommission,
      totalPayout: (user.base_salary || 0) + commissionResult.totalCommission,
    };
  },
};
```

**Imports to add**:
```typescript
import { NetSalesBreakdown, CompensationDetail, CommissionMode } from '@/types/hr-extended';
```

---

## Database Migration Steps

### Before Execution

1. **Backup your database** (Supabase offers backup features)
2. **Review migration SQL** in `extended_compensation_migration.sql`
3. **Test in a staging environment** (if available)

### Execution

1. **Open Supabase Dashboard**
   - Go to SQL Editor
   - Create new query

2. **Copy and execute Phase 1 (Commission Rates)**
   ```sql
   -- Run lines 1-40 from extended_compensation_migration.sql
   ```

3. **Verify columns added**
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'commission_rates'
   ORDER BY ordinal_position;
   ```

4. **Execute Phase 2 (Sales Returns - Choose Option A or B)**
   - Option A: Add to orders table (simpler)
   - Option B: Create separate table (recommended for complex returns)

5. **Run backfill** (Phase 3)
   ```sql
   UPDATE commission_rates 
   SET mode = 'slab' 
   WHERE mode IS NULL;
   ```

6. **Verify data**
   ```sql
   SELECT COUNT(*), mode, is_active 
   FROM commission_rates 
   GROUP BY mode, is_active;
   ```

---

## UI Component Updates

### 1. CommissionRateManager.tsx Updates

Add mode selector to existing form:

```typescript
// Add to form state
const [selectedMode, setSelectedMode] = useState<CommissionMode>('slab');
const [selectedSetName, setSelectedSetName] = useState<string | null>(null);

// Add to form UI
<div className="mb-4">
  <label className="block text-sm font-medium mb-2">Mode</label>
  <select
    value={selectedMode}
    onChange={(e) => setSelectedMode(e.target.value as CommissionMode)}
    className="w-full p-2 border rounded"
  >
    <option value="slab">Slab (Tiered)</option>
    <option value="level">Level (Bracket)</option>
  </select>
  <p className="text-xs text-gray-500 mt-1">
    {selectedMode === 'slab'
      ? 'Each band portion gets its rate'
      : 'Entire sales at one rate'}
  </p>
</div>

// Update payload
const payload: UpsertCommissionRatePayload = {
  ...existingFields,
  mode: selectedMode,
  set_name: selectedSetName,
};
```

### 2. HRPanel.tsx Updates

Add columns for gross/returns/net:

```typescript
// In the compensation table
const columns = [
  'Name',
  'Gross Sales',
  'Returns',
  'Net Sales',
  'Mode',
  'Commission',
  'Base',
  'Payout',
];

// Add data fields
<td>${compensation.grossSales.toLocaleString()}</td>
<td>${compensation.returns.toLocaleString()}</td>
<td>${compensation.netSales.toLocaleString()}</td>
<td>
  <Badge variant={compensation.commissionMode === 'slab' ? 'blue' : 'green'}>
    {compensation.commissionMode.toUpperCase()}
  </Badge>
</td>
```

### 3. New Component: CommissionModeSelector.tsx

Create new file `components/admin/CommissionModeSelector.tsx`:

```typescript
import React from 'react';
import { CommissionMode } from '@/types/hr-extended';
import { Card } from '../ui/Elements';

interface CommissionModeSelectorProps {
  mode: CommissionMode;
  onChange: (mode: CommissionMode) => void;
  disabled?: boolean;
}

export const CommissionModeSelector: React.FC<CommissionModeSelectorProps> = ({
  mode,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Commission Mode</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* SLAB Mode */}
        <Card
          className={`p-4 cursor-pointer transition ${
            mode === 'slab' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
          onClick={() => onChange('slab')}
        >
          <h4 className="font-medium">Slab Mode</h4>
          <p className="text-sm text-gray-600">
            Tiered calculation - each band portion gets its rate
          </p>
          <div className="mt-2 text-xs">
            <div>Example: 45k sales</div>
            <div className="text-gray-500">
              (10k × 5%) + (35k × 7%) = 2,950
            </div>
          </div>
        </Card>

        {/* LEVEL Mode */}
        <Card
          className={`p-4 cursor-pointer transition ${
            mode === 'level' ? 'border-green-500 bg-green-50' : 'border-gray-200'
          }`}
          onClick={() => onChange('level')}
        >
          <h4 className="font-medium">Level Mode</h4>
          <p className="text-sm text-gray-600">
            Bracket-based - entire sales at one rate
          </p>
          <div className="mt-2 text-xs">
            <div>Example: 45k sales</div>
            <div className="text-gray-500">
              45k × 7% = 3,150
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
```

---

## Testing Checklist

### Unit Tests

Create `__tests__/commissionCalculator-extended.test.ts`:

```typescript
import {
  calculateCommission,
  calculateCommissionWithReturns,
  validateSlabBands,
  validateLevelBands,
} from '@/utils/commissionCalculator-extended';

describe('Slab Mode', () => {
  const bands = [
    { min_amount: 0, max_amount: 10000, rate_pct: 5 },
    { min_amount: 10000, max_amount: 50000, rate_pct: 7 },
    { min_amount: 50000, max_amount: null, rate_pct: 10 },
  ];

  test('calculates 45k correctly', () => {
    const result = calculateCommission(45000, bands, 'slab');
    expect(result.totalCommission).toBe(2950);
  });

  test('calculates with returns', () => {
    const result = calculateCommissionWithReturns(50000, 5000, bands, 'slab');
    expect(result.netSales).toBe(45000);
    expect(result.totalCommission).toBe(2950);
  });
});

describe('Level Mode', () => {
  const bands = [
    { min_amount: 0, max_amount: 10000, rate_pct: 5 },
    { min_amount: 10000, max_amount: 50000, rate_pct: 7 },
    { min_amount: 50000, max_amount: null, rate_pct: 10 },
  ];

  test('applies bracket rate to entire amount', () => {
    const result = calculateCommission(45000, bands, 'level');
    expect(result.totalCommission).toBe(3150);
  });

  test('validates level bands', () => {
    const errors = validateLevelBands(bands);
    expect(errors.length).toBe(0);
  });
});
```

### Manual Testing

1. **Setup Commission Modes**
   - Create slab mode rates
   - Create level mode rates
   - Verify in database

2. **Test Calculations**
   - Add sales with returns
   - Calculate commission
   - Verify results match expected

3. **Test UI**
   - Load HR panel
   - Verify columns display correctly
   - Check mode badges

---

## Deployment Checklist

- [ ] Database migration executed and verified
- [ ] Service methods added to `services/hr.ts`
- [ ] Types imported where needed
- [ ] UI components updated
- [ ] Unit tests passing
- [ ] Manual testing complete
- [ ] No TypeScript errors
- [ ] Code review complete

---

## Support & Troubleshooting

### Common Issues

**Issue**: "Unknown column 'mode' in commission_rates"
- **Solution**: Run Phase 1 of migration SQL

**Issue**: Type errors with CommissionMode
- **Solution**: Ensure `hr-extended.ts` is imported, not just `hr.ts`

**Issue**: Mode switch changes existing calculations
- **Solution**: This is expected - validate bands after mode switch

### Contact

For questions, check:
1. Type definitions: `types/hr-extended.ts`
2. Calculator logic: `utils/commissionCalculator-extended.ts`
3. Implementation guide: This file
