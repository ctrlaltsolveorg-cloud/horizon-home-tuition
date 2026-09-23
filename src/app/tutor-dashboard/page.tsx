'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  supabase,
  StudentAssignment,
  StudentReadingTask,
  StudentTest,
  MonthlyReport,
  MonthlyReportCard,
  EvaluationDuty,
  TestCenter
} from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReportCardEditorModal from '@/components/ReportCardEditorModal';
import Link from 'next/link';
import {
  User,
  GraduationCap,
  BookOpen,
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
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  TrendingUp,
  FileText,
  CheckSquare,
  ClipboardList,
  ChevronRight,
  Sparkles,
  AlertCircle,
  X,
  Languages,
  BookMarked,
  Building2,
  Printer,
  Eye,
  ShieldAlert
} from 'lucide-react';

export default function TutorDashboard() {
  const { user, role, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active_students' | 'past_students' | 'reading_tasks' | 'tests' | 'reports' | 'exam_duties' | 'audit_reports'>('active_students');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [selectedStudentForEval, setSelectedStudentForEval] = useState<{ id: string; name: string; class_grade?: string } | null>(null);
  const [selectedDutyForEval, setSelectedDutyForEval] = useState<EvaluationDuty | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // New Cross-Evaluation & Audit Report States
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

  // Students, Tasks, Tests, Reports Lists
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

  const [readingTasks, setReadingTasks] = useState<StudentReadingTask[]>([
    {
      id: 'task-1',
      student_name: 'Aarav Sharma',
      month_year: 'September 2026',
      task_title: 'NCERT Ch-4 Quadratic Equations: Word Problems Exercise 4.3 & 4.4',
      subject: 'Mathematics',
      target_date: '2026-09-24',
      status: 'in_progress',
      milestone_details: 'Crucial for upcoming Monthly Report Card & Term Assessment',
      next_report_weight: 'High (Included in upcoming Monthly Report)'
    },
    {
      id: 'task-2',
      student_name: 'Aarav Sharma',
      month_year: 'September 2026',
      task_title: 'Physics Ray Optics: Lens Formula & Sign Convention Numerical practice',
      subject: 'Science (Physics)',
      target_date: '2026-09-27',
      status: 'pending',
      milestone_details: 'Will be evaluated in next Sunday test',
      next_report_weight: 'High (Included in upcoming Monthly Report)'
    },
    {
      id: 'task-3',
      student_name: 'Rohan Verma',
      month_year: 'September 2026',
      task_title: 'Polynomials Factor Theorem & Remainder Theorem Proofs',
      subject: 'Mathematics',
      target_date: '2026-09-25',
      status: 'in_progress',
      milestone_details: 'Target for September final report assessment',
      next_report_weight: 'High (Included in upcoming Monthly Report)'
    }
  ]);

  const [testRecords, setTestRecords] = useState<StudentTest[]>([
    {
      id: 'test-1',
      student_name: 'Aarav Sharma',
      conducted_by_tutor_name: 'PIYUSH KUMAR PATEL',
      tutor_college_info: 'PCE PURNIA',
      subject: 'Mathematics',
      test_title: 'Monthly Unit Test 2 — Arithmetic Progressions & Quadratic Equations',
      test_date: '2026-09-16',
      total_marks: 50,
      marks_obtained: 46,
      percentage: 92.0,
      tutor_remarks: 'Brilliant precision in formula substitution. Speed improved by 25%.'
    },
    {
      id: 'test-2',
      student_name: 'Aarav Sharma',
      conducted_by_tutor_name: 'PIYUSH KUMAR PATEL',
      tutor_college_info: 'PCE PURNIA',
      subject: 'Science',
      test_title: 'Physics Quiz — Reflection of Light & Mirror Equations',
      test_date: '2026-09-08',
      total_marks: 30,
      marks_obtained: 27,
      percentage: 90.0,
      tutor_remarks: 'Ray diagrams were neatly drawn with accurate focal distance markers.'
    },
    {
      id: 'test-3',
      student_name: 'Rohan Verma',
      conducted_by_tutor_name: 'PIYUSH KUMAR PATEL',
      tutor_college_info: 'PCE PURNIA',
      subject: 'Mathematics',
      test_title: 'Number Systems & Rationalisation Mastery Test',
      test_date: '2026-09-12',
      total_marks: 40,
      marks_obtained: 35,
      percentage: 87.5,
      tutor_remarks: 'Very good foundation. Just needs revision in radical conjugates.'
    }
  ]);

  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([
    {
      id: 'rep-1',
      student_name: 'Aarav Sharma',
      student_class: 'Class 10 (CBSE)',
      month: 'September 2026',
      attendance_percentage: 96,
      marks_percentage: 88,
      syllabus_covered: 'Quadratic Equations (Ex 4.1 to 4.3), Light Reflection & Spherical Mirrors, Chemical Reactions balancing.',
      tutor_remarks: 'Aarav has shown remarkable dedication this month. Daily problem solving has elevated his confidence in Mathematics.',
      conducting_tutor_name: 'PIYUSH KUMAR PATEL',
      status: 'published'
    },
    {
      id: 'rep-2',
      student_name: 'Rohan Verma',
      student_class: 'Class 9 (CBSE)',
      month: 'September 2026',
      attendance_percentage: 92,
      marks_percentage: 84,
      syllabus_covered: 'Polynomials factorization, Laws of Motion & Momentum numericals.',
      tutor_remarks: 'Active participation in doubt clearing. Homework submitted punctually.',
      conducting_tutor_name: 'PIYUSH KUMAR PATEL',
      status: 'published'
    }
  ]);

  // Form states for modals
  const [newTaskForm, setNewTaskForm] = useState({
    student_name: 'Aarav Sharma',
    month_year: 'September 2026',
    task_title: '',
    subject: 'Mathematics',
    target_date: '2026-09-30',
    milestone_details: 'Mandatory for upcoming monthly progress card evaluation'
  });

  const [newTestForm, setNewTestForm] = useState({
    student_name: 'Aarav Sharma',
    conducted_by_tutor_name: 'PIYUSH KUMAR PATEL',
    tutor_college_info: 'PCE PURNIA',
    subject: 'Mathematics',
    test_title: '',
    test_date: new Date().toISOString().split('T')[0],
    total_marks: 50,
    marks_obtained: 45,
    tutor_remarks: 'Solid understanding of concepts with clear step-by-step calculations.'
  });

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

  const [newReportForm, setNewReportForm] = useState({
    student_name: 'Aarav Sharma',
    student_class: 'Class 10 (CBSE)',
    month: 'September 2026',
    attendance_percentage: 96,
    marks_percentage: 88,
    syllabus_covered: '',
    tutor_remarks: 'Consistently improving and actively completing monthly reading targets.',
    conducting_tutor_name: 'PIYUSH KUMAR PATEL'
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

      // 3. Reading Tasks
      const { data: tasksData } = await supabase
        .from('student_reading_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (tasksData && tasksData.length > 0) {
        setReadingTasks(tasksData);
      }

      // 4. Tests
      const { data: testsData } = await supabase
        .from('student_tests')
        .select('*')
        .order('test_date', { ascending: false });

      if (testsData && testsData.length > 0) {
        setTestRecords(testsData);
      }

      // 5. Monthly Reports
      const { data: reportsData } = await supabase
        .from('monthly_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportsData && reportsData.length > 0) {
        setMonthlyReports(reportsData);
      }

      // 6. Cross-Evaluation Duties
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

      // 7. Official Monthly Report Cards
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

      const { data, error } = await supabase
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

  // Handle Add Reading Task
  const handleAddReadingTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = {
        student_name: newTaskForm.student_name,
        month_year: newTaskForm.month_year,
        task_title: newTaskForm.task_title,
        subject: newTaskForm.subject,
        target_date: newTaskForm.target_date,
        status: 'in_progress',
        milestone_details: newTaskForm.milestone_details,
        next_report_weight: 'High (Included in upcoming Monthly Report)'
      };

      if (user) payload.tutor_id = user.id;

      const { data } = await supabase
        .from('student_reading_tasks')
        .insert([payload])
        .select()
        .single();

      const taskRecord = data || { ...payload, id: `task-${Date.now()}` };
      setReadingTasks((prev) => [taskRecord, ...prev]);
      setSuccessMsg(`Reading task assigned for ${payload.student_name}!`);
      setShowAddTaskModal(false);
      setNewTaskForm({
        student_name: 'Aarav Sharma',
        month_year: 'September 2026',
        task_title: '',
        subject: 'Mathematics',
        target_date: '2026-09-30',
        milestone_details: 'Mandatory for upcoming monthly progress card evaluation'
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add task');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Add Test Record
  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const pct = Number(((newTestForm.marks_obtained / newTestForm.total_marks) * 100).toFixed(1));
      const payload: any = {
        student_name: newTestForm.student_name,
        conducted_by_tutor_name: newTestForm.conducted_by_tutor_name || tutorProfile.full_name,
        tutor_college_info: newTestForm.tutor_college_info || tutorProfile.college,
        subject: newTestForm.subject,
        test_title: newTestForm.test_title,
        test_date: newTestForm.test_date,
        total_marks: Number(newTestForm.total_marks),
        marks_obtained: Number(newTestForm.marks_obtained),
        percentage: pct,
        tutor_remarks: newTestForm.tutor_remarks
      };

      if (user) payload.tutor_id = user.id;

      const { data } = await supabase
        .from('student_tests')
        .insert([payload])
        .select()
        .single();

      const testRecord = data || { ...payload, id: `test-${Date.now()}` };
      setTestRecords((prev) => [testRecord, ...prev]);
      setSuccessMsg(`Test record logged for ${payload.student_name} (${pct}%)!`);
      setShowAddTestModal(false);
      setNewTestForm({
        student_name: 'Aarav Sharma',
        conducted_by_tutor_name: tutorProfile.full_name,
        tutor_college_info: tutorProfile.college,
        subject: 'Mathematics',
        test_title: '',
        test_date: new Date().toISOString().split('T')[0],
        total_marks: 50,
        marks_obtained: 45,
        tutor_remarks: 'Solid understanding of concepts with clear step-by-step calculations.'
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add test');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Submit Monthly Report
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = {
        student_name: newReportForm.student_name,
        student_class: newReportForm.student_class,
        month: newReportForm.month,
        attendance_percentage: Number(newReportForm.attendance_percentage),
        marks_percentage: Number(newReportForm.marks_percentage),
        syllabus_covered: newReportForm.syllabus_covered,
        tutor_remarks: newReportForm.tutor_remarks,
        conducting_tutor_name: newReportForm.conducting_tutor_name || tutorProfile.full_name,
        status: 'published'
      };

      if (user) payload.tutor_id = user.id;

      const { data } = await supabase
        .from('monthly_reports')
        .insert([payload])
        .select()
        .single();

      const reportRecord = data || { ...payload, id: `rep-${Date.now()}` };
      setMonthlyReports((prev) => [reportRecord, ...prev]);
      setSuccessMsg(`Monthly Report published for ${payload.student_name}!`);
      setShowReportModal(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit report');
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

        {/* 1. COMPACT SLEEK EDUCATOR HEADER (Takes minimal height, strictly professional) */}
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          border: '1px solid #334155',
          borderRadius: '14px',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
        }}>
          {/* Tutor Info Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
            }}>
              {tutorProfile.full_name?.charAt(0) || 'P'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '0.02em' }}>
                  {tutorProfile.full_name}
                </h2>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(16, 185, 129, 0.18)', color: '#34D399', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                  <ShieldCheck size={13} /> Verified Tutor
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(245, 158, 11, 0.18)', color: '#FBBF24', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                  <Star size={13} fill="#FBBF24" /> {tutorProfile.rating || 5.0} Rating
                </span>
              </div>

              {/* Badges in single compact line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', fontSize: '0.8rem', color: '#94A3B8', flexWrap: 'wrap' }}>
                <span style={{ color: '#E2E8F0', fontWeight: 600 }}>🎓 {tutorProfile.college}</span>
                <span>•</span>
                <span style={{ color: '#93C5FD' }}>{tutorProfile.degree_status}</span>
                <span>•</span>
                <span style={{ color: '#FCD34D' }}>🗣️ {tutorProfile.medium_preference}</span>
                <span>•</span>
                <span>⏳ {tutorProfile.experience_years}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={() => { setEditForm({ ...tutorProfile }); setShowEditModal(true); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255,255,255,0.06)',
                color: '#E2E8F0',
                border: '1px solid #475569',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Edit3 size={14} /> Edit Profile Info
            </button>
            <button
              onClick={() => setShowAddStudentModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#059669',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(5,150,105,0.3)'
              }}
            >
              <Plus size={14} /> Enroll Student
            </button>
          </div>
        </div>

        {/* 2. TOP METRICS STRIP */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          
          <div 
            onClick={() => setActiveTab('active_students')}
            style={{
              background: activeTab === 'active_students' ? 'rgba(5, 150, 105, 0.15)' : '#1E293B',
              border: `1px solid ${activeTab === 'active_students' ? '#10B981' : '#334155'}`,
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600 }}>Active Live Students</span>
              <Users size={18} color="#34D399" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34D399' }}>
              {activeStudents.length} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8' }}>Studying Now</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('past_students')}
            style={{
              background: activeTab === 'past_students' ? 'rgba(59, 130, 246, 0.15)' : '#1E293B',
              border: `1px solid ${activeTab === 'past_students' ? '#3B82F6' : '#334155'}`,
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600 }}>Past / Completed Students</span>
              <GraduationCap size={18} color="#60A5FA" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#60A5FA' }}>
              {pastStudents.length} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8' }}>Graduated</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('reading_tasks')}
            style={{
              background: activeTab === 'reading_tasks' ? 'rgba(245, 158, 11, 0.15)' : '#1E293B',
              border: `1px solid ${activeTab === 'reading_tasks' ? '#F59E0B' : '#334155'}`,
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600 }}>Monthly Reading Tasks</span>
              <BookOpen size={18} color="#FBBF24" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FBBF24' }}>
              {readingTasks.length} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8' }}>Report Targets</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('tests')}
            style={{
              background: activeTab === 'tests' ? 'rgba(168, 85, 247, 0.15)' : '#1E293B',
              border: `1px solid ${activeTab === 'tests' ? '#A855F7' : '#334155'}`,
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600 }}>Conducted Tests (Sept)</span>
              <ClipboardList size={18} color="#C084FC" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#C084FC' }}>
              {testRecords.length} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8' }}>Tests Evaluated</span>
            </div>
          </div>

        </div>

        {/* 3. NAVIGATION TABS */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
          
          <button
            onClick={() => setActiveTab('active_students')}
            style={{
              background: activeTab === 'active_students' ? '#059669' : 'transparent',
              color: activeTab === 'active_students' ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              padding: '0.6rem 1.2rem',
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
              padding: '0.6rem 1.2rem',
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
            onClick={() => setActiveTab('reading_tasks')}
            style={{
              background: activeTab === 'reading_tasks' ? '#D97706' : 'transparent',
              color: activeTab === 'reading_tasks' ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <BookOpen size={16} /> Monthly Reading Tasks ({readingTasks.length})
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            style={{
              background: activeTab === 'tests' ? '#7C3AED' : 'transparent',
              color: activeTab === 'tests' ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ClipboardList size={16} /> Tests & Conducting Teacher ({testRecords.length})
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            style={{
              background: activeTab === 'reports' ? '#475569' : 'transparent',
              color: activeTab === 'reports' ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FileSpreadsheet size={16} /> Basic Reports ({monthlyReports.length})
          </button>

          <button
            onClick={() => setActiveTab('exam_duties')}
            style={{
              background: activeTab === 'exam_duties' ? 'linear-gradient(135deg, #D97706, #B45309)' : 'rgba(245, 158, 11, 0.1)',
              color: activeTab === 'exam_duties' ? '#FFFFFF' : '#F59E0B',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              padding: '0.6rem 1.2rem',
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
              padding: '0.6rem 1.2rem',
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Active Students Currently Enrolled
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                  Students receiving weekly home-tuition from {tutorProfile.full_name}.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  style={{
                    background: '#F59E0B',
                    color: '#0F172A',
                    border: 'none',
                    padding: '0.5rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <BookOpen size={14} /> + Assign Reading Task
                </button>
                <button
                  onClick={() => setShowAddTestModal(true)}
                  style={{
                    background: '#8B5CF6',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.5rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <ClipboardList size={14} /> + Log Test Score
                </button>
              </div>
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
                    <button
                      onClick={() => {
                        setNewTaskForm((prev) => ({ ...prev, student_name: student.student_name }));
                        setShowAddTaskModal(true);
                      }}
                      style={{
                        flex: 1,
                        background: 'rgba(245, 158, 11, 0.12)',
                        color: '#FBBF24',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        padding: '0.45rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      + Reading Task
                    </button>
                    <button
                      onClick={() => {
                        setNewTestForm((prev) => ({ ...prev, student_name: student.student_name }));
                        setShowAddTestModal(true);
                      }}
                      style={{
                        flex: 1,
                        background: 'rgba(168, 85, 247, 0.12)',
                        color: '#C084FC',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        padding: '0.45rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      + Log Test
                    </button>
                    <button
                      onClick={() => {
                        setNewReportForm((prev) => ({
                          ...prev,
                          student_name: student.student_name,
                          student_class: `${student.class_grade} (${student.board})`
                        }));
                        setShowReportModal(true);
                      }}
                      style={{
                        flex: 1,
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: '#34D399',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '0.45rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PAST / COMPLETED STUDENTS */}
        {activeTab === 'past_students' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Past & Graduated Students History
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

        {/* TAB 3: MONTHLY READING TASKS */}
        {activeTab === 'reading_tasks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Current Month's Reading & Syllabus Tasks (September 2026)
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                  Chapters and problem sets assigned by tutor on which the upcoming monthly progress card will be generated.
                </p>
              </div>

              <button
                onClick={() => setShowAddTaskModal(true)}
                style={{
                  background: '#F59E0B',
                  color: '#0F172A',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Plus size={16} /> Assign New Reading Task
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {readingTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: '1 1 400px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <span style={{ background: '#0F172A', color: '#FBBF24', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.3)' }}>
                        {task.student_name}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#38BDF8', fontWeight: 600 }}>
                        {task.subject}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                        📅 Target: {task.target_date || 'End of Month'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.35rem 0' }}>
                      {task.task_title}
                    </h4>

                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                      💡 {task.milestone_details || 'Critical syllabus target for monthly report'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      background: task.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: task.status === 'completed' ? '#34D399' : '#FBBF24',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.3rem 0.75rem',
                      borderRadius: '20px',
                      border: `1px solid ${task.status === 'completed' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                    }}>
                      {task.status === 'completed' ? '✓ Completed' : '⏳ In Progress'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MONTHLY TESTS & CONDUCTING TEACHER DETAILS */}
        {activeTab === 'tests' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Conducted Tests & Assessments Log
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                  Includes student marks, test dates, and conducting educator credentials saved to Supabase.
                </p>
              </div>

              <button
                onClick={() => setShowAddTestModal(true)}
                style={{
                  background: '#8B5CF6',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Plus size={16} /> Log New Test Assessment
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {testRecords.map((test) => (
                <div
                  key={test.id}
                  style={{
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: '1 1 450px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{ background: '#0F172A', color: '#C084FC', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(168,85,247,0.3)' }}>
                        {test.student_name}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#38BDF8', fontWeight: 600 }}>
                        {test.subject}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                        📅 Date: {test.test_date}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.4rem 0' }}>
                      {test.test_title}
                    </h4>

                    {/* Conducting Teacher Details */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#0F172A', padding: '0.3rem 0.75rem', borderRadius: '6px', border: '1px solid #334155', fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.4rem' }}>
                      <span>👨‍🏫 Conducted by:</span>
                      <strong style={{ color: '#FDE68A' }}>{test.conducted_by_tutor_name || tutorProfile.full_name}</strong>
                      <span>({test.tutor_college_info || tutorProfile.college})</span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#CBD5E1', fontStyle: 'italic' }}>
                      "{test.tutor_remarks || 'Consistent academic performance.'}"
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', background: '#0F172A', padding: '0.85rem 1.25rem', borderRadius: '10px', border: '1px solid #334155', minWidth: '120px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34D399' }}>
                      {test.marks_obtained} <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>/ {test.total_marks}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', marginTop: '2px' }}>
                      {test.percentage ? `${test.percentage}%` : `${Math.round((test.marks_obtained / test.total_marks) * 100)}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MONTHLY REPORTS */}
        {activeTab === 'reports' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Verified Monthly Progress Reports
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                  Official parent progress reports synced with Supabase.
                </p>
              </div>

              <button
                onClick={() => setShowReportModal(true)}
                style={{
                  background: '#059669',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Plus size={16} /> Generate Monthly Report
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {monthlyReports.map((report) => (
                <div
                  key={report.id}
                  style={{
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                        {report.student_name} — {report.month}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: '#38BDF8' }}>
                        {report.student_class} • Verified by: <strong style={{ color: '#FDE68A' }}>{report.conducting_tutor_name || tutorProfile.full_name}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.78rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '6px' }}>
                        Attendance: {report.attendance_percentage}%
                      </span>
                      <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', fontSize: '0.78rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '6px' }}>
                        Score: {report.marks_percentage}%
                      </span>
                    </div>
                  </div>

                  <div style={{ background: '#0F172A', borderRadius: '8px', padding: '0.85rem', border: '1px solid #334155', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#CBD5E1' }}>
                    <strong style={{ color: '#F1F5F9' }}>Syllabus Covered: </strong>{report.syllabus_covered}
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                    <strong style={{ color: '#E2E8F0' }}>Tutor Remarks: </strong>"{report.tutor_remarks}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CROSS-EXAMINATION DUTIES & CENTER ALLOCATIONS */}
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
                        const sId = duty.student_ids?.[idx] || `std-${idx + 1}`;
                        const existingRep = monthlyReportCards.find((r) => r.student_name === stName || r.student_id === sId);
                        
                        return (
                          <div
                            key={idx}
                            style={{
                              padding: '10px 12px',
                              background: '#1E293B',
                              borderRadius: '8px',
                              border: '1px solid #334155',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 800, color: '#F8FAFC', fontSize: '0.9rem' }}>
                                {stName}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                                Class 7th • CBSE/ICSE • Regular Tutor: Harshit Patel
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedStudentForEval({ id: sId, name: stName, class_grade: 'Class 7th • CBSE/ICSE' });
                                setSelectedDutyForEval(duty);
                                setShowEditorModal(true);
                              }}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                background: existingRep ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #F59E0B, #D97706)',
                                color: existingRep ? '#34D399' : '#000000',
                                border: existingRep ? '1px solid #059669' : 'none',
                                fontWeight: 800,
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Edit3 size={13} />
                              <span>{existingRep ? 'Edit / Retest' : 'Conduct Test & Fill Report'}</span>
                            </button>
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

        {/* TAB 7: OFFICIAL SINGLE-PAGE PROGRESS AUDIT REPORTS */}
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

      {/* MODAL 1: EDIT TUTOR PROFILE */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', maxWidth: '580px', width: '100%', padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Edit Tutor Profile Details
              </h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Full Name</label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Institution / College</label>
                  <input
                    type="text"
                    value={editForm.college}
                    onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Degree & Performance</label>
                  <input
                    type="text"
                    value={editForm.degree_status}
                    onChange={(e) => setEditForm({ ...editForm, degree_status: e.target.value })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Teaching Medium Comfort</label>
                  <select
                    value={editForm.medium_preference}
                    onChange={(e) => setEditForm({ ...editForm, medium_preference: e.target.value })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  >
                    <option value="Hindi medium only">Hindi medium only</option>
                    <option value="English medium only">English medium only</option>
                    <option value="Bilingual (Hindi + English)">Bilingual (Hindi + English)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Teaching Experience</label>
                  <input
                    type="text"
                    value={editForm.experience_years}
                    onChange={(e) => setEditForm({ ...editForm, experience_years: e.target.value })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Primary Subjects & Classes</label>
                <input
                  type="text"
                  value={editForm.subjects}
                  onChange={(e) => setEditForm({ ...editForm, subjects: e.target.value })}
                  style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Teaching Methodology & Bio</label>
                <textarea
                  rows={3}
                  value={editForm.bio_and_custom_notes}
                  onChange={(e) => setEditForm({ ...editForm, bio_and_custom_notes: e.target.value })}
                  style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{ background: 'transparent', border: '1px solid #475569', color: '#CBD5E1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: '#059669', border: 'none', color: '#FFFFFF', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {submitting ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASSIGN READING TASK */}
      {showAddTaskModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Assign Monthly Reading / Syllabus Task
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                  This task will directly feed into the student's next monthly report card.
                </p>
              </div>
              <button onClick={() => setShowAddTaskModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddReadingTask} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Select Student</label>
                <select
                  value={newTaskForm.student_name}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, student_name: e.target.value })}
                  style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                >
                  {activeStudents.map((s) => (
                    <option key={s.id} value={s.student_name}>{s.student_name} ({s.class_grade})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Subject</label>
                  <input
                    type="text"
                    value={newTaskForm.subject}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, subject: e.target.value })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Target Date</label>
                  <input
                    type="date"
                    value={newTaskForm.target_date}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, target_date: e.target.value })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Chapter / Reading Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. NCERT Ch-5 Arithmetic Progressions: Ex 5.2 Word Problems"
                  value={newTaskForm.task_title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, task_title: e.target.value })}
                  style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Report Weight / Milestone Note</label>
                <input
                  type="text"
                  value={newTaskForm.milestone_details}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, milestone_details: e.target.value })}
                  style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddTaskModal(false)} style={{ background: 'transparent', border: '1px solid #475569', color: '#CBD5E1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ background: '#F59E0B', border: 'none', color: '#0F172A', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                  {submitting ? 'Saving...' : 'Save Task in Supabase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LOG TEST ASSESSMENT */}
      {showAddTestModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', maxWidth: '540px', width: '100%', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Log Monthly Test Assessment
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                  Record score and conducting teacher details live to Supabase.
                </p>
              </div>
              <button onClick={() => setShowAddTestModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddTest} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Select Student</label>
                  <select
                    value={newTestForm.student_name}
                    onChange={(e) => setNewTestForm({ ...newTestForm, student_name: e.target.value })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  >
                    {activeStudents.map((s) => (
                      <option key={s.id} value={s.student_name}>{s.student_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Subject</label>
                  <input
                    type="text"
                    value={newTestForm.subject}
                    onChange={(e) => setNewTestForm({ ...newTestForm, subject: e.target.value })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Test Name / Chapter</label>
                <input
                  type="text"
                  placeholder="e.g. Unit Test 3: Trigonometry & Circle Proofs"
                  value={newTestForm.test_title}
                  onChange={(e) => setNewTestForm({ ...newTestForm, test_title: e.target.value })}
                  style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Test Date</label>
                  <input
                    type="date"
                    value={newTestForm.test_date}
                    onChange={(e) => setNewTestForm({ ...newTestForm, test_date: e.target.value })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Total Marks</label>
                  <input
                    type="number"
                    value={newTestForm.total_marks}
                    onChange={(e) => setNewTestForm({ ...newTestForm, total_marks: Number(e.target.value) })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Marks Scored</label>
                  <input
                    type="number"
                    value={newTestForm.marks_obtained}
                    onChange={(e) => setNewTestForm({ ...newTestForm, marks_obtained: Number(e.target.value) })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Conducting Educator</label>
                  <input
                    type="text"
                    value={newTestForm.conducted_by_tutor_name}
                    onChange={(e) => setNewTestForm({ ...newTestForm, conducted_by_tutor_name: e.target.value })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Educator College</label>
                  <input
                    type="text"
                    value={newTestForm.tutor_college_info}
                    onChange={(e) => setNewTestForm({ ...newTestForm, tutor_college_info: e.target.value })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Teacher Remarks & Feedback</label>
                <textarea
                  rows={2}
                  value={newTestForm.tutor_remarks}
                  onChange={(e) => setNewTestForm({ ...newTestForm, tutor_remarks: e.target.value })}
                  style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddTestModal(false)} style={{ background: 'transparent', border: '1px solid #475569', color: '#CBD5E1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ background: '#8B5CF6', border: 'none', color: '#FFFFFF', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                  {submitting ? 'Saving...' : 'Save Test Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ENROLL NEW STUDENT */}
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
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddStudentModal(false)} style={{ background: 'transparent', border: '1px solid #475569', color: '#CBD5E1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ background: '#059669', border: 'none', color: '#FFFFFF', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                  {submitting ? 'Enrolling...' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: GENERATE MONTHLY REPORT */}
      {showReportModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', maxWidth: '540px', width: '100%', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Generate Monthly Progress Report
              </h3>
              <button onClick={() => setShowReportModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmitReport} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Student</label>
                  <select
                    value={newReportForm.student_name}
                    onChange={(e) => setNewReportForm({ ...newReportForm, student_name: e.target.value })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  >
                    {activeStudents.map((s) => (
                      <option key={s.id} value={s.student_name}>{s.student_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Report Month</label>
                  <input
                    type="text"
                    value={newReportForm.month}
                    onChange={(e) => setNewReportForm({ ...newReportForm, month: e.target.value })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Attendance %</label>
                  <input
                    type="number"
                    value={newReportForm.attendance_percentage}
                    onChange={(e) => setNewReportForm({ ...newReportForm, attendance_percentage: Number(e.target.value) })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Academic Score %</label>
                  <input
                    type="number"
                    value={newReportForm.marks_percentage}
                    onChange={(e) => setNewReportForm({ ...newReportForm, marks_percentage: Number(e.target.value) })}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Syllabus Chapters Completed</label>
                <input
                  type="text"
                  placeholder="e.g. Quadratic Equations, Light Ray Reflection, Chemical Equations"
                  value={newReportForm.syllabus_covered}
                  onChange={(e) => setNewReportForm({ ...newReportForm, syllabus_covered: e.target.value })}
                  style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Tutor Remarks & Progress Note</label>
                <textarea
                  rows={3}
                  value={newReportForm.tutor_remarks}
                  onChange={(e) => setNewReportForm({ ...newReportForm, tutor_remarks: e.target.value })}
                  style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FFFFFF', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowReportModal(false)} style={{ background: 'transparent', border: '1px solid #475569', color: '#CBD5E1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ background: '#059669', border: 'none', color: '#FFFFFF', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                  {submitting ? 'Publishing...' : 'Publish Official Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
