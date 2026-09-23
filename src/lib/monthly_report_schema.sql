-- ==============================================================================
-- HORIZON HOME TUITION - COMPREHENSIVE MONTHLY REPORT & CROSS EVALUATION SCHEMA
-- ==============================================================================

-- 1. Test Centers Table
CREATE TABLE IF NOT EXISTS public.test_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_name TEXT NOT NULL,
  center_code TEXT UNIQUE NOT NULL,
  location_address TEXT NOT NULL,
  area_city TEXT DEFAULT 'Purnia, Bihar',
  coordinator_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  capacity INT DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Evaluation Duties Table (Cross-Examiner Center Duties)
CREATE TABLE IF NOT EXISTS public.evaluation_duties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  duty_code TEXT UNIQUE NOT NULL,
  evaluation_date DATE NOT NULL,
  center_id UUID REFERENCES public.test_centers(id) ON DELETE CASCADE,
  center_name TEXT NOT NULL,
  center_address TEXT NOT NULL,
  evaluator_tutor_id TEXT NOT NULL,
  evaluator_tutor_name TEXT NOT NULL,
  evaluator_tutor_phone TEXT,
  evaluator_college TEXT DEFAULT 'PCE Purnia',
  student_ids JSONB DEFAULT '[]'::jsonb,
  student_names JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'ACTIVE_TODAY', -- SCHEDULED, ACTIVE_TODAY, COMPLETED
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Monthly Report Cards Table (All Single-Page Audit Variables)
CREATE TABLE IF NOT EXISTS public.monthly_report_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_code TEXT UNIQUE,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  parent_name TEXT,
  class_grade TEXT NOT NULL DEFAULT 'Class 7th • CBSE/ICSE',
  board TEXT DEFAULT 'CBSE',
  assessment_month TEXT NOT NULL,
  
  -- Regular Teaching Faculty vs Assigned Independent Evaluator
  regular_tutor_id TEXT,
  assigned_tutor_name TEXT NOT NULL,
  assigned_tutor_contact TEXT,
  evaluator_tutor_id TEXT,
  evaluator_tutor_name TEXT NOT NULL,
  evaluator_tutor_contact TEXT,
  test_center_id UUID REFERENCES public.test_centers(id) ON DELETE SET NULL,
  test_center_name TEXT,
  duty_id UUID REFERENCES public.evaluation_duties(id) ON DELETE SET NULL,

  -- Section 1: Passage Reading & Comprehension
  hindi_passage_length_time TEXT DEFAULT '160 Words • 1m 25s',
  hindi_speed_wpm TEXT DEFAULT '113 WPM (Good)',
  hindi_comprehension_qs TEXT DEFAULT '4.0 / 5.0 Correct (1 Error)',
  hindi_fluency TEXT DEFAULT '8.50 / 10.00',
  english_passage_length_time TEXT DEFAULT '175 Words • 1m 35s',
  english_speed_wpm TEXT DEFAULT '110 WPM (Optimal)',
  english_comprehension_qs TEXT DEFAULT '5.0 / 5.0 Correct (0 Error)',
  english_fluency TEXT DEFAULT '9.00 / 10.00',

  -- Section 2: Academic Chapter Assessments
  math_ch1_name TEXT DEFAULT 'Ch 1: Integers, Number Line & Rules',
  math_ch1_marks TEXT DEFAULT '9.50 / 10.00',
  math_ch1_status TEXT DEFAULT 'Cleared',
  math_ch2_name TEXT DEFAULT 'Ch 2: Fractions, Decimals & Problem Sums',
  math_ch2_marks TEXT DEFAULT '8.50 / 10.00',
  math_ch2_status TEXT DEFAULT 'Cleared',

  science_ch1_name TEXT DEFAULT 'Ch 1: Nutrition in Plants (Modes & Photosynthesis)',
  science_ch1_marks TEXT DEFAULT '9.00 / 10.00',
  science_ch1_status TEXT DEFAULT 'Cleared',
  science_ch2_name TEXT DEFAULT 'Ch 2: Nutrition in Animals (Digestive Organs)',
  science_ch2_marks TEXT DEFAULT '7.50 / 10.00',
  science_ch2_status TEXT DEFAULT 'Revision',

  sst_ch1_name TEXT DEFAULT 'Ch 1: Tracing Changes Through a Thousand Years',
  sst_ch1_marks TEXT DEFAULT '8.50 / 10.00',
  sst_ch1_status TEXT DEFAULT 'Cleared',
  sst_ch2_name TEXT DEFAULT 'Ch 2: Our Environment & Earth Interior Layers',
  sst_ch2_marks TEXT DEFAULT '8.00 / 10.00',
  sst_ch2_status TEXT DEFAULT 'Cleared',

  lang_eng_name TEXT DEFAULT 'English (Ch 1-2): Three Questions & The Squirrel',
  lang_eng_marks TEXT DEFAULT '9.00 / 10.00',
  lang_eng_status TEXT DEFAULT 'Cleared',
  lang_hindi_name TEXT DEFAULT 'Hindi (Ch 1-2): हम पंछी उन्मुक्त गगन के & दादी माँ',
  lang_hindi_marks TEXT DEFAULT '8.50 / 10.00',
  lang_hindi_status TEXT DEFAULT 'Cleared',

  -- Section 3: Communication & English Usage
  manners_max NUMERIC DEFAULT 10.00,
  manners_score NUMERIC DEFAULT 9.50,
  manners_obs TEXT DEFAULT 'Polite, attentive; follows homework schedules obediently.',
  confidence_max NUMERIC DEFAULT 10.00,
  confidence_score NUMERIC DEFAULT 8.50,
  confidence_obs TEXT DEFAULT 'Answers without shyness; asks doubts with clarity.',
  english_usage_max NUMERIC DEFAULT 10.00,
  english_usage_score NUMERIC DEFAULT 8.00,
  english_usage_obs TEXT DEFAULT '~65% English words used actively during tuition hours.',

  -- Section 4: Super-Intelligence Pillars
  mental_math_score TEXT DEFAULT '9.0 / 10.00',
  mental_math_obs TEXT DEFAULT 'Fast oral tables up to 19; prompt mental addition without rough notebook dependence.',
  logical_aptitude_score TEXT DEFAULT '8.5 / 10.00',
  logical_aptitude_obs TEXT DEFAULT 'Solved 4/5 pattern-finding and critical reasoning puzzles during weekly aptitude rounds.',
  homework_score TEXT DEFAULT '9.5 / 10.00',
  homework_obs TEXT DEFAULT '96% daily homework completion rate on time without needing repeated follow-ups.',
  neatness_score TEXT DEFAULT '8.0 / 10.00',
  neatness_obs TEXT DEFAULT 'Clean margin maintenance; neat step-by-step working. Science diagram labeling can improve.',

  -- Summary & Quality Audit
  overall_percentage NUMERIC DEFAULT 86.5,
  grade TEXT DEFAULT 'Grade A+ Outstanding',
  next_month_target TEXT DEFAULT 'Chapters 3 & 4 of all subjects',
  focus_recommendation TEXT DEFAULT 'Daily 15m English book reading at home',
  coordinator_name TEXT DEFAULT 'Horizon Academic Quality Cell',
  status TEXT DEFAULT 'VERIFIED', -- DRAFT, SUBMITTED, VERIFIED, LOCKED
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.test_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_duties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_report_cards ENABLE ROW LEVEL SECURITY;

