# 🎯 Ordering System Roadmap: Feature Enhancements

**Scope**: Medium-term improvements (Month 2-3)  
**Focus**: Quick Reorder, Enhanced Search, Bulk Operations

---

## FEATURE 1: Quick Reorder System
**Effort**: 2 weeks | **Impact**: 🔥🔥🔥 VERY HIGH

### Business Case
- 70% of orders are repeat orders to the same customers
- Average order creation: 5 minutes
- With Quick Reorder: 1 minute (80% time savings)
- ROI: **4 hours saved per sales rep per week**

### User Stories

**As a Sales Rep**, I want to:
1. See customer's last order when I select them
2. One-click duplicate their previous order
3. Make quick adjustments to pre-filled cart
4. View order history to understand patterns

### Implementation

#### A. Database Changes
```sql
-- Add index for faster queries
CREATE INDEX idx_orders_customer_date 
ON orders(customerId, date DESC);

-- Optional: Add frequently_ordered flag
ALTER TABLE products ADD COLUMN frequently_ordered BOOLEAN DEFAULT false;
```

#### B. New Service Methods

```typescript
// services/db.ts - Add to OrderService

export const OrderService = {
  // ... existing methods
  
  /**
   * Get last N orders for a customer
   * @param customerId - Customer ID
   * @param limit - Number of orders to fetch (default: 5)
   */
  async getLastOrdersByCustomer(
    customerId: string, 
    limit: number = 5
  ): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customerId', customerId)
      .order('date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },
  
  /**
   * Get most recent order for customer
   */
  async getLastOrder(customerId: string): Promise<Order | null> {
    const orders = await this.getLastOrdersByCustomer(customerId, 1);
    return orders.length > 0 ? orders[0] : null;
  },
  
  /**
   * Get frequently ordered products for a customer
   * Based on order frequency in last 30 days
   */
  async getFrequentProducts(
    customerId: string, 
    days: number = 30
  ): Promise<{ productId: string; productName: string; frequency: number; avgQty: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startStr = startDate.toISOString().split('T')[0];
    
    const orders = await this.getOrdersByDateRange(
      startStr, 
      new Date().toISOString().split('T')[0]
    );
    
    const customerOrders = orders.filter(o => o.customerId === customerId);
    
    // Aggregate product frequencies
    const productMap = new Map<string, { name: string; count: number; totalQty: number }>();
    
    customerOrders.forEach(order => {
      order.items.forEach(item => {
        const existing = productMap.get(item.productId);
        if (existing) {
          existing.count++;
          existing.totalQty += item.qty;
        } else {
          productMap.set(item.productId, {
            name: item.productName,
            count: 1,
            totalQty: item.qty
          });
        }
      });
    });
    
    // Convert to array and calculate averages
    return Array.from(productMap.entries())
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        frequency: data.count,
        avgQty: Math.round(data.totalQty / data.count)
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }
};
```

#### C. UI Components

**1. Last Order Widget** (in CreateOrder.tsx)
```typescript
// Add state for last order
const [lastOrder, setLastOrder] = useState<Order | null>(null);
const [showOrderHistory, setShowOrderHistory] = useState(false);

// Load last order when customer is selected
useEffect(() => {
  if (selectedCustomer) {
    OrderService.getLastOrder(selectedCustomer).then(order => {
      setLastOrder(order);
    });
  } else {
    setLastOrder(null);
  }
}, [selectedCustomer]);

// UI: Show below customer selection
{selectedCustomer && lastOrder && (
  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex justify-between items-start mb-2">
      <div>
        <p className="text-xs text-blue-600 font-medium">Last Order</p>
        <p className="text-sm text-gray-700">
          {new Date(lastOrder.date).toLocaleDateString()} • 
          {lastOrder.items.length} items • 
          ₹{lastOrder.totalAmount.toLocaleString()}
        </p>
      </div>
      <button
        onClick={() => setShowOrderHistory(true)}
        className="text-xs text-blue-600 hover:underline"
      >
        View History
      </button>
    </div>
    
    {/* Quick Actions */}
    <div className="flex gap-2">
      <button
        onClick={() => duplicateOrder(lastOrder)}
        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
      >
        🔄 Reorder Exact
      </button>
      <button
        onClick={() => useAsTemplate(lastOrder)}
        className="flex-1 px-3 py-2 bg-white text-blue-600 text-sm font-medium border-2 border-blue-200 rounded-lg hover:bg-blue-50 active:scale-95 transition-all"
      >
        📋 Use as Template
      </button>
    </div>
  </div>
)}
```

