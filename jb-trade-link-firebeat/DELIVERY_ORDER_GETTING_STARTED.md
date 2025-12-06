# 🚀 Delivery Order Management - Getting Started (5 Minutes)

## ⚡ Quick Start

### Step 1: Add Route (30 seconds)

Open `App.tsx` and add:

```tsx
import { DeliveryOrdersList } from './pages/delivery/DeliveryOrdersList';

// Inside your routes:
<Route path="/delivery/orders" element={<DeliveryOrdersList />} />
```

### Step 2: Add Navigation (30 seconds)

Add button to your delivery dashboard or menu:

```tsx
<button 
  onClick={() => navigate('/delivery/orders')}
  className="px-4 py-2 bg-blue-600 text-white rounded"
>
  📦 My Delivery Orders
</button>
```

### Step 3: Create Database Tables (2 minutes)

Run these SQL commands in Supabase:

```sql
-- Create delivery_orders table
CREATE TABLE IF NOT EXISTS delivery_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orderId TEXT NOT NULL,
  customerId TEXT NOT NULL,
  customerName TEXT NOT NULL,
  customerPhone TEXT,
  customerAddress TEXT,
  
  -- Items & amounts
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC DEFAULT 0,
  netReceivable NUMERIC DEFAULT 0,
  
  -- Delivery details
  payment JSONB,
  damages JSONB,
  salesReturn JSONB,
  delay JSONB,
  
  -- Status
  status TEXT DEFAULT 'assigned',
  
  -- Audit
  assignedToUserId TEXT NOT NULL,
  assignedToUserName TEXT NOT NULL,
  assignedDate TIMESTAMP DEFAULT NOW(),
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT status_check CHECK (status IN ('assigned', 'out_for_delivery', 'delivered', 'partially_returned', 'fully_returned', 'delayed', 'failed'))
);

-- Create order_activities table
CREATE TABLE IF NOT EXISTS order_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orderId UUID NOT NULL REFERENCES delivery_orders(id),
  action TEXT NOT NULL,
  performedByUserId TEXT NOT NULL,
  performedByUserName TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  description TEXT,
  metadata JSONB,
  
  CONSTRAINT action_check CHECK (action IN ('assigned', 'out_for_delivery', 'delivered', 'sales_return_created', 'delay_recorded', 'damage_recorded', 'payment_captured'))
);

-- Create indexes
CREATE INDEX idx_delivery_orders_user ON delivery_orders(assignedToUserId);
CREATE INDEX idx_delivery_orders_status ON delivery_orders(status);
CREATE INDEX idx_delivery_orders_date ON delivery_orders(assignedDate);
CREATE INDEX idx_order_activities_order ON order_activities(orderId);
CREATE INDEX idx_order_activities_timestamp ON order_activities(timestamp DESC);
```

### Step 4: Set RLS Policies (1 minute)

```sql
-- Enable RLS
ALTER TABLE delivery_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_activities ENABLE ROW LEVEL SECURITY;

-- Delivery users can see their orders
CREATE POLICY "Users can view their assigned orders"
  ON delivery_orders FOR SELECT
  USING (assignedToUserId = auth.uid()::text);

-- Delivery users can update their orders
CREATE POLICY "Users can update their assigned orders"
  ON delivery_orders FOR UPDATE
  USING (assignedToUserId = auth.uid()::text);

-- Activity audit trail
CREATE POLICY "Users can view order activities"
  ON order_activities FOR SELECT
  USING (orderId IN (SELECT id FROM delivery_orders WHERE assignedToUserId = auth.uid()::text));
```

### Step 5: Start Using! (1 minute)

1. Navigate to `/delivery/orders`
2. You'll see all your assigned orders as cards
3. Click action buttons: **Mark Delivered**, **Sales Return**, **Delay**
4. Fill in the form and submit
5. See success confirmation!

---

## 📊 What You Get

### Dashboard Stats
- ✅ Total Assigned - All orders for today
- ✅ Delivered - Successfully delivered
- ✅ Returns - Full/partial returns
- ✅ Total Value - Total order amount
- ✅ Received - Total payment collected

### Order Cards Show
- ✅ Customer name & order ID
- ✅ Current status (badge)
- ✅ Items list (expandable)
- ✅ Net receivable amount
- ✅ Payment status (if paid)
- ✅ Action buttons

### Three Main Actions

#### 1️⃣ Mark Delivered
```
Enter amount received (₹)
  ↓
Select payment mode (Cash/QR/Cheque/Credit)
  ↓
(Optional) Record damages
  ↓
Click "Mark Delivered"
  ↓
Order marked as delivered with payment details
```

