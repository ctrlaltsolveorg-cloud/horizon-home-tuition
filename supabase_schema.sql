-- =========================================================
-- HORIZON Home Tuition Platform - Master Supabase Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
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

-- Ensure columns exist if table was already created
alter table public.profiles add column if not exists role text default 'student_parent';
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- Automatic Profile Creation Trigger on Supabase Auth Sign Up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student_parent'),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(excluded.full_name, profiles.full_name),
      role = coalesce(excluded.role, profiles.role),
      phone = coalesce(excluded.phone, profiles.phone),
      updated_at = now();

  -- If registered as teacher, auto-seed or link tutor profile
  if (coalesce(new.raw_user_meta_data->>'role', '') = 'teacher') then
    insert into public.tutor_profiles (
      id, user_id, full_name, college, degree_status, experience_years,
      medium_preference, subjects, bio_and_custom_notes, phone, email, rating
    ) values (
      new.id,
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
      coalesce(new.raw_user_meta_data->>'college', 'PCE PURNIA'),
      coalesce(new.raw_user_meta_data->>'degree_status', 'B.Tech/BS: 3rd sem with 7.2 CGPA'),
      coalesce(new.raw_user_meta_data->>'experience_years', '3+ years teaching experience'),
      coalesce(new.raw_user_meta_data->>'medium_preference', 'Hindi medium only'),
      coalesce(new.raw_user_meta_data->>'subjects', 'Mathematics, Science, Foundation Physics'),
      coalesce(new.raw_user_meta_data->>'bio', 'Dedicated educator specialized in Hindi-medium CBSE and State Board curriculum.'),
      coalesce(new.raw_user_meta_data->>'phone', ''),
      new.email,
      5.0
    ) on conflict (id) do update
    set college = coalesce(excluded.college, tutor_profiles.college),
        degree_status = coalesce(excluded.degree_status, tutor_profiles.degree_status),
        experience_years = coalesce(excluded.experience_years, tutor_profiles.experience_years),
        medium_preference = coalesce(excluded.medium_preference, tutor_profiles.medium_preference),
        subjects = coalesce(excluded.subjects, tutor_profiles.subjects),
        bio_and_custom_notes = coalesce(excluded.bio_and_custom_notes, tutor_profiles.bio_and_custom_notes),
        updated_at = now();
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------
-- 2. TUTOR PROFILES TABLE (Teacher Accreditation & Workspace)
-- ---------------------------------------------------------
create table if not exists public.tutor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  full_name text not null,
  college text default 'PCE PURNIA',
  degree_status text default 'B.Tech/BS: 3rd sem with 7.2 CGPA',
  experience_years text default '3+ years teaching experience',
  medium_preference text default 'Hindi medium only',
  languages text default 'Hindi, English, Maithili',
  bio_and_custom_notes text default 'Dedicated home tutor from PCE Purnia. Specialized in CBSE and Bihar State Board Hindi-medium students.',
  phone text,
  email text,
  subjects text default 'Mathematics, Science, Foundation Physics',
  classes_handled text default 'Class 8 to 10',
  rating numeric default 5.0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ensure all columns exist
