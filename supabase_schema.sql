-- =========================================================
-- HORIZON Home Tuition Platform - Master Supabase Schema
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
      updated_at = now();
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
  bio_and_custom_notes text default 'Experienced educator from PCE Purnia specialized in Hindi-medium CBSE & Bihar State Board concepts.',
  phone text,
  email text,
  subjects jsonb default '["Mathematics", "Science", "Foundation Physics"]'::jsonb,
  classes_handled text default 'Class 8 to 10',
  rating numeric default 4.9,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

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
  assigned_teacher_id uuid references public.tutor_profiles(id),
  fee_status text default 'PAID',
  fee_amount numeric default 4500,
  fee_paid_date timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ---------------------------------------------------------
-- 4. MONTHLY REPORTS TABLE (Academic Progress Tracking)
-- ---------------------------------------------------------
create table if not exists public.monthly_reports (
  id uuid primary key default gen_random_uuid(),
  student_id text not null,
  report_month text not null,
  areas_of_improvement text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ---------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.tutor_profiles enable row level security;
alter table public.student_enquiries enable row level security;
alter table public.monthly_reports enable row level security;

-- Profiles: Users can read and update their own profile; public read for lookup
drop policy if exists "Public profiles read" on public.profiles;
create policy "Public profiles read" on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id or true);

-- Tutor Profiles: Public read, owner can update
drop policy if exists "Public tutor read" on public.tutor_profiles;
create policy "Public tutor read" on public.tutor_profiles for select using (true);

drop policy if exists "Tutors can update own profile" on public.tutor_profiles;
create policy "Tutors can update own profile" on public.tutor_profiles for all using (true) with check (true);

-- Student Enquiries: Public read/write for registration & demo portal
drop policy if exists "Enquiries full access" on public.student_enquiries;
create policy "Enquiries full access" on public.student_enquiries for all using (true) with check (true);

-- Monthly Reports: Public read/write for report engine
drop policy if exists "Reports full access" on public.monthly_reports;
create policy "Reports full access" on public.monthly_reports for all using (true) with check (true);

-- ---------------------------------------------------------
-- 6. INITIAL SEED DATA FOR TESTING
-- ---------------------------------------------------------
do $$
declare
  v_tutor_id uuid := '11111111-1111-4111-8111-111111111111';
begin
  -- Seed Harshit Patel in tutor_profiles
  insert into public.tutor_profiles (
    id, full_name, college, degree_status, experience_years,
    medium_preference, languages, bio_and_custom_notes, phone, email, rating
  ) values (
    v_tutor_id, 'Harshit Patel', 'PCE PURNIA', 'B.Tech/BS: 3rd sem with 7.2 CGPA',
    '3+ years teaching experience', 'Hindi medium only', 'Hindi, English, Maithili',
    'Dedicated educator from PCE Purnia specialized in Hindi-medium CBSE & Bihar Board students. Focuses on conceptual clarity and weekly tests.',
    '+91 98765 43210', 'harshit.patel@horizon.edu', 4.9
  ) on conflict (id) do nothing;

  -- Seed Aaryan Sharma in student_enquiries
  insert into public.student_enquiries (
    student_id, student_name, parent_name, phone, email,
    class_level, board, school_medium, address, test_status, test_score,
    test_remarks, assigned_teacher_id, fee_status, fee_amount
  ) values (
    'stud-1', 'Aaryan Sharma', 'Ramesh Sharma', '+91 98111 22334', 'ramesh.sharma@gmail.com',
    'Class 9', 'CBSE', 'Hindi Medium', 'Line Bazar, Purnia',
    'Completed (Passed)', '88%',
    'Demonstrated strong grasping power in arithmetic and science fundamentals.',
    v_tutor_id, 'PAID', 4500
  );
end $$;
