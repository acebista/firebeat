/**
 * Customer Ledger & AR Service
 * 
 * Provides:
 * - Customer ledger entries (invoices, payments, returns)
 * - Customer balance summaries
 * - Invoice balance details
 * - AR aging reports
 */

import { supabase } from '../../lib/supabase';

// Types for Ledger System
export interface LedgerEntry {
    customer_id: string;
    reference_id: string;
    entry_type: 'invoice' | 'payment' | 'return';
    entry_date: string;
    occurred_at: string;
    debit_amount: number;
    credit_amount: number;
    description: string;
    created_by_name: string;
    // Computed running balance (added client-side)
    running_balance?: number;
}

export interface InvoiceBalance {
    invoice_id: string;
    customer_id: string;
    customer_name: string;
    salesperson_id: string;
    salesperson_name: string;
    order_date: string;
    delivered_at: string | null;
    invoice_total: number;
    payment_at_delivery: number;
    returns_total: number;
    payments_after_delivery: number;
    outstanding: number;
    days_since_delivery: number | null;
    payment_status: 'paid' | 'partial' | 'unpaid';
}

export interface CustomerBalance {
    customer_id: string;
    customer_name: string;
    total_invoices: number;
    total_sales: number;
    total_outstanding: number;
    outstanding_0_30: number;
    outstanding_31_60: number;
    outstanding_61_90: number;
    outstanding_over_90: number;
    last_delivery: string | null;
    unpaid_invoices: number;
    partial_invoices: number;
    paid_invoices: number;
}

export interface CustomerLedgerSummary {
    customer_id: string;
    customer_name: string;
    credit_limit: number;
    current_outstanding: number;
    total_invoices: number;
    aging: {
        current: number;      // 0-30 days
        thirtyDays: number;   // 31-60 days
        sixtyDays: number;    // 61-90 days
        overNinety: number;   // 90+ days
    };
    last_payment_date: string | null;
    last_delivery_date: string | null;
}

export interface LedgerFilters {
    startDate?: string;
    endDate?: string;
    entryType?: 'invoice' | 'payment' | 'return' | 'all';
    invoiceId?: string;
}

export interface ARReportFilters {
    paymentStatus?: 'paid' | 'partial' | 'unpaid' | 'all';
    agingBucket?: '0-30' | '31-60' | '61-90' | '90+' | 'all';
    salespersonId?: string;
    startDate?: string;
    endDate?: string;
}

/**
 * Ledger Service - All Accounts Receivable operations
 */
