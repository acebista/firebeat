/**
 * HR & Commission Service
 * Handles database operations for commission rates and user compensation
 */

import { supabase } from '@/lib/supabase';
import {
  CommissionRate,
  UserCompensation,
  MonthlySalesData,
  UpsertCommissionRatePayload,
  UpdateUserCompensationPayload,
} from '@/types/hr';

export const CommissionRateService = {
  /**
   * Fetch all active commission rates
   */
  async getAll(): Promise<CommissionRate[]> {
    const { data, error } = await supabase
      .from('commission_rates')
      .select('*')
      .eq('is_active', true)
      .order('min_amount', { ascending: true });

    if (error) {
      console.error('Error fetching commission rates:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Fetch commission rates for a specific company
   */
  async getActiveByCompany(companyId: string | null): Promise<CommissionRate[]> {
    const { data, error } = await supabase
      .from('commission_rates')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('min_amount', { ascending: true });

    if (error) {
      console.error('Error fetching company commission rates:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Fetch default slabs (company_id = null)
   */
  async getDefaultSlabs(): Promise<CommissionRate[]> {
    const { data, error } = await supabase
      .from('commission_rates')
      .select('*')
      .is('company_id', null)
      .eq('is_active', true)
      .order('min_amount', { ascending: true });

    if (error) {
      console.error('Error fetching default slabs:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Create or update a commission rate
   */
  async upsert(payload: UpsertCommissionRatePayload): Promise<CommissionRate> {
    const { data, error } = await supabase
      .from('commission_rates')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Error upserting commission rate:', error);
      throw error;
    }

    return data;
  },

  /**
   * Bulk upsert commission rates
   */
  async upsertMany(payloads: UpsertCommissionRatePayload[]): Promise<CommissionRate[]> {
    const { data, error } = await supabase
      .from('commission_rates')
      .upsert(payloads, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Error bulk upserting commission rates:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Soft delete a commission rate
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('commission_rates')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting commission rate:', error);
      throw error;
    }
  },

  /**
   * Hard delete a commission rate
   */
  async hardDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from('commission_rates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error hard deleting commission rate:', error);
      throw error;
    }
  },
};

export const UserCompensationService = {
  /**
   * Fetch all salespeople with compensation info
   */
  async getSalespeople(): Promise<UserCompensation[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'sales')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching salespeople:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get specific salesperson
   */
  async getById(userId: string): Promise<UserCompensation> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching salesperson:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update user compensation
   */
  async update(payload: UpdateUserCompensationPayload): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update(payload)
      .eq('id', payload.id);

    if (error) {
      console.error('Error updating user compensation:', error);
      throw error;
    }
  },
};

export const SalesService = {
  /**
   * Get specific salesperson's monthly sales for a date range
   */
  async getUserMonthlySales(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<MonthlySalesData[]> {
    // Parse dates to ensure proper format (YYYY-MM-DD)
    const start = startDate.includes('-') ? startDate : `${startDate}-01`;
    const end = endDate.includes('-') ? endDate : `${endDate}-01`;

    const { data, error } = await supabase
      .from('orders')
      .select('totalAmount, date')
      .eq('salespersonId', userId)
      .in('status', ['APPROVED', 'DISPATCHED', 'DELIVERED'])
      .gte('date', start)
      .lte('date', end);

    if (error) {
      console.error('Error fetching user monthly sales:', error);
      throw error;
    }

    // Aggregate by month
    const byMonth: Record<string, MonthlySalesData> = {};

    (data || []).forEach((order: any) => {
      const month = order.date.substring(0, 7); // YYYY-MM

      if (!byMonth[month]) {
        byMonth[month] = {
          user_id: userId,
          month,
          total_sales: 0,
          order_count: 0,
        };
      }

      byMonth[month].total_sales += order.totalAmount;
      byMonth[month].order_count += 1;
    });

    return Object.values(byMonth);
  },

  /**
   * Get all salespeople's monthly sales for a date range
   */
  async getAllMonthlySales(
    startMonth: string,
    endMonth: string,
    companyId?: string
  ): Promise<MonthlySalesData[]> {
    // Convert dates to proper ISO format (YYYY-MM-DD)
    let startDate: string;
    let endDate: string;

    if (startMonth.includes('-')) {
      const parts = startMonth.split('-');
      if (parts.length === 2) {
        // YYYY-MM format, convert to YYYY-MM-01
        startDate = `${startMonth}-01`;
      } else {
        // Already YYYY-MM-DD format
        startDate = startMonth;
      }
    } else {
      startDate = startMonth;
    }

    if (endMonth.includes('-')) {
      const parts = endMonth.split('-');
      if (parts.length === 2) {
        // YYYY-MM format, calculate last day of month
        const [year, month] = parts;
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
        endDate = `${endMonth}-${String(lastDay).padStart(2, '0')}`;
      } else {
        // Already YYYY-MM-DD format
        endDate = endMonth;
      }
    } else {
      endDate = endMonth;
    }

    let query = supabase
      .from('orders')
      .select('salespersonId, totalAmount, date')
      .in('status', ['APPROVED', 'DISPATCHED', 'DELIVERED'])
      .gte('date', startDate)
      .lte('date', endDate);

    if (companyId) {
      query = query.eq('companyId', companyId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching all sales:', error);
      throw error;
    }

    // Aggregate by user and month
    const byUserMonth: Record<string, MonthlySalesData> = {};

    (data || []).forEach((order: any) => {
      const userId = order.salespersonId;
      const month = order.date.substring(0, 7); // YYYY-MM
      const key = `${userId}|${month}`;

      if (!byUserMonth[key]) {
        byUserMonth[key] = {
          user_id: userId,
          month,
          total_sales: 0,
          order_count: 0,
        };
      }

      byUserMonth[key].total_sales += order.totalAmount;
      byUserMonth[key].order_count += 1;
    });

    return Object.values(byUserMonth);
  },

  /**
   * Get raw monthly sales view
   */
  async getMonthlySalesView(month: string): Promise<MonthlySalesData[]> {
    const { data, error } = await supabase
      .from('user_monthly_sales')
      .select('*')
      .eq('month', month);

    if (error) {
      console.error('Error fetching sales view:', error);
      throw error;
    }

    return data || [];
  },
};
