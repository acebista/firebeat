/**
 * Trip Stock Ledger Service
 * 
 * Manages the physical stock lifecycle for delivery trips:
 * - Loading: Record what goes on the truck
 * - Unloading: Record what comes back (unsold + damaged)
 * - Reconciliation: Verify Load = Delivered + Unsold + Damaged
 * 
 * This is the foundation of inventory-to-invoice integrity.
 */

import { supabase } from '../../lib/supabase';
import { Order } from '../../types';

// ============================================================================
// TYPES
// ============================================================================

export interface TripLoad {
    id: string;
    trip_id: string;
    product_id: string;
    qty_loaded: number;
    loaded_by: string | null;
    loaded_at: string;
}

export interface TripUnload {
    id: string;
    trip_id: string;
    product_id: string;
    qty_unsold: number;
    qty_damaged: number;
    damage_reason: string | null;
    recorded_by: string | null;
    recorded_at: string;
}

export interface TripClosure {
    id: string;
    trip_id: string;
    closed_at: string;
    closed_by: string;
    total_orders: number;
    total_delivered: number;
    total_failed: number;
    total_rescheduled: number;
    total_gross_value: number;
    total_net_value: number;
    total_collected: number;
    total_credit: number;
    stock_variance_count: number;
    stock_reconciled: boolean;
    variance_approved_by: string | null;
    variance_approved_at: string | null;
    variance_approval_reason: string | null;
}

export interface StockReconciliationRow {
    product_id: string;
    product_name: string;
    qty_loaded: number;
    qty_gross_delivered: number; // Gross units sold (delivered status)
    qty_truck_returned: number;  // Physical unsold coming back = Loaded - Gross Sold
    qty_truck_damaged: number;   // From trip_unloads.qty_damaged
    qty_net_delivered: number;   // Billed units (Gross - Returns) -> for VAT
    qty_returned: number;        // Customer returns pickup (reference only)
    qty_damaged: number;         // Customer damage pickup (reference only)
    expected_unload: number;     // truckReturned + truckDamaged
    actual_unsold: number;
    actual_damaged: number;
    variance: number;
}

export interface LoadTruckInput {
    trip_id: string;
    items: Array<{
        product_id: string;
        qty: number;
    }>;
}

export interface UnloadTruckInput {
    trip_id: string;
    items: Array<{
        product_id: string;
        qty_unsold: number;
        qty_damaged: number;
        damage_reason?: string;
    }>;
}

// ============================================================================
// TRIP STOCK SERVICE
// ============================================================================

