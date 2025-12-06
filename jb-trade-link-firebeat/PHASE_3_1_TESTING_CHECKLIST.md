# Phase 3.1 Testing Checklist & Validation Guide

**Status**: Ready for QA Testing  
**Date**: December 6, 2025  
**Phase**: 3.1 - Status Model & Workflow Canon  
**Commit**: `eb0bafa`

---

## Table of Contents

1. [Pre-Testing Setup](#pre-testing-setup)
2. [Unit Test Checklist](#unit-test-checklist)
3. [Integration Test Checklist](#integration-test-checklist)
4. [Component Test Checklist](#component-test-checklist)
5. [End-to-End Scenarios](#end-to-end-scenarios)
6. [Performance Testing](#performance-testing)
7. [Security & Authorization Testing](#security--authorization-testing)
8. [Regression Testing](#regression-testing)
9. [Bug Report Template](#bug-report-template)

---

## Pre-Testing Setup

### Database Migration

```bash
# 1. Navigate to project root
cd /path/to/firebeat

# 2. Review migration
cat supabase/migrations/20251206_phase_3_1_workflow.sql

# 3. Apply migration to dev/staging database
supabase db push --db-url postgresql://... 

# 4. Verify tables created
psql -d your_db -c "
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('audit_logs', 'order_status_history', 'trip_status_history');"

# Expected output:
#          table_name
# ─────────────────────
#  audit_logs
#  order_status_history
#  trip_status_history
```

### Environment Verification

```bash
# 1. Check TypeScript compilation
npm run build 2>&1 | grep -E "(error|warning)" || echo "✅ No TypeScript errors"

# 2. Verify imports work
npm run test -- --run 2>&1 | head -20

# 3. Check Supabase client
node -e "
  import('@supabase/supabase-js').then(() => {
    console.log('✅ Supabase client ready');
  });
"
```

### Test Data Setup

```sql
-- Create test users
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at)
VALUES 
  ('admin-001', 'admin@test.local', '{"role":"admin"}', now(), now()),
  ('manager-001', 'manager@test.local', '{"role":"manager"}', now(), now()),
  ('dispatch-001', 'dispatch@test.local', '{"role":"dispatch"}', now(), now()),
  ('agent-001', 'agent@test.local', '{"role":"delivery_agent"}', now(), now());

-- Create test orders
INSERT INTO orders (id, customer_name, delivery_address, status, created_by)
VALUES 
  ('ORDER-001', 'Test Customer 1', '123 Main St', 'DRAFT', 'admin-001'),
  ('ORDER-002', 'Test Customer 2', '456 Oak Ave', 'APPROVED', 'manager-001'),
  ('ORDER-003', 'Test Customer 3', '789 Pine Rd', 'DISPATCHED', 'dispatch-001');
```

---

## Unit Test Checklist

### StateManager Tests

#### ✅ `canTransition()` Tests

```typescript
describe('StateManager.canTransition()', () => {
  test('Admin can transition DRAFT → APPROVED', () => {
    expect(StateManager.canTransition('DRAFT', 'APPROVED', 'admin')).toBe(true);
  });

  test('Admin can transition DRAFT → CANCELLED', () => {
    expect(StateManager.canTransition('DRAFT', 'CANCELLED', 'admin')).toBe(true);
  });

  test('Manager can transition APPROVED → DISPATCHED', () => {
    expect(StateManager.canTransition('APPROVED', 'DISPATCHED', 'manager')).toBe(true);
  });

  test('Dispatch can transition APPROVED → DISPATCHED', () => {
    expect(StateManager.canTransition('APPROVED', 'DISPATCHED', 'dispatch')).toBe(true);
  });

  test('Delivery Agent can transition OUT_FOR_DELIVERY → DELIVERED', () => {
    expect(StateManager.canTransition('OUT_FOR_DELIVERY', 'DELIVERED', 'delivery_agent')).toBe(true);
  });

  test('Delivery Agent CANNOT transition DRAFT → APPROVED', () => {
    expect(StateManager.canTransition('DRAFT', 'APPROVED', 'delivery_agent')).toBe(false);
  });

  test('Non-delivery agent CANNOT transition OUT_FOR_DELIVERY → DELIVERED', () => {
    expect(StateManager.canTransition('OUT_FOR_DELIVERY', 'DELIVERED', 'manager')).toBe(false);
  });

  test('Invalid transition returns false', () => {
    expect(StateManager.canTransition('DELIVERED', 'DRAFT', 'admin')).toBe(false);
  });

  test('Invalid status returns false', () => {
    expect(StateManager.canTransition('INVALID_STATUS' as any, 'APPROVED', 'admin')).toBe(false);
  });

  test('Invalid role returns false', () => {
    expect(StateManager.canTransition('DRAFT', 'APPROVED', 'invalid_role' as any)).toBe(false);
  });
});
```

**Run**: `npm run test -- StateManager.canTransition`

#### ✅ `getValidTransitions()` Tests

```typescript
describe('StateManager.getValidTransitions()', () => {
  test('Admin has multiple transitions from DRAFT', () => {
    const transitions = StateManager.getValidTransitions('DRAFT', 'admin');
    expect(transitions.length).toBeGreaterThan(2);
  });

  test('Delivery Agent has limited transitions from DRAFT', () => {
    const transitions = StateManager.getValidTransitions('DRAFT', 'delivery_agent');
    expect(transitions.length).toBe(0);
  });

  test('Returns array for valid status', () => {
    const transitions = StateManager.getValidTransitions('APPROVED', 'manager');
    expect(Array.isArray(transitions)).toBe(true);
  });

  test('Returns empty array for invalid status', () => {
    const transitions = StateManager.getValidTransitions('INVALID' as any, 'admin');
    expect(Array.isArray(transitions)).toBe(true);
    expect(transitions.length).toBe(0);
  });

  test('Returns empty array for invalid role', () => {
    const transitions = StateManager.getValidTransitions('DRAFT', 'invalid' as any);
    expect(Array.isArray(transitions)).toBe(true);
    expect(transitions.length).toBe(0);
  });
});
```

**Run**: `npm run test -- StateManager.getValidTransitions`

#### ✅ `getStatusMessage()` Tests

```typescript
describe('StateManager.getStatusMessage()', () => {
  test('Returns correct message for DRAFT', () => {
    expect(StateManager.getStatusMessage('DRAFT')).toBe('Draft');
  });

  test('Returns correct message for OUT_FOR_DELIVERY', () => {
    expect(StateManager.getStatusMessage('OUT_FOR_DELIVERY')).toBe('Out for Delivery');
  });

  test('Returns correct message for DELIVERED', () => {
    expect(StateManager.getStatusMessage('DELIVERED')).toBe('Delivered');
  });

  test('Returns status name if message not found', () => {
    const message = StateManager.getStatusMessage('UNKNOWN_STATUS' as any);
    expect(typeof message).toBe('string');
    expect(message.length).toBeGreaterThan(0);
  });

  test('All status types have messages', () => {
    const allStatuses: OrderStatus[] = [
      'DRAFT', 'APPROVED', 'DISPATCHED', 'OUT_FOR_DELIVERY',
      'DELIVERED', 'FAILED', 'RESCHEDULED', 'CANCELLED',
      'RETURNED', 'DAMAGED'
    ];

    allStatuses.forEach(status => {
      const message = StateManager.getStatusMessage(status);
      expect(message).toBeTruthy();
      expect(typeof message).toBe('string');
    });
  });
});
```

**Run**: `npm run test -- StateManager.getStatusMessage`

#### ✅ `validateTransitionRequirements()` Tests

```typescript
describe('StateManager.validateTransitionRequirements()', () => {
  test('DRAFT → APPROVED requires address', async () => {
    // Create order without address
    const order = await createTestOrder({
      status: 'DRAFT',
      delivery_address: null
    });

    const isValid = await StateManager.validateTransitionRequirements(
      order.id,
      'APPROVED'
    );

    expect(isValid).toBe(false);
  });

  test('APPROVED → DISPATCHED requires assigned agent', async () => {
    const order = await createTestOrder({
      status: 'APPROVED',
      assigned_agent_id: null
    });

    const isValid = await StateManager.validateTransitionRequirements(
      order.id,
      'DISPATCHED'
    );

    expect(isValid).toBe(false);
  });

  test('Valid order passes requirement check', async () => {
    const order = await createTestOrder({
      status: 'APPROVED',
      delivery_address: '123 Main St',
      assigned_agent_id: 'agent-001'
    });

    const isValid = await StateManager.validateTransitionRequirements(
      order.id,
      'DISPATCHED'
    );

    expect(isValid).toBe(true);
  });
});
```

**Run**: `npm run test -- StateManager.validateTransitionRequirements`

---

## Integration Test Checklist

### State Transition Integration Tests

#### ✅ Full Transition Flow

```typescript
describe('Full State Transition Flow', () => {
  let order: Order;
  let userId = 'admin-001';

  beforeEach(async () => {
    // Create fresh order
    order = await createTestOrder({
      status: 'DRAFT',
      delivery_address: '123 Main St'
    });
  });

  afterEach(async () => {
    await cleanupTestOrder(order.id);
  });

  test('DRAFT → APPROVED creates audit log', async () => {
    const response = await StateManager.executeTransition({
      entityId: order.id,
      entityType: 'order',
      currentStatus: 'DRAFT',
      targetStatus: 'APPROVED',
      userRole: 'admin',
      userId,
      reason: 'Approved by admin'
    });

    expect(response.success).toBe(true);

    // Verify order updated
    const updatedOrder = await getOrder(order.id);
    expect(updatedOrder.status).toBe('APPROVED');

    // Verify audit log created
    const auditLogs = await StateManager.getAuditLog(order.id);
    expect(auditLogs.length).toBeGreaterThan(0);
    expect(auditLogs[0].action).toContain('STATE_CHANGE');
  });

  test('APPROVED → DISPATCHED creates status history', async () => {
    // First transition
    await StateManager.executeTransition({
      entityId: order.id,
      entityType: 'order',
      currentStatus: 'DRAFT',
      targetStatus: 'APPROVED',
      userRole: 'admin',
      userId
    });

    // Second transition
    const response = await StateManager.executeTransition({
      entityId: order.id,
      entityType: 'order',
      currentStatus: 'APPROVED',
      targetStatus: 'DISPATCHED',
      userRole: 'dispatch',
      userId
    });

    expect(response.success).toBe(true);

    // Verify status history
    const history = await StateManager.getStatusHistory(order.id);
    expect(history.length).toBeGreaterThanOrEqual(2);
    expect(history[0].new_status).toBe('APPROVED');
    expect(history[1].new_status).toBe('DISPATCHED');
  });

  test('Concurrent transitions are serialized', async () => {
    // Attempt two concurrent transitions
    const promise1 = StateManager.executeTransition({
      entityId: order.id,
      entityType: 'order',
      currentStatus: 'DRAFT',
      targetStatus: 'APPROVED',
      userRole: 'admin',
      userId: 'user-1'
    });

    const promise2 = StateManager.executeTransition({
      entityId: order.id,
      entityType: 'order',
      currentStatus: 'DRAFT',
      targetStatus: 'CANCELLED',
      userRole: 'admin',
      userId: 'user-2'
    });

    const [result1, result2] = await Promise.allSettled([promise1, promise2]);

    // One should succeed, one should fail (status changed)
    const successCount = [result1, result2].filter(r => 
      r.status === 'fulfilled' && r.value.success
    ).length;

    expect(successCount).toBe(1);
  });
});
```

**Run**: `npm run test -- "Full State Transition Flow"`

#### ✅ Audit Log Tests

```typescript
describe('Audit Log Integration', () => {
  test('Audit log records user who made change', async () => {
    const order = await createTestOrder({ status: 'DRAFT' });
    const userId = 'manager-001';

    await StateManager.executeTransition({
      entityId: order.id,
      entityType: 'order',
      currentStatus: 'DRAFT',
      targetStatus: 'APPROVED',
      userRole: 'manager',
      userId
    });

    const logs = await StateManager.getAuditLog(order.id);
    expect(logs[0].user_id).toBe(userId);
  });

  test('Audit log records timestamp', async () => {
    const order = await createTestOrder({ status: 'DRAFT' });
    const beforeTime = new Date();

    await StateManager.executeTransition({
      entityId: order.id,
      entityType: 'order',
      currentStatus: 'DRAFT',
      targetStatus: 'APPROVED',
      userRole: 'admin',
      userId: 'admin-001'
    });

    const afterTime = new Date();
    const logs = await StateManager.getAuditLog(order.id);

    const logTime = new Date(logs[0].created_at);
    expect(logTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
    expect(logTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
  });

  test('Audit log is immutable', async () => {
    const order = await createTestOrder({ status: 'DRAFT' });

    await StateManager.executeTransition({
      entityId: order.id,
      entityType: 'order',
      currentStatus: 'DRAFT',
      targetStatus: 'APPROVED',
      userRole: 'admin',
      userId: 'admin-001'
    });

    const logs = await StateManager.getAuditLog(order.id);
    const logId = logs[0].id;

    // Try to update (should fail or be prevented by RLS)
    const { error } = await supabase
      .from('audit_logs')
      .update({ user_id: 'different-user' })
      .eq('id', logId);

    expect(error).toBeTruthy(); // Should have permission error
  });
});
```

**Run**: `npm run test -- "Audit Log Integration"`

---

## Component Test Checklist

### StatusBadge Component Tests

#### ✅ Rendering Tests

```typescript
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/shared/StatusBadge';

describe('StatusBadge Component', () => {
  test('Renders with correct status', () => {
    render(<StatusBadge status="DELIVERED" />);
    expect(screen.getByText(/delivered/i)).toBeInTheDocument();
  });

  test('Applies correct size class', () => {
    const { container } = render(<StatusBadge status="DELIVERED" size="lg" />);
    const badge = container.querySelector('[class*="text-"]');
    expect(badge).toHaveClass('text-lg');
  });

  test('Shows message when showMessage is true', () => {
    render(<StatusBadge status="OUT_FOR_DELIVERY" showMessage={true} />);
    expect(screen.getByText(/out for delivery/i)).toBeInTheDocument();
  });

  test('Hides message when showMessage is false', () => {
    const { container } = render(
      <StatusBadge status="DELIVERED" showMessage={false} />
    );
    expect(container.textContent).not.toContain('successfully');
  });

  test('Applies custom className', () => {
    const { container } = render(
      <StatusBadge status="DELIVERED" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

**Run**: `npm run test -- StatusBadge`

#### ✅ Color Tests

```typescript
describe('StatusBadge Colors', () => {
  const colorTests = [
    { status: 'DRAFT' as const, expectedBg: 'bg-gray-100' },
    { status: 'APPROVED' as const, expectedBg: 'bg-blue-100' },
    { status: 'OUT_FOR_DELIVERY' as const, expectedBg: 'bg-yellow-100' },
    { status: 'DELIVERED' as const, expectedBg: 'bg-green-100' },
    { status: 'FAILED' as const, expectedBg: 'bg-red-100' },
    { status: 'CANCELLED' as const, expectedBg: 'bg-red-100' },
  ];

  colorTests.forEach(({ status, expectedBg }) => {
    test(`${status} has correct background color`, () => {
      const { container } = render(<StatusBadge status={status} />);
      expect(container.firstChild).toHaveClass(expectedBg);
    });
  });
});
```

**Run**: `npm run test -- "StatusBadge Colors"`

---

## End-to-End Scenarios

### Scenario 1: Complete Order Lifecycle

**Test Objective**: Verify an order can progress through entire lifecycle with proper audit trail

**Steps**:
```gherkin
Feature: Complete Order Lifecycle
  Scenario: Order moves from creation to delivery
    Given an admin user is logged in
    When they create a new order with:
      | field | value |
      | customer_name | John Doe |
      | delivery_address | 123 Main St |
      | amount | 5000 |
    Then order status should be DRAFT
    And audit log should record CREATE action

    When they approve the order
    Then order status should be APPROVED
    And audit log should record STATE_CHANGE action
    And approval timestamp should be recorded

    When dispatch manager assigns delivery agent
    And dispatch manager dispatches the order
    Then order status should be DISPATCHED
    And assigned_agent_id should be set

    When delivery agent marks as out for delivery
    Then order status should be OUT_FOR_DELIVERY
    And location should be recorded

    When delivery agent confirms delivery with proof
    Then order status should be DELIVERED
    And delivery_proof_url should be saved
    And audit log should have complete history with 4+ entries
```

**Automated Test**:
```typescript
test('Complete order lifecycle', async () => {
  // Step 1: Create order
  const order = await StateManager.executeTransition({
    entityId: null,
    entityType: 'order',
    currentStatus: null,
    targetStatus: 'DRAFT',
    userRole: 'admin',
    userId: 'admin-001',
    reason: 'Order created'
  });

  // Step 2: Approve
  await StateManager.executeTransition({
    entityId: order.id,
    entityType: 'order',
    currentStatus: 'DRAFT',
    targetStatus: 'APPROVED',
    userRole: 'admin',
    userId: 'admin-001'
  });

  // Step 3: Dispatch
  await StateManager.executeTransition({
    entityId: order.id,
    entityType: 'order',
    currentStatus: 'APPROVED',
    targetStatus: 'DISPATCHED',
    userRole: 'dispatch',
    userId: 'dispatch-001'
  });

  // Step 4: Out for delivery
  await StateManager.executeTransition({
    entityId: order.id,
    entityType: 'order',
    currentStatus: 'DISPATCHED',
    targetStatus: 'OUT_FOR_DELIVERY',
    userRole: 'delivery_agent',
    userId: 'agent-001'
  });

  // Step 5: Delivered
  const finalResponse = await StateManager.executeTransition({
    entityId: order.id,
    entityType: 'order',
    currentStatus: 'OUT_FOR_DELIVERY',
    targetStatus: 'DELIVERED',
    userRole: 'delivery_agent',
    userId: 'agent-001'
  });

  // Verify final state
  expect(finalResponse.success).toBe(true);
  const finalOrder = await getOrder(order.id);
  expect(finalOrder.status).toBe('DELIVERED');

  // Verify audit trail
  const auditLog = await StateManager.getAuditLog(order.id);
  expect(auditLog.length).toBeGreaterThanOrEqual(5);
});
```

**Run**: `npm run test:e2e -- "Complete order lifecycle"`

### Scenario 2: Failed Delivery & Reschedule

**Steps**:
```
1. Order in OUT_FOR_DELIVERY
2. Delivery agent marks FAILED
3. Reason recorded
4. Admin reschedules
5. Order goes back to DISPATCHED
6. Full history preserved
```

**Run**: `npm run test:e2e -- "Failed delivery reschedule"`

### Scenario 3: Authorization Violations

**Test Objective**: Ensure unauthorized transitions are blocked

**Cases**:
```typescript
test('Delivery agent cannot approve orders', async () => {
  const order = await createTestOrder({ status: 'DRAFT' });

  const response = await StateManager.executeTransition({
    entityId: order.id,
    entityType: 'order',
    currentStatus: 'DRAFT',
    targetStatus: 'APPROVED',
    userRole: 'delivery_agent',
    userId: 'agent-001'
  });

  expect(response.success).toBe(false);
  expect(response.error).toContain('Not authorized');
});

test('Non-assigned agent cannot mark delivered', async () => {
  const order = await createTestOrder({
    status: 'OUT_FOR_DELIVERY',
    assigned_agent_id: 'agent-001'
  });

  const response = await StateManager.executeTransition({
    entityId: order.id,
    entityType: 'order',
    currentStatus: 'OUT_FOR_DELIVERY',
    targetStatus: 'DELIVERED',
    userRole: 'delivery_agent',
    userId: 'agent-002' // Different agent
  });

  expect(response.success).toBe(false);
});
```

---

## Performance Testing

### Load Testing

```typescript
describe('Performance Tests', () => {
  test('StateManager handles 1000 concurrent transitions', async () => {
    const orders = await createTestOrders(1000);
    const startTime = performance.now();

    const transitions = orders.map(order =>
      StateManager.executeTransition({
        entityId: order.id,
        entityType: 'order',
        currentStatus: 'DRAFT',
        targetStatus: 'APPROVED',
        userRole: 'admin',
        userId: 'admin-001'
      })
    );

    const results = await Promise.allSettled(transitions);
    const endTime = performance.now();

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const duration = endTime - startTime;

    console.log(`✓ ${successCount}/1000 transitions completed in ${duration}ms`);
    expect(successCount).toBeGreaterThan(990); // Allow 1% failure
    expect(duration).toBeLessThan(5000); // Should complete in under 5s
  });

  test('Audit log queries are indexed', async () => {
    const order = await createTestOrder({ status: 'DRAFT' });

    // Create 100 audit entries
    for (let i = 0; i < 100; i++) {
      await StateManager.executeTransition({
        entityId: order.id,
        entityType: 'order',
        currentStatus: i % 2 === 0 ? 'DRAFT' : 'APPROVED',
        targetStatus: i % 2 === 0 ? 'APPROVED' : 'DRAFT',
        userRole: 'admin',
        userId: 'admin-001'
      });
    }

    const startTime = performance.now();
    const logs = await StateManager.getAuditLog(order.id);
    const endTime = performance.now();

    const duration = endTime - startTime;
    console.log(`✓ Retrieved ${logs.length} audit logs in ${duration}ms`);
    expect(duration).toBeLessThan(100); // Should be very fast with index
  });
});
```

**Run**: `npm run test:performance`

---

## Security & Authorization Testing

### RLS Policy Tests

```typescript
describe('RLS Policy Tests', () => {
  test('User cannot insert audit logs directly', async () => {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        order_id: 'ORDER-001',
        action: 'MALICIOUS',
        user_id: 'hacker',
        changes: { malicious: true }
      });

    expect(error).toBeTruthy();
    expect(error.message).toContain('policy');
  });

  test('User cannot update completed audit logs', async () => {
    const order = await createTestOrder({ status: 'DRAFT' });

    await StateManager.executeTransition({
      entityId: order.id,
      entityType: 'order',
      currentStatus: 'DRAFT',
      targetStatus: 'APPROVED',
      userRole: 'admin',
      userId: 'admin-001'
    });

    const logs = await StateManager.getAuditLog(order.id);

    const { error } = await supabase
      .from('audit_logs')
      .update({ action: 'MODIFIED' })
      .eq('id', logs[0].id);

    expect(error).toBeTruthy();
  });

  test('User can only see their own audit logs', async () => {
    // Setup: Create two users with their own orders
    const order1 = await createTestOrder({ created_by: 'user-1' });
    const order2 = await createTestOrder({ created_by: 'user-2' });

    // User 1 transitions their order
    await StateManager.executeTransition({
      entityId: order1.id,
      entityType: 'order',
      currentStatus: 'DRAFT',
      targetStatus: 'APPROVED',
      userRole: 'admin',
      userId: 'user-1'
    });

    // User 2 tries to read User 1's audit log (should be blocked by RLS)
    // This test depends on RLS policy implementation
  });
});
```

---

## Regression Testing

### Phase 2 Features Compatibility

```typescript
describe('Regression Tests - Phase 2 Features', () => {
  test('QR Modal still works with new status system', async () => {
    const { queryByTestId } = render(<DeliveryOrderDetails />);
    
    // Should still be able to open QR modal
    const qrButton = queryByTestId('qr-code-button');
    expect(qrButton).toBeInTheDocument();
  });

  test('Invoice search still filters correctly', async () => {
    const { getByPlaceholderText } = render(<AllTripsModal />);
    
    const searchInput = getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
    
    // Type to filter
    fireEvent.change(searchInput, { target: { value: 'INV-001' } });
    expect(searchInput.value).toBe('INV-001');
  });

  test('Existing orders load without errors', async () => {
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .limit(10);

    expect(orders).toBeTruthy();
    expect(orders.length).toBeGreaterThan(0);

    // All orders should have valid status
    orders.forEach(order => {
      expect(['DRAFT', 'APPROVED', 'DISPATCHED', 'OUT_FOR_DELIVERY', 
              'DELIVERED', 'FAILED', 'RESCHEDULED', 'CANCELLED', 
              'RETURNED', 'DAMAGED']).toContain(order.status);
    });
  });
});
```

---

## Bug Report Template

When reporting bugs, use this template:

```markdown
## Bug Report

**Title**: [Component] Issue description

**Severity**: Critical / High / Medium / Low

**Environment**:
- OS: macOS / Windows / Linux
- Browser: Chrome / Safari / Firefox
- Node version: X.X.X
- Branch: master / develop

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Screenshots/Videos**:
[Attach if applicable]

**Console Errors**:
```
[Paste any error messages]
```

**Database State**:
```
[Paste relevant SQL query results]
```

**Test Case**:
```typescript
test('should reproduce issue', () => {
  // Minimal test case
});
```

**Related Issues**:
[Links to related issues if any]

**Possible Solution**:
[If you have ideas on how to fix this]
```

---

## Test Execution Checklist

- [ ] All unit tests pass: `npm run test -- --run`
- [ ] Integration tests pass: `npm run test:integration -- --run`
- [ ] Component tests pass: `npm run test:component -- --run`
- [ ] E2E scenarios pass: `npm run test:e2e -- --run`
- [ ] TypeScript compilation succeeds: `npm run build`
- [ ] No console errors or warnings
- [ ] No deprecated API usage
- [ ] All Supabase RLS policies verified
- [ ] Database migration applied successfully
- [ ] Audit logs created correctly
- [ ] Performance metrics acceptable
- [ ] Security tests pass
- [ ] Regression tests pass
- [ ] Production data not affected

---

## Sign-Off

- **Test Lead**: _________________ **Date**: _______
- **Code Reviewer**: _________________ **Date**: _______
- **QA Approval**: _________________ **Date**: _______
- **Deployment Ready**: ✅ / ❌

---

**Document Version**: 1.0  
**Last Updated**: December 6, 2025  
**Status**: Ready for Testing ✅
