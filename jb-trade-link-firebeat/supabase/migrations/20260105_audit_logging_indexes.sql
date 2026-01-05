-- Audit Logging System - Performance Indexes
-- Run this migration to optimize audit log queries

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity 
ON audit_logs(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action 
ON audit_logs(action);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
ON audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id 
ON audit_logs(user_id);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_date 
ON audit_logs(entity_type, entity_id, created_at DESC);

-- Index for searching by action and date
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_date 
ON audit_logs(action, created_at DESC);

-- Add comment to table
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for all system operations. Tracks changes, user actions, and system events for debugging and compliance.';

-- Ensure RLS is enabled but allow service role to bypass
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to insert their own logs
CREATE POLICY IF NOT EXISTS "Users can insert their own audit logs"
ON audit_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Allow authenticated users to read all audit logs (admins only in practice via app logic)
CREATE POLICY IF NOT EXISTS "Authenticated users can read audit logs"
ON audit_logs FOR SELECT
TO authenticated
USING (true);

-- Verify indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'audit_logs'
ORDER BY indexname;
