-- Remove the dangerous public read policy on telegram_auth_tokens
-- This policy allowed anyone to read unused tokens, which is a major security vulnerability
DROP POLICY IF EXISTS "Anyone can read unused tokens" ON public.telegram_auth_tokens;

-- The telegram_auth_tokens table should have no public access policies
-- Edge functions will access it using the service role key which bypasses RLS
-- This ensures tokens can only be read/written by server-side operations