'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  supabase,
  StudentAssignment,
  MonthlyReportCard,
  EvaluationDuty
} from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReportCardEditorModal from '@/components/ReportCardEditorModal';
import Link from 'next/link';
import {
  User,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  Star,
  Edit3,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Users,
  Plus,
  Sparkles,
  AlertCircle,
  X,
  Building2,
  Printer,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function TutorDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active_students' | 'past_students' | 'exam_duties' | 'audit_reports'>('active_students');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [selectedStudentForEval, setSelectedStudentForEval] = useState<{ id: string; name: string; class_grade?: string } | null>(null);
  const [selectedDutyForEval, setSelectedDutyForEval] = useState<EvaluationDuty | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Cross-Evaluation & Audit Report States
  const [evaluationDuties, setEvaluationDuties] = useState<EvaluationDuty[]>([]);
  const [monthlyReportCards, setMonthlyReportCards] = useState<MonthlyReportCard[]>([]);

  // Tutor Profile State
  const [tutorProfile, setTutorProfile] = useState<any>({
    full_name: 'PIYUSH KUMAR PATEL',
    college: 'PCE PURNIA',
    degree_status: 'B.Tech/BS: 3rd sem with 7.2 CGPA',
    experience_years: '3+ years teaching experience',
    medium_preference: 'Hindi medium only',
    subjects: 'Mathematics, Science, Foundation Physics',
    bio_and_custom_notes: 'Dedicated educator specialized in CBSE and Bihar State Board Hindi-medium learners with personalized doubt clearing.',
    phone: '+91 9162162128',
    email: 'piyushkumarsihari@gmail.com',
    rating: 5.0
  });

  // Edit Form State
  const [editForm, setEditForm] = useState<any>({
    full_name: 'PIYUSH KUMAR PATEL',
    college: 'PCE PURNIA',
    degree_status: 'B.Tech/BS: 3rd sem with 7.2 CGPA',
    experience_years: '3+ years teaching experience',
    medium_preference: 'Hindi medium only',
    subjects: 'Mathematics, Science, Foundation Physics',
    phone: '+91 9162162128',
    email: 'piyushkumarsihari@gmail.com',
    bio_and_custom_notes: 'Dedicated educator specialized in CBSE and Bihar State Board Hindi-medium learners with personalized doubt clearing.'
  });

  // Students Lists
  const [activeStudents, setActiveStudents] = useState<StudentAssignment[]>([
    {
      id: 'stud-1',
      student_name: 'Aarav Sharma',
      parent_name: 'Rajesh Sharma',
      phone: '+91 98765 43210',
      class_grade: 'Class 10',
      board: 'CBSE',
      medium: 'Hindi / Bilingual',
      subjects: 'Mathematics & Science',
      status: 'active',
      start_date: '2026-06-01',
      schedule_days: 'Mon, Wed, Fri (5:00 PM - 6:30 PM)',
      monthly_fee: 4500,
      attendance_percent: 96,
      academic_score: '88%',
      location: 'Bhattai Bazar, Purnia'
    },
    {
      id: 'stud-2',
      student_name: 'Rohan Verma',
      parent_name: 'Sanjay Verma',
      phone: '+91 98111 22334',
      class_grade: 'Class 9',
      board: 'CBSE',
      medium: 'Hindi medium only',
      subjects: 'Mathematics & Foundation Physics',
      status: 'active',
      start_date: '2026-07-15',
      schedule_days: 'Tue, Thu, Sat (4:00 PM - 5:30 PM)',
      monthly_fee: 4000,
      attendance_percent: 92,
      academic_score: '84%',
      location: 'Navratan Hatta, Purnia'
    }
  ]);

  const [pastStudents, setPastStudents] = useState<StudentAssignment[]>([
    {
      id: 'stud-past-1',
      student_name: 'Ananya Singh',
      parent_name: 'Mahesh Singh',
      phone: '+91 94312 34567',
      class_grade: 'Class 10 (Board Completed)',
      board: 'CBSE',
      medium: 'Bilingual',
      subjects: 'Full Science & Mathematics',
      status: 'completed',
      start_date: '2025-04-01',
      end_date: '2026-03-31',
      schedule_days: '6 Days / Week (Special Batch)',
      monthly_fee: 5500,
      attendance_percent: 98,
      academic_score: '94.6% in 10th Boards',
      location: 'Line Bazar, Purnia'
    },
    {
      id: 'stud-past-2',
      student_name: 'Vikas Jha',
      parent_name: 'Anil Jha',
      phone: '+91 91234 56789',
      class_grade: 'Class 8 (Promoted to 9th)',
      board: 'Bihar State Board',
      medium: 'Hindi medium only',
      subjects: 'All Core Subjects',
      status: 'completed',
      start_date: '2025-08-01',
      end_date: '2026-03-15',
      schedule_days: 'Mon to Fri (6:00 PM - 7:30 PM)',
      monthly_fee: 3500,
      attendance_percent: 95,
      academic_score: '89% Annual Exam',
      location: 'Madhubani, Purnia'
    }
  ]);

  // Form states for add student modal
  const [newStudentForm, setNewStudentForm] = useState({
    student_name: '',
    parent_name: '',
    phone: '',
    class_grade: 'Class 10',
    board: 'CBSE',
    medium: 'Hindi / Bilingual',
    subjects: 'Mathematics & Science',
    schedule_days: 'Mon, Wed, Fri (5:00 PM - 6:30 PM)',
    monthly_fee: 4500,
    location: 'Purnia'
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load live data from Supabase
  const loadAllData = async () => {
    try {
      setLoading(true);

      // 1. Tutor Profile
      if (user) {
        const { data: tpData } = await supabase
          .from('tutor_profiles')
          .select('*')
          .or(`user_id.eq.${user.id},email.eq.${user.email}`)
          .maybeSingle();

        if (tpData) {
          const merged = {
            ...tpData,
            full_name: tpData.full_name || user.name || 'PIYUSH KUMAR PATEL',
            college: tpData.college || 'PCE PURNIA',
            degree_status: tpData.degree_status || 'B.Tech/BS: 3rd sem with 7.2 CGPA',
            experience_years: tpData.experience_years || '3+ years teaching experience',
            medium_preference: tpData.medium_preference || 'Hindi medium only',
            subjects: tpData.subjects || 'Mathematics, Science, Foundation Physics',
            phone: tpData.phone || user.phone || '+91 9162162128',
            email: tpData.email || user.email || 'piyushkumarsihari@gmail.com',
            rating: tpData.rating || 5.0
          };
          setTutorProfile(merged);
          setEditForm(merged);
        }
      }

      // 2. Active & Past Students
      const { data: studentsData } = await supabase
        .from('student_assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (studentsData && studentsData.length > 0) {
        setActiveStudents(studentsData.filter((s: StudentAssignment) => s.status === 'active'));
        setPastStudents(studentsData.filter((s: StudentAssignment) => s.status === 'completed'));
      }

      // 3. Cross-Evaluation Duties
      const { data: dutiesData } = await supabase
        .from('evaluation_duties')
        .select('*')
        .order('created_at', { ascending: false });

      if (dutiesData && dutiesData.length > 0) {
        setEvaluationDuties(dutiesData);
      } else {
        setEvaluationDuties([
          {
            id: 'duty-live-01',
            duty_code: 'DUTY-PUR-0924',
            evaluation_date: new Date().toISOString().split('T')[0],
            center_id: 'cen-01',
            center_name: 'Purnia Central Examination Hub (Center #1)',
            center_address: 'Line Bazar Near Max Hospital, Purnia, Bihar',
            evaluator_tutor_id: user?.id || 'tutor-01',
            evaluator_tutor_name: tutorProfile.full_name || 'Vikash Kumar (Cross-Examiner)',
            evaluator_college: 'PCE Purnia',
            evaluator_tutor_phone: '+91 9162162128',
            student_ids: ['std-aaryan-01', 'std-rohit-02'],
            student_names: ['Aaryan Sharma', 'Rohit Kumar'],
            status: 'ACTIVE_TODAY',
            notes: 'Independent evaluation duty for September 2026. Regular teaching tutor is prohibited from evaluating.'
          }
        ]);
      }

      // 4. Official Monthly Report Cards
      const { data: reportCardsData } = await supabase
        .from('monthly_report_cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportCardsData && reportCardsData.length > 0) {
        setMonthlyReportCards(reportCardsData);
      } else {
        setMonthlyReportCards([
          {
            id: 'rep-sample-001',
            report_code: 'REP-202609-001',
            student_id: 'std-aaryan-01',
            student_name: 'Aaryan Sharma',
            parent_name: 'Suresh Sharma',
            class_grade: 'Class 7th • CBSE/ICSE',
            assessment_month: 'September, 2026',
            assigned_tutor_name: 'Harshit Patel',
            assigned_tutor_contact: '+91 9162162128',
            evaluator_tutor_name: 'Vikash Kumar (Certified Cross-Examiner)',
            test_center_name: 'Purnia Central Examination Hub',
            hindi_passage_length_time: '160 Words • 1m 25s',
            hindi_speed_wpm: '113 WPM (Good)',
            hindi_comprehension_qs: '4.0 / 5.0 Correct (1 Error)',
            hindi_fluency: '8.50 / 10.00',
            english_passage_length_time: '175 Words • 1m 35s',
            english_speed_wpm: '110 WPM (Optimal)',
            english_comprehension_qs: '5.0 / 5.0 Correct (0 Error)',
            english_fluency: '9.00 / 10.00',
            math_ch1_name: 'Ch 1: Integers, Number Line & Rules',
            math_ch1_marks: '9.50 / 10.00',
            math_ch1_status: 'Cleared',
            math_ch2_name: 'Ch 2: Fractions, Decimals & Problem Sums',
            math_ch2_marks: '8.50 / 10.00',
            math_ch2_status: 'Cleared',
            science_ch1_name: 'Ch 1: Nutrition in Plants (Modes & Photosynthesis)',
            science_ch1_marks: '9.00 / 10.00',
            science_ch1_status: 'Cleared',
            science_ch2_name: 'Ch 2: Nutrition in Animals (Digestive Organs)',
            science_ch2_marks: '7.50 / 10.00',
            science_ch2_status: 'Revision',
            sst_ch1_name: 'Ch 1: Tracing Changes Through a Thousand Years',
            sst_ch1_marks: '8.50 / 10.00',
            sst_ch1_status: 'Cleared',
            sst_ch2_name: 'Ch 2: Our Environment & Earth Interior Layers',
            sst_ch2_marks: '8.00 / 10.00',
            sst_ch2_status: 'Cleared',
            lang_eng_name: 'English (Ch 1-2): Three Questions & The Squirrel',
            lang_eng_marks: '9.00 / 10.00',
            lang_eng_status: 'Cleared',
            lang_hindi_name: 'Hindi (Ch 1-2): हम पंछी उन्मुक्त गगन के & दादी माँ',
            lang_hindi_marks: '8.50 / 10.00',
            lang_hindi_status: 'Cleared',
            manners_max: 10,
            manners_score: 9.50,
            manners_obs: 'Polite, attentive; follows homework schedules obediently.',
            confidence_max: 10,
            confidence_score: 8.50,
            confidence_obs: 'Answers without shyness; asks doubts with clarity.',
            english_usage_max: 10,
            english_usage_score: 8.00,
            english_usage_obs: '~65% English words used actively during tuition hours.',
            mental_math_score: '9.0 / 10.00',
            mental_math_obs: 'Fast oral tables up to 19; prompt mental addition without rough notebook dependence.',
            logical_aptitude_score: '8.5 / 10.00',
            logical_aptitude_obs: 'Solved 4/5 pattern-finding and critical reasoning puzzles during weekly aptitude rounds.',
            homework_score: '9.5 / 10.00',
            homework_obs: '96% daily homework completion rate on time without needing repeated follow-ups.',
            neatness_score: '8.0 / 10.00',
            neatness_obs: 'Clean margin maintenance; neat step-by-step working. Science diagram labeling can improve.',
            overall_percentage: 86.5,
            grade: 'Grade A+ Outstanding',
            next_month_target: 'Chapters 3 & 4 of all subjects',
            focus_recommendation: 'Daily 15m English book reading at home',
            status: 'VERIFIED'
          }
        ]);
      }

    } catch (err: any) {
      console.warn('Live Supabase data loaded with local fallbacks:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [user]);

  // Handle Save from ReportCardEditorModal
  const handleSaveReportCard = async (reportData: Partial<MonthlyReportCard>): Promise<boolean> => {
    try {
      const code = `REP-${Date.now().toString().slice(-6)}`;
      const payload: any = {
        ...reportData,
        report_code: code,
        evaluator_tutor_id: user?.id || 'tutor-eval',
        status: 'VERIFIED'
      };

      const { data, error } = await supabase
        .from('monthly_report_cards')
        .insert([payload])
        .select()
        .single();

      const savedRecord = data || { ...payload, id: `rep-${Date.now()}` };
      setMonthlyReportCards((prev) => [savedRecord, ...prev]);
      localStorage.setItem(`horizon_report_${savedRecord.id}`, JSON.stringify(savedRecord));
      setSuccessMsg(`Official Report Card for ${savedRecord.student_name} generated and locked successfully!`);
      return true;
    } catch (e: any) {
      console.error('Error saving report card:', e);
      return false;
    }
  };

  // Handle Save Profile Modal
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const updatePayload = {
        full_name: editForm.full_name,
        college: editForm.college,
        degree_status: editForm.degree_status,
        experience_years: editForm.experience_years,
        medium_preference: editForm.medium_preference,
        subjects: editForm.subjects,
        phone: editForm.phone,
        email: editForm.email,
        bio_and_custom_notes: editForm.bio_and_custom_notes,
        rating: tutorProfile.rating || 5.0,
        updated_at: new Date().toISOString()
      };

      if (user) {
        await supabase
          .from('tutor_profiles')
          .upsert({ user_id: user.id, ...updatePayload });
      }

      setTutorProfile((prev: any) => ({ ...prev, ...updatePayload }));
      setSuccessMsg('Tutor profile updated successfully!');
      setShowEditModal(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Add Student
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = {
        student_name: newStudentForm.student_name,
        parent_name: newStudentForm.parent_name,
        phone: newStudentForm.phone,
        class_grade: newStudentForm.class_grade,
        board: newStudentForm.board,
        medium: newStudentForm.medium,
        subjects: newStudentForm.subjects,
        status: 'active',
        start_date: new Date().toISOString().split('T')[0],
        schedule_days: newStudentForm.schedule_days,
        monthly_fee: Number(newStudentForm.monthly_fee) || 4500,
        attendance_percent: 100,
        academic_score: 'New Admission',
        location: newStudentForm.location
      };

      if (user) payload.tutor_id = user.id;

      const { data } = await supabase
        .from('student_assignments')
        .insert([payload])
        .select()
        .single();

      const newRecord = data || { ...payload, id: `stud-${Date.now()}` };
      setActiveStudents((prev) => [newRecord, ...prev]);
      setSuccessMsg(`Student ${payload.student_name} enrolled successfully!`);
      setShowAddStudentModal(false);
      setNewStudentForm({
        student_name: '',
        parent_name: '',
        phone: '',
        class_grade: 'Class 10',
        board: 'CBSE',
        medium: 'Hindi / Bilingual',
        subjects: 'Mathematics & Science',
        schedule_days: 'Mon, Wed, Fri (5:00 PM - 6:30 PM)',
        monthly_fee: 4500,
        location: 'Purnia'
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add student');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', color: '#F8FAFC' }}>
      <Navbar />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.25rem 5rem 1.25rem' }}>
        
        {/* Alerts */}
        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#6EE7B7', padding: '0.85rem 1.25rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <CheckCircle2 size={18} /> {successMsg}
            </div>
            <button onClick={() => setSuccessMsg('')} style={{ background: 'none', border: 'none', color: '#6EE7B7', cursor: 'pointer' }}><X size={18} /></button>
          </div>
        )}

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '0.85rem 1.25rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <AlertCircle size={18} /> {errorMsg}
            </div>
            <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', color: '#FCA5A5', cursor: 'pointer' }}><X size={18} /></button>
          </div>
        )}

        {/* 1. TUTOR PROFILE HEADER CARD */}
        <div className="tutor-header-box" style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
              boxShadow: '0 4px 15px rgba(245,158,11,0.3)',
              flexShrink: 0
            }}>
              {tutorProfile.full_name?.charAt(0) || 'P'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.55rem)', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {tutorProfile.full_name}
                </h1>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <ShieldCheck size={12} /> Verified Tutor
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.25rem', color: '#94A3B8', fontSize: '0.80rem', flexWrap: 'wrap' }}>
                <span style={{ color: '#38BDF8', fontWeight: 700 }}>🏛️ {tutorProfile.college}</span>
                <span>•</span>
                <span>🎓 {tutorProfile.degree_status}</span>
                <span>•</span>
                <span style={{ color: '#F59E0B', fontWeight: 700 }}>⭐ {tutorProfile.rating || 5.0}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Link
              href="/profile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#1E293B',
                color: '#E2E8F0',
                border: '1px solid #475569',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.80rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <User size={13} color="#F59E0B" /> My Profile
            </Link>
            <button
              onClick={() => setShowAddStudentModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.5rem 0.95rem',
                borderRadius: '8px',
                fontSize: '0.80rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(5,150,105,0.35)'
              }}
            >
              <Plus size={14} /> Enroll Student
            </button>
          </div>
        </div>

        {/* 2. TOP METRICS STRIP (4 Clean KPI Cards) */}
        <div className="tutor-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
          
          <div 
            onClick={() => setActiveTab('active_students')}
            style={{
              background: activeTab === 'active_students' ? 'rgba(5, 150, 105, 0.15)' : '#1E293B',
              border: `1px solid ${activeTab === 'active_students' ? '#10B981' : '#334155'}`,
              borderRadius: '12px',
              padding: '1rem 1.15rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>Active Students</span>
              <Users size={16} color="#34D399" />
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#34D399' }}>
              {activeStudents.length} <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8' }}>Live</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('past_students')}
            style={{
              background: activeTab === 'past_students' ? 'rgba(59, 130, 246, 0.15)' : '#1E293B',
              border: `1px solid ${activeTab === 'past_students' ? '#3B82F6' : '#334155'}`,
              borderRadius: '12px',
              padding: '1rem 1.15rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>Past Students</span>
              <GraduationCap size={16} color="#60A5FA" />
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#60A5FA' }}>
              {pastStudents.length} <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8' }}>Graduated</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('exam_duties')}
            style={{
              background: activeTab === 'exam_duties' ? 'rgba(245, 158, 11, 0.15)' : '#1E293B',
              border: `1px solid ${activeTab === 'exam_duties' ? '#F59E0B' : '#334155'}`,
              borderRadius: '12px',
              padding: '1rem 1.15rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 800 }}>Cross-Exam Duties</span>
              <ShieldAlert size={16} color="#F59E0B" />
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F59E0B' }}>
              {evaluationDuties.length} <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#EF4444', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>TODAY</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('audit_reports')}
            style={{
              background: activeTab === 'audit_reports' ? 'rgba(2, 132, 199, 0.15)' : '#1E293B',
              border: `1px solid ${activeTab === 'audit_reports' ? '#0284C7' : '#334155'}`,
              borderRadius: '12px',
              padding: '1rem 1.15rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: 800 }}>Reports (PDF)</span>
              <Award size={16} color="#38BDF8" />
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#38BDF8' }}>
              {monthlyReportCards.length} <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8' }}>Verified</span>
            </div>
          </div>

        </div>

        {/* 3. CLEAN NAVIGATION TABS */}
        <div className="tutor-tabs-bar" style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid #334155', paddingBottom: '0.65rem', marginBottom: '1.25rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          
          <button
            onClick={() => setActiveTab('active_students')}
            style={{
              background: activeTab === 'active_students' ? '#059669' : 'transparent',
              color: activeTab === 'active_students' ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              padding: '0.65rem 1.3rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Users size={16} /> Live Students ({activeStudents.length})
          </button>

          <button
            onClick={() => setActiveTab('past_students')}
            style={{
              background: activeTab === 'past_students' ? '#2563EB' : 'transparent',
              color: activeTab === 'past_students' ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              padding: '0.65rem 1.3rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <GraduationCap size={16} /> Past Students ({pastStudents.length})
          </button>

          <button
            onClick={() => setActiveTab('exam_duties')}
            style={{
              background: activeTab === 'exam_duties' ? 'linear-gradient(135deg, #D97706, #B45309)' : 'rgba(245, 158, 11, 0.1)',
              color: activeTab === 'exam_duties' ? '#FFFFFF' : '#F59E0B',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              padding: '0.65rem 1.3rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: activeTab === 'exam_duties' ? '0 4px 15px rgba(245, 158, 11, 0.3)' : 'none'
            }}
          >
            <ShieldAlert size={16} />
            <span>Cross-Exam Duties</span>
            <span style={{ background: '#EF4444', color: '#FFF', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '10px', fontWeight: 900 }}>
              ACTIVE TODAY
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit_reports')}
            style={{
              background: activeTab === 'audit_reports' ? 'linear-gradient(135deg, #0284C7, #0369A1)' : 'rgba(2, 132, 199, 0.1)',
              color: activeTab === 'audit_reports' ? '#FFFFFF' : '#38BDF8',
              border: '1px solid rgba(2, 132, 199, 0.4)',
              padding: '0.65rem 1.3rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: activeTab === 'audit_reports' ? '0 4px 15px rgba(2, 132, 199, 0.3)' : 'none'
            }}
          >
            <Award size={16} />
            <span>Official Progress Reports (PDF)</span>
            <span style={{ background: '#059669', color: '#FFF', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '10px', fontWeight: 900 }}>
              {monthlyReportCards.length}
            </span>
          </button>

        </div>

        {/* 4. TAB CONTENTS */}

        {/* TAB 1: ACTIVE LIVE STUDENTS */}
        {activeTab === 'active_students' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Active Students Currently Enrolled
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                  Students receiving weekly home-tuition from {tutorProfile.full_name}.
                </p>
              </div>

              <button
                onClick={() => setShowAddStudentModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(5,150,105,0.3)'
                }}
              >
                <Plus size={16} /> + Enroll Student
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
              {activeStudents.map((student) => (
                <div
                  key={student.id}
                  style={{
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '14px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.2rem 0' }}>
                        {student.student_name}
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: '#38BDF8', fontWeight: 700 }}>
                        {student.class_grade} ({student.board}) • {student.medium}
                      </div>
                    </div>
                    <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid rgba(52, 211, 153, 0.4)' }}>
                      ● Active
                    </span>
                  </div>

                  <div style={{ background: '#0F172A', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>
                      <span>Subjects: <strong style={{ color: '#F1F5F9' }}>{student.subjects}</strong></span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>
                      <span>Schedule: <strong style={{ color: '#FDE68A' }}>{student.schedule_days}</strong></span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94A3B8' }}>
                      <span>Parent: <strong style={{ color: '#E2E8F0' }}>{student.parent_name}</strong> ({student.phone})</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Attendance</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34D399' }}>{student.attendance_percent || 96}%</div>
                    </div>
                    <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Recent Score</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#60A5FA' }}>{student.academic_score || '88%'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link
                      href={`/profile?studentId=${student.id || 'stud-1'}`}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: '#334155',
                        color: '#F8FAFC',
                        border: '1px solid #475569',
                        padding: '0.55rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <User size={14} color="#38BDF8" />
                      <span>View Full Profile</span>
                    </Link>

                    <a
                      href={`tel:${student.phone || '+919876543210'}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34D399',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '0.55rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <Phone size={14} />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PAST / COMPLETED STUDENTS */}
        {activeTab === 'past_students' && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Past &amp; Graduated Students History
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                Verified records of learners who completed their board sessions with {tutorProfile.full_name}.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
              {pastStudents.map((student) => (
                <div
                  key={student.id}
                  style={{
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '14px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.2rem 0' }}>
                        {student.student_name}
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                        {student.class_grade} • {student.board}
                      </div>
                    </div>
                    <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
                      ✓ Completed
                    </span>
                  </div>

                  <div style={{ background: '#0F172A', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.3rem' }}>
                      Duration: <strong style={{ color: '#E2E8F0' }}>{student.start_date} to {student.end_date || '2026-03-31'}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.3rem' }}>
                      Subjects Handled: <strong style={{ color: '#93C5FD' }}>{student.subjects}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                      Final Result: <strong style={{ color: '#34D399', fontSize: '0.9rem' }}>{student.academic_score}</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={13} /> {student.location || 'Purnia'} • Verified Horizon Home Tuition Completion
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CROSS-EXAMINATION DUTIES & CENTER ALLOCATIONS */}
        {activeTab === 'exam_duties' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={20} color="#F59E0B" /> Cross-Examination Center Duties &amp; Independent Audits
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                  Special 1-day examination windows allocated by Horizon Admin. Regular teaching tutors are prohibited from evaluating their own batches.
                </p>
              </div>

              <div style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                fontSize: '0.82rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>● Strict Anti-Bias Rule Active</span>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {evaluationDuties.map((duty) => (
                <div
                  key={duty.id}
                  style={{
                    background: '#1E293B',
                    border: '2px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: '14px',
                    padding: '1.5rem',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#D97706',
                          color: '#000',
                          fontSize: '0.74rem',
                          fontWeight: 900,
                          letterSpacing: '0.04em'
                        }}>
                          {duty.duty_code}
                        </span>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#EF4444',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          border: '1px solid rgba(239, 68, 68, 0.4)'
                        }}>
                          ● 1-DAY ACTIVE WINDOW (TODAY)
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 2px' }}>
                        {duty.center_name}
                      </h4>
                      <div style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="#38BDF8" />
                        <span>{duty.center_address}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>Assigned Evaluator</div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#F59E0B' }}>
                        {duty.evaluator_tutor_name} ({duty.evaluator_college || 'PCE Purnia'})
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 700, marginTop: '2px' }}>
                        Date: {duty.evaluation_date}
                      </div>
                    </div>
                  </div>

                  {/* Student Allocation for Cross-Examination */}
                  <div style={{
                    background: '#0F172A',
                    borderRadius: '10px',
                    padding: '1rem',
                    border: '1px solid #334155',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
                      Allocated Students for Cross-Examination ({duty.student_names?.length || 0} Students)
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                      {(duty.student_names || ['Aaryan Sharma', 'Rohit Kumar']).map((stName: string, idx: number) => {
                        const sId = duty.student_ids?.[idx] || `std-${idx}`;
                        const existingRep = monthlyReportCards.find((r) => r.student_name === stName || r.student_id === sId);

                        return (
                          <div
                            key={idx}
                            style={{
                              padding: '10px 14px',
                              background: '#1E293B',
                              borderRadius: '8px',
                              border: '1px solid #334155',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF' }}>
                                {stName}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                                Class 7th • CBSE/ICSE • Regular Tutor: Harshit Patel
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '6px' }}>
                              <Link
                                href={`/report-card/fill?studentName=${encodeURIComponent(stName)}&classGrade=${encodeURIComponent('Class 7th • CBSE/ICSE')}&tutorName=${encodeURIComponent('Harshit Patel')}&dutyId=${encodeURIComponent(duty.id)}&centerName=${encodeURIComponent(duty.center_name)}`}
                                style={{
                                  padding: '6px 14px',
                                  borderRadius: '6px',
                                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                                  color: '#000000',
                                  fontWeight: 800,
                                  fontSize: '0.78rem',
                                  textDecoration: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)'
                                }}
                              >
                                <Sparkles size={13} />
                                <span>{existingRep ? 'Open & Edit PDF Sheet' : 'Live Fill PDF Report Card'}</span>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic' }}>
                    Note: "{duty.notes || 'Independent evaluation session. Regular tutor is prohibited from grading their own assigned batch.'}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: OFFICIAL SINGLE-PAGE PROGRESS AUDIT REPORTS */}
        {activeTab === 'audit_reports' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={20} color="#38BDF8" /> Official Monthly Progress Reports (Single-Page Comprehensive Audit)
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                  Official verified single-page reports matching the Horizon quality audit standard. Teaching tutors can view reports for guidance, but cannot edit cross-examiner marks.
                </p>
              </div>

              <Link
                href="/report-card/fill"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)'
                }}
              >
                <Sparkles size={16} />
                <span>➕ Live Fill Report Card (PDF Sheet)</span>
              </Link>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {monthlyReportCards.map((rep) => (
                <div
                  key={rep.id}
                  style={{
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '14px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', background: '#0284C7', color: '#FFF', fontSize: '0.74rem', fontWeight: 800 }}>
                          {rep.assessment_month || 'September, 2026'}
                        </span>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.74rem', fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                          ✓ Official Quality Verified
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 2px' }}>
                        {rep.student_name}
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                        {rep.class_grade} • Teaching Tutor: <strong style={{ color: '#F1F5F9' }}>{rep.assigned_tutor_name}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace' }}>
                        {rep.overall_percentage}%
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10B981' }}>
                        {rep.grade || 'Grade A+ Outstanding'}
                      </div>
                      <Link
                        href={`/report-card/${rep.id || 'sample'}`}
                        style={{
                          marginTop: '4px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                          color: '#000000',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 3px 12px rgba(245, 158, 11, 0.3)'
                        }}
                      >
                        <Printer size={15} />
                        <span>View &amp; Print Official PDF</span>
                      </Link>
                    </div>
                  </div>

                  {/* 4 Pillars Summary Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', background: '#0F172A', padding: '12px', borderRadius: '10px', border: '1px solid #334155' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>1. PASSAGE READING</div>
                      <div style={{ fontSize: '0.84rem', color: '#F8FAFC', fontWeight: 700 }}>
                        Hindi: {rep.hindi_speed_wpm} • Eng: {rep.english_speed_wpm}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>2. CHAPTER TESTS</div>
                      <div style={{ fontSize: '0.84rem', color: '#34D399', fontWeight: 700 }}>
                        Math ({rep.math_ch1_marks}) • Sci ({rep.science_ch1_marks})
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>3. COMMUNICATION</div>
                      <div style={{ fontSize: '0.84rem', color: '#A855F7', fontWeight: 700 }}>
                        Manners ({rep.manners_score}/10) • Eng ({rep.english_usage_score}/10)
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>4. EXAMINER / CENTER</div>
                      <div style={{ fontSize: '0.84rem', color: '#F59E0B', fontWeight: 700 }}>
                        {rep.evaluator_tutor_name} ({rep.test_center_name || 'Center #1'})
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* REPORT CARD EDITOR MODAL (For Assigned Cross-Examiner) */}
      {showEditorModal && selectedStudentForEval && (
        <ReportCardEditorModal
          isOpen={showEditorModal}
          onClose={() => {
            setShowEditorModal(false);
            setSelectedStudentForEval(null);
          }}
          duty={selectedDutyForEval || undefined}
          studentName={selectedStudentForEval.name}
          studentId={selectedStudentForEval.id}
          classGrade={selectedStudentForEval.class_grade || 'Class 7th • CBSE/ICSE'}
          assignedTutorName="Harshit Patel"
          assignedTutorContact="+91 9162162128"
          evaluatorName={tutorProfile.full_name || 'Vikash Kumar (Cross-Examiner)'}
          existingReport={monthlyReportCards.find((r) => r.student_id === selectedStudentForEval.id || r.student_name === selectedStudentForEval.name)}
          previousReport={monthlyReportCards[0] || null}
          onSave={handleSaveReportCard}
        />
      )}

      {/* MODAL: ENROLL NEW STUDENT */}
      {showAddStudentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', maxWidth: '540px', width: '100%', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Enroll New Student to Tutor Roster
              </h3>
              <button onClick={() => setShowAddStudentModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddStudent} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Student Name</label>
                  <input
                    type="text"
                    value={newStudentForm.student_name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, student_name: e.target.value })}
                    placeholder="e.g. Aaryan Sharma"
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Parent Name</label>
                  <input
                    type="text"
                    value={newStudentForm.parent_name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, parent_name: e.target.value })}
                    placeholder="e.g. Ramesh Sharma"
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Class / Grade</label>
                  <input
                    type="text"
                    value={newStudentForm.class_grade}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, class_grade: e.target.value })}
                    placeholder="e.g. Class 10"
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Board</label>
                  <select
                    value={newStudentForm.board}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, board: e.target.value })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="Bihar State Board">Bihar State Board</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Medium</label>
                  <input
                    type="text"
                    value={newStudentForm.medium}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, medium: e.target.value })}
                    placeholder="e.g. Hindi / Bilingual"
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Subjects</label>
                  <input
                    type="text"
                    value={newStudentForm.subjects}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, subjects: e.target.value })}
                    placeholder="e.g. Mathematics, Science"
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Phone</label>
                  <input
                    type="text"
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddStudentModal(false)} style={{ background: 'transparent', border: '1px solid #475569', color: '#CBD5E1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ background: 'linear-gradient(135deg, #059669, #047857)', border: 'none', color: '#FFFFFF', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                  {submitting ? 'Enrolling...' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        @media screen and (max-width: 640px) {
          .tutor-metrics-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 0.65rem !important;
          }

          .tutor-header-box {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
