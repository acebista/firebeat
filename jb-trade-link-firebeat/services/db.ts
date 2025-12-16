
import { supabase } from '../lib/supabase';
import { Product, Customer, Order, User, Company, DispatchTrip, SalesReturn, DamagedGoodsLog, Vehicle } from '../types';
import { PurchaseBillSaved } from '../types/purchase';

// Collection Names (Table Names in Supabase)
export const COLS = {
  PRODUCTS: 'products',
  CUSTOMERS: 'customers',
  ORDERS: 'orders',
  USERS: 'users',
  COMPANIES: 'companies',
  TRIPS: 'trips',
  PURCHASES: 'purchases',
  RETURNS: 'returns',
  DAMAGE_LOGS: 'damage_logs',
  VEHICLES: 'vehicles'
};

// Helper to standardize response
const fetchCollection = async <T>(colName: string): Promise<T[]> => {
  try {
    // Verify we have an active session before fetching
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      console.warn(`No active session when fetching ${colName}`);
      throw new Error('No active Supabase session. Please log in.');
    }

    const { data, error } = await supabase.from(colName).select('*');
    if (error) {
      console.error(`Supabase error fetching ${colName}:`, error);
      throw error;
    }
    return data as T[];
  } catch (error) {
    console.error(`Error fetching ${colName}:`, error);
    throw error;
  }
};

// Helper to fetch vehicles with column name mapping
const fetchVehicles = async (): Promise<Vehicle[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      console.warn('No active session when fetching vehicles');
      throw new Error('No active Supabase session. Please log in.');
    }

    const { data, error } = await supabase.from(COLS.VEHICLES).select('*');
    if (error) {
      console.error('Supabase error fetching vehicles:', error);
      throw error;
    }

    // Map lowercase database columns to camelCase
    return (data || []).map(v => ({
      id: v.id,
      name: v.name,
      registrationNo: v.registrationno,
      capacityCases: v.capacitycases,
      isActive: v.isactive,
      createdAt: v.createdat,
      updatedAt: v.updatedat,
    })) as Vehicle[];
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

// --- Specific Services ---

export const ProductService = {
  getAll: () => fetchCollection<Product>(COLS.PRODUCTS),
  add: async (product: Omit<Product, 'id'>) => {
    // Generate a unique ID if not provided (using short UUID prefix)
    const id = (product as any).id || `prod_${crypto.randomUUID().split('-')[0]}`;

    // Insert with generated ID
    const { data, error } = await supabase
      .from(COLS.PRODUCTS)
      .insert({ ...product, id })
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  },
  update: async (id: string, product: Partial<Product>) => {
    const { error } = await supabase.from(COLS.PRODUCTS).update(product).eq('id', id);
    if (error) throw error;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from(COLS.PRODUCTS).delete().eq('id', id);
    if (error) throw error;
  }
};

export const CustomerService = {
  getAll: () => fetchCollection<Customer>(COLS.CUSTOMERS),
  // New method to fetch ALL customers recursively (bypassing 1000 row limit)
  getAllRecursively: async (): Promise<Customer[]> => {
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;
    const allCustomers: Customer[] = [];

    while (hasMore) {
      const { data, error } = await supabase
        .from(COLS.CUSTOMERS)
        .select('*')
        .range(from, from + batchSize - 1);

      if (error) {
        console.error('Error fetching all customers recursively:', error);
        throw error;
      }

      if (data && data.length > 0) {
        allCustomers.push(...(data as Customer[]));
        from += batchSize;
        hasMore = data.length === batchSize;
      } else {
        hasMore = false;
      }
    }
    return allCustomers;
  },
  add: async (customer: Omit<Customer, 'id'>) => {
    const { data, error } = await supabase.from(COLS.CUSTOMERS).upsert(customer).select().single();
    if (error) throw error;
    return data as Customer;
  },
  update: async (id: string, customer: Partial<Customer>) => {
    const { error } = await supabase.from(COLS.CUSTOMERS).update(customer).eq('id', id);
    if (error) throw error;
  },
  getCount: async () => {
    const { count, error } = await supabase.from(COLS.CUSTOMERS).select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from(COLS.CUSTOMERS).select('*').eq('id', id).single();
    if (error) return null;
    return data as Customer;
  }
};

