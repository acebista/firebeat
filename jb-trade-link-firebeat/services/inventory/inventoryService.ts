/**
 * Inventory Service
 * 
 * Handles inventory tracking, movements, adjustments, and stock in transit calculations.
 * Data sources: products, orders (sales), purchases, returns, damage_logs, inventory_adjustments, inventory_opening
 */

import { supabase } from '../../lib/supabase';

export interface InventoryMovement {
  id: string;
  date: string;
  type: 'purchase' | 'sale' | 'return' | 'damage' | 'adjustment';
  quantity: number; // Can be positive or negative
  reference_id: string;
  reference_type: string;
  product_id: string;
  product_name?: string;
  company?: string;
  user_name?: string;
  note?: string;
}

export interface InventorySummaryItem {
  product_id: string;
  product_name: string;
  company: string;
  sku: string;
  opening_qty: number;
  total_in: number;
  total_out: number;
  net_change: number;
  current_stock: number;
}

export interface StockInTransitByProduct {
  product_id: string;
  product_name: string;
  company: string;
  sku: string;
  total_qty_in_transit: number;
  trip_count: number;
  order_count: number;
}

export interface StockInTransitByTrip {
  trip_id: string;
  order_id?: string;
  destination: string;
  customer_name?: string;
  dispatcher_name?: string;
  delivery_user_name?: string;
  status: string;
  dispatch_date: string;
  items: Array<{
    product_id: string;
    product_name: string;
    qty_in_transit: number;
    qty_total_ordered?: number;
  }>;
}

export interface InventoryAdjustment {
  id?: string;
  product_id: string;
  qty_delta: number;
  reason: 'loss' | 'leakage' | 'audit' | 'other';
  note?: string;
  created_at?: string;
  created_by?: string;
}

export interface InventoryOpening {
  id?: string;
  product_id: string;
  opening_qty: number;
  effective_date: string; // YYYY-MM-DD
  created_at?: string;
  created_by?: string;
}

/**
 * Get opening stock for a product on a specific date or before
 * Uses the latest opening_qty record on or before the given date
 */
export async function getOpeningStock(
  productId: string,
  effectiveDate: string
): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('inventory_opening')
      .select('opening_qty')
      .eq('product_id', productId)
      .lte('effective_date', effectiveDate)
      .order('effective_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data?.opening_qty ?? 0;
  } catch (error) {
    console.error('[InventoryService] Failed to get opening stock:', error);
    throw error;
  }
}

/**
 * Get all inventory movements within a date range for a product or all products
 * Combines purchases, sales (orders), returns, damage logs, and adjustments
 */
