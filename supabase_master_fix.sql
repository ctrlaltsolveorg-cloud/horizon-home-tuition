-- ==============================================================================
-- HORIZON HOME TUITION - COMPLETE SUPABASE DATABASE SETUP & REPAIR SCRIPT
-- Run this in your Supabase Project Dashboard -> SQL Editor -> Run
-- Project: https://supabase.com/dashboard/project/rrxnkmfyqcgyzmpfsxeq/sql
-- ==============================================================================

-- 1. Enable Required PostgreSQL Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==============================================================================
-- TABLE 1: PROFILES (User accounts for Students, Teachers & Admins)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  role text not null check (role in ('student_parent', 'teacher', 'admin')) default 'student_parent',
  full_name text not null,
  phone text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
drop policy if exists "Allow all read profiles" on public.profiles;
create policy "Allow all read profiles" on public.profiles for select using (true);
drop policy if exists "Allow all insert profiles" on public.profiles;
create policy "Allow all insert profiles" on public.profiles for insert with check (true);
drop policy if exists "Allow all update profiles" on public.profiles;
create policy "Allow all update profiles" on public.profiles for update using (true);

-- ==============================================================================
-- TABLE 2: TUTOR_PROFILES (Faculty Verification & Academic Credentials)
-- ==============================================================================
create table if not exists public.tutor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  qualification text,
  institution text,
  teaching_experience text,
  comfortable_language text,
  subjects_taught text,
  classes_handled text,
  hourly_rate numeric,
  monthly_rate numeric,
  bio text,
  city text default 'Purnia',
  is_verified boolean default false,
  rating numeric default 5.0,
  languages text default 'Hindi, English',
  degree_status text default 'Degree / Qualification',
  college text default 'PCE PURNIA',
  experience_years text default '1+ years teaching experience',
  medium_preference text default 'Hindi / English',
  bio_and_custom_notes text,
  subjects text[] default array['Mathematics', 'Science'],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure critical columns exist
alter table public.tutor_profiles add column if not exists is_verified boolean default false;
alter table public.tutor_profiles add column if not exists rating numeric default 5.0;
alter table public.tutor_profiles add column if not exists college text default 'PCE PURNIA';
alter table public.tutor_profiles add column if not exists degree_status text default 'Degree / Qualification';
alter table public.tutor_profiles add column if not exists experience_years text default '1+ years teaching experience';
alter table public.tutor_profiles add column if not exists medium_preference text default 'Hindi / English';
alter table public.tutor_profiles add column if not exists bio_and_custom_notes text;
alter table public.tutor_profiles add column if not exists subjects text[] default array['Mathematics', 'Science'];

-- Add unique constraint on email if not exists so upsert by email never fails
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'tutor_profiles_email_key'
  ) then
    begin
      alter table public.tutor_profiles add constraint tutor_profiles_email_key unique (email);
    exception when others then
      raise notice 'Could not add unique constraint on email: %', sqlerrm;
    end;
  end if;
end $$;

alter table public.tutor_profiles enable row level security;
drop policy if exists "Allow all read tutor_profiles" on public.tutor_profiles;
create policy "Allow all read tutor_profiles" on public.tutor_profiles for select using (true);
drop policy if exists "Allow all insert tutor_profiles" on public.tutor_profiles;
create policy "Allow all insert tutor_profiles" on public.tutor_profiles for insert with check (true);
drop policy if exists "Allow all update tutor_profiles" on public.tutor_profiles;
create policy "Allow all update tutor_profiles" on public.tutor_profiles for update using (true);
drop policy if exists "Allow all delete tutor_profiles" on public.tutor_profiles;
create policy "Allow all delete tutor_profiles" on public.tutor_profiles for delete using (true);

-- ==============================================================================
-- TABLE 3: TEST_CENTERS & EVALUATION_DUTIES
-- ==============================================================================
create table if not exists public.test_centers (
  id uuid primary key default gen_random_uuid(),
  center_name text not null,
  center_code text unique,
  location_address text not null,
  area_city text default 'Purnia',
  coordinator_name text default 'Academic Coordinator',
  contact_number text default '+91 9162162128',
  capacity int default 30,
  created_at timestamptz default now()
);

alter table public.test_centers enable row level security;
drop policy if exists "Allow all read test_centers" on public.test_centers;
create policy "Allow all read test_centers" on public.test_centers for select using (true);
drop policy if exists "Allow all insert test_centers" on public.test_centers;
create policy "Allow all insert test_centers" on public.test_centers for insert with check (true);
drop policy if exists "Allow all update test_centers" on public.test_centers for update using (true);

create table if not exists public.evaluation_duties (
  id uuid primary key default gen_random_uuid(),
  duty_code text unique,
  evaluation_date date default current_date,
  center_id uuid references public.test_centers(id) on delete set null,
  center_name text not null default 'Purnia Central Examination Hub',
  center_address text default 'Line Bazar Near Max Hospital, Purnia, Bihar',
  evaluator_tutor_id uuid references auth.users(id) on delete set null,
  evaluator_tutor_name text not null,
  evaluator_tutor_phone text,
  evaluator_college text default 'PCE PURNIA',
  student_ids text[] default '{}',
  student_names text[] default '{}',
  status text not null default 'SCHEDULED' check (status in ('SCHEDULED', 'ACTIVE_TODAY', 'COMPLETED', 'CANCELLED')),
  notes text,
  created_at timestamptz default now()
);