export const CompanyService = {
  getAll: () => fetchCollection<Company>(COLS.COMPANIES),
  add: async (company: Omit<Company, 'id'> & { id: string }) => {
    const { data, error } = await supabase.from(COLS.COMPANIES).upsert(company).select().single();
    if (error) throw error;
    return data as Company;
  },
  update: async (id: string, company: Partial<Company>) => {
    const { error } = await supabase.from(COLS.COMPANIES).update(company).eq('id', id);
    if (error) throw error;
  },
};

export const OrderService = {
  getAll: () => fetchCollection<Order>(COLS.ORDERS),

  // Fetch ALL order IDs (no limit) for duplicate checking
  getAllOrderIds: async (): Promise<string[]> => {
    const allIds: string[] = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from(COLS.ORDERS)
        .select('id')
        .range(from, from + batchSize - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        allIds.push(...data.map(row => row.id));
        from += batchSize;
        hasMore = data.length === batchSize; // Continue if we got a full batch
      } else {
        hasMore = false;
      }
    }

    return allIds;
  },

  // Paginated fetch for verification - reads ALL orders in batches
  getAllPaged: async (onBatch: (orders: Order[], batchNum: number) => void): Promise<number> => {
    let from = 0;
    const batchSize = 500;
    let hasMore = true;
    let batchNum = 0;
    let totalCount = 0;

    while (hasMore) {
      const { data, error } = await supabase
        .from(COLS.ORDERS)
        .select('*')
        .range(from, from + batchSize - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        batchNum++;
        totalCount += data.length;
        onBatch(data as Order[], batchNum);
        from += batchSize;
        hasMore = data.length === batchSize;
      } else {
        hasMore = false;
      }
    }

    return totalCount;
  },

  // Batch insert orders with retry logic
  batchInsert: async (
    orders: any[],
    batchSize: number = 200,
    onProgress?: (inserted: number, failed: number, total: number) => void
  ): Promise<{ success: number; failed: Array<{ id: string; error: string }> }> => {
    let successCount = 0;
    const failedOrders: Array<{ id: string; error: string }> = [];

    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);

      try {
        const { data, error } = await supabase
          .from(COLS.ORDERS)
          .insert(batch)
          .select();

        if (error) {
          // If batch fails, try one-by-one with retry
          for (const order of batch) {
            let retries = 2;
            let inserted = false;

            while (retries > 0 && !inserted) {
              try {
                await supabase.from(COLS.ORDERS).insert(order);
                successCount++;
                inserted = true;
              } catch (err: any) {
                retries--;
                if (retries === 0) {
                  failedOrders.push({ id: order.id, error: err.message || err.toString() });
                } else {
                  // Wait 100ms before retry
                  await new Promise(resolve => setTimeout(resolve, 100));
                }
              }
            }
          }
        } else {
          successCount += batch.length;
        }
      } catch (err: any) {
        // Batch insert failed, try individual inserts with retry
        for (const order of batch) {
          let retries = 2;
          let inserted = false;

          while (retries > 0 && !inserted) {
            try {
              await supabase.from(COLS.ORDERS).insert(order);
              successCount++;
              inserted = true;
            } catch (err: any) {
              retries--;
              if (retries === 0) {
                failedOrders.push({ id: order.id, error: err.message || err.toString() });
              } else {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
            }
          }
        }
      }

      if (onProgress) {
        onProgress(successCount, failedOrders.length, orders.length);
      }
    }

    return { success: successCount, failed: failedOrders };
  },

  // Batch upsert orders (for update/upsert mode)
  batchUpsert: async (
    orders: any[],
    batchSize: number = 200,
    onProgress?: (upserted: number, failed: number, total: number) => void
  ): Promise<{ success: number; failed: Array<{ id: string; error: string }> }> => {
    let successCount = 0;
    const failedOrders: Array<{ id: string; error: string }> = [];

    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);

      try {
        const { data, error } = await supabase
          .from(COLS.ORDERS)
          .upsert(batch, { onConflict: 'id' })
          .select();

        if (error) {
          // If batch fails, try one-by-one with retry
          for (const order of batch) {
            let retries = 2;
            let upserted = false;

            while (retries > 0 && !upserted) {
              try {
                await supabase.from(COLS.ORDERS).upsert(order, { onConflict: 'id' });
                successCount++;
                upserted = true;
              } catch (err: any) {
                retries--;
                if (retries === 0) {
                  failedOrders.push({ id: order.id, error: err.message || err.toString() });
                } else {
                  await new Promise(resolve => setTimeout(resolve, 100));
                }
              }
            }
          }
        } else {
          successCount += batch.length;
        }
      } catch (err: any) {
        // Batch upsert failed, try individual upserts with retry
        for (const order of batch) {
          let retries = 2;
          let upserted = false;

          while (retries > 0 && !upserted) {
            try {
              await supabase.from(COLS.ORDERS).upsert(order, { onConflict: 'id' });
              successCount++;
              upserted = true;
            } catch (err: any) {
              retries--;
              if (retries === 0) {
                failedOrders.push({ id: order.id, error: err.message || err.toString() });
              } else {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
            }
          }
        }
      }

      if (onProgress) {
        onProgress(successCount, failedOrders.length, orders.length);
      }
    }

    return { success: successCount, failed: failedOrders };
  },

  add: async (order: Omit<Order, 'id'>) => {
    // Use insert instead of upsert to avoid silent failures
    // If you need upsert behavior, the caller should handle it explicitly
    const { data, error } = await supabase.from(COLS.ORDERS).insert(order).select().single();
    if (error) throw error;
    return data as Order;
  },
  updateStatus: async (id: string, status: string) => {
    const { error } = await supabase.from(COLS.ORDERS).update({ status }).eq('id', id);
    if (error) throw error;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from(COLS.ORDERS).select('*').eq('id', id).single();
    if (error) return null;
    return data as Order;
  },
  update: async (id: string, data: Partial<Order>) => {
    const { error } = await supabase.from(COLS.ORDERS).update(data).eq('id', id);
    if (error) throw error;
  },
  // New method to update the JSON `items` column for a specific order
  updateOrderItems: async (orderId: string, items: any) => {
    const { error } = await supabase
      .from(COLS.ORDERS)
      .update({ items })
      .eq('id', orderId);
    if (error) throw error;
  },
  getPendingDispatch: async () => {
    const { data, error } = await supabase.from(COLS.ORDERS).select('*').eq('status', 'approved');
    if (error) throw error;
    return data as Order[];
  },
  getBySalesperson: async (spId: string) => {
    const { data, error } = await supabase.from(COLS.ORDERS).select('*').eq('salespersonId', spId);
    if (error) throw error;
    return data as Order[];
  },
  getOrdersByIds: async (ids: string[]) => {
    if (ids.length === 0) return [];
    const { data, error } = await supabase.from(COLS.ORDERS).select('*').in('id', ids);
    if (error) throw error;
    return data as Order[];
  },
  getOrdersByDateRange: async (startDate: string, endDate: string) => {
    const { data, error } = await supabase.from(COLS.ORDERS).select('*').gte('date', startDate).lte('date', endDate);
    if (error) throw error;
    return data as Order[];
  },
  getOrdersFiltered: async (startDate: string, endDate: string, salespersonId?: string) => {
    let query = supabase.from(COLS.ORDERS).select('*').gte('date', startDate).lte('date', endDate);

    if (salespersonId && salespersonId !== 'all') {
      query = query.eq('salespersonId', salespersonId);
    }

    // Order by date desc
    query = query.order('date', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data as Order[];
  },

  getOrdersByDateRangePaged: async (startDate: string, endDate: string) => {
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;
    const allOrders: Order[] = [];

    while (hasMore) {
      const { data, error } = await supabase
        .from(COLS.ORDERS)
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .range(from, from + batchSize - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        allOrders.push(...(data as Order[]));
        from += batchSize;
        hasMore = data.length === batchSize;
      } else {
        hasMore = false;
      }
    }
    return allOrders;
  },

  getOrdersFilteredPaged: async (startDate: string, endDate: string, salespersonId?: string) => {
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;
    const allOrders: Order[] = [];

    while (hasMore) {
      let query = supabase.from(COLS.ORDERS).select('*')
        .gte('date', startDate)
        .lte('date', endDate);

      if (salespersonId && salespersonId !== 'all') {
        query = query.eq('salespersonId', salespersonId);
      }

      query = query.order('date', { ascending: false });

      const { data, error } = await query.range(from, from + batchSize - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        allOrders.push(...(data as Order[]));
        from += batchSize;
        hasMore = data.length === batchSize;
      } else {
        hasMore = false;
      }
    }
    return allOrders;
  }
};

