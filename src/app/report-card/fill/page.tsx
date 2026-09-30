'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ReportCardInteractiveEditor from '@/components/ReportCardInteractiveEditor';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase, MonthlyReportCard, EvaluationDuty } from '@/lib/supabase';
import { ShieldAlert, ArrowLeft, Lock, Clock } from 'lucide-react';

const OWNER_EMAIL = 'piyushkumarsihari@gmail.com';

function FillReportCardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const studentName = searchParams.get('student') || searchParams.get('studentName') || undefined;
  const classGrade = searchParams.get('classGrade') || undefined;
  const tutorName = searchParams.get('tutorName') || undefined;
  const dutyId = searchParams.get('duty') || searchParams.get('dutyId') || undefined;
  const centerName = searchParams.get('centerName') || undefined;

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authErrorReason, setAuthErrorReason] = useState('');
  const [loadedReport, setLoadedReport] = useState<Partial<MonthlyReportCard> | null>(null);

  useEffect(() => {
    async function verifyAndLoad() {
      setCheckingAuth(true);

      const targetStudent = studentName || 'Aarav Sharma';
      const userEmail = (user?.email || '').toLowerCase().trim();
      const userName = (user?.name || '').toLowerCase().trim();
      const userId = user?.id || '';

      // 1. Check if user is Super Admin / Owner
      if (userEmail === OWNER_EMAIL.toLowerCase()) {
        setIsAuthorized(true);
      } else {
        // Check if user is an approved admin employee
        let isStaffAdmin = false;
        try {
          const cached = localStorage.getItem('horizon_admin_employees');
          if (cached) {
            const employees = JSON.parse(cached);
            if (employees.find((e: any) => e.email.toLowerCase() === userEmail && e.status === 'active')) {
              isStaffAdmin = true;
            }
          }
        } catch (e) {}

        if (isStaffAdmin) {
          setIsAuthorized(true);
        } else {
          // 2. Strict Cross-Examiner / Assigned Tutor Verification
          let hasPermission = false;
          try {
            // Check evaluation_duties
            const { data: duties } = await supabase
              .from('evaluation_duties')
              .select('*');

            if (duties && duties.length > 0) {
              const matchedDuty = duties.find((d: any) => {
                const dutyTeacherMatches = (userId && d.evaluator_tutor_id === userId) ||
                  (userEmail && d.evaluator_tutor_email === userEmail) ||
                  (userName && (d.evaluator_tutor_name || '').toLowerCase().includes(userName));

                const dutyStudentMatches = (d.student_names && d.student_names.some((s: string) => s.toLowerCase().includes(targetStudent.toLowerCase()))) ||
                  (d.student_name && d.student_name.toLowerCase().includes(targetStudent.toLowerCase()));

                if (dutyId && d.id === dutyId && dutyTeacherMatches) return true;
                return dutyTeacherMatches && dutyStudentMatches;
              });

              if (matchedDuty) {
                hasPermission = true;
              }
            }

            // Also check student_assignments or student_enquiries
            if (!hasPermission) {
              const { data: assigns } = await supabase
                .from('student_assignments')
                .select('*')
                .ilike('student_name', `%${targetStudent.split(' ')[0]}%`);

              if (assigns && assigns.length > 0) {
                const matchedAssign = assigns.find((a: any) => {
                  return (userId && a.tutor_id === userId) ||
                    (userEmail && a.tutor_email === userEmail) ||
                    (userName && (a.tutor_name || '').toLowerCase().includes(userName));
                });
                if (matchedAssign) hasPermission = true;
              }
            }

            // Demo user fallback
            if (!hasPermission && user?.isDemo) {
              hasPermission = true;
            }
          } catch (err) {
            console.warn('Duty check error:', err);
          }

          if (hasPermission) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            setAuthErrorReason(`Only the assigned cross-examiner or teaching faculty for ${targetStudent} is authorized to fill this official progress report.`);
          }
        }
      }

      // 3. Load Existing Report Card data if exists
      let existing: any = null;
      try {
        const firstName = targetStudent.split(' ')[0].toLowerCase();
        const { data } = await supabase
          .from('monthly_report_cards')
          .select('*')
          .ilike('student_name', `%${firstName}%`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) existing = data;
      } catch (err) {
        console.warn('Error fetching existing report from DB:', err);
      }

      if (!existing && typeof window !== 'undefined') {
        try {
          const studentSlug = targetStudent.toLowerCase().replace(/\s+/g, '_');
          const localStr = localStorage.getItem(`horizon_report_latest_${studentSlug}`) || localStorage.getItem('horizon_report_latest');
          if (localStr) existing = JSON.parse(localStr);
        } catch (e) {}
      }

      const merged = {
        ...(existing || {}),
        ...(studentName ? { student_name: studentName } : {}),
        ...(classGrade ? { class_grade: classGrade } : {}),
        ...(tutorName ? { assigned_tutor_name: tutorName } : {}),
        ...(centerName ? { test_center_name: centerName } : {}),
        evaluator_tutor_name: user?.name || (user?.profileData?.full_name) || existing?.evaluator_tutor_name || 'Assigned Evaluator'
      };

      setLoadedReport(merged);
      setCheckingAuth(false);
    }

    verifyAndLoad();
  }, [studentName, classGrade, tutorName, dutyId, centerName, user]);

  if (checkingAuth) {
    return (
      <div style={{ color: '#FFF', textAlign: 'center', padding: '5rem', fontSize: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <Clock size={32} color="#F59E0B" className="spin" />
        <span>Verifying Teacher-Student Examination Authority...</span>
      </div>
    );
  }

  // Permission Denied View
  if (!isAuthorized) {
    return (
      <div style={{ maxWidth: '580px', margin: '4rem auto', background: '#1E293B', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center', color: '#FFF', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <ShieldAlert size={34} color="#EF4444" />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          Restricted Assessment Portal
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {authErrorReason || 'You do not have active cross-examination duty or teaching assignment for this student.'}
        </p>
        <div style={{ background: '#0F172A', borderRadius: '10px', padding: '1rem', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '1.5rem', textAlign: 'left' }}>
          <div>Current Teacher Account: <strong>{user?.name || user?.email || 'Guest Tutor'}</strong></div>
          <div style={{ marginTop: '0.35rem', color: '#F59E0B' }}>Anti-Bias Rule: Cross-exam duties must be scheduled by HORIZON Admin ({OWNER_EMAIL}) before grading.</div>
        </div>
        <Link
          href="/tutor-dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: '#0F172A',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: '0.88rem'
          }}
        >
          <ArrowLeft size={16} /> Return to Tutor Dashboard
        </Link>
      </div>
    );
  }

  const initialReport = loadedReport || {
    ...(studentName ? { student_name: studentName } : {}),
    ...(classGrade ? { class_grade: classGrade } : {}),
    ...(tutorName ? { assigned_tutor_name: tutorName } : {}),
    ...(centerName ? { test_center_name: centerName } : {})
  };

  return (
    <ReportCardInteractiveEditor
      initialReport={initialReport}
      dutyId={dutyId}
      backUrl="/tutor-dashboard"
    />
  );
}

export default function FillReportCardPage() {
  return (
    <>
      <div className="no-print">
        <Navbar />
      </div>

      <main style={{ minHeight: '90vh', background: '#0B0F19' }}>
        <Suspense fallback={
          <div style={{ color: '#FFF', textAlign: 'center', padding: '5rem' }}>
            Loading Interactive Live Report Card...
          </div>
        }>
          <FillReportCardContent />
        </Suspense>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </>
  );
}
