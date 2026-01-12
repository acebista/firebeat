/**
 * Trip Closure Service
 * 
 * Handles the formal closure of delivery trips:
 * - Validates stock reconciliation
 * - Calculates financial totals
 * - Creates immutable closure record
 * - Locks trip from further edits
 * 
 * Once closed, orders and payments on this trip cannot be modified.
 */

import { supabase } from '../../lib/supabase';
import { TripStockService, TripClosure, StockReconciliationRow } from './TripStockService';
import { PaymentsService } from '../ledger/PaymentsService';

// ============================================================================
// TYPES
// ============================================================================

export interface CloseTripInput {
    tripId: string;
    forceClose?: boolean;              // Allow closing with variance (admin only)
    varianceApprovalReason?: string;   // Required if forceClose with variance
}

export interface CloseTripResult {
    success: boolean;
    closure?: TripClosure;
    reconciliation: StockReconciliationRow[];
    hasVariance: boolean;
    varianceProducts: string[];
    financials: {
        totalGross: number;
        totalNet: number;
        totalCollected: number;
        totalCredit: number;
        orderBreakdown: {
            total: number;
            delivered: number;
            failed: number;
            rescheduled: number;
        };
    };
    error?: string;
}

// ============================================================================
// TRIP CLOSURE SERVICE
// ============================================================================

