/**
 * Extended HR & Compensation Service
 * Adds support for dual commission modes, net sales, and rate set management
 * 
 * File: services/hr-extended.ts
 * Status: Ready for integration into services/hr.ts
 */

import { supabase } from '@/lib/supabase';
import {
  CommissionRate,
  CommissionMode,
  CommissionRateSet,
  NetSalesBreakdown,
  CompensationDetail,
  SalesReturn,
  CreateSalesReturnPayload,
} from '@/types/hr-extended';
import {
  calculateCommission,
  calculateCommissionWithReturns,
  validateSlabBands,
  validateLevelBands,
} from '@/utils/commissionCalculator-extended';

// ============================================================================
// COMMISSION RATE SERVICE EXTENSIONS
// ============================================================================

export const CommissionRateServiceExtended = {
  /**
   * Fetch commission rates for a company filtered by mode
   * 
   * @param companyId - Company ID (null for defaults)
   * @param mode - 'slab' or 'level'
   * @returns Sorted array of active commission rates for the mode
   */
  async getByCompanyAndMode(
    companyId: string | null,
    mode: CommissionMode
  ): Promise<CommissionRate[]> {
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
  },

  /**
   * Fetch commission rate set for a company with optional set name filter
   * 
   * @param companyId - Company ID
   * @param mode - Commission mode
   * @param setName - Optional: specific set name to filter by
   * @returns Array of commission rates matching criteria
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

    const { data, error } = await query.order('min_amount', {
      ascending: true,
    });

    if (error) {
      console.error('Error fetching commission rate set:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get all available rate sets for a company
   * Returns unique set names grouped with their modes
   * 
   * @param companyId - Company ID
   * @returns Array of distinct commission rate sets
   */
  async getAvailableSets(companyId: string | null): Promise<CommissionRateSet[]> {
    const { data, error } = await supabase
      .from('commission_rates')
      .select('id, company_id, set_name, mode, is_active, created_at, updated_at')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .not('set_name', 'is', null)
      .order('set_name', { ascending: true });

    if (error) {
      console.error('Error fetching rate sets:', error);
      throw error;
    }

    // Group by set_name and mode to get unique sets
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
          created_at: rate.created_at,
          updated_at: rate.updated_at,
          bandCount: 0,
        });
      }
      // Count bands in this set
      sets.get(key)!.bandCount = (sets.get(key)!.bandCount || 0) + 1;
    }

    return Array.from(sets.values());
  },

  /**
   * Get commission rates with flexible filtering
   * Useful for complex queries
   */
  async getFiltered(filter: {
    companyId?: string | null;
    mode?: CommissionMode;
    setName?: string;
    isActive?: boolean;
  }): Promise<CommissionRate[]> {
    let query = supabase.from('commission_rates').select('*');

    if (filter.companyId !== undefined) {
      query = query.eq('company_id', filter.companyId);
    }

    if (filter.mode) {
      query = query.eq('mode', filter.mode);
    }

    if (filter.setName) {
      query = query.eq('set_name', filter.setName);
    }

    if (filter.isActive !== undefined) {
      query = query.eq('is_active', filter.isActive);
    }

    const { data, error } = await query.order('min_amount', {
      ascending: true,
    });

    if (error) {
      console.error('Error fetching filtered commission rates:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Validate slab bands for overlaps using utility function
   * Slab bands should not overlap (contiguous is OK)
   */
  validateSlabBands(bands: CommissionRate[]): string[] {
    return validateSlabBands(bands);
  },

  /**
   * Validate level bands using utility function
   * Level bands should start at 0, be contiguous, and cover all ranges
   */
  validateLevelBands(bands: CommissionRate[]): string[] {
    return validateLevelBands(bands);
  },
};

// ============================================================================
// SALES SERVICE EXTENSIONS
// ============================================================================

export const SalesServiceExtended = {
  /**
   * Get net sales (gross - returns) for a user in a date range
   * Uses the existing `returns` table for return tracking
   * 
   * @param userId - User/salesperson ID
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @param companyId - Optional: filter by company
   * @returns Breakdown of gross, returns, and net sales
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

    if (companyId) {
      ordersQuery = ordersQuery.eq('company_id', companyId);
    }

    const { data: orders, error: ordersError } = await ordersQuery;

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      throw ordersError;
    }

    // Calculate totals from orders
    let grossSales = 0;
    let returns = 0;
    const orderCount = orders?.length || 0;

    for (const order of (orders || [])) {
      grossSales += order.totalAmount || 0;
      returns += order.sales_returns || 0;
    }

    // Fetch returns from existing returns table
    const startDate2 = startDate + 'T00:00:00Z';
    const endDate2 = endDate + 'T23:59:59Z';
    let returnsQuery = supabase
      .from('returns')
      .select('totalReturnAmount')
      .eq('salesperson_id', userId)
      .gte('createdAt', startDate2)
      .lte('createdAt', endDate2)
      .eq('is_active', true);

    if (companyId) {
      returnsQuery = returnsQuery.eq('company_id', companyId);
    }

    const { data: returnRecords, error: returnsError } = await returnsQuery;

    let returnCount = 0;
    if (!returnsError && returnRecords) {
      returnCount = returnRecords.length;
      for (const record of returnRecords) {
        returns += record.totalReturnAmount || 0;
      }
    }

    const netSales = grossSales - returns;

    return {
      grossSales,
      returns,
      netSales: Math.max(0, netSales),
      orderCount,
      returnCount,
    };
  },

  /**
   * Get net sales breakdown for a user across all companies
   * Useful for total compensation calculation across multiple companies
   */
  async getNetSalesByUserAndCompany(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<NetSalesBreakdown[]> {
    const startDateTime = `${startDate}T00:00:00Z`;
    const endDateTime = `${endDate}T23:59:59Z`;

    // Get all orders for user in date range
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
    const byCompany = new Map<
      string,
      {
        gross: number;
        returns: number;
        orderCount: number;
        returnCount: number;
      }
    >();

    for (const order of (orders || [])) {
      const cid = order.company_id || 'default';
      const existing = byCompany.get(cid) || {
        gross: 0,
        returns: 0,
        orderCount: 0,
        returnCount: 0,
      };

      existing.gross += order.totalAmount || 0;
      existing.returns += order.sales_returns || 0;
      existing.orderCount += 1;
      existing.returnCount += 1;

      byCompany.set(cid, existing);
    }

    // Convert to array
    return Array.from(byCompany.entries()).map(([, data]) => ({
      grossSales: data.gross,
      returns: data.returns,
      netSales: Math.max(0, data.gross - data.returns),
      orderCount: data.orderCount,
      returnCount: data.returnCount,
    }));
  },

  /**
   * Calculate compensation for a user including commission
   * Combines net sales with commission rate calculation
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
      .select(
        'id, name, email, base_salary, comp_plan_type, commission_rate_set'
      )
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

    // Determine commission mode and bands
    let commissionMode: CommissionMode = 'slab';
    let commissionBands: CommissionRate[] = [];
    let rateSetName: string | undefined;

    if (user.commission_rate_set) {
      // User has specific rate set - try both modes
      const slabBands = await CommissionRateServiceExtended.getByCompanyModeAndSet(
        companyId || null,
        'slab',
        user.commission_rate_set
      );

      if (slabBands.length > 0) {
        commissionBands = slabBands;
        commissionMode = 'slab';
        rateSetName = user.commission_rate_set;
      } else {
        // Try level mode
        const levelBands =
          await CommissionRateServiceExtended.getByCompanyModeAndSet(
            companyId || null,
            'level',
            user.commission_rate_set
          );
        if (levelBands.length > 0) {
          commissionBands = levelBands;
          commissionMode = 'level';
          rateSetName = user.commission_rate_set;
        }
      }
    }

    // If no rate set or not found, use default company rates
    if (commissionBands.length === 0) {
      commissionBands = await CommissionRateServiceExtended.getByCompanyAndMode(
        companyId || null,
        'slab'
      );
      commissionMode = 'slab';
    }

    // Calculate commission
    const commissionResult = calculateCommissionWithReturns(
      netSalesData.grossSales,
      netSalesData.returns,
      commissionBands,
      commissionMode
    );

    // Get company name
    let companyName = 'Default';
    if (companyId) {
      const { data: company } = await supabase
        .from('companies')
        .select('name')
        .eq('id', companyId)
        .single();

      companyName = company?.name || 'Unknown';
    }

    return {
      userId,
      userName: user.name,
      userEmail: user.email,
      baseSalary: user.base_salary || 0,
      companyId: companyId || '',
      companyName,
      commissionMode,
      rateSetName,
      startDate,
      endDate,
      grossSales: netSalesData.grossSales,
      returns: netSalesData.returns,
      netSales: netSalesData.netSales,
      salesItems: [],
      totalCommission: commissionResult.totalCommission,
      totalPayout:
        (user.base_salary || 0) + commissionResult.totalCommission,
    };
  },

  /**
   * Get detailed compensation for multiple users
   * Returns array of compensation details with summary
   */
  async calculateBulkCompensation(
    userIds: string[],
    startDate: string,
    endDate: string,
    companyId?: string | null
  ): Promise<{
    compensations: CompensationDetail[];
    summary: {
      totalGrossSales: number;
      totalReturns: number;
      totalNetSales: number;
      totalCommission: number;
      totalBaseSalary: number;
      totalPayout: number;
      userCount: number;
    };
  }> {
    const compensations = await Promise.all(
      userIds.map((uid) =>
        this.calculateUserCompensation(uid, startDate, endDate, companyId)
      )
    );

    const summary = {
      totalGrossSales: compensations.reduce((sum, c) => sum + c.grossSales, 0),
      totalReturns: compensations.reduce((sum, c) => sum + c.returns, 0),
      totalNetSales: compensations.reduce((sum, c) => sum + c.netSales, 0),
      totalCommission: compensations.reduce(
        (sum, c) => sum + c.totalCommission,
        0
      ),
      totalBaseSalary: compensations.reduce(
        (sum, c) => sum + c.baseSalary,
        0
      ),
      totalPayout: compensations.reduce((sum, c) => sum + c.totalPayout, 0),
      userCount: userIds.length,
    };

    return { compensations, summary };
  },
};

// ============================================================================
// SALES RETURNS SERVICE (Uses existing returns table)
// ============================================================================

export const SalesReturnService = {
  /**
   * Create a new sales return record
   * Maps to existing `returns` table structure
   */
  async create(payload: CreateSalesReturnPayload): Promise<any> {
    const { data, error } = await supabase
      .from('returns')
      .insert({
        id: `ret_${crypto.randomUUID()}`,
        invoiceId: payload.order_id,
        customerId: payload.company_id, // Use company_id as customerId for now
        salesperson_id: payload.salesperson_id,
        company_id: payload.company_id,
        totalReturnAmount: payload.return_amount,
        reason: payload.reason,
        createdAt: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating sales return:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get returns for a salesperson in date range
   */
  async getBySalesPersonAndDate(
    salespersonId: string,
    startDate: string,
    endDate: string
  ): Promise<any[]> {
    const startDateTime = `${startDate}T00:00:00Z`;
    const endDateTime = `${endDate}T23:59:59Z`;

    const { data, error } = await supabase
      .from('returns')
      .select('*')
      .eq('salesperson_id', salespersonId)
      .gte('createdAt', startDateTime)
      .lte('createdAt', endDateTime)
      .eq('is_active', true)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching sales returns:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get total returns for a salesperson
   */
  async getTotalReturns(
    salespersonId: string,
    startDate: string,
    endDate: string
  ): Promise<number> {
    const returns = await this.getBySalesPersonAndDate(
      salespersonId,
      startDate,
      endDate
    );

    return returns.reduce((sum, r) => sum + (r.totalReturnAmount || 0), 0);
  },

  /**
   * Deactivate a return record
   */
  async deactivate(returnId: string): Promise<void> {
    const { error } = await supabase
      .from('returns')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', returnId);

    if (error) {
      console.error('Error deactivating sales return:', error);
      throw error;
    }
  },
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { CommissionRate, CommissionMode, CommissionRateSet };
export type { NetSalesBreakdown, CompensationDetail };
export type { SalesReturn, CreateSalesReturnPayload };
