-- Supabase Schema for HORIZON Platform

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. User Profiles (Multi-Role: student_parent, teacher, admin)
create table if not exists user_profiles (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('student_parent', 'teacher', 'admin')),
  full_name text not null,
  email text unique not null,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Teacher Profiles
create table if not exists teacher_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references user_profiles(id) on delete cascade,
  tutor_code text unique,
  full_name text not null,
  languages text default 'Hindi, English',
  degree_status text default 'B.Tech/BS: 3rd sem with 7.2 CGPA',
  college text default 'PCE PURNIA',
  experience_years text default '3+ years teaching experience',
  medium_preference text default 'Hindi medium only',
  subjects text default 'Mathematics, Science',
  classes_handled text default 'Class 5 to 10',
  bio_and_custom_notes text default 'Experienced educator passionate about concept clarity and student score improvement.',
  verification_status text default 'verified',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Student Profiles & Enquiries
create table if not exists student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references user_profiles(id) on delete cascade,
  student_name text not null,
  parent_name text,
  phone text,
  email text,
  class_level text default 'Class 9',
  board text default 'CBSE',
  school_medium text default 'Hindi Medium',
  enquiry_date timestamp with time zone default timezone('utc'::text, now()),
  test_schedule_date timestamp with time zone default timezone('utc'::text, now() + interval '2 days'),
  test_status text default 'Scheduled',
  test_score text default '88%',
  test_remarks text default 'Strong conceptual understanding in mathematics; needs minor practice in chemical formulas.',
  assigned_teacher_id uuid references teacher_profiles(id),
  fee_status text default 'PAID',
  fee_amount numeric default 4500,
  last_fee_paid_date timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Monthly Progress Reports (Rich variables)
create table if not exists monthly_reports (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references student_profiles(id) on delete cascade,
  teacher_id uuid references teacher_profiles(id),
  report_month text not null,
  attendance_percentage numeric default 95,
  classes_taken int default 12,
  syllabus_coverage_pct numeric default 78,
  homework_completion_rate numeric default 92,
  concept_understanding_score numeric default 8.8,
  test_average_score text default '85%',
  strengths text default 'High interest in mathematics problem-solving and rapid formula retention.',
  areas_of_improvement text default 'Can improve presentation in physics long-answer questions.',
  tutor_remarks text default 'Aaryan is very attentive during sessions and actively clarifies doubts.',
  next_month_goals text default 'Complete Quadratic Equations and Coordinate Geometry chapters.',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Fee Records
create table if not exists fee_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references student_profiles(id) on delete cascade,
  month_for text not null,
  amount numeric not null,
  payment_date timestamp with time zone default timezone('utc'::text, now()),
  payment_method text default 'UPI / Online',
  receipt_no text,
  status text default 'PAID',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) and public read/write for MVP demo
alter table user_profiles enable row level security;
alter table teacher_profiles enable row level security;
alter table student_profiles enable row level security;
alter table monthly_reports enable row level security;
alter table fee_records enable row level security;

create policy "Public full access to user_profiles" on user_profiles for all using (true) with check (true);
create policy "Public full access to teacher_profiles" on teacher_profiles for all using (true) with check (true);
create policy "Public full access to student_profiles" on student_profiles for all using (true) with check (true);
create policy "Public full access to monthly_reports" on monthly_reports for all using (true) with check (true);
create policy "Public full access to fee_records" on fee_records for all using (true) with check (true);

-- Pre-seed initial sample data for Teacher (Harshit Patel), Student (Aaryan Sharma), and Admin
do $$
declare
  v_teacher_user_id uuid := gen_random_uuid();
  v_student_user_id uuid := gen_random_uuid();
  v_admin_user_id uuid := gen_random_uuid();
  v_teacher_id uuid := gen_random_uuid();
  v_student_id uuid := gen_random_uuid();