export const LedgerService = {
    /**
     * Get customer ledger entries (chronological list of all transactions)
     */
    getCustomerLedger: async (
        customerId: string,
        filters?: LedgerFilters
    ): Promise<LedgerEntry[]> => {
        let query = supabase
            .from('customer_ledger_entries')
            .select('*')
            .eq('customer_id', customerId)
            .order('occurred_at', { ascending: true });

        if (filters?.startDate) {
            query = query.gte('entry_date', filters.startDate);
        }
        if (filters?.endDate) {
            query = query.lte('entry_date', filters.endDate);
        }
        if (filters?.entryType && filters.entryType !== 'all') {
            query = query.eq('entry_type', filters.entryType);
        }
        if (filters?.invoiceId) {
            query = query.eq('reference_id', filters.invoiceId);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Calculate running balance
        let runningBalance = 0;
        const entriesWithBalance = (data || []).map((entry: LedgerEntry) => {
            runningBalance += entry.debit_amount - entry.credit_amount;
            return {
                ...entry,
                running_balance: runningBalance
            };
        });

        return entriesWithBalance;
    },

    /**
     * Get customer ledger summary (header info for ledger page)
     */
    getCustomerLedgerSummary: async (customerId: string): Promise<CustomerLedgerSummary | null> => {
        // Get customer balance from view
        const { data: balanceData, error: balanceError } = await supabase
            .from('customer_balances')
            .select('*')
            .eq('customer_id', customerId)
            .single();

        if (balanceError && balanceError.code !== 'PGRST116') {
            throw balanceError;
        }

        // Get customer details
        const { data: customer, error: customerError } = await supabase
            .from('customers')
            .select('id, name, "creditLimit"')
            .eq('id', customerId)
            .single();

        if (customerError) throw customerError;

        // Get last payment
        const { data: lastPayment } = await supabase
            .from('invoice_payments')
            .select('occurred_at')
            .eq('customer_id', customerId)
            .is('voided_at', null)
            .order('occurred_at', { ascending: false })
            .limit(1)
            .single();

        return {
            customer_id: customerId,
            customer_name: customer?.name || 'Unknown',
            credit_limit: customer?.creditLimit || 0,
            current_outstanding: balanceData?.total_outstanding || 0,
            total_invoices: balanceData?.total_invoices || 0,
            aging: {
                current: balanceData?.outstanding_0_30 || 0,
                thirtyDays: balanceData?.outstanding_31_60 || 0,
                sixtyDays: balanceData?.outstanding_61_90 || 0,
                overNinety: balanceData?.outstanding_over_90 || 0
            },
            last_payment_date: lastPayment?.occurred_at || null,
            last_delivery_date: balanceData?.last_delivery || null
        };
    },

    /**
     * Get all customer balances (AR summary)
     */
    getAllCustomerBalances: async (filters?: ARReportFilters): Promise<CustomerBalance[]> => {
        const { data, error } = await supabase
            .from('customer_balances')
            .select('*')
            .order('total_outstanding', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get invoice balances (per-invoice AR details)
     */
    getInvoiceBalances: async (filters?: ARReportFilters): Promise<InvoiceBalance[]> => {
        let query = supabase
            .from('invoice_balances')
            .select('*')
            .order('delivered_at', { ascending: false });

        if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
            query = query.eq('payment_status', filters.paymentStatus);
        }
        if (filters?.salespersonId) {
            query = query.eq('salesperson_id', filters.salespersonId);
        }
        if (filters?.startDate) {
            query = query.gte('order_date', filters.startDate);
        }
        if (filters?.endDate) {
            query = query.lte('order_date', filters.endDate);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Apply aging filter client-side if needed
        let results = data || [];
        if (filters?.agingBucket && filters.agingBucket !== 'all') {
            results = results.filter(inv => {
                const days = inv.days_since_delivery || 0;
                switch (filters.agingBucket) {
                    case '0-30': return days <= 30;
                    case '31-60': return days > 30 && days <= 60;
                    case '61-90': return days > 60 && days <= 90;
                    case '90+': return days > 90;
                    default: return true;
                }
            });
        }

        return results;
    },

    /**
     * Get single invoice balance details
     */
    getInvoiceBalance: async (invoiceId: string): Promise<InvoiceBalance | null> => {
        const { data, error } = await supabase
            .from('invoice_balances')
            .select('*')
            .eq('invoice_id', invoiceId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    },

    /**
     * Get invoices for a specific customer
     */
    getCustomerInvoices: async (customerId: string): Promise<InvoiceBalance[]> => {
        const { data, error } = await supabase
            .from('invoice_balances')
            .select('*')
            .eq('customer_id', customerId)
            .order('delivered_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get AR aging summary (totals across all customers)
     */
    getARAgingSummary: async (): Promise<{
        total: number;
        current: number;
        thirtyDays: number;
        sixtyDays: number;
        overNinety: number;
    }> => {
        const { data, error } = await supabase
            .from('customer_balances')
            .select('total_outstanding, outstanding_0_30, outstanding_31_60, outstanding_61_90, outstanding_over_90');

        if (error) throw error;

        const summary = (data || []).reduce((acc, row) => ({
            total: acc.total + (row.total_outstanding || 0),
            current: acc.current + (row.outstanding_0_30 || 0),
            thirtyDays: acc.thirtyDays + (row.outstanding_31_60 || 0),
            sixtyDays: acc.sixtyDays + (row.outstanding_61_90 || 0),
            overNinety: acc.overNinety + (row.outstanding_over_90 || 0)
        }), { total: 0, current: 0, thirtyDays: 0, sixtyDays: 0, overNinety: 0 });

        return summary;
    }
};

export default LedgerService;
