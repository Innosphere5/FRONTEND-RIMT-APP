-- ====================================================================
-- RIMT UNIVERSITY: ADMIN AUTHENTICATION SCHEMA MIGRATION
-- Module: /admin-panel/auth (NEW-FEATURE.md)
-- Authorized Admins Only: Raj Kumar & Sagrika (No open sign-up)
-- Execute this script directly in the Supabase SQL Editor
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  profile_pic_url TEXT,
  role TEXT NOT NULL DEFAULT 'ADMIN' CHECK (role IN ('ADMIN', 'SUPER_ADMIN')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DISABLED')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Case-insensitive unique index on full_name for name-based sign-in
DROP INDEX IF EXISTS idx_admins_name_unique;
CREATE UNIQUE INDEX IF NOT EXISTS idx_admins_name_unique 
  ON public.admins (lower(trim(full_name)));

CREATE INDEX IF NOT EXISTS idx_admins_status 
  ON public.admins (status);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'admins' AND policyname = 'Admins read access'
  ) THEN
    CREATE POLICY "Admins read access" ON public.admins
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'admins' AND policyname = 'Admins write access'
  ) THEN
    CREATE POLICY "Admins write access" ON public.admins
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

GRANT ALL ON TABLE public.admins TO anon, authenticated, service_role;

-- Seed the two pre-authorized administrators:
-- 1. Raj Kumar (Password: BCAHOD)
-- 2. Sagrika (Password: VICEHOD)
-- PBKDF2-SHA256, 10000 iterations, salt='rimt-salt-key'
INSERT INTO public.admins (
  id,
  full_name,
  email,
  password_hash,
  profile_pic_url,
  role,
  status,
  created_at,
  updated_at
) VALUES 
(
  'a0000000-0000-0000-0000-000000000001',
  'Raj Kumar',
  NULL,
  'd680cfb989acd4d9054db88f98af7ec384a8b69c7b16c3995c7b92c28897e54a',
  NULL,
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
  NULL,
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
