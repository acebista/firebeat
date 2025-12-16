/**
 * Extended Commission Calculator
 * Supports dual modes: SLAB (tiered) and LEVEL (bracket)
 * Operates on NET SALES (gross sales - returns)
 * 
 * File: utils/commissionCalculator-extended.ts
 * Status: Ready for implementation
 */

import {
  CommissionRate,
  CommissionBreakdown,
  CommissionMode,
  CommissionCalculationResult,
  LevelBand,
} from '@/types/hr-extended';

/**
 * Main entry point for commission calculation
 * Routes to appropriate calculator based on mode
 * 
 * @param netSales - Sales amount AFTER returns deducted
 * @param bands - Commission bands/slabs
 * @param mode - Calculation mode ('slab' or 'level')
 * @returns Detailed commission calculation result
 * 
 * @example
 * // Slab mode: 45k sales with bands [0-10k@5%, 10-50k@7%, 50k+@10%]
 * // Result: (10k * 5%) + (35k * 7%) = 2,950
 * const result = calculateCommission(45000, bands, 'slab');
 * 
 * @example
 * // Level mode: Same 45k sales falls in 10-50k band (7%)
 * // Result: 45k * 7% = 3,150 (entire amount at bracket rate)
 * const result = calculateCommission(45000, bands, 'level');
 */
export function calculateCommission(
  netSales: number,
  bands: CommissionRate[],
  mode: CommissionMode = 'slab'
): CommissionCalculationResult {
  // Validate input
  if (netSales < 0) {
    console.warn('Net sales is negative, defaulting to 0');
    netSales = 0;
  }

  if (!bands || bands.length === 0) {
    return {
      totalCommission: 0,
      breakdown: [],
      mode,
      salesBase: netSales,
    };
  }

  // Route to appropriate calculator
  if (mode === 'level') {
    return calculateCommissionLevel(netSales, bands);
  } else {
    return calculateCommissionSlab(netSales, bands);
  }
}

/**
 * SLAB MODE CALCULATION
 * Breaks sales into bands, each band portion gets its rate, sum all
 *
 * @internal
 */
function calculateCommissionSlab(
  netSales: number,
  bands: CommissionRate[]
): CommissionCalculationResult {
  const breakdown: CommissionBreakdown[] = [];
  let totalCommission = 0;

  // Sort bands by min_amount ascending
  const sortedBands = [...bands]
    .filter((b) => b.is_active)
    .sort((a, b) => a.min_amount - b.min_amount);

  if (sortedBands.length === 0) {
    return {
      totalCommission: 0,
      breakdown: [],
      mode: 'slab',
      salesBase: netSales,
    };
  }

  for (let i = 0; i < sortedBands.length; i++) {
    const band = sortedBands[i];

    // Determine the upper bound for this band
    const bandMax = band.max_amount === null ? Infinity : band.max_amount;
    const bandMin = band.min_amount;

    let salesInBand = 0;
    let commissionFromBand = 0;

    if (netSales > bandMin) {
      // Sales exceed the minimum for this band
      if (netSales < bandMax) {
        // All remaining sales fall in this band
        salesInBand = netSales - bandMin;
      } else {
        // Only the band range portion
        salesInBand = bandMax - bandMin;
      }

      // Calculate commission for this band
      commissionFromBand = (salesInBand * band.rate_pct) / 100;
      totalCommission += commissionFromBand;

      breakdown.push({
        slab_index: i,
        min_amount: bandMin,
        max_amount: bandMax === Infinity ? null : bandMax,
        rate_pct: band.rate_pct,
        sales_in_slab: salesInBand,
        commission_from_slab: commissionFromBand,
      });
    }

    // Stop if we've covered all sales
    if (netSales < bandMax) {
      break;
    }
  }

  return {
    totalCommission: parseFloat(totalCommission.toFixed(2)),
    breakdown,
    mode: 'slab',
    salesBase: netSales,
  };
}

/**
 * LEVEL MODE CALCULATION
 * Find the band containing total sales, apply that rate to entire amount
 *
 * @internal
 */
function calculateCommissionLevel(
  netSales: number,
  bands: CommissionRate[]
): CommissionCalculationResult {
  // Sort bands by min_amount
  const sortedBands = [...bands]
    .filter((b) => b.is_active)
    .sort((a, b) => a.min_amount - b.min_amount);

  if (sortedBands.length === 0) {
    return {
      totalCommission: 0,
      breakdown: [],
      mode: 'level',
      salesBase: netSales,
    };
  }

  let applicableBand: CommissionRate | null = null;

  // Find the band that covers this sales amount
  for (const band of sortedBands) {
    const bandMax = band.max_amount === null ? Infinity : band.max_amount;

    // Check if netSales falls within [min, max) range
    if (netSales >= band.min_amount && netSales < bandMax) {
      applicableBand = band;
      break;
    }
  }

  // If no band found (sales exceed all bands or below min), return 0
  if (!applicableBand) {
    return {
      totalCommission: 0,
      breakdown: [],
      mode: 'level',
      salesBase: netSales,
    };
  }

  // Apply the rate to the ENTIRE sales amount
  const commission = (netSales * applicableBand.rate_pct) / 100;

  return {
    totalCommission: parseFloat(commission.toFixed(2)),
    breakdown: [
      {
        slab_index: 0,
        min_amount: applicableBand.min_amount,
        max_amount: applicableBand.max_amount,
        rate_pct: applicableBand.rate_pct,
        sales_in_slab: netSales, // Entire amount at this rate
        commission_from_slab: commission,
      },
    ],
    mode: 'level',
    salesBase: netSales,
  };
}