-- Allow Public / Authenticated Read
DROP POLICY IF EXISTS "Public can view test centers" ON public.test_centers;
CREATE POLICY "Public can view test centers" ON public.test_centers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view evaluation duties" ON public.evaluation_duties;
CREATE POLICY "Public can view evaluation duties" ON public.evaluation_duties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view report cards" ON public.monthly_report_cards;
CREATE POLICY "Public can view report cards" ON public.monthly_report_cards FOR SELECT USING (true);

DROP POLICY IF EXISTS "Evaluators can insert report cards" ON public.monthly_report_cards;
CREATE POLICY "Evaluators can insert report cards" ON public.monthly_report_cards FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Evaluators can update duties" ON public.evaluation_duties;
CREATE POLICY "Evaluators can update duties" ON public.evaluation_duties FOR ALL USING (true) WITH CHECK (true);

-- Insert Sample Test Centers
INSERT INTO public.test_centers (center_name, center_code, location_address, coordinator_name, contact_number, capacity)
VALUES
  ('Horizon Central Assessment Hub #1', 'CEN-PUR-01', 'Line Bazar Road, Near Govt Medical College, Purnia', 'Academic Director Piyush', '+91 9162162128', 60),
  ('Horizon North Regional Assessment Hub #2', 'CEN-PUR-02', 'Navratan Hata, Main Road, Purnia', 'Coordinator Harshit Patel', '+91 9876543210', 45)
ON CONFLICT (center_code) DO NOTHING;

-- Insert Sample Active Duty for Cross-Examiner
INSERT INTO public.evaluation_duties (duty_code, evaluation_date, center_id, center_name, center_address, evaluator_tutor_id, evaluator_tutor_name, evaluator_tutor_phone, evaluator_college, student_ids, student_names, status, notes)
VALUES
  (
    'DUTY-202609-01',
    CURRENT_DATE,
    (SELECT id FROM public.test_centers WHERE center_code = 'CEN-PUR-01' LIMIT 1),
    'Horizon Central Assessment Hub #1',
    'Line Bazar Road, Near Govt Medical College, Purnia',
    'tutor_harshit_01',
    'Vikash Kumar (Certified Cross-Examiner)',
    '+91 9162162128',
    'PCE Purnia',
    '["std-aaryan-01", "std-rohit-02", "std-priya-03"]'::jsonb,
    '["Aaryan Sharma", "Rohit Kumar", "Priya Singh"]'::jsonb,
    'ACTIVE_TODAY',
    'Independent cross-evaluation session. Regular tutor is prohibited from grading their own assigned batch.'
  )