#### 2️⃣ Sales Return
```
Choose: Full or Partial
  ↓
Select reason (customer rejected, quality, expiry, etc.)
  ↓
(If partial) Select items & quantities
  ↓
Click "Record Return"
  ↓
Refund calculated and recorded
```

#### 3️⃣ Record Delay
```
Select reason (customer not available, traffic, etc.)
  ↓
Pick rescheduled date (tomorrow - 7 days)
  ↓
(Optional) Add notes
  ↓
Click "Record Delay"
  ↓
Delivery marked as delayed
```

---

## 🎯 Example Workflow

### Order: Widget Delivery to ABC Shop

```
Order Details:
- Customer: ABC Shop
- Order ID: ORD-123
- Items: Widget A (5), Widget B (10)
- Subtotal: ₹1,000

Step 1: Deliver with Damage
┌─────────────────────┐
│ Mark Delivered      │
│ Amount: ₹900        │ (damaged 1 Widget A worth ₹100)
│ Mode: Cash          │
│ Damages: ₹100       │
└─────────────────────┘
Result: Order status = "delivered" ✓
        Payment recorded: ₹900 (cash)
        Activity logged with timestamp

Step 2: Customer wants partial return
┌─────────────────────┐
│ Sales Return        │
│ Type: Partial       │
│ Reason: Quality     │
│ Items: Widget A ×2  │ (out of 5)
│ Refund: ₹200        │
└─────────────────────┘
Result: Order status = "partially_returned" ✓
        Refund amount: ₹200
        Activity logged

Step 3: Final Status
- Net Receivable: ₹700 (after damage & return)
- Payment Received: ₹900
- Status: "delivered" ✓
```

---

## 🧮 Calculations

### How Amounts Work

```
Subtotal:       ₹1,000
- Damages:      -₹100  (broken items)
- Returns:      -₹200  (partial return)
━━━━━━━━━━━━━━━━━━━━━
Net Receivable: ₹700

Amount Collected: ₹900 (can be ≤ ₹700 or more as credit)
Balance Due: ₹0 (fully paid, even has ₹200 credit)
```

### Validation Rules

```
✓ Amount must be ≤ Net Receivable (can't charge more)
✓ Damage qty must be ≤ delivered qty
✓ Return qty must be ≤ delivered qty
✓ Delay date must be: tomorrow to 7 days from today
```

---

## 🎨 UI Preview

### List Page
```
┌─────────────────────────────────────┐
│ My Delivery Orders                  │
│                                     │
│ [🔄 Refresh]                        │
├─────────────────────────────────────┤
│ Stats: Assigned: 5 | Delivered: 2   │
│        Returns: 1 | Total: ₹50K    │
├─────────────────────────────────────┤
│ Search: ________  Filter: [Status▼] │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ ABC Shop            [Out for   │ │ │
│ │ ORD-001                ₹700    │ │ │
│ │ Items: Widget A ×5             │ │ │
│ │ Total: ₹1,000                  │ │ │
│ │                                │ │ │
│ │ [✓Deliver] [↩Return] [⏱Delay] │ │ │
│ └─────────────────────────────────┘ │ │
│ ┌─────────────────────────────────┐ │ │
│ │ XYZ Corp           [Delivered]  │ │ │
│ │ ORD-002                ₹500    │ │ │
│ │ ✓ Paid: ₹500 (Cash)            │ │ │
│ └─────────────────────────────────┘ │ │
└─────────────────────────────────────┘ │
```

### Mark Delivered Modal
```
┌───────────────────────────────┐
│ Mark Order as Delivered   [✕] │
├───────────────────────────────┤
│ Customer: ABC Shop            │
│ Order ID: ORD-001             │
│ Order Total: ₹1,000           │
│                               │
│ Amount Received: [₹___________]│
│ (Max: ₹1,000)                 │
│                               │
│ Payment Mode:                 │
│ ○ Cash  ○ QR  ○ Cheque ○Card  │
│                               │
│ + Add Damages (Optional)      │
│   Product: [Widget A▼]        │
│   Qty: [1]  Amount: [₹100]    │
│   Type: [Broken▼]            │
│   [+ Add Damage]              │
│                               │
│ Balance: ₹0 (Paid)            │
│                               │
│ [Cancel] [Mark Delivered]     │
└───────────────────────────────┘
```

---

## 💾 Sample Data

To test, create an order with this structure:

