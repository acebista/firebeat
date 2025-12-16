/**
 * Extended Commission Calculator Tests
 * Comprehensive testing for slab and level modes with net sales
 * 
 * File: __tests__/commissionCalculator-extended.test.ts
 * Status: Ready for execution
 */

import {
  calculateCommission,
  calculateCommissionWithReturns,
  validateSlabBands,
  validateLevelBands,
  findApplicableLevelBand,
  validateBand,
  validateModeSwitch,
  generateCommissionPreview,
  formatCommissionBreakdown,
} from '@/utils/commissionCalculator-extended';
import { CommissionRate, CommissionMode } from '@/types/hr-extended';

// ============================================================================
// TEST DATA
// ============================================================================

const slabBands: CommissionRate[] = [
  {
    id: '1',
    company_id: null,
    name: '0-10k',
    min_amount: 0,
    max_amount: 10000,
    rate_pct: 5,
    is_active: true,
    mode: 'slab',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    company_id: null,
    name: '10-50k',
    min_amount: 10000,
    max_amount: 50000,
    rate_pct: 7,
    is_active: true,
    mode: 'slab',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    company_id: null,
    name: '50k+',
    min_amount: 50000,
    max_amount: null,
    rate_pct: 10,
    is_active: true,
    mode: 'slab',
    created_at: new Date().toISOString(),
  },
];

const levelBands: CommissionRate[] = [
  {
    id: '1',
    company_id: null,
    name: 'Level 1',
    min_amount: 0,
    max_amount: 10000,
    rate_pct: 5,
    is_active: true,
    mode: 'level',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    company_id: null,
    name: 'Level 2',
    min_amount: 10000,
    max_amount: 50000,
    rate_pct: 7,
    is_active: true,
    mode: 'level',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    company_id: null,
    name: 'Level 3',
    min_amount: 50000,
    max_amount: null,
    rate_pct: 10,
    is_active: true,
    mode: 'level',
    created_at: new Date().toISOString(),
  },
];

// ============================================================================
// SLAB MODE TESTS
// ============================================================================

describe('Commission Calculator - Slab Mode', () => {
  test('Should calculate commission for sales in first band', () => {
    const result = calculateCommission(5000, slabBands, 'slab');
    
    expect(result.totalCommission).toBe(250); // 5000 * 5% = 250
    expect(result.breakdown.length).toBe(1);
    expect(result.breakdown[0].sales_in_slab).toBe(5000);
    expect(result.breakdown[0].rate_pct).toBe(5);
    expect(result.mode).toBe('slab');
  });

  test('Should calculate commission across multiple bands', () => {
    // Sales: 45,000
    // Breakdown:
    // - 0-10k: 10,000 * 5% = 500
    // - 10-50k: 35,000 * 7% = 2,450
    // Total: 2,950
    const result = calculateCommission(45000, slabBands, 'slab');
    
    expect(result.totalCommission).toBe(2950);
    expect(result.breakdown.length).toBe(2);
    expect(result.breakdown[0].sales_in_slab).toBe(10000);
    expect(result.breakdown[1].sales_in_slab).toBe(35000);
  });

  test('Should calculate commission across all three bands', () => {
    // Sales: 100,000
    // Breakdown:
    // - 0-10k: 10,000 * 5% = 500
    // - 10-50k: 40,000 * 7% = 2,800
    // - 50k+: 50,000 * 10% = 5,000
    // Total: 8,300
    const result = calculateCommission(100000, slabBands, 'slab');
    
    expect(result.totalCommission).toBe(8300);
    expect(result.breakdown.length).toBe(3);
    expect(result.breakdown[0].commission_from_slab).toBe(500);
    expect(result.breakdown[1].commission_from_slab).toBe(2800);
    expect(result.breakdown[2].commission_from_slab).toBe(5000);
  });

  test('Should handle zero sales', () => {
    const result = calculateCommission(0, slabBands, 'slab');
    
    expect(result.totalCommission).toBe(0);
    expect(result.breakdown.length).toBe(0);
  });

  test('Should handle negative sales as zero', () => {
    const result = calculateCommission(-1000, slabBands, 'slab');
    
    expect(result.totalCommission).toBe(0);
    expect(result.breakdown.length).toBe(0);
  });

  test('Should skip inactive bands', () => {
    const inactiveBands = [
      ...slabBands.slice(0, 1),
      { ...slabBands[1], is_active: false },
      slabBands[2],
    ];

    const result = calculateCommission(45000, inactiveBands, 'slab');
    
    // Should skip the inactive band
    expect(result.breakdown.length).toBe(2);
  });

  test('Should handle empty band array', () => {
    const result = calculateCommission(45000, [], 'slab');
    
    expect(result.totalCommission).toBe(0);
    expect(result.breakdown.length).toBe(0);
  });

  test('Should round to 2 decimal places', () => {
    const result = calculateCommission(12345, slabBands, 'slab');
    
    // 10,000 * 5% + 2,345 * 7% = 500 + 164.15 = 664.15
    expect(result.totalCommission).toBe(664.15);
  });
});