export const TripService = {
  getAll: () => fetchCollection<DispatchTrip>(COLS.TRIPS),
  getById: async (id: string) => {
    const { data, error } = await supabase.from(COLS.TRIPS).select('*').eq('id', id).single();
    if (error) return null;
    return data as DispatchTrip;
  },
  add: async (trip: Omit<DispatchTrip, 'id'>) => {
    // Generate a unique ID for the trip
    const id = `trip_${crypto.randomUUID().split('-')[0]}`;

    const { data, error } = await supabase
      .from(COLS.TRIPS)
      .insert({ ...trip, id })
      .select()
      .single();
    if (error) throw error;
    return data as DispatchTrip;
  },
  update: async (id: string, data: Partial<DispatchTrip>) => {
    const { error } = await supabase.from(COLS.TRIPS).update(data).eq('id', id);
    if (error) throw error;
  },
  getByDeliveryPerson: async (deliveryPersonId: string) => {
    const { data, error } = await supabase.from(COLS.TRIPS).select('*').eq('deliveryPersonId', deliveryPersonId).order('deliveryDate', { ascending: false });
    if (error) throw error;
    return data as DispatchTrip[];
  },

  assignOrders: async (tripId: string, orderIds: string[], currentTripData: DispatchTrip, ordersToAdd: Order[]) => {
    // 1. Prepare Trip Update
    const additionalAmount = ordersToAdd.reduce((sum, o) => sum + o.totalAmount, 0);
    const additionalCount = ordersToAdd.length;

    const newOrderIds = [...(currentTripData.orderIds || []), ...orderIds];
    const newTotalAmount = currentTripData.totalAmount + additionalAmount;
    const newTotalOrders = currentTripData.totalOrders + additionalCount;

    const { error: tripError } = await supabase.from(COLS.TRIPS).update({
      orderIds: newOrderIds,
      totalAmount: newTotalAmount,
      totalOrders: newTotalOrders
    }).eq('id', tripId);

    if (tripError) throw tripError;

    // 2. Prepare Order Updates
    // Sequential update for now
    for (const oid of orderIds) {
      const { error } = await supabase.from(COLS.ORDERS).update({ status: 'dispatched', assignedTripId: tripId }).eq('id', oid);
      if (error) console.error(`Failed to update order ${oid}`, error);
    }
  },

  removeOrder: async (tripId: string, orderId: string, currentTripData: DispatchTrip, orderData: Order) => {
    // 1. Trip Update
    const newOrderIds = currentTripData.orderIds.filter(id => id !== orderId);
    const newTotalAmount = currentTripData.totalAmount - orderData.totalAmount;
    const newTotalOrders = currentTripData.totalOrders - 1;

    const { error: tripError } = await supabase.from(COLS.TRIPS).update({
      orderIds: newOrderIds,
      totalAmount: newTotalAmount,
      totalOrders: newTotalOrders
    }).eq('id', tripId);

    if (tripError) throw tripError;

    // 2. Order Update
    const { error } = await supabase.from(COLS.ORDERS).update({ status: 'approved', assignedTripId: null }).eq('id', orderId);
    if (error) throw error;
  }
};

