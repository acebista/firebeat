/**
 * Extended HR & Compensation Types
 * Supports dual commission modes (slab/level) and net sales calculation
 * 
 * File: types/hr-extended.ts
 * Status: Draft for implementation
 */

// ============================================================================
// COMMISSION MODES
// ============================================================================

export type CommissionMode = 'slab' | 'level';

/**
 * SLAB MODE: Tiered/Progressive Commission
 * Sales are divided into bands, each band's portion gets its rate
 * 
 * Example:
 * Bands:     0-10k @ 5%, 10-50k @ 7%, 50k+ @ 10%
 * Sales:     45,000
 * Calc:      (10k × 5%) + (35k × 7%) = 500 + 2,450 = 2,950
 * 
 * Benefits:
 * - Progressive incentive (higher sales = higher rate)
 * - Rewards growth incrementally
 * - More complex but motivational
 */

/**
 * LEVEL MODE: Bracket-Based Commission
 * Find which band contains the total sales, apply that rate to entire amount
 * 
 * Example:
 * Bands:     0-10k @ 5%, 10-50k @ 7%, 50k+ @ 10%
 * Sales:     45,000 (in 10-50k band)
 * Calc:      45k × 7% = 3,150
 * 
 * Benefits:
 * - Simpler calculation
 * - Easier to understand
 * - Less volatile
 */

// ============================================================================
// EXTENDED COMMISSION RATE TYPE
// ============================================================================

export interface CommissionRate {
  id: string;
  company_id: string | null;
  company_name?: string | null;
  name: string;                           // Band/level name
  min_amount: number;                     // Minimum sales for this band
  max_amount: number | null;              // Maximum (null = unlimited)
  rate_pct: number;                       // Commission percentage
  is_active: boolean;

  // NEW FIELDS
  mode: CommissionMode;                   // 'slab' or 'level'
  set_name?: string | null;               // Optional grouping (multiple sets per company)
  apply_to?: 'company' | 'product' | 'custom';  // Scope (default: 'company')

  // Timestamps
  created_at: string;
  updated_at?: string;
}

// ============================================================================
// COMMISSION RATE SET (GROUPED CONFIGURATION)
// ============================================================================

export interface CommissionRateSet {
  id: string;                             // Unique ID
  company_id: string | null;              // Company this applies to
  set_name: string;                       // Descriptive name
  mode: CommissionMode;                   // 'slab' or 'level'
  description?: string;                   // What this set is for
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  bandCount?: number;                     // Number of bands in set
}

// ============================================================================
// LEVEL BAND TYPE (For UI/UX)
// ============================================================================

export interface LevelBand {
  band_index: number;
  min_sales: number;
  max_sales: number;
  rate_pct: number;
  label?: string;                         // Optional label
}

// ============================================================================
// NET SALES BREAKDOWN
// ============================================================================

export interface NetSalesBreakdown {
  grossSales: number;                     // Total before returns
  returns: number;                        // Deducted returns
  netSales: number;                       // Calculated: gross - returns
  orderCount: number;
  returnCount: number;
}

// ============================================================================
// SALES RETURN RECORD (If using separate returns table)
// ============================================================================

export interface SalesReturn {
  id: string;
  order_id: string;
  salesperson_id: string;
  company_id: string;
  return_amount: number;
  return_date: string;
  reason?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// ============================================================================
// COMMISSION BREAKDOWN (DETAILED CALCULATION)
// ============================================================================

export interface CommissionBreakdown {
  slab_index: number;
  min_amount: number;
  max_amount: number | null;
  rate_pct: number;
  sales_in_slab: number;                  // For slab: portion in this band
                                          // For level: entire sales amount
  commission_from_slab: number;
}

// ============================================================================
// COMMISSION CALCULATION RESULT
// ============================================================================

export interface CommissionCalculationResult {
  totalCommission: number;                // Final commission amount
  breakdown: CommissionBreakdown[];       // Detailed breakdown
  mode: CommissionMode;                   // Which mode was used
  salesBase: number;                      // Net sales used for calculation
}

// ============================================================================
// EXTENDED COMPENSATION DETAIL (For HR Panel)
// ============================================================================

export interface CompensationDetail {
  // Basic info
  userId: string;
  userName: string;
  userEmail?: string;
  baseSalary: number;

  // Company/rate set
  companyId: string;
  companyName: string;
  commissionMode: CommissionMode;         // NEW: Which mode applies
  rateSetName?: string;                   // NEW: Which rate set

  // Date range
  startDate: string;
  endDate: string;

  // Sales breakdown - NEW
  grossSales: number;                     // Total gross sales
  returns: number;                        // Deducted returns
  netSales: number;                       // Net (gross - returns)

  // Commission calculation
  salesItems: SalesLineItem[];
  commissionRate?: number;
  totalCommission: number;