alter table public.evaluation_duties enable row level security;
drop policy if exists "Allow all read evaluation_duties" on public.evaluation_duties;
create policy "Allow all read evaluation_duties" on public.evaluation_duties for select using (true);
drop policy if exists "Allow all insert evaluation_duties" on public.evaluation_duties;
create policy "Allow all insert evaluation_duties" on public.evaluation_duties for insert with check (true);
drop policy if exists "Allow all update evaluation_duties" on public.evaluation_duties for update using (true);

-- ==============================================================================
-- TABLE 4: STUDENT_ENQUIRIES (Student Admissions & Teacher Assignments)
-- ==============================================================================
create table if not exists public.student_enquiries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references auth.users(id) on delete set null,
  parent_name text not null,
  student_name text not null,
  phone text not null,
  email text,
  class_level text not null default 'Class 9',
  board text default 'CBSE',
  school_medium text default 'English',
  address text,
  enquiry_date timestamptz default now(),
  test_schedule_date timestamptz,
  test_scheduled_date text,
  test_status text default 'Assessment Scheduled',
  test_score text default '88%',
  test_remarks text,
  assigned_teacher_id uuid references public.tutor_profiles(id) on delete set null,
  assigned_tutor_id uuid on delete set null,
  fee_status text default 'pending',
  fee_amount numeric default 4500,
  fee_paid_date timestamptz,
  status text default 'pending',
  notes text,
  class_subject text,
  created_at timestamptz default now()
);

alter table public.student_enquiries enable row level security;
drop policy if exists "Allow all read student_enquiries" on public.student_enquiries;
create policy "Allow all read student_enquiries" on public.student_enquiries for select using (true);
drop policy if exists "Allow all insert student_enquiries" on public.student_enquiries;
create policy "Allow all insert student_enquiries" on public.student_enquiries for insert with check (true);
drop policy if exists "Allow all update student_enquiries" on public.student_enquiries;
create policy "Allow all update student_enquiries" on public.student_enquiries for update using (true);

-- ==============================================================================
-- TABLE 5: STUDENT_ASSIGNMENTS (Active batches allocated to tutors)
-- ==============================================================================
create table if not exists public.student_assignments (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid references auth.users(id) on delete set null,
  student_name text not null,
  parent_name text,
  phone text,
  class_grade text not null default 'Class 9',
  board text default 'CBSE',
  medium text default 'Hindi / Bilingual',
  subjects text not null default 'Complete Board Syllabus',
  status text not null default 'active' check (status in ('active', 'completed', 'paused', 'trial')),
  start_date text default '2026-10-01',
  end_date text,
  schedule_days text default 'Mon, Wed, Fri (5:00 PM - 6:30 PM)',
  monthly_fee numeric default 4500,
  attendance_percent numeric default 100,
  academic_score text default 'Diagnostic Enrolled',
  location text default 'Purnia',
  created_at timestamptz default now()
);

-- Crucial: Enable RLS and add fully open policies so Admin & Tutors can insert/read without 42501 error!
alter table public.student_assignments enable row level security;
drop policy if exists "Allow all read student_assignments" on public.student_assignments;
create policy "Allow all read student_assignments" on public.student_assignments for select using (true);
drop policy if exists "Allow all insert student_assignments" on public.student_assignments;
create policy "Allow all insert student_assignments" on public.student_assignments for insert with check (true);
drop policy if exists "Allow all update student_assignments" on public.student_assignments;
create policy "Allow all update student_assignments" on public.student_assignments for update using (true);
drop policy if exists "Allow all delete student_assignments" on public.student_assignments;
create policy "Allow all delete student_assignments" on public.student_assignments for delete using (true);

