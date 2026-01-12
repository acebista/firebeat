/**
 * FinPro Aggregation Engine
 * 
 * This is the CORE of the financial spine. It takes closed trips and:
 * 1. Reads all delivered orders
 * 2. Applies IRD billing rules (50k, PAN, payment type)
 * 3. Produces aggregation batches for FinPro export
 * 
 * CRITICAL RULES ENFORCED:
 * - Cheque → Individual batch
 * - Credit → Individual batch
 * - Mixed payment → Individual batch
 * - PAN provided → Individual batch
 * - Cash/QR > 50k → Individual batch
 * - Small Cash/QR → Eligible for merging
 * 
 * This system does NOT create VAT invoices. That is done in FinPro.
 * This creates the mathematically consistent truth that feeds FinPro.
 */

import { supabase } from '../../lib/supabase';
import { TripClosureService } from './TripClosureService';

// ============================================================================
// TYPES
// ============================================================================

export interface FinProBatch {
    id?: string;
    batch_date: string;
    batch_number: number;
    batch_type: BatchType;

    // Financial totals
    total_gross: number;
    total_discount: number;
    total_net: number;

    // Payment breakdown
    payment_cash: number;
    payment_qr: number;
    payment_cheque: number;
    payment_credit: number;

    // Customer (for individual batches)
    customer_id?: string;
    customer_name?: string;
    customer_pan?: string;

    // Source tracking
    source_order_ids: string[];
    source_trip_ids: string[];

    // Lines
    lines: FinProBatchLine[];
}

export interface FinProBatchLine {
    product_id: string;
    product_name: string;
    product_sku?: string;
    company_name?: string;
    qty: number;
    rate: number;
    gross_amount: number;
    discount_amount: number;
    net_amount: number;
    source_order_id: string;
}

export type BatchType =
    | 'INDIVIDUAL_CREDIT'
    | 'INDIVIDUAL_CHEQUE'
    | 'INDIVIDUAL_PAN'
    | 'INDIVIDUAL_MIXED'
    | 'INDIVIDUAL_OVER_50K'
    | 'MERGED_CASH_QR';

export interface GenerateBatchesInput {
    date: string;  // YYYY-MM-DD
    tripIds?: string[];  // Optional: specific trips, otherwise all closed trips for date
}

export interface GenerateBatchesResult {
    success: boolean;
    date: string;
    batches: FinProBatch[];
    summary: {
        totalBatches: number;
        individualBatches: number;
        mergedBatches: number;
        totalGross: number;
        totalNet: number;
        totalCash: number;
        totalQr: number;
        totalCheque: number;
        totalCredit: number;
    };
    error?: string;
}

export interface FinProExport {
    date: string;
    generated_at: string;
    invoices: FinProExportInvoice[];
}

export interface FinProExportInvoice {
    type: BatchType;
    customer_name?: string;
    customer_pan?: string;
    total: number;
    payment: {
        cash?: number;
        qr?: number;
        cheque?: number;
        credit?: number;
    };
    lines: Array<{
        sku: string;
        product_name: string;
        qty: number;
        rate: number;
        amount: number;
    }>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MERGE_THRESHOLD = 50000; // NPR 50,000

// ============================================================================
// FINPRO AGGREGATION SERVICE
// ============================================================================

export const FinProAggregationService = {
    /**
     * Generate FinPro batches for a date
     * This is the main aggregation function
     */
    generateFinProBatches: async (input: GenerateBatchesInput): Promise<GenerateBatchesResult> => {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
            return {
                success: false,
                date: input.date,
                batches: [],
                summary: emptySummary(),
                error: 'Not authenticated'
            };
        }

        console.log(`[FinProAggregation] Generating batches for date: ${input.date}`);

        // 1. Get closed trips for the date
        const closedTripIds = await getClosedTripsForDate(input.date, input.tripIds);

        if (closedTripIds.length === 0) {
            return {
                success: false,
                date: input.date,
                batches: [],
                summary: emptySummary(),
                error: 'No closed trips found for this date'
            };
        }

        console.log(`[FinProAggregation] Found ${closedTripIds.length} closed trips`);

        // 2. Get all delivered orders from those trips
        const orders = await getDeliveredOrdersForTrips(closedTripIds);

        if (orders.length === 0) {
            return {
                success: false,
                date: input.date,
                batches: [],
                summary: emptySummary(),
                error: 'No delivered orders found in closed trips'
            };
        }

        console.log(`[FinProAggregation] Found ${orders.length} delivered orders`);

        // 3. Classify orders into batch types
        const classifiedOrders = classifyOrders(orders);

        // 4. Create individual batches for orders that require them
        const batches: FinProBatch[] = [];
        let batchNumber = 1;

        // Process individual batches
        for (const order of classifiedOrders.individual) {
            const batch = createBatchFromOrder(order, batchNumber++, input.date);
            batches.push(batch);
        }

        // 5. Create merged batches for small cash/QR orders
        const mergedBatches = createMergedBatches(
            classifiedOrders.mergeable,
            batchNumber,
            input.date,
            closedTripIds
        );
        batches.push(...mergedBatches);

        // 6. Calculate summary
        const summary = calculateSummary(batches);

        console.log(`[FinProAggregation] Generated ${batches.length} batches (${summary.individualBatches} individual, ${summary.mergedBatches} merged)`);

        return {
            success: true,
            date: input.date,
            batches,
            summary
        };
    },

