/**
 * Payments Service
 * 
 * Manages invoice payments with support for:
 * - Partial payments (multiple payments per invoice)
 * - Payment linking to both customer and invoice
 * - Payment voiding with reason tracking
 * 
 * UPDATED: 2025-12-30 - Fixed query syntax, using client-side filtering only
 */

import { supabase } from '../../lib/supabase';

export interface Payment {
    id: string;
    invoice_id: string;
    customer_id: string;
    amount: number;
    method: string;
    reference: string | null;
    notes: string | null;
    occurred_at: string;
    created_by: string | null;
    created_at: string;
    voided_at: string | null;
    voided_by: string | null;
    void_reason: string | null;
}

export interface CreatePaymentInput {
    invoiceId: string;
    customerId: string;
    amount: number;
    method?: 'cash' | 'qr' | 'cheque' | 'credit' | 'bank_transfer';
    reference?: string;
    notes?: string;
    occurredAt?: string;  // ISO timestamp, defaults to now
}

export interface PaymentWithInvoice extends Payment {
    invoice_total?: number;
    customer_name?: string;
}

/**
 * Payments Service - All invoice payment operations
 */
export const PaymentsService = {
    /**
     * Add a new payment for an invoice
     */
    addPayment: async (input: CreatePaymentInput): Promise<Payment> => {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        const { data, error } = await supabase
            .from('invoice_payments')
            .insert({
                invoice_id: input.invoiceId,
                customer_id: input.customerId,
                amount: input.amount,
                method: input.method || 'cash',
                reference: input.reference || null,
                notes: input.notes || null,
                occurred_at: input.occurredAt || new Date().toISOString(),
                created_by: userId || null
            })
            .select()
            .single();

        if (error) {
            console.error('[PaymentsService] Error adding payment:', error);
            throw error;
        }
        console.log('[PaymentsService] Successfully added payment:', data.id);
        return data;
    },

    /**
     * Void (cancel) a payment
     */
    voidPayment: async (paymentId: string, reason: string): Promise<boolean> => {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        console.log('[PaymentsService] Attempting to void payment:', paymentId);
        const { data, error } = await supabase
            .from('invoice_payments')
            .update({
                voided_at: new Date().toISOString(),
                voided_by: userId || null,
                void_reason: reason
            })
            .eq('id', paymentId)
            .select();

        if (error) {
            console.error('[PaymentsService] Error voiding payment:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            console.warn('[PaymentsService] No payment found with ID to void:', paymentId);
            return false;
        }

        // Verify the payment was actually voided
        const voidedPayment = data[0];
        if (!voidedPayment.voided_at) {
            console.error('[PaymentsService] Payment update succeeded but voided_at was not set:', paymentId);
            return false;
        }

        console.log('[PaymentsService] Successfully voided payment:', paymentId, 'voided_at:', voidedPayment.voided_at);
        return true;
    },

    /**
     * Delete a payment (use when voiding doesn't work due to DB constraints)
     */
    deletePayment: async (paymentId: string): Promise<boolean> => {
        console.log('[PaymentsService] Attempting to DELETE payment:', paymentId);
        const { data, error, count } = await supabase
            .from('invoice_payments')
            .delete()
            .eq('id', paymentId)
            .select();

        if (error) {
            console.error('[PaymentsService] Error deleting payment:', error);
            console.error('[PaymentsService] Error details:', JSON.stringify(error));
            throw error;
        }

        console.log('[PaymentsService] DELETE response - data:', data, 'count:', count);

        if (!data || data.length === 0) {
            console.warn('[PaymentsService] DELETE returned no data - payment may not exist or RLS policy blocked it');
            return false;
        }

        console.log('[PaymentsService] Successfully DELETED payment:', paymentId);
        return true;
    },

    /**
     * Get all payments for an invoice
     */
    getPaymentsByInvoice: async (invoiceId: string, includeVoided = false): Promise<Payment[]> => {
        // Fetch all payments for this invoice
        const { data, error } = await supabase
            .from('invoice_payments')
            .select('*')
            .eq('invoice_id', invoiceId)
            .order('occurred_at', { ascending: false });

        if (error) {
            console.error('[PaymentsService] Error fetching payments:', error);
            throw error;
        }

        // ALWAYS use client-side filter (database filter is unreliable)
        const result = data || [];
        if (!includeVoided) {
            const filtered = result.filter(p => !p.voided_at);
            console.log(`[PaymentsService] Fetched ${result.length} total, ${filtered.length} non-voided for invoice ${invoiceId}`);
            return filtered;
        }

        console.log(`[PaymentsService] Fetched ${result.length} payments (including voided) for invoice ${invoiceId}`);
        return result;
    },

    /**
     * Get all payments for multiple invoices
     */
    getPaymentsByInvoices: async (invoiceIds: string[], includeVoided = false): Promise<Payment[]> => {
        if (!invoiceIds || invoiceIds.length === 0) return [];

        // Fetch all payments for these invoices
        const { data, error } = await supabase
            .from('invoice_payments')
            .select('*')
            .in('invoice_id', invoiceIds);

        if (error) {
            console.error('[PaymentsService] Error fetching payments for invoices:', error);
            throw error;
        }

        // ALWAYS use client-side filter (database filter is unreliable)
        const result = data || [];
        if (!includeVoided) {
            const filtered = result.filter(p => !p.voided_at);
            console.log(`[PaymentsService] Fetched ${result.length} total, ${filtered.length} non-voided for ${invoiceIds.length} invoices`);
            return filtered;
        }

        console.log(`[PaymentsService] Fetched ${result.length} payments (including voided) for ${invoiceIds.length} invoices`);
        return result;
    },

    /**
     * Get all payments for a customer
     */
    getPaymentsByCustomer: async (customerId: string, includeVoided = false): Promise<Payment[]> => {
        let query = supabase
            .from('invoice_payments')
            .select('*')
            .eq('customer_id', customerId)
            .order('occurred_at', { ascending: false });

        if (!includeVoided) {
            query = query.is('voided_at', null);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    },

    /**
     * Get payment by ID
     */
    getById: async (paymentId: string): Promise<Payment | null> => {
        const { data, error } = await supabase
            .from('invoice_payments')
            .select('*')
            .eq('id', paymentId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    },

    /**
     * Get total paid for an invoice
     */
    getInvoicePaidTotal: async (invoiceId: string): Promise<number> => {
        const { data, error } = await supabase
            .from('invoice_payments')
            .select('amount')
            .eq('invoice_id', invoiceId)
            .is('voided_at', null);

        if (error) throw error;
        return (data || []).reduce((sum, p) => sum + Number(p.amount), 0);
    },

    /**
     * Get recent payments (for dashboard/reports)
     */
    getRecentPayments: async (limit = 50): Promise<PaymentWithInvoice[]> => {
        const { data, error } = await supabase
            .from('invoice_payments')
            .select(`
                *,
                orders!invoice_payments_invoice_id_fkey (
                    "totalAmount",
                    "customerName"
                )
            `)
            .is('voided_at', null)
            .order('occurred_at', { ascending: false })
            .limit(limit);

        if (error) {
            // Fallback if foreign key issue
            const { data: fallbackData, error: fallbackError } = await supabase
                .from('invoice_payments')
                .select('*')
                .is('voided_at', null)
                .order('occurred_at', { ascending: false })
                .limit(limit);

            if (fallbackError) throw fallbackError;
            return fallbackData || [];
        }

        return (data || []).map(p => ({
            ...p,
            invoice_total: p.orders?.totalAmount,
            customer_name: p.orders?.customerName
        }));
    },

    /**
     * Get payments by date range
     */
    getPaymentsByDateRange: async (
        startDate: string,
        endDate: string,
        customerId?: string
    ): Promise<Payment[]> => {
        let query = supabase
            .from('invoice_payments')
            .select('*')
            .gte('occurred_at', startDate)
            .lte('occurred_at', endDate + 'T23:59:59.999Z')
            .is('voided_at', null)
            .order('occurred_at', { ascending: false });

        if (customerId) {
            query = query.eq('customer_id', customerId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    },

    /**
     * Get payment summary (for reports)
     */
    getPaymentSummary: async (
        startDate?: string,
        endDate?: string
    ): Promise<{
        totalPayments: number;
        paymentCount: number;
        byMethod: { method: string; total: number; count: number }[];
    }> => {
        let query = supabase
            .from('invoice_payments')
            .select('amount, method')
            .is('voided_at', null);

        if (startDate) {
            query = query.gte('occurred_at', startDate);
        }
        if (endDate) {
            query = query.lte('occurred_at', endDate + 'T23:59:59.999Z');
        }

        const { data, error } = await query;
        if (error) throw error;

        const payments = data || [];

        // Group by method
        const byMethodMap = new Map<string, { total: number; count: number }>();
        let totalPayments = 0;

        payments.forEach(p => {
            totalPayments += Number(p.amount);
            const method = p.method || 'cash';
            const existing = byMethodMap.get(method) || { total: 0, count: 0 };
            byMethodMap.set(method, {
                total: existing.total + Number(p.amount),
                count: existing.count + 1
            });
        });

        return {
            totalPayments,
            paymentCount: payments.length,
            byMethod: Array.from(byMethodMap.entries()).map(([method, data]) => ({
                method,
                ...data
            }))
        };
    }
};

export default PaymentsService;
