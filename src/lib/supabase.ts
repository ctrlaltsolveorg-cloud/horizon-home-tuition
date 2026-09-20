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

export interface MonthlyReport {
  id: string;
  student_id: string;
  report_month: string;
  areas_of_improvement?: string;
  created_at?: string;
  [key: string]: any;
}