    /**
     * Save generated batches to database
     */
    saveBatches: async (batches: FinProBatch[]): Promise<boolean> => {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        for (const batch of batches) {
            // Insert batch
            const { data: batchRecord, error: batchError } = await supabase
                .from('finpro_batches')
                .insert({
                    batch_date: batch.batch_date,
                    batch_number: batch.batch_number,
                    batch_type: batch.batch_type,
                    total_gross: batch.total_gross,
                    total_discount: batch.total_discount,
                    total_net: batch.total_net,
                    payment_cash: batch.payment_cash,
                    payment_qr: batch.payment_qr,
                    payment_cheque: batch.payment_cheque,
                    payment_credit: batch.payment_credit,
                    customer_id: batch.customer_id,
                    customer_name: batch.customer_name,
                    customer_pan: batch.customer_pan,
                    source_order_ids: batch.source_order_ids,
                    source_trip_ids: batch.source_trip_ids,
                    created_by: userId
                })
                .select()
                .single();

            if (batchError) {
                console.error('[FinProAggregation] Error saving batch:', batchError);
                throw batchError;
            }

            // Insert lines
            const lines = batch.lines.map(line => ({
                batch_id: batchRecord.id,
                product_id: line.product_id,
                product_name: line.product_name,
                product_sku: line.product_sku,
                company_name: line.company_name,
                qty: line.qty,
                rate: line.rate,
                gross_amount: line.gross_amount,
                discount_amount: line.discount_amount,
                net_amount: line.net_amount,
                source_order_id: line.source_order_id
            }));

            const { error: linesError } = await supabase
                .from('finpro_batch_lines')
                .insert(lines);

            if (linesError) {
                console.error('[FinProAggregation] Error saving batch lines:', linesError);
                throw linesError;
            }
        }

        console.log(`[FinProAggregation] Saved ${batches.length} batches to database`);
        return true;
    },

    /**
     * Get batches for a date
     */
    getBatchesByDate: async (date: string): Promise<FinProBatch[]> => {
        const { data: batches, error } = await supabase
            .from('finpro_batches')
            .select(`
                *,
                lines:finpro_batch_lines(*)
            `)
            .eq('batch_date', date)
            .order('batch_number', { ascending: true });

        if (error) throw error;

        return (batches || []).map(b => ({
            id: b.id,
            batch_date: b.batch_date,
            batch_number: b.batch_number,
            batch_type: b.batch_type,
            total_gross: b.total_gross,
            total_discount: b.total_discount,
            total_net: b.total_net,
            payment_cash: b.payment_cash,
            payment_qr: b.payment_qr,
            payment_cheque: b.payment_cheque,
            payment_credit: b.payment_credit,
            customer_id: b.customer_id,
            customer_name: b.customer_name,
            customer_pan: b.customer_pan,
            source_order_ids: b.source_order_ids,
            source_trip_ids: b.source_trip_ids,
            lines: b.lines
        }));
    },

