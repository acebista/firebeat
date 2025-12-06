-- Add GPS and timestamp columns to orders table

-- Add GPS column (stores latitude,longitude as text)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS "gps" text;

-- Add order time column (timestamp with timezone)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS "orderTime" timestamptz DEFAULT NOW();

-- Add comment for documentation
COMMENT ON COLUMN orders.gps IS 'GPS coordinates in format: latitude,longitude (e.g., 27.7172,85.3240)';
COMMENT ON COLUMN orders."orderTime" IS 'Timestamp when order was placed (with timezone)';

-- Verify columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name IN ('gps', 'orderTime');
