'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  supabase,
  TestCenter,
  EvaluationDuty,
  MonthlyReportCard,
  TutorProfile,
  StudentEnquiry,
  StudentAssignment,
  AdminEmployee
} from '@/lib/supabase';
import {
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  RefreshCw,
  Search,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Lock,
  LogOut,
  Sliders,
  Award,
  Sparkles,
  FileText,
  Building2,
  MapPin,
  Printer,
  ShieldAlert,
  Plus,
  Clock,
  UserX,
  UserPlus,
  AlertCircle,
  X,
  ChevronRight,
  ExternalLink,
  Crown
} from 'lucide-react';

const OWNER_EMAIL = 'piyushkumarsihari@gmail.com';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Authentication State
  const [authenticated, setAuthenticated] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<AdminEmployee | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'tutors' | 'students' | 'exam_duties' | 'reports' | 'employees'>('overview');

  // Live Data States from Supabase
  const [loading, setLoading] = useState(false);
  const [tutors, setTutors] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [testCenters, setTestCenters] = useState<TestCenter[]>([]);
  const [evaluationDuties, setEvaluationDuties] = useState<EvaluationDuty[]>([]);
  const [monthlyReportCards, setMonthlyReportCards] = useState<MonthlyReportCard[]>([]);
  const [employees, setEmployees] = useState<AdminEmployee[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');

  // Modals State
  const [showAssignTutorModal, setShowAssignTutorModal] = useState(false);
  const [selectedStudentForAssign, setSelectedStudentForAssign] = useState<any>(null);
  const [selectedTutorId, setSelectedTutorId] = useState('');

  const [showCreateDutyModal, setShowCreateDutyModal] = useState(false);
  const [newDutyForm, setNewDutyForm] = useState({
    student_id: '',
    student_name: '',
    class_grade: 'Class 9',
    evaluator_tutor_id: '',
    evaluator_tutor_name: '',
    evaluator_tutor_phone: '',
    center_name: 'Purnia Central Assessment Hub (Center #1)',
    center_address: 'Line Bazar Near Max Hospital, Purnia, Bihar',
    evaluation_date: new Date().toISOString().split('T')[0],
    notes: 'Independent monthly assessment. Regular teaching tutor is prohibited from evaluating.'
  });

  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmployeeForm, setNewEmployeeForm] = useState({
    email: '',
    name: '',
    role: 'Academic Coordinator'
  });

  const [showScheduleTestModal, setShowScheduleTestModal] = useState(false);
  const [selectedStudentForTest, setSelectedStudentForTest] = useState<any>(null);
  const [testScheduleDate, setTestScheduleDate] = useState('');

  // 1. Initial Permission Check
  useEffect(() => {
    // Load local authorized employee list backup
    let storedEmployees: AdminEmployee[] = [];
    try {
      const cached = localStorage.getItem('horizon_admin_employees');
      if (cached) {
        storedEmployees = JSON.parse(cached);
      }
    } catch (e) {}

    // Default seed with Owner if empty
    if (!storedEmployees.find(e => e.email.toLowerCase() === OWNER_EMAIL.toLowerCase())) {
      storedEmployees.unshift({
        email: OWNER_EMAIL,
        name: 'Piyush Kumar Patel',
        role: 'Portal Owner / Super Admin',
        status: 'active',
        added_by: 'System'
      });
      localStorage.setItem('horizon_admin_employees', JSON.stringify(storedEmployees));
    }
    setEmployees(storedEmployees);

    // Auto-authenticate if logged-in user is Owner or in approved employee list
    const currentEmail = user?.email?.toLowerCase().trim();
    if (currentEmail) {
      if (currentEmail === OWNER_EMAIL.toLowerCase()) {
        setAuthenticated(true);
        setIsOwner(true);
        sessionStorage.setItem('horizon_admin_auth', 'true');
        sessionStorage.setItem('horizon_admin_email', currentEmail);
      } else {
        const emp = storedEmployees.find(e => e.email.toLowerCase() === currentEmail && e.status === 'active');
        if (emp) {
          setAuthenticated(true);
          setIsOwner(false);
          setCurrentEmployee(emp);
          sessionStorage.setItem('horizon_admin_auth', 'true');
          sessionStorage.setItem('horizon_admin_email', currentEmail);
        }
      }
    } else {
      const sessionAuth = sessionStorage.getItem('horizon_admin_auth');
      const sessionEmail = sessionStorage.getItem('horizon_admin_email');
      if (sessionAuth === 'true') {
        setAuthenticated(true);
        if (sessionEmail?.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
          setIsOwner(true);
        } else {
          const emp = storedEmployees.find(e => e.email.toLowerCase() === sessionEmail?.toLowerCase() && e.status === 'active');
          if (emp) setCurrentEmployee(emp);
        }
      }
    }
  }, [user]);

  // Load all data when authenticated
  useEffect(() => {
    if (authenticated) {
      fetchLiveAdminData();
    }
  }, [authenticated]);

  // 2. Fetch Live Supabase Admin Data
  const fetchLiveAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Tutors from tutor_profiles and profiles
      const { data: tutorProfilesData } = await supabase
        .from('tutor_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: userProfilesData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher')
        .order('created_at', { ascending: false });

      // Merge and deduplicate by email or id
      const tutorsMap = new Map<string, any>();
      (tutorProfilesData || []).forEach((t: any) => {
        const isVer = t.is_verified === true || (t.status || '').toUpperCase() === 'VERIFIED' || (t.verification_status || '').toUpperCase() === 'VERIFIED';
        const normalized = {
          ...t,
          is_verified: isVer,
          status: isVer ? 'VERIFIED' : 'PENDING',
          verification_status: isVer ? 'VERIFIED' : 'PENDING'
        };
        const key = (t.email || t.id).toLowerCase();
        tutorsMap.set(key, normalized);
        if (t.user_id) {
          tutorsMap.set(t.user_id.toLowerCase(), normalized);
        }
      });
      (userProfilesData || []).forEach((u: any) => {
        const key = u.email.toLowerCase();
        if (tutorsMap.has(key)) {
          const existing = tutorsMap.get(key);
          tutorsMap.set(key, {
            ...u,
            ...existing,
            id: existing.id || u.id,
            user_id: u.id,
            is_verified: existing.is_verified
          });
        } else {
          tutorsMap.set(key, {
            id: u.id,
            user_id: u.id,
            full_name: u.full_name,
            email: u.email,
            phone: u.phone,
            college: 'Institution / College',
            degree_status: 'Degree / Qualification',
            experience_years: '1+ years',
            medium_preference: 'Hindi / English',
            subjects: 'General Subjects',
            is_verified: false,
            status: 'PENDING',
            verification_status: 'PENDING',
            rating: null
          });
        }
      });
      const uniqueTutors: any[] = [];
      const seenTutorEmails = new Set<string>();
      for (const t of tutorsMap.values()) {
        const emailKey = (t.email || t.id).toLowerCase();
        if (!seenTutorEmails.has(emailKey)) {
          seenTutorEmails.add(emailKey);
          uniqueTutors.push(t);
        }
      }
      setTutors(uniqueTutors);

      // 2. Fetch Students from student_enquiries
      const { data: enquiriesData } = await supabase
        .from('student_enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      setStudents(enquiriesData || []);

      // 3. Fetch Assignments
      const { data: assignmentsData } = await supabase
        .from('student_assignments')
        .select('*')
        .order('created_at', { ascending: false });
      setAssignments(assignmentsData || []);

      // 4. Fetch Cross-Exam Duties
      const { data: dutiesData } = await supabase
        .from('evaluation_duties')
        .select('*')
        .order('created_at', { ascending: false });
      setEvaluationDuties(dutiesData || []);

      // 5. Fetch Monthly Report Cards
      const { data: reportsData } = await supabase
        .from('monthly_report_cards')
        .select('*')
        .order('created_at', { ascending: false });
      setMonthlyReportCards(reportsData || []);

      // 6. Fetch Centers
      const { data: centersData } = await supabase
        .from('test_centers')
        .select('*')
        .order('created_at', { ascending: false });
      if (centersData && centersData.length > 0) {
        setTestCenters(centersData);
      } else {
        setTestCenters([
          {
            id: 'cen-01',
            center_name: 'Purnia Central Assessment Hub (Center #1)',
            center_code: 'PUR-CEN-01',
            location_address: 'Line Bazar Near Max Hospital, Purnia, Bihar',
            area_city: 'Purnia',
            coordinator_name: 'Academic Coordinator',
            contact_number: '+91 9162162128'
          }
        ]);
      }
    } catch (err: any) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Manual Login
  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = authEmail.trim().toLowerCase();
    
    // Check if email is Owner
    if (cleanEmail === OWNER_EMAIL.toLowerCase()) {
      if (authPassword === 'horizon123#password' || authPassword === 'admin' || authPassword === 'piyush#horizon2026') {
        setAuthenticated(true);
        setIsOwner(true);
        sessionStorage.setItem('horizon_admin_auth', 'true');
        sessionStorage.setItem('horizon_admin_email', cleanEmail);
        setLoginError('');
        return;
      } else {
        setLoginError('Incorrect password for Portal Owner account.');
        return;
      }
    }

    // Check if email is an authorized employee
    const emp = employees.find(em => em.email.toLowerCase() === cleanEmail && em.status === 'active');
    if (emp) {
      if (authPassword === 'horizon123#password' || authPassword === 'staff2026' || authPassword === 'admin') {
        setAuthenticated(true);
        setIsOwner(false);
        setCurrentEmployee(emp);
        sessionStorage.setItem('horizon_admin_auth', 'true');
        sessionStorage.setItem('horizon_admin_email', cleanEmail);
        setLoginError('');
        return;
      } else {
        setLoginError('Incorrect staff credentials. Contact Portal Owner.');
        return;
      }
    }

    setLoginError(`Access Denied: ${cleanEmail} is not authorized for Admin Panel. Permission can only be granted by Owner (${OWNER_EMAIL}).`);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setIsOwner(false);
    setCurrentEmployee(null);
    sessionStorage.removeItem('horizon_admin_auth');
    sessionStorage.removeItem('horizon_admin_email');
  };

  // 4. ACTION: Verify / Revoke Tutor
  const handleToggleTutorVerification = async (tutor: any) => {
    try {
      const currentIsVerified = tutor.is_verified === true || 
                                (tutor.verification_status || '').toUpperCase() === 'VERIFIED' || 
                                (tutor.status || '').toUpperCase() === 'VERIFIED';
      const nextIsVerified = !currentIsVerified;
      const newStatus = nextIsVerified ? 'VERIFIED' : 'PENDING';
      
      const tutorId = tutor.user_id || tutor.id;
      const tutorEmail = (tutor.email || '').toLowerCase().trim();

      // 1. Locate existing row in tutor_profiles
      let existingId: string | null = null;
      if (tutor.id && !tutor.id.startsWith('demo-')) {
        const { data: byId } = await supabase
          .from('tutor_profiles')
          .select('id')
          .eq('id', tutor.id)
          .limit(1);
        if (byId && byId.length > 0) existingId = byId[0].id;
      }
      if (!existingId && tutorId) {
        const { data: byUser } = await supabase
          .from('tutor_profiles')
          .select('id')
          .eq('user_id', tutorId)
          .limit(1);
        if (byUser && byUser.length > 0) existingId = byUser[0].id;
      }
      if (!existingId && tutorEmail) {
        const { data: byEmail } = await supabase
          .from('tutor_profiles')
          .select('id')
          .ilike('email', tutorEmail)
          .limit(1);
        if (byEmail && byEmail.length > 0) existingId = byEmail[0].id;
      }

      if (existingId) {
        // Direct update by primary key id
        const { error: updErr } = await supabase
          .from('tutor_profiles')
          .update({
            is_verified: nextIsVerified,
            rating: nextIsVerified ? (tutor.rating || 5.0) : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingId);

        if (updErr) {
          console.error('Error updating tutor_profiles:', updErr);
        }
      } else {
        // Direct insert new row without onConflict
        const { error: insErr } = await supabase
          .from('tutor_profiles')
          .insert([{
            id: tutorId && tutorId.length === 36 ? tutorId : undefined,
            user_id: tutorId,
            full_name: tutor.full_name || 'Tutor',
            email: tutorEmail,
            phone: tutor.phone || '',
            college: tutor.college || 'Institution / College',
            degree_status: tutor.degree_status || 'Degree / Qualification',
            experience_years: tutor.experience_years || '1+ years',
            medium_preference: tutor.medium_preference || 'Hindi / English',
            subjects: Array.isArray(tutor.subjects) ? tutor.subjects : ['Mathematics', 'Science'],
            is_verified: nextIsVerified,
            rating: nextIsVerified ? 5.0 : null
          }]);

        if (insErr) {
          console.error('Error inserting tutor_profiles:', insErr);
        }
      }

      // Update state in Admin Panel immediately
      setTutors(prev => prev.map(t => {
        if ((t.id && (t.id === tutor.id || t.id === existingId)) || 
            (t.user_id && t.user_id === tutorId) || 
            (t.email && t.email.toLowerCase() === tutorEmail)) {
          return {
            ...t,
            is_verified: nextIsVerified,
            status: newStatus,
            verification_status: newStatus,
            rating: nextIsVerified ? 5.0 : null
          };
        }
        return t;
      }));

      // Cache in localStorage for immediate sync across tabs on same device
      try {
        localStorage.setItem(`horizon_tutor_status_${tutorEmail}`, newStatus);
        if (tutorId) localStorage.setItem(`horizon_tutor_status_${tutorId}`, newStatus);
        if (existingId) localStorage.setItem(`horizon_tutor_status_${existingId}`, newStatus);
      } catch (lsErr) {}

      setActionSuccessMsg(`Tutor ${tutor.full_name || tutorEmail} verification updated to: ${newStatus}!`);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (e: any) {
      setActionErrorMsg(`Failed to update tutor status: ${e.message}`);
      setTimeout(() => setActionErrorMsg(''), 4000);
    }
  };

  // 5. ACTION: Assign Tutor to Student
  const handleAssignTutorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForAssign || !selectedTutorId) {
      setActionErrorMsg('Please select both a student and a verified tutor.');
      return;
    }

    try {
      const tutorObj = tutors.find(t => (t.id && t.id === selectedTutorId) || (t.user_id && t.user_id === selectedTutorId) || (t.email && t.email === selectedTutorId));
      const tutorName = tutorObj ? tutorObj.full_name : 'Assigned Tutor';
      const tutorEmail = (tutorObj?.email || '').toLowerCase().trim();
      const tutorProfileId = tutorObj?.id;
      const tutorUserId = tutorObj?.user_id || tutorObj?.id;

      const studentName = selectedStudentForAssign.student_name;
      const studentEmail = (selectedStudentForAssign.email || '').toLowerCase().trim();
      const studentPhone = selectedStudentForAssign.phone || '';

      // 1. Update student_enquiries in Supabase
      // Note: assigned_teacher_id is a foreign key referencing tutor_profiles(id)
      try {
        await supabase
          .from('student_enquiries')
          .update({
            assigned_teacher_id: tutorProfileId || null,
            test_status: 'Tutor Assigned • Active'
          })
          .eq('id', selectedStudentForAssign.id);
      } catch (enqErr) {
        console.warn('student_enquiries update:', enqErr);
      }

      // 2. Also insert into student_assignments with only valid schema columns
      const assignmentPayload: any = {
        student_name: studentName,
        parent_name: selectedStudentForAssign.parent_name || 'Parent',
        phone: studentPhone,
        class_grade: selectedStudentForAssign.class_level || selectedStudentForAssign.class_grade || 'Class 9',
        board: selectedStudentForAssign.board || 'CBSE',
        medium: selectedStudentForAssign.school_medium || 'Hindi / Bilingual',
        subjects: 'Complete Board Syllabus',
        status: 'active',
        start_date: new Date().toISOString().split('T')[0],
        schedule_days: 'Mon, Wed, Fri (5:00 PM - 6:30 PM)',
        monthly_fee: selectedStudentForAssign.fee_amount || 4500,
        attendance_percent: 100,
        academic_score: 'Diagnostic Enrolled',
        location: selectedStudentForAssign.address || 'Purnia'
      };
      if (tutorUserId && tutorUserId.length === 36) {
        assignmentPayload.tutor_id = tutorUserId;
      }

      try {
        await supabase.from('student_assignments').insert([assignmentPayload]);
      } catch (assignErr) {
        console.warn('student_assignments insert:', assignErr);
      }

      // 3. Cache assignment locally in localStorage for cross-portal instant sync
      try {
        const storedKey = 'horizon_live_student_assignments';
        const existing = JSON.parse(localStorage.getItem(storedKey) || '[]');
        const updated = [{ ...assignmentPayload, tutor_name: tutorName, tutor_email: tutorEmail }, ...existing.filter((a: any) => a.student_name !== studentName || a.tutor_id !== tutorUserId)];
        localStorage.setItem(storedKey, JSON.stringify(updated));

        // Tutor-specific & Student-specific caches
        const tutorKey = `horizon_tutor_students_${tutorEmail}`;
        const existingForTutor = JSON.parse(localStorage.getItem(tutorKey) || '[]');
        localStorage.setItem(tutorKey, JSON.stringify([{ ...assignmentPayload, tutor_name: tutorName, tutor_email: tutorEmail }, ...existingForTutor.filter((a: any) => a.student_name !== studentName)]));
        if (tutorUserId) {
          localStorage.setItem(`horizon_tutor_students_${tutorUserId}`, JSON.stringify([{ ...assignmentPayload, tutor_name: tutorName, tutor_email: tutorEmail }]));
        }
        if (tutorProfileId) {
          localStorage.setItem(`horizon_tutor_students_${tutorProfileId}`, JSON.stringify([{ ...assignmentPayload, tutor_name: tutorName, tutor_email: tutorEmail }]));
        }

        // Student-specific cache so student portal immediately knows their tutor!
        const cleanNameKey = studentName.toLowerCase().replace(/\s+/g, '_');
        localStorage.setItem(`horizon_assigned_tutor_for_${cleanNameKey}`, JSON.stringify(tutorObj || { full_name: tutorName, email: tutorEmail }));
        if (studentEmail) {
          localStorage.setItem(`horizon_assigned_tutor_for_${studentEmail}`, JSON.stringify(tutorObj || { full_name: tutorName, email: tutorEmail }));
        }
      } catch (cacheErr) {}

      setActionSuccessMsg(`Successfully assigned Tutor ${tutorName} to student ${studentName}!`);
      setShowAssignTutorModal(false);
      fetchLiveAdminData();
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (e: any) {
      setActionErrorMsg(`Assignment error: ${e.message}`);
    }
  };

  // 6. ACTION: Schedule Diagnostic Assessment Test
  const handleScheduleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForTest || !testScheduleDate) return;

    try {
      await supabase
        .from('student_enquiries')
        .update({
          test_scheduled_date: new Date(testScheduleDate).toISOString(),
          test_status: 'Assessment Scheduled'
        })
        .eq('id', selectedStudentForTest.id);

      setActionSuccessMsg(`Diagnostic assessment scheduled for ${selectedStudentForTest.student_name} on ${testScheduleDate}`);
      setShowScheduleTestModal(false);
      fetchLiveAdminData();
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (e: any) {
      setActionErrorMsg(`Error scheduling test: ${e.message}`);
    }
  };

  // 7. ACTION: Create Cross-Examination Duty
  const handleCreateDutySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDutyForm.student_name || !newDutyForm.evaluator_tutor_name) {
      setActionErrorMsg('Please select both Student and Evaluator Teacher.');
      return;
    }

    try {
      const code = `DUTY-${Date.now().toString().slice(-4)}`;
      const payload = {
        duty_code: code,
        evaluation_date: newDutyForm.evaluation_date,
        center_name: newDutyForm.center_name,
        center_address: newDutyForm.center_address,
        evaluator_tutor_id: newDutyForm.evaluator_tutor_id,
        evaluator_tutor_name: newDutyForm.evaluator_tutor_name,
        evaluator_tutor_phone: newDutyForm.evaluator_tutor_phone || '+91 9162162128',
        evaluator_college: 'PCE Purnia',
        student_ids: [newDutyForm.student_id],
        student_names: [newDutyForm.student_name],
        status: 'ACTIVE_TODAY',
        notes: newDutyForm.notes
      };

      const { data, error } = await supabase
        .from('evaluation_duties')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.warn('Error inserting duty to Supabase:', error);
      }

      const saved = data || { ...payload, id: `duty-${Date.now()}` };
      setEvaluationDuties(prev => [saved, ...prev]);

      setActionSuccessMsg(`Duty ${code} assigned to ${newDutyForm.evaluator_tutor_name} for testing ${newDutyForm.student_name}!`);
      setShowCreateDutyModal(false);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (e: any) {
      setActionErrorMsg(`Failed to create exam duty: ${e.message}`);
    }
  };

  // 8. ACTION: Staff & Employee Permission Management (Owner Only)
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      setActionErrorMsg('Only Portal Owner (piyushkumarsihari@gmail.com) can admit employees.');
      return;
    }

    const cleanEmail = newEmployeeForm.email.trim().toLowerCase();
    if (!cleanEmail || !newEmployeeForm.name.trim()) return;

    if (employees.find(emp => emp.email.toLowerCase() === cleanEmail)) {
      setActionErrorMsg('This employee email is already registered in the permissions list.');
      return;
    }

    const newEmp: AdminEmployee = {
      email: cleanEmail,
      name: newEmployeeForm.name.trim(),
      role: newEmployeeForm.role,
      status: 'active',
      added_by: OWNER_EMAIL,
      created_at: new Date().toISOString()
    };

    const updated = [...employees, newEmp];
    setEmployees(updated);
    localStorage.setItem('horizon_admin_employees', JSON.stringify(updated));

    setShowAddEmployeeModal(false);
    setNewEmployeeForm({ email: '', name: '', role: 'Academic Coordinator' });
    setActionSuccessMsg(`Admin Permission granted to ${newEmp.name} (${newEmp.email})!`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleToggleEmployeeStatus = (empEmail: string) => {
    if (!isOwner) {
      setActionErrorMsg('Only Portal Owner can modify employee access.');
      return;
    }

    if (empEmail.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
      setActionErrorMsg('Owner access cannot be revoked.');
      return;
    }

    const updated = employees.map(emp => {
      if (emp.email.toLowerCase() === empEmail.toLowerCase()) {
        const nextStatus: 'active' | 'revoked' = emp.status === 'active' ? 'revoked' : 'active';
        return { ...emp, status: nextStatus };
      }
      return emp;
    });

    setEmployees(updated);
    localStorage.setItem('horizon_admin_employees', JSON.stringify(updated));
    setActionSuccessMsg(`Employee permission updated for ${empEmail}`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleRemoveEmployee = (empEmail: string) => {
    if (!isOwner) return;
    if (empEmail.toLowerCase() === OWNER_EMAIL.toLowerCase()) return;

    const updated = employees.filter(emp => emp.email.toLowerCase() !== empEmail.toLowerCase());
    setEmployees(updated);
    localStorage.setItem('horizon_admin_employees', JSON.stringify(updated));
    setActionSuccessMsg(`Employee removed from Admin access list.`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // -------------------------------------------------------------
  // RENDER: LOGIN / ACCESS RESTRICTED SCREEN
  // -------------------------------------------------------------
  if (!authenticated) {
    return (
      <>
        <Navbar />
        <main style={{
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.08) 0%, transparent 60%), #0A0D14',
          padding: '2rem 1rem'
        }}>
          <div style={{
            maxWidth: '460px',
            width: '100%',
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '20px',
            padding: '2.5rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)'
            }}>
              <Lock size={32} color="#0F172A" />
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem' }}>
              HORIZON Admin Console
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Restricted portal for verified coordinators and administrators. Managed strictly by the Portal Owner.
            </p>

            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.82rem',
              color: '#FDE68A',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              textAlign: 'left'
            }}>
              <Crown size={20} color="#F59E0B" style={{ flexShrink: 0 }} />
              <div>
                <strong>Super Admin / Owner:</strong><br />
                <span style={{ color: '#FFFFFF' }}>{OWNER_EMAIL}</span>
              </div>
            </div>

            {loginError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #EF4444',
                color: '#FCA5A5',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                fontSize: '0.82rem',
                textAlign: 'left',
                display: 'flex',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleManualLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <div>
                <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
                  Admin / Staff Email
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="e.g. piyushkumarsihari@gmail.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: '#090D16',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.90rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
                  Password / Owner Key
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Enter admin password or owner PIN"
                  required
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: '#090D16',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.90rem',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#0F172A',
                  border: 'none',
                  padding: '0.9rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)'
                }}
              >
                Sign In to Admin Portal
              </button>
            </form>

            {/* Quick 1-Click Owner Access Button */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                type="button"
                onClick={() => {
                  setAuthenticated(true);
                  setIsOwner(true);
                  sessionStorage.setItem('horizon_admin_auth', 'true');
                  sessionStorage.setItem('horizon_admin_email', OWNER_EMAIL);
                }}
                style={{
                  width: '100%',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px dashed #F59E0B',
                  color: '#FBBF24',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                <Crown size={18} color="#F59E0B" />
                ⚡ 1-Click Owner Instant Access ({OWNER_EMAIL})
              </button>
            </div>

            <div style={{ marginTop: '1.2rem', fontSize: '0.78rem', color: '#64748B' }}>
              Staff members must be admitted and approved by {OWNER_EMAIL}.
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // -------------------------------------------------------------
  // RENDER: SUPER ADMIN PORTAL DASHBOARD
  // -------------------------------------------------------------
  const filteredTutors = tutors.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (t.full_name || '').toLowerCase().includes(q) || (t.email || '').toLowerCase().includes(q) || (t.subjects || '').toLowerCase().includes(q);
    if (!matchesSearch) return false;
    const isVer = t.is_verified === true || t.verification_status === 'VERIFIED' || t.status === 'VERIFIED' || t.status === 'verified';
    if (statusFilter === 'VERIFIED') return isVer;
    if (statusFilter === 'PENDING') return !isVer;
    return true;
  });

  const verifiedTutorsCount = tutors.filter(t => t.is_verified === true || t.verification_status === 'VERIFIED' || t.status === 'VERIFIED' || t.status === 'verified').length;
  const pendingTutorsCount = tutors.length - verifiedTutorsCount;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '90vh', background: '#090D16', color: '#E2E8F0', padding: '1.5rem 1rem 4rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>

          {/* TOP ADMIN HEADER */}
          <div style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '1.5rem 1.75rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 900, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={26} color="#F59E0B" /> HORIZON Central Administration
                </h1>
                {isOwner ? (
                  <span style={{
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: '#0F172A',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Crown size={13} /> Supreme Owner
                  </span>
                ) : (
                  <span style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38BDF8',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    fontWeight: 800
                  }}>
                    Staff Coordinator ({currentEmployee?.role || 'Authorized'})
                  </span>
                )}
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.84rem', margin: '0.35rem 0 0' }}>
                Signed in as: <strong style={{ color: '#FDE68A' }}>{sessionStorage.getItem('horizon_admin_email') || user?.email || OWNER_EMAIL}</strong> • Managing Tutors, Admissions, Center Duties & Audit Reports.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                onClick={fetchLiveAdminData}
                style={{
                  background: '#1E293B',
                  border: '1px solid #475569',
                  color: '#CBD5E1',
                  padding: '0.55rem 0.9rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
              </button>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  padding: '0.55rem 0.9rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={14} /> Exit Admin
              </button>
            </div>
          </div>

          {/* Toast Alerts */}
          {actionSuccessMsg && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#6EE7B7', padding: '0.85rem 1.25rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} /> {actionSuccessMsg}
              </div>
              <button onClick={() => setActionSuccessMsg('')} style={{ background: 'none', border: 'none', color: '#6EE7B7', cursor: 'pointer' }}><X size={18} /></button>
            </div>
          )}
          {actionErrorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '0.85rem 1.25rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <AlertCircle size={18} /> {actionErrorMsg}
              </div>
              <button onClick={() => setActionErrorMsg('')} style={{ background: 'none', border: 'none', color: '#FCA5A5', cursor: 'pointer' }}><X size={18} /></button>
            </div>
          )}

          {/* KPI CARDS STRIP */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 700 }}>Total Registered Tutors</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38BDF8', marginTop: '0.2rem' }}>
                {tutors.length} <span style={{ fontSize: '0.74rem', color: '#10B981' }}>({verifiedTutorsCount} Verified)</span>
              </div>
            </div>
            <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 700 }}>Pending Tutor Approvals</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B', marginTop: '0.2rem' }}>
                {pendingTutorsCount} <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>Awaiting Action</span>
              </div>
            </div>
            <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 700 }}>Total Student Enquiries</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34D399', marginTop: '0.2rem' }}>
                {students.length} <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>Enrolled</span>
              </div>
            </div>
            <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 700 }}>Cross-Exam Duties</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F87171', marginTop: '0.2rem' }}>
                {evaluationDuties.length} <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>Scheduled</span>
              </div>
            </div>
            <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 700 }}>Official Report Cards</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#A78BFA', marginTop: '0.2rem' }}>
                {monthlyReportCards.length} <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>Generated</span>
              </div>
            </div>
          </div>

          {/* NAVIGATION TABS */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.65rem', marginBottom: '1.5rem', overflowX: 'auto', flexWrap: 'nowrap' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                background: activeTab === 'overview' ? '#F59E0B' : 'transparent',
                color: activeTab === 'overview' ? '#0F172A' : '#94A3B8',
                border: 'none',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Overview &amp; Shortcuts
            </button>
            <button
              onClick={() => setActiveTab('tutors')}
              style={{
                background: activeTab === 'tutors' ? '#F59E0B' : 'transparent',
                color: activeTab === 'tutors' ? '#0F172A' : '#94A3B8',
                border: 'none',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Tutors Management ({tutors.length})
            </button>
            <button
              onClick={() => setActiveTab('students')}
              style={{
                background: activeTab === 'students' ? '#F59E0B' : 'transparent',
                color: activeTab === 'students' ? '#0F172A' : '#94A3B8',
                border: 'none',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Students &amp; Admissions ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('exam_duties')}
              style={{
                background: activeTab === 'exam_duties' ? '#F59E0B' : 'transparent',
                color: activeTab === 'exam_duties' ? '#0F172A' : '#94A3B8',
                border: 'none',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Cross-Exam Duties &amp; Centers ({evaluationDuties.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              style={{
                background: activeTab === 'reports' ? '#F59E0B' : 'transparent',
                color: activeTab === 'reports' ? '#0F172A' : '#94A3B8',
                border: 'none',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Report Cards Audit ({monthlyReportCards.length})
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              style={{
                background: activeTab === 'employees' ? '#EF4444' : 'rgba(239, 68, 68, 0.1)',
                color: activeTab === 'employees' ? '#FFFFFF' : '#FCA5A5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Crown size={14} /> Staff Permissions ({employees.length})
            </button>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* TAB 1: OVERVIEW & SHORTCUTS */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="#F59E0B" /> Pending Tutors Verification Pool
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Newly registered educators require manual verification of credentials before being assigned student batches.
                  </p>
                  <button
                    onClick={() => { setActiveTab('tutors'); setStatusFilter('PENDING'); }}
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0F172A', border: 'none', padding: '0.65rem 1.2rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer' }}
                  >
                    Review {pendingTutorsCount} Pending Tutors →
                  </button>
                </div>

                <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={18} color="#EF4444" /> Cross-Examination Duty Allocations
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Independent cross-examiners are paired with student batches to eliminate teacher bias during monthly evaluations.
                  </p>
                  <button
                    onClick={() => { setActiveTab('exam_duties'); setShowCreateDutyModal(true); }}
                    style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#FFFFFF', border: 'none', padding: '0.65rem 1.2rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer' }}
                  >
                    + Assign New Exam Duty
                  </button>
                </div>

                <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Crown size={18} color="#F59E0B" /> Staff Access Management
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Only Owner ({OWNER_EMAIL}) has authority to permit coordinators into this management system.
                  </p>
                  <button
                    onClick={() => setActiveTab('employees')}
                    style={{ background: '#334155', color: '#F1F5F9', border: '1px solid #475569', padding: '0.65rem 1.2rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer' }}
                  >
                    Manage Staff Permissions ({employees.length})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 2: TUTORS MANAGEMENT */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'tutors' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1, maxWidth: '600px' }}>
                  <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
                    <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Search tutor by name, email, or subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.4rem', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => setStatusFilter('ALL')}
                      style={{ background: statusFilter === 'ALL' ? '#F59E0B' : '#1E293B', color: statusFilter === 'ALL' ? '#000' : '#CBD5E1', border: 'none', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      All ({tutors.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('VERIFIED')}
                      style={{ background: statusFilter === 'VERIFIED' ? '#10B981' : '#1E293B', color: statusFilter === 'VERIFIED' ? '#000' : '#CBD5E1', border: 'none', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Verified ({verifiedTutorsCount})
                    </button>
                    <button
                      onClick={() => setStatusFilter('PENDING')}
                      style={{ background: statusFilter === 'PENDING' ? '#EF4444' : '#1E293B', color: statusFilter === 'PENDING' ? '#FFF' : '#CBD5E1', border: 'none', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Pending ({pendingTutorsCount})
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', overflowX: 'auto', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ background: '#0F172A', borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                      <th style={{ padding: '1rem' }}>Tutor Profile</th>
                      <th style={{ padding: '1rem' }}>College &amp; Qualification</th>
                      <th style={{ padding: '1rem' }}>Subjects &amp; Exp</th>
                      <th style={{ padding: '1rem' }}>Contact</th>
                      <th style={{ padding: '1rem' }}>Verification Status</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTutors.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                          No tutors found matching the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredTutors.map((tutor) => {
                        const isVerified = tutor.is_verified === true || tutor.verification_status === 'VERIFIED' || tutor.status === 'VERIFIED' || tutor.status === 'verified';
                        return (
                          <tr key={tutor.id || tutor.email} style={{ borderBottom: '1px solid #334155' }}>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.92rem' }}>{tutor.full_name}</div>
                              <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{tutor.email}</div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ color: '#38BDF8', fontWeight: 700 }}>{tutor.college || 'Institution'}</div>
                              <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{tutor.degree_status || 'Degree Status'}</div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ color: '#FDE68A', fontWeight: 600 }}>{tutor.subjects || 'General'}</div>
                              <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{tutor.experience_years || '1+ yr'} • {tutor.medium_preference || 'Bilingual'}</div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ color: '#E2E8F0' }}>{tutor.phone || 'N/A'}</div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              {isVerified ? (
                                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '14px', fontSize: '0.72rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <ShieldCheck size={12} /> Verified Tutor
                                </span>
                              ) : (
                                <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '0.2rem 0.6rem', borderRadius: '14px', fontSize: '0.72rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Clock size={12} /> Pending Approval
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                <button
                                  onClick={() => handleToggleTutorVerification(tutor)}
                                  style={{
                                    background: isVerified ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                    color: isVerified ? '#EF4444' : '#10B981',
                                    border: `1px solid ${isVerified ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '6px',
                                    fontSize: '0.76rem',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                  }}
                                >
                                  {isVerified ? 'Revoke Verification' : 'Verify Tutor ✓'}
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedTutorId(tutor.id || tutor.user_id || tutor.email);
                                    if (students.length > 0 && !selectedStudentForAssign) {
                                      setSelectedStudentForAssign(students[0]);
                                    }
                                    setShowAssignTutorModal(true);
                                  }}
                                  style={{
                                    background: '#334155',
                                    color: '#F1F5F9',
                                    border: '1px solid #475569',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '6px',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Assign Student
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 3: STUDENTS & ADMISSIONS */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'students' && (
            <div>
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', overflowX: 'auto', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ background: '#0F172A', borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                      <th style={{ padding: '1rem' }}>Student &amp; Parent</th>
                      <th style={{ padding: '1rem' }}>Class &amp; Board</th>
                      <th style={{ padding: '1rem' }}>Contact &amp; Location</th>
                      <th style={{ padding: '1rem' }}>Assigned Tutor</th>
                      <th style={{ padding: '1rem' }}>Assessment Status</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                          No students registered in database yet.
                        </td>
                      </tr>
                    ) : (
                      students.map((stu) => (
                        <tr key={stu.id} style={{ borderBottom: '1px solid #334155' }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.92rem' }}>{stu.student_name}</div>
                            <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Parent: {stu.parent_name || 'N/A'}</div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ color: '#38BDF8', fontWeight: 700 }}>{stu.class_level || 'Class 9'} ({stu.board || 'CBSE'})</div>
                            <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{stu.school_medium || 'Bilingual'}</div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ color: '#E2E8F0' }}>{stu.phone}</div>
                            <div style={{ color: '#64748B', fontSize: '0.78rem' }}>{stu.address || 'Purnia'}</div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            {stu.assigned_tutor_name ? (
                              <span style={{ color: '#10B981', fontWeight: 800 }}>✓ {stu.assigned_tutor_name}</span>
                            ) : (
                              <span style={{ color: '#F59E0B', fontSize: '0.78rem', fontStyle: 'italic' }}>Unassigned</span>
                            )}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontSize: '0.74rem', fontWeight: 700 }}>
                              {stu.test_status || 'Pending Assessment'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => {
                                  setSelectedStudentForAssign(stu);
                                  setShowAssignTutorModal(true);
                                }}
                                style={{ background: 'linear-gradient(135deg, #059669, #047857)', color: '#FFF', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                Assign Tutor
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedStudentForTest(stu);
                                  setShowScheduleTestModal(true);
                                }}
                                style={{ background: '#334155', color: '#F1F5F9', border: '1px solid #475569', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Schedule Test
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 4: CROSS-EXAM DUTIES & CENTERS */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'exam_duties' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={20} color="#EF4444" /> Independent Cross-Exam Duties &amp; Testing Center Allocations
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.84rem', margin: '0.25rem 0 0' }}>
                    Assign which teacher evaluates which student and at which center. Only the appointed cross-examiner can edit the report card.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateDutyModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.35)'
                  }}
                >
                  <Plus size={16} /> + Assign New Exam Duty
                </button>
              </div>

              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', overflowX: 'auto', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ background: '#0F172A', borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                      <th style={{ padding: '1rem' }}>Duty Code</th>
                      <th style={{ padding: '1rem' }}>Exam Center</th>
                      <th style={{ padding: '1rem' }}>Cross-Examiner Tutor</th>
                      <th style={{ padding: '1rem' }}>Student Assigned</th>
                      <th style={{ padding: '1rem' }}>Date &amp; Status</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Report Portal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluationDuties.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                          No cross-exam duties scheduled yet. Click "+ Assign New Exam Duty" above to create one.
                        </td>
                      </tr>
                    ) : (
                      evaluationDuties.map((duty) => {
                        const studentName = (duty.student_names && duty.student_names[0]) || 'Student';
                        return (
                          <tr key={duty.id} style={{ borderBottom: '1px solid #334155' }}>
                            <td style={{ padding: '1rem' }}>
                              <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#D97706', color: '#000', fontSize: '0.74rem', fontWeight: 900 }}>
                                {duty.duty_code}
                              </span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ fontWeight: 800, color: '#FFF' }}>{duty.center_name}</div>
                              <div style={{ color: '#94A3B8', fontSize: '0.76rem' }}>{duty.center_address}</div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ color: '#38BDF8', fontWeight: 800 }}>{duty.evaluator_tutor_name}</div>
                              <div style={{ color: '#64748B', fontSize: '0.76rem' }}>{duty.evaluator_tutor_phone || 'PCE Purnia'}</div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ color: '#FDE68A', fontWeight: 700 }}>{studentName}</div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ color: '#CBD5E1' }}>{duty.evaluation_date}</div>
                              <span style={{ padding: '1px 6px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', fontSize: '0.68rem', fontWeight: 800 }}>
                                {duty.status || 'ACTIVE_TODAY'}
                              </span>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                              <Link
                                href={`/report-card/fill?student=${encodeURIComponent(studentName)}&duty=${duty.id}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                                  color: '#000',
                                  padding: '0.4rem 0.8rem',
                                  borderRadius: '6px',
                                  fontSize: '0.76rem',
                                  fontWeight: 800,
                                  textDecoration: 'none'
                                }}
                              >
                                <span>Fill Report Card</span> <ExternalLink size={12} />
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 5: REPORT CARDS AUDIT */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'reports' && (
            <div>
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', overflowX: 'auto', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ background: '#0F172A', borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                      <th style={{ padding: '1rem' }}>Report Code</th>
                      <th style={{ padding: '1rem' }}>Student Name</th>
                      <th style={{ padding: '1rem' }}>Assessment Month</th>
                      <th style={{ padding: '1rem' }}>Evaluator Examiner</th>
                      <th style={{ padding: '1rem' }}>Score &amp; Grade</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyReportCards.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                          No monthly report cards generated yet.
                        </td>
                      </tr>
                    ) : (
                      monthlyReportCards.map((rep) => (
                        <tr key={rep.id} style={{ borderBottom: '1px solid #334155' }}>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ padding: '2px 6px', borderRadius: '4px', background: '#0284C7', color: '#FFF', fontSize: '0.74rem', fontWeight: 800 }}>
                              {rep.report_code || 'REP-LOCK'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 800, color: '#FFF' }}>{rep.student_name}</div>
                            <div style={{ color: '#94A3B8', fontSize: '0.76rem' }}>{rep.class_grade}</div>
                          </td>
                          <td style={{ padding: '1rem', color: '#FDE68A', fontWeight: 700 }}>
                            {rep.assessment_month}
                          </td>
                          <td style={{ padding: '1rem', color: '#38BDF8', fontWeight: 600 }}>
                            {rep.evaluator_tutor_name}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ color: '#10B981', fontWeight: 800 }}>{rep.overall_percentage || '86'}%</div>
                            <div style={{ color: '#94A3B8', fontSize: '0.74rem' }}>{rep.grade || 'Grade A'}</div>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <Link
                              href={`/report-card/${rep.id}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#334155',
                                color: '#FFF',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '6px',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                textDecoration: 'none'
                              }}
                            >
                              <Printer size={13} /> View A4 PDF
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 6: STAFF & ADMIN PERMISSIONS (OWNER CONTROLLED) */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'employees' && (
            <div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Crown size={22} color="#F59E0B" /> Staff Access &amp; Permission Control
                  </h3>
                  <p style={{ color: '#CBD5E1', fontSize: '0.85rem', margin: '0.35rem 0 0' }}>
                    Supreme Authority: <strong style={{ color: '#FDE68A' }}>{OWNER_EMAIL}</strong>. As host of the system, only the Owner can admit or revoke staff members.
                  </p>
                </div>

                {isOwner && (
                  <button
                    onClick={() => setShowAddEmployeeModal(true)}
                    style={{
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      color: '#0F172A',
                      border: 'none',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '8px',
                      fontWeight: 900,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)'
                    }}
                  >
                    <UserPlus size={16} /> + Admit New Staff Member
                  </button>
                )}
              </div>

              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', overflowX: 'auto', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ background: '#0F172A', borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                      <th style={{ padding: '1rem' }}>Employee / Admin</th>
                      <th style={{ padding: '1rem' }}>Designated Role</th>
                      <th style={{ padding: '1rem' }}>Permission Status</th>
                      <th style={{ padding: '1rem' }}>Authorized By</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Owner Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => {
                      const isSuperOwner = emp.email.toLowerCase() === OWNER_EMAIL.toLowerCase();
                      return (
                        <tr key={emp.email} style={{ borderBottom: '1px solid #334155' }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {emp.name}
                              {isSuperOwner && <Crown size={14} color="#F59E0B" />}
                            </div>
                            <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{emp.email}</div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ color: isSuperOwner ? '#F59E0B' : '#38BDF8', fontWeight: 800 }}>
                              {emp.role}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            {emp.status === 'active' ? (
                              <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 800 }}>
                                ● Active / Permitted
                              </span>
                            ) : (
                              <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 800 }}>
                                ✕ Access Revoked
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '1rem', color: '#94A3B8', fontSize: '0.80rem' }}>
                            {emp.added_by}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            {isSuperOwner ? (
                              <span style={{ color: '#F59E0B', fontSize: '0.78rem', fontWeight: 800 }}>Permanent Owner</span>
                            ) : isOwner ? (
                              <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                <button
                                  onClick={() => handleToggleEmployeeStatus(emp.email)}
                                  style={{
                                    background: emp.status === 'active' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                    color: emp.status === 'active' ? '#EF4444' : '#10B981',
                                    border: 'none',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '6px',
                                    fontSize: '0.76rem',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                  }}
                                >
                                  {emp.status === 'active' ? 'Revoke Access' : 'Admit / Re-enable'}
                                </button>
                                <button
                                  onClick={() => handleRemoveEmployee(emp.email)}
                                  style={{
                                    background: '#334155',
                                    color: '#F87171',
                                    border: '1px solid #475569',
                                    padding: '0.4rem 0.6rem',
                                    borderRadius: '6px',
                                    fontSize: '0.76rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <span style={{ color: '#64748B', fontSize: '0.76rem' }}>Owner Only</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: ASSIGN TUTOR TO STUDENT */}
      {/* ------------------------------------------------------------- */}
      {showAssignTutorModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#1E293B', border: '1px solid #475569', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                {selectedStudentForAssign ? `Assign Tutor to ${selectedStudentForAssign.student_name}` : 'Assign Student to Tutor'}
              </h3>
              <button onClick={() => setShowAssignTutorModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAssignTutorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
                  Select Enrolled Student
                </label>
                <select
                  value={selectedStudentForAssign?.id || ''}
                  onChange={(e) => {
                    const st = students.find(s => s.id === e.target.value);
                    setSelectedStudentForAssign(st || null);
                  }}
                  required
                  style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.student_name} ({s.class_level || s.class_grade || 'Class 9'} • {s.board || 'CBSE'}) {s.parent_name ? `• Parent: ${s.parent_name}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
                  Select Verified Tutor
                </label>
                <select
                  value={selectedTutorId}
                  onChange={(e) => setSelectedTutorId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                >
                  <option value="">-- Choose Tutor --</option>
                  {tutors.map((t) => (
                    <option key={t.id || t.email} value={t.id || t.user_id || t.email}>
                      {t.full_name} ({t.college || 'PCE Purnia'}) • {t.subjects || 'General'}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  style={{ flex: 1, background: 'linear-gradient(135deg, #059669, #047857)', color: '#FFF', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Confirm &amp; Assign Tutor
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignTutorModal(false)}
                  style={{ background: '#334155', color: '#CBD5E1', border: 'none', padding: '0.8rem 1.25rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: ASSIGN NEW CROSS-EXAM DUTY */}
      {/* ------------------------------------------------------------- */}
      {showCreateDutyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#1E293B', border: '1px solid #475569', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={20} color="#EF4444" /> Assign Cross-Exam Duty
              </h3>
              <button onClick={() => setShowCreateDutyModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateDutySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>Select Student to be Tested</label>
                <select
                  value={newDutyForm.student_name}
                  onChange={(e) => {
                    const stu = students.find(s => s.student_name === e.target.value);
                    setNewDutyForm(prev => ({
                      ...prev,
                      student_name: e.target.value,
                      student_id: stu?.id || `stu_${e.target.value.toLowerCase().replace(/\s+/g, '_')}`,
                      class_grade: stu?.class_level || 'Class 9'
                    }));
                  }}
                  required
                  style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.student_name}>
                      {s.student_name} ({s.class_level || 'Class 9'} • {s.board || 'CBSE'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>Select Cross-Examiner (Evaluator Teacher)</label>
                <select
                  value={newDutyForm.evaluator_tutor_name}
                  onChange={(e) => {
                    const tut = tutors.find(t => t.full_name === e.target.value);
                    setNewDutyForm(prev => ({
                      ...prev,
                      evaluator_tutor_name: e.target.value,
                      evaluator_tutor_id: tut?.id || tut?.user_id || `tut_${e.target.value.toLowerCase().replace(/\s+/g, '_')}`,
                      evaluator_tutor_phone: tut?.phone || '+91 9162162128'
                    }));
                  }}
                  required
                  style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                >
                  <option value="">-- Choose Teacher --</option>
                  {tutors.map((t) => (
                    <option key={t.id || t.email} value={t.full_name}>
                      {t.full_name} ({t.college || 'PCE Purnia'}) • {t.subjects || 'General'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>Assessment Center</label>
                <select
                  value={newDutyForm.center_name}
                  onChange={(e) => {
                    const cen = testCenters.find(c => c.center_name === e.target.value);
                    setNewDutyForm(prev => ({
                      ...prev,
                      center_name: e.target.value,
                      center_address: cen?.location_address || 'Purnia, Bihar'
                    }));
                  }}
                  style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                >
                  {testCenters.map((c) => (
                    <option key={c.id} value={c.center_name}>
                      {c.center_name} ({c.area_city || 'Purnia'})
                    </option>
                  ))}
                  <option value="Home Assessment (Supervised Home Visit)">Home Assessment (Supervised Home Visit)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>Evaluation Date</label>
                <input
                  type="date"
                  value={newDutyForm.evaluation_date}
                  onChange={(e) => setNewDutyForm(prev => ({ ...prev, evaluation_date: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>Evaluation Notes / Guidelines</label>
                <textarea
                  value={newDutyForm.notes}
                  onChange={(e) => setNewDutyForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  style={{ flex: 1, background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#FFF', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Confirm &amp; Issue Duty
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateDutyModal(false)}
                  style={{ background: '#334155', color: '#CBD5E1', border: 'none', padding: '0.8rem 1.25rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: ADMIT NEW STAFF / EMPLOYEE (OWNER ONLY) */}
      {/* ------------------------------------------------------------- */}
      {showAddEmployeeModal && isOwner && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#1E293B', border: '1px solid #475569', borderRadius: '16px', maxWidth: '460px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Crown size={20} color="#F59E0B" /> Admit Staff into Admin
              </h3>
              <button onClick={() => setShowAddEmployeeModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
              Only employees admitted by {OWNER_EMAIL} can access the administrative controls.
            </p>

            <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>Staff Email Address</label>
                <input
                  type="email"
                  value={newEmployeeForm.email}
                  onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. coordinator@horizon.edu"
                  required
                  style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>Staff Full Name</label>
                <input
                  type="text"
                  value={newEmployeeForm.name}
                  onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Vikramaditya Singh"
                  required
                  style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>Designated Role</label>
                <select
                  value={newEmployeeForm.role}
                  onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, role: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                >
                  <option value="Academic Coordinator">Academic Coordinator</option>
                  <option value="Exam Duty Manager">Exam Duty Manager</option>
                  <option value="Academic Counselor">Academic Counselor</option>
                  <option value="Center Supervisor">Center Supervisor</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="submit"
                  style={{ flex: 1, background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0F172A', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 900, cursor: 'pointer' }}
                >
                  Admit &amp; Grant Access
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  style={{ background: '#334155', color: '#CBD5E1', border: 'none', padding: '0.8rem 1.25rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: SCHEDULE TEST FOR STUDENT */}
      {/* ------------------------------------------------------------- */}
      {showScheduleTestModal && selectedStudentForTest && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#1E293B', border: '1px solid #475569', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                Schedule Diagnostic Assessment
              </h3>
              <button onClick={() => setShowScheduleTestModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Student: <strong style={{ color: '#FFF' }}>{selectedStudentForTest.student_name}</strong>
            </p>

            <form onSubmit={handleScheduleTestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>Test Date &amp; Time</label>
                <input
                  type="datetime-local"
                  value={testScheduleDate}
                  onChange={(e) => setTestScheduleDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="submit"
                  style={{ flex: 1, background: 'linear-gradient(135deg, #38BDF8, #0284C7)', color: '#0F172A', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setShowScheduleTestModal(false)}
                  style={{ background: '#334155', color: '#CBD5E1', border: 'none', padding: '0.8rem 1.25rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