export const UserService = {
  getAll: () => fetchCollection<User>(COLS.USERS),
  add: async (user: Omit<User, 'id'>) => {
    const { data, error } = await supabase.from(COLS.USERS).upsert(user).select().single();
    if (error) throw error;
    return data as User;
  },
  update: async (id: string, data: Partial<User>) => {
    const { error } = await supabase.from(COLS.USERS).update(data).eq('id', id);
    if (error) throw error;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from(COLS.USERS).delete().eq('id', id);
    if (error) throw error;
  },
  getByEmail: async (email: string) => {
    const { data, error } = await supabase.from(COLS.USERS).select('*').eq('email', email);
    if (error) throw error;
    return data as User[];
  },
  getByPhone: async (phone: string) => {
    const { data, error } = await supabase.from(COLS.USERS).select('*').eq('phone', phone);
    if (error) throw error;
    return data as User[];
  }
};

export const PurchaseService = {
  getAll: () => fetchCollection<PurchaseBillSaved>(COLS.PURCHASES),
  add: async (bill: PurchaseBillSaved) => {
    const { data, error } = await supabase.from(COLS.PURCHASES).upsert(bill).select().single();
    if (error) throw error;
    return data as PurchaseBillSaved;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from(COLS.PURCHASES).select('*').eq('id', id).single();
    if (error) return null;
    return data as PurchaseBillSaved;
  }
};