export async function getInventoryMovements(
  startDate: string,
  endDate: string,
  productId?: string,
  search?: string
): Promise<InventoryMovement[]> {
  try {
    const movements: InventoryMovement[] = [];

    // 1. Get purchases
    let purchaseQuery = supabase
      .from('purchases')
      .select('id, created_at, product_id, quantity, reference_id, supplier_name, created_by')
      .gte('created_at', `${startDate}T00:00:00Z`)
      .lte('created_at', `${endDate}T23:59:59Z`);

    if (productId) purchaseQuery = purchaseQuery.eq('product_id', productId);
    if (search) purchaseQuery = purchaseQuery.or(`supplier_name.ilike.%${search}%,product_id.ilike.%${search}%`);

    const { data: purchases, error: purchaseError } = await purchaseQuery;
    if (purchaseError) throw purchaseError;

    purchases?.forEach(p => {
      movements.push({
        id: `purchase-${p.id}`,
        date: p.created_at,
        type: 'purchase',
        quantity: p.quantity,
        reference_id: p.id,
        reference_type: 'purchase',
        product_id: p.product_id,
        company: p.supplier_name,
        note: `Purchase Order: ${p.reference_id || 'N/A'}`,
      });
    });

    // 2. Get sales (orders with items)
    let orderQuery = supabase
      .from('orders')
      .select('id, created_at, customer_name, order_items, created_by')
      .gte('created_at', `${startDate}T00:00:00Z`)
      .lte('created_at', `${endDate}T23:59:59Z`);

    if (search) orderQuery = orderQuery.or(`customer_name.ilike.%${search}%`);

    const { data: orders, error: orderError } = await orderQuery;
    if (orderError) throw orderError;

    orders?.forEach(order => {
      try {
        const items = typeof order.order_items === 'string' 
          ? JSON.parse(order.order_items) 
          : order.order_items || [];
        
        items.forEach((item: any) => {
          if (!productId || item.product_id === productId) {
            movements.push({
              id: `sale-${order.id}-${item.product_id}`,
              date: order.created_at,
              type: 'sale',
              quantity: -(item.quantity || 0),
              reference_id: order.id,
              reference_type: 'order',
              product_id: item.product_id,
              company: order.customer_name,
              note: `Order: ${order.id}`,
            });
          }
        });
      } catch (e) {
        console.error('[InventoryService] Error parsing order items:', e);
      }
    });

    // 3. Get returns
    let returnQuery = supabase
      .from('returns')
      .select('id, created_at, product_id, quantity, order_id, reason, created_by')
      .gte('created_at', `${startDate}T00:00:00Z`)
      .lte('created_at', `${endDate}T23:59:59Z`);

    if (productId) returnQuery = returnQuery.eq('product_id', productId);

    const { data: returns, error: returnError } = await returnQuery;
    if (returnError) throw returnError;

    returns?.forEach(ret => {
      movements.push({
        id: `return-${ret.id}`,
        date: ret.created_at,
        type: 'return',
        quantity: ret.quantity,
        reference_id: ret.id,
        reference_type: 'return',
        product_id: ret.product_id,
        note: `Return from Order ${ret.order_id}: ${ret.reason}`,
      });
    });

    // 4. Get damage logs
    let damageQuery = supabase
      .from('damage_logs')
      .select('id, created_at, product_id, quantity_damaged, reason, reference_id, created_by')
      .gte('created_at', `${startDate}T00:00:00Z`)
      .lte('created_at', `${endDate}T23:59:59Z`);

    if (productId) damageQuery = damageQuery.eq('product_id', productId);

    const { data: damages, error: damageError } = await damageQuery;
    if (damageError) throw damageError;

    damages?.forEach(damage => {
      movements.push({
        id: `damage-${damage.id}`,
        date: damage.created_at,
        type: 'damage',
        quantity: -(damage.quantity_damaged || 0),
        reference_id: damage.id,
        reference_type: 'damage',
        product_id: damage.product_id,
        note: `Damage: ${damage.reason}. Ref: ${damage.reference_id || 'N/A'}`,
      });
    });

    // 5. Get adjustments
    let adjustmentQuery = supabase
      .from('inventory_adjustments')
      .select('id, created_at, product_id, qty_delta, reason, note, created_by')
      .gte('created_at', `${startDate}T00:00:00Z`)
      .lte('created_at', `${endDate}T23:59:59Z`);

    if (productId) adjustmentQuery = adjustmentQuery.eq('product_id', productId);

    const { data: adjustments, error: adjustmentError } = await adjustmentQuery;
    if (adjustmentError) throw adjustmentError;

    adjustments?.forEach(adj => {
      movements.push({
        id: `adjustment-${adj.id}`,
        date: adj.created_at,
        type: 'adjustment',
        quantity: adj.qty_delta,
        reference_id: adj.id,
        reference_type: 'adjustment',
        product_id: adj.product_id,
        note: `${adj.reason}: ${adj.note || 'No note'}`,
      });
    });

    // Sort by date descending
    return movements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('[InventoryService] Failed to get inventory movements:', error);
    throw error;
  }
}

/**
 * Generate inventory summary report for a date range
 * For each product: opening + total in - total out = current stock
 */
