
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

// Module-level caches for static/semi-static data
let cachedCustomers: Customer[] | null = null;
let cachedProducts: Product[] | null = null;
let cachedCompanies: Company[] | null = null;
let cachedUsers: User[] | null = null;

// Helper to standardize response
// NOTE: Session is verified at boot time. We trust it's valid here.
// If session expires, Supabase will return 401 and we handle it globally.
const fetchCollection = async <T>(colName: string): Promise<T[]> => {
  try {
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
// NOTE: Session is verified at boot time. We trust it's valid here.
const fetchVehicles = async (): Promise<Vehicle[]> => {
  try {
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

// Helper to enhance order data with phone numbers and other metadata from linked tables
const enrichOrders = async (orders: Order[]): Promise<Order[]> => {
  if (!orders || orders.length === 0) return [];

  try {
    // Collect unique IDs
    const customerIds = Array.from(new Set(orders.map(o => o.customerId).filter(Boolean)));
    const salespersonIds = Array.from(new Set(orders.map(o => o.salespersonId).filter(Boolean)));
    const salespersonNames = Array.from(new Set(orders.map(o => o.salespersonName).filter(Boolean)));

    // Fetch data in parallel
    const fetchUsers = async () => {
      if (salespersonIds.length === 0 && salespersonNames.length === 0) return { data: [] };

      const filters = [];
      if (salespersonIds.length > 0) filters.push(`id.in.("${salespersonIds.join('","')}")`);
      if (salespersonNames.length > 0) filters.push(`name.in.("${salespersonNames.join('","')}")`);

      return supabase.from(COLS.USERS).select('id, name, phone').or(filters.join(','));
    };

    const [customersRes, usersRes] = await Promise.all([
      customerIds.length > 0 ? supabase.from(COLS.CUSTOMERS).select('id, phone, panNumber, locationText, routeName').in('id', customerIds) : Promise.resolve({ data: [] }),
      fetchUsers()
    ]);

    const customerMap = new Map((customersRes.data || []).map(c => [c.id, c]));
    const userMap = new Map((usersRes.data || []).map(u => [u.id, u]));
    const userNameMap = new Map((usersRes.data || []).map(u => [u.name, u]));

    return orders.map(o => {
      const cust = customerMap.get(o.customerId) as any;
      const user = userMap.get(o.salespersonId) || userNameMap.get(o.salespersonName);

      return {
        ...o,
        customerPhone: cust?.phone || o.customerPhone,
        customerPAN: cust?.panNumber || o.customerPAN,
        customerLocation: cust?.locationText || cust?.routeName || o.customerLocation,
        salespersonPhone: user?.phone || o.salespersonPhone
      };
    });
  } catch (err) {
    console.error('[enrichOrders] Failed to enrich orders:', err);
    return orders; // Return original orders if enrichment fails
  }
};

export const ProductService = {
  getAll: async () => {
    if (cachedProducts) return cachedProducts;
    const products = await fetchCollection<Product>(COLS.PRODUCTS);
    cachedProducts = products;
    return products;
  },
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
    const newProd = data as Product;
    if (cachedProducts) {
      cachedProducts.push(newProd);
    }
    return newProd;
  },
  update: async (id: string, product: Partial<Product>) => {
    const { error } = await supabase.from(COLS.PRODUCTS).update(product).eq('id', id);
    if (error) throw error;
    if (cachedProducts) {
      const idx = cachedProducts.findIndex(p => p.id === id);
      if (idx !== -1) {
        cachedProducts[idx] = { ...cachedProducts[idx], ...product };
      }
    }
  },
  delete: async (id: string) => {
    const { error } = await supabase.from(COLS.PRODUCTS).delete().eq('id', id);
    if (error) throw error;
    if (cachedProducts) {
      cachedProducts = cachedProducts.filter(p => p.id !== id);
    }
  }
};

export const CustomerService = {
  getAll: () => CustomerService.getAllRecursively(),
  // New method to fetch ALL customers recursively (bypassing 1000 row limit)
  getAllRecursively: async (): Promise<Customer[]> => {
    if (cachedCustomers) {
      console.log('[CustomerService] Returning cached customers:', cachedCustomers.length);
      return cachedCustomers;
    }
    const batchSize = 1000;

    try {
      // 1. Get total count first
      const { count, error: countError } = await supabase
        .from(COLS.CUSTOMERS)
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      const total = count || 0;
      if (total === 0) return [];

      console.log(`[CustomerService] Fetching ${total} customers in parallel batches...`);

      // 2. Prepare all ranges
      const ranges: { from: number; to: number }[] = [];
      for (let i = 0; i < total; i += batchSize) {
        ranges.push({ from: i, to: Math.min(i + batchSize - 1, total - 1) });
      }

      // 3. Fetch all batches in parallel (limited by browser/Supabase concurrency)
      const results = await Promise.all(
        ranges.map(range =>
          supabase
            .from(COLS.CUSTOMERS)
            .select('*')
            .range(range.from, range.to)
            .then(res => {
              if (res.error) throw res.error;
              return res.data as Customer[];
            })
        )
      );

      const allCustomers = results.flat();
      console.log(`[CustomerService] Successfully loaded ${allCustomers.length} customers.`);
      cachedCustomers = allCustomers;
      return allCustomers;
    } catch (error) {
      console.error('Error fetching customers in parallel:', error);
      // Fallback to sequential if something goes wrong with parallel
      return CustomerService.getAllSequential();
    }
  },

  getAllSequential: async (): Promise<Customer[]> => {
    if (cachedCustomers) return cachedCustomers;
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;
    const allCustomers: Customer[] = [];

    console.log('[CustomerService] Falling back to sequential fetch...');
    while (hasMore) {
      const { data, error } = await supabase
        .from(COLS.CUSTOMERS)
        .select('*')
        .range(from, from + batchSize - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        allCustomers.push(...(data as Customer[]));
        from += batchSize;
        hasMore = data.length === batchSize;
      } else {
        hasMore = false;
      }
    }
    cachedCustomers = allCustomers;
    return allCustomers;
  },
  add: async (customer: Omit<Customer, 'id'>) => {
    // Let Supabase generate the UUID automatically
    const { data, error } = await supabase
      .from(COLS.CUSTOMERS)
      .insert(customer)
      .select()
      .single();
    if (error) throw error;
    const newCust = data as Customer;
    if (cachedCustomers) {
      cachedCustomers.push(newCust);
    }
    return newCust;
  },
  update: async (id: string, customer: Partial<Customer>) => {
    const { error } = await supabase.from(COLS.CUSTOMERS).update(customer).eq('id', id);
    if (error) throw error;
    if (cachedCustomers) {
      const idx = cachedCustomers.findIndex(c => c.id === id);
      if (idx !== -1) {
        cachedCustomers[idx] = { ...cachedCustomers[idx], ...customer };
      }
    }
  },
  getCount: async () => {
    if (cachedCustomers) return cachedCustomers.length;
    const { count, error } = await supabase.from(COLS.CUSTOMERS).select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count;
  },
  getById: async (id: string) => {
    if (cachedCustomers) {
      const cached = cachedCustomers.find(c => c.id === id);
      if (cached) return cached;
    }
    const { data, error } = await supabase.from(COLS.CUSTOMERS).select('*').eq('id', id).single();
    if (error) return null;
    return data as Customer;
  },
  getCustomersByIds: async (ids: string[]): Promise<Customer[]> => {
    if (ids.length === 0) return [];
    if (cachedCustomers) {
      const fromCache = ids.map(id => cachedCustomers!.find(c => c.id === id)).filter(Boolean) as Customer[];
      if (fromCache.length === ids.length) return fromCache;
    }
    const { data, error } = await supabase
      .from(COLS.CUSTOMERS)
      .select('*')
      .in('id', ids);
    if (error) throw error;
    const list = data as Customer[];
    if (cachedCustomers) {
      for (const c of list) {
        if (!cachedCustomers.some(cc => cc.id === c.id)) {
          cachedCustomers.push(c);
        }
      }
    }
    return list;
  },
  search: async (query: string, limit: number = 30): Promise<Customer[]> => {
    try {
      const clean = query ? query.trim().replace(/,/g, ' ') : '';
      let builder = supabase
        .from(COLS.CUSTOMERS)
        .select('id, name, phone, panNumber, routeName, locationText, latitude, longitude, isActive, status');

      if (clean) {
        builder = builder.or(`name.ilike.%${clean}%,phone.ilike.%${clean}%,routeName.ilike.%${clean}%,panNumber.ilike.%${clean}%`);
      }

      const { data, error } = await builder.order('name').limit(limit);
      if (error) throw error;
      return (data || []) as Customer[];
    } catch (err) {
      console.error('Error searching customers:', err);
      return [];
    }
  },
  getPaged: async (page: number = 0, limit: number = 50, search: string = ''): Promise<{ data: Customer[]; total: number }> => {
    try {
      const from = page * limit;
      const to = from + limit - 1;
      const clean = search ? search.trim() : '';

      let builder = supabase
        .from(COLS.CUSTOMERS)
        .select('*', { count: 'exact' });

      if (clean) {
        builder = builder.or(`name.ilike.%${clean}%,phone.ilike.%${clean}%,routeName.ilike.%${clean}%,panNumber.ilike.%${clean}%`);
      }

      const { data, count, error } = await builder.order('name').range(from, to);
      if (error) throw error;
      return { data: (data || []) as Customer[], total: count || 0 };
    } catch (err) {
      console.error('Error fetching paged customers:', err);
      return { data: [], total: 0 };
    }
  }
};

export const CompanyService = {
  getAll: async () => {
    if (cachedCompanies) return cachedCompanies;
    const companies = await fetchCollection<Company>(COLS.COMPANIES);
    cachedCompanies = companies;
    return companies;
  },
  add: async (company: Omit<Company, 'id'> & { id: string }) => {
    const { data, error } = await supabase.from(COLS.COMPANIES).upsert(company).select().single();
    if (error) throw error;
    const newComp = data as Company;
    if (cachedCompanies) {
      const idx = cachedCompanies.findIndex(c => c.id === company.id);
      if (idx !== -1) {
        cachedCompanies[idx] = newComp;
      } else {
        cachedCompanies.push(newComp);
      }
    }
    return newComp;
  },
  update: async (id: string, company: Partial<Company>) => {
    const { error } = await supabase.from(COLS.COMPANIES).update(company).eq('id', id);
    if (error) throw error;
    if (cachedCompanies) {
      const idx = cachedCompanies.findIndex(c => c.id === id);
      if (idx !== -1) {
        cachedCompanies[idx] = { ...cachedCompanies[idx], ...company };
      }
    }
  },
};

export const OrderService = {
  getAll: () => fetchCollection<Order>(COLS.ORDERS),

  getUnknownCleanupOrders: async (): Promise<any[]> => {
    // Only select id and items to minimize egress
    const { data, error } = await supabase
      .from(COLS.ORDERS)
      .select('id, items');
    if (error) throw error;
    return data;
  },

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
        const enrichedBatch = await enrichOrders(data as Order[]);
        onBatch(enrichedBatch, batchNum);
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

  add: async (order: Omit<Order, 'id'> | Order) => {
    // Use insert instead of upsert to avoid silent failures
    // If you need upsert behavior, the caller should handle it explicitly
    console.log('[OrderService.add] Attempting to insert order:', JSON.stringify(order, null, 2));
    const { data, error } = await supabase.from(COLS.ORDERS).insert(order).select().single();
    if (error) {
      console.error('[OrderService.add] Insert failed:', error);
      throw error;
    }
    console.log('[OrderService.add] Order inserted successfully:', data?.id);
    return data as Order;
  },
  updateStatus: async (id: string, status: string) => {
    const { error } = await supabase.from(COLS.ORDERS).update({ status }).eq('id', id);
    if (error) throw error;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from(COLS.ORDERS).select('*').eq('id', id).single();
    if (error) return null;
    const enriched = await enrichOrders([data as Order]);
    return enriched[0];
  },
  update: async (id: string, data: Partial<Order>) => {
    // SECURITY: Prevent editing sensitive fields (Stock/Amount) if trip is loaded
    // We allow status updates and payments as those happen during delivery
    const sensitiveFields = ['items', 'totalAmount', 'qty', 'products'];
    const isSensitiveUpdate = Object.keys(data).some(k => sensitiveFields.includes(k));
    const isDeliveryAction = data.status === 'delivered' || data.status === 'cancelled';

    if (isSensitiveUpdate && !isDeliveryAction) {
      const { data: currentOrder } = await supabase.from(COLS.ORDERS).select('assignedTripId, status').eq('id', id).single();

      // Only block if trip is loaded AND the order isn't already in a delivery/final state
      if (currentOrder?.assignedTripId && currentOrder.status !== 'delivered' && currentOrder.status !== 'cancelled') {
        const { count } = await supabase.from('trip_loads').select('*', { count: 'exact', head: true }).eq('trip_id', currentOrder.assignedTripId);
        if (count && count > 0) {
          throw new Error("Cannot edit order content: Truck is already loaded. Please remove order from trip first.");
        }
      }
    }

    const { error } = await supabase.from(COLS.ORDERS).update(data).eq('id', id);
    if (error) throw error;
  },
  // New method to update the JSON `items` column for a specific order
  updateOrderItems: async (orderId: string, items: any) => {
    // SECURITY: Prevent editing items if trip is loaded
    const { data: currentOrder } = await supabase.from(COLS.ORDERS).select('assignedTripId').eq('id', orderId).single();
    if (currentOrder?.assignedTripId) {
      const { count } = await supabase.from('trip_loads').select('*', { count: 'exact', head: true }).eq('trip_id', currentOrder.assignedTripId);
      if (count && count > 0) {
        throw new Error("Cannot edit items: Truck is already loaded. Please remove order from trip first.");
      }
    }

    const { error } = await supabase
      .from(COLS.ORDERS)
      .update({ items })
      .eq('id', orderId);
    if (error) throw error;
  },
  getPendingDispatch: async (date?: string) => {
    let query = supabase.from(COLS.ORDERS).select('*').eq('status', 'approved');

    // If date is provided, filter at database level
    if (date) {
      // Column is type 'date', so we use strict equality
      query = query.eq('date', date);
    }

    const { data, error } = await query.order('id', { ascending: true });
    if (error) throw error;
    return enrichOrders(data as Order[]);
  },
  getBySalesperson: async (spId: string) => {
    const { data, error } = await supabase.from(COLS.ORDERS).select('*').eq('salespersonId', spId);
    if (error) throw error;
    return enrichOrders(data as Order[]);
  },
  getOrdersByIds: async (ids: string[]) => {
    if (ids.length === 0) return [];
    const { data, error } = await supabase.from(COLS.ORDERS).select('*').in('id', ids);
    if (error) throw error;
    return enrichOrders(data as Order[]);
  },
  getOrdersByDateRange: async (startDate: string, endDate: string) => {
    const { data, error } = await supabase.from(COLS.ORDERS).select('*').gte('date', startDate).lte('date', endDate);
    if (error) throw error;
    return enrichOrders(data as Order[]);
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
    return enrichOrders(data as Order[]);
  },

  // PHASE 1: Get last order for a customer
  getLastOrder: async (customerId: string): Promise<Order | null> => {
    const { data, error } = await supabase
      .from(COLS.ORDERS)
      .select('*')
      .eq('customerId', customerId)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (error) return null;
    return data as Order;
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
    return enrichOrders(allOrders);
  },

  delete: async (id: string) => {
    const { error } = await supabase.from(COLS.ORDERS).delete().eq('id', id);
    if (error) throw error;
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
  getByDateRange: async (startDate: string, endDate: string) => {
    const { data, error } = await supabase
      .from(COLS.TRIPS)
      .select('*')
      .gte('deliveryDate', startDate)
      .lte('deliveryDate', endDate);
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

    // 3. STOCK ADJUSTMENT: Check if trip was already loaded. If so, reduce phantom load.
    // This prevents "Missing Stock" variances when orders are removed after loading.
    const { count } = await supabase
      .from('trip_loads')
      .select('*', { count: 'exact', head: true })
      .eq('trip_id', tripId);

    if (count && count > 0) {
      console.log(`[TripService] Trip ${tripId} is loaded. Adjusting stock for removed order ${orderId}...`);

      let items = orderData.items;
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch (e) { items = []; }
      }

      if (Array.isArray(items)) {
        for (const item of items) {
          const productId = (item as any).productId || (item as any).product_id;
          const qty = Number((item as any).qty || (item as any).quantity) || 0;

          if (productId && qty > 0) {
            // Decrement specific product load
            // We can't use simple .decrement() rpc easily without setup, so we fetch-update
            const { data: currentLoad } = await supabase
              .from('trip_loads')
              .select('qty_loaded')
              .eq('trip_id', tripId)
              .eq('product_id', productId)
              .single();

            if (currentLoad) {
              const newQty = Math.max(0, currentLoad.qty_loaded - qty);
              // If 0, we could delete, but keeping 0 is safer for logs. 
              // Actually, let's keep 0 to show it was there.
              await supabase
                .from('trip_loads')
                .update({ qty_loaded: newQty })
                .eq('trip_id', tripId)
                .eq('product_id', productId);
            }
          }
        }
      }
    }
  },

  removeOrders: async (tripId: string, orderIdsToRemove: string[], currentTripData: DispatchTrip, ordersDataToRemove: Order[]) => {
    // 1. Trip Update
    const newOrderIds = currentTripData.orderIds.filter(id => !orderIdsToRemove.includes(id));
    const amountToRemove = ordersDataToRemove.reduce((sum, o) => sum + o.totalAmount, 0);
    const newTotalAmount = currentTripData.totalAmount - amountToRemove;
    const newTotalOrders = currentTripData.totalOrders - orderIdsToRemove.length;

    const { error: tripError } = await supabase.from(COLS.TRIPS).update({
      orderIds: newOrderIds,
      totalAmount: newTotalAmount,
      totalOrders: newTotalOrders
    }).eq('id', tripId);

    if (tripError) throw tripError;

    // 2. Order Update
    const { error } = await supabase.from(COLS.ORDERS).update({ status: 'approved', assignedTripId: null }).in('id', orderIdsToRemove);
    if (error) throw error;

    // 3. STOCK ADJUSTMENT: Check if trip was already loaded.
    const { count } = await supabase
      .from('trip_loads')
      .select('*', { count: 'exact', head: true })
      .eq('trip_id', tripId);

    if (count && count > 0) {
      console.log(`[TripService] Trip ${tripId} is loaded. Adjusting stock for ${orderIdsToRemove.length} removed orders...`);

      // Aggregate all items to remove
      const productQtyToRemove = new Map<string, number>();

      for (const order of ordersDataToRemove) {
        let items = order.items;
        if (typeof items === 'string') {
          try { items = JSON.parse(items); } catch (e) { items = []; }
        }

        if (Array.isArray(items)) {
          for (const item of items) {
            const productId = (item as any).productId || (item as any).product_id;
            const qty = Number((item as any).qty || (item as any).quantity) || 0;
            if (productId && qty > 0) {
              const current = productQtyToRemove.get(productId) || 0;
              productQtyToRemove.set(productId, current + qty);
            }
          }
        }
      }

      // Apply updates
      for (const [productId, qtyToRemove] of productQtyToRemove.entries()) {
        const { data: currentLoad } = await supabase
          .from('trip_loads')
          .select('qty_loaded')
          .eq('trip_id', tripId)
          .eq('product_id', productId)
          .single();

        if (currentLoad) {
          const newQty = Math.max(0, currentLoad.qty_loaded - qtyToRemove);
          await supabase
            .from('trip_loads')
            .update({ qty_loaded: newQty })
            .eq('trip_id', tripId)
            .eq('product_id', productId);
        }
      }
    }
  }
};

export const UserService = {
  getAll: async () => {
    if (cachedUsers) return cachedUsers;
    const users = await fetchCollection<User>(COLS.USERS);
    cachedUsers = users;
    return users;
  },
  add: async (user: Omit<User, 'id'>) => {
    // 1. Create entry in public.users table
    const { data: profile, error } = await supabase.from(COLS.USERS).upsert(user).select().single();
    if (error) throw error;
    
    const newUserObj = profile as User;
    if (cachedUsers) {
      const idx = cachedUsers.findIndex(u => u.id === newUserObj.id);
      if (idx !== -1) {
        cachedUsers[idx] = newUserObj;
      } else {
        cachedUsers.push(newUserObj);
      }
    }

    // 2. Automatically create entry in Auth system (Backfill)
    if (profile && profile.email) {
      try {
        console.log('[UserService.add] Registering user in Auth system...');
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-update-password`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: profile.id,
                email: profile.email
                // Edge function will generate random password if not provided
              })
            }
          );
        }
      } catch (e) {
        console.warn('[UserService.add] Auth registration background call failed:', e);
        // We don't throw here - the profile is created, and the admin can set password manually later if this fails
      }
    }

    return newUserObj;
  },
  update: async (id: string, data: Partial<User>) => {
    // If email is being updated, use the Edge Function which has service role access
    if (data.email) {
      try {
        // Refresh session first to ensure fresh token
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.warn('Session refresh failed:', refreshError.message);
        }

        // Get current session for auth header
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = refreshData?.session?.access_token || sessionData?.session?.access_token;

        if (!accessToken) {
          console.error('No access token available');
          throw new Error('Your session has expired. Please log out and log back in.');
        }

        console.log('[UserService.update] Calling Edge Function to update email...');

        // Call the Edge Function to update email in auth.users
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-update-password`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: id,
              newEmail: data.email
            })
          }
        );

        const result = await response.json();
        if (result.error) {
          console.error('Failed to update auth email via Edge Function:', result.error);
          throw new Error(result.error);
        }
        console.log('Auth email updated successfully via Edge Function:', result.message);

        // Edge Function already updates the users table, so we can skip that
        // But still update other fields if present
        const { email: _, ...otherData } = data;
        if (Object.keys(otherData).length > 0) {
          const { error } = await supabase.from(COLS.USERS).update(otherData).eq('id', id);
          if (error) throw error;
        }

        if (cachedUsers) {
          const idx = cachedUsers.findIndex(u => u.id === id);
          if (idx !== -1) {
            cachedUsers[idx] = { ...cachedUsers[idx], ...data };
          }
        }
        return; // Exit early - email update handled by Edge Function
      } catch (authUpdateError) {
        console.error('Error updating auth email:', authUpdateError);
        throw authUpdateError; // Don't silently fail - user needs to know
      }
    }

    // Update the public.users table
    const { error } = await supabase.from(COLS.USERS).update(data).eq('id', id);
    if (error) throw error;

    if (cachedUsers) {
      const idx = cachedUsers.findIndex(u => u.id === id);
      if (idx !== -1) {
        cachedUsers[idx] = { ...cachedUsers[idx], ...data };
      }
    }
  },
  delete: async (id: string) => {
    const { error } = await supabase.from(COLS.USERS).delete().eq('id', id);
    if (error) throw error;
    if (cachedUsers) {
      cachedUsers = cachedUsers.filter(u => u.id !== id);
    }
  },
  getByEmail: async (email: string) => {
    if (cachedUsers) {
      const list = cachedUsers.filter(u => u.email === email);
      if (list.length > 0) return list;
    }
    const { data, error } = await supabase.from(COLS.USERS).select('*').eq('email', email);
    if (error) throw error;
    return data as User[];
  },
  getByPhone: async (phone: string) => {
    if (cachedUsers) {
      const list = cachedUsers.filter(u => u.phone === phone);
      if (list.length > 0) return list;
    }
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
