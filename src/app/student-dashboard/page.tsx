'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase, StudentEnquiry, MonthlyReport, TutorProfile } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  User,
  BookOpen,
  Award,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Sparkles,
  RefreshCw,
  Star
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, role, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [enquiry, setEnquiry] = useState<any>(null);
  const [tutor, setTutor] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReportIndex, setSelectedReportIndex] = useState(0);

  // Redirect if not logged in or wrong role
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load student data from Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Fetch student enquiry matching logged-in user
        let enquiryData = null;
        if (user?.id) {
          const { data } = await supabase
            .from('student_enquiries')
            .select('*')
            .or(`student_id.eq.${user.id},email.eq.${user.email}`)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          enquiryData = data;
        }

        if (!enquiryData && !user?.isDemo && user?.email) {
          // If real user registered, use their user metadata
          const meta = user.profileData || {};
          enquiryData = {
            id: user.id,
            student_name: user.name,
            parent_name: meta.parent_name || 'Parent / Guardian',
            phone: user.phone || meta.phone || '',
            email: user.email,
            class_level: meta.class_level || 'Class 9',
            board: meta.board || 'CBSE',
            school_medium: meta.school_medium || 'Hindi Medium',
            address: meta.address || 'Purnia',
            enquiry_date: new Date().toISOString(),
            test_scheduled_date: new Date(Date.now() + 2 * 86400000).toISOString(),
            test_status: 'Assessment Scheduled',
            test_score: 'Evaluation in progress',
            test_remarks: 'Baseline diagnostic assessment is scheduled with our academic counselor.',
            fee_status: 'pending',
            fee_amount: 4500
          };
        }

        // Fetch assigned teacher
        const { data: tutorData } = await supabase
          .from('tutor_profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Fetch monthly reports
        const { data: reportsData } = await supabase
          .from('monthly_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (enquiryData) {
          setEnquiry(enquiryData);
        } else {
          // Default seeded fallback data
          setEnquiry({
            id: 'demo-enq-1',
            student_name: 'Aaryan Sharma',
            parent_name: 'Ramesh Sharma',
            phone: '+91 98111 22334',
            email: 'ramesh.sharma@gmail.com',
            class_level: 'Class 9',
            board: 'CBSE',
            school_medium: 'Hindi Medium',
            address: 'Line Bazar, Near Medical College, Purnia',
            enquiry_date: '2026-08-20T10:30:00Z',
            test_scheduled_date: '2026-08-23T16:00:00Z',
            test_status: 'Completed (Passed)',
            test_score: '88%',
            test_remarks: 'Demonstrated high aptitude in arithmetic & science concepts; recommended weekly mock tests.',
            fee_status: 'PAID',
            fee_amount: 4500,
            fee_paid_date: '2026-09-05T14:20:00Z'
          });
        }

        if (tutorData) {
          setTutor(tutorData);
        } else {
          setTutor({
            id: 'demo-tutor-1',
            full_name: 'Harshit Patel',
            college: 'PCE PURNIA',
            degree_status: 'B.Tech/BS: 3rd sem with 7.2 CGPA',
            experience_years: '3+ years teaching experience',
            medium_preference: 'Hindi medium only',
            languages: 'Hindi, Maithili, English',
            subjects: ['Mathematics', 'Science', 'Foundation Physics'],
            classes_handled: 'Class 8 to 10',
            bio_and_custom_notes: 'Dedicated educator from PCE Purnia specialized in Hindi-medium CBSE/State Board learners.',
            rating: 4.9,
            phone: '+91 98765 43210',
            email: 'harshit.patel@horizon.edu'
          });
        }

        if (reportsData && reportsData.length > 0) {
          setReports(reportsData);
        } else {
          setReports([
            {
              id: 'rep-2',
              report_month: 'September 2026',
              student_attendance_percentage: 96,
              total_classes_conducted: 12,
              academic_progress_rating: 9.3,
              punctuality_rating: 9.5,
              understanding_rating: 9.2,
              syllabus_covered: 'Linear Equations in Two Variables, Coordinate Geometry, Gravitation & Work Energy',
              topics_completed: ['Graphing Linear Equations', 'Cartesian Coordinates', 'Universal Law of Gravitation', 'Kinetic Energy'],
              test_scores: [{ test: 'Midterm Prep Test 1', score: '91%' }, { test: 'Physics Numerical Quiz', score: '87%' }],
              tutor_remarks: 'Remarkable jump in test scores! Aaryan scored top marks in the batch quiz and has strong confidence for upcoming school midterms.',
              monthly_fee: 4500,
              fee_paid: true,
              fee_paid_date: '2026-09-05T14:20:00Z'
            },
            {
              id: 'rep-1',
              report_month: 'August 2026',
              student_attendance_percentage: 92,
              total_classes_conducted: 12,
              academic_progress_rating: 8.5,
              punctuality_rating: 9.0,
              understanding_rating: 8.5,
              syllabus_covered: 'Number Systems, Polynomials, Motion & Laws of Motion (Physics)',
              topics_completed: ['Real Numbers', 'Remainder Theorem', 'Speed vs Velocity', 'Newton 3 Laws'],
              test_scores: [{ test: 'Diagnostic Assessment', score: '88%' }, { test: 'August Unit Test', score: '82%' }],
              tutor_remarks: 'Aaryan is very hardworking. He solved 40 extra algebra problems on his own this month. Keep it up!',
              monthly_fee: 4500,
              fee_paid: true,
              fee_paid_date: '2026-08-05T11:00:00Z'
            }
          ]);
        }
      } catch (e) {
        console.error('Error loading student dashboard:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Pending / Not Scheduled';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const activeReport = reports[selectedReportIndex] || reports[0];

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '90vh',
        background: 'radial-gradient(circle at 85% 15%, rgba(245, 158, 11, 0.08) 0%, transparent 45%), radial-gradient(circle at 15% 75%, rgba(59, 130, 246, 0.07) 0%, transparent 50%), var(--bg-main)',
        padding: '2rem 1rem 5rem',
        color: 'var(--text-primary)',
        transition: 'background 0.3s ease'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Top Banner / Welcome (Landing Page Luxury Aesthetic) */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(20, 22, 27, 0.96) 0%, rgba(26, 29, 36, 0.92) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '20px',
            padding: '2.2rem 2.4rem',
            color: 'var(--text-primary)',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45), 0 0 40px rgba(245, 158, 11, 0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-40%',
              right: '-10%',
              width: '320px',
              height: '320px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '5px 14px',
                borderRadius: '30px',
                background: 'var(--accent-gold-light)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: 'var(--accent-gold)',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}>
                <Sparkles size={14} color="#F59E0B" /> Student & Parent Learning Portal
              </div>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
                fontWeight: 800,
                margin: 0,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em'
              }}>
                Welcome, {enquiry?.student_name || 'Student'}!
              </h1>
              <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Parent: <strong style={{ color: 'var(--text-primary)' }}>{enquiry?.parent_name || 'Parent'}</strong> • {enquiry?.class_level} ({enquiry?.board} - {enquiry?.school_medium})
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 2 }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-highlight)',
                padding: '10px 18px',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                textAlign: 'right'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Fee Status</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={16} /> {enquiry?.fee_status || 'PAID'} (₹{enquiry?.fee_amount || 4500})
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#F87171',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
                title="Logout"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Key Timeline Indicators: Enquiry, Test, Fee */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.2rem',
            marginBottom: '2rem'
          }}>
            {/* Card 1: Kab Enquiry Ki Thi */}
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.4rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(37, 99, 235, 0.1)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                    1. Enquiry Date (पूछताछ तिथि)
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatDate(enquiry?.enquiry_date)}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Enquiry was submitted online for {enquiry?.class_level} ({enquiry?.board}) home tuition.
              </p>
            </div>

            {/* Card 2: Kab Test Schedule Kiya Gaya Tha */}
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.4rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                    2. Diagnostic Test Schedule
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatDate(enquiry?.test_scheduled_date)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Test Status:</span>
                <span style={{ fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  {enquiry?.test_status || 'Completed'} (Score: {enquiry?.test_score || '88%'})
                </span>
              </div>
            </div>

            {/* Card 3: Fee Kab Paid Hua Tha */}
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.4rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(124, 58, 237, 0.1)',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                    3. Fee Payment Status (फीस विवरण)
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Paid on {formatDate(enquiry?.fee_paid_date)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Amount: ₹{enquiry?.fee_amount || 4500} / mo</span>
                <span style={{ fontWeight: 700, color: '#059669', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  Receipt #HZN-9412
                </span>
              </div>
            </div>
          </div>

          {/* Grid Layout: Assigned Teacher (Left) + Monthly Reports (Right) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '2rem'
          }}>
            
            {/* Column 1: Assigned Teacher Card (Clean & Compact with View Full Profile) */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={20} style={{ color: 'var(--primary)' }} /> Assigned Home Tutor
                </h2>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={14} /> Verified Faculty
                </span>
              </div>

              {tutor && (
                <div style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '18px',
                  padding: '1.6rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {tutor.full_name?.charAt(0) || 'H'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 3px' }}>
                        {tutor.full_name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', flexWrap: 'wrap' }}>
                        <span style={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Star size={14} fill="#f59e0b" /> {tutor.rating || 4.9} / 5.0
                        </span>
                        <span style={{ color: 'var(--text-secondary)' }}>•</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{tutor.college || 'PCE Purnia'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    padding: '10px 14px',
                    background: 'rgba(37, 99, 235, 0.05)',
                    border: '1px solid rgba(37, 99, 235, 0.12)',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.76rem', textTransform: 'uppercase', marginBottom: '2px' }}>
                      Subjects &amp; Focus
                    </strong>
                    {Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : (tutor.subjects || 'Mathematics, Science, Foundation Physics')}
                  </div>

                  {/* Clean Action Buttons: View Full Profile & Call */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Link
                      href={`/profile?tutorId=${tutor.id || 'demo-tutor-1'}`}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                        color: '#000000',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                        boxShadow: '0 2px 10px rgba(245, 158, 11, 0.25)'
                      }}
                    >
                      <User size={15} /> View Full Profile
                    </Link>

                    <a
                      href={`tel:${tutor.phone || '+919162162128'}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <Phone size={15} /> Call
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Column 2: Official Verified Monthly Report Card (Clean & Focused) */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={20} style={{ color: '#F59E0B' }} /> Official Progress Report
                </h2>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#10B981',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={14} /> Quality Verified
                </span>
              </div>

              <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '18px',
                padding: '1.6rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: '#0284C7',
                      color: '#FFFFFF',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      marginBottom: '6px'
                    }}>
                      September 2026
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                      Monthly Comprehensive Audit
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Evaluated at: <strong style={{ color: 'var(--text-primary)' }}>Purnia Central Examination Hub</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'monospace' }}>
                      86.5%
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10B981' }}>
                      Grade A+ Outstanding
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '12px 14px',
                  background: 'rgba(245, 158, 11, 0.06)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F59E0B', fontWeight: 700, marginBottom: '2px' }}>
                    <ShieldCheck size={14} /> Independent Cross-Examiner Audit
                  </div>
                  <span>Evaluated independently by certified cross-examiner faculty to guarantee 100% unbiased academic verification.</span>
                </div>

                <Link
                  href="/report-card/rep-sample-001"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '11px 18px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: '#000000',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    boxShadow: '0 3px 12px rgba(245, 158, 11, 0.25)',
                    transition: 'transform 0.2s'
                  }}
                >
                  <FileText size={16} />
                  <span>View &amp; Print Official Verified Report Card (PDF)</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
