-- ====================================================================
-- RIMT ACADEMIC TRUST: DOCUMENT STORAGE & METADATA TABLE REPAIR
-- Run this script in the Supabase Dashboard -> SQL Editor
-- Project Reference: pwghazyfxhypzkadqfnn
-- ====================================================================

-- 1. Create or ensure public.student_documents table exists
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

-- Ensure all columns exist for existing installations
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

-- High performance indexing on normalized student roll number
create index if not exists idx_student_documents_roll_no
  on public.student_documents (upper(trim(roll_no)), created_at desc);

-- 2. Configure Row Level Security (RLS) for student_documents
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

-- 3. Configure storage bucket for student documents and media
-- Setting allowed_mime_types = null allows PDF, DOCX, DOC, images, videos, and all file formats without 415 rejection.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('student-media', 'student-media', true, 52428800, null)
on conflict (id) do update
set public = true,
    file_size_limit = 52428800,
    allowed_mime_types = null;

-- 4. Enable full RLS operations on storage.objects for the student-media bucket
drop policy if exists "Public read student profile media" on storage.objects;
drop policy if exists "Public upload student profile media" on storage.objects;
drop policy if exists "Public update student profile media" on storage.objects;
drop policy if exists "Public delete student profile media" on storage.objects;

-- SELECT policy: Allows downloading and viewing documents
create policy "Public read student profile media"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'student-media');

-- INSERT policy: Allows uploading documents
create policy "Public upload student profile media"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'student-media');

-- UPDATE policy: Allows updating documents
create policy "Public update student profile media"
  on storage.objects
  for update
  to anon, authenticated
  using (bucket_id = 'student-media')
  with check (bucket_id = 'student-media');

-- DELETE policy: Allows removing documents
create policy "Public delete student profile media"
  on storage.objects
  for delete
  to anon, authenticated
  using (bucket_id = 'student-media');

-- Notify PostgREST to immediately refresh its schema cache
notify pgrst, 'reload schema';
