'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase, TutorProfile } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  LogOut,
  Sparkles,
  AlertCircle,
  X,
  Languages,
  BookMarked
} from 'lucide-react';

export default function TutorDashboard() {
  const { user, role, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // Tutor Profile State
  const [tutorProfile, setTutorProfile] = useState<any>({
    full_name: '',
    college: '',
    degree_status: '',
    experience_years: '',
    medium_preference: '',
    languages: 'Hindi, English',
    subjects: '',
    classes_handled: 'Class 8 to 10',
    bio_and_custom_notes: '',
    phone: '',
    email: '',
    rating: 4.9
  });

  // Edit Form Fields (Used inside Edit Modal)
  const [editForm, setEditForm] = useState<any>({
    full_name: '',
    college: '',
    degree_status: '',
    experience_years: '',
    medium_preference: 'Hindi medium only',
    subjects: '',
    phone: '',
    email: '',
    bio_and_custom_notes: ''
  });

  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportData, setReportData] = useState({
    student_name: 'Aaryan Sharma',
    report_month: 'October 2026',
    attendance_pct: 98,
    classes_conducted: 12,
    rating: 9.5,
    syllabus: 'Quadratic Equations, Work & Energy, Gravitation',
    remarks: 'Consistent weekly improvement. Demonstrating high grasping power and conceptual clarity.'
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load Tutor Profile & Assigned Students
  useEffect(() => {
    async function loadTutorData() {
      if (!user) return;
      setLoading(true);
      try {
        let loadedProfile: any = null;

        // 1. Try to find the tutor's record matching their user id or email
        const { data: tData } = await supabase
          .from('tutor_profiles')
          .select('*')
          .or(`user_id.eq.${user.id},id.eq.${user.id},email.eq.${user.email}`)
          .maybeSingle();

        if (tData) {
          loadedProfile = tData;
        } else if (user.isDemo) {
          // Demo fallback
          loadedProfile = {
            full_name: 'Harshit Patel',
            college: 'PCE PURNIA',
            degree_status: 'B.Tech/BS: 3rd sem with 7.2 CGPA',
            experience_years: '3+ years teaching experience',
            medium_preference: 'Hindi medium only',
            languages: 'Hindi, English, Maithili',
            subjects: 'Mathematics, Science, Foundation Physics',
            classes_handled: 'Class 8 to 10',
            bio_and_custom_notes: 'Dedicated home tutor from PCE Purnia. Specialized in CBSE and Bihar State Board Hindi-medium students with rigorous weekly mock tests and personalized doubt resolution.',
            phone: '+91 98765 43210',
            email: 'harshit.patel@horizon.edu',
            rating: 4.9
          };
        } else {
          // Newly registered real user
          const meta = user.profileData || {};
          loadedProfile = {
            full_name: user.name || '',
            college: meta.college || '',
            degree_status: meta.degree_status || '',
            experience_years: meta.experience_years || '',
            medium_preference: meta.medium_preference || 'Hindi medium only',
            languages: 'Hindi, English',
            subjects: meta.subjects || '',
            classes_handled: 'Class 8 to 10',
            bio_and_custom_notes: meta.bio || '',
            phone: user.phone || meta.phone || '',
            email: user.email || '',
            rating: 5.0
          };
        }

        setTutorProfile(loadedProfile);
        setEditForm(loadedProfile);

        // Fetch assigned students
        const { data: sData } = await supabase
          .from('student_enquiries')
          .select('*')
          .limit(5);

        if (sData && sData.length > 0) {
          setAssignedStudents(sData);
        } else {
          setAssignedStudents([
            {
              id: 'stud-1',
              student_name: 'Aaryan Sharma',
              parent_name: 'Ramesh Sharma',
              phone: '+91 98111 22334',
              class_level: 'Class 9 (CBSE)',
              school_medium: 'Hindi Medium',
              address: 'Line Bazar, Purnia',
              fee_status: 'PAID'
            }
          ]);
        }
      } catch (err) {
        console.error('Error loading tutor data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTutorData();
  }, [user]);

  // Save / Update profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const updatedProfile = {
        ...tutorProfile,
        ...editForm,
        updated_at: new Date().toISOString()
      };

      if (user?.id) {
        await supabase
          .from('tutor_profiles')
          .upsert({
            id: user.id,
            user_id: user.id,
            full_name: editForm.full_name,
            college: editForm.college,
            degree_status: editForm.degree_status,
            experience_years: editForm.experience_years,
            medium_preference: editForm.medium_preference,
            subjects: editForm.subjects,
            bio_and_custom_notes: editForm.bio_and_custom_notes,
            phone: editForm.phone,
            email: editForm.email,
            updated_at: new Date().toISOString()
          });
      }

      setTutorProfile(updatedProfile);
      setShowEditModal(false);
      setSuccessMsg('Profile details updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg('Failed to save changes. ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Submit Monthly Report for Student
  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReport(true);
    try {
      await supabase.from('monthly_reports').insert([{
        student_id: '22222222-2222-4222-8222-222222222222',
        report_month: reportData.report_month,
        total_classes_scheduled: 12,
        total_classes_conducted: reportData.classes_conducted,
        student_attendance_percentage: reportData.attendance_pct,
        academic_progress_rating: reportData.rating,
        syllabus_covered: reportData.syllabus,
        tutor_remarks: reportData.remarks
      }]);

      setShowReportModal(false);
      setSuccessMsg('Monthly progress report submitted successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setShowReportModal(false);
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '90vh', background: 'var(--bg-primary)', padding: '2.5rem 1rem 5rem' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          {/* Top Executive Header */}
          <div style={{
            background: 'linear-gradient(135deg, #065f46, #059669)',
            borderRadius: '20px',
            padding: '2.2rem 2.4rem',
            color: '#ffffff',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 10px 30px rgba(5, 150, 105, 0.2)'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.18)',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '0.6rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                <BookOpen size={14} /> Official Tutor Workspace
              </div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.3rem)', fontWeight: 800, margin: 0 }}>
                {tutorProfile.full_name || 'Tutor Portal'}
              </h1>
              <p style={{ margin: '6px 0 0', opacity: 0.9, fontSize: '0.95rem' }}>
                {tutorProfile.college ? `${tutorProfile.college} • ` : ''}
                {tutorProfile.degree_status ? `${tutorProfile.degree_status} • ` : ''}
                Verified Home Tutor
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setEditForm(tutorProfile);
                  setShowEditModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={15} /> Edit Details
              </button>

              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  color: '#065f46',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                }}
              >
                <FileSpreadsheet size={16} /> Submit Monthly Report
              </button>

              <button
                type="button"
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
          {successMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#059669',
              fontWeight: 600,
              fontSize: '0.92rem',
              marginBottom: '1.5rem'
            }}>
              <CheckCircle2 size={18} /> {successMsg}
            </div>
          )}

          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#dc2626',
              fontWeight: 600,
              fontSize: '0.92rem',
              marginBottom: '1.5rem'
            }}>
              <AlertCircle size={18} /> {errorMsg}
            </div>
          )}

          {/* KPI Metrics Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(5, 150, 105, 0.1)',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Assigned Students</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {assignedStudents.length} Active
                </div>
              </div>
            </div>

            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.1)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Star size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Academic Rating</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {tutorProfile.rating || '4.9'} <span style={{ fontSize: '0.85rem', color: '#f59e0b' }}>★</span>
                </div>
              </div>
            </div>

            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(37, 99, 235, 0.1)',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Languages size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Medium Preference</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {tutorProfile.medium_preference || 'Hindi Medium'}
                </div>
              </div>
            </div>

            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Verification Status</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669' }}>
                  Verified Tutor
                </div>
              </div>
            </div>
          </div>

          {/* Tutor Dossier Card (Clean, Professional Full-Width Presentation) */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '18px',
            padding: '2rem',
            marginBottom: '2.5rem',
            boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
              paddingBottom: '1.2rem',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 800
                }}>
                  {tutorProfile.full_name?.charAt(0) || 'T'}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                    {tutorProfile.full_name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#059669',
                      background: 'rgba(5, 150, 105, 0.1)',
                      padding: '3px 10px',
                      borderRadius: '999px'
                    }}>
                      <ShieldCheck size={14} /> Verified Tutor • Background Checked
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Code: HZN-1024
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditForm(tutorProfile);
                  setShowEditModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={15} /> Edit Profile Info
              </button>
            </div>

            {/* Grid of details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Institution / College
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {tutorProfile.college || '—'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Degree & Performance
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2563eb' }}>
                  {tutorProfile.degree_status || '—'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Teaching Experience
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#059669' }}>
                  {tutorProfile.experience_years || '—'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Teaching Medium Comfort
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#d97706' }}>
                  {tutorProfile.medium_preference || '—'}
                </div>
              </div>
            </div>

            {tutorProfile.subjects && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Primary Subjects & Handled Classes
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {Array.isArray(tutorProfile.subjects) ? tutorProfile.subjects.join(', ') : tutorProfile.subjects}
                </div>
              </div>
            )}

            {tutorProfile.bio_and_custom_notes && (
              <div style={{
                background: 'var(--bg-primary)',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Teaching Methodology & Bio
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  "{tutorProfile.bio_and_custom_notes}"
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <span>Phone: <strong style={{ color: 'var(--text-primary)' }}>{tutorProfile.phone || '—'}</strong></span>
              <span>Email: <strong style={{ color: 'var(--text-primary)' }}>{tutorProfile.email || '—'}</strong></span>
              <span>Available Days: <strong style={{ color: 'var(--text-primary)' }}>Monday to Saturday</strong></span>
            </div>
          </div>

          {/* Assigned Students Roster */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Assigned Students Roster
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Home tuition learners currently mapped to your teaching profile:
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {assignedStudents.map((stud, idx) => (
                <div
                  key={stud.id || idx}
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.2rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(37, 99, 235, 0.08)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 800
                    }}>
                      {stud.student_name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 3px' }}>
                        {stud.student_name}
                      </h3>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span>{stud.class_level || 'Class 9'}</span>
                        <span>•</span>
                        <span>{stud.school_medium || 'Hindi Medium'}</span>
                        <span>•</span>
                        <span>Parent: {stud.parent_name || 'Guardian'}</span>
                        <span>•</span>
                        <span>Locality: {stud.address || 'Purnia'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setReportData(prev => ({ ...prev, student_name: stud.student_name }));
                        setShowReportModal(true);
                      }}
                      style={{
                        padding: '9px 15px',
                        borderRadius: '8px',
                        background: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <FileSpreadsheet size={15} /> Submit Report
                    </button>

                    <a
                      href={`tel:${stud.phone || '+919811122334'}`}
                      style={{
                        padding: '9px 14px',
                        borderRadius: '8px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Phone size={14} /> Call Parent
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '620px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} color="#059669" /> Edit Profile Details
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harshit Patel"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    College / Institution
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PCE PURNIA"
                    value={editForm.college}
                    onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                    className="form-input"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Degree & CGPA
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech 3rd sem (7.2 CGPA)"
                    value={editForm.degree_status}
                    onChange={(e) => setEditForm({ ...editForm, degree_status: e.target.value })}
                    className="form-input"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Teaching Experience
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3+ years experience"
                    value={editForm.experience_years}
                    onChange={(e) => setEditForm({ ...editForm, experience_years: e.target.value })}
                    className="form-input"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Medium Preference
                  </label>
                  <select
                    value={editForm.medium_preference}
                    onChange={(e) => setEditForm({ ...editForm, medium_preference: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Hindi medium only">Hindi medium only</option>
                    <option value="English medium only">English medium only</option>
                    <option value="Bilingual (Hindi + English)">Bilingual (Hindi + English)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Primary Subjects Handled
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics, Science"
                  value={editForm.subjects}
                  onChange={(e) => setEditForm({ ...editForm, subjects: e.target.value })}
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Bio & Custom Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your teaching approach..."
                  value={editForm.bio_and_custom_notes}
                  onChange={(e) => setEditForm({ ...editForm, bio_and_custom_notes: e.target.value })}
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: 'none',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Report Modal */}
      {showReportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '560px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Monthly Academic Progress Report
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Student: {reportData.student_name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Report Month
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. October 2026"
                    value={reportData.report_month}
                    onChange={(e) => setReportData({ ...reportData, report_month: e.target.value })}
                    className="form-input"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Classes Conducted (out of 12)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={reportData.classes_conducted}
                    onChange={(e) => setReportData({ ...reportData, classes_conducted: Number(e.target.value) })}
                    className="form-input"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Syllabus Covered & Chapters Completed
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quadratic Equations, Work & Energy"
                  value={reportData.syllabus}
                  onChange={(e) => setReportData({ ...reportData, syllabus: e.target.value })}
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Educator Observations & Next Focus
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter specific progress observations, areas for improvement, and test feedback..."
                  value={reportData.remarks}
                  onChange={(e) => setReportData({ ...reportData, remarks: e.target.value })}
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: 'none',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: submittingReport ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submittingReport ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .form-input::placeholder {
          color: var(--text-tertiary, #94a3b8) !important;
          opacity: 0.75 !important;
        }
      `}</style>

      <Footer />
    </>
  );
}
