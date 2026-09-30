ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS revocation_reason TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

DO $$
DECLARE
  status_constraint RECORD;
BEGIN
  FOR status_constraint IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.students'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE public.students DROP CONSTRAINT %I', status_constraint.conname);
  END LOOP;
END $$;

ALTER TABLE public.students
  ADD CONSTRAINT students_status_allowed
  CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'REVOKED', 'VERIFIED'));

UPDATE storage.buckets
SET allowed_mime_types = ARRAY(
  SELECT DISTINCT allowed_type
  FROM unnest(
    COALESCE(allowed_mime_types, ARRAY[]::TEXT[])
    || ARRAY['video/mp4', 'video/webm', 'video/quicktime']::TEXT[]
  ) AS allowed_type
)
WHERE id = 'student-media';