    /**
     * Export batches in FinPro-compatible format
     */
    exportForFinPro: async (date: string): Promise<FinProExport> => {
        const batches = await FinProAggregationService.getBatchesByDate(date);

        const invoices: FinProExportInvoice[] = batches.map(batch => ({
            type: batch.batch_type,
            customer_name: batch.customer_name,
            customer_pan: batch.customer_pan,
            total: batch.total_net,
            payment: {
                cash: batch.payment_cash || undefined,
                qr: batch.payment_qr || undefined,
                cheque: batch.payment_cheque || undefined,
                credit: batch.payment_credit || undefined
            },
            lines: batch.lines.map(line => ({
                sku: line.product_sku || line.product_id,
                product_name: line.product_name,
                qty: line.qty,
                rate: line.rate,
                amount: line.net_amount
            }))
        }));

        return {
            date,
            generated_at: new Date().toISOString(),
            invoices
        };
    },

    /**
     * Mark batches as exported (after FinPro import)
     */
    markAsExported: async (batchIds: string[], finproReference?: string): Promise<boolean> => {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        const { error } = await supabase
            .from('finpro_batches')
            .update({
                exported_at: new Date().toISOString(),
                exported_by: userId,
                finpro_reference: finproReference
            })
            .in('id', batchIds);

        if (error) {
            console.error('[FinProAggregation] Error marking as exported:', error);
            throw error;
        }

        return true;
    },

