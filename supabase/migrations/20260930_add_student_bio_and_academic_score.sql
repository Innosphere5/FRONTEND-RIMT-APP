-- ====================================================================
-- RIMT UNIVERSITY: STUDENT LINKEDIN PROFILE & ACADEMIC SCORE EXTENSION
-- Enables student bio, headline, academic score (CGPA), banner, and projects
-- Run this in the Supabase Dashboard SQL Editor
-- ====================================================================

-- 1. Ensure all LinkedIn-style profile columns exist on public.students
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS headline TEXT,
  ADD COLUMN IF NOT EXISTS cgpa NUMERIC(4,2),
  ADD COLUMN IF NOT EXISTS academic_score NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS banner_url TEXT,
  ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT ARRAY['Full-Stack Development', 'React Native', 'Node.js', 'PostgreSQL']::text[],
  ADD COLUMN IF NOT EXISTS semester_scores JSONB DEFAULT '[]'::jsonb;

-- 2. Indexes for academic query performance
CREATE INDEX IF NOT EXISTS idx_students_cgpa ON public.students (cgpa DESC);
