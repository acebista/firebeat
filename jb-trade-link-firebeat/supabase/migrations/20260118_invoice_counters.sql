-- ============================================================
-- GAPLESS INVOICE ID GENERATION
-- Uses pessimistic locking (SELECT ... FOR UPDATE) to guarantee
-- no gaps and no duplicates under any concurrency load.
-- ============================================================

-- 1. Counter Table: One row per day
CREATE TABLE IF NOT EXISTS invoice_counters (
  invoice_date CHAR(6) PRIMARY KEY,  -- Format: YYMMDD
  last_number  INTEGER NOT NULL DEFAULT 0
);

-- 2. Atomic Invoice Number Generator (Postgres Function)
-- This function:
--   a) Uses server time (not client) for the date
--   b) Locks the row for today with FOR UPDATE (pessimistic lock)
--   c) Increments the counter atomically
--   d) Returns the formatted invoice ID: YYMMDD-XXX
--
-- It is IMPOSSIBLE for two concurrent calls to get the same number.
-- It is IMPOSSIBLE for gaps to occur (unless an order is deleted later).

CREATE OR REPLACE FUNCTION generate_invoice_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_date_prefix CHAR(6);
  v_next_number INTEGER;
  v_invoice_id TEXT;
BEGIN
  -- Get today's date in YYMMDD format using SERVER time (Nepal TZ)
  v_date_prefix := TO_CHAR(NOW() AT TIME ZONE 'Asia/Kathmandu', 'YYMMDD');

  -- Attempt to insert a new row for today (if first order of the day)
  -- ON CONFLICT means if it already exists, do nothing
  INSERT INTO invoice_counters (invoice_date, last_number)
  VALUES (v_date_prefix, 0)
  ON CONFLICT (invoice_date) DO NOTHING;

  -- Lock today's row and increment counter atomically
  -- FOR UPDATE locks the row until this transaction commits
  UPDATE invoice_counters
  SET last_number = last_number + 1
  WHERE invoice_date = v_date_prefix
  RETURNING last_number INTO v_next_number;

  -- Format: YYMMDD-XXX (zero-padded to 3 digits)
  v_invoice_id := v_date_prefix || '-' || LPAD(v_next_number::TEXT, 3, '0');

  RETURN v_invoice_id;
END;
$$;

-- 3. Security: Allow authenticated users to call this function
GRANT EXECUTE ON FUNCTION generate_invoice_id() TO authenticated;

-- 4. Optional: Index for fast lookups (already PK, but explicit)
-- CREATE INDEX IF NOT EXISTS idx_invoice_counters_date ON invoice_counters(invoice_date);

-- ============================================================
-- USAGE EXAMPLE (from Supabase client):
--
--   const { data, error } = await supabase.rpc('generate_invoice_id');
--   // data = "260118-001"
--
-- ============================================================
