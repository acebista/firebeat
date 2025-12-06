# 📋 FireBeat DMS - Phase 3+ Roadmap

**Date**: December 6, 2025  
**Status**: Planning & Prioritization  
**Current**: Phase 2 Complete (QR Modal + Invoice Search)  
**Next**: Phase 3 Implementation Planning

---

## 🎯 Implementation Roadmap (9 Major Areas)

### Priority Matrix

```
IMPACT vs EFFORT

High Impact | Phase 3.1 (Data Model)      | Phase 3.2 (Dispatch)
            | Phase 3.3 (Delivery Closure)| Phase 3.4 (CSV Import)
            |                             |
Medium      | Phase 3.5 (Status Model)    | Phase 3.6 (Dashboards)
Impact      |                             | Phase 3.7 (Route Map)
            |                             |
Low         | Phase 3.8 (Search)          | Phase 3.9 (Access/Obs)
Impact      |                             |
            └─────────────────────────────┘
            Low Effort              High Effort
```

### Recommended Execution Order

#### **Phase 3.1: Status Model & Workflow Canon** (Foundation)
**Priority**: 🔴 **FIRST** - Everything depends on this  
**Effort**: Medium  
**Impact**: High  
**Timeline**: 2-3 weeks

**Deliverables**:
- [ ] State machines in `types/workflow.ts`
- [ ] Allowed transitions in service layer
- [ ] Central status text in `types.ts`
- [ ] System-wide toast messages
- [ ] Audit log data model (Supabase migration)

**Dependencies**: None (foundational)  
**Blocks**: Everything else

---

#### **Phase 3.2: Delivery Closure & Payments** (Core)
**Priority**: 🟠 **SECOND** - Closes critical user flow  
**Effort**: High  
**Impact**: High  
**Timeline**: 3-4 weeks

**Deliverables**:
- [ ] Payment record entity + Supabase table
- [ ] Delivery closure modal (reschedule/fail flows)
- [ ] POD upload capability (photo/signature)
- [ ] Returns/damages with invoice restriction
- [ ] Inventory hook for stock adjustments
- [ ] Audit logging on status transitions

**Dependencies**: Phase 3.1 (Status Model)  
**Blocks**: Dashboards (need accurate order states)

---

#### **Phase 3.3: Dispatch Optimizer & Capacity** (Competitive Advantage)
**Priority**: 🟠 **THIRD** - High ROI for operations  
**Effort**: Very High  
**Impact**: Very High  
**Timeline**: 4-6 weeks

**Deliverables**:
- [ ] Vehicle capacity fields in data model
- [ ] Route metadata & delivery windows
- [ ] Scoring model (proximity, capacity, SLA, grouping)
- [ ] "Auto-assign" UI with preview
- [ ] Conflict warnings & capacity visualization
- [ ] Supabase RPC for unassigned orders
- [ ] Assignment transaction with audit
- [ ] KPI surface (utilization, SLA risk, reassign rate)

**Dependencies**: Phase 3.1 (Status Model)  
**Blocks**: Advanced route optimization

---

#### **Phase 3.4: CSV Import Hardening** (Operational Efficiency)
**Priority**: 🟡 **FOURTH** - Reduces manual data entry errors  
**Effort**: Medium-High  
**Impact**: Medium  
**Timeline**: 2-3 weeks

**Deliverables**:
- [ ] Schema + business rule validators per type
- [ ] Preflight error/warning display
- [ ] Dry-run mode with downloadable CSV
- [ ] Role gate + feature flag
- [ ] Bulk RPC upsert with transaction
- [ ] Import session log table
- [ ] Per-row error capture

**Dependencies**: Phase 3.1 (Status Model)  
**Blocks**: Automated data pipelines

---

#### **Phase 3.5: Dashboards & Metrics** (Visibility)
**Priority**: 🟡 **FIFTH** - Enables business intelligence  
**Effort**: Medium  
**Impact**: Medium-High  
**Timeline**: 2-3 weeks

**Deliverables**:
- [ ] Supabase materialized views (OTIF, first-attempt, cash vs credit, etc.)
- [ ] Aggregate functions for metrics
- [ ] Filter capabilities (route, salesperson, payment, date)
- [ ] Drill-through links to detail lists
- [ ] Data freshness indicator

