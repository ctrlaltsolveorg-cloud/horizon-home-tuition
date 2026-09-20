import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rrxnkmfyqcgyzmpfsxeq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_4fZK3cld5_KQZqJfdThP_A_OMCoNEIc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Database Types for reference
export interface Profile {
  id: string;
  role: 'student_parent' | 'teacher' | 'admin';
  full_name: string;
  email: string;
  phone?: string;
  created_at?: string;
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
  subjects?: string[];
  classes_handled?: string;
  hourly_rate?: number;
  rating?: number;
  phone?: string;
  email?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface StudentEnquiry {
  id: string;
  student_id?: string;
  parent_name: string;
  student_name: string;
  phone: string;
  email?: string;
  class_subject: string;
  enquiry_date: string;
  test_schedule_date?: string;
  fee_status: 'PAID' | 'pending' | 'OVERDUE';
  fee_paid_date?: string;
  fee_amount?: number;
  assigned_teacher_id?: string;
  assigned_teacher?: TutorProfile;
  status: string;
  created_at?: string;
}

export interface MonthlyReport {
  id: string;
  student_id: string;
  tutor_id?: string;
  report_month: string;
  report_year: number;
  attendance_count: number;
  total_classes: number;
  subject_progress?: Record<string, number>;
  test_scores?: Record<string, string | number>;
  teacher_feedback?: string;
  parent_feedback?: string;
  overall_rating?: string;
  report_date?: string;
  created_at?: string;
}