alter table public.tutor_profiles add column if not exists user_id uuid references public.profiles(id) on delete cascade;
alter table public.tutor_profiles add column if not exists college text default 'PCE PURNIA';
alter table public.tutor_profiles add column if not exists degree_status text default 'B.Tech/BS: 3rd sem with 7.2 CGPA';
alter table public.tutor_profiles add column if not exists experience_years text default '3+ years teaching experience';
alter table public.tutor_profiles add column if not exists medium_preference text default 'Hindi medium only';
alter table public.tutor_profiles add column if not exists languages text default 'Hindi, English, Maithili';
alter table public.tutor_profiles add column if not exists bio_and_custom_notes text;
alter table public.tutor_profiles add column if not exists phone text;
alter table public.tutor_profiles add column if not exists email text;
alter table public.tutor_profiles add column if not exists subjects text default 'Mathematics, Science, Foundation Physics';
alter table public.tutor_profiles add column if not exists classes_handled text default 'Class 8 to 10';
alter table public.tutor_profiles add column if not exists rating numeric default 5.0;
alter table public.tutor_profiles add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- ---------------------------------------------------------
-- 3. STUDENT ENQUIRIES TABLE (Enquiry, Diagnostic Test & Fee)
-- ---------------------------------------------------------
create table if not exists public.student_enquiries (
  id uuid primary key default gen_random_uuid(),
  student_id text,
  student_name text not null,
  parent_name text not null,
  phone text not null,
  email text,
  class_level text default 'Class 9',
  board text default 'CBSE',
  school_medium text default 'Hindi Medium',
  address text default 'Line Bazar, Purnia',
  enquiry_date timestamp with time zone default timezone('utc'::text, now()),
  test_schedule_date timestamp with time zone default timezone('utc'::text, now() + interval '2 days'),
  test_scheduled_date timestamp with time zone default timezone('utc'::text, now() + interval '2 days'),
  test_status text default 'Completed (Passed)',
  test_score text default '88%',
  test_remarks text default 'Demonstrated high aptitude in arithmetic & science fundamentals.',
  assigned_teacher_id uuid,
  fee_status text default 'PAID',
  fee_amount numeric default 4500,
  fee_paid_date timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ensure all columns exist
alter table public.student_enquiries add column if not exists student_id text;
alter table public.student_enquiries add column if not exists parent_name text default 'Guardian';
alter table public.student_enquiries add column if not exists class_level text default 'Class 9';
alter table public.student_enquiries add column if not exists board text default 'CBSE';
alter table public.student_enquiries add column if not exists school_medium text default 'Hindi Medium';
alter table public.student_enquiries add column if not exists address text default 'Purnia';
alter table public.student_enquiries add column if not exists fee_status text default 'PAID';
alter table public.student_enquiries add column if not exists fee_amount numeric default 4500;
alter table public.student_enquiries add column if not exists fee_paid_date timestamp with time zone default timezone('utc'::text, now());

-- ---------------------------------------------------------
-- 4. MONTHLY REPORTS TABLE (Academic Progress Tracking)
-- ---------------------------------------------------------
create table if not exists public.monthly_reports (
  id uuid primary key default gen_random_uuid(),
  student_id text not null,
  report_month text not null,
  total_classes_scheduled integer default 12,
  total_classes_conducted integer default 12,
  student_attendance_percentage numeric default 98,
  academic_progress_rating numeric default 9.5,
  syllabus_covered text default 'Quadratic Equations, Work & Energy',
  tutor_remarks text default 'Consistent weekly improvement. Demonstrating high grasping power.',
  areas_of_improvement text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.monthly_reports add column if not exists total_classes_scheduled integer default 12;
alter table public.monthly_reports add column if not exists total_classes_conducted integer default 12;
alter table public.monthly_reports add column if not exists student_attendance_percentage numeric default 98;
alter table public.monthly_reports add column if not exists academic_progress_rating numeric default 9.5;
alter table public.monthly_reports add column if not exists syllabus_covered text;
alter table public.monthly_reports add column if not exists tutor_remarks text;

-- ---------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.tutor_profiles enable row level security;
alter table public.student_enquiries enable row level security;
alter table public.monthly_reports enable row level security;

-- Profiles Policies
drop policy if exists "Public profiles read" on public.profiles;
create policy "Public profiles read" on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (true);

-- Tutor Profiles Policies (Full Access for Realtime Workspace)
drop policy if exists "Public tutor read" on public.tutor_profiles;
create policy "Public tutor read" on public.tutor_profiles for select using (true);

drop policy if exists "Tutors can update own profile" on public.tutor_profiles;
create policy "Tutors can update own profile" on public.tutor_profiles for all using (true) with check (true);

-- Student Enquiries Policies
drop policy if exists "Enquiries full access" on public.student_enquiries;
create policy "Enquiries full access" on public.student_enquiries for all using (true) with check (true);

-- Monthly Reports Policies
drop policy if exists "Reports full access" on public.monthly_reports;
create policy "Reports full access" on public.monthly_reports for all using (true) with check (true);

-- ---------------------------------------------------------
-- 6. INITIAL SEED DATA FOR DEMO & TESTING
-- ---------------------------------------------------------
insert into public.tutor_profiles (
  id, full_name, college, degree_status, experience_years,
  medium_preference, languages, bio_and_custom_notes, phone, email, rating
) values (
  '11111111-1111-4111-8111-111111111111', 'Harshit Patel', 'PCE PURNIA', 'B.Tech/BS: 3rd sem with 7.2 CGPA',
  '3+ years teaching experience', 'Hindi medium only', 'Hindi, English, Maithili',
  'Dedicated educator from PCE Purnia specialized in Hindi-medium CBSE & Bihar Board students.',
  '+91 98765 43210', 'harshit.patel@horizon.edu', 4.9
) on conflict (id) do update
set college = excluded.college,
    degree_status = excluded.degree_status,
    experience_years = excluded.experience_years,
    medium_preference = excluded.medium_preference;

insert into public.student_enquiries (
  student_id, student_name, parent_name, phone, email,
  class_level, board, school_medium, address, test_status, test_score,
  test_remarks, assigned_teacher_id, fee_status, fee_amount
) values (
  'stud-1', 'Aaryan Sharma', 'Ramesh Sharma', '+91 98111 22334', 'ramesh.sharma@gmail.com',
  'Class 9', 'CBSE', 'Hindi Medium', 'Line Bazar, Purnia',
  'Completed (Passed)', '88%',
  'Demonstrated strong grasping power in arithmetic and science fundamentals.',
  '11111111-1111-4111-8111-111111111111', 'PAID', 4500
) on conflict (id) do nothing;
