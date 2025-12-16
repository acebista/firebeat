-- Migration: Add missing columns to orders table for full CSV import support
-- Created: 2025-04-15
-- Purpose: Support discount (amount), GPS, time, paymentMethod, vatRequired fields

-- Add GPS column (text) if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'GPS'
    ) THEN
        ALTER TABLE orders ADD COLUMN "GPS" text;
    END IF;
END $$;

-- Add time column (timestamp with time zone) if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'time'
    ) THEN
        ALTER TABLE orders ADD COLUMN "time" timestamp with time zone;
    END IF;
END $$;

-- Add paymentMethod column (text) if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'paymentMethod'
    ) THEN
        ALTER TABLE orders ADD COLUMN "paymentMethod" text;
    END IF;
END $$;

-- Add vatRequired column (boolean) if not exists
-- Note: Using "vatRequired?" to match existing code field name
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'vatRequired?'
    ) THEN
        ALTER TABLE orders ADD COLUMN "vatRequired?" boolean DEFAULT false;
    END IF;
END $$;

-- Add discount column (numeric/double precision for amount) if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'discount'
    ) THEN
        ALTER TABLE orders ADD COLUMN "discount" double precision DEFAULT 0;
    END IF;
END $$;

-- Create index on GPS for faster lookups during migration
CREATE INDEX IF NOT EXISTS idx_orders_gps ON orders USING btree ("GPS");

-- Create index on time for date-based queries
CREATE INDEX IF NOT EXISTS idx_orders_time ON orders USING btree ("time");

-- Create index on paymentMethod for filtering
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders USING btree ("paymentMethod");

COMMENT ON COLUMN orders."GPS" IS 'GPS coordinates in format: latitude, longitude';
COMMENT ON COLUMN orders."time" IS 'Order timestamp with full date and time';
COMMENT ON COLUMN orders."paymentMethod" IS 'Payment method: Cash, Credit, Bank Transfer, eSewa, Khalti, etc.';
COMMENT ON COLUMN orders."vatRequired?" IS 'Whether VAT is required for this order';
COMMENT ON COLUMN orders."discount" IS 'Discount amount in currency (not percentage)';
