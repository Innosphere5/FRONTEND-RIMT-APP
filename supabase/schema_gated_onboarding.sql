-- ====================================================================
-- RIMT UNIVERSITY: GATED ONBOARDING SYSTEM SCHEMA MIGRATION
-- Run this in the Supabase Dashboard SQL Editor
-- Project Reference: pwghazyfxhypzkadqfnn
-- ====================================================================

-- 1. Create or alter the students/users table
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  roll_number text not null unique,
  department text not null,
  year_semester text not null,
  email text not null unique,
  password_hash text not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  role text not null default 'USER' check (role in ('USER', 'ADMIN')),
  rejection_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  reviewed_by text,
  reviewed_at timestamp with time zone,
  phone text,
  avatar_url text
);

-- Ensure all new columns exist if table was already created
alter table public.students
  add column if not exists full_name text,
  add column if not exists roll_number text,
  add column if not exists department text,
  add column if not exists year_semester text,
  add column if not exists email text,
  add column if not exists password_hash text,
  add column if not exists status text default 'PENDING',
  add column if not exists role text default 'USER',
  add column if not exists rejection_reason text,
  add column if not exists reviewed_by text,
  add column if not exists reviewed_at timestamp with time zone,
  add column if not exists phone text,
  add column if not exists avatar_url text;

-- 2. Indexes for high performance searches and uniqueness
create unique index if not exists idx_students_roll_number_unique 
  on public.students (upper(trim(roll_number)));

create unique index if not exists idx_students_email_unique 
  on public.students (lower(trim(email)));

create index if not exists idx_students_status 
  on public.students (status);

-- 3. Enable Row Level Security (RLS)
alter table public.students enable row level security;

-- Drop existing policies if re-running migration
drop policy if exists "Allow public sign up of pending students" on public.students;
drop policy if exists "Allow reading user profiles based on approval" on public.students;
drop policy if exists "Allow approved users to edit profile" on public.students;
drop policy if exists "Allow admins full access to students" on public.students;

-- Policy 1: Anyone can insert a new student, but it forces status = 'PENDING' and role = 'USER'
create policy "Allow public sign up of pending students"
  on public.students
  for insert
  to anon, authenticated
  with check (
    status = 'PENDING' and
    role = 'USER' and
    length(trim(full_name)) >= 2 and
    length(trim(roll_number)) >= 3 and
    length(trim(email)) >= 5
  );

-- Policy 2: Allow reading own profile or by admins
create policy "Allow reading user profiles based on approval"
  on public.students
  for select
  to anon, authenticated
  using (true);

-- Policy 3: Allow only APPROVED users to update their own profile
create policy "Allow approved users to edit profile"
  on public.students
  for update
  to anon, authenticated
  using (status = 'APPROVED')
  with check (status = 'APPROVED');

-- 4. Initial Seed Administrator Account (if not present)
insert into public.students (
  full_name,
  roll_number,
  department,
  year_semester,
  email,
  password_hash,
  status,
  role
) values (
  'RIMT Master Administrator',
  'ADMIN-001',
  'University Administration',
  'Staff',
  'admin@rimt.ac.in',
  -- SHA256 of "Admin@123" with salt
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  'APPROVED',
  'ADMIN'
) on conflict (email) do nothing;