// ============================================================================
// LEVEL MODE TESTS
// ============================================================================

describe('Commission Calculator - Level Mode', () => {
  test('Should apply first level band rate to entire sales', () => {
    // Sales: 5,000 falls in 0-10k band (5%)
    // Commission: 5,000 * 5% = 250
    const result = calculateCommission(5000, levelBands, 'level');
    
    expect(result.totalCommission).toBe(250);
    expect(result.breakdown.length).toBe(1);
    expect(result.breakdown[0].sales_in_slab).toBe(5000); // Entire amount
    expect(result.breakdown[0].rate_pct).toBe(5);
  });

  test('Should apply second level band rate to entire sales', () => {
    // Sales: 45,000 falls in 10-50k band (7%)
    // Commission: 45,000 * 7% = 3,150
    const result = calculateCommission(45000, levelBands, 'level');
    
    expect(result.totalCommission).toBe(3150);
    expect(result.breakdown.length).toBe(1);
    expect(result.breakdown[0].sales_in_slab).toBe(45000); // Entire amount
    expect(result.breakdown[0].rate_pct).toBe(7);
  });

  test('Should apply third level band rate to entire sales', () => {
    // Sales: 100,000 falls in 50k+ band (10%)
    // Commission: 100,000 * 10% = 10,000
    const result = calculateCommission(100000, levelBands, 'level');
    
    expect(result.totalCommission).toBe(10000);
    expect(result.breakdown.length).toBe(1);
    expect(result.breakdown[0].rate_pct).toBe(10);
  });

  test('Should handle edge case: sales exactly at band boundary', () => {
    // Sales: exactly 10,000 should fall in second band (10-50k)
    const result = calculateCommission(10000, levelBands, 'level');
    
    expect(result.totalCommission).toBe(700); // 10,000 * 7%
    expect(result.breakdown[0].rate_pct).toBe(7);
  });

  test('Should handle edge case: sales exactly at upper boundary', () => {
    // Sales: exactly 50,000 should fall in third band (50k+)
    const result = calculateCommission(50000, levelBands, 'level');
    
    expect(result.totalCommission).toBe(5000); // 50,000 * 10%
    expect(result.breakdown[0].rate_pct).toBe(10);
  });

  test('Should return 0 for sales below minimum', () => {
    const result = calculateCommission(0, levelBands, 'level');
    
    expect(result.totalCommission).toBe(0);
    expect(result.breakdown.length).toBe(0);
  });

  test('Should skip inactive bands', () => {
    const inactiveBands = [
      { ...levelBands[0], is_active: false },
      levelBands[1],
      levelBands[2],
    ];

    const result = calculateCommission(45000, inactiveBands, 'level');
    
    // Should find band 2 (10-50k) even though band 1 is inactive
    expect(result.totalCommission).toBe(3150);
  });
});

// ============================================================================
// SLAB VS LEVEL COMPARISON
// ============================================================================