**Dependencies**: Phase 3.2 (Delivery Closure), Phase 3.3 (Dispatch)  
**Blocks**: Advanced analytics

---

#### **Phase 3.6: Route Map & Geo Quality** (User Experience)
**Priority**: 🟢 **SIXTH** - Improves field operations  
**Effort**: Medium  
**Impact**: Medium  
**Timeline**: 2-3 weeks

**Deliverables**:
- [ ] Map picker for customer location
- [ ] Lat/lng format validation
- [ ] Route Map visualization (stop sequence, distance/time)
- [ ] Navigation integration
- [ ] Offline caching (localStorage)

**Dependencies**: None (can be parallel with Phase 3.2-3.4)  
**Blocks**: Advanced navigation features

---

#### **Phase 3.7: Global Search & Command Palette** (Productivity)
**Priority**: 🟢 **SEVENTH** - Quality-of-life improvement  
**Effort**: Medium  
**Impact**: Medium  
**Timeline**: 1-2 weeks

**Deliverables**:
- [ ] Command palette component
- [ ] Search endpoint (customers, orders, trips, vehicles)
- [ ] Role-based filtering
- [ ] Keyboard shortcut (Cmd+K)

**Dependencies**: None (can be parallel)  
**Blocks**: None

---

#### **Phase 3.8: Access & Observability** (Reliability)
**Priority**: 🟢 **EIGHTH** - Safety net  
**Effort**: Medium  
**Impact**: Medium  
**Timeline**: 1-2 weeks

**Deliverables**:
- [ ] Error boundary component
- [ ] Supabase retry wrapper
- [ ] Central logging hook
- [ ] PII masking (phone, PAN)
- [ ] Export/delete pathway (stubbed initially)

**Dependencies**: None (can be parallel)  
**Blocks**: None

---

#### **Phase 3.9: Release Safety & Smoke Tests** (Quality Assurance)
**Priority**: 🔵 **NINTH** (Concurrent with final phases)  
**Effort**: Low-Medium  
**Impact**: High (indirect - prevents regressions)  
**Timeline**: 1 week

**Deliverables**:
- [ ] Smoke test suite (login, create order, assign, deliver)
- [ ] Preflight checklist (env vars, feature flags)
- [ ] Migration plan for new tables/views
- [ ] Deployment runbook

**Dependencies**: All previous phases  
**Blocks**: Production release

---

## 📊 Phasing Timeline

```
Q4 2025 (Current - Dec)
├─ Week 1-2: Phase 3.1 - Status Model (Foundation) ✅
└─ Week 2-3: Parallel start Phase 3.2 (Delivery)

Q1 2026
├─ Week 1-2: Phase 3.2 - Complete (Delivery Closure)
├─ Week 3-6: Phase 3.3 - Dispatch Optimizer
├─ Week 4-6: Phase 3.4 - CSV Hardening (Parallel)
├─ Week 7-8: Phase 3.5 - Dashboards
├─ Week 8-10: Phase 3.6 - Route Map (Parallel)
├─ Week 11: Phase 3.7 - Search
├─ Week 12: Phase 3.8 - Access & Observability
├─ Week 13: Phase 3.9 - Testing & Release Safety
└─ Week 14: Buffer/Polish/QA

Total Timeline: ~14 weeks (Q1 2026 completion)
```

---

## 🏗️ Architecture Overview

### Database Layer (Supabase)

**New Tables**:
```sql
-- Phase 3.1
audit_logs (id, user_id, action, entity_type, entity_id, data, created_at)
order_status_history (id, order_id, from_status, to_status, reason, user_id, created_at)

-- Phase 3.2
payments (id, order_id, amount, mode, reference, collector_id, timestamp, created_at)
delivery_closures (id, order_id, status, reason, next_date, user_id, created_at)
pod_uploads (id, delivery_id, type, file_url, created_at)
inventory_adjustments (id, product_id, order_id, type, quantity, reason, created_at)

-- Phase 3.3
vehicle_capacity (id, vehicle_id, capacity_type, total, reserved, available)
route_metadata (id, route_code, delivery_window_start, delivery_window_end, sla_hours)
delivery_sla (id, customer_id, route_id, sla_hours, priority)
dispatch_assignments (id, order_id, trip_id, score, reason, assigned_by, created_at)

-- Phase 3.4
import_sessions (id, type, user_id, total_rows, successful, failed, error_csv_url, created_at)

-- Phase 3.9
migrations_log (id, name, applied_at)
```

