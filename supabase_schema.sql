-- =========================================================
-- HORIZON Home Tuition Platform - Master Supabase Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/rrxnkmfyqcgyzmpfsxeq/sql/new
-- =========================================================

-- Enable UUID Extension
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------
-- 1. PROFILES TABLE (Synced with Supabase auth.users)
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'student_parent' check (role in ('student_parent', 'teacher', 'admin')),
  full_name text not null,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.profiles add column if not exists role text default 'student_parent';
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- ---------------------------------------------------------
-- 2. TUTOR PROFILES TABLE
-- ---------------------------------------------------------
create table if not exists public.tutor_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  college text default 'PCE PURNIA',
  degree_status text default 'B.Tech/BS: 3rd sem with 7.2 CGPA',
  experience_years text default '3+ years teaching experience',
  medium_preference text default 'Hindi medium only',
  subjects text default 'Mathematics, Science, Foundation Physics',
  bio_and_custom_notes text default 'Dedicated educator specialized in CBSE and Bihar State Board Hindi-medium learners with personalized doubt clearing.',
  rating numeric(3, 1) default 5.0,
  hourly_rate numeric default 500,
  status text default 'verified',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.tutor_profiles add column if not exists college text default 'PCE PURNIA';
alter table public.tutor_profiles add column if not exists degree_status text default 'B.Tech/BS: 3rd sem with 7.2 CGPA';
alter table public.tutor_profiles add column if not exists experience_years text default '3+ years teaching experience';
alter table public.tutor_profiles add column if not exists medium_preference text default 'Hindi medium only';
alter table public.tutor_profiles add column if not exists subjects text default 'Mathematics, Science, Foundation Physics';
alter table public.tutor_profiles add column if not exists bio_and_custom_notes text default 'Dedicated educator specialized in CBSE and Bihar State Board Hindi-medium learners with personalized doubt clearing.';
alter table public.tutor_profiles add column if not exists rating numeric(3,1) default 5.0;
alter table public.tutor_profiles add column if not exists status text default 'verified';

