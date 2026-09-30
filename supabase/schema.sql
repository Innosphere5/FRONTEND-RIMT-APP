-- ====================================================================
-- RIMT ACADEMIC TRUST: DATABASE MIGRATION SCRIPT FOR SUPABASE
-- Run this script in the Supabase Dashboard -> SQL Editor
-- Project Reference: pwghazyfxhypzkadqfnn
-- ====================================================================

-- 1. Create the `students` table to store student credentials
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  roll_no text not null unique,
  course text,
  department text,
  batch text,
  semester text default 'Semester 1',
  status text default 'VERIFIED',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.students
  add column if not exists name text,
  add column if not exists course text,
  add column if not exists department text,
  add column if not exists batch text,
  add column if not exists semester text default 'Semester 1',
  add column if not exists status text default 'VERIFIED',
  add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  add column if not exists phone text,
  add column if not exists avatar_url text,
  add column if not exists banner_url text;

notify pgrst, 'reload schema';

-- 2. Create index on upper(trim(roll_no)) for case-insensitive instant lookups
create index if not exists idx_students_roll_no_upper 
  on public.students (upper(trim(roll_no)));

-- 3. Enable Row Level Security (RLS)
alter table public.students enable row level security;

-- 4. Drop existing policies if re-running
drop policy if exists "Allow public read of student profiles" on public.students;
drop policy if exists "Allow public sign up of students" on public.students;
drop policy if exists "Allow public update of student profile" on public.students;

-- 5. Policy: Allow anon and authenticated roles to SELECT (needed for Sign In via Roll No)
create policy "Allow public read of student profiles"
  on public.students
  for select
  to anon, authenticated
  using (true);

-- 6. Policy: Allow anon and authenticated roles to INSERT (needed for Sign Up with Name & Roll No)
create policy "Allow public sign up of students"
  on public.students
  for insert
  to anon, authenticated
  with check (
    length(trim(name)) >= 2 and 
    length(trim(roll_no)) >= 3
  );

-- 7. Policy: Allow students to update their profile
create policy "Allow public update of student profile"
  on public.students
  for update
  to anon, authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('student-media', 'student-media', true, 52428800, null)
on conflict (id) do update
set public = true,
    file_size_limit = 52428800,
    allowed_mime_types = null;

drop policy if exists "Public read student profile media" on storage.objects;
drop policy if exists "Public upload student profile media" on storage.objects;
drop policy if exists "Public update student profile media" on storage.objects;
drop policy if exists "Public delete student profile media" on storage.objects;

create policy "Public read student profile media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'student-media');

create policy "Public upload student profile media"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'student-media');

create policy "Public update student profile media"
  on storage.objects for update to anon, authenticated
  using (bucket_id = 'student-media')
  with check (bucket_id = 'student-media');

create policy "Public delete student profile media"
  on storage.objects for delete to anon, authenticated
  using (bucket_id = 'student-media');

-- 8. Create document metadata for student uploads
create table if not exists public.student_documents (
  id uuid primary key default gen_random_uuid(),
  roll_no text not null,
  title text not null,
  original_filename text not null,
  mime_type text not null,
  file_size bigint,
  cloudinary_url text not null,
  cloudinary_public_id text not null,
  storage_provider text default 'supabase',
  resource_type text default 'raw',
  format text,
  status text default 'Uploaded',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.student_documents
  add column if not exists title text,
  add column if not exists original_filename text,
  add column if not exists mime_type text,
  add column if not exists file_size bigint,
  add column if not exists cloudinary_url text,
  add column if not exists cloudinary_public_id text,
  add column if not exists storage_provider text default 'supabase',
  add column if not exists resource_type text default 'raw',
  add column if not exists format text,
  add column if not exists status text default 'Uploaded',
  add column if not exists created_at timestamp with time zone default timezone('utc'::text, now());

create index if not exists idx_student_documents_roll_no
  on public.student_documents (upper(trim(roll_no)), created_at desc);

alter table public.student_documents enable row level security;

drop policy if exists "Allow public read of student documents" on public.student_documents;
drop policy if exists "Allow public insert of student documents" on public.student_documents;
drop policy if exists "Allow public update of student documents" on public.student_documents;
drop policy if exists "Allow public delete of student documents" on public.student_documents;

create policy "Allow public read of student documents"
  on public.student_documents
  for select
  to anon, authenticated
  using (true);

create policy "Allow public insert of student documents"
  on public.student_documents
  for insert
  to anon, authenticated
  with check (length(trim(roll_no)) >= 3 and length(trim(original_filename)) >= 1);

create policy "Allow public update of student documents"
  on public.student_documents
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Allow public delete of student documents"
  on public.student_documents
  for delete
  to anon, authenticated
  using (true);

notify pgrst, 'reload schema';