describe('Slab vs Level Mode Comparison', () => {
  test('Should show difference between slab and level at 45k', () => {
    const slabResult = calculateCommission(45000, slabBands, 'slab');
    const levelResult = calculateCommission(45000, levelBands, 'level');
    
    // Slab: (10k * 5%) + (35k * 7%) = 2,950
    // Level: 45k * 7% = 3,150
    expect(slabResult.totalCommission).toBe(2950);
    expect(levelResult.totalCommission).toBe(3150);
    expect(levelResult.totalCommission).toBeGreaterThan(slabResult.totalCommission);
  });

  test('Effective rates differ between modes', () => {
    const sales = 45000;
    const slabResult = calculateCommission(sales, slabBands, 'slab');
    const levelResult = calculateCommission(sales, levelBands, 'level');
    
    const slabEffectiveRate = (slabResult.totalCommission / sales) * 100;
    const levelEffectiveRate = (levelResult.totalCommission / sales) * 100;
    
    expect(slabEffectiveRate).toBeCloseTo(6.56, 1);
    expect(levelEffectiveRate).toBeCloseTo(7, 1);
  });
});

// ============================================================================
// NET SALES TESTS (WITH RETURNS)
// ============================================================================

describe('Commission with Returns (Net Sales)', () => {
  test('Should calculate commission on net sales after returns', () => {
    // Gross: 50,000 | Returns: 5,000 | Net: 45,000
    const result = calculateCommissionWithReturns(
      50000,
      5000,
      slabBands,
      'slab'
    );
    
    expect(result.grossSales).toBe(50000);
    expect(result.returns).toBe(5000);
    expect(result.netSales).toBe(45000);
    expect(result.totalCommission).toBe(2950); // Commission on 45k, not 50k
  });

  test('Should handle returns exceeding gross', () => {
    // Gross: 50,000 | Returns: 60,000 (exceeds gross)
    // Should cap returns at gross amount
    const result = calculateCommissionWithReturns(
      50000,
      60000,
      slabBands,
      'slab'
    );
    
    expect(result.netSales).toBe(0);
    expect(result.totalCommission).toBe(0);
  });

  test('Should handle zero returns', () => {
    const result = calculateCommissionWithReturns(50000, 0, slabBands, 'slab');
    
    expect(result.netSales).toBe(50000);
    // Commission: (10k * 5%) + (40k * 7%) = 500 + 2800 = 3300
    expect(result.totalCommission).toBe(3300);
  });

  test('Should handle negative returns (convert to 0)', () => {
    const result = calculateCommissionWithReturns(
      50000,
      -1000,
      slabBands,
      'slab'
    );
    
    expect(result.returns).toBe(0);
    expect(result.netSales).toBe(50000);
  });

  test('Level mode with returns', () => {
    // Gross: 100,000 | Returns: 20,000 | Net: 80,000
    // 80,000 falls in 50-100k band (10%)
    const result = calculateCommissionWithReturns(
      100000,
      20000,
      levelBands,
      'level'
    );
    
    expect(result.netSales).toBe(80000);
    expect(result.totalCommission).toBe(8000); // 80,000 * 10%
  });
});

// ============================================================================
// VALIDATION TESTS
// ============================================================================

describe('Slab Band Validation', () => {
  test('Should validate non-overlapping bands', () => {
    const errors = validateSlabBands(slabBands);
    expect(errors.length).toBe(0);
  });

  test('Should detect overlapping bands', () => {
    const overlappingBands = [
      slabBands[0],
      slabBands[1],
      {
        ...slabBands[2],
        min_amount: 40000, // Overlaps with band 2
      },
    ];

    const errors = validateSlabBands(overlappingBands);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('overlap');
  });

  test('Should allow contiguous bands', () => {
    const contiguousBands = [
      { ...slabBands[0], max_amount: 10000 },
      { ...slabBands[1], min_amount: 10000, max_amount: 50000 },
      { ...slabBands[2], min_amount: 50000 },
    ];

    const errors = validateSlabBands(contiguousBands);
    expect(errors.length).toBe(0);
  });
});