**2. Reorder Functions**
```typescript
// Duplicate entire order
const duplicateOrder = (order: Order) => {
  // Clear existing cart
  setCart([]);
  
  // Populate cart with order items
  const newCart = order.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return null;
    
    // Recalculate pricing with current rates
    const pricing = calculateItemPricing(product, item.qty);
    
    return {
      productId: item.productId,
      productName: item.productName,
      qty: item.qty,
      rate: pricing.netRate,
      baseRate: pricing.baseRate,
      discountPct: pricing.discountPct,
      total: pricing.total,
      schemeAppliedText: pricing.schemeAppliedText,
      companyId: product.companyId,
      companyName: product.companyName,
      packetsPerCarton: product.packetsPerCarton || 1,
      piecesPerPacket: product.piecesPerPacket || 1
    };
  }).filter(item => item !== null);
  
  setCart(newCart as OrderItem[]);
  
  // Set company filter
  if (newCart.length > 0 && newCart[0]) {
    setSelectedCompany(newCart[0].companyId || '');
  }
  
  toast.success(`Loaded ${newCart.length} items from last order`);
  setIsCartOpen(true);
};

// Use as template (with adjustments)
const useAsTemplate = (order: Order) => {
  duplicateOrder(order);
  toast(`Template loaded. Review quantities and make changes.`, {
    icon: '📝',
    duration: 4000
  });
};
```

**3. Order History Modal**
```typescript
// Modal component
{showOrderHistory && selectedCustomer && (
  <Modal 
    isOpen={showOrderHistory} 
    onClose={() => setShowOrderHistory(false)}
    title="Order History"
  >
    <OrderHistoryView 
      customerId={selectedCustomer}
      onSelectOrder={(order) => {
        duplicateOrder(order);
        setShowOrderHistory(false);
      }}
    />
  </Modal>
)}

// OrderHistoryView component
interface OrderHistoryViewProps {
  customerId: string;
  onSelectOrder: (order: Order) => void;
}

const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ 
  customerId, 
  onSelectOrder 
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    OrderService.getLastOrdersByCustomer(customerId, 10).then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, [customerId]);
  
  if (loading) return <div className="p-4">Loading...</div>;
  
  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {orders.map(order => (
        <div 
          key={order.id}
          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelectOrder(order)}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-medium text-gray-900">{order.id}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-indigo-600">
                ₹{order.totalAmount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {order.items.length} items
              </p>
            </div>
          </div>
          
          {/* Show item preview */}
          <div className="text-xs text-gray-600 border-t border-gray-100 pt-2">
            {order.items.slice(0, 3).map((item, idx) => (
              <span key={idx}>
                {item.productName} ({item.qty})
                {idx < Math.min(2, order.items.length - 1) && ', '}
              </span>
            ))}
            {order.items.length > 3 && (
              <span> + {order.items.length - 3} more</span>
            )}
          </div>
          
          <button 
            className="mt-2 w-full py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded hover:bg-indigo-100"
          >
            🔄 Reorder This
          </button>
        </div>
      ))}
    </div>
  );
};
```

---

## FEATURE 2: Favorite Products / Shortcuts
**Effort**: 3 days | **Impact**: 🔥 HIGH

### Implementation

```typescript
// Add to CreateOrder.tsx

// State for favorite products (could be user-specific or customer-specific)
const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);

// Load favorites from localStorage or user preferences
useEffect(() => {
  const favs = localStorage.getItem(`favorites_${user?.id}`);
  if (favs) {
    setFavoriteProducts(JSON.parse(favs));
  }
}, [user?.id]);

// Toggle favorite
const toggleFavorite = (productId: string) => {
  setFavoriteProducts(prev => {
    const newFavs = prev.includes(productId)
      ? prev.filter(id => id !== productId)
      : [...prev, productId];
    
    localStorage.setItem(`favorites_${user?.id}`, JSON.stringify(newFavs));
    return newFavs;
  });
};

// Show favorites section
<div className="p-3 bg-yellow-50 border-b border-yellow-200">
  <h3 className="text-sm font-bold text-yellow-900 mb-2">⭐ Favorites</h3>
  <div className="flex gap-2 overflow-x-auto">
    {favoriteProducts
      .map(id => products.find(p => p.id === id))
      .filter(Boolean)
      .slice(0, 10)
      .map(product => (
        <button
          key={product!.id}
          onClick={() => addToCart(product!)}
          className="shrink-0 px-3 py-2 bg-white rounded-lg border border-yellow-300 text-sm"
        >
          {product!.name}
        </button>
      ))
    }
  </div>
</div>
```

---

## FEATURE 3: Bulk Quantity Editor
**Effort**: 1 week | **Impact**: 🔥 HIGH

### Implementation