export const TripStockService = {
    /**
     * Load truck with products
     * Called when trip transitions to 'out_for_delivery'
     */
    loadTruck: async (input: LoadTruckInput): Promise<TripLoad[]> => {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        // Check if trip is already closed
        const { data: closure } = await supabase
            .from('trip_closures')
            .select('id')
            .eq('trip_id', input.trip_id)
            .single();

        if (closure) {
            throw new Error('Cannot load truck: Trip is already closed');
        }

        // Upsert loads (allows updating if mistake during loading)
        const loads = input.items.map(item => ({
            trip_id: input.trip_id,
            product_id: item.product_id,
            qty_loaded: item.qty,
            loaded_by: userId,
            loaded_at: new Date().toISOString()
        }));

        const { data, error } = await supabase
            .from('trip_loads')
            .upsert(loads, { onConflict: 'trip_id,product_id' })
            .select();

        if (error) {
            console.error('[TripStockService] Error loading truck:', error);
            throw error;
        }

        console.log(`[TripStockService] Loaded ${loads.length} products onto trip ${input.trip_id}`);
        return data;
    },

    /**
     * Record unloaded items when trip returns
     * Called before trip closure
     */
    unloadTruck: async (input: UnloadTruckInput): Promise<TripUnload[]> => {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        // Check if trip is already closed
        const { data: closure } = await supabase
            .from('trip_closures')
            .select('id')
            .eq('trip_id', input.trip_id)
            .single();

        if (closure) {
            throw new Error('Cannot unload truck: Trip is already closed');
        }

        const unloads = input.items.map(item => ({
            trip_id: input.trip_id,
            product_id: item.product_id,
            qty_unsold: item.qty_unsold,
            qty_damaged: item.qty_damaged,
            damage_reason: item.damage_reason || null,
            recorded_by: userId,
            recorded_at: new Date().toISOString()
        }));

        const { data, error } = await supabase
            .from('trip_unloads')
            .upsert(unloads, { onConflict: 'trip_id,product_id' })
            .select();

        if (error) {
            console.error('[TripStockService] Error unloading truck:', error);
            throw error;
        }

        console.log(`[TripStockService] Recorded ${unloads.length} unload items for trip ${input.trip_id}`);
        return data;
    },

    /**
     * Get all loads for a trip
     */
    getTripLoads: async (tripId: string): Promise<TripLoad[]> => {
        const { data, error } = await supabase
            .from('trip_loads')
            .select('*')
            .eq('trip_id', tripId);

        if (error) throw error;
        return data || [];
    },

    /**
     * Get all unloads for a trip
     */
    getTripUnloads: async (tripId: string): Promise<TripUnload[]> => {
        const { data, error } = await supabase
            .from('trip_unloads')
            .select('*')
            .eq('trip_id', tripId);

        if (error) throw error;
        return data || [];
    },

    /**
     * Internal helper to fetch all orders associated with a trip, 
     * even if assignedTripId was cleared (e.g. for rescheduled orders).
     */
    getOrdersForTrip: async (tripId: string): Promise<Order[]> => {
        // 1. Get trip to get orderIds array (source of truth for what went on the truck)
        const { data: trip } = await supabase.from('trips').select('orderIds').eq('id', tripId).single();

        // 2. Fetch orders actually assigned to this trip currently
        const { data: assignedOrders } = await supabase.from('orders').select('*').eq('assignedTripId', tripId);

        const orders: Order[] = assignedOrders || [];

        if (trip?.orderIds && trip.orderIds.length > 0) {
            const existingIds = new Set(orders.map(o => o.id));
            const missingIds = trip.orderIds.filter((id: string) => !existingIds.has(id));

            if (missingIds.length > 0) {
                const { data: missingOrders } = await supabase.from('orders').select('*').in('id', missingIds);
                if (missingOrders) {
                    orders.push(...(missingOrders as any[]));
                }
            }
        }
        return orders;
    },

    /**
     * Calculate gross delivered quantities (full order qty, no returns subtracted)
     * Used for physical stock reconciliation
     */
    calculateGrossDeliveredQuantities: async (tripId: string): Promise<Map<string, number>> => {
        const orders = await TripStockService.getOrdersForTrip(tripId);
        const deliveredOrders = orders.filter(o => ['delivered', 'completed'].includes(o.status));

        const grossMap = new Map<string, number>();

        for (const order of deliveredOrders) {
            let items = order.items;
            if (typeof items === 'string') {
                try { items = JSON.parse(items); } catch (e) { continue; }
            }
            if (!Array.isArray(items)) continue;

            for (const item of items) {
                const productId = (item as any).productId || (item as any).product_id;
                const qty = Number((item as any).qty || (item as any).quantity) || 0;
                if (productId && qty > 0) {
                    const current = grossMap.get(productId) || 0;
                    grossMap.set(productId, current + qty);
                }
            }
        }
        return grossMap;
    },

    /**
     * Calculate net delivered quantities (order qty - returns)
     * Used for VAT billing/FinPro
     */
    calculateNetDeliveredQuantities: async (tripId: string): Promise<Map<string, number>> => {
        // Get all delivered orders for this trip
        const orders = await TripStockService.getOrdersForTrip(tripId);
        const deliveredOrders = orders.filter(o => ['delivered', 'completed'].includes(o.status));

        const deliveredQty = new Map<string, number>();

        for (const order of deliveredOrders) {
            // Parse items
            let items = order.items as any;
            if (typeof items === 'string') {
                try {
                    items = JSON.parse(items);
                } catch (e) {
                    console.error('[TripStockService] Failed to parse items for order:', order.id);
                    continue;
                }
            }

            if (!Array.isArray(items)) continue;

            // Parse returns from remarks to subtract
            const returnMap = parseReturnsFromRemarks(order.remarks || '');

            for (const item of items) {
                const productId = item.productId || item.product_id;
                const orderQty = Number(item.qty || item.quantity) || 0;
                const productName = (item.productName || item.tempProductName || '').trim();

                // Subtract returns
                const returnQty = returnMap.get(productName.toLowerCase()) || 0;
                const netDelivered = Math.max(0, orderQty - returnQty);

                if (productId && netDelivered > 0) {
                    const current = deliveredQty.get(productId) || 0;
                    deliveredQty.set(productId, current + netDelivered);
                }
            }
        }

        return deliveredQty;
    },

    /**
     * Get stock reconciliation for a trip
     * Auto-calculates what should be in the van at EOD from all data sources
     * 
     * FALLBACK: If trip_loads is empty, we derive loaded quantities from order items
     * This ensures retroactive compatibility for trips without explicit load records.
     */
    getStockReconciliation: async (tripId: string): Promise<StockReconciliationRow[]> => {
        // Get loads from trip_loads table
        const loads = await TripStockService.getTripLoads(tripId);
        let loadMap = new Map<string, number>();
        loads.forEach(l => loadMap.set(l.product_id, l.qty_loaded));

        // FALLBACK: If no loads recorded, derive from all orders assigned to this trip
        if (loads.length === 0) {
            console.log(`[TripStockService] No trip_loads for ${tripId}, deriving from orders...`);

            // Use our helper to get ALL orders ever associated with this trip
            const allOrders = await TripStockService.getOrdersForTrip(tripId);

            if (allOrders.length > 0) {
                for (const order of allOrders) {
                    let items = order.items as any;
                    if (typeof items === 'string') {
                        try { items = JSON.parse(items); } catch (e) { continue; }
                    }
                    if (!Array.isArray(items)) continue;

                    for (const item of items) {
                        const productId = item.productId || item.product_id;
                        const qty = Number(item.qty || item.quantity) || 0;
                        if (productId && qty > 0) {
                            const current = loadMap.get(productId) || 0;
                            loadMap.set(productId, current + qty);
                        }
                    }
                }
                console.log(`[TripStockService] Derived ${loadMap.size} products from ${allOrders.length} orders`);
            }
        }

        // Get manual unloads (if entered)
        const unloads = await TripStockService.getTripUnloads(tripId);
        const unloadMap = new Map<string, { unsold: number; damaged: number }>();
        unloads.forEach(u => unloadMap.set(u.product_id, {
            unsold: u.qty_unsold,
            damaged: u.qty_damaged
        }));

        // Get gross & net delivered quantities
        const grossDeliveredMap = await TripStockService.calculateGrossDeliveredQuantities(tripId);
        const netDeliveredMap = await TripStockService.calculateNetDeliveredQuantities(tripId);

        // Get returns/damages from all sources (pickup context)
        const returnsMap = await TripStockService.calculateReturnsFromAllSources(tripId);
        const damagesMap = await TripStockService.calculateDamagesFromAllSources(tripId);

        // Get product names
        const productIds = new Set([
            ...loadMap.keys(),
            ...unloadMap.keys(),
            ...grossDeliveredMap.keys(),
            ...netDeliveredMap.keys(),
            ...returnsMap.keys(),
            ...damagesMap.keys()
        ]);

        const { data: products } = await supabase
            .from('products')
            .select('id, name')
            .in('id', Array.from(productIds));

        const productNameMap = new Map<string, string>();
        (products || []).forEach(p => productNameMap.set(p.id, p.name));

        // Build reconciliation rows
        const rows: StockReconciliationRow[] = [];

        for (const productId of productIds) {
            const loaded = loadMap.get(productId) || 0;
            const grossDelivered = grossDeliveredMap.get(productId) || 0;
            const netDelivered = netDeliveredMap.get(productId) || 0;
            const returnedPickup = returnsMap.get(productId) || 0;
            const damagedPickup = damagesMap.get(productId) || 0;
            const unload = unloadMap.get(productId) || { unsold: 0, damaged: 0 };

            /**
             * PHYSICAL RECONCILIATION LOGIC (Truck Reality)
             * 
             * 1. Total items that should be back in the van = Loaded - Net Delivered
             *    (Net Delivered = Sold - Returns, so this gives Unsold + Returned)
             */
            const totalItemsBack = Math.max(0, loaded - netDelivered);

            /**
             * 2. Truck Damaged: Items physically recorded as damaged in trip_unloads
             */
            const truckDamaged = unload.damaged;

            /**
             * 3. Truck Returned (Good): The non-damaged portion of totalItemsBack
             */
            const truckReturnedGood = Math.max(0, totalItemsBack - truckDamaged);

            /**
             * 4. Expected Unload: Total physical items (Good + Damaged)
             *    expected_unload = totalItemsBack
             */
            const expected_unload = totalItemsBack;

            // Actual unload = what was physically counted (manual entry)
            const actual_unload = unload.unsold + unload.damaged;

            // Variance = discrepancy between expected and actual
            const variance = expected_unload - actual_unload;

            rows.push({
                product_id: productId,
                product_name: productNameMap.get(productId) || 'Unknown',
                qty_loaded: loaded,
                qty_gross_delivered: grossDelivered,
                qty_truck_returned: unload.unsold,   // Actual physical unsold count (from driver)
                qty_truck_damaged: unload.damaged,   // Actual physical damaged count (from driver)
                qty_net_delivered: netDelivered,
                qty_returned: returnedPickup,
                qty_damaged: damagedPickup,
                expected_unload,
                actual_unsold: unload.unsold,
                actual_damaged: unload.damaged,
                variance
            });
        }

        // Sort by variance first (mismatches), then by expected unload
        rows.sort((a, b) => {
            if (a.variance !== 0 && b.variance === 0) return -1;
            if (a.variance === 0 && b.variance !== 0) return 1;
            return b.expected_unload - a.expected_unload;
        });

        return rows;
    },

    /**
     * Calculate returns from all sources
     * Aggregates: order remarks, sales_returns table
     */
    calculateReturnsFromAllSources: async (tripId: string): Promise<Map<string, number>> => {
        const returnsMap = new Map<string, number>();

        // 1. Get returns from order remarks
        const orders = await TripStockService.getOrdersForTrip(tripId);
        const deliveredOrders = orders.filter(o => ['delivered', 'completed'].includes(o.status));

        for (const order of deliveredOrders) {
            const remarkReturns = parseReturnsFromRemarks(order.remarks || '');

            // Map product names back to IDs
            let items = order.items as any;
            if (typeof items === 'string') try { items = JSON.parse(items); } catch (e) { items = []; }

            for (const item of Array.isArray(items) ? items : []) {
                const name = (item.productName || item.tempProductName || '').trim().toLowerCase();
                const productId = item.productId || item.product_id;
                if (remarkReturns.has(name) && productId) {
                    const qty = remarkReturns.get(name) || 0;
                    const current = returnsMap.get(productId) || 0;
                    returnsMap.set(productId, current + qty);
                    remarkReturns.delete(name); // Don't count twice if same name appears
                }
            }
        }

        // 2. Get returns from returns and return_items table
        const orderIds = orders?.map(o => o.id) || [];
        if (orderIds.length > 0) {
            const { data: returnsData } = await supabase
                .from('returns')
                .select('id')
                .in('invoiceId', orderIds);

            const returnIds = returnsData?.map(r => r.id) || [];

            if (returnIds.length > 0) {
                const { data: returnItems } = await supabase
                    .from('return_items')
                    .select('productId, qtyReturnedGood')
                    .in('salesReturnId', returnIds);

                for (const item of returnItems || []) {
                    const productId = item.productId;
                    const qty = Number(item.qtyReturnedGood) || 0;

                    if (productId && qty > 0) {
                        const current = returnsMap.get(productId) || 0;
                        returnsMap.set(productId, current + qty);
                    }
                }
            }
        }

        return returnsMap;
    },

    /**
     * Calculate damages from all sources
     * Aggregates: order remarks, damaged_goods_log
     */
    calculateDamagesFromAllSources: async (tripId: string): Promise<Map<string, number>> => {
        const damagesMap = new Map<string, number>();

        // 1. Get damages from order remarks
        const orders = await TripStockService.getOrdersForTrip(tripId);
        const deliveredOrders = orders.filter(o => ['delivered', 'completed'].includes(o.status));

        for (const order of deliveredOrders) {
            const remarkDamages = parseDamagesFromRemarks(order.remarks || '');

            // Map product names back to IDs
            let items = order.items as any;
            if (typeof items === 'string') try { items = JSON.parse(items); } catch (e) { items = []; }

            for (const item of Array.isArray(items) ? items : []) {
                const name = (item.productName || item.tempProductName || '').trim().toLowerCase();
                const productId = item.productId || item.product_id;
                if (remarkDamages.has(name) && productId) {
                    const qty = remarkDamages.get(name) || 0;
                    const current = damagesMap.get(productId) || 0;
                    damagesMap.set(productId, current + qty);
                    remarkDamages.delete(name);
                }
            }
        }

        // 2. Get damages from damage_logs
        const orderIds = orders?.map(o => o.id) || [];
        if (orderIds.length > 0) {
            const { data: damageLogs } = await supabase
                .from('damage_logs')
                .select('productId, qtyPieces')
                .in('sourceInvoiceId', orderIds);

            for (const log of damageLogs || []) {
                const current = damagesMap.get(log.productId) || 0;
                damagesMap.set(log.productId, current + (log.qtyPieces || 0));
            }
        }

        return damagesMap;
    },


    /**
     * Check if trip is closed
     */
    isTripClosed: async (tripId: string): Promise<boolean> => {
        const { data } = await supabase
            .from('trip_closures')
            .select('id')
            .eq('trip_id', tripId)
            .single();

        return !!data;
    },

    /**
     * Get trip closure details
     */
    getTripClosure: async (tripId: string): Promise<TripClosure | null> => {
        const { data, error } = await supabase
            .from('trip_closures')
            .select('*')
            .eq('trip_id', tripId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Auto-generate loads from order items
     * Aggregates all items from assigned orders
     * RESPECTS PACKING PROGRESS: Only includes items marked as loaded by delivery user
     */
    generateLoadsFromOrders: async (tripId: string): Promise<LoadTruckInput> => {
        // Get all orders assigned to this trip
        const { data: orders, error } = await supabase
            .from('orders')
            .select('id, items')
            .eq('assignedTripId', tripId);

        if (error) throw error;

        // Fetch packing progress to see which items are marked as loaded
        const { data: packingProgress } = await supabase
            .from('packing_progress')
            .select('item_id, is_done, is_oos')
            .eq('trip_id', tripId);

        // Create a set of item IDs that are marked as loaded (is_done=true AND is_oos=false)
        const loadedItemIds = new Set<string>();
        const oosItemIds = new Set<string>();
        (packingProgress || []).forEach(p => {
            if (p.is_oos) {
                oosItemIds.add(p.item_id);
            } else if (p.is_done) {
                loadedItemIds.add(p.item_id);
            }
        });

        // If no packing progress exists, default to loading ALL items (backwards compatibility)
        const hasPackingProgress = packingProgress && packingProgress.length > 0;

        const productQtyMap = new Map<string, number>();

        for (const order of orders || []) {
            let items = order.items;
            if (typeof items === 'string') {
                try {
                    items = JSON.parse(items);
                } catch (e) {
                    continue;
                }
            }

            if (!Array.isArray(items)) continue;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const itemId = `${order.id}-${i}`; // Matches packing_progress item_id format
                const productId = item.productId || item.product_id;
                const qty = Number(item.qty || item.quantity) || 0;

                // Skip if item is explicitly marked as OOS
                if (oosItemIds.has(itemId)) {
                    console.log(`[TripStock] Skipping item ${itemId} (${productId}) - Marked as OOS`);
                    continue;
                }

                // Skip if packing progress exists but this item is NOT marked as loaded
                if (hasPackingProgress && !loadedItemIds.has(itemId)) {
                    console.log(`[TripStock] Skipping item ${itemId} (${productId}) - Not loaded`);
                    continue;
                }

                if (productId && qty > 0) {
                    const current = productQtyMap.get(productId) || 0;
                    productQtyMap.set(productId, current + qty);
                }
            }
        }

        const loadItems = Array.from(productQtyMap.entries()).map(([product_id, qty]) => ({
            product_id,
            qty
        }));

        return {
            trip_id: tripId,
            items: loadItems
        };
    },

    // ============================================================================
    // TRIP CLOSURE - SERVER-SIDE RPC
    // ============================================================================

    /**
     * Close a trip - calls server-side RPC function
     * This is the ONLY way to close a trip, ensuring:
     *   1. All variances are calculated and recorded
     *   2. Trip becomes immutable
     *   3. Audit trail is created
     */
    closeTrip: async (tripId: string): Promise<{
        success: boolean;
        error?: string;
        closure_id?: string;
        total_orders?: number;
        total_delivered?: number;
        total_collected?: number;
        variance_count?: number;
        reconciled?: boolean;
    }> => {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
            return { success: false, error: 'Not authenticated' };
        }

        // Check if trip exists
        const { data: trip, error: tripError } = await supabase
            .from('trips')
            .select('id, status')
            .eq('id', tripId)
            .single();

        if (tripError || !trip) {
            return { success: false, error: 'Trip not found' };
        }

        // Check if already closed
        const existing = await TripStockService.getTripClosure(tripId);
        if (existing) {
            return { success: false, error: 'Trip is already closed' };
        }

        // Call server-side RPC function
        const { data, error } = await supabase.rpc('close_trip', {
            p_trip_id: tripId,
            p_closed_by: userId
        });

        if (error) {
            console.error('[TripStockService] Error closing trip:', error);
            return { success: false, error: error.message };
        }

        console.log(`[TripStockService] Trip ${tripId} closed successfully:`, data);
        return data as any;
    },

    // ============================================================================
    // FINPRO BATCH GENERATION - SERVER-SIDE RPC
    // ============================================================================

    /**
     * Generate FinPro batches for a date - calls server-side RPC function
     * This runs deterministic VAT batching on the server
     */
    generateFinProBatches: async (batchDate: string): Promise<{
        success: boolean;
        error?: string;
        batch_count?: number;
        order_count?: number;
        input_hash?: string;
    }> => {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
            return { success: false, error: 'Not authenticated' };
        }

        // Call server-side RPC function
        const { data, error } = await supabase.rpc('generate_finpro_batches', {
            p_batch_date: batchDate,
            p_created_by: userId
        });

        if (error) {
            console.error('[TripStockService] Error generating FinPro batches:', error);
            return { success: false, error: error.message };
        }

        console.log(`[TripStockService] FinPro batches generated for ${batchDate}:`, data);
        return data as any;
    },

    /**
     * Get FinPro export data for a date
     */
    getFinProExport: async (batchDate: string): Promise<{
        batch_date: string;
        generated_at: string;
        batches: Array<{
            batch_id: string;
            batch_number: number;
            batch_type: string;
            customer_name: string;
            customer_pan?: string;
            total_gross: number;
            total_net: number;
            line_items: Array<{
                product_name: string;
                qty: number;
                rate: number;
                net_amount: number;
            }>;
        }>;
    } | null> => {
        const { data, error } = await supabase.rpc('get_finpro_export', {
            p_batch_date: batchDate
        });

        if (error) {
            console.error('[TripStockService] Error getting FinPro export:', error);
            return null;
        }

        return data as any;
    },

    /**
     * Check if all trips for a date are closed
     */
    areAllTripsClosed: async (date: string): Promise<{
        allClosed: boolean;
        closedCount: number;
        unclosedCount: number;
        unclosedTripIds: string[];
    }> => {
        // Get all trips for the date
        const { data: trips } = await supabase
            .from('trips')
            .select('id')
            .eq('deliveryDate', date);

        if (!trips || trips.length === 0) {
            return { allClosed: true, closedCount: 0, unclosedCount: 0, unclosedTripIds: [] };
        }

        // Get closures for these trips
        const tripIds = trips.map(t => t.id);
        const { data: closures } = await supabase
            .from('trip_closures')
            .select('trip_id')
            .in('trip_id', tripIds);

        const closedIds = new Set((closures || []).map(c => c.trip_id));
        const unclosedTripIds = tripIds.filter(id => !closedIds.has(id));

        return {
            allClosed: unclosedTripIds.length === 0,
            closedCount: closedIds.size,
            unclosedCount: unclosedTripIds.length,
            unclosedTripIds
        };
    },

    /**
     * Get variances for a trip
     */
    getTripVariances: async (tripId: string): Promise<Array<{
        product_id: string;
        product_name?: string;
        qty_loaded: number;
        qty_net_delivered: number;
        qty_returned: number;
        qty_damaged: number;
        expected_unload: number;
        actual_unload: number;
        variance: number;
    }>> => {
        const { data, error } = await supabase
            .from('trip_variances')
            .select(`
                product_id,
                qty_loaded,
                qty_net_delivered,
                qty_returned,
                qty_damaged,
                expected_unload,
                actual_unload,
                variance,
                products (name)
            `)
            .eq('trip_id', tripId);

        if (error) {
            console.error('[TripStockService] Error getting variances:', error);
            return [];
        }

        return (data || []).map((v: any) => ({
            product_id: v.product_id,
            product_name: v.products?.name,
            qty_loaded: v.qty_loaded,
            qty_net_delivered: v.qty_net_delivered,
            qty_returned: v.qty_returned,
            qty_damaged: v.qty_damaged,
            expected_unload: v.expected_unload,
            actual_unload: v.actual_unload,
            variance: v.variance
        }));
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parse returns from remarks string
 * Format: "Returns: ProductA(5), ProductB(3)"
 */
function parseReturnsFromRemarks(remarks: string): Map<string, number> {
    const returnMap = new Map<string, number>();
    if (!remarks) return returnMap;

    // Support both "Returns:" and "Returned:" 
    const match = remarks.match(/(?:Returns?|Returned):\s*([^|]*)/i);
    if (!match) return returnMap;

    const itemsStr = match[1];
    // Global match for Product Name (qty)
    const itemRegex = /([^,()]+)\s*\((\d+(?:\.\d+)?)\)/g;
    let m;
    while ((m = itemRegex.exec(itemsStr)) !== null) {
        const name = m[1].trim().toLowerCase();
        const qty = parseFloat(m[2]);
        if (name && qty > 0) {
            returnMap.set(name, (returnMap.get(name) || 0) + qty);
        }
    }

    return returnMap;
}

/**
 * Parse damages from remarks string
 * Format: "Damages: ProductA(2), ProductB(1)"
 */
function parseDamagesFromRemarks(remarks: string): Map<string, number> {
    const damageMap = new Map<string, number>();
    if (!remarks) return damageMap;

    // Try both "Damages:" and "Damaged:" patterns
    const match = remarks.match(/Damag(?:es?|ed):\s*([^|]*)/i);
    if (!match) return damageMap;

    const itemsStr = match[1];
    // Global match for Product Name (qty), optionally followed by - reason
    const itemRegex = /([^,()]+)\s*\((\d+(?:\.\d+)?)\)/g;
    let m;
    while ((m = itemRegex.exec(itemsStr)) !== null) {
        const name = m[1].trim().toLowerCase();
        const qty = parseFloat(m[2]);
        if (name && qty > 0) {
            damageMap.set(name, (damageMap.get(name) || 0) + qty);
        }
    }

    return damageMap;
}

export default TripStockService;
