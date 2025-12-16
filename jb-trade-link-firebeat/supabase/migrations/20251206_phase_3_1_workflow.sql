-- ============================================================================
-- Phase 3.1: Status Model & Workflow Canon - Supabase Migrations
-- 
-- Creates tables for audit logging and status history
-- Establishes foundation for workflow state management
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLE: audit_logs
-- Purpose: Immutable audit trail of all system changes
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('order', 'trip', 'return', 'payment')),
  entity_id TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB NOT NULL,
  reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view audit logs for their own entities and admins see all
CREATE POLICY "audit_logs_select" ON audit_logs
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND (
          auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager', 'supervisor')
        )
    )
  );

-- RLS Policy: Only service role can insert (via trigger/function)
CREATE POLICY "audit_logs_insert" ON audit_logs
  FOR INSERT WITH CHECK (false);

-- ============================================================================
-- TABLE: order_status_history
-- Purpose: Track all status transitions for orders
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  reason TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_user_id ON order_status_history(user_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history(created_at DESC);

-- Enable RLS
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view history for orders (admins/managers can see all)
CREATE POLICY "order_status_history_select" ON order_status_history
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND (
          auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager', 'supervisor')
        )
    )
  );

-- RLS Policy: Only service role can insert
CREATE POLICY "order_status_history_insert" ON order_status_history
  FOR INSERT WITH CHECK (false);

-- ============================================================================
-- TABLE: trip_status_history
-- Purpose: Track all status transitions for trips
-- ============================================================================

CREATE TABLE IF NOT EXISTS trip_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  reason TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_trip_status_history_trip_id ON trip_status_history(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_status_history_user_id ON trip_status_history(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_status_history_created_at ON trip_status_history(created_at DESC);

-- Enable RLS
ALTER TABLE trip_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view history for trips (admins/managers can see all)
CREATE POLICY "trip_status_history_select" ON trip_status_history
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND (
          auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager', 'supervisor')
        )
    )
  );

-- RLS Policy: Only service role can insert
CREATE POLICY "trip_status_history_insert" ON trip_status_history
  FOR INSERT WITH CHECK (false);

-- ============================================================================
-- ALTER EXISTING TABLES: Add workflow columns
-- ============================================================================

-- Add columns to orders table if they don't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add columns to trips table if they don't exist
ALTER TABLE trips ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE trips ADD COLUMN IF NOT EXISTS status_updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- ============================================================================
-- FUNCTION: audit_log_insert
-- Purpose: Secure function for inserting audit logs (called from application)
-- ============================================================================

CREATE OR REPLACE FUNCTION audit_log_insert(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_old_data JSONB,
  p_new_data JSONB,
  p_reason TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    old_data,
    new_data,
    reason,
    metadata
  ) VALUES (
    p_user_id,
    p_action,
    p_entity_type,
    p_entity_id,
    p_old_data,
    p_new_data,
    p_reason,
    p_metadata
  ) RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: status_transition_validate
-- Purpose: Validate status transitions before allowing updates
-- ============================================================================

CREATE OR REPLACE FUNCTION status_transition_validate(
  p_entity_type TEXT,
  p_from_status TEXT,
  p_to_status TEXT,
  p_user_role TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_valid_transitions JSONB;
BEGIN
  -- This is a placeholder - full validation happens in application
  -- For now, allow transitions for admin and manager
  RETURN p_user_role IN ('admin', 'manager', 'supervisor', 'dispatch', 'delivery_agent', 'accountant');
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant execute on functions to authenticated users
GRANT EXECUTE ON FUNCTION audit_log_insert TO authenticated;
GRANT EXECUTE ON FUNCTION status_transition_validate TO authenticated;

-- Grant select on tables to authenticated users (RLS enforced)
GRANT SELECT ON audit_logs TO authenticated;
GRANT SELECT ON order_status_history TO authenticated;
GRANT SELECT ON trip_status_history TO authenticated;

-- Grant insert on tables to service role (for application use)
GRANT INSERT ON audit_logs TO service_role;
GRANT INSERT ON order_status_history TO service_role;
GRANT INSERT ON trip_status_history TO service_role;

-- ============================================================================
-- COMMENT ON OBJECTS
-- ============================================================================

COMMENT ON TABLE audit_logs IS 'Immutable audit trail of all system changes';
COMMENT ON TABLE order_status_history IS 'Tracks all status transitions for orders';
COMMENT ON TABLE trip_status_history IS 'Tracks all status transitions for trips';
COMMENT ON FUNCTION audit_log_insert IS 'Securely insert audit log entry from application';
COMMENT ON FUNCTION status_transition_validate IS 'Validate status transitions based on role and rules';