describe('Level Band Validation', () => {
  test('Should validate proper level bands', () => {
    const errors = validateLevelBands(levelBands);
    expect(errors.length).toBe(0);
  });

  test('Should require starting at 0', () => {
    const invalidBands = [
      { ...levelBands[0], min_amount: 1000 }, // Doesn't start at 0
      levelBands[1],
      levelBands[2],
    ];

    const errors = validateLevelBands(invalidBands);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('start at 0');
  });

  test('Should detect gaps between bands', () => {
    const gappyBands = [
      levelBands[0],
      { ...levelBands[1], min_amount: 15000 }, // Gap between 10k and 15k
      levelBands[2],
    ];

    const errors = validateLevelBands(gappyBands);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('Gap');
  });

  test('Should require at least one band', () => {
    const errors = validateLevelBands([]);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('required');
  });
});

describe('Individual Band Validation', () => {
  test('Should validate band with proper values', () => {
    const band: CommissionRate = {
      id: '1',
      company_id: null,
      name: 'Test',
      min_amount: 0,
      max_amount: 10000,
      rate_pct: 5,
      is_active: true,
      mode: 'slab',
      created_at: new Date().toISOString(),
    };

    const error = validateBand(band);
    expect(error).toBeNull();
  });

  test('Should reject rate > 100%', () => {
    const band: CommissionRate = {
      ...slabBands[0],
      rate_pct: 150,
    };

    const error = validateBand(band);
    expect(error).toContain('0-100%');
  });

  test('Should reject negative min amount', () => {
    const band: CommissionRate = {
      ...slabBands[0],
      min_amount: -1000,
    };

    const error = validateBand(band);
    expect(error).toContain('negative');
  });

  test('Should reject max < min', () => {
    const band: CommissionRate = {
      ...slabBands[0],
      min_amount: 10000,
      max_amount: 5000,
    };

    const error = validateBand(band);
    expect(error).toContain('>=');
  });
});

// ============================================================================
// HELPER FUNCTION TESTS
// ============================================================================

describe('findApplicableLevelBand', () => {
  test('Should find correct band for sales amount', () => {
    const band = findApplicableLevelBand(45000, levelBands);
    
    expect(band).not.toBeNull();
    expect(band!.rate_pct).toBe(7);
  });

  test('Should return null for sales outside bands', () => {
    const band = findApplicableLevelBand(-5000, levelBands);
    
    expect(band).toBeNull();
  });

  test('Should handle first band', () => {
    const band = findApplicableLevelBand(5000, levelBands);
    
    expect(band).not.toBeNull();
    expect(band!.rate_pct).toBe(5);
  });

  test('Should handle last band (unbounded)', () => {
    const band = findApplicableLevelBand(500000, levelBands);
    
    expect(band).not.toBeNull();
    expect(band!.rate_pct).toBe(10);
  });
});

describe('validateModeSwitch', () => {
  test('Should not warn for same mode', () => {
    const warning = validateModeSwitch('slab', 'slab', 3);
    expect(warning).toBeNull();
  });

  test('Should warn for different modes', () => {
    const warning = validateModeSwitch('slab', 'level', 3);
    
    expect(warning).not.toBeNull();
    expect(warning).toContain('Switching');
    expect(warning).toContain('reinterpreted');
  });
});

describe('generateCommissionPreview', () => {
  test('Should generate preview for sample amounts', () => {
    const samples = [10000, 50000, 100000];
    const preview = generateCommissionPreview(samples, slabBands, 'slab');
    
    expect(preview.length).toBe(3);
    expect(preview[0].sales).toBe(10000);
    expect(preview[1].sales).toBe(50000);
    expect(preview[2].sales).toBe(100000);
  });

  test('Preview should include effective rate', () => {
    const preview = generateCommissionPreview([45000], slabBands, 'slab');
    
    expect(preview[0].commission).toBe(2950);
    expect(preview[0].effectiveRate).toBeCloseTo(6.56, 1);
  });

  test('Preview with zero sales should have 0% effective rate', () => {
    const preview = generateCommissionPreview([0], slabBands, 'slab');
    
    expect(preview[0].effectiveRate).toBe(0);
  });
});