/**
 * Calculate commission with both gross and return amounts
 * Automatically subtracts returns from gross to get net sales
 *
 * @param grossSales - Total sales before returns
 * @param returns - Amount deducted for returns
 * @param bands - Commission bands
 * @param mode - Calculation mode
 * @returns Commission calculation including net sales breakdown
 *
 * @example
 * const result = calculateCommissionWithReturns(50000, 5000, bands, 'slab');
 * // netSales = 45000
 * // Commission calculated on 45000, not 50000
 */
export function calculateCommissionWithReturns(
  grossSales: number,
  returns: number,
  bands: CommissionRate[],
  mode: CommissionMode = 'slab'
): CommissionCalculationResult & {
  grossSales: number;
  returns: number;
  netSales: number;
} {
  // Validate
  if (grossSales < 0) grossSales = 0;
  if (returns < 0) returns = 0;
  if (returns > grossSales) {
    console.warn(
      'Returns exceed gross sales; setting returns to gross sales amount'
    );
    returns = grossSales;
  }

  const netSales = grossSales - returns;
  const result = calculateCommission(netSales, bands, mode);

  return {
    ...result,
    grossSales,
    returns,
    netSales,
  };
}

/**
 * Validates slab bands for overlaps
 * Slabs should not overlap; contiguous is allowed (max1 == min2)
 *
 * @param bands - Bands to validate
 * @returns Array of error messages, empty if valid
 *
 * @example
 * const errors = validateSlabBands([
 *   { min: 0, max: 10000, rate: 5 },
 *   { min: 10000, max: 50000, rate: 7 },  // OK: contiguous
 *   { min: 9000, max: 15000, rate: 8 },   // ERROR: overlaps with first two
 * ]);
 * // Returns: ["Overlap detected: band 1 and band 3"]
 */
export function validateSlabBands(bands: CommissionRate[]): string[] {
  const errors: string[] = [];

  const activeBands = bands.filter((b) => b.is_active);

  if (activeBands.length === 0) {
    return errors; // No bands to validate
  }

  // Check each pair for overlaps
  for (let i = 0; i < activeBands.length; i++) {
    for (let j = i + 1; j < activeBands.length; j++) {
      const band1 = activeBands[i];
      const band2 = activeBands[j];

      if (bandsOverlap(band1, band2)) {
        errors.push(
          `Bands overlap: "${band1.name}" (${band1.min_amount}-${band1.max_amount || '∞'}) ` +
          `and "${band2.name}" (${band2.min_amount}-${band2.max_amount || '∞'})`
        );
      }
    }
  }

  return errors;
}

/**
 * Validates level bands for proper coverage and ordering
 * Level bands should:
 * - Start at 0
 * - Be contiguous (no gaps)
 * - Be ordered by min amount
 *
 * @param bands - Level bands to validate
 * @returns Array of error messages, empty if valid
 *
 * @example
 * const errors = validateLevelBands([
 *   { min: 0, max: 10000, rate: 5 },
 *   { min: 10000, max: 50000, rate: 7 },
 *   { min: 50000, max: null, rate: 10 },
 * ]);
 * // Returns: [] (valid - contiguous, no gaps, starts at 0)
 */
export function validateLevelBands(bands: CommissionRate[]): string[] {
  const errors: string[] = [];

  const activeBands = bands.filter((b) => b.is_active);

  if (activeBands.length === 0) {
    errors.push('At least one level band is required');
    return errors;
  }

  // Sort by min_amount
  const sorted = [...activeBands].sort((a, b) => a.min_amount - b.min_amount);

  // Check first band starts at 0
  if (sorted[0].min_amount !== 0) {
    errors.push(`First level band must start at 0, got ${sorted[0].min_amount}`);
  }

  // Check contiguity and ordering
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];

    // Current band should have a max
    if (current.max_amount === null) {
      errors.push(
        `Level band "${current.name}" has no max but is not the last band`
      );
    } else if (current.max_amount !== next.min_amount) {
      // Check contiguity
      errors.push(
        `Gap or overlap between bands ${i} and ${i + 1}: ` +
        `band ${i} ends at ${current.max_amount}, ` +
        `band ${i + 1} starts at ${next.min_amount}`
      );
    }
  }

  // Last band should have null max (unbounded)
  const lastBand = sorted[sorted.length - 1];
  if (lastBand.max_amount !== null) {
    console.warn(
      `Last level band "${lastBand.name}" should have no maximum (null). ` +
      `Consider updating to allow unlimited sales.`
    );
  }

  return errors;
}

