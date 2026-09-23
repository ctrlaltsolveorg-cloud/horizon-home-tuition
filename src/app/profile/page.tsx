'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth, UserRole } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowLeft,
  LogOut,
  LayoutDashboard,
  Calendar,
  Layers,
  Star,
  Lock,
  Edit3,
  Award,
  Clock,
  Eye
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function ProfilePageContent() {
  const { user, logout, updateProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL query params for viewing another user
  const targetTutorId = searchParams.get('tutorId');
  const targetStudentId = searchParams.get('studentId');
  const targetUserId = searchParams.get('userId');

  // Determine if viewing own profile or someone else's
  const isViewingOther = Boolean(
    (targetTutorId && targetTutorId !== user?.id) ||
    (targetStudentId && targetStudentId !== user?.id) ||
    (targetUserId && targetUserId !== user?.id)
  );

  const [loadingTarget, setLoadingTarget] = useState(false);
  const [targetProfileData, setTargetProfileData] = useState<any>(null);

  // Edit Mode state (only applicable if viewing own profile)
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields State (for own profile)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('student_parent');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Tutor Fields
  const [college, setCollege] = useState('');
  const [degreeStatus, setDegreeStatus] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [mediumPreference, setMediumPreference] = useState('Hindi and English');
  const [subjects, setSubjects] = useState('');
  const [bio, setBio] = useState('');
  const [rating, setRating] = useState(4.9);

  // Student Fields
  const [parentName, setParentName] = useState('');
  const [classLevel, setClassLevel] = useState('Class 9');
  const [board, setBoard] = useState('CBSE');
  const [schoolMedium, setSchoolMedium] = useState('Hindi Medium');
  const [address, setAddress] = useState('');

  // Load target user profile if viewing someone else
  useEffect(() => {
    async function loadOtherProfile() {
      if (!isViewingOther) return;
      setLoadingTarget(true);

      try {
        if (targetTutorId) {
          const { data } = await supabase
            .from('tutor_profiles')
            .select('*')
            .eq('id', targetTutorId)
            .maybeSingle();

          if (data) {
            setTargetProfileData({
              ...data,
              type: 'tutor'
            });
          } else {
            // Fallback demo tutor
            setTargetProfileData({
              type: 'tutor',
              full_name: 'Harshit Patel',
              college: 'PCE PURNIA',
              degree_status: 'B.Tech/BS: 3rd sem with 7.2 CGPA',
              experience_years: '3+ years teaching experience',
              medium_preference: 'Hindi medium only',
              languages: 'Hindi, Maithili, English',
              subjects: 'Mathematics, Science, Foundation Physics',
              bio_and_custom_notes: 'Dedicated educator from PCE Purnia specialized in Hindi-medium CBSE & Bihar State Board learners with structured monthly testing.',
              rating: 4.9,
              phone: '+91 9162162128',
              email: 'harshit.patel@horizon.edu',
              is_verified: true
            });
          }
        } else if (targetStudentId) {
          const { data } = await supabase
            .from('student_enquiries')
            .select('*')
            .eq('student_id', targetStudentId)
            .maybeSingle();

          if (data) {
            setTargetProfileData({
              ...data,
              type: 'student'
            });
          } else {
            // Fallback demo student
            setTargetProfileData({
              type: 'student',
              student_name: 'Aaryan Sharma',
              parent_name: 'Ramesh Sharma',
              phone: '+91 98111 22334',
              email: 'aaryan.student@horizon.edu',
              class_level: 'Class 9',
              board: 'CBSE',
              school_medium: 'Hindi Medium',
              address: 'Line Bazar, Near Medical College, Purnia',
              test_score: '88% (Passed)',
              fee_status: 'PAID',
              is_verified: true
            });
          }
        }
      } catch (err) {
        console.warn('Error loading other profile:', err);
      } finally {
        setLoadingTarget(false);
      }
    }

    loadOtherProfile();
  }, [isViewingOther, targetTutorId, targetStudentId, targetUserId]);

  // Load Own Profile State
  useEffect(() => {
    if (user && !isViewingOther) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setRole(user.role || 'student_parent');
      setAvatarUrl(user.avatar_url || '');

      const loadDetailedSelfProfile = async () => {
        try {
          if (!user.isDemo) {
            if (user.role === 'teacher') {
              const { data: tutor } = await supabase
                .from('tutor_profiles')
                .select('*')
                .or(`id.eq.${user.id},user_id.eq.${user.id},email.eq.${user.email}`)
                .maybeSingle();

              if (tutor) {
                setCollege(tutor.college || 'PCE PURNIA');
                setDegreeStatus(tutor.degree_status || 'B.Tech/BS: 3rd sem with 7.2 CGPA');
                setExperienceYears(tutor.experience_years || '3+ years teaching experience');
                setMediumPreference(tutor.medium_preference || 'Hindi medium only');
                setSubjects(Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : (tutor.subjects || 'Mathematics, Science, Foundation Physics'));
                setBio(tutor.bio_and_custom_notes || 'Dedicated educator specialized in CBSE and State Board Hindi-medium learners.');
                setRating(tutor.rating || 5.0);
              }
            } else {
              const { data: student } = await supabase
                .from('student_enquiries')
                .select('*')
                .or(`student_id.eq.${user.id},email.eq.${user.email}`)
                .maybeSingle();

              if (student) {
                setParentName(student.parent_name || '');
                setClassLevel(student.class_level || 'Class 9');
                setBoard(student.board || 'CBSE');
                setSchoolMedium(student.school_medium || 'Hindi Medium');
                setAddress(student.address || '');
              }
            }
          } else if (user.profileData) {
            const p = user.profileData;
            setCollege(p.college || 'PCE PURNIA');
            setDegreeStatus(p.degree_status || 'B.Tech/BS: 3rd sem with 7.2 CGPA');
            setExperienceYears(p.experience_years || '3+ years teaching experience');
            setMediumPreference(p.medium_preference || 'Hindi medium only');
            setSubjects(p.subjects || 'Mathematics, Science');
            setBio(p.bio_and_custom_notes || p.bio || '');
            setParentName(p.parent_name || 'Ramesh Sharma');
            setClassLevel(p.class_level || 'Class 9');
            setBoard(p.board || 'CBSE');
            setSchoolMedium(p.school_medium || 'Hindi Medium');
            setAddress(p.address || 'Line Bazar, Purnia');
          }
        } catch (e) {
          console.warn('Error loading detailed profile:', e);
        }
      };

      loadDetailedSelfProfile();
    }
  }, [user, isViewingOther]);

  // Handle Save Own Profile
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewingOther) return; // Strict permission guard

    if (!name.trim()) {
      setErrorMsg('Full name cannot be empty.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');
    setSaveSuccess(false);

    try {
      const res = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        role: role,
        avatar_url: avatarUrl,
        college: college.trim(),
        degree_status: degreeStatus.trim(),
        experience_years: experienceYears.trim(),
        medium_preference: mediumPreference,
        subjects: subjects.trim(),
        bio_and_custom_notes: bio.trim(),
        parent_name: parentName.trim(),
        class_level: classLevel,
        board: board,
        school_medium: schoolMedium,
        address: address.trim()
      });

      if (res.success) {
        setSaveSuccess(true);
        setIsEditMode(false);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMsg(res.error || 'Failed to save profile changes.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  // 1. Loading State
  if (authLoading || loadingTarget) {
    return (
      <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B0F19', color: '#F59E0B' }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={32} className="spin" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: '#94A3B8' }}>Loading Full Profile...</p>
        </div>
      </div>
    );
  }

  // 2. CASE: Viewing Another User's Profile (READ-ONLY PUBLIC VIEW)
  if (isViewingOther && targetProfileData) {
    const isTutor = targetProfileData.type === 'tutor';
    const displayName = isTutor ? targetProfileData.full_name : targetProfileData.student_name;

    return (
      <div style={{ minHeight: '100vh', background: '#0B0F19', color: '#F8FAFC', paddingBottom: '5rem' }}>
        {/* Top Header Bar */}
        <section style={{
          background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
          borderBottom: '1px solid #374151',
          padding: '2.5rem 1.5rem'
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <Link
                href={user?.role === 'teacher' ? '/tutor-dashboard' : '/student-dashboard'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: '#374151',
                  color: '#F9FAFB',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34D399',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                <Lock size={14} />
                <span>Verified Public Profile (Read Only)</span>
              </div>
            </div>

            {/* Profile Avatar & Header Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{
                width: '88px',
                height: '88px',
                borderRadius: '20px',
                background: isTutor ? 'linear-gradient(135deg, #2563EB, #3B82F6)' : 'linear-gradient(135deg, #10B981, #059669)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.4rem',
                fontWeight: 900,
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
              }}>
                {displayName ? displayName.charAt(0).toUpperCase() : 'H'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                    {displayName}
                  </h1>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: '#0284C7',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    <ShieldCheck size={13} /> {isTutor ? 'Verified Faculty' : 'Enrolled Student'}
                  </span>
                </div>

                <div style={{ fontSize: '0.92rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  {isTutor && (
                    <span style={{ color: '#F59E0B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={16} fill="#F59E0B" /> {targetProfileData.rating || 4.9} / 5.0 Rating
                    </span>
                  )}
                  {targetProfileData.email && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={15} color="#38BDF8" /> {targetProfileData.email}
                    </span>
                  )}
                  {targetProfileData.phone && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={15} color="#34D399" /> {targetProfileData.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Profile View Cards */}
        <main style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem' }}>
          {isTutor ? (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Academic Credentials Box */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', padding: '1.8rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={20} color="#F59E0B" /> Academic Credentials &amp; Background
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: '#0F172A', padding: '12px 16px', borderRadius: '10px', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>COLLEGE / INSTITUTION</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38BDF8', marginTop: '3px' }}>{targetProfileData.college || 'PCE Purnia'}</div>
                  </div>

                  <div style={{ background: '#0F172A', padding: '12px 16px', borderRadius: '10px', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>DEGREE &amp; PERFORMANCE</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F8FAFC', marginTop: '3px' }}>{targetProfileData.degree_status || 'B.Tech / BS: 3rd sem with 7.2 CGPA'}</div>
                  </div>

                  <div style={{ background: '#0F172A', padding: '12px 16px', borderRadius: '10px', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>TEACHING EXPERIENCE</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#34D399', marginTop: '3px' }}>{targetProfileData.experience_years || '3+ years experience'}</div>
                  </div>

                  <div style={{ background: '#0F172A', padding: '12px 16px', borderRadius: '10px', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>MEDIUM &amp; LANGUAGES</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F59E0B', marginTop: '3px' }}>{targetProfileData.medium_preference} ({targetProfileData.languages || 'Hindi, English'})</div>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                    SUBJECTS &amp; SPECIALIZATIONS
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F1F5F9', background: '#0F172A', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155' }}>
                    {targetProfileData.subjects || 'Mathematics, Science, Foundation Physics'}
                  </div>
                </div>

                {targetProfileData.bio_and_custom_notes && (
                  <div style={{ marginTop: '1.25rem', padding: '14px', background: 'rgba(245, 158, 11, 0.06)', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Educator's Pedagogical Bio
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                      "{targetProfileData.bio_and_custom_notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action Contact Bar */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href={`tel:${targetProfileData.phone || '+919162162128'}`}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: '#000',
                    fontWeight: 800,
                    textDecoration: 'none',
                    fontSize: '0.95rem'
                  }}
                >
                  <Phone size={18} /> Call Assigned Tutor
                </a>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Student Profile Card */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', padding: '1.8rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={20} color="#38BDF8" /> Student Academic Profile
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: '#0F172A', padding: '12px 16px', borderRadius: '10px', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>PARENT / GUARDIAN</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F8FAFC', marginTop: '3px' }}>{targetProfileData.parent_name || 'Ramesh Sharma'}</div>
                  </div>

                  <div style={{ background: '#0F172A', padding: '12px 16px', borderRadius: '10px', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>CLASS &amp; BOARD</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38BDF8', marginTop: '3px' }}>{targetProfileData.class_level || 'Class 9'} • {targetProfileData.board || 'CBSE'}</div>
                  </div>

                  <div style={{ background: '#0F172A', padding: '12px 16px', borderRadius: '10px', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>MEDIUM OF INSTRUCTION</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#34D399', marginTop: '3px' }}>{targetProfileData.school_medium || 'Hindi Medium'}</div>
                  </div>

                  <div style={{ background: '#0F172A', padding: '12px 16px', borderRadius: '10px', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>DIAGNOSTIC TEST SCORE</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F59E0B', marginTop: '3px' }}>{targetProfileData.test_score || '88% Passed'}</div>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', background: '#0F172A', padding: '12px 16px', borderRadius: '10px', border: '1px solid #334155' }}>
                  <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>RESIDENTIAL ADDRESS</div>
                  <div style={{ fontSize: '0.92rem', color: '#CBD5E1', marginTop: '3px' }}>{targetProfileData.address || 'Line Bazar, Purnia, Bihar'}</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // 3. CASE: Viewing Own Profile (VIEW / EDIT SELF PROFILE)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0B0F19', color: '#F8FAFC' }}>
      <Navbar />

      {/* Top Banner */}
      <section style={{
        background: 'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.12) 0%, transparent 60%), #111827',
        padding: '3rem 1.5rem',
        borderBottom: '1px solid #1F2937'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            
            {/* Left: Avatar & Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 900,
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)'
              }}>
                {name ? name.charAt(0).toUpperCase() : 'H'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
                    {name || 'My Profile'}
                  </h1>
                  <span style={{
                    background: role === 'teacher' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: role === 'teacher' ? '#34D399' : '#38BDF8',
                    border: `1px solid ${role === 'teacher' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '20px',
                    textTransform: 'uppercase'
                  }}>
                    {role === 'teacher' ? 'Accredited Tutor' : 'Student & Parent'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94A3B8', fontSize: '0.88rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={14} color="#F59E0B" /> {user?.email}
                  </span>
                  {phone && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={14} color="#34D399" /> {phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions (Toggle Edit Mode / Dashboard) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsEditMode(!isEditMode)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  background: isEditMode ? '#374151' : 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: isEditMode ? '#F9FAFB' : '#000',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  border: isEditMode ? '1px solid #4B5563' : 'none',
                  cursor: 'pointer',
                  boxShadow: isEditMode ? 'none' : '0 4px 15px rgba(245, 158, 11, 0.35)'
                }}
              >
                {isEditMode ? <Eye size={16} /> : <Edit3 size={16} />}
                <span>{isEditMode ? 'Cancel Edit' : 'Edit My Profile'}</span>
              </button>

              <Link
                href={role === 'teacher' ? '/tutor-dashboard' : '/student-dashboard'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  background: '#1F2937',
                  color: '#F9FAFB',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  border: '1px solid #374151',
                  textDecoration: 'none'
                }}
              >
                <LayoutDashboard size={16} /> Open Dashboard
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Main Form / Display Area */}
      <main style={{ padding: '2.5rem 1.5rem 5rem', flex: 1, maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        
        {/* Save Success Alert */}
        {saveSuccess && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10B981',
            color: '#34D399',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '1.5rem',
            fontWeight: 700
          }}>
            <CheckCircle2 size={20} />
            <span>Profile successfully updated and saved to Supabase!</span>
          </div>
        )}

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #EF4444',
            color: '#F87171',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '1.5rem',
            fontWeight: 700
          }}>
            <AlertCircle size={20} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'grid', gap: '1.75rem' }}>
          
          {/* Section 1: Basic Personal Coordinates */}
          <div style={{
            background: '#111827',
            border: '1px solid #1F2937',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 1.25rem 0', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#F59E0B" /> Personal &amp; Account Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                  Full Name
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '0.92rem'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>{name || '—'}</div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                  Email Address (Read Only)
                </label>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#CBD5E1' }}>{user?.email}</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                  Phone / WhatsApp
                </label>
                {isEditMode ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '0.92rem'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34D399' }}>{phone || '—'}</div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Role-Specific Profile View & Edit */}
          {role === 'teacher' ? (
            <div style={{
              background: '#111827',
              border: '1px solid #1F2937',
              borderRadius: '16px',
              padding: '1.75rem',
              borderLeft: '4px solid #10B981'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 1.25rem 0', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={18} color="#10B981" /> Faculty Academic Credentials &amp; Bio
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>College / Institution</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#FFF' }}
                    />
                  ) : (
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38BDF8' }}>{college || 'PCE PURNIA'}</div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Degree &amp; Status</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={degreeStatus}
                      onChange={(e) => setDegreeStatus(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#FFF' }}
                    />
                  ) : (
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>{degreeStatus || 'B.Tech/BS: 3rd sem with 7.2 CGPA'}</div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Teaching Experience</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#FFF' }}
                    />
                  ) : (
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34D399' }}>{experienceYears || '3+ years teaching experience'}</div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Medium Preference</label>
                  {isEditMode ? (
                    <select
                      value={mediumPreference}
                      onChange={(e) => setMediumPreference(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#FFF' }}
                    >
                      <option value="Hindi medium only">Hindi medium only</option>
                      <option value="English medium only">English medium only</option>
                      <option value="Bilingual (Hindi & English)">Bilingual (Hindi & English)</option>
                    </select>
                  ) : (
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F59E0B' }}>{mediumPreference}</div>
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Subjects Handled</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={subjects}
                      onChange={(e) => setSubjects(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#FFF' }}
                    />
                  ) : (
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F1F5F9' }}>{subjects || 'Mathematics, Science, Foundation Physics'}</div>
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Bio &amp; Teaching Philosophy</label>
                  {isEditMode ? (
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#FFF', fontFamily: 'inherit' }}
                    />
                  ) : (
                    <div style={{ fontSize: '0.9rem', color: '#CBD5E1', fontStyle: 'italic', lineHeight: 1.5 }}>
                      "{bio || 'Dedicated educator specialized in personalized concept clarity and regular assessment tests.'}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              background: '#111827',
              border: '1px solid #1F2937',
              borderRadius: '16px',
              padding: '1.75rem',
              borderLeft: '4px solid #38BDF8'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 1.25rem 0', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="#38BDF8" /> Student &amp; Academic Enrollment Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Parent / Guardian Name</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#FFF' }}
                    />
                  ) : (
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>{parentName || 'Ramesh Sharma'}</div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Class / Grade</label>
                  {isEditMode ? (
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#FFF' }}
                    >
                      {['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11 (PCM)', 'Class 11 (PCB)', 'Class 12 (PCM)', 'Class 12 (PCB)'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38BDF8' }}>{classLevel}</div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Board</label>
                  {isEditMode ? (
                    <select
                      value={board}
                      onChange={(e) => setBoard(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#FFF' }}
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="Bihar State Board">Bihar State Board</option>
                    </select>
                  ) : (
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F59E0B' }}>{board}</div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>School Medium</label>
                  {isEditMode ? (
                    <select
                      value={schoolMedium}
                      onChange={(e) => setSchoolMedium(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#FFF' }}
                    >
                      <option value="Hindi Medium">Hindi Medium</option>
                      <option value="English Medium">English Medium</option>
                    </select>
                  ) : (
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34D399' }}>{schoolMedium}</div>
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Address</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#FFF' }}
                    />
                  ) : (
                    <div style={{ fontSize: '0.92rem', color: '#CBD5E1' }}>{address || 'Line Bazar, Purnia'}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button (Only in Edit Mode) */}
          {isEditMode && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: '#374151',
                  color: '#F3F4F6',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#000',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)'
                }}
              >
                <Save size={16} />
                <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          )}

        </form>
      </main>

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0B0F19', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading Profile...
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}
