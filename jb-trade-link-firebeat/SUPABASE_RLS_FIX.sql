
-- ==========================================
-- URGENT: FIX RLS POLICIES FOR PAYMENTS
-- ==========================================
-- The "Duplicate Payments" issue and "DELETE returned count 0" error are caused by 
-- Row Level Security (RLS) policies blocking the DELETE operation.
-- Even though the User is authenticated, they do not have permission to DELETE the rows.

-- Please run the following SQL in your Supabase Dashboard -> SQL Editor:

-- 1. Enable DELETE for authenticated users
CREATE POLICY "Enable delete for authenticated users"
ON "public"."invoice_payments"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- 2. Enable UPDATE for authenticated users (just in case)
CREATE POLICY "Enable update for authenticated users"
ON "public"."invoice_payments"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 3. Verify policies are active
ALTER TABLE "public"."invoice_payments" ENABLE ROW LEVEL SECURITY;

-- Note: If policies already exist, you might need to DROP them first or check why they are restrictive.
-- You can check existing policies with:
-- select * from pg_policies where table_name = 'invoice_payments';
