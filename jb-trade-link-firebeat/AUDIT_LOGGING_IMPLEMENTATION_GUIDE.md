# Comprehensive Audit Logging System - Implementation Guide

## Overview
This guide explains how to implement and use the comprehensive audit logging system across the application to track all critical operations and debug issues like the Trip #f23 incident.

## Architecture

### Components
1. **AuditLogger Service** (`services/audit/AuditLogger.ts`)
   - Core logging functionality
   - Query helpers
   - Automatic user context capture

2. **AuditLogs Admin Page** (`pages/admin/AuditLogs.tsx`)
   - View and search audit logs
   - Filter by entity type, action, date range
   - Export to CSV
   - Drill-down into log details

3. **Database Tables** (Already exist in Supabase)
   - `audit_logs` - Main audit log table
   - `order_status_history` - Order-specific history
   - `trip_status_history` - Trip-specific history

## Implementation Steps

### Step 1: Add Route to App.tsx

```tsx
import { AuditLogsPage } from './pages/admin/AuditLogs';

// In the admin routes section:
<Route path="/admin/audit-logs" element={<AuditLogsPage />} />
```

### Step 2: Add to Admin Sidebar

In `components/layout/DashboardLayout.tsx`, add to admin navigation:

```tsx
{
  label: 'Audit Logs',
  icon: FileText,
  path: '/admin/audit-logs',
  workspace: 'admin'
}
```

### Step 3: Integrate into Existing Services

#### Order Service Updates

```tsx
// In services/db.ts - OrderService.update
import { AuditLogger } from '../audit/AuditLogger';

update: async (id: string, data: Partial<Order>) => {
  // Get old data first
  const oldOrder = await OrderService.getById(id);
  
  // Perform update
  const { error } = await supabase.from(COLS.ORDERS).update(data).eq('id', id);
  if (error) throw error;
  
  // Log the change
  await AuditLogger.log({
    action: 'ORDER_UPDATED',
    entityType: 'order',
    entityId: id,
    oldData: oldOrder,
    newData: data,
  });
},

updateStatus: async (id: string, status: string) => {
  const oldOrder = await OrderService.getById(id);
  
  const { error } = await supabase.from(COLS.ORDERS).update({ status }).eq('id', id);
  if (error) throw error;
  
  // Log status change
  await AuditLogger.logOrderStatusChange(
    id,
    oldOrder?.status || 'unknown',
    status,
    'Status updated via OrderService'
  );
},
```

#### Trip Service Updates

```tsx
// In services/db.ts - TripService.update
update: async (id: string, data: Partial<DispatchTrip>) => {
  const oldTrip = await TripService.getById(id);
  
  const { error } = await supabase.from(COLS.TRIPS).update(data).eq('id', id);
  if (error) throw error;
  
  // Log trip update
  if (data.status && oldTrip) {
    await AuditLogger.logTripStatusChange(
      id,
      oldTrip.status,
      data.status,
      'Trip status updated'
    );
  } else {
    await AuditLogger.log({
      action: 'TRIP_UPDATED',
      entityType: 'trip',
      entityId: id,
      oldData: oldTrip,
      newData: data,
    });
  }
},
```

#### Delivery Dashboard - Finish Trip

```tsx
// In pages/delivery/DeliveryDashboard.tsx - completeTrip function
const completeTrip = async (tripData: TripWithStats, action: 'direct' | 'failed' | 'reschedule') => {
  // ... existing code ...
  
  const pendingOrders = tripData.orders.filter(o => o.status !== 'delivered');
  
  // Log bulk operation BEFORE making changes
  if (action === 'failed') {
    const oldStatuses = Object.fromEntries(
      pendingOrders.map(o => [o.id, o.status])
    );
    
    await AuditLogger.logBulkOrderUpdate(
      tripData.trip.id,
      pendingOrders.map(o => o.id),
      'Mark as Failed',
      oldStatuses,
      'cancelled',
      `Trip finished with ${pendingOrders.length} pending orders marked as failed`
    );
    
    // Then perform the updates
    for (const order of pendingOrders) {
      await OrderService.update(order.id, {
        status: 'cancelled',
        remarks: `Delivery Failed - Trip finished with order pending. ${order.remarks || ''}`
      });
    }
  }
  
  // ... rest of the code ...
};
```

#### Payment Recording

```tsx
// In services/ledger/PaymentsService.ts
import { AuditLogger } from '../audit/AuditLogger';

export const recordPayment = async (paymentData: PaymentInput) => {
  const { data, error } = await supabase
    .from('invoice_payments')
    .insert(paymentData)
    .select()
    .single();
    
  if (error) throw error;
  
  // Log payment
  await AuditLogger.logPayment(
    data.id,
    paymentData.invoice_id,
    paymentData.amount,
    paymentData.method,
    'PAYMENT_RECORDED',
    {
      customerName: paymentData.customer_name,
      reference: paymentData.reference,
    }
  );
  
  return data;
};
```

### Step 4: Add Error Logging

Wrap critical operations with error logging:

```tsx
try {
  // Critical operation
  await someDangerousOperation();
} catch (error) {
  // Log the error
  await AuditLogger.logError(
    'someDangerousOperation',
    error as Error,
    {
      context: 'Additional context here',
      userId: currentUser?.id,
    }
  );
  
  // Re-throw or handle
  throw error;
}
```

## Usage Examples

### Query Audit Logs Programmatically

```tsx
// Get all changes to a specific order
const orderHistory = await AuditLogger.getEntityHistory('order', '251221-001');

// Get all actions by a specific user
const userActivity = await AuditLogger.getUserActivity('user-id-here');

// Get all changes in the last 24 hours
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const recentChanges = await AuditLogger.getChangesByDateRange(yesterday, new Date().toISOString());

// Find all bulk operations
const bulkOps = await AuditLogger.searchByAction('TRIP_ORDERS_BULK_UPDATE');
```

### Debugging Trip #f23 Type Issues

```tsx
// Find what happened to trip_f231f0a9
const tripHistory = await AuditLogger.query({
  entityType: 'trip',
  entityId: 'trip_f231f0a9',
  limit: 100,
});

// Find all bulk updates in December
const bulkUpdates = await AuditLogger.query({
  action: 'TRIP_ORDERS_BULK_UPDATE',
  startDate: '2025-12-01',
  endDate: '2025-12-31',
});

// Find who marked orders as delivered
const deliveryActions = await AuditLogger.query({
  action: 'ORDER_STATUS_CHANGED',
  startDate: '2025-12-23',
  endDate: '2025-12-24',
});
```

## Database Triggers (Optional Enhancement)

For automatic logging at the database level, you can add triggers:

```sql
-- Trigger for order status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (
      order_id,
      from_status,
      to_status,
      user_id,
      created_at
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      NEW.status_updated_by,
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_trigger
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION log_order_status_change();
```

## Best Practices

### 1. Always Log Before Dangerous Operations
```tsx
// ❌ Bad
await bulkUpdateOrders(orderIds, 'delivered');

// ✅ Good
await AuditLogger.logBulkOrderUpdate(tripId, orderIds, 'bulk update', oldStatuses, 'delivered');
await bulkUpdateOrders(orderIds, 'delivered');
```

### 2. Include Context in Metadata
```tsx
await AuditLogger.log({
  action: 'ORDER_UPDATED',
  entityType: 'order',
  entityId: orderId,
  oldData: oldOrder,
  newData: newOrder,
  metadata: {
    source: 'DeliveryDashboard',
    userRole: 'delivery',
    tripId: currentTripId,
    // Any other relevant context
  },
});
```

### 3. Log Errors for Debugging
```tsx
try {
  await criticalOperation();
} catch (error) {
  await AuditLogger.logError('criticalOperation', error as Error, {
    orderId,
    tripId,
    attemptNumber: retryCount,
  });
  throw error;
}
```

### 4. Use Specific Actions
```tsx
// ❌ Generic
await AuditLogger.log({ action: 'UPDATED', ... });

// ✅ Specific
await AuditLogger.log({ action: 'ORDER_STATUS_CHANGED', ... });
```

## Monitoring and Alerts

### Daily Audit Review
Create a daily script to check for suspicious activity:

```tsx
// Check for bulk operations
const bulkOps = await AuditLogger.searchByAction('TRIP_ORDERS_BULK_UPDATE');
if (bulkOps.data.length > 10) {
  console.warn(`High number of bulk operations detected: ${bulkOps.data.length}`);
}

// Check for errors
const errors = await AuditLogger.searchByAction('SYSTEM_ERROR');
if (errors.data.length > 0) {
  console.error(`${errors.data.length} errors logged today`);
}
```

## Compliance and Retention

### Data Retention Policy
```sql
-- Archive old logs (older than 1 year)
CREATE TABLE audit_logs_archive (LIKE audit_logs INCLUDING ALL);

-- Move old records
INSERT INTO audit_logs_archive
SELECT * FROM audit_logs
WHERE created_at < NOW() - INTERVAL '1 year';

DELETE FROM audit_logs
WHERE created_at < NOW() - INTERVAL '1 year';
```

## Troubleshooting

### Issue: Logs not appearing
1. Check if `audit_logs` table exists in Supabase
2. Verify RLS policies allow inserts
3. Check browser console for errors
4. Verify user authentication is working

### Issue: Performance degradation
1. Add indexes on frequently queried columns:
```sql
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

2. Implement pagination for large result sets
3. Archive old logs regularly

## Next Steps

1. ✅ Add route to App.tsx
2. ✅ Add to admin sidebar
3. ✅ Integrate into OrderService
4. ✅ Integrate into TripService
5. ✅ Add to DeliveryDashboard
6. ✅ Add to PaymentsService
7. ✅ Test with sample operations
8. ✅ Set up monitoring alerts
9. ✅ Train team on audit log usage

## Support

For questions or issues with the audit logging system, refer to:
- This implementation guide
- `services/audit/AuditLogger.ts` source code
- Supabase audit_logs table schema
- Admin Audit Logs page UI