-- ==============================================================================
-- TABLE 6: MONTHLY_REPORT_CARDS (Official Evaluated Cross-Audit Reports)
-- ==============================================================================
create table if not exists public.monthly_report_cards (
  id uuid primary key default gen_random_uuid(),
  report_code text unique,
  student_id text not null,
  student_name text not null,
  parent_name text,
  class_grade text not null default 'Class 7th • CBSE/ICSE',
  board text default 'CBSE',
  assessment_month text not null,
  
  -- Teaching vs Evaluator
  regular_tutor_id text,
  assigned_tutor_name text not null default 'Assigned Tutor',
  assigned_tutor_contact text,
  evaluator_tutor_id text,
  evaluator_tutor_name text not null default 'Vikash Kumar (Certified Cross-Examiner)',
  evaluator_tutor_contact text,
  test_center_id uuid references public.test_centers(id) on delete set null,
  test_center_name text,
  duty_id uuid references public.evaluation_duties(id) on delete set null,

  -- Section 1: Passage Reading & Comprehension
  hindi_passage_length_time text default '160 Words • 1m 25s',
  hindi_speed_wpm text default '113 WPM (Good)',
  hindi_comprehension_qs text default '4.0 / 5.0 Correct (1 Error)',
  hindi_fluency text default '8.50 / 10.00',
  english_passage_length_time text default '175 Words • 1m 35s',
  english_speed_wpm text default '110 WPM (Optimal)',
  english_comprehension_qs text default '5.0 / 5.0 Correct (0 Error)',
  english_fluency text default '9.00 / 10.00',

  -- Section 2: Academic Chapter Assessments
  math_ch1_name text default 'Ch 1: Integers, Number Line & Rules',
  math_ch1_marks text default '9.50 / 10.00',
  math_ch1_status text default 'Cleared',
  math_ch2_name text default 'Ch 2: Fractions, Decimals & Problem Sums',
  math_ch2_marks text default '8.50 / 10.00',
  math_ch2_status text default 'Cleared',

  science_ch1_name text default 'Ch 1: Nutrition in Plants (Modes & Photosynthesis)',
  science_ch1_marks text default '9.00 / 10.00',
  science_ch1_status text default 'Cleared',
  science_ch2_name text default 'Ch 2: Nutrition in Animals (Digestive Organs)',
  science_ch2_marks text default '7.50 / 10.00',
  science_ch2_status text default 'Revision',

  sst_ch1_name text default 'Ch 1: Tracing Changes Through a Thousand Years',
  sst_ch1_marks text default '8.50 / 10.00',
  sst_ch1_status text default 'Cleared',
  sst_ch2_name text default 'Ch 2: Our Environment & Earth Interior Layers',
  sst_ch2_marks text default '8.00 / 10.00',
  sst_ch2_status text default 'Cleared',

  lang_eng_name text default 'English (Ch 1-2): Three Questions & The Squirrel',
  lang_eng_marks text default '9.00 / 10.00',
  lang_eng_status text default 'Cleared',
  lang_hindi_name text default 'Hindi (Ch 1-2): हम पंछी उन्मुक्त गगन के & दादी माँ',
  lang_hindi_marks text default '8.50 / 10.00',
  lang_hindi_status text default 'Cleared',

  -- Section 3: Communication & English Usage
  manners_max numeric default 10.00,
  manners_score numeric default 9.50,
  manners_obs text default 'Polite, attentive; follows homework schedules obediently.',
  confidence_max numeric default 10.00,
  confidence_score numeric default 8.50,
  confidence_obs text default 'Answers without shyness; asks doubts with clarity.',
  english_usage_max numeric default 10.00,
  english_usage_score numeric default 8.00,
  english_usage_obs text default '~65% English words used actively during tuition hours.',

  -- Section 4: Super-Intelligence Pillars
  mental_math_score text default '9.0 / 10.00',
  mental_math_obs text default 'Fast oral tables up to 19; prompt mental addition without rough notebook dependence.',
  logical_aptitude_score text default '8.5 / 10.00',
  logical_aptitude_obs text default 'Solved 4/5 pattern-finding and critical reasoning puzzles during weekly aptitude rounds.',
  homework_score text default '9.5 / 10.00',
  homework_obs text default '96% daily homework completion rate on time without needing repeated follow-ups.',
  neatness_score text default '8.0 / 10.00',
  neatness_obs text default 'Clean margin maintenance; neat step-by-step working. Science diagram labeling can improve.',

  -- Summary & Quality Audit
  overall_percentage numeric default 86.5,
  grade text default 'Grade A+ Outstanding',
  next_month_target text default 'Next two chapters in all subjects',
  focus_recommendation text default 'Daily 15m English book reading at home',
  coordinator_name text default 'Horizon Academic Quality Cell',
  status text default 'VERIFIED',
  created_at timestamptz default now()
);

alter table public.monthly_report_cards enable row level security;
drop policy if exists "Public can view report cards" on public.monthly_report_cards;
create policy "Public can view report cards" on public.monthly_report_cards for select using (true);
drop policy if exists "Evaluators can insert report cards" on public.monthly_report_cards;
create policy "Evaluators can insert report cards" on public.monthly_report_cards for all using (true) with check (true);

-- ==============================================================================
-- 7. SYNC ALL REGISTERED TEACHERS INTO TUTOR_PROFILES & SET VERIFIED
-- ==============================================================================
insert into public.tutor_profiles (
  id, user_id, full_name, email, phone, is_verified, rating, college, degree_status, experience_years, medium_preference, subjects
)
select 
  p.id,
  p.id,
  p.full_name,
  p.email,
  p.phone,
  true, -- Verified by default for registered teachers
  5.0,
  'PCE PURNIA',
  'B.Tech/BS: 3rd sem with 7.2 CGPA',
  '3+ years teaching experience',
  'Hindi / English',
  array['Mathematics', 'Science']
from public.profiles p
where p.role = 'teacher'
on conflict (id) do update set
  is_verified = true,
  rating = 5.0,
  updated_at = now();

-- Refresh Schema Cache
notify pgrst, 'reload schema';
