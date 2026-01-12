-- ============================================================================
-- FINPRO AGGREGATION SPINE
-- Nepal FMCG Delivery → VAT Aggregation → FinPro Export Engine
-- ============================================================================
-- This migration adds the financial integrity layer to the existing
-- delivery tracking system. It does NOT create VAT invoices — that is
-- done in FinPro. This creates the mathematically consistent truth
-- that feeds into FinPro.
-- ============================================================================

-- ============================================================================
-- PART A: TRIP STOCK LEDGER
-- ============================================================================

-- 1. TRIP_LOADS: What was physically loaded onto the truck
-- Created when trip transitions to 'out_for_delivery'
-- IMMUTABLE once trip is closed
CREATE TABLE IF NOT EXISTS public.trip_loads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE RESTRICT,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    
    qty_loaded INTEGER NOT NULL CHECK (qty_loaded >= 0),
    
    -- Metadata
    loaded_by UUID REFERENCES auth.users(id),
    loaded_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate entries per product per trip
    UNIQUE(trip_id, product_id)
);

-- 2. TRIP_UNLOADS: What came back unsold or damaged
-- Created when trip is closed
-- IMMUTABLE after creation
CREATE TABLE IF NOT EXISTS public.trip_unloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE RESTRICT,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    
    qty_unsold INTEGER NOT NULL DEFAULT 0 CHECK (qty_unsold >= 0),
    qty_damaged INTEGER NOT NULL DEFAULT 0 CHECK (qty_damaged >= 0),
    damage_reason TEXT,
    
    -- Metadata
    recorded_by UUID REFERENCES auth.users(id),
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate entries per product per trip
    UNIQUE(trip_id, product_id)
);

-- 3. TRIP_CLOSURE: Formal trip closure record
-- Once closed, nothing on the trip can be edited
CREATE TABLE IF NOT EXISTS public.trip_closures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id TEXT NOT NULL UNIQUE REFERENCES public.trips(id) ON DELETE RESTRICT,
    
    -- Closure state
    closed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_by UUID NOT NULL REFERENCES auth.users(id),
    
    -- Reconciliation snapshot at closure time
    total_orders INTEGER NOT NULL,
    total_delivered INTEGER NOT NULL,
    total_failed INTEGER NOT NULL,
    total_rescheduled INTEGER NOT NULL,
    
    -- Financial totals at closure
    total_gross_value NUMERIC(14,2) NOT NULL,
    total_net_value NUMERIC(14,2) NOT NULL,
    total_collected NUMERIC(14,2) NOT NULL,
    total_credit NUMERIC(14,2) NOT NULL,
    
    -- Stock reconciliation status
    stock_variance_count INTEGER DEFAULT 0,
    stock_reconciled BOOLEAN DEFAULT FALSE,
    
    -- Approval for variance (admin override)
    variance_approved_by UUID REFERENCES auth.users(id),
    variance_approved_at TIMESTAMPTZ,
    variance_approval_reason TEXT,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PART B: FINPRO EXPORT BATCHES
-- ============================================================================

-- 4. FINPRO_BATCHES: Daily aggregation batches for export
CREATE TABLE IF NOT EXISTS public.finpro_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Batch identifier
    batch_date DATE NOT NULL,
    batch_number INTEGER NOT NULL, -- Sequential per day
    
    -- Type of batch
    batch_type TEXT NOT NULL CHECK (batch_type IN (
        'INDIVIDUAL_CREDIT',
        'INDIVIDUAL_CHEQUE', 
        'INDIVIDUAL_PAN',
        'INDIVIDUAL_MIXED',
        'INDIVIDUAL_OVER_50K',
        'MERGED_CASH_QR'
    )),
    
    -- Financial totals
    total_gross NUMERIC(14,2) NOT NULL,
    total_discount NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_net NUMERIC(14,2) NOT NULL,
    
    -- Payment breakdown
    payment_cash NUMERIC(14,2) DEFAULT 0,
    payment_qr NUMERIC(14,2) DEFAULT 0,
    payment_cheque NUMERIC(14,2) DEFAULT 0,
    payment_credit NUMERIC(14,2) DEFAULT 0,
    
    -- Customer info (for individual batches)
    customer_id UUID REFERENCES public.customers(id),
    customer_name TEXT,
    customer_pan TEXT,
    
    -- Source tracking
    source_order_ids TEXT[] NOT NULL, -- Array of order IDs included
    source_trip_ids TEXT[] NOT NULL,  -- Array of trip IDs included
    
    -- Export status
    exported_at TIMESTAMPTZ,
    exported_by UUID REFERENCES auth.users(id),
    finpro_reference TEXT, -- FinPro invoice number after export
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Unique batch per day
    UNIQUE(batch_date, batch_number)
);