export async function getInventorySummary(
  startDate: string,
  endDate: string,
  search?: string
): Promise<InventorySummaryItem[]> {
  try {
    // Get all products (filtered by search if provided)
    let productQuery = supabase
      .from('products')
      .select('id, name, company, sku');

    if (search) {
      productQuery = productQuery.or(`name.ilike.%${search}%,company.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    const { data: products, error: productError } = await productQuery;
    if (productError) throw productError;

    const summary: InventorySummaryItem[] = [];

    for (const product of products || []) {
      // Get opening stock
      const openingQty = await getOpeningStock(product.id, startDate);

      // Get movements
      const movements = await getInventoryMovements(startDate, endDate, product.id);

      // Calculate totals
      const totalIn = movements
        .filter(m => ['purchase', 'return', 'adjustment'].includes(m.type) && m.quantity > 0)
        .reduce((sum, m) => sum + m.quantity, 0);

      const totalOut = movements
        .filter(m => ['sale', 'damage', 'adjustment'].includes(m.type) && m.quantity < 0)
        .reduce((sum, m) => sum + Math.abs(m.quantity), 0);

      const netChange = totalIn - totalOut;
      const currentStock = openingQty + netChange;

      summary.push({
        product_id: product.id,
        product_name: product.name,
        company: product.company,
        sku: product.sku,
        opening_qty: openingQty,
        total_in: totalIn,
        total_out: totalOut,
        net_change: netChange,
        current_stock: currentStock,
      });
    }

    return summary.sort((a, b) => a.product_name.localeCompare(b.product_name));
  } catch (error) {
    console.error('[InventoryService] Failed to get inventory summary:', error);
    throw error;
  }
}

/**
 * Get stock in transit (dispatched but not delivered)
 * Includes both trip-based and order-based tracking
 */
export async function getStockInTransitByProduct(
  startDate?: string,
  endDate?: string,
  search?: string
): Promise<StockInTransitByProduct[]> {
  try {
    const inTransitStatuses = ['dispatched', 'shipped', 'out_for_delivery'];

    // Query orders with in-transit status and their items
    let orderQuery = supabase
      .from('orders')
      .select('id, status, dispatch_date, order_items, customer_name')
      .in('status', inTransitStatuses);

    if (startDate) {
      orderQuery = orderQuery.gte('dispatch_date', startDate);
    }
    if (endDate) {
      orderQuery = orderQuery.lte('dispatch_date', endDate);
    }

    const { data: orders, error: orderError } = await orderQuery;
    if (orderError) throw orderError;

    // Query trips with in-transit status and their dispatch items
    let tripQuery = supabase
      .from('trips')
      .select('id, status, dispatch_date, dispatch_items, destination')
      .in('status', inTransitStatuses);

    if (startDate) {
      tripQuery = tripQuery.gte('dispatch_date', startDate);
    }
    if (endDate) {
      tripQuery = tripQuery.lte('dispatch_date', endDate);
    }

    const { data: trips, error: tripError } = await tripQuery;
    if (tripError) throw tripError;

    // Aggregate by product
    const productMap = new Map<string, {
      qty: number;
      trips: Set<string>;
      orders: Set<string>;
    }>();

    // Process orders
    orders?.forEach(order => {
      try {
        const items = typeof order.order_items === 'string'
          ? JSON.parse(order.order_items)
          : order.order_items || [];

        items.forEach((item: any) => {
          const key = item.product_id;
          const current = productMap.get(key) || { qty: 0, trips: new Set(), orders: new Set() };
          current.qty += item.quantity || 0;
          current.orders.add(order.id);
          productMap.set(key, current);
        });
      } catch (e) {
        console.error('[InventoryService] Error parsing order items:', e);
      }
    });

    // Process trips
    trips?.forEach(trip => {
      try {
        const items = typeof trip.dispatch_items === 'string'
          ? JSON.parse(trip.dispatch_items)
          : trip.dispatch_items || [];

        items.forEach((item: any) => {
          const key = item.product_id;
          const current = productMap.get(key) || { qty: 0, trips: new Set(), orders: new Set() };
          current.qty += item.quantity || 0;
          current.trips.add(trip.id);
          productMap.set(key, current);
        });
      } catch (e) {
        console.error('[InventoryService] Error parsing trip items:', e);
      }
    });

    // Get product details and build result
    const productIds = Array.from(productMap.keys());
    let productQuery = supabase
      .from('products')
      .select('id, name, company, sku')
      .in('id', productIds);

    if (search) {
      productQuery = productQuery.or(`name.ilike.%${search}%,company.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    const { data: products, error: productError } = await productQuery;
    if (productError) throw productError;

    return (products || []).map(product => {
      const transit = productMap.get(product.id);
      return {
        product_id: product.id,
        product_name: product.name,
        company: product.company,
        sku: product.sku,
        total_qty_in_transit: transit?.qty || 0,
        trip_count: transit?.trips.size || 0,
        order_count: transit?.orders.size || 0,
      };
    });
  } catch (error) {
    console.error('[InventoryService] Failed to get stock in transit by product:', error);
    throw error;
  }
}

/**
 * Get stock in transit grouped by trip/order
 */
export async function getStockInTransitByTrip(
  startDate?: string,
  endDate?: string,
  search?: string
): Promise<StockInTransitByTrip[]> {
  try {
    const inTransitStatuses = ['dispatched', 'shipped', 'out_for_delivery'];
    const result: StockInTransitByTrip[] = [];

    // Get in-transit orders
    let orderQuery = supabase
      .from('orders')
      .select('id, status, dispatch_date, delivery_date, order_items, customer_name, delivery_user, delivery_address')
      .in('status', inTransitStatuses);

    if (startDate) orderQuery = orderQuery.gte('dispatch_date', startDate);
    if (endDate) orderQuery = orderQuery.lte('dispatch_date', endDate);
    if (search) orderQuery = orderQuery.or(`customer_name.ilike.%${search}%`);

    const { data: orders, error: orderError } = await orderQuery;
    if (orderError) throw orderError;

    // Process orders
    for (const order of orders || []) {
      try {
        const items = typeof order.order_items === 'string'
          ? JSON.parse(order.order_items)
          : order.order_items || [];

        // Get product details for items
        const productIds = items.map((i: any) => i.product_id);
        const { data: products } = await supabase
          .from('products')
          .select('id, name, sku')
          .in('id', productIds);

        const productMap = new Map((products || []).map(p => [p.id, p]));

        result.push({
          trip_id: order.id,
          status: order.status,
          dispatch_date: order.dispatch_date,
          destination: order.delivery_address || 'N/A',
          customer_name: order.customer_name,
          delivery_user_name: order.delivery_user,
          items: items.map((item: any) => {
            const product = productMap.get(item.product_id);
            return {
              product_id: item.product_id,
              product_name: product?.name || 'Unknown',
              qty_in_transit: item.quantity,
              qty_total_ordered: item.quantity,
            };
          }),
        });
      } catch (e) {
        console.error('[InventoryService] Error processing order:', e);
      }
    }

    // Get in-transit trips
    let tripQuery = supabase
      .from('trips')
      .select('id, status, dispatch_date, dispatch_items, destination, dispatcher, delivery_user')
      .in('status', inTransitStatuses);

    if (startDate) tripQuery = tripQuery.gte('dispatch_date', startDate);
    if (endDate) tripQuery = tripQuery.lte('dispatch_date', endDate);
    if (search) tripQuery = tripQuery.or(`destination.ilike.%${search}%`);

    const { data: trips, error: tripError } = await tripQuery;
    if (tripError) throw tripError;

    // Process trips
    for (const trip of trips || []) {
      try {
        const items = typeof trip.dispatch_items === 'string'
          ? JSON.parse(trip.dispatch_items)
          : trip.dispatch_items || [];

        // Get product details for items
        const productIds = items.map((i: any) => i.product_id);
        const { data: products } = await supabase
          .from('products')
          .select('id, name, sku')
          .in('id', productIds);

        const productMap = new Map((products || []).map(p => [p.id, p]));

        result.push({
          trip_id: trip.id,
          status: trip.status,
          dispatch_date: trip.dispatch_date,
          destination: trip.destination,
          dispatcher_name: trip.dispatcher,
          delivery_user_name: trip.delivery_user,
          items: items.map((item: any) => {
            const product = productMap.get(item.product_id);
            return {
              product_id: item.product_id,
              product_name: product?.name || 'Unknown',
              qty_in_transit: item.quantity,
            };
          }),
        });
      } catch (e) {
        console.error('[InventoryService] Error processing trip:', e);
      }
    }

    return result.sort((a, b) => new Date(b.dispatch_date).getTime() - new Date(a.dispatch_date).getTime());
  } catch (error) {
    console.error('[InventoryService] Failed to get stock in transit by trip:', error);
    throw error;
  }
}

/**
 * Create an inventory adjustment
 * Admin only - enforced via RLS
 */
export async function createInventoryAdjustment(
  adjustment: InventoryAdjustment
): Promise<InventoryAdjustment> {
  try {
    const { data, error } = await supabase
      .from('inventory_adjustments')
      .insert([{
        product_id: adjustment.product_id,
        qty_delta: adjustment.qty_delta,
        reason: adjustment.reason,
        note: adjustment.note || '',
        created_by: (await supabase.auth.getUser()).data.user?.id,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[InventoryService] Failed to create adjustment:', error);
    throw error;
  }
}

/**
 * Set opening stock for a product on a specific date
 * Admin only - enforced via RLS
 */
export async function setOpeningStock(
  opening: InventoryOpening
): Promise<InventoryOpening> {
  try {
    const { data, error } = await supabase
      .from('inventory_opening')
      .upsert([{
        product_id: opening.product_id,
        opening_qty: opening.opening_qty,
        effective_date: opening.effective_date,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      }], {
        onConflict: 'product_id,effective_date',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[InventoryService] Failed to set opening stock:', error);
    throw error;
  }
}

/**
 * Calculate current stock for a product as of a given date
 */
export function calculateCurrentStock(
  openingQty: number,
  movements: InventoryMovement[]
): number {
  const totalDelta = movements.reduce((sum, m) => sum + m.quantity, 0);
  return openingQty + totalDelta;
}
