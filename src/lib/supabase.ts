import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rrxnkmfyqcgyzmpfsxeq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_4fZK3cld5_KQZqJfdThP_A_OMCoNEIc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Database Types reflecting live Supabase schema
export interface Profile {
  id: string;
  role: 'student_parent' | 'teacher' | 'admin';
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TutorProfile {
  id: string;
  user_id?: string;
  full_name: string;
  degree_status: string;
  college: string;
  experience_years: string;
  medium_preference: string;
  languages?: string;
  bio_and_custom_notes?: string;
  subjects?: string[] | string;
  classes_handled?: string;
  rating?: number;
  phone?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudentEnquiry {
  id: string;
  student_id?: string;
  parent_name: string;
  student_name: string;
  phone: string;
  email?: string;
  class_level: string;
  board: string;
  school_medium: string;
  address?: string;
  enquiry_date: string;
  test_schedule_date?: string;
  test_scheduled_date?: string;
  test_status: string;
  test_score?: string;
  test_remarks?: string;
  assigned_teacher_id?: string;
  fee_status: 'PAID' | 'pending' | 'OVERDUE' | string;
  fee_amount?: number;
  fee_paid_date?: string;
  created_at?: string;
}

export interface StudentAssignment {
  id: string;
  tutor_id?: string;
  student_name: string;
  parent_name?: string;
  phone?: string;
  class_grade: string;
  board?: string;
  medium?: string;
  subjects: string;
  status: 'active' | 'completed' | 'paused' | 'trial';
  start_date?: string;
  end_date?: string;
  schedule_days?: string;
  monthly_fee?: number;
  attendance_percent?: number;
  academic_score?: string;
  location?: string;
  created_at?: string;
}

export interface StudentReadingTask {
  id: string;
  student_name: string;
  tutor_id?: string;
  month_year: string;
  task_title: string;
  subject: string;
  target_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
  milestone_details?: string;
  next_report_weight?: string;
  created_at?: string;
}

export interface StudentTest {
  id: string;
  student_name: string;
  tutor_id?: string;
  conducted_by_tutor_name: string;
  tutor_college_info?: string;
  subject: string;
  test_title: string;
  test_date: string;
  total_marks: number;
  marks_obtained: number;
  percentage?: number;
  tutor_remarks?: string;
  created_at?: string;
}

export interface MonthlyReport {
  id: string;
  tutor_id?: string;
  student_name: string;
  student_class?: string;
  month: string;
  attendance_percentage?: number;
  marks_percentage?: number;
  syllabus_covered?: string;
  tutor_remarks?: string;
  conducting_tutor_name?: string;
  status?: string;
  created_at?: string;
  [key: string]: any;
}

export interface TestCenter {
  id: string;
  center_name: string;
  center_code: string;
  location_address: string;
  area_city: string;
  coordinator_name: string;
  contact_number: string;
  capacity?: number;
  created_at?: string;
}

export interface EvaluationDuty {
  id: string;
  duty_code: string;
  evaluation_date: string; // e.g. '2026-09-28'
  center_id: string;
  center_name: string;
  center_address: string;
  evaluator_tutor_id: string;
  evaluator_tutor_name: string;
  evaluator_tutor_phone?: string;
  evaluator_college?: string;
  student_ids: string[];
  student_names: string[];
  status: 'SCHEDULED' | 'ACTIVE_TODAY' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  created_at?: string;
}

export interface AcademicChapterItem {
  subject: string;
  chapter_name: string;
  marks_obtained: number;
  max_marks: number;
  status: 'Cleared' | 'Revision' | 'Excellent';
}

export interface MonthlyReportCard {
  id: string;
  report_code?: string;
  student_id: string;
  student_name: string;
  parent_name?: string;
  class_grade: string;
  board?: string;
  assessment_month: string; // e.g. 'September, 2026'
  
  // Teaching vs Evaluator Tutors
  regular_tutor_id?: string;
  assigned_tutor_name: string;
  assigned_tutor_contact: string;
  evaluator_tutor_id?: string;
  evaluator_tutor_name: string;
  evaluator_tutor_contact?: string;
  test_center_id?: string;
  test_center_name?: string;
  duty_id?: string;

  // Section 1: Passage Reading & Comprehension
  hindi_passage_length_time: string; // e.g. '160 Words • 1m 25s'
  hindi_speed_wpm: string;           // e.g. '113 WPM (Good)'
  hindi_comprehension_qs: string;    // e.g. '4.0 / 5.0 Correct (1 Error)'
  hindi_fluency: string;             // e.g. '8.50 / 10.00'
  
  english_passage_length_time: string;// e.g. '175 Words • 1m 35s'
  english_speed_wpm: string;          // e.g. '110 WPM (Optimal)'
  english_comprehension_qs: string;   // e.g. '5.0 / 5.0 Correct (0 Error)'
  english_fluency: string;            // e.g. '9.00 / 10.00'

  // Section 2: Academic Chapter Assessments
  math_ch1_name: string;
  math_ch1_marks: string;
  math_ch1_status: 'Cleared' | 'Revision' | 'Excellent';
  math_ch2_name: string;
  math_ch2_marks: string;
  math_ch2_status: 'Cleared' | 'Revision' | 'Excellent';

  science_ch1_name: string;
  science_ch1_marks: string;
  science_ch1_status: 'Cleared' | 'Revision' | 'Excellent';
  science_ch2_name: string;
  science_ch2_marks: string;
  science_ch2_status: 'Cleared' | 'Revision' | 'Excellent';

  sst_ch1_name: string;
  sst_ch1_marks: string;
  sst_ch1_status: 'Cleared' | 'Revision' | 'Excellent';
  sst_ch2_name: string;
  sst_ch2_marks: string;
  sst_ch2_status: 'Cleared' | 'Revision' | 'Excellent';

  lang_eng_name: string;
  lang_eng_marks: string;
  lang_eng_status: 'Cleared' | 'Revision' | 'Excellent';
  lang_hindi_name: string;
  lang_hindi_marks: string;
  lang_hindi_status: 'Cleared' | 'Revision' | 'Excellent';

  // Section 3: Communication Skills & Conversational English Habits
  manners_max: number;
  manners_score: number;
  manners_obs: string;

  confidence_max: number;
  confidence_score: number;
  confidence_obs: string;

  english_usage_max: number;
  english_usage_score: number;
  english_usage_obs: string;

  // Section 4: Super-Intelligence & High-Performance Pillars
  mental_math_score: string; // e.g. '9.0 / 10.00'
  mental_math_obs: string;
  logical_aptitude_score: string; // e.g. '8.5 / 10.00'
  logical_aptitude_obs: string;
  homework_score: string; // e.g. '9.5 / 10.00'
  homework_obs: string;
  neatness_score: string; // e.g. '8.0 / 10.00'
  neatness_obs: string;

  // Summary & Feedback Footer
  overall_percentage: number; // e.g. 86.5
  grade: string;              // e.g. 'Grade A+ Outstanding'
  next_month_target: string;  // e.g. 'Chapters 3 & 4 of all subjects'
  focus_recommendation: string;// e.g. 'Daily 15m English book reading at home'
  
  coordinator_name?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'LOCKED';
  created_at?: string;
  updated_at?: string;
}

