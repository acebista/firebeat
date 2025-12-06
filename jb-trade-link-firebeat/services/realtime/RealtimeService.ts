import { supabase } from '../../lib/supabase';
import { Product, Order, Customer } from '../../types';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Supabase Real-Time Service
 * Handles subscriptions to real-time updates for products, orders, customers
 */

type RealtimeCallback<T> = (data: T) => void;
type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

interface RealtimeSubscription<T> {
  unsubscribe: () => Promise<void>;
}

// Product Realtime Subscriptions
export const ProductRealtimeService = {
  subscribeToAll: (callback: RealtimeCallback<Product>): RealtimeSubscription<Product> => {
    console.log('[Realtime] Subscribing to all product changes...');
    
    const channel = supabase
      .channel('products-all')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload: any) => {
          console.log('[Realtime] Product change:', payload.eventType, payload.new);
          if (payload.new) {
            callback(payload.new as Product);
          }
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Product subscription status:', status);
      });

    return {
      unsubscribe: async () => {
        await supabase.removeChannel(channel);
      },
    };
  },

  subscribeToInserts: (callback: RealtimeCallback<Product>): RealtimeSubscription<Product> => {
    console.log('[Realtime] Subscribing to product inserts...');
    
    const channel = supabase
      .channel('products-insert')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'products',
        },
        (payload: any) => {
          console.log('[Realtime] New product:', payload.new);
          callback(payload.new as Product);
        }
      )
      .subscribe();

    return {
      unsubscribe: async () => {
        await supabase.removeChannel(channel);
      },
    };
  },

  subscribeToUpdates: (callback: RealtimeCallback<Product>): RealtimeSubscription<Product> => {
    console.log('[Realtime] Subscribing to product updates...');
    
    const channel = supabase
      .channel('products-update')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
        },
        (payload: any) => {
          console.log('[Realtime] Product updated:', payload.new);
          callback(payload.new as Product);
        }
      )
      .subscribe();

    return {
      unsubscribe: async () => {
        await supabase.removeChannel(channel);
      },
    };
  },

  subscribeToDeletes: (callback: RealtimeCallback<Product>): RealtimeSubscription<Product> => {
    console.log('[Realtime] Subscribing to product deletes...');
    
    const channel = supabase
      .channel('products-delete')
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'products',
        },
        (payload: any) => {
          console.log('[Realtime] Product deleted:', payload.old);
          callback(payload.old as Product);
        }
      )
      .subscribe();

    return {
      unsubscribe: async () => {
        await supabase.removeChannel(channel);
      },
    };
  },
};

// Order Realtime Subscriptions
export const OrderRealtimeService = {
  subscribeToAll: (callback: RealtimeCallback<Order>): RealtimeSubscription<Order> => {
    console.log('[Realtime] Subscribing to all order changes...');
    
    const channel = supabase
      .channel('orders-all')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload: any) => {
          console.log('[Realtime] Order change:', payload.eventType, payload.new);
          if (payload.new) {
            callback(payload.new as Order);
          }
        }
      )
      .subscribe();

    return {
      unsubscribe: async () => {
        await supabase.removeChannel(channel);
      },
    };
  },

  subscribeToStatus: (
    status: string,
    callback: RealtimeCallback<Order>
  ): RealtimeSubscription<Order> => {
    console.log('[Realtime] Subscribing to orders with status:', status);
    
    const channel = supabase
      .channel(`orders-${status}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `status=eq.${status}`,
        },
        (payload: any) => {
          console.log('[Realtime] Order with status', status, ':', payload.new || payload.old);
          if (payload.new) {
            callback(payload.new as Order);
          }
        }
      )
      .subscribe();

    return {
      unsubscribe: async () => {
        await supabase.removeChannel(channel);
      },
    };
  },
};

// Customer Realtime Subscriptions
export const CustomerRealtimeService = {
  subscribeToAll: (callback: RealtimeCallback<Customer>): RealtimeSubscription<Customer> => {
    console.log('[Realtime] Subscribing to all customer changes...');
    
    const channel = supabase
      .channel('customers-all')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers',
        },
        (payload: any) => {
          console.log('[Realtime] Customer change:', payload.eventType, payload.new);
          if (payload.new) {
            callback(payload.new as Customer);
          }
        }
      )
      .subscribe();

    return {
      unsubscribe: async () => {
        await supabase.removeChannel(channel);
      },
    };
  },
};

/**
 * Usage Example:
 * 
 * import { ProductRealtimeService } from '../../services/realtime/RealtimeService';
 * 
 * useEffect(() => {
 *   const subscription = ProductRealtimeService.subscribeToInserts((product) => {
 *     console.log('New product added:', product);
 *     // Update state, show toast, etc.
 *   });
 * 
 *   return () => {
 *     subscription.unsubscribe();
 *   };
 * }, []);
 */
