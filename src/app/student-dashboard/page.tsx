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
      <main style={{ minHeight: '90vh', background: 'var(--bg-primary)', padding: '2rem 1rem 5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Top Banner / Welcome */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            borderRadius: '20px',
            padding: '2rem 2.2rem',
            color: '#ffffff',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.2)'
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
                fontWeight: 600,
                marginBottom: '0.6rem'
              }}>
                <GraduationCap size={14} /> Student & Parent Learning Portal
              </div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, margin: 0 }}>
                Welcome, {enquiry?.student_name || 'Student'}!
              </h1>
              <p style={{ margin: '6px 0 0', opacity: 0.9, fontSize: '0.95rem' }}>
                Parent: {enquiry?.parent_name || 'Parent'} • {enquiry?.class_level} ({enquiry?.board} - {enquiry?.school_medium})
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '10px 18px',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                textAlign: 'right'
              }}>
                <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Fee Status</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={16} /> {enquiry?.fee_status || 'PAID'} (₹{enquiry?.fee_amount || 4500})
                </div>
              </div>
              <button
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
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
            
            {/* Column 1: Assigned Teacher Profile Card */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={20} style={{ color: 'var(--primary)' }} /> Assigned Teacher Profile
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
                  <ShieldCheck size={14} /> Verified Tutor
                </span>
              </div>

              {tutor && (
                <div style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '18px',
                  padding: '1.8rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem',
                      fontWeight: 800
                    }}>
                      {tutor.full_name?.charAt(0) || 'H'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                        {tutor.full_name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
                        <Star size={15} fill="#f59e0b" /> {tutor.rating || 4.9} / 5.0 Rating
                      </div>
                    </div>
                  </div>

                  {/* Tutor Profile Specifications in Requested Format */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
                    <div style={{
                      padding: '10px 14px',
                      background: 'var(--bg-primary)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.9rem'
                    }}>
                      <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.78rem' }}>COLLEGE / INSTITUTION</strong>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{tutor.college}</span>
                    </div>

                    <div style={{
                      padding: '10px 14px',
                      background: 'var(--bg-primary)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.9rem'
                    }}>
                      <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.78rem' }}>DEGREE & PERFORMANCE</strong>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{tutor.degree_status}</span>
                    </div>

                    <div style={{
                      padding: '10px 14px',
                      background: 'var(--bg-primary)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.9rem'
                    }}>
                      <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.78rem' }}>TEACHING EXPERIENCE</strong>
                      <span style={{ fontWeight: 700, color: '#10b981' }}>+ {tutor.experience_years}</span>
                    </div>

                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(37, 99, 235, 0.05)',
                      borderRadius: '10px',
                      border: '1px solid rgba(37, 99, 235, 0.15)',
                      fontSize: '0.9rem'
                    }}>
                      <strong style={{ color: 'var(--primary)', display: 'block', fontSize: '0.78rem' }}>MEDIUM & LANGUAGE COMFORT</strong>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        Comfortable with : {tutor.medium_preference} ({tutor.languages})
                      </span>
                    </div>
                  </div>

                  {tutor.bio_and_custom_notes && (
                    <div style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                      padding: '10px 14px',
                      background: 'var(--bg-primary)',
                      borderRadius: '10px',
                      marginBottom: '1.2rem'
                    }}>
                      "{tutor.bio_and_custom_notes}"
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a
                      href={`tel:${tutor.phone || '+919876543210'}`}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        borderRadius: '10px',
                        background: 'var(--primary)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <Phone size={15} /> Call Tutor
                    </a>
                    <Link
                      href={`/tutor-verify/HZN-1024`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      Verify ID
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Column 2: Monthly Progress Reports with Rich Variables */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={20} style={{ color: '#10b981' }} /> Monthly Progress Reports
                </h2>

                {/* Month Tab Switcher */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {reports.map((rep, idx) => (
                    <button
                      key={rep.id || idx}
                      onClick={() => setSelectedReportIndex(idx)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: selectedReportIndex === idx ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        background: selectedReportIndex === idx ? 'rgba(37, 99, 235, 0.1)' : 'var(--card-bg)',
                        color: selectedReportIndex === idx ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      {rep.report_month}
                    </button>
                  ))}
                </div>
              </div>

              {activeReport && (
                <div style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '18px',
                  padding: '1.8rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
                }}>
                  
                  {/* Report Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-color)',
                    marginBottom: '1.2rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                        MONTHLY SCORECARD
                      </span>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
                        {activeReport.report_month}
                      </h3>
                    </div>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}>
                      Rating: {activeReport.academic_progress_rating || 9.3} / 10
                    </span>
                  </div>

                  {/* Key Metrics Variables Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '10px',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ background: 'var(--bg-primary)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ATTENDANCE</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb' }}>
                        {activeReport.student_attendance_percentage}%
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{activeReport.total_classes_conducted} sessions</div>
                    </div>

                    <div style={{ background: 'var(--bg-primary)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PUNCTUALITY</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>
                        {activeReport.punctuality_rating || 9.5} / 10
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Always on time</div>
                    </div>

                    <div style={{ background: 'var(--bg-primary)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CONCEPT CLARITY</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#7c3aed' }}>
                        {activeReport.understanding_rating || 9.2} / 10
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Strong retention</div>
                    </div>
                  </div>

                  {/* Syllabus Covered */}
                  <div style={{ marginBottom: '1.3rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Syllabus & Topics Covered (पाठ्यक्रम प्रगति)
                    </h4>
                    <div style={{
                      padding: '12px 14px',
                      background: 'var(--bg-primary)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)',
                      lineHeight: '1.5'
                    }}>
                      {activeReport.syllabus_covered}
                    </div>

                    {activeReport.topics_completed && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                        {activeReport.topics_completed.map((t: string, idx: number) => (
                          <span key={idx} style={{
                            padding: '4px 10px',
                            background: 'rgba(37, 99, 235, 0.08)',
                            color: 'var(--primary)',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 600
                          }}>
                            ✓ {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Test Scores */}
                  {activeReport.test_scores && (
                    <div style={{ marginBottom: '1.3rem' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Weekly & Monthly Assessment Scores
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {activeReport.test_scores.map((ts: any, idx: number) => (
                          <div key={idx} style={{
                            padding: '10px 14px',
                            background: 'var(--bg-primary)',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{ts.test}</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981' }}>{ts.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Teacher Feedback / Remarks */}
                  <div style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Teacher's Observation & Remarks
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.5' }}>
                      "{activeReport.tutor_remarks}"
                    </p>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
