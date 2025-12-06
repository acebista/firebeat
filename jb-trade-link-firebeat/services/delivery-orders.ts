/**
 * Delivery Order API Service
 * Handles API calls for delivery order operations with optimistic updates and rollback
 */

import { supabase } from '../lib/supabase';
import {
  AssignedOrder,
  MarkDeliveredPayload,
  RecordSalesReturnPayload,
  RecordDelayPayload,
  DeliveryMutationResponse,
  OrderActivity,
} from '../types/delivery-order';
import { User } from '../types';
import {
  validateMarkDelivered,
  validateSalesReturn,
  validateDelay,
  calculateNetReceivable,
  calculateDamagesTotal,
  calculateReturnTotal,
} from '../lib/delivery-order-logic';

const COLS = {
  ORDERS: 'orders',
  DELIVERY_ORDERS: 'delivery_orders', // Dedicated table for delivery-specific data
  ACTIVITIES: 'order_activities',
};

/**
 * Get all assigned orders for a delivery person
 */
export const getAssignedOrders = async (deliveryPersonId: string): Promise<AssignedOrder[]> => {
  try {
    const { data, error } = await supabase
      .from(COLS.DELIVERY_ORDERS)
      .select('*')
      .eq('assignedToUserId', deliveryPersonId)
      .order('assignedDate', { ascending: false });

    if (error) throw error;
    return data as AssignedOrder[];
  } catch (error) {
    console.error('Error fetching assigned orders:', error);
    throw error;
  }
};

/**
 * Get assigned order by ID
 */
export const getAssignedOrderById = async (orderId: string): Promise<AssignedOrder | null> => {
  try {
    const { data, error } = await supabase
      .from(COLS.DELIVERY_ORDERS)
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data as AssignedOrder;
  } catch (error) {
    console.error('Error fetching assigned order:', error);
    throw error;
  }
};

/**
 * Get orders by status for a delivery person
 */
export const getOrdersByStatus = async (
  deliveryPersonId: string,
  status: string
): Promise<AssignedOrder[]> => {
  try {
    const { data, error } = await supabase
      .from(COLS.DELIVERY_ORDERS)
      .select('*')
      .eq('assignedToUserId', deliveryPersonId)
      .eq('status', status)
      .order('assignedDate', { ascending: false });

    if (error) throw error;
    return data as AssignedOrder[];
  } catch (error) {
    console.error(`Error fetching orders with status ${status}:`, error);
    throw error;
  }
};

/**
 * Mark order as delivered with payment capture
 * IMPORTANT: Updates both delivery_orders AND orders table for data consistency
 */