ON CONFLICT (duty_code) DO NOTHING;

-- Insert Sample Master Report Card matching User Template
INSERT INTO public.monthly_report_cards (
  report_code,
  student_id,
  student_name,
  parent_name,
  class_grade,
  assessment_month,
  assigned_tutor_name,
  assigned_tutor_contact,
  evaluator_tutor_name,
  test_center_name,
  hindi_passage_length_time,
  hindi_speed_wpm,
  hindi_comprehension_qs,
  hindi_fluency,
  english_passage_length_time,
  english_speed_wpm,
  english_comprehension_qs,
  english_fluency,
  math_ch1_name,
  math_ch1_marks,
  math_ch1_status,
  math_ch2_name,
  math_ch2_marks,
  math_ch2_status,
  science_ch1_name,
  science_ch1_marks,
  science_ch1_status,
  science_ch2_name,
  science_ch2_marks,
  science_ch2_status,
  sst_ch1_name,
  sst_ch1_marks,
  sst_ch1_status,
  sst_ch2_name,
  sst_ch2_marks,
  sst_ch2_status,
  lang_eng_name,
  lang_eng_marks,
  lang_eng_status,
  lang_hindi_name,
  lang_hindi_marks,
  lang_hindi_status,
  manners_max,
  manners_score,
  manners_obs,
  confidence_max,
  confidence_score,
  confidence_obs,
  english_usage_max,
  english_usage_score,
  english_usage_obs,
  mental_math_score,
  mental_math_obs,
  logical_aptitude_score,
  logical_aptitude_obs,
  homework_score,
  homework_obs,
  neatness_score,
  neatness_obs,
  overall_percentage,
  grade,
  next_month_target,
  focus_recommendation,
  status
)
VALUES (
  'REP-202609-001',
  'std-aaryan-01',
  'Aaryan Sharma',
  'Suresh Sharma',
  'Class 7th • CBSE/ICSE',
  'September, 2026',
  'Harshit Patel',
  '+91 9162162128',
  'Vikash Kumar (Cross-Examiner)',
  'Horizon Central Assessment Hub #1',
  '160 Words • 1m 25s',
  '113 WPM (Good)',
  '4.0 / 5.0 Correct (1 Error)',
  '8.50 / 10.00',
  '175 Words • 1m 35s',
  '110 WPM (Optimal)',
  '5.0 / 5.0 Correct (0 Error)',
  '9.00 / 10.00',
  'Ch 1: Integers, Number Line & Rules',
  '9.50 / 10.00',
  'Cleared',
  'Ch 2: Fractions, Decimals & Problem Sums',
  '8.50 / 10.00',
  'Cleared',
  'Ch 1: Nutrition in Plants (Modes & Photosynthesis)',
  '9.00 / 10.00',
  'Cleared',
  'Ch 2: Nutrition in Animals (Digestive Organs)',
  '7.50 / 10.00',
  'Revision',
  'Ch 1: Tracing Changes Through a Thousand Years',
  '8.50 / 10.00',
  'Cleared',
  'Ch 2: Our Environment & Earth Interior Layers',
  '8.00 / 10.00',
  'Cleared',
  'English (Ch 1-2): Three Questions & The Squirrel',
  '9.00 / 10.00',
  'Cleared',
  'Hindi (Ch 1-2): हम पंछी उन्मुक्त गगन के & दादी माँ',
  '8.50 / 10.00',
  'Cleared',
  10.00,
  9.50,
  'Polite, attentive; follows homework schedules obediently.',
  10.00,
  8.50,
  'Answers without shyness; asks doubts with clarity.',
  10.00,
  8.00,
  '~65% English words used actively during tuition hours.',
  '9.0 / 10.00',
  'Fast oral tables up to 19; prompt mental addition without rough notebook dependence.',
  '8.5 / 10.00',
  'Solved 4/5 pattern-finding and critical reasoning puzzles during weekly aptitude rounds.',
  '9.5 / 10.00',
  '96% daily homework completion rate on time without needing repeated follow-ups.',
  '8.0 / 10.00',
  'Clean margin maintenance; neat step-by-step working. Science diagram labeling can improve.',
  86.5,
  'Grade A+ Outstanding',
  'Chapters 3 & 4 of all subjects',
  'Daily 15m English book reading at home',
  'VERIFIED'
)
ON CONFLICT (report_code) DO NOTHING;
