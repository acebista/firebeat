-- Extended Compensation System Migration (Optimized for Existing Schema)
-- Date: December 7, 2025
-- Uses existing `returns` and `return_items` tables
-- Status: Ready for execution

-- ============================================================================
-- PHASE 1: Commission Rates Table Extension (ALREADY COMPLETE)
-- ============================================================================
-- Verified: commission_rates table already has:
-- - mode (slab/level)
-- - set_name
-- - apply_to (company/product/custom)
-- No changes needed here.

-- ============================================================================
-- PHASE 2: Enhance Returns Table with Missing Columns
-- ============================================================================

-- Add salesperson_id column (tracks who made the original sale)
ALTER TABLE returns 
ADD COLUMN IF NOT EXISTS salesperson_id text;

-- Add company_id column (for multi-company tracking)
ALTER TABLE returns 
ADD COLUMN IF NOT EXISTS company_id text;

-- Add is_active column for soft deletes
ALTER TABLE returns 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Add timestamps for auditing
ALTER TABLE returns 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_returns_salesperson_id 
ON returns(salesperson_id) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_returns_salesperson_date 
ON returns(salesperson_id, created_at)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_returns_company_id 
ON returns(company_id) 
WHERE is_active = true;

-- ============================================================================
-- PHASE 3: Enhance Return Items Table with Missing Columns
-- ============================================================================

-- Add timestamps for auditing
ALTER TABLE return_items 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

ALTER TABLE return_items 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_return_items_salesperson 
ON return_items(salesReturnId);

-- ============================================================================
-- PHASE 4: Add Sales Returns Column to Orders Table
-- ============================================================================

-- Optional: Add sales_returns column to orders for quick net sales calculation
-- (Can use returns table instead, but this provides a denormalized path for performance)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS sales_returns numeric DEFAULT 0
  CHECK (sales_returns >= 0);

-- Index for net sales queries
CREATE INDEX IF NOT EXISTS idx_orders_sales_returns 
ON orders(sales_returns) 
WHERE sales_returns > 0;

-- ============================================================================
-- VALIDATION QUERIES (Run to verify migration)
-- ============================================================================

-- Check returns table has all columns
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'returns' 
--   AND column_name IN ('salesperson_id', 'company_id', 'is_active', 'updated_at')
-- ORDER BY ordinal_position;

-- Check return_items table has timestamps
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'return_items' 
--   AND column_name IN ('created_at', 'updated_at')
-- ORDER BY ordinal_position;

-- Check orders table has sales_returns
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'orders' 
--   AND column_name = 'sales_returns';