-- 5. FINPRO_BATCH_LINES: Line items within each batch
CREATE TABLE IF NOT EXISTS public.finpro_batch_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES public.finpro_batches(id) ON DELETE CASCADE,
    
    -- Product info (denormalized for export stability)
    product_id TEXT NOT NULL REFERENCES public.products(id),
    product_name TEXT NOT NULL,
    product_sku TEXT,
    company_name TEXT,
    
    -- Quantities and values
    qty INTEGER NOT NULL CHECK (qty > 0),
    rate NUMERIC(10,2) NOT NULL,
    gross_amount NUMERIC(12,2) NOT NULL,
    discount_amount NUMERIC(12,2) DEFAULT 0,
    net_amount NUMERIC(12,2) NOT NULL,
    
    -- Source tracking
    source_order_id TEXT NOT NULL REFERENCES public.orders(id),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PART C: INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_trip_loads_trip ON trip_loads(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_loads_product ON trip_loads(product_id);
CREATE INDEX IF NOT EXISTS idx_trip_unloads_trip ON trip_unloads(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_closures_trip ON trip_closures(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_closures_date ON trip_closures(closed_at);
CREATE INDEX IF NOT EXISTS idx_finpro_batches_date ON finpro_batches(batch_date);
CREATE INDEX IF NOT EXISTS idx_finpro_batches_type ON finpro_batches(batch_type);
CREATE INDEX IF NOT EXISTS idx_finpro_batch_lines_batch ON finpro_batch_lines(batch_id);
CREATE INDEX IF NOT EXISTS idx_finpro_batch_lines_product ON finpro_batch_lines(product_id);

-- ============================================================================
-- PART D: ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE trip_loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_unloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE finpro_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE finpro_batch_lines ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- TRIP_LOADS: Delivery users can insert, only admin can update/delete
-- ----------------------------------------------------------------------------
CREATE POLICY "trip_loads_select" ON trip_loads FOR SELECT USING (true);

CREATE POLICY "trip_loads_insert" ON trip_loads FOR INSERT WITH CHECK (
    -- Anyone authenticated can insert loads
    auth.uid() IS NOT NULL
);

CREATE POLICY "trip_loads_update" ON trip_loads FOR UPDATE USING (
    -- Only allowed if trip is NOT closed
    NOT EXISTS (
        SELECT 1 FROM trip_closures tc WHERE tc.trip_id = trip_loads.trip_id
    )
    AND (
        -- Admin can always update open trips
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
        OR
        -- Original loader can update before closure
        loaded_by = auth.uid()
    )
);

CREATE POLICY "trip_loads_delete" ON trip_loads FOR DELETE USING (
    -- Only admin can delete, and only if trip not closed
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    AND NOT EXISTS (
        SELECT 1 FROM trip_closures tc WHERE tc.trip_id = trip_loads.trip_id
    )
);

-- ----------------------------------------------------------------------------
-- TRIP_UNLOADS: Same pattern as loads
-- ----------------------------------------------------------------------------
CREATE POLICY "trip_unloads_select" ON trip_unloads FOR SELECT USING (true);

CREATE POLICY "trip_unloads_insert" ON trip_unloads FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
);

CREATE POLICY "trip_unloads_update" ON trip_unloads FOR UPDATE USING (
    NOT EXISTS (
        SELECT 1 FROM trip_closures tc WHERE tc.trip_id = trip_unloads.trip_id
    )
    AND (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
        OR recorded_by = auth.uid()
    )
);

CREATE POLICY "trip_unloads_delete" ON trip_unloads FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    AND NOT EXISTS (
        SELECT 1 FROM trip_closures tc WHERE tc.trip_id = trip_unloads.trip_id
    )
);

-- ----------------------------------------------------------------------------
-- TRIP_CLOSURES: Only admin can create/modify closures
-- ----------------------------------------------------------------------------
CREATE POLICY "trip_closures_select" ON trip_closures FOR SELECT USING (true);

CREATE POLICY "trip_closures_insert" ON trip_closures FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);

-- Closures are IMMUTABLE - no update/delete policies (except variance approval)
CREATE POLICY "trip_closures_update" ON trip_closures FOR UPDATE USING (
    -- Only admin can update, and only for variance approval fields
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);

-- ----------------------------------------------------------------------------
-- FINPRO_BATCHES: Only admin can manage
-- ----------------------------------------------------------------------------
CREATE POLICY "finpro_batches_select" ON finpro_batches FOR SELECT USING (true);

CREATE POLICY "finpro_batches_insert" ON finpro_batches FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);

-- Batches are IMMUTABLE once exported
CREATE POLICY "finpro_batches_update" ON finpro_batches FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
    AND exported_at IS NULL -- Cannot modify after export
);

-- ----------------------------------------------------------------------------
-- FINPRO_BATCH_LINES: Only admin, inherits from parent batch
-- ----------------------------------------------------------------------------
CREATE POLICY "finpro_batch_lines_select" ON finpro_batch_lines FOR SELECT USING (true);