```typescript
{
  id: 'ord-123',
  orderId: 'ORD-001',
  customerId: 'cust-456',
  customerName: 'ABC Shop',
  items: [
    { productId: 'prod-1', productName: 'Widget A', qty: 5, rate: 100, total: 500 },
    { productId: 'prod-2', productName: 'Widget B', qty: 10, rate: 50, total: 500 }
  ],
  subtotal: 1000,
  netReceivable: 1000,
  status: 'assigned',
  assignedToUserId: 'user-123',
  assignedToUserName: 'John Delivery',
  assignedDate: '2025-12-05T08:00:00Z'
}
```

---

## ✅ Verification Checklist

- [ ] Route added to App.tsx
- [ ] Navigation button added
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] Can navigate to `/delivery/orders`
- [ ] See "My Delivery Orders" title
- [ ] See stat cards
- [ ] See sample orders (if data exists)
- [ ] Can click "Mark Delivered"
- [ ] Modal opens correctly
- [ ] Can fill form and submit

---

## 🐛 Troubleshooting

### Page is blank
**Fix**: 
- Check route is added correctly
- Verify user is logged in
- Check browser console for errors
- Refresh page

### No orders showing
**Fix**:
- Check database has data
- Verify user role is 'delivery'
- Check RLS policies
- Verify assignedToUserId matches current user

### Modal won't open
**Fix**:
- Check console for errors
- Verify component imports
- Check modal props

### Validation errors
**Fix**:
- Check amount is numeric
- Check amount ≤ netReceivable
- Verify payment mode is selected
- See validation rules above

---

## 📚 Learn More

For detailed information:

| Document | Purpose |
|----------|---------|
| DELIVERY_ORDER_MANAGEMENT_GUIDE.md | Complete guide (800+ lines) |
| DELIVERY_ORDER_QUICK_REFERENCE.md | Quick reference |
| DELIVERY_ORDER_IMPLEMENTATION_SUMMARY.md | Implementation details |
| /types/delivery-order.ts | Type definitions |
| /lib/delivery-order-logic.ts | Business logic |
| /services/delivery-orders.ts | API services |

---

## 📞 Key Files

```
/types/delivery-order.ts         # Types (267 lines)
/lib/delivery-order-logic.ts     # Logic (400+ lines)
/services/delivery-orders.ts     # API (350+ lines)
/components/delivery/
  ├── MarkDeliveredModal.tsx     # Delivery (280+ lines)
  ├── SalesReturnModal.tsx       # Return (240+ lines)
  └── DelayModal.tsx             # Delay (240+ lines)
/pages/delivery/
  └── DeliveryOrdersList.tsx     # List page (460+ lines)
/__tests__/
  └── delivery-order-logic.test.ts # Tests (350+ lines)
```

---

## 🎓 Common Tasks

### Task: View Orders
```
1. Go to /delivery/orders
2. See all your assigned orders
3. Cards show customer, items, amount
```

### Task: Mark as Delivered
```
1. Find order card
2. Click "✓ Mark Delivered"
3. Enter amount received
4. Select payment mode
5. Click "Mark Delivered"
6. See success message
7. Order status changes to "delivered"
```

### Task: Record Return
```
1. Find order card
2. Click "↩ Sales Return"
3. Choose Full or Partial
4. Select reason
5. If partial: select items
6. Click "Record Return"
7. See refund amount
```

### Task: Record Delay
```
1. Find order card
2. Click "⏱ Record Delay"
3. Select reason
4. Pick rescheduled date
5. Click "Record Delay"
6. Order marked as delayed
```

---

## ⚡ Performance Tips

### Optimize Loading
- Add pagination for many orders
- Use date range filters
- Cache statistics

### Database Indexes
Already included in setup:
```sql
CREATE INDEX idx_delivery_orders_user ON delivery_orders(assignedToUserId);
CREATE INDEX idx_delivery_orders_status ON delivery_orders(status);
CREATE INDEX idx_order_activities_order ON order_activities(orderId);
```

---

## 🎉 You're Ready!

**Setup Time**: ~5 minutes  
**Features**: ✅ Complete  
**Documentation**: ✅ Included  
**Tests**: ✅ Passing  
**Status**: 🟢 **PRODUCTION READY**

Start using immediately or see detailed guides for advanced features!

---

**Questions?** Check:
- DELIVERY_ORDER_MANAGEMENT_GUIDE.md (detailed)
- DELIVERY_ORDER_QUICK_REFERENCE.md (quick lookup)
- Code comments in each file

**Last Updated**: December 5, 2025  
**Version**: 1.0.0
