# 🎴 PHASE 3.1 - QUICK REFERENCE CARD

**Keep this open while working!**

---

## 📍 FILE LOCATIONS

| What | Where | Lines |
|------|-------|-------|
| **Types** | `/types/workflow.ts` | 193 |
| **Service** | `/services/workflow/stateManager.ts` | 343 |
| **StatusBadge** | `/components/workflow/QuickActionButtons.tsx` | 151 |
| **Modal** | `/components/workflow/StateTransitionModal.tsx` | 234 |
| **Timeline** | `/components/workflow/StatusHistoryTimeline.tsx` | 177 |
| **Buttons** | `/components/workflow/QuickActionButtons.tsx` | 151 |
| **Exports** | `/components/workflow/index.ts` | ~ |
| **Migration** | `/supabase/migrations/20251206_phase_3_1_workflow.sql` | 240 |

---

## 🔧 IMPORTS CHEAT SHEET

```typescript
// ✅ Correct imports
import { StateManager } from '@/services/workflow/stateManager';
import { OrderStatus, UserRole } from '@/types/workflow';
import { StatusBadge, QuickActionButtons, StateTransitionModal, StatusHistoryTimeline } from '@/components/workflow';

// ❌ Wrong imports (don't do this)
import StateManager from '@/services/workflow/stateManager';  // ❌ Not default export
import { StatusBadge } from '@/components/workflow/StatusBadge';  // ❌ Use index.ts
```

---

## 🎯 COMMON TASKS

### Task: Display Status with Color
```typescript
<StatusBadge status={order.status} size="md" showMessage={true} />
```

### Task: Show Valid Action Buttons
```typescript
<QuickActionButtons
  orderId={order.id}
  currentStatus={order.status}
  userRole={user.role}
  userId={user.id}
  onTransitionSuccess={(response) => {
    // Refresh order data
    refetchOrder();
  }}
/>
```

### Task: Show Transition History
```typescript
<StatusHistoryTimeline orderId={order.id} maxItems={10} />
```

### Task: Check if Transition Allowed
```typescript
if (StateManager.canTransition(currentStatus, newStatus, userRole)) {
  // Show button
}
```

### Task: Get Valid Next States
```typescript
const nextStates = StateManager.getValidTransitions(
  order.status, 
  user.role
);
// nextStates = ['DISPATCHED', 'CANCELLED']
```

### Task: Execute Transition (Advanced)
```typescript
const response = await StateManager.executeTransition({
  orderId: order.id,
  fromStatus: 'DRAFT',
  toStatus: 'APPROVED',
  userRole: user.role,
  userId: user.id,
  reason: 'Approved by manager'
});

if (response.success) {
  console.log('New status:', response.newStatus);
}
```

---

## 📊 STATUS & TRANSITIONS

### Order Statuses
```
DRAFT → APPROVED → DISPATCHED → OUT_FOR_DELIVERY → DELIVERED
                       ↓
                    FAILED → RESCHEDULED → OUT_FOR_DELIVERY
                       ↓
                    CANCELLED
                       
RETURNED ← DELIVERED (customer initiated)
DAMAGED ← DELIVERED (damaged in transit)
```

### Role Permissions
| Role | Can Do |
|------|--------|
| **admin** | All transitions |
| **manager** | Approve, Dispatch, Cancel |
| **supervisor** | Dispatch, Reassign |
| **dispatch** | Dispatch, Track |
| **delivery_agent** | Mark delivered, Report issues |
| **accountant** | View history, Audit logs |

---

## 🗄️ DATABASE QUICK LOOKUP

### Tables Created
- `audit_logs` - Immutable change log
- `order_status_history` - Order transitions
- `trip_status_history` - Trip transitions

### Key Foreign Keys
| From | To | Type |
|------|----|----|
| `order_status_history.order_id` | `orders.id` | TEXT→TEXT ✅ |
| `trip_status_history.trip_id` | `trips.id` | TEXT→TEXT ✅ |
| `audit_logs.user_id` | `auth.users.id` | UUID→UUID ✅ |

### Functions Available
- `audit_log_insert(...)` - Create audit entry
- `status_transition_validate(...)` - Validate transition

---

## 🚀 TYPICAL WORKFLOW

### Day 1 (Dec 7) - Setup
```
1. Pull latest code
2. npm run build (verify no errors)
3. Review PHASE_3_1_INTEGRATION_QUICK_START.md
4. Identify where to add components
5. Create feature branch
```

### Day 2 (Dec 8) - Integration
```
1. Import components
2. Add to JSX
3. Wire up props
4. Test in browser
5. Commit and PR
```

### Day 3 (Dec 9) - Testing
```
1. QA runs test cases
2. Log any issues
3. Developers fix bugs
4. Re-test fixes
```

### Day 4 (Dec 10) - Finalizing
```
1. All tests passing
2. Code review complete
3. Merge to main
4. Deploy to staging
```