**New Views/Functions**:
- `unassigned_orders_with_coords` (Phase 3.3)
- `order_otif_aggregate` (Phase 3.5)
- `payment_summary_by_type` (Phase 3.5)
- `route_utilization_view` (Phase 3.5)
- `assign_order_to_trip` RPC (Phase 3.3)
- `bulk_upsert_orders` RPC (Phase 3.4)

---

### Service Layer (TypeScript)

**New Services**:
```typescript
// Phase 3.1
services/workflow/stateManager.ts
  - getValidTransitions(currentState, role)
  - canTransition(from, to)
  - executeTransition(order, newStatus, reason, userId)

// Phase 3.2
services/delivery/paymentService.ts
  - recordPayment(orderId, amount, mode, etc.)
  - getPendingPayments()

services/delivery/closureService.ts
  - startClosureFlow(orderId)
  - rescheduleOrder()
  - markAsFailed()

services/delivery/podService.ts
  - uploadPOD(deliveryId, file, type)
  - getPOD(deliveryId)

// Phase 3.3
services/dispatch/dispatchOptimizer.ts
  - scoreAssignment(order, trip, vehicle)
  - getAutoAssignments(unassignedOrders)
  - previewAssignments()

services/dispatch/capacityService.ts
  - getVehicleCapacity(vehicleId)
  - updateCapacityReservation()

// Phase 3.4
services/import/csvValidator.ts
  - validateSchema(rows, type)
  - validateBusinessRules(rows, type)

services/import/importService.ts
  - dryRun(rows, type)
  - executeImport(rows, type, userId)

// Phase 3.5
services/analytics/metricService.ts
  - getOTIF()
  - getFirstAttemptSuccess()
  - getPaymentMix()
  - getReturnsByReason()

// Phase 3.6
services/geo/mapService.ts
  - validateCoordinates(lat, lng)
  - cacheRoute(routeId, points)
  - getOfflineRoute(routeId)

// Phase 3.7
services/search/commandService.ts
  - search(query, types, filters)

// Phase 3.8
services/observability/loggingService.ts
services/observability/errorBoundary.tsx
```

---

### UI Layer (React Components)

**New Components**:
```typescript
// Phase 3.1
components/shared/StatusBadge.tsx
components/shared/SystemToast.tsx

// Phase 3.2
components/delivery/DeliveryClosureModal.tsx
components/delivery/RescheduleFlow.tsx
components/delivery/FailureFlow.tsx
components/delivery/PODUpload.tsx
components/delivery/PaymentRecorder.tsx

// Phase 3.3
components/dispatch/DispatchOptimizer.tsx
components/dispatch/AutoAssignPreview.tsx
components/dispatch/CapacityBar.tsx
components/dispatch/ConflictWarning.tsx
components/dispatch/KPIDashboard.tsx

// Phase 3.4
components/import/ImportValidator.tsx
components/import/DryRunPreview.tsx
components/import/ErrorCSVDownload.tsx

// Phase 3.5
components/dashboards/OTIFDashboard.tsx
components/dashboards/PaymentDashboard.tsx
components/dashboards/ReturnsDashboard.tsx
components/dashboards/RouteDashboard.tsx

// Phase 3.6
components/map/MapPicker.tsx
components/map/RouteMap.tsx
components/map/StopSequence.tsx

// Phase 3.7
components/search/CommandPalette.tsx

// Phase 3.8
components/shared/ErrorBoundary.tsx
components/shared/SupabaseRetryWrapper.tsx
```

---

## 📈 Success Metrics

### Phase 3.1 (Status Model)
- [ ] State machine covers 100% of order/trip/return/payment states
- [ ] 0 invalid state transitions in production
- [ ] Audit log captures 100% of critical status changes

### Phase 3.2 (Delivery Closure)
- [ ] 95% of orders close with complete data
- [ ] POD upload success rate > 90%
- [ ] Payment recording latency < 2s
- [ ] Returns with audit trail > 98%

