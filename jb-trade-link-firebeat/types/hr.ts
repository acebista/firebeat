/**
 * HR & Compensation Types
 * Defines structures for commission rates, user compensation, and calculations
 */

export interface CommissionRate {
  id: string;
  company_id: string | null;
  company_name: string | null;
  name: string;
  min_amount: number;
  max_amount: number | null;
  rate_pct: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  mode?: 'slab' | 'level';
}

export interface UserCompensation {
  id: string;
  name: string;
  email?: string;
  company_id?: string;
  company_name?: string;
  role: string;
  isActive: boolean;
  base_salary: number | null;
  comp_plan_type: 'fixed' | 'commission';
  commission_rate_set: string | null;
}

export interface MonthlySalesData {
  user_id: string;
  month: string;
  total_sales: number;
  order_count: number;
}

export interface CommissionCalculation {
  user_id: string;
  user_name: string;
  base_salary: number;
  total_sales: number;
  commission: number;
  total_payout: number;
}

export interface CommissionBreakdown {
  slab_index: number;
  min_amount: number;
  max_amount: number | null;
  rate_pct: number;
  sales_in_slab: number;
  commission_from_slab: number;
}

export interface CommissionSummary {
  total_sales: number;
  total_commission: number;
  total_base_salary: number;
  total_payout: number;
  employee_count: number;
}

export interface UpsertCommissionRatePayload {
  id?: string;
  company_id: string | null;
  company_name: string | null;
  name: string;
  min_amount: number;
  max_amount: number | null;
  rate_pct: number;
  is_active?: boolean;
  mode?: 'slab' | 'level';
}

export interface UpdateUserCompensationPayload {
  id: string;
  base_salary: number | null;
  comp_plan_type: 'fixed' | 'commission';
  commission_rate_set: string | null;
}

// Validation error for overlapping slabs
export interface SlabOverlapError {
  message: string;
  slab1: CommissionRate;
  slab2: CommissionRate;
}