begin
  -- Seed Users
  insert into user_profiles (id, role, full_name, email, phone)
  values 
    (v_teacher_user_id, 'teacher', 'Harshit Patel', 'harshit.patel@horizon.edu', '+91 98765 43210')
  on conflict (email) do nothing;

  insert into user_profiles (id, role, full_name, email, phone)
  values 
    (v_student_user_id, 'student_parent', 'Aaryan Sharma (Parent: Ramesh Sharma)', 'ramesh.sharma@gmail.com', '+91 98111 22334')
  on conflict (email) do nothing;

  insert into user_profiles (id, role, full_name, email, phone)
  values 
    (v_admin_user_id, 'admin', 'Horizon Admin / Developer', 'admin@horizon.edu', '+91 91234 56789')
  on conflict (email) do nothing;

  -- Seed Teacher Profile
  insert into teacher_profiles (
    id, user_id, tutor_code, full_name, languages, degree_status, college,
    experience_years, medium_preference, subjects, classes_handled, bio_and_custom_notes, verification_status
  ) values (
    v_teacher_id, v_teacher_user_id, 'HZN-1024', 'Harshit Patel',
    'Hindi, English', 'B.Tech/BS: 3rd sem with 7.2 CGPA', 'PCE PURNIA',
    '3+ years teaching experience', 'Hindi medium only',
    'Mathematics, Science, Foundation IIT-JEE', 'Class 8 to 10',
    'Specialized in Hindi-medium CBSE & Bihar State Board students. Focuses on deep conceptual understanding and continuous weekly tests.',
    'verified'
  );

  -- Seed Student Profile
  insert into student_profiles (
    id, user_id, student_name, parent_name, phone, email,
    class_level, board, school_medium, enquiry_date, test_schedule_date,
    test_status, test_score, test_remarks, assigned_teacher_id, fee_status, fee_amount, last_fee_paid_date
  ) values (
    v_student_id, v_student_user_id, 'Aaryan Sharma', 'Ramesh Sharma', '+91 98111 22334', 'ramesh.sharma@gmail.com',
    'Class 9', 'CBSE', 'Hindi Medium',
    now() - interval '20 days', now() - interval '18 days',
    'Completed (Passed)', '88%', 'Demonstrated strong grasping power in arithmetic and science fundamentals.',
    v_teacher_id, 'PAID', 4500, now() - interval '5 days'
  );

  -- Seed Fee Records
  insert into fee_records (student_id, month_for, amount, payment_date, payment_method, receipt_no, status)
  values 
    (v_student_id, 'August 2026', 4500, now() - interval '35 days', 'UPI / PhonePe', 'HZN-REC-8901', 'PAID'),
    (v_student_id, 'September 2026', 4500, now() - interval '5 days', 'UPI / GPay', 'HZN-REC-9412', 'PAID');

  -- Seed Monthly Reports
  insert into monthly_reports (
    student_id, teacher_id, report_month, attendance_percentage, classes_taken,
    syllabus_coverage_pct, homework_completion_rate, concept_understanding_score,
    test_average_score, strengths, areas_of_improvement, tutor_remarks, next_month_goals
  ) values (
    v_student_id, v_teacher_id, 'August 2026', 92, 12, 70, 88, 8.2, '82%',
    'Very disciplined, punctual, and completed all foundational exercises.',
    'Needs extra practice in geometrical theorem proofs.',
    'Great improvement compared to the initial baseline diagnostic assessment.',
    'Cover Coordinate Geometry and Motion in Physics.'
  ),
  (
    v_student_id, v_teacher_id, 'September 2026', 96, 12, 85, 94, 9.0, '88%',
    'Mastered Polynomials and Linear Equations. Excellent formula retention.',
    'Work on question speed during timed mock tests.',
    'Aaryan scored highest in the weekly batch test. Ready for midterm examinations!',
    'Begin Circles theorem practice and Gravitation fundamentals.'
  );

end $$;