export const markOrderAsDelivered = async (
  payload: MarkDeliveredPayload,
  order: AssignedOrder,
  currentUser: User
): Promise<DeliveryMutationResponse> => {
  try {
    // 1. VALIDATE payload
    const validation = validateMarkDelivered(payload, order);
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }

    // 2. CALCULATE updated order state
    const damagesAmount = calculateDamagesTotal(payload.damages);
    const returnAmount = order.salesReturn ? calculateReturnTotal(order.salesReturn.items) : 0;
    const netReceivable = calculateNetReceivable(order.subtotal, damagesAmount, returnAmount);

    const updatedOrder: Partial<AssignedOrder> = {
      status: 'delivered',
      payment: {
        amountReceived: payload.amountReceived,
        paymentMode: payload.paymentMode,
        reference: payload.paymentReference,
        notes: payload.notes,
        capturedAt: new Date().toISOString(),
        capturedByUserId: currentUser.id,
      },
    };

    // Add damages if provided
    if (payload.damages && payload.damages.length > 0) {
      updatedOrder.damages = {
        items: payload.damages,
        totalDamagesAmount: damagesAmount,
        recordedAt: new Date().toISOString(),
        recordedByUserId: currentUser.id,
      };
    }

    // 3. UPDATE delivery_orders in database
    const { data: updatedData, error: updateError } = await supabase
      .from(COLS.DELIVERY_ORDERS)
      .update(updatedOrder)
      .eq('id', order.id)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        message: 'Failed to update order',
        errors: [updateError.message],
      };
    }

    // 4. CRITICAL: Update main orders table status
    const { error: mainOrderError } = await supabase
      .from('orders')
      .update({ 
        status: 'delivered',
        paymentMethod: payload.paymentMode,
      })
      .eq('id', order.orderId);

    if (mainOrderError) {
      console.error('Warning: Failed to update main orders table:', mainOrderError);
      // Don't return error - still continue with audit trails
    }

    // 5. CRITICAL: Save damages to damage_logs table if any
    if (payload.damages && payload.damages.length > 0) {
      for (const damage of payload.damages) {
        const damageLogId = `dmg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const { error: damageError } = await supabase
          .from('damage_logs')
          .insert({
            id: damageLogId,
            productId: damage.productId,
            productName: damage.productName,
            companyName: order.items.find(i => i.productId === damage.productId)?.companyName || '',
            qtyPieces: damage.qty,
            damageReason: damage.damageType,
            sourceType: 'delivery',
            sourceInvoiceId: order.orderId,
            createdAt: new Date().toISOString(),
            notes: `Recorded by ${currentUser.name}. ${damage.notes || ''}`,
          });

        if (damageError) {
          console.error(`Failed to log damage for product ${damage.productName}:`, damageError);
        }
      }
    }

    // 6. RECORD activity
    const activity: OrderActivity = {
      action: 'delivered',
      performedByUserId: currentUser.id,
      performedByUserName: currentUser.name,
      timestamp: new Date().toISOString(),
      description: `Order delivered with ₹${payload.amountReceived} received via ${payload.paymentMode}`,
      metadata: {
        paymentMode: payload.paymentMode,
        amountReceived: payload.amountReceived,
        damagesRecorded: !!payload.damages?.length,
        damagesAmount: damagesAmount,
      },
    };

    await recordOrderActivity(order.orderId, activity);

    return {
      success: true,
      message: 'Order marked as delivered',
      order: updatedData as AssignedOrder,
    };
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
};

/**
 * Record sales return for an order
 * IMPORTANT: Updates both delivery_orders AND returns/return_items tables for data consistency
 */
export const recordSalesReturn = async (
  payload: RecordSalesReturnPayload,
  order: AssignedOrder,
  currentUser: User
): Promise<DeliveryMutationResponse> => {
  try {
    // 1. VALIDATE payload
    const validation = validateSalesReturn(payload, order);
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }

    // 2. DETERMINE new status based on return type
    const returnAmount = calculateReturnTotal(payload.items);
    const newStatus = payload.returnType === 'full' ? 'fully_returned' : 'partially_returned';

    // 3. UPDATE delivery_orders
    const updatedOrder: Partial<AssignedOrder> = {
      status: newStatus,
      salesReturn: {
        returnType: payload.returnType,
        reason: payload.reason,
        items: payload.items,
        totalReturnAmount: returnAmount,
        notes: payload.notes,
        recordedAt: new Date().toISOString(),
        recordedByUserId: currentUser.id,
      },
    };

    const { data: updatedData, error: updateError } = await supabase
      .from(COLS.DELIVERY_ORDERS)
      .update(updatedOrder)
      .eq('id', order.id)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        message: 'Failed to record return',
        errors: [updateError.message],
      };
    }

    // 4. CRITICAL: Save to returns table (header)
    const returnId = `ret_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const { error: returnsError } = await supabase
      .from('returns')
      .insert({
        id: returnId,
        invoiceId: order.orderId,
        invoiceNumber: order.orderId,
        customerId: order.customerId,
        customerName: order.customerName,
        returnType: payload.returnType,
        reason: payload.reason,
        notes: payload.notes,
        createdByUserId: currentUser.id,
        createdAt: new Date().toISOString(),
        totalReturnAmount: returnAmount,
      });

    if (returnsError) {
      console.error('Failed to save return to returns table:', returnsError);
      // Continue - don't block
    }

    // 5. CRITICAL: Save individual items to return_items table
    if (payload.items && payload.items.length > 0) {
      for (const item of payload.items) {
        const returnItemId = `ret_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const { error: returnItemError } = await supabase
          .from('return_items')
          .insert({
            id: returnItemId,
            salesReturnId: returnId,
            invoiceItemId: item.productId,
            productId: item.productId,
            productName: item.productName,
            companyName: order.items.find(i => i.productId === item.productId)?.companyName || '',
            qtyInvoiced: item.qtyDelivered,
            qtyReturnedGood: item.qtyReturned,
            qtyReturnedDamaged: 0, // Can be enhanced later if needed
            rate: item.rate,
            lineReturnAmount: item.returnAmount,
          });

        if (returnItemError) {
          console.error(`Failed to save return item ${item.productName}:`, returnItemError);
        }
      }
    }

    // 6. CRITICAL: Update main orders table status
    const { error: mainOrderError } = await supabase
      .from('orders')
      .update({ 
        status: newStatus === 'fully_returned' ? 'cancelled' : 'returned',
      })
      .eq('id', order.orderId);

    if (mainOrderError) {
      console.error('Warning: Failed to update main orders table:', mainOrderError);
      // Don't return error - still continue with audit trails
    }

    // 7. RECORD activity
    const activity: OrderActivity = {
      action: 'sales_return_created',
      performedByUserId: currentUser.id,
      performedByUserName: currentUser.name,
      timestamp: new Date().toISOString(),
      description: `${payload.returnType === 'full' ? 'Full' : 'Partial'} return recorded (Reason: ${payload.reason})`,
      metadata: {
        returnType: payload.returnType,
        reason: payload.reason,
        totalReturnAmount: returnAmount,
        itemsReturned: payload.items.length,
      },
    };

    await recordOrderActivity(order.orderId, activity);

    return {
      success: true,
      message: `${payload.returnType === 'full' ? 'Full' : 'Partial'} return recorded`,
      order: updatedData as AssignedOrder,
    };
  } catch (error) {
    console.error('Error recording sales return:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
};

/**
 * Record order delay
 */
export const recordOrderDelay = async (
  payload: RecordDelayPayload,
  order: AssignedOrder,
  currentUser: User
): Promise<DeliveryMutationResponse> => {
  try {
    // 1. VALIDATE payload
    const validation = validateDelay(payload);
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }

    // 2. UPDATE delivery_orders
    const updatedOrder: Partial<AssignedOrder> = {
      status: 'delayed',
      delay: {
        reason: payload.reason,
        rescheduledDate: payload.rescheduledDate,
        notes: payload.notes,
        recordedAt: new Date().toISOString(),
        recordedByUserId: currentUser.id,
      },
    };

    const { data: updatedData, error: updateError } = await supabase
      .from(COLS.DELIVERY_ORDERS)
      .update(updatedOrder)
      .eq('id', order.id)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        message: 'Failed to record delay',
        errors: [updateError.message],
      };
    }

    // 3. UPDATE main orders table status
    const { error: mainOrderError } = await supabase
      .from('orders')
      .update({ 
        status: 'delayed',
      })
      .eq('id', order.orderId);

    if (mainOrderError) {
      console.error('Warning: Failed to update main orders table:', mainOrderError);
    }

    // 4. RECORD activity
    const activity: OrderActivity = {
      action: 'delay_recorded',
      performedByUserId: currentUser.id,
      performedByUserName: currentUser.name,
      timestamp: new Date().toISOString(),
      description: `Delivery delayed to ${payload.rescheduledDate} (Reason: ${payload.reason})`,
      metadata: {
        reason: payload.reason,
        rescheduledDate: payload.rescheduledDate,
      },
    };

    await recordOrderActivity(order.orderId, activity);

    return {
      success: true,
      message: 'Delivery delay recorded',
      order: updatedData as AssignedOrder,
    };
  } catch (error) {
    console.error('Error recording delay:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
};

/**
 * Record order activity (internal helper)
 */
const recordOrderActivity = async (
  orderId: string,
  activity: OrderActivity
): Promise<void> => {
  try {
    const activityWithId = {
      ...activity,
      orderId,
      id: activity.id || `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const { error } = await supabase.from(COLS.ACTIVITIES).insert(activityWithId);

    if (error) {
      console.error('Error recording activity:', error);
      // Don't throw - activity logging shouldn't block main operation
    }
  } catch (error) {
    console.error('Error recording activity:', error);
    // Don't throw - activity logging shouldn't block main operation
  }
};

/**
 * Get order activity timeline
 */
export const getOrderActivities = async (orderId: string): Promise<OrderActivity[]> => {
  try {
    const { data, error } = await supabase
      .from(COLS.ACTIVITIES)
      .select('*')
      .eq('orderId', orderId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data as OrderActivity[];
  } catch (error) {
    console.error('Error fetching order activities:', error);
    return [];
  }
};

/**
 * Get delivery day statistics
 */
export const getDeliveryDayStats = async (
  deliveryPersonId: string,
  date: string
): Promise<any> => {
  try {
    const startOfDay = `${date}T00:00:00Z`;
    const endOfDay = `${date}T23:59:59Z`;

    const { data, error } = await supabase
      .from(COLS.DELIVERY_ORDERS)
      .select('*')
      .eq('assignedToUserId', deliveryPersonId)
      .gte('updatedAt', startOfDay)
      .lte('updatedAt', endOfDay);

    if (error) throw error;

    const orders = data as AssignedOrder[];

    // Calculate stats
    return {
      totalAssigned: orders.filter(o => o.status === 'assigned').length,
      outForDelivery: orders.filter(o => o.status === 'out_for_delivery').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      returns: orders.filter(o => ['partially_returned', 'fully_returned'].includes(o.status)).length,
      delayed: orders.filter(o => o.status === 'delayed').length,
      failed: orders.filter(o => o.status === 'failed').length,
      totalValue: orders.reduce((sum, o) => sum + o.subtotal, 0),
      totalReceived: orders
        .filter(o => o.payment)
        .reduce((sum, o) => sum + (o.payment?.amountReceived || 0), 0),
    };
  } catch (error) {
    console.error('Error fetching delivery day stats:', error);
    throw error;
  }
};

export default {
  getAssignedOrders,
  getAssignedOrderById,
  getOrdersByStatus,
  markOrderAsDelivered,
  recordSalesReturn,
  recordOrderDelay,
  getOrderActivities,
  getDeliveryDayStats,
};