-- ---------------------------------------------------------
-- 3. STUDENT ASSIGNMENTS TABLE (Live Active & Past Students)
-- ---------------------------------------------------------
create table if not exists public.student_assignments (
  id uuid primary key default uuid_generate_v4(),
  tutor_id uuid references auth.users(id) on delete set null,
  student_name text not null,
  parent_name text,
  phone text,
  class_grade text not null,
  board text default 'CBSE',
  medium text default 'Hindi / Bilingual',
  subjects text not null,
  status text not null default 'active' check (status in ('active', 'completed', 'paused', 'trial')),
  start_date text default '2026-06-01',
  end_date text,
  schedule_days text default 'Mon, Wed, Fri (5:00 PM - 6:30 PM)',
  monthly_fee numeric default 4500,
  attendance_percent numeric default 96,
  academic_score text default '88%',
  location text default 'Purnia / Online',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.student_assignments add column if not exists parent_name text;
alter table public.student_assignments add column if not exists phone text;
alter table public.student_assignments add column if not exists medium text default 'Hindi / Bilingual';
alter table public.student_assignments add column if not exists attendance_percent numeric default 96;
alter table public.student_assignments add column if not exists academic_score text default '88%';
alter table public.student_assignments add column if not exists location text default 'Purnia / Online';

-- ---------------------------------------------------------
-- 4. MONTHLY READING TASKS (Current Month's Syllabus Targets)
-- ---------------------------------------------------------
create table if not exists public.student_reading_tasks (
  id uuid primary key default uuid_generate_v4(),
  student_name text not null,
  tutor_id uuid references auth.users(id) on delete set null,
  month_year text not null default 'September 2026',
  task_title text not null,
  subject text not null default 'Mathematics',
  target_date text,
  status text not null default 'in_progress' check (status in ('pending', 'in_progress', 'completed')),
  milestone_details text,
  next_report_weight text default 'High (Included in upcoming Monthly Report)',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.student_reading_tasks add column if not exists milestone_details text;
alter table public.student_reading_tasks add column if not exists next_report_weight text default 'High (Included in upcoming Monthly Report)';

-- ---------------------------------------------------------
-- 5. STUDENT TESTS & ASSESSMENTS (Monthly Tests & Teacher Details)
-- ---------------------------------------------------------
create table if not exists public.student_tests (
  id uuid primary key default uuid_generate_v4(),
  student_name text not null,
  tutor_id uuid references auth.users(id) on delete set null,
  conducted_by_tutor_name text not null default 'PIYUSH KUMAR PATEL',
  tutor_college_info text default 'PCE PURNIA',
  subject text not null,
  test_title text not null,
  test_date text default '2026-09-15',
  total_marks numeric not null default 50,
  marks_obtained numeric not null default 44,
  percentage numeric generated always as (round((marks_obtained / nullif(total_marks, 0)) * 100, 1)) stored,
  tutor_remarks text default 'Excellent grasp of algebraic steps. Needs slight practice with sign conversions.',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.student_tests add column if not exists tutor_college_info text default 'PCE PURNIA';
alter table public.student_tests add column if not exists tutor_remarks text;

-- ---------------------------------------------------------
-- 6. MONTHLY REPORTS TABLE
-- ---------------------------------------------------------
create table if not exists public.monthly_reports (
  id uuid primary key default uuid_generate_v4(),
  tutor_id uuid references auth.users(id) on delete set null,
  student_name text not null,
  student_class text not null default 'Class 10 (CBSE)',
  month text not null default 'September 2026',
  attendance_percentage numeric default 96,
  marks_percentage numeric default 88,
  syllabus_covered text default 'Quadratic Equations, Light Reflection & Refraction, Chemical Reactions.',
  tutor_remarks text default 'Consistent progress in daily problem-solving and timely homework submissions.',
  conducting_tutor_name text default 'PIYUSH KUMAR PATEL',
  status text not null default 'published' check (status in ('draft', 'published', 'verified')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.monthly_reports add column if not exists conducting_tutor_name text default 'PIYUSH KUMAR PATEL';
alter table public.monthly_reports add column if not exists student_class text default 'Class 10 (CBSE)';

-- ---------------------------------------------------------
-- 7. SEED REAL INITIAL RECORDS
-- ---------------------------------------------------------
-- Insert Active Students
insert into public.student_assignments (student_name, parent_name, phone, class_grade, board, medium, subjects, status, start_date, schedule_days, monthly_fee, attendance_percent, academic_score, location)
values 
  ('Aarav Sharma', 'Rajesh Sharma', '+91 98765 43210', 'Class 10', 'CBSE', 'Hindi / Bilingual', 'Mathematics & Science', 'active', '2026-06-01', 'Mon, Wed, Fri (5:00 PM - 6:30 PM)', 4500, 96, '88%', 'Bhattai Bazar, Purnia'),
  ('Rohan Verma', 'Sanjay Verma', '+91 98111 22334', 'Class 9', 'CBSE', 'Hindi medium only', 'Mathematics & Foundation Physics', 'active', '2026-07-15', 'Tue, Thu, Sat (4:00 PM - 5:30 PM)', 4000, 92, '84%', 'Navratan Hatta, Purnia')
on conflict do nothing;

-- Insert Past / Graduated Students
insert into public.student_assignments (student_name, parent_name, phone, class_grade, board, medium, subjects, status, start_date, end_date, schedule_days, monthly_fee, attendance_percent, academic_score, location)
values 
  ('Ananya Singh', 'Mahesh Singh', '+91 94312 34567', 'Class 10 (Board Completed)', 'CBSE', 'Bilingual', 'Full Science & Mathematics', 'completed', '2025-04-01', '2026-03-31', '6 Days / Week (Special Batch)', 5500, 98, '94.6% in 10th Boards', 'Line Bazar, Purnia'),
  ('Vikas Jha', 'Anil Jha', '+91 91234 56789', 'Class 8 (Promoted to 9th)', 'Bihar State Board', 'Hindi medium only', 'All Core Subjects', 'completed', '2025-08-01', '2026-03-15', 'Mon to Fri (6:00 PM - 7:30 PM)', 3500, 95, '89% Annual Exam', 'Madhubani, Purnia')
on conflict do nothing;

-- Insert Monthly Reading Tasks for Upcoming Report
insert into public.student_reading_tasks (student_name, month_year, task_title, subject, target_date, status, milestone_details, next_report_weight)
values 
  ('Aarav Sharma', 'September 2026', 'NCERT Ch-4 Quadratic Equations: Word Problems Exercise 4.3 & 4.4', 'Mathematics', '2026-09-24', 'in_progress', 'Crucial for upcoming Monthly Report Card & Term Assessment', 'High (Included in upcoming Monthly Report)'),
  ('Aarav Sharma', 'September 2026', 'Physics Ray Optics: Lens Formula & Sign Convention Numerical practice', 'Science (Physics)', '2026-09-27', 'pending', 'Will be evaluated in next Sunday test', 'High (Included in upcoming Monthly Report)'),
  ('Rohan Verma', 'September 2026', 'Polynomials Factor Theorem & Remainder Theorem Proofs', 'Mathematics', '2026-09-25', 'in_progress', 'Target for September final report assessment', 'High (Included in upcoming Monthly Report)')
on conflict do nothing;

-- Insert Monthly Tests with Conducting Teacher Details
insert into public.student_tests (student_name, conducted_by_tutor_name, tutor_college_info, subject, test_title, test_date, total_marks, marks_obtained, tutor_remarks)
values 
  ('Aarav Sharma', 'PIYUSH KUMAR PATEL', 'PCE PURNIA', 'Mathematics', 'Monthly Unit Test 2 — Arithmetic Progressions & Quadratic Equations', '2026-09-16', 50, 46, 'Brilliant precision in formula substitution. Speed improved by 25%.'),
  ('Aarav Sharma', 'PIYUSH KUMAR PATEL', 'PCE PURNIA', 'Science', 'Physics Quiz — Reflection of Light & Mirror Equations', '2026-09-08', 30, 27, 'Ray diagrams were neatly drawn with accurate focal distance markers.'),
  ('Rohan Verma', 'PIYUSH KUMAR PATEL', 'PCE PURNIA', 'Mathematics', 'Number Systems & Rationalisation Mastery Test', '2026-09-12', 40, 35, 'Very good foundation. Just needs revision in radical conjugates.')
on conflict do nothing;

-- Insert Seed Monthly Reports
insert into public.monthly_reports (student_name, student_class, month, attendance_percentage, marks_percentage, syllabus_covered, tutor_remarks, conducting_tutor_name, status)
values 
  ('Aarav Sharma', 'Class 10 (CBSE)', 'September 2026', 96, 88, 'Quadratic Equations (Ex 4.1 to 4.3), Light Reflection & Spherical Mirrors, Chemical Reactions balancing.', 'Aarav has shown remarkable dedication this month. Daily problem solving has elevated his confidence in Mathematics.', 'PIYUSH KUMAR PATEL', 'published'),
  ('Rohan Verma', 'Class 9 (CBSE)', 'September 2026', 92, 84, 'Polynomials factorization, Laws of Motion & Momentum numericals.', 'Active participation in doubt clearing. Homework submitted punctually.', 'PIYUSH KUMAR PATEL', 'published')
on conflict do nothing;

-- ---------------------------------------------------------
-- 8. ROW LEVEL SECURITY & PERMISSIONS
-- ---------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.tutor_profiles enable row level security;
alter table public.student_assignments enable row level security;
alter table public.student_reading_tasks enable row level security;
alter table public.student_tests enable row level security;
alter table public.monthly_reports enable row level security;

-- Public/Authenticated Access Policies
create policy "Allow all read profiles" on public.profiles for select using (true);
create policy "Allow user update profiles" on public.profiles for all using (true);

create policy "Allow all read tutor_profiles" on public.tutor_profiles for select using (true);
create policy "Allow update tutor_profiles" on public.tutor_profiles for all using (true);

create policy "Allow all read student_assignments" on public.student_assignments for select using (true);
create policy "Allow all insert student_assignments" on public.student_assignments for insert with check (true);
create policy "Allow all update student_assignments" on public.student_assignments for update using (true);

create policy "Allow all read student_reading_tasks" on public.student_reading_tasks for select using (true);
create policy "Allow all insert student_reading_tasks" on public.student_reading_tasks for insert with check (true);
create policy "Allow all update student_reading_tasks" on public.student_reading_tasks for update using (true);

create policy "Allow all read student_tests" on public.student_tests for select using (true);
create policy "Allow all insert student_tests" on public.student_tests for insert with check (true);
create policy "Allow all update student_tests" on public.student_tests for update using (true);

create policy "Allow all read monthly_reports" on public.monthly_reports for select using (true);
create policy "Allow all insert monthly_reports" on public.monthly_reports for insert with check (true);
create policy "Allow all update monthly_reports" on public.monthly_reports for update using (true);
