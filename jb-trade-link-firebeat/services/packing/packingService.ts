/**
 * Packing List Service
 * 
 * Handles fetching trips and orders for delivery users and managing packing progress.
 */

import { supabase } from '../../lib/supabase';

export interface PackingItem {
  id: string; // Unique item identifier (order_id-item_index)
  order_id: string;
  customer_name: string;
  product_id: string;
  product_name: string;
  company: string;
  quantity: number;
  total?: number;
  is_done?: boolean;
}

export interface TripWithOrders {
  id: string;
  deliveryDate: string;
  deliveryPersonId: string;
  deliveryPersonName: string;
  routeNames: string[];
  status: string;
  orders: Array<{
    id: string;
    customerName: string;
    items: PackingItem[];
  }>;
}

export interface PackingProgress {
  id?: string;
  trip_id: string;
  order_id: string;
  item_id: string;
  is_done: boolean;
  updated_at?: string;
  updated_by?: string;
}

/**
 * Fetch a single trip with all its orders and items
 * Verifies delivery user matches the trip's deliveryPersonId
 */
export async function getTripWithOrders(tripId: string): Promise<TripWithOrders | null> {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Not authenticated');
    }

    // Fetch trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id, deliveryDate, deliveryPersonId, deliveryPersonName, routeNames, status, orderIds')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      throw new Error('Trip not found');
    }

    // Verify user is assigned to this trip
    if (trip.deliveryPersonId !== user.id) {
      throw new Error('Unauthorized: You are not assigned to this trip');
    }

    // Fetch orders for this trip
    const orderIds = trip.orderIds || [];
    if (orderIds.length === 0) {
      return {
        ...trip,
        orders: [],
      };
    }

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, customerName, items')
      .in('id', orderIds);

    if (ordersError) {
      throw ordersError;
    }

    // Parse items and flatten them
    const processedOrders = (orders || []).map(order => {
      let items: any[] = [];
      try {
        items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || [];
      } catch (e) {
        console.error('[PackingService] Error parsing items for order', order.id, e);
        items = [];
      }

      return {
        id: order.id,
        customerName: order.customerName,
        items: items.map((item: any, index: number) => {
          return {
            id: `${order.id}-${index}`,
            order_id: order.id,
            customer_name: order.customerName,
            // Handle both snake_case (legacy/db) and camelCase (app) property names
            product_id: item.product_id || item.productId || '',
            product_name: item.name || item.product_name || item.productName || 'Unknown',
            company: item.company || item.companyName || '',
            quantity: Number(item.quantity) || Number(item.qty) || 0,
            total: Number(item.total) || Number(item.amount) || 0,
          };
        }),
      };
    });

    return {
      id: trip.id,
      deliveryDate: trip.deliveryDate,
      deliveryPersonId: trip.deliveryPersonId,
      deliveryPersonName: trip.deliveryPersonName,
      routeNames: trip.routeNames || [],
      status: trip.status,
      orders: processedOrders,
    };
  } catch (error) {
    console.error('[PackingService] Failed to get trip with orders:', error);
    throw error;
  }
}

/**
 * Fetch packing progress for a trip
 */
export async function getPackingProgress(tripId: string): Promise<PackingProgress[]> {
  try {
    const { data, error } = await supabase
      .from('packing_progress')
      .select('id, trip_id, order_id, item_id, is_done, updated_at, updated_by')
      .eq('trip_id', tripId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('[PackingService] Failed to get packing progress:', error);
    throw error;
  }
}

/**
 * Upsert packing progress for an item
 */
export async function upsertPackingProgress(
  tripId: string,
  orderId: string,
  itemId: string,
  isDone: boolean
): Promise<PackingProgress> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('packing_progress')
      .upsert(
        {
          trip_id: tripId,
          order_id: orderId,
          item_id: itemId,
          is_done: isDone,
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        },
        {
          onConflict: 'trip_id,order_id,item_id',
        }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[PackingService] Failed to upsert packing progress:', error);
    throw error;
  }
}

/**
 * Mark all items as done for a trip
 */
export async function markAllDone(tripId: string, items: PackingItem[]): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Not authenticated');
    }

    const progressRecords = items.map(item => ({
      trip_id: tripId,
      order_id: item.order_id,
      item_id: item.id,
      is_done: true,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    }));

    const { error } = await supabase
      .from('packing_progress')
      .upsert(progressRecords, {
        onConflict: 'trip_id,order_id,item_id',
      });

    if (error) throw error;
  } catch (error) {
    console.error('[PackingService] Failed to mark all as done:', error);
    throw error;
  }
}