    /**
     * Delete batches for a date (only if not exported)
     * Use for regeneration
     */
    deleteBatchesForDate: async (date: string): Promise<boolean> => {
        // First check if any are exported
        const { data: exported } = await supabase
            .from('finpro_batches')
            .select('id')
            .eq('batch_date', date)
            .not('exported_at', 'is', null);

        if (exported && exported.length > 0) {
            throw new Error(`Cannot delete: ${exported.length} batches have been exported`);
        }

        // Delete (cascade will handle lines)
        const { error } = await supabase
            .from('finpro_batches')
            .delete()
            .eq('batch_date', date);

        if (error) throw error;
        return true;
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

interface ClassifiedOrder {
    id: string;
    customerId: string;
    customerName: string;
    customerPan?: string;
    tripId: string;
    totalAmount: number;
    discount: number;
    netAmount: number;
    paymentMethod: string;
    paymentBreakdown: {
        cash: number;
        qr: number;
        cheque: number;
        credit: number;
    };
    items: any[];
    batchType: BatchType;
}

async function getClosedTripsForDate(date: string, specificTripIds?: string[]): Promise<string[]> {
    let query = supabase
        .from('trip_closures')
        .select('trip_id')
        .gte('closed_at', date)
        .lt('closed_at', date + 'T23:59:59.999Z');

    if (specificTripIds && specificTripIds.length > 0) {
        query = query.in('trip_id', specificTripIds);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(d => d.trip_id);
}

async function getDeliveredOrdersForTrips(tripIds: string[]): Promise<any[]> {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            id,
            customerId,
            customerName,
            customerPAN,
            assignedTripId,
            totalAmount,
            discount,
            payment_collected,
            payment_method_at_delivery,
            remarks,
            items
        `)
        .in('assignedTripId', tripIds)
        .in('status', ['delivered', 'completed']);

    if (error) throw error;
    return data || [];
}

function classifyOrders(orders: any[]): { individual: ClassifiedOrder[]; mergeable: ClassifiedOrder[] } {
    const individual: ClassifiedOrder[] = [];
    const mergeable: ClassifiedOrder[] = [];

    for (const order of orders) {
        const classified = classifyOrder(order);

        if (classified.batchType === 'MERGED_CASH_QR') {
            mergeable.push(classified);
        } else {
            individual.push(classified);
        }
    }

    return { individual, mergeable };
}

function classifyOrder(order: any): ClassifiedOrder {
    const discount = Number(order.discount) || 0;
    const netAmount = Number(order.totalAmount) || 0;
    const totalAmount = netAmount + discount;
    const collected = Number(order.payment_collected) ?? netAmount;

    // Parse payment breakdown from remarks
    const paymentBreakdown = parsePaymentBreakdown(order.remarks, order.payment_method_at_delivery, collected, netAmount);

    // Determine batch type based on rules
    let batchType: BatchType = 'MERGED_CASH_QR'; // Default to mergeable

    // Rule 1: PAN provided → Individual
    if (order.customerPAN && order.customerPAN.trim()) {
        batchType = 'INDIVIDUAL_PAN';
    }
    // Rule 2: Cheque payment → Individual
    else if (paymentBreakdown.cheque > 0) {
        batchType = 'INDIVIDUAL_CHEQUE';
    }
    // Rule 3: Credit (unpaid amount) → Individual
    else if (paymentBreakdown.credit > 0) {
        batchType = 'INDIVIDUAL_CREDIT';
    }
    // Rule 4: Mixed payment (multiple types) → Individual
    else if (countPaymentMethods(paymentBreakdown) > 1) {
        batchType = 'INDIVIDUAL_MIXED';
    }
    // Rule 5: Cash/QR > 50k → Individual
    else if ((paymentBreakdown.cash + paymentBreakdown.qr) > MERGE_THRESHOLD) {
        batchType = 'INDIVIDUAL_OVER_50K';
    }
    // Rule 6: Small Cash/QR → Mergeable
    // (already set as default)

    // Parse items
    let items = order.items;
    if (typeof items === 'string') {
        try {
            items = JSON.parse(items);
        } catch (e) {
            items = [];
        }
    }

    return {
        id: order.id,
        customerId: order.customerId,
        customerName: order.customerName,
        customerPan: order.customerPAN,
        tripId: order.assignedTripId,
        totalAmount,
        discount,
        netAmount,
        paymentMethod: order.payment_method_at_delivery || 'cash',
        paymentBreakdown,
        items: items || [],
        batchType
    };
}

function parsePaymentBreakdown(
    remarks: string | null,
    method: string | null,
    collected: number,
    netAmount: number
): { cash: number; qr: number; cheque: number; credit: number } {
    const breakdown = { cash: 0, qr: 0, cheque: 0, credit: 0 };

    // Calculate credit (unpaid amount)
    breakdown.credit = Math.max(0, netAmount - collected);

    if (!remarks || !remarks.includes('Payments:')) {
        // Simple case: single payment method
        const m = (method || 'cash').toLowerCase();
        if (m === 'cash') breakdown.cash = collected;
        else if (m === 'qr') breakdown.qr = collected;
        else if (m === 'cheque') breakdown.cheque = collected;
        else breakdown.cash = collected; // fallback
        return breakdown;
    }

    // Parse multiple payments from remarks
    const match = remarks.match(/Payments:\s*([^|]+)/);
    if (match) {
        const regex = /(\w+):\s*₹?([\d,.]+)/g;
        let m;
        while ((m = regex.exec(match[1])) !== null) {
            const type = m[1].toLowerCase();
            const amount = parseFloat(m[2].replace(',', ''));

            if (type === 'cash') breakdown.cash += amount;
            else if (type === 'qr') breakdown.qr += amount;
            else if (type === 'cheque') breakdown.cheque += amount;
        }
    }

    return breakdown;
}

function countPaymentMethods(breakdown: { cash: number; qr: number; cheque: number; credit: number }): number {
    let count = 0;
    if (breakdown.cash > 0) count++;
    if (breakdown.qr > 0) count++;
    if (breakdown.cheque > 0) count++;
    // Credit doesn't count as a "payment method" for mixing rules
    return count;
}

function createBatchFromOrder(order: ClassifiedOrder, batchNumber: number, date: string): FinProBatch {
    const lines: FinProBatchLine[] = [];

    for (const item of order.items) {
        const qty = Number(item.qty || item.quantity) || 0;
        const rate = Number(item.rate || item.price) || 0;
        const gross = qty * rate;

        // Pro-rate discount
        const itemDiscount = order.totalAmount > 0
            ? (gross / order.totalAmount) * order.discount
            : 0;

        lines.push({
            product_id: item.productId || item.product_id || '',
            product_name: item.productName || item.tempProductName || 'Unknown',
            product_sku: item.sku,
            company_name: item.companyName,
            qty,
            rate,
            gross_amount: gross,
            discount_amount: itemDiscount,
            net_amount: gross - itemDiscount,
            source_order_id: order.id
        });
    }

    return {
        batch_date: date,
        batch_number: batchNumber,
        batch_type: order.batchType,
        total_gross: order.totalAmount,
        total_discount: order.discount,
        total_net: order.netAmount,
        payment_cash: order.paymentBreakdown.cash,
        payment_qr: order.paymentBreakdown.qr,
        payment_cheque: order.paymentBreakdown.cheque,
        payment_credit: order.paymentBreakdown.credit,
        customer_id: order.customerId,
        customer_name: order.customerName,
        customer_pan: order.customerPan,
        source_order_ids: [order.id],
        source_trip_ids: [order.tripId],
        lines
    };
}

function createMergedBatches(
    orders: ClassifiedOrder[],
    startBatchNumber: number,
    date: string,
    tripIds: string[]
): FinProBatch[] {
    if (orders.length === 0) return [];

    const batches: FinProBatch[] = [];
    let currentBatch: FinProBatch | null = null;
    let batchNumber = startBatchNumber;

    // Sort by amount for better batching
    orders.sort((a, b) => a.netAmount - b.netAmount);

    for (const order of orders) {
        // Check if we need to start a new batch
        if (!currentBatch || (currentBatch.total_net + order.netAmount) > MERGE_THRESHOLD) {
            // Flush current batch
            if (currentBatch && currentBatch.source_order_ids.length > 0) {
                batches.push(currentBatch);
            }

            // Start new batch
            currentBatch = {
                batch_date: date,
                batch_number: batchNumber++,
                batch_type: 'MERGED_CASH_QR',
                total_gross: 0,
                total_discount: 0,
                total_net: 0,
                payment_cash: 0,
                payment_qr: 0,
                payment_cheque: 0,
                payment_credit: 0,
                customer_name: 'Multiple Customers',
                source_order_ids: [],
                source_trip_ids: [...new Set(tripIds)],
                lines: []
            };
        }

        // Add order to current batch
        currentBatch.total_gross += order.totalAmount;
        currentBatch.total_discount += order.discount;
        currentBatch.total_net += order.netAmount;
        currentBatch.payment_cash += order.paymentBreakdown.cash;
        currentBatch.payment_qr += order.paymentBreakdown.qr;
        currentBatch.source_order_ids.push(order.id);

        // Merge line items
        for (const item of order.items) {
            const qty = Number(item.qty || item.quantity) || 0;
            const rate = Number(item.rate || item.price) || 0;
            const gross = qty * rate;
            const itemDiscount = order.totalAmount > 0
                ? (gross / order.totalAmount) * order.discount
                : 0;

            // Try to merge with existing line
            const existingLine = currentBatch.lines.find(
                l => l.product_id === (item.productId || item.product_id) &&
                    Math.abs(l.rate - rate) < 0.01
            );

            if (existingLine) {
                existingLine.qty += qty;
                existingLine.gross_amount += gross;
                existingLine.discount_amount += itemDiscount;
                existingLine.net_amount += (gross - itemDiscount);
            } else {
                currentBatch.lines.push({
                    product_id: item.productId || item.product_id || '',
                    product_name: item.productName || item.tempProductName || 'Unknown',
                    product_sku: item.sku,
                    company_name: item.companyName,
                    qty,
                    rate,
                    gross_amount: gross,
                    discount_amount: itemDiscount,
                    net_amount: gross - itemDiscount,
                    source_order_id: order.id
                });
            }
        }
    }

    // Flush last batch
    if (currentBatch && currentBatch.source_order_ids.length > 0) {
        batches.push(currentBatch);
    }

    return batches;
}

function calculateSummary(batches: FinProBatch[]): GenerateBatchesResult['summary'] {
    const individualBatches = batches.filter(b => b.batch_type !== 'MERGED_CASH_QR').length;
    const mergedBatches = batches.filter(b => b.batch_type === 'MERGED_CASH_QR').length;

    return {
        totalBatches: batches.length,
        individualBatches,
        mergedBatches,
        totalGross: batches.reduce((sum, b) => sum + b.total_gross, 0),
        totalNet: batches.reduce((sum, b) => sum + b.total_net, 0),
        totalCash: batches.reduce((sum, b) => sum + b.payment_cash, 0),
        totalQr: batches.reduce((sum, b) => sum + b.payment_qr, 0),
        totalCheque: batches.reduce((sum, b) => sum + b.payment_cheque, 0),
        totalCredit: batches.reduce((sum, b) => sum + b.payment_credit, 0)
    };
}

function emptySummary(): GenerateBatchesResult['summary'] {
    return {
        totalBatches: 0,
        individualBatches: 0,
        mergedBatches: 0,
        totalGross: 0,
        totalNet: 0,
        totalCash: 0,
        totalQr: 0,
        totalCheque: 0,
        totalCredit: 0
    };
}

export default FinProAggregationService;