  // Payout
  totalPayout: number;                    // base_salary + totalCommission
}

export interface SalesLineItem {
  orderId: string;
  amount: number;
  date: string;
  status: string;
  returns?: number;                       // NEW: Any returns on this order
}

// ============================================================================
// USER COMPENSATION SETTINGS
// ============================================================================

export interface UserCompensation {
  id: string;
  name: string;
  email?: string;
  company_id?: string;
  company_name?: string;
  role: string;
  isActive: boolean;
  
  // Compensation settings
  base_salary: number | null;
  comp_plan_type: 'fixed' | 'commission';
  commission_rate_set: string | null;    // Which rate set to use
  commission_mode?: CommissionMode;       // Derived from rate set
}

// ============================================================================
// COMMISSION SUMMARY (TOTALS)
// ============================================================================

export interface CommissionSummary {
  total_gross_sales: number;              // NEW: Before returns
  total_returns: number;                  // NEW: Total returns
  total_net_sales: number;                // NEW: After returns
  total_commission: number;
  total_base_salary: number;
  total_payout: number;
  employee_count: number;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface CommissionValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface SlabValidationResult {
  isValid: boolean;
  errors: CommissionValidationError[];
}

export interface LevelValidationResult {
  isValid: boolean;
  errors: CommissionValidationError[];
  coverageWarnings?: string[];
}

export interface ModeChangeWarning {
  severity: 'warning' | 'info';
  message: string;
  affectedBands: number;
}

// ============================================================================
// PAYLOADS FOR API/SERVICE CALLS
// ============================================================================

export interface UpsertCommissionRatePayload {
  id?: string;
  company_id: string | null;
  company_name?: string | null;
  name: string;
  min_amount: number;
  max_amount: number | null;
  rate_pct: number;
  mode: CommissionMode;                  // NEW
  set_name?: string | null;              // NEW
  apply_to?: 'company' | 'product' | 'custom';  // NEW
  is_active?: boolean;
}

export interface UpdateUserCompensationPayload {
  id: string;
  base_salary: number | null;
  comp_plan_type: 'fixed' | 'commission';
  commission_rate_set: string | null;
  commission_mode?: CommissionMode;      // NEW
}

export interface CreateSalesReturnPayload {
  order_id: string;
  salesperson_id: string;
  company_id: string;
  return_amount: number;
  return_date: string;
  reason?: string;
}

// ============================================================================
// FILTER/QUERY TYPES
// ============================================================================

export interface CommissionRateFilter {
  companyId?: string | null;
  mode?: CommissionMode;                 // NEW
  setName?: string;                      // NEW
  isActive?: boolean;
  skip?: number;
  limit?: number;
}

export interface NetSalesFilter {
  userId: string;
  startDate: string;
  endDate: string;
  companyId?: string | null;
}

// ============================================================================
// CALCULATION CONTEXT (For UI Preview/Display)
// ============================================================================

export interface CommissionCalculationContext {
  salesAmount: number;
  mode: CommissionMode;
  bands: CommissionRate[];
  grossSales?: number;
  returns?: number;
  netSales?: number;
}

// ============================================================================
// RESPONSE TYPES FOR UI
// ============================================================================

export interface CompensationTableData {
  rows: CompensationDetail[];
  summary: CommissionSummary;
  totalCount: number;
  modeDistribution: Record<CommissionMode, number>;  // Count by mode
}

export interface RateSetSelectorData {
  availableSets: CommissionRateSet[];
  selectedSet?: CommissionRateSet;
  currentMode: CommissionMode;
}

// ============================================================================
// BACKWARD COMPATIBILITY ALIASES
// ============================================================================

/**
 * Legacy name - still supported for compatibility
 * New code should use CommissionCalculationResult
 */
export type CommissionCalculation = CommissionCalculationResult;

/**
 * Legacy interface - extended with new fields
 * New code should use CompensationDetail
 */
export interface UserCompensationLegacy extends UserCompensation {
  // From old interface
  commission_rate_set: string | null;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isSlabMode(mode: CommissionMode): mode is 'slab' {
  return mode === 'slab';
}

export function isLevelMode(mode: CommissionMode): mode is 'level' {
  return mode === 'level';
}

export function isValidMode(value: string): value is CommissionMode {
  return value === 'slab' || value === 'level';
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const COMMISSION_MODES = {
  SLAB: 'slab' as const,
  LEVEL: 'level' as const,
};

export const MODE_DESCRIPTIONS = {
  slab: 'Tiered commission across multiple bands (each portion gets its rate)',
  level: 'Single bracket commission (entire sales at one rate)',
};

export const APPLY_TO_SCOPES = {
  COMPANY: 'company' as const,
  PRODUCT: 'product' as const,
  CUSTOM: 'custom' as const,
};
