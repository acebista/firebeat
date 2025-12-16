/**
 * Commission Calculator Tests
 * Jest tests for calculateCommission with multiple scenarios
 */

import {
  calculateCommission,
  validateSlabsNoOverlap,
  validateSlab,
  formatCurrency,
  parseCurrency,
} from '@/utils/commissionCalculator';
import { CommissionRate } from '@/types/hr';

describe('calculateCommission', () => {
  describe('single slab', () => {
    it('should calculate commission for single slab', () => {
      const slabs: CommissionRate[] = [
        {
          id: 'cr_1',
          company_id: null,
          company_name: null,
          name: 'Standard',
          min_amount: 0,
          max_amount: null,
          rate_pct: 5,
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ];

      const result = calculateCommission(10000, slabs);
      expect(result.totalCommission).toBe(500);
      expect(result.breakdown.length).toBe(1);
      expect(result.breakdown[0].sales_in_slab).toBe(10000);
    });

    it('should return 0 commission for empty slabs', () => {
      const result = calculateCommission(10000, []);
      expect(result.totalCommission).toBe(0);
      expect(result.breakdown.length).toBe(0);
    });

    it('should skip inactive slabs', () => {
      const slabs: CommissionRate[] = [
        {
          id: 'cr_1',
          company_id: null,
          company_name: null,
          name: 'Inactive',
          min_amount: 0,
          max_amount: null,
          rate_pct: 5,
          is_active: false,
          created_at: new Date().toISOString(),
        },
      ];

      const result = calculateCommission(10000, slabs);
      expect(result.totalCommission).toBe(0);
    });
  });

  describe('tiered slabs', () => {
    const tieredSlabs: CommissionRate[] = [
      {
        id: 'cr_1',
        company_id: null,
        company_name: null,
        name: 'Tier 1',
        min_amount: 0,
        max_amount: 50000,
        rate_pct: 2,
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 'cr_2',
        company_id: null,
        company_name: null,
        name: 'Tier 2',
        min_amount: 50000,
        max_amount: 100000,
        rate_pct: 3,
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 'cr_3',
        company_id: null,
        company_name: null,
        name: 'Tier 3',
        min_amount: 100000,
        max_amount: null,
        rate_pct: 5,
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ];

    it('should calculate tiered commission for sales in multiple slabs', () => {
      // 75000 = 50000 (tier1) + 25000 (tier2)
      // Tier1: 50000 * 2% = 1000
      // Tier2: 25000 * 3% = 750
      // Total = 1750
      const result = calculateCommission(75000, tieredSlabs);
      expect(result.totalCommission).toBe(1750);
      expect(result.breakdown.length).toBe(2);
    });

    it('should calculate commission spanning all tiers', () => {
      // 150000 = 50000 (tier1) + 50000 (tier2) + 50000 (tier3)
      // Tier1: 50000 * 2% = 1000
      // Tier2: 50000 * 3% = 1500
      // Tier3: 50000 * 5% = 2500
      // Total = 5000
      const result = calculateCommission(150000, tieredSlabs);
      expect(result.totalCommission).toBe(5000);
      expect(result.breakdown.length).toBe(3);
    });

    it('should handle sales below minimum slab', () => {
      const result = calculateCommission(0, tieredSlabs);
      expect(result.totalCommission).toBe(0);
    });

    it('should handle very high sales with no max cap', () => {
      // 500000 = 50000 (tier1) + 50000 (tier2) + 400000 (tier3)
      // = 1000 + 1500 + 20000 = 22500
      const result = calculateCommission(500000, tieredSlabs);
      expect(result.totalCommission).toBe(22500);
    });
  });

  describe('edge cases', () => {
    it('should handle sales exactly at slab boundary', () => {
      const slabs: CommissionRate[] = [
        {
          id: 'cr_1',
          company_id: null,
          company_name: null,
          name: 'Tier 1',
          min_amount: 0,
          max_amount: 50000,
          rate_pct: 2,
          is_active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 'cr_2',
          company_id: null,
          company_name: null,
          name: 'Tier 2',
          min_amount: 50000,
          max_amount: null,
          rate_pct: 3,
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ];

      const result = calculateCommission(50000, slabs);
      expect(result.breakdown.length).toBe(1);
      expect(result.breakdown[0].rate_pct).toBe(2);
    });

    it('should round commission to 2 decimal places', () => {
      const slabs: CommissionRate[] = [
        {
          id: 'cr_1',
          company_id: null,
          company_name: null,
          name: 'Odd Rate',
          min_amount: 0,
          max_amount: null,
          rate_pct: 3.333,
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ];

      const result = calculateCommission(10000, slabs);
      // 10000 * 3.333% = 333.3
      expect(result.totalCommission).toBe(333.3);
    });
  });
});

describe('validateSlabsNoOverlap', () => {
  it('should detect overlapping slabs', () => {
    const slabs: CommissionRate[] = [
      {
        id: 'cr_1',
        company_id: null,
        company_name: null,
        name: 'Slab 1',
        min_amount: 0,
        max_amount: 100000,
        rate_pct: 2,
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 'cr_2',
        company_id: null,
        company_name: null,
        name: 'Slab 2',
        min_amount: 50000,
        max_amount: 150000,
        rate_pct: 3,
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ];

    const errors = validateSlabsNoOverlap(slabs);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain('overlap');
  });

  it('should allow non-overlapping slabs', () => {
    const slabs: CommissionRate[] = [
      {
        id: 'cr_1',
        company_id: null,
        company_name: null,
        name: 'Slab 1',
        min_amount: 0,
        max_amount: 50000,
        rate_pct: 2,
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 'cr_2',
        company_id: null,
        company_name: null,
        name: 'Slab 2',
        min_amount: 50000,
        max_amount: 100000,
        rate_pct: 3,
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ];

    const errors = validateSlabsNoOverlap(slabs);
    expect(errors.length).toBe(0);
  });
});

describe('validateSlab', () => {
  it('should validate valid slab', () => {
    const slab: CommissionRate = {
      id: 'cr_1',
      company_id: null,
      company_name: null,
      name: 'Valid',
      min_amount: 0,
      max_amount: 100000,
      rate_pct: 5,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    expect(validateSlab(slab)).toBeNull();
  });

  it('should reject invalid rate', () => {
    const slab: CommissionRate = {
      id: 'cr_1',
      company_id: null,
      company_name: null,
      name: 'Invalid',
      min_amount: 0,
      max_amount: 100000,
      rate_pct: 150,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    expect(validateSlab(slab)).toContain('between 0 and 100');
  });

  it('should reject negative min_amount', () => {
    const slab: CommissionRate = {
      id: 'cr_1',
      company_id: null,
      company_name: null,
      name: 'Invalid',
      min_amount: -100,
      max_amount: 100000,
      rate_pct: 5,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    expect(validateSlab(slab)).toContain('negative');
  });

  it('should reject max < min', () => {
    const slab: CommissionRate = {
      id: 'cr_1',
      company_id: null,
      company_name: null,
      name: 'Invalid',
      min_amount: 100000,
      max_amount: 50000,
      rate_pct: 5,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    expect(validateSlab(slab)).toContain('>= minimum');
  });
});

describe('formatCurrency', () => {
  it('should format currency with ₹ symbol', () => {
    expect(formatCurrency(1234.56)).toBe('₹1,234.56');
  });

  it('should handle large numbers', () => {
    expect(formatCurrency(1000000)).toBe('₹10,00,000.00');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('₹0.00');
  });

  it('should handle null/undefined', () => {
    expect(formatCurrency(null as any)).toBe('₹0.00');
  });
});

describe('parseCurrency', () => {
  it('should parse formatted currency', () => {
    expect(parseCurrency('₹1,234.56')).toBe(1234.56);
  });

  it('should handle missing ₹ symbol', () => {
    expect(parseCurrency('1,234.56')).toBe(1234.56);
  });

  it('should handle zero', () => {
    expect(parseCurrency('₹0.00')).toBe(0);
  });
});
