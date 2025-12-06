-- Add password column if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "password" text;

-- Force schema cache reload (sometimes needed)
NOTIFY pgrst, 'reload config';
