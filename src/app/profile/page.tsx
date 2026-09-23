'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  ArrowRight,
  LogOut,
  LayoutDashboard,
  Calendar,
  Layers,
  Check,
  RefreshCw
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, updateProfile, refreshUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields State
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

  // Student Fields
  const [parentName, setParentName] = useState('');
  const [classLevel, setClassLevel] = useState('Class 10');
  const [board, setBoard] = useState('CBSE');
  const [schoolMedium, setSchoolMedium] = useState('English Medium');
  const [address, setAddress] = useState('');

  // Populate state when user object loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setRole(user.role || 'student_parent');
      setAvatarUrl(user.avatar_url || '');

      // Load additional data from Supabase or user profileData
      const loadDetailedProfile = async () => {
        try {
          if (!user.isDemo) {
            if (user.role === 'teacher') {
              const { data: tutor } = await supabase
                .from('tutor_profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

              if (tutor) {
                setCollege(tutor.college || '');
                setDegreeStatus(tutor.degree_status || '');
                setExperienceYears(tutor.experience_years || '');
                setMediumPreference(tutor.medium_preference || 'Hindi and English');
                setSubjects(Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : (tutor.subjects || ''));
                setBio(tutor.bio_and_custom_notes || '');
              }
            } else if (user.role === 'student_parent') {
              const { data: student } = await supabase
                .from('student_enquiries')
                .select('*')
                .eq('student_id', user.id)
                .maybeSingle();

              if (student) {
                setParentName(student.parent_name || '');
                setClassLevel(student.class_level || 'Class 10');
                setBoard(student.board || 'CBSE');
                setSchoolMedium(student.school_medium || 'English Medium');
                setAddress(student.address || '');
              }
            }
          } else if (user.profileData) {
            const p = user.profileData;
            setCollege(p.college || '');
            setDegreeStatus(p.degree_status || '');
            setExperienceYears(p.experience_years || '');
            setMediumPreference(p.medium_preference || 'Hindi and English');
            setSubjects(p.subjects || '');
            setBio(p.bio_and_custom_notes || p.bio || '');
            setParentName(p.parent_name || '');
            setClassLevel(p.class_level || 'Class 10');
            setBoard(p.board || 'CBSE');
            setSchoolMedium(p.school_medium || 'English Medium');
            setAddress(p.address || '');
          }
        } catch (e) {
          console.warn('Error loading detailed profile:', e);
        }
      };

      loadDetailedProfile();
    }
  }, [user]);

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMsg(res.error || 'Failed to save profile changes.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--accent-gold)' }}>
            <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading your profile data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{
            maxWidth: '460px',
            width: '100%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '2.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <User size={30} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.65rem' }}>
              Sign In Required
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Please sign in with your Google account or email credentials to view and manage your Horizon profile.
            </p>
            <Link href="/login" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
              Go to Sign In →
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <Navbar />

      {/* Profile Banner */}
      <section style={{
        background: 'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.12) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 60%), var(--bg-main)',
        paddingTop: '3.5rem',
        paddingBottom: '3.5rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}>
            
            {/* Left: User Avatar + Name + Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    border: '3px solid var(--accent-gold)',
                    objectFit: 'cover',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
              ) : (
                <div style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#0B0C0E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 900,
                  boxShadow: 'var(--shadow-md)'
                }}>
                  {name ? name.charAt(0).toUpperCase() : 'H'}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                  <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>
                    {name || 'Horizon User'}
                  </h1>
                  <span style={{
                    background: role === 'teacher' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(37, 99, 235, 0.15)',
                    color: role === 'teacher' ? '#10B981' : '#3B82F6',
                    border: `1px solid ${role === 'teacher' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {role === 'teacher' ? 'Accredited Tutor' : role === 'admin' ? 'Administrator' : 'Student & Parent'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={15} color="var(--accent-gold)" /> {user.email}
                  </span>
                  {phone && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Phone size={15} color="var(--accent-green)" /> {phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                href={role === 'teacher' ? '/tutor-dashboard' : role === 'admin' ? '/admin' : '/student-dashboard'}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.88rem',
                  textDecoration: 'none'
                }}
              >
                <LayoutDashboard size={16} /> Open Dashboard
              </Link>
              <button
                onClick={() => logout()}
                className="btn btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.1rem',
                  fontSize: '0.88rem',
                  color: '#EF4444',
                  borderColor: 'rgba(239, 68, 68, 0.3)'
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Main Profile Form */}
      <main style={{ padding: '3rem 1.5rem 5rem', flex: 1 }}>
        <div className="container" style={{ maxWidth: '1080px', margin: '0 auto' }}>

          {/* Feedback Alerts */}
          {saveSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#10B981',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '2rem',
              fontWeight: 600
            }}>
              <CheckCircle2 size={20} />
              <span>Your profile information has been saved and synchronized with Supabase!</span>
            </div>
          )}

          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#EF4444',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '2rem',
              fontWeight: 600
            }}>
              <AlertCircle size={20} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'grid', gap: '2rem' }}>
            
            {/* Section 1: Basic Identity & Contact Details */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <User size={22} color="var(--accent-gold)" />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    Personal & Account Information
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                    Basic contact coordinates and verified account credentials.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    Full Name <span style={{ color: 'var(--accent-gold)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    Email Address <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>(Read Only)</span>
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.95rem',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    Portal Role Profile
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem'
                    }}
                  >
                    <option value="student_parent">Student / Parent Profile</option>
                    <option value="teacher">Accredited Tutor / Educator Profile</option>
                    {user.role === 'admin' && <option value="admin">Administrator Profile</option>}
                  </select>
                </div>

              </div>
            </div>

            {/* Section 2: Role Specific Details */}
            {role === 'teacher' ? (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '2rem',
                borderLeft: '4px solid var(--accent-green)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <BookOpen size={22} color="var(--accent-green)" />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                      Tutor Academic Credentials & Specialization
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                      Information visible to coordinators and parents during tutor assignment.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      College / Institution
                    </label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. PCE Purnia / Delhi University"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Degree Status & Major
                    </label>
                    <input
                      type="text"
                      value={degreeStatus}
                      onChange={(e) => setDegreeStatus(e.target.value)}
                      placeholder="e.g. B.Tech 3rd sem / B.Sc Physics"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Teaching Experience
                    </label>
                    <input
                      type="text"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      placeholder="e.g. 3+ years teaching experience"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Medium Preference
                    </label>
                    <select
                      value={mediumPreference}
                      onChange={(e) => setMediumPreference(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem'
                      }}
                    >
                      <option value="Hindi medium only">Hindi medium only</option>
                      <option value="English medium only">English medium only</option>
                      <option value="Bilingual (Hindi & English)">Bilingual (Hindi & English)</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Subjects Handled
                    </label>
                    <input
                      type="text"
                      value={subjects}
                      onChange={(e) => setSubjects(e.target.value)}
                      placeholder="e.g. Mathematics, Science, Foundation Physics, Chemistry"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Tutor Bio & Special Teaching Notes
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell parents about your teaching pedagogy, exam strategies, and student results..."
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                </div>
              </div>
            ) : (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '2rem',
                borderLeft: '4px solid #3B82F6',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <GraduationCap size={22} color="#3B82F6" />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                      Student & Academic Enrollment Details
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                      Enrolled class, curriculum board, and home tuition address.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Parent / Guardian Name
                    </label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Parent's Name"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Class / Grade
                    </label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem'
                      }}
                    >
                      {['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11 (PCM)', 'Class 11 (PCB)', 'Class 11 (Commerce)', 'Class 12 (PCM)', 'Class 12 (PCB)', 'Class 12 (Commerce)'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Educational Board
                    </label>
                    <select
                      value={board}
                      onChange={(e) => setBoard(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem'
                      }}
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="Bihar State Board">Bihar State Board</option>
                      <option value="UP State Board">UP State Board</option>
                      <option value="Other Board">Other State Board</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      School Medium
                    </label>
                    <select
                      value={schoolMedium}
                      onChange={(e) => setSchoolMedium(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem'
                      }}
                    >
                      <option value="English Medium">English Medium</option>
                      <option value="Hindi Medium">Hindi Medium</option>
                      <option value="Bilingual">Bilingual</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Residential Address / Home Tuition Area
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Near Kali Mandir, Bhatta Bazar, Purnia, Bihar"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                </div>
              </div>
            )}

            {/* Submit Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.25rem 2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                <ShieldCheck size={18} color="var(--accent-gold)" />
                <span>All profile updates are securely encrypted and verified.</span>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: isSaving ? 'not-allowed' : 'pointer'
                }}
              >
                {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                {isSaving ? 'Saving to Supabase...' : 'Save Profile Changes'}
              </button>
            </div>

          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