### Phase 3.3 (Dispatch)
- [ ] Auto-assign success rate > 85%
- [ ] Route utilization increase 15-20%
- [ ] SLA compliance improvement 10%
- [ ] Reassignment rate < 5%

### Phase 3.4 (CSV Import)
- [ ] Data quality improvement 50% (fewer errors)
- [ ] Manual data entry time reduction 40%
- [ ] Import error detection before write 100%

### Phase 3.5 (Dashboards)
- [ ] Data freshness < 5 minutes
- [ ] Dashboard load time < 2s
- [ ] All KPIs queryable with filters

### Phase 3.6 (Route Map)
- [ ] Offline availability > 95%
- [ ] Map interaction latency < 100ms
- [ ] Route validation catch 98% of bad coords

### Phase 3.7 (Search)
- [ ] Search result latency < 500ms
- [ ] Keyboard shortcut adoption > 60% of users

### Phase 3.8 (Access & Observability)
- [ ] Error boundary catches 99% of crashes
- [ ] Logging captures all user context
- [ ] 0 PII exposure in logs/exports

### Phase 3.9 (Release Safety)
- [ ] Smoke tests pass 100% pre-release
- [ ] 0 critical bugs in first week

---

## 🛠️ Development Checklist

### Prerequisites (Before Phase 3.1 Start)
- [ ] Code review of Phase 2 (QR Modal + Search)
- [ ] Establish database migration strategy
- [ ] Set up Supabase versioning
- [ ] Create development branch strategy
- [ ] Document API contracts

### Phase 3.1 Kickoff
- [ ] Create `types/workflow.ts` with enums
- [ ] Implement state machine service
- [ ] Add audit_logs table migration
- [ ] Create test cases for state transitions
- [ ] Document status flow diagrams

### General Per-Phase
- [ ] Create feature branch (e.g., `feature/phase-3.2-delivery-closure`)
- [ ] Write TypeScript types first
- [ ] Create Supabase migrations
- [ ] Implement services layer
- [ ] Build UI components
- [ ] Add tests (unit + integration)
- [ ] Documentation + screenshots
- [ ] Code review
- [ ] Merge to master
- [ ] Deploy to staging/production

---

## 📚 Documentation Plan

**Per Phase**:
- Implementation guide (technical details)
- User guide (how to use the feature)
- API documentation (new endpoints)
- Migration guide (for existing data)
- Testing checklist (manual + automated)
- Deployment instructions

**Central**:
- System architecture diagram
- Data model diagram
- State machine diagrams
- API reference (OpenAPI/Swagger)
- Troubleshooting guide

---

## 🚀 Go-Live Plan

### Pre-Release (Week 13-14)
- [ ] Smoke test all features
- [ ] UAT with stakeholders
- [ ] Load testing
- [ ] Backup strategy verification
- [ ] Rollback plan

### Release (Week 14)
- [ ] Feature flag enabled/disabled
- [ ] Monitor error logs 24/7
- [ ] Have support team on standby
- [ ] Gradual rollout (if possible)

### Post-Release (Week 15)
- [ ] Customer training
- [ ] Knowledge base updates
- [ ] Gather feedback
- [ ] Bug fix sprints
- [ ] Performance optimization

---

## 💡 Notes & Considerations

### Technical Debt
- Bundle size warning (Phase 3.9 - code splitting recommended)
- Consider lazy loading for heavy components
- Route optimization for large datasets

### Feature Flags
- Needed for Phase 3.4 (CSV Import) - allow safe rollout
- Recommended for Phase 3.3 (Dispatch) - test with subset first

### External Dependencies
- Photo/signature library for POD (Phase 3.2)
- Map library (Leaflet already in use - Phase 3.6)
- Search library if needed (Phase 3.7)

### Staffing
- **Backend**: 1 person (Supabase, RPCs, migrations)
- **Frontend**: 2 people (UI components, state management)
- **DevOps**: 0.5 person (deployments, monitoring)
- **QA**: 1 person (testing, documentation)

---

## 📞 Next Steps

1. **Approve Phase Sequencing** - Confirm the order makes sense
2. **Resource Planning** - Assign team members to phases
3. **Phase 3.1 Kickoff** - Start with Status Model (foundation)
4. **Weekly Standups** - Track progress and blockers

---

**Ready to begin Phase 3.1? Let's start with the Status Model & Workflow Canon!** 🚀