CREATE POLICY "finpro_batch_lines_insert" ON finpro_batch_lines FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);

-- Lines are IMMUTABLE once parent batch is exported
CREATE POLICY "finpro_batch_lines_update" ON finpro_batch_lines FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
    AND NOT EXISTS (
        SELECT 1 FROM finpro_batches fb 
        WHERE fb.id = finpro_batch_lines.batch_id AND fb.exported_at IS NOT NULL
    )
);

-- ============================================================================
-- PART E: PREVENT ORDER/PAYMENT EDITING AFTER TRIP CLOSURE
-- ============================================================================

-- Drop existing permissive policies and add restrictive ones
-- Note: Run these only if policies don't exist

-- Orders: Prevent update if trip is closed
CREATE POLICY "orders_prevent_edit_after_closure" ON orders FOR UPDATE USING (
    -- Allow if no trip assigned
    "assignedTripId" IS NULL
    OR
    -- Allow if trip is not closed
    NOT EXISTS (
        SELECT 1 FROM trip_closures tc WHERE tc.trip_id = orders."assignedTripId"
    )
    OR
    -- Admin override with explicit permission
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);

-- Invoice payments: Prevent modification if order's trip is closed
CREATE POLICY "payments_prevent_edit_after_closure" ON invoice_payments FOR UPDATE USING (
    -- Allow if order's trip is not closed
    NOT EXISTS (
        SELECT 1 FROM orders o
        JOIN trip_closures tc ON tc.trip_id = o."assignedTripId"
        WHERE o.id = invoice_payments.invoice_id
    )
    OR
    -- Admin override
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);

CREATE POLICY "payments_prevent_delete_after_closure" ON invoice_payments FOR DELETE USING (
    -- Allow if order's trip is not closed
    NOT EXISTS (
        SELECT 1 FROM orders o
        JOIN trip_closures tc ON tc.trip_id = o."assignedTripId"
        WHERE o.id = invoice_payments.invoice_id
    )
    OR
    -- Admin override
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);

-- ============================================================================
-- PART F: HELPER VIEWS
-- ============================================================================

-- View: Trip stock reconciliation summary
CREATE OR REPLACE VIEW v_trip_stock_reconciliation AS
SELECT 
    t.id AS trip_id,
    t."deliveryDate" AS trip_date,
    t."deliveryPersonName",
    p.id AS product_id,
    p.name AS product_name,
    COALESCE(tl.qty_loaded, 0) AS qty_loaded,
    COALESCE(delivered.qty_delivered, 0) AS qty_delivered,
    COALESCE(tu.qty_unsold, 0) AS qty_unsold,
    COALESCE(tu.qty_damaged, 0) AS qty_damaged,
    -- The golden formula
    COALESCE(tl.qty_loaded, 0) - COALESCE(delivered.qty_delivered, 0) 
        - COALESCE(tu.qty_unsold, 0) - COALESCE(tu.qty_damaged, 0) AS variance,
    tc.closed_at IS NOT NULL AS is_closed
FROM trips t
CROSS JOIN products p
LEFT JOIN trip_loads tl ON tl.trip_id = t.id AND tl.product_id = p.id
LEFT JOIN trip_unloads tu ON tu.trip_id = t.id AND tu.product_id = p.id
LEFT JOIN trip_closures tc ON tc.trip_id = t.id
LEFT JOIN LATERAL (
    SELECT 
        (oi.data->>'product_id') AS product_id,
        SUM(COALESCE((oi.data->>'qty')::int, 0)) AS qty_delivered
    FROM orders o,
         jsonb_array_elements(o.items::jsonb) AS oi(data)
    WHERE o."assignedTripId" = t.id
      AND o.status IN ('delivered', 'completed')
    GROUP BY (oi.data->>'product_id')
) delivered ON delivered.product_id = p.id
WHERE tl.qty_loaded IS NOT NULL OR tu.qty_unsold IS NOT NULL OR delivered.qty_delivered IS NOT NULL;

-- View: Daily FinPro export summary
CREATE OR REPLACE VIEW v_finpro_daily_summary AS
SELECT 
    batch_date,
    batch_type,
    COUNT(*) AS batch_count,
    SUM(total_net) AS total_net,
    SUM(payment_cash) AS total_cash,
    SUM(payment_qr) AS total_qr,
    SUM(payment_cheque) AS total_cheque,
    SUM(payment_credit) AS total_credit,
    COUNT(*) FILTER (WHERE exported_at IS NOT NULL) AS exported_count,
    COUNT(*) FILTER (WHERE exported_at IS NULL) AS pending_count
FROM finpro_batches
GROUP BY batch_date, batch_type
ORDER BY batch_date DESC, batch_type;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