/**
 * Check if two bands overlap
 *
 * @internal
 */
function bandsOverlap(band1: CommissionRate, band2: CommissionRate): boolean {
  const min1 = band1.min_amount;
  const max1 = band1.max_amount === null ? Infinity : band1.max_amount;
  const min2 = band2.min_amount;
  const max2 = band2.max_amount === null ? Infinity : band2.max_amount;

  // Overlaps if: max1 > min2 AND max2 > min1
  // Contiguous (max1 == min2) is allowed, so use > not >=
  return max1 > min2 && max2 > min1;
}

/**
 * Find which band would apply for a given sales amount in level mode
 * Useful for UI preview: "Your sales of 45k would fall in the 7% band"
 *
 * @param netSales - Sales amount
 * @param bands - Level bands (mode: 'level')
 * @returns The applicable band or null if none match
 */
export function findApplicableLevelBand(
  netSales: number,
  bands: CommissionRate[]
): CommissionRate | null {
  const sorted = [...bands]
    .filter((b) => b.is_active)
    .sort((a, b) => a.min_amount - b.min_amount);

  for (const band of sorted) {
    const bandMax = band.max_amount === null ? Infinity : band.max_amount;
    if (netSales >= band.min_amount && netSales < bandMax) {
      return band;
    }
  }

  return null;
}

/**
 * Validate a single band
 *
 * @param band - Band to validate
 * @returns Error message or null if valid
 */
export function validateBand(band: CommissionRate): string | null {
  // Check rate is 0-100
  if (band.rate_pct < 0 || band.rate_pct > 100) {
    return `Rate must be 0-100%, got ${band.rate_pct}%`;
  }

  // Check min_amount is non-negative
  if (band.min_amount < 0) {
    return 'Minimum amount cannot be negative';
  }

  // Check max >= min (if present)
  if (
    band.max_amount !== null &&
    band.max_amount !== undefined &&
    band.max_amount < band.min_amount
  ) {
    return `Maximum (${band.max_amount}) must be >= minimum (${band.min_amount})`;
  }

  return null;
}

/**
 * Validate a mode switch
 * Warn if switching between modes (bands are interpreted differently)
 *
 * @param oldMode - Previous mode
 * @param newMode - New mode
 * @param bandCount - Number of bands affected
 * @returns Warning message or null
 */
export function validateModeSwitch(
  oldMode: CommissionMode,
  newMode: CommissionMode,
  bandCount: number
): string | null {
  if (oldMode === newMode) {
    return null;
  }

  return (
    `Switching from ${oldMode} to ${newMode} mode. ` +
    `Your ${bandCount} existing band(s) will be reinterpreted using ${newMode} logic. ` +
    `Please review your bands.`
  );
}

/**
 * Preview what commission would be for different sample sales amounts
 * Useful for testing/education UI
 *
 * @param samples - Array of sample sales amounts to test
 * @param bands - Commission bands
 * @param mode - Calculation mode
 * @returns Array of preview results
 */
export function generateCommissionPreview(
  samples: number[],
  bands: CommissionRate[],
  mode: CommissionMode
): Array<{
  sales: number;
  commission: number;
  effectiveRate: number;
}> {
  return samples.map((sales) => {
    const result = calculateCommission(sales, bands, mode);
    const effectiveRate =
      sales > 0 ? (result.totalCommission / sales) * 100 : 0;

    return {
      sales,
      commission: result.totalCommission,
      effectiveRate: parseFloat(effectiveRate.toFixed(2)),
    };
  });
}

/**
 * Format commission breakdown for display
 *
 * @param breakdown - Breakdown details
 * @param mode - Calculation mode
 * @returns Human-readable summary
 */
export function formatCommissionBreakdown(
  breakdown: CommissionBreakdown[],
  mode: CommissionMode
): string {
  if (breakdown.length === 0) {
    return 'No commission (no applicable bands)';
  }

  if (mode === 'level') {
    const item = breakdown[0];
    return (
      `${item.rate_pct}% on ₹${item.sales_in_slab.toLocaleString()} = ₹${item.commission_from_slab.toLocaleString()}`
    );
  }

  // Slab mode
  const parts = breakdown.map((item) => {
    if (item.max_amount === null) {
      return `₹${item.sales_in_slab.toLocaleString()} @ ${item.rate_pct}% = ₹${item.commission_from_slab.toLocaleString()}`;
    }
    return `₹${item.sales_in_slab.toLocaleString()} @ ${item.rate_pct}% = ₹${item.commission_from_slab.toLocaleString()}`;
  });

  return parts.join(' + ');
}

// ============================================================================
// EXPORTS FOR BACKWARD COMPATIBILITY
// ============================================================================

/**
 * Legacy export: Original calculateCommission function
 * Now routes to extended version
 */
export const calculateCommissionLegacy = calculateCommission;