describe('formatCommissionBreakdown', () => {
  test('Should format slab breakdown', () => {
    const result = calculateCommission(45000, slabBands, 'slab');
    const formatted = formatCommissionBreakdown(result.breakdown, 'slab');
    
    expect(formatted).toContain('₹');
    expect(formatted).toContain('%');
    expect(formatted).toContain('+');
  });

  test('Should format level breakdown', () => {
    const result = calculateCommission(45000, levelBands, 'level');
    const formatted = formatCommissionBreakdown(result.breakdown, 'level');
    
    expect(formatted).toContain('₹');
    expect(formatted).toContain('%');
  });

  test('Should handle empty breakdown', () => {
    const formatted = formatCommissionBreakdown([], 'slab');
    
    expect(formatted).toContain('No commission');
  });
});

// ============================================================================
// EDGE CASES & SPECIAL SCENARIOS
// ============================================================================

describe('Edge Cases', () => {
  test('Should handle very large sales amounts', () => {
    const largeSales = 1000000000; // 1 billion
    const result = calculateCommission(largeSales, slabBands, 'slab');
    
    expect(result.totalCommission).toBeGreaterThan(0);
    expect(result.totalCommission).toBeLessThan(largeSales);
  });

  test('Should handle very small sales amounts', () => {
    const smallSales = 0.01;
    const result = calculateCommission(smallSales, slabBands, 'slab');
    
    expect(result.totalCommission).toBeGreaterThanOrEqual(0);
  });

  test('Should maintain precision with decimal values', () => {
    const sales = 12345.67;
    const result = calculateCommission(sales, slabBands, 'slab');
    
    // 10,000 * 5% + 2,345.67 * 7% = 500 + 164.1969 = 664.1969 ≈ 664.20
    expect(result.totalCommission).toBeCloseTo(664.20, 2);
  });

  test('Should handle single band configuration', () => {
    const singleBand = [
      {
        ...slabBands[0],
        max_amount: null, // Open-ended
      },
    ];

    const result = calculateCommission(50000, singleBand, 'slab');
    
    expect(result.totalCommission).toBe(2500); // 50,000 * 5%
  });
});

// ============================================================================
// REAL-WORLD SCENARIOS
// ============================================================================

describe('Real-World Scenarios', () => {
  test('Scenario 1: Monthly sales with returns - Slab Mode', () => {
    // Salesman sold products worth 75,000
    // Customer returned goods worth 8,500
    // Net sales: 66,500
    
    const result = calculateCommissionWithReturns(75000, 8500, slabBands, 'slab');
    
    // 10k * 5% + 50k * 7% + 6.5k * 10%
    // = 500 + 3500 + 650 = 4650
    expect(result.totalCommission).toBe(4650);
  });

  test('Scenario 2: Multiple salesmen bulk calculation', () => {
    const salesmen = [
      { sales: 25000, returns: 2000 }, // 23k net
      { sales: 60000, returns: 5000 }, // 55k net
      { sales: 15000, returns: 1000 }, // 14k net
    ];

    const totalCommission = salesmen
      .map((s) =>
        calculateCommissionWithReturns(s.sales, s.returns, slabBands, 'slab')
          .totalCommission
      )
      .reduce((a, b) => a + b, 0);

    expect(totalCommission).toBeGreaterThan(0);
  });

  test('Scenario 3: Comparing compensation plans', () => {
    const salesAmount = 75000;
    const returns = 8500;

    const slabComp = calculateCommissionWithReturns(
      salesAmount,
      returns,
      slabBands,
      'slab'
    );

    const levelComp = calculateCommissionWithReturns(
      salesAmount,
      returns,
      levelBands,
      'level'
    );

    console.log('Slab: ', slabComp.totalCommission);
    console.log('Level:', levelComp.totalCommission);

    expect(levelComp.totalCommission).toBeGreaterThan(slabComp.totalCommission);
  });
});