### Day 5 (Dec 11) - Staging
```
1. Full test suite on staging
2. Performance check
3. Final approval
```

### Day 6 (Dec 12) - Production
```
1. Deploy to production
2. Smoke tests
3. Monitor 24 hours
4. Celebrate! 🎉
```

---

## 🆘 QUICK FIXES

### Issue: Import Not Found
```typescript
// Make sure this is in tsconfig.json:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Issue: Component Not Showing
```typescript
// Check:
1. Component is imported ✅
2. Component is exported from index.ts ✅
3. Props are passed correctly ✅
4. CSS classes are available ✅
```

### Issue: Database Error
```sql
-- Check RLS policies:
SELECT policyname, permissive 
FROM pg_policies 
WHERE tablename = 'order_status_history';

-- Check constraints:
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'order_status_history';
```

---

## 📖 DOCUMENTATION MAP

| Need | Doc | Time |
|------|-----|------|
| What's done? | START_HERE_PHASE_3_1.md | 5 min |
| How to integrate? | PHASE_3_1_INTEGRATION_QUICK_START.md | 30 min |
| Code examples? | PHASE_3_1_INTEGRATION_EXAMPLES.md | 30 min |
| How to test? | PHASE_3_1_TESTING_CHECKLIST.md | 30 min |
| Daily tasks? | PHASE_3_1_IMPLEMENTATION_CHECKLIST.md | 30 min |
| Full reference? | PHASE_3_1_MASTER_IMPLEMENTATION_GUIDE.md | 60 min |
| Architecture? | PHASE_3_1_IMPLEMENTATION_COMPLETE.md | 20 min |
| Database? | PHASE_3_1_DATABASE_FIX_COMPLETE.md | 20 min |
| Executive summary? | PHASE_3_1_EXECUTIVE_SUMMARY.md | 5 min |

---

## ✅ VERIFICATION CHECKLIST (Quick)

**Before you start working:**
- [ ] Latest code pulled
- [ ] `npm run build` passes
- [ ] No TypeScript errors
- [ ] Can import components
- [ ] Can import StateManager
- [ ] Database tables exist (DevOps verified)

**Before you commit:**
- [ ] Component renders
- [ ] Props passed correctly
- [ ] No console errors
- [ ] Tests pass (if you wrote tests)
- [ ] Code follows team style

**Before production:**
- [ ] All code reviewed
- [ ] All tests passing
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Rollback plan ready

---

## 🎓 KEY CONCEPTS

### State Machine
An object that can be in one of several states and transitions between them based on events and rules.

### Valid Transitions
Not all states can transition to all other states. The `VALID_TRANSITIONS` object defines what's allowed per role.

### Audit Trail
Every change is logged in `audit_logs` table. This is immutable and cannot be changed.

### RLS (Row Level Security)
Database enforces that users can only see their own data (unless they're admin/manager).

### Type Safety
Using TypeScript types ensures you can't accidentally use an invalid status or role.

---

## 💡 PRO TIPS

**Tip 1**: Always check `StateManager.canTransition()` before showing a button
```typescript
if (StateManager.canTransition(currentStatus, nextStatus, userRole)) {
  return <Button>Transition</Button>;
}
```

**Tip 2**: Use `getValidTransitions()` to dynamically generate buttons
```typescript
const validStates = StateManager.getValidTransitions(status, role);
return validStates.map(state => <Button key={state}>{state}</Button>);
```

**Tip 3**: Always include a reason when transitioning
```typescript
// Good ✅
reason: "Approved by manager on review"

// Bad ❌
reason: ""
```

**Tip 4**: Test with different user roles
- Admin can do everything
- Manager can approve/dispatch
- Delivery agent can mark delivered
- Don't forget to test denied access!

---

## 📞 GETTING HELP

**Q: Where's the code?**  
A: See "File Locations" section above

**Q: How do I use component X?**  
A: See "Common Tasks" section above, or check PHASE_3_1_INTEGRATION_EXAMPLES.md

**Q: What's the timeline?**  
A: Dec 7 (dev), Dec 8 (UI), Dec 9 (test), Dec 10 (fix), Dec 11 (staging), Dec 12 (live)

**Q: I found a bug, what do I do?**  
A: Log it with clear steps to reproduce, assign to developer, fix ASAP

**Q: Can I modify the component?**  
A: Yes! Feel free to customize colors, text, styling. Just don't change the core logic.

**Q: Database error, what do I do?**  
A: Check RLS policies first, then check foreign key types, then escalate

---

## 🏁 SUCCESS CRITERIA

By Dec 12, you should see:
- ✅ Status badges showing in UI
- ✅ Action buttons visible
- ✅ Modal opens on button click
- ✅ Transitions work
- ✅ Audit logs created
- ✅ Zero errors in console
- ✅ Tests all passing

---

**Quick Reference Card v1.0**  
**Updated**: December 6, 2025  
**For**: All team members