export const ReturnService = {
  getAll: () => fetchCollection<SalesReturn>(COLS.RETURNS),
  add: async (ret: SalesReturn) => {
    const { data, error } = await supabase.from(COLS.RETURNS).upsert(ret).select().single();
    if (error) throw error;
    return data as SalesReturn;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from(COLS.RETURNS).select('*').eq('id', id).single();
    if (error) return null;
    return data as SalesReturn;
  }
};

export const DamageLogService = {
  getAll: () => fetchCollection<DamagedGoodsLog>(COLS.DAMAGE_LOGS),
  add: async (log: DamagedGoodsLog) => {
    const { data, error } = await supabase.from(COLS.DAMAGE_LOGS).upsert(log).select().single();
    if (error) throw error;
    return data as DamagedGoodsLog;
  }
};

export const VehicleService = {
  getAll: () => fetchVehicles(),
  add: async (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
      .from(COLS.VEHICLES)
      .insert({
        name: vehicle.name,
        registrationno: vehicle.registrationNo,
        capacitycases: vehicle.capacityCases,
        isactive: vehicle.isActive ?? true,
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    // Map database columns back to camelCase for frontend
    return {
      ...data,
      registrationNo: data.registrationno,
      capacityCases: data.capacitycases,
      isActive: data.isactive,
      createdAt: data.createdat,
      updatedAt: data.updatedat,
    } as Vehicle;
  },
  update: async (id: string, data: Partial<Vehicle>) => {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.registrationNo !== undefined) updateData.registrationno = data.registrationNo;
    if (data.capacityCases !== undefined) updateData.capacitycases = data.capacityCases;
    if (data.isActive !== undefined) updateData.isactive = data.isActive;
    updateData.updatedat = new Date().toISOString();

    const { error } = await supabase
      .from(COLS.VEHICLES)
      .update(updateData)
      .eq('id', id);
    if (error) throw error;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from(COLS.VEHICLES).delete().eq('id', id);
    if (error) throw error;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from(COLS.VEHICLES).select('*').eq('id', id).single();
    if (error) return null;
    // Map database columns back to camelCase for frontend
    return {
      ...data,
      registrationNo: data.registrationno,
      capacityCases: data.capacitycases,
      isActive: data.isactive,
      createdAt: data.createdat,
      updatedAt: data.updatedat,
    } as Vehicle;
  }
};
