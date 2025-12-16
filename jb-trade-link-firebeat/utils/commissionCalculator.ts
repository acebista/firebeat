/**
 * Commission Calculation Utilities
 * Handles tiered commission calculations and slab validations
 */

import { CommissionRate, CommissionBreakdown, SlabOverlapError } from '@/types/hr';

/**
 * Calculates commission based on sales amount and applicable slabs
 * Supports tiered/slab-based commission calculation
 * 
 * @param salesAmount - Total sales amount
 * @param slabs - Array of commission rate slabs sorted by min_amount
 * @returns Commission amount and breakdown details
 */
export function calculateCommission(
  salesAmount: number,
  slabs: CommissionRate[]
): {
  totalCommission: number;
  breakdown: CommissionBreakdown[];
} {
  if (!slabs || slabs.length === 0) {
    return { totalCommission: 0, breakdown: [] };
  }

  const breakdown: CommissionBreakdown[] = [];
  let totalCommission = 0;

  // Sort slabs by min_amount to ensure correct order
  const sortedSlabs = [...slabs].sort((a, b) => a.min_amount - b.min_amount);

  for (let i = 0; i < sortedSlabs.length; i++) {
    const slab = sortedSlabs[i];

    // Skip inactive slabs
    if (!slab.is_active) continue;

    // Determine the upper bound for this slab
    const slabMax = slab.max_amount === null ? Infinity : slab.max_amount;

    // Calculate how much sales falls in this slab
    const slabMin = slab.min_amount;
    let salesInSlab = 0;

    if (salesAmount >= slabMin) {
      // Sales exceed the minimum for this slab
      if (salesAmount <= slabMax) {
        // All remaining sales fall in this slab
        salesInSlab = salesAmount - slabMin;
      } else {
        // Only the slab range portion
        salesInSlab = slabMax - slabMin;
      }

      // Calculate commission for this slab
      const commissionFromSlab = (salesInSlab * slab.rate_pct) / 100;
      totalCommission += commissionFromSlab;

      breakdown.push({
        slab_index: i,
        min_amount: slabMin,
        max_amount: slabMax === Infinity ? null : slabMax,
        rate_pct: slab.rate_pct,
        sales_in_slab: salesInSlab,
        commission_from_slab: commissionFromSlab,
      });
    }

    // Stop if we've covered all sales
    if (salesAmount <= slabMax) break;
  }

  return {
    totalCommission: parseFloat(totalCommission.toFixed(2)),
    breakdown,
  };
}

/**
 * Validates that slabs don't overlap
 * Returns any overlapping pairs found
 * 
 * @param slabs - Array of commission rate slabs
 * @returns Array of overlap errors, empty if no overlaps
 */
export function validateSlabsNoOverlap(slabs: CommissionRate[]): SlabOverlapError[] {
  const errors: SlabOverlapError[] = [];

  for (let i = 0; i < slabs.length; i++) {
    for (let j = i + 1; j < slabs.length; j++) {
      const slab1 = slabs[i];
      const slab2 = slabs[j];

      // Check if slabs overlap
      if (slabsOverlap(slab1, slab2)) {
        errors.push({
          message: `Slabs overlap: "${slab1.name}" (${slab1.min_amount}-${slab1.max_amount || '∞'}) and "${slab2.name}" (${slab2.min_amount}-${slab2.max_amount || '∞'})`,
          slab1,
          slab2,
        });
      }
    }
  }

  return errors;
}

/**
 * Checks if two slabs overlap
 * @param slab1 - First slab
 * @param slab2 - Second slab
 * @returns true if slabs overlap
 */
function slabsOverlap(slab1: CommissionRate, slab2: CommissionRate): boolean {
  const min1 = slab1.min_amount;
  const max1 = slab1.max_amount === null ? Infinity : slab1.max_amount;
  const min2 = slab2.min_amount;
  const max2 = slab2.max_amount === null ? Infinity : slab2.max_amount;

  // Slabs overlap if they share any common values
  // Contiguous slabs (e.g., max1 == min2) are allowed
  // True overlap is when one slab's range intersects with another's
  return max1 > min2 && max2 > min1;
}

/**
 * Validates a single slab
 * @param slab - Slab to validate
 * @returns error message if invalid, null if valid
 */
export function validateSlab(slab: CommissionRate): string | null {
  // Check rate is between 0 and 100
  if (slab.rate_pct < 0 || slab.rate_pct > 100) {
    return `Rate must be between 0 and 100, got ${slab.rate_pct}`;
  }

  // Check min_amount is not negative
  if (slab.min_amount < 0) {
    return `Minimum amount cannot be negative`;
  }

  // Check max_amount >= min_amount (if present)
  if (
    slab.max_amount !== null &&
    slab.max_amount !== undefined &&
    slab.max_amount < slab.min_amount
  ) {
    return `Maximum amount must be >= minimum amount`;
  }

  return null;
}

/**
 * Formats currency in Indian Rupees
 * @param amount - Amount in numeric form
 * @returns Formatted string with ₹ symbol
 */
export function formatCurrency(amount: number): string {
  return `₹${(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Parses currency string to number
 * @param currency - Currency string (e.g., "₹1,234.56")
 * @returns Numeric value
 */
export function parseCurrency(currency: string): number {
  const cleaned = currency
    .replace(/[₹,]/g, '') // Remove ₹ and commas
    .trim();
  return parseFloat(cleaned) || 0;
}
