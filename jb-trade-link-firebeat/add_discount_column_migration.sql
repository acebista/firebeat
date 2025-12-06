-- Migration: Add discountPct column to orders table
-- Run this in Supabase SQL Editor

-- Add the discountPct column with default value of 0
ALTER TABLE "orders" 
ADD COLUMN IF NOT EXISTS "discountPct" double precision DEFAULT 0;

-- Update existing orders to have 0 discount if NULL
UPDATE "orders" 
SET "discountPct" = 0 
WHERE "discountPct" IS NULL;

-- Verify the change
SELECT COUNT(*) as total_orders, 
       COUNT("discountPct") as orders_with_discount_field
FROM "orders";