```typescript
// Add toggle for bulk edit mode
const [bulkEditMode, setBulkEditMode] = useState(false);

// Bulk edit view (spreadsheet-like)
{bulkEditMode ? (
  <div className="p-4">
    <div className="flex justify-between mb-3">
      <h3 className="font-bold">Quick Edit Mode</h3>
      <button onClick={() => setBulkEditMode(false)}>
        ✕ Exit
      </button>
    </div>
    
    <table className="w-full">
      <thead>
        <tr className="text-left text-xs text-gray-600 border-b">
          <th className="pb-2">Product</th>
          <th className="pb-2 w-20">Qty</th>
          <th className="pb-2 text-right">Rate</th>
          <th className="pb-2 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((item, idx) => (
          <tr key={item.productId} className="border-b">
            <td className="py-2 text-sm">{item.productName}</td>
            <td>
              <input
                type="number"
                value={item.qty}
                onChange={(e) => updateQty(item.productId, parseInt(e.target.value) || 0)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Focus next input
                    const nextInput = document.querySelector(
                      `input[data-idx="${idx + 1}"]`
                    ) as HTMLInputElement;
                    nextInput?.focus();
                  }
                }}
                data-idx={idx}
                className="w-16 px-2 py-1 border rounded text-center"
              />
            </td>
            <td className="text-right text-sm">₹{item.rate}</td>
            <td className="text-right font-medium">₹{item.total.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  // Normal cart view
)}
```

---

## FEATURE 4: Smart Product Suggestions
**Effort**: 1 week | **Impact**: 🟡 MEDIUM

### "Customers also ordered" feature

```typescript
// When customer is selected, show frequently co-purchased products
const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

useEffect(() => {
  if (selectedCustomer) {
    OrderService.getFrequentProducts(selectedCustomer, 30).then(frequent => {
      const suggestions = frequent
        .slice(0, 5)
        .map(f => products.find(p => p.id === f.productId))
        .filter(Boolean);
      
      setSuggestedProducts(suggestions as Product[]);
    });
  }
}, [selectedCustomer, products]);

// Show suggestions
{suggestedProducts.length > 0 && (
  <div className="p-3 bg-green-50 border-b border-green-200">
    <h4 className="text-xs font-medium text-green-700 mb-2">
      💡 Frequently Ordered
    </h4>
    <div className="grid grid-cols-2 gap-2">
      {suggestedProducts.map(product => (
        <button
          key={product.id}
          onClick={() => addToCart(product)}
          className="p-2 bg-white rounded border border-green-200 text-left text-xs"
        >
          <p className="font-medium line-clamp-1">{product.name}</p>
          <p className="text-gray-500">₹{product.discountedRate}</p>
        </button>
      ))}
    </div>
  </div>
)}
```

---

## 📊 ANALYTICS TO ADD

Track these events for continuous improvement:

```typescript
// Track quick reorder usage
trackEvent('quick_reorder_used', {
  customerId,
  originalOrderId: lastOrder.id,
  itemsReordered: cart.length,
  timeToComplete: Date.now() - orderStartTime
});

// Track template usage
trackEvent('order_template_used', {
  templateOrderId: order.id,
  modificationsCount: changedItems.length
});

// Track favorite usage
trackEvent('favorite_product_selected', {
  productId,
  customerContext: selectedCustomer ? 'specific' : 'general'
});

// Track bulk edit mode
trackEvent('bulk_edit_mode_used', {
  itemCount: cart.length,
  timeInMode: Date.now() - bulkEditStartTime
});
```

---

## 🎯 PHASED ROLLOUT

### Phase 2A: Quick Reorder (Week 1-2)
- [ ] Implement last order fetch
- [ ] Add "Reorder" button
- [ ] Order history modal
- [ ] User testing

### Phase 2B: Enhanced Discovery (Week 3)
- [ ] Favorites system
- [ ] Suggested products
- [ ] Category tabs
- [ ] Sort options

### Phase 2C: Bulk Operations (Week 4)
- [ ] Bulk edit mode
- [ ] CSV import (advanced)
- [ ] Batch actions

---

## 🔐 SECURITY CONSIDERATIONS

1. **Data access**: Ensure sales reps only see their customers' order history
2. **Rate changes**: Alert when reordering with different prices
3. **Permission checks**: Validate user can create orders for selected customer

```typescript
// Add before reorder
if (user?.role === 'sales' && lastOrder.salespersonId !== user.id) {
  toast.error("Cannot reorder another salesperson's orders");
  return;
}

// Alert on price changes
const priceChanges = cart.filter(item => {
  const originalItem = lastOrder.items.find(i => i.productId === item.productId);
  return originalItem && Math.abs(originalItem.rate - item.rate) > 0.01;
});

if (priceChanges.length > 0) {
  toast.warning(
    `${priceChanges.length} item(s) have different prices than last order`,
    { duration: 6000 }
  );
}
```

---

## ✅ SUCCESS CRITERIA

### Metrics
- 🎯 70% of repeat customers use quick reorder
- ⚡ Average reorder time: <1 minute
- 📈 Orders per day per rep: +30%
- 😊 User satisfaction score: >4.5/5

### User Feedback
- "This saves me so much time!"
- "I can now visit more customers per day"
- "The order history is incredibly useful"

---

**Ready to build the future of sales efficiency!** 🚀