export const TripClosureService = {
    /**
     * Close a trip
     * This is the critical function that transitions a trip from operational to closed
     */
    closeTrip: async (input: CloseTripInput): Promise<CloseTripResult> => {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
            return {
                success: false,
                reconciliation: [],
                hasVariance: false,
                varianceProducts: [],
                financials: emptyFinancials(),
                error: 'Not authenticated'
            };
        }

        // 1. Check if already closed
        const existingClosure = await TripStockService.getTripClosure(input.tripId);
        if (existingClosure) {
            return {
                success: false,
                closure: existingClosure,
                reconciliation: [],
                hasVariance: false,
                varianceProducts: [],
                financials: emptyFinancials(),
                error: 'Trip is already closed'
            };
        }

        // 2. Get stock reconciliation
        const reconciliation = await TripStockService.getStockReconciliation(input.tripId);
        const varianceProducts = reconciliation
            .filter(r => r.variance !== 0)
            .map(r => r.product_name);
        const hasVariance = varianceProducts.length > 0;

        // 3. If variance exists and not force-closing, block
        if (hasVariance && !input.forceClose) {
            return {
                success: false,
                reconciliation,
                hasVariance: true,
                varianceProducts,
                financials: await calculateFinancials(input.tripId),
                error: `Stock variance detected in ${varianceProducts.length} products. Use forceClose to override.`
            };
        }

        // 4. If force-closing with variance, require approval reason
        if (hasVariance && input.forceClose && !input.varianceApprovalReason) {
            return {
                success: false,
                reconciliation,
                hasVariance: true,
                varianceProducts,
                financials: await calculateFinancials(input.tripId),
                error: 'Variance approval reason is required for force close'
            };
        }

        // 5. Calculate financials
        const financials = await calculateFinancials(input.tripId);

        // 6. Create closure record
        const closureData: Partial<TripClosure> = {
            trip_id: input.tripId,
            closed_at: new Date().toISOString(),
            closed_by: userId,
            total_orders: financials.orderBreakdown.total,
            total_delivered: financials.orderBreakdown.delivered,
            total_failed: financials.orderBreakdown.failed,
            total_rescheduled: financials.orderBreakdown.rescheduled,
            total_gross_value: financials.totalGross,
            total_net_value: financials.totalNet,
            total_collected: financials.totalCollected,
            total_credit: financials.totalCredit,
            stock_variance_count: varianceProducts.length,
            stock_reconciled: !hasVariance
        };

        if (hasVariance && input.forceClose) {
            closureData.variance_approved_by = userId;
            closureData.variance_approved_at = new Date().toISOString();
            closureData.variance_approval_reason = input.varianceApprovalReason;
        }

        const { data: closure, error } = await supabase
            .from('trip_closures')
            .insert(closureData)
            .select()
            .single();

        if (error) {
            console.error('[TripClosureService] Error creating closure:', error);
            return {
                success: false,
                reconciliation,
                hasVariance,
                varianceProducts,
                financials,
                error: `Failed to create closure: ${error.message}`
            };
        }

        // 7. Update trip status to 'completed'
        await supabase
            .from('trips')
            .update({ status: 'completed' })
            .eq('id', input.tripId);

        console.log(`[TripClosureService] Trip ${input.tripId} closed successfully`);

        return {
            success: true,
            closure: closure as TripClosure,
            reconciliation,
            hasVariance,
            varianceProducts,
            financials
        };
    },

    /**
     * Preview closure without actually closing
     * Use this for the UI to show what will happen
     */
    previewClosure: async (tripId: string): Promise<CloseTripResult> => {
        const isClosed = await TripStockService.isTripClosed(tripId);
        if (isClosed) {
            const closure = await TripStockService.getTripClosure(tripId);
            return {
                success: true,
                closure: closure!,
                reconciliation: [],
                hasVariance: false,
                varianceProducts: [],
                financials: emptyFinancials(),
                error: 'Trip is already closed'
            };
        }

        const reconciliation = await TripStockService.getStockReconciliation(tripId);
        const varianceProducts = reconciliation
            .filter(r => r.variance !== 0)
            .map(r => r.product_name);
        const financials = await calculateFinancials(tripId);

        return {
            success: false, // Not actually closed
            reconciliation,
            hasVariance: varianceProducts.length > 0,
            varianceProducts,
            financials
        };
    },

    /**
     * Get all closures for a date range
     */
    getClosuresByDateRange: async (startDate: string, endDate: string): Promise<TripClosure[]> => {
        const { data, error } = await supabase
            .from('trip_closures')
            .select('*')
            .gte('closed_at', startDate)
            .lte('closed_at', endDate + 'T23:59:59.999Z')
            .order('closed_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get trips ready for closure (completed status, not yet closed)
     */
    getTripsReadyForClosure: async (): Promise<string[]> => {
        // Get all trips that are 'completed' or 'out_for_delivery' for today
        const today = new Date().toISOString().split('T')[0];

        const { data: trips, error } = await supabase
            .from('trips')
            .select('id')
            .lte('deliveryDate', today)
            .in('status', ['completed', 'out_for_delivery']);

        if (error) throw error;

        // Filter out already closed trips
        const tripIds = (trips || []).map(t => t.id);

        if (tripIds.length === 0) return [];

        const { data: closures } = await supabase
            .from('trip_closures')
            .select('trip_id')
            .in('trip_id', tripIds);

        const closedTripIds = new Set((closures || []).map(c => c.trip_id));

        return tripIds.filter(id => !closedTripIds.has(id));
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function calculateFinancials(tripId: string): Promise<CloseTripResult['financials']> {
    // Get all orders for this trip
    const { data: orders, error } = await supabase
        .from('orders')
        .select('id, status, totalAmount, discount, payment_collected')
        .eq('assignedTripId', tripId);

    if (error) throw error;

    const orderList = orders || [];

    // Calculate order breakdown
    const total = orderList.length;
    const delivered = orderList.filter(o =>
        o.status === 'delivered' || o.status === 'completed'
    ).length;
    const failed = orderList.filter(o =>
        o.status === 'cancelled'
    ).length;
    const rescheduled = orderList.filter(o =>
        o.status === 'approved' // Rescheduled orders go back to approved
    ).length;

    // Calculate financials
    const deliveredOrders = orderList.filter(o =>
        o.status === 'delivered' || o.status === 'completed'
    );

    let totalGross = 0;
    let totalNet = 0;
    let totalCollected = 0;

    for (const order of deliveredOrders) {
        const discount = Number(order.discount) || 0;
        const net = Number(order.totalAmount) || 0;
        const collected = Number(order.payment_collected) ?? net;

        totalGross += net + discount;
        totalNet += net;
        totalCollected += collected;
    }

    const totalCredit = Math.max(0, totalNet - totalCollected);

    return {
        totalGross,
        totalNet,
        totalCollected,
        totalCredit,
        orderBreakdown: {
            total,
            delivered,
            failed,
            rescheduled
        }
    };
}

function emptyFinancials(): CloseTripResult['financials'] {
    return {
        totalGross: 0,
        totalNet: 0,
        totalCollected: 0,
        totalCredit: 0,
        orderBreakdown: {
            total: 0,
            delivered: 0,
            failed: 0,
            rescheduled: 0
        }
    };
}

export default TripClosureService;
