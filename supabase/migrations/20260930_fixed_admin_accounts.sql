-- ====================================================================
-- RIMT UNIVERSITY: FIXED ADMIN ACCOUNTS MIGRATION
-- Removes open signup; seeds exactly 2 authorized administrators
-- Execute this script in the Supabase SQL Editor
-- ====================================================================

-- 1. Clear any existing admins (clean slate for fixed accounts only)
DELETE FROM public.admins;

-- 2. Alter table: make email optional (admins now authenticate by name)
ALTER TABLE public.admins ALTER COLUMN email DROP NOT NULL;

-- 3. Add case-insensitive unique index on full_name for name-based login
DROP INDEX IF EXISTS idx_admins_name_unique;
CREATE UNIQUE INDEX idx_admins_name_unique 
  ON public.admins (lower(trim(full_name)));

-- 4. Seed the two authorized administrators
-- Passwords hashed with PBKDF2-SHA256, 10000 iterations, salt='rimt-salt-key'
INSERT INTO public.admins (
  id, full_name, email, password_hash, role, status, created_at, updated_at
) VALUES 
(
  'a0000000-0000-0000-0000-000000000001',
  'Raj Kumar',
  NULL,
  'd680cfb989acd4d9054db88f98af7ec384a8b69c7b16c3995c7b92c28897e54a',
  'ADMIN',
  'ACTIVE',
  timezone('utc'::text, now()),
  timezone('utc'::text, now())
),
(
  'a0000000-0000-0000-0000-000000000002',
  'Sagrika',
  NULL,
  '6e0fe68a50605d90af3ce96b8dc2921095f27a562e758eb2866bade3e3a37381',
  'ADMIN',
  'ACTIVE',
  timezone('utc'::text, now()),
  timezone('utc'::text, now())
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  status = 'ACTIVE',
  role = 'ADMIN',
  updated_at = timezone('utc'::text, now());
