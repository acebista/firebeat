-- HR & Commission System Migration
-- Creates commission rates table and extends users with compensation fields

-- Create commission_rates table
CREATE TABLE IF NOT EXISTS commission_rates (
  id TEXT PRIMARY KEY DEFAULT ('cr_' || substr(gen_random_uuid()::text, 1, 8)),
  company_id TEXT,
  company_name TEXT,
  name TEXT NOT NULL DEFAULT 'Default slab',
  min_amount FLOAT8 NOT NULL,
  max_amount FLOAT8,
  rate_pct FLOAT8 NOT NULL CHECK (rate_pct >= 0 AND rate_pct <= 100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for commission_rates
CREATE INDEX idx_commission_rates_company_active ON commission_rates(company_id, is_active);
CREATE INDEX idx_commission_rates_amount_range ON commission_rates(min_amount, max_amount);
CREATE INDEX idx_commission_rates_active ON commission_rates(is_active);

-- Enable RLS on commission_rates
ALTER TABLE commission_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins can view all commission rates
CREATE POLICY "admin_view_commission_rates" ON commission_rates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'admin'
    )
  );

-- RLS Policy: Admins can modify commission rates
CREATE POLICY "admin_modify_commission_rates" ON commission_rates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'admin'
    )
  );

-- Extend users table with compensation fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS base_salary FLOAT8;
ALTER TABLE users ADD COLUMN IF NOT EXISTS comp_plan_type TEXT DEFAULT 'fixed' CHECK (comp_plan_type IN ('fixed', 'commission'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS commission_rate_set TEXT;

-- Create index for querying salespeople with compensation
CREATE INDEX IF NOT EXISTS idx_users_role_active ON users(role, "isActive");
CREATE INDEX IF NOT EXISTS idx_users_comp_plan ON users(comp_plan_type);

-- Optional: Create a view for sales aggregation by user
CREATE OR REPLACE VIEW user_monthly_sales AS
SELECT
  o.salespersonId AS user_id,
  DATE_TRUNC('month', o.date)::DATE AS month,
  SUM(o.totalAmount)::FLOAT8 AS total_sales,
  COUNT(*) AS order_count
FROM orders o
WHERE o.status IN ('APPROVED', 'DISPATCHED', 'DELIVERED')
GROUP BY o.salespersonId, DATE_TRUNC('month', o.date);

-- Grant permissions
GRANT SELECT ON commission_rates TO anon, authenticated;
GRANT SELECT ON user_monthly_sales TO anon, authenticated;
