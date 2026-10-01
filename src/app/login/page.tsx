'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth, UserRole, DEMO_USERS } from '@/context/AuthContext';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  Mail, 
  Lock, 
  Phone,
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Send,
  UserPlus,
  LogIn,
  Zap,
  Building2,
  Award,
  Clock,
  Languages,
  BookMarked,
  MapPin,
  Sparkles,
  Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type AuthTab = 'signin' | 'signup' | 'magiclink';

export default function LoginPage() {
  const { 
    signInWithPassword, 
    signUp, 
    signInWithOtp, 
    signInWithGoogle,
    resetPassword, 
    updatePassword,
    isRecoveryMode,
    setIsRecoveryMode,
    loginAs, 
    loading: authLoading, 
    user 
  } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Automatically detect password reset link arrival on mount
  useEffect(() => {
    async function checkRecoveryParams() {
      if (typeof window === 'undefined') return;

      const hash = window.location.hash || '';
      const search = window.location.search || '';
      const params = new URLSearchParams(search);
      const code = params.get('code');
      const tokenHash = params.get('token_hash');
      const type = params.get('type') || '';

      if (
        hash.includes('type=recovery') ||
        hash.includes('access_token=') ||
        type === 'recovery' ||
        Boolean(code) ||
        Boolean(tokenHash)
      ) {
        setIsRecoveryMode(true);

        if (code) {
          try {
            await supabase.auth.exchangeCodeForSession(code);
          } catch (e) {
            console.warn('PKCE exchange error:', e);
          }
        }
        if (tokenHash) {
          try {
            await supabase.auth.verifyOtp({ token_hash: tokenHash, type: (type as any) || 'recovery' });
          } catch (e) {
            console.warn('OTP verify error:', e);
          }
        }
      }
    }

    checkRecoveryParams();
  }, [setIsRecoveryMode]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');

  // Handle Google OAuth Sign In
  const handleGoogleSignIn = async (roleToSet?: UserRole) => {
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    const targetRole = roleToSet || selectedRole;
    const res = await signInWithGoogle(targetRole);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to initialize Google Sign In.');
      setIsSubmitting(false);
    }
  };

  // Common Fields (Initialized to empty strings, NO pre-filled values!)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Teacher Registration Fields (Fresh, clean empty strings)
  const [college, setCollege] = useState('');
  const [degreeStatus, setDegreeStatus] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [mediumPreference, setMediumPreference] = useState('Hindi medium only');
  const [subjects, setSubjects] = useState('');
  const [bio, setBio] = useState('');

  // Student / Parent Registration Fields
  const [parentName, setParentName] = useState('');
  const [classLevel, setClassLevel] = useState('Class 9');
  const [board, setBoard] = useState('CBSE');
  const [schoolMedium, setSchoolMedium] = useState('Hindi Medium');
  const [address, setAddress] = useState('');

  // Status & Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Handle Sign In (Email + Password)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    setEmailConfirmationRequired(false);

    const res = await signInWithPassword(email.trim().toLowerCase(), password);

    if (res.success) {
      setSuccessMsg('Signed in successfully! Redirecting to your dashboard...');
    } else {
      if (res.requiresEmailConfirmation) {
        setEmailConfirmationRequired(true);
        setErrorMsg(res.error || 'Email verification is pending.');
      } else {
        setErrorMsg(res.error || 'Failed to sign in. Please verify your email and password.');
      }
    }
    setIsSubmitting(false);
  };

  // Handle Comprehensive Registration
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg('Please enter your full name, email, and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    setEmailConfirmationRequired(false);

    const res = await signUp(email.trim().toLowerCase(), password, {
      fullName: fullName.trim(),
      phone: phoneNumber.trim(),
      role: selectedRole,
      college: college.trim(),
      degreeStatus: degreeStatus.trim(),
      experienceYears: experienceYears.trim(),
      mediumPreference,
      subjects: subjects.trim(),
      bio: bio.trim(),
      parentName: parentName.trim(),
      classLevel,
      board,
      schoolMedium,
      address: address.trim()
    });

    if (res.success) {
      if (res.confirmationSent) {
        setEmailConfirmationRequired(true);
        setSuccessMsg(`Registration successful! A verification link has been sent to ${email}. You can also use the Instant Demo below to test.`);
      } else {
        setSuccessMsg('Account and complete profile registered successfully! Redirecting...');
      }
    } else {
      setErrorMsg(res.error || 'Registration failed. Please check your inputs and try again.');
    }
    setIsSubmitting(false);
  };

  // Handle Magic Link (OTP)
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await signInWithOtp(email);
    if (res.success) {
      setSuccessMsg(`Login link sent to ${email}! Check your inbox to sign in instantly.`);
    } else {
      setErrorMsg(res.error || 'Failed to send login link.');
    }
    setIsSubmitting(false);
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address to receive password reset instructions.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    const res = await resetPassword(email.trim().toLowerCase());
    if (res.success) {
      setSuccessMsg(`Password reset link sent to ${email}! Please check your Gmail (Inbox and Spam/Junk folder) and click the link to set your new password.`);
    } else {
      setErrorMsg(res.error || 'Failed to send password reset email.');
    }
    setIsSubmitting(false);
  };

  // Handle Set New Password in Recovery Mode
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await updatePassword(newPassword);
    if (res.success) {
      setSuccessMsg('Your password has been updated successfully! You can now sign in.');
      setIsRecoveryMode(false);
      setActiveTab('signin');
      setPassword(newPassword);
    } else {
      setErrorMsg(res.error || 'Failed to update password.');
    }
    setIsSubmitting(false);
  };

  const roleInfo = {
    teacher: {
      title: 'Teacher & Tutor Portal',
      subtitle: 'शिक्षक एवं ट्यूटर रजिस्ट्रेशन',
      icon: BookOpen,
      badge: 'Accredited Tutor',
      color: '#059669',
      demoUser: DEMO_USERS.teacher,
      demoName: 'Harshit Patel'
    },
    student_parent: {
      title: 'Student & Parent Portal',
      subtitle: 'छात्र एवं अभिभावक लॉगिन',
      icon: GraduationCap,
      badge: 'Learner / Guardian',
      color: '#2563eb',
      demoUser: DEMO_USERS.student_parent,
      demoName: 'Aaryan Sharma'
    },
    admin: {
      title: 'Horizon Administration',
      subtitle: 'प्रशासक एवं कोऑर्डिनेटर कंट्रोल',
      icon: ShieldCheck,
      badge: 'Super Admin',
      color: '#7c3aed',
      demoUser: DEMO_USERS.admin,
      demoName: 'Horizon Admin'
    }
  };

  return (
    <>
      <Navbar />
      <main style={{
        position: 'relative',
        minHeight: '92vh',
        background: 'radial-gradient(circle at 75% 25%, rgba(245, 158, 11, 0.16) 0%, rgba(15, 23, 42, 0) 55%), radial-gradient(circle at 18% 75%, rgba(59, 130, 246, 0.14) 0%, rgba(0,0,0,0) 60%), var(--bg-main)',
        color: 'var(--text-primary)',
        padding: 'clamp(2.5rem, 5vw, 4rem) 1rem 5.5rem',
        overflow: 'hidden',
        transition: 'background 0.3s ease'
      }}>
        {/* Subtle Ambient Dot Grid Pattern from Landing Hero */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.14) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.45,
          pointerEvents: 'none'
        }} />

        {/* Ambient Halo Glow Orbs */}
        <div style={{
          position: 'absolute',
          top: '5%',
          right: '8%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '12%',
          left: '5%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1160px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          {/* Header Banner — Matching Landing Page Hero Style */}
          <div style={{ textAlign: 'center', marginBottom: '2.8rem' }}>
            {/* Golden Badge Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1rem',
              borderRadius: '30px',
              background: 'var(--accent-gold-light)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              backdropFilter: 'blur(12px)',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.12)'
            }}>
              <Sparkles size={15} color="#F59E0B" />
              <span style={{ fontSize: 'clamp(0.72rem, 2.5vw, 0.8rem)', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                OFFICIAL ACADEMIC PORTAL • CLASSES 5–12
              </span>
            </div>

            {/* Headline with Serif Italic Gold Accent */}
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.1rem, 4.8vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '0.85rem',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)'
            }}>
              HORIZON{' '}
              <span style={{
                fontFamily: 'serif',
                fontStyle: 'italic',
                fontWeight: 400,
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                paddingRight: '0.25rem'
              }}>
                Academic Portal
              </span>
            </h1>

            <p style={{
              fontSize: 'clamp(0.95rem, 1.5vw, 1.12rem)',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 1.5rem',
              lineHeight: 1.65
            }}>
              Sign in to manage your student diagnostic records, tutor accreditation, weekly sessions, and academic progress reports.
            </p>

            {/* Trust Metrics Pill Strip */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.5rem 1.4rem',
              background: 'rgba(20, 22, 27, 0.72)',
              border: '1px solid var(--border-color)',
              borderRadius: '30px',
              backdropFilter: 'blur(12px)',
              flexWrap: 'wrap',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>100% Background-Verified</span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-gold)' }}>4.9 ★ Parent Rated</span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-green)' }}>CBSE • ICSE • State Boards</span>
            </div>
          </div>

          {/* Active Session Notice */}
          {user && (
            <div style={{
              background: 'rgba(20, 22, 27, 0.85)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              backdropFilter: 'blur(16px)',
              borderRadius: '16px',
              padding: '1rem 1.4rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color="#10b981" />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    Active Session: <span style={{ color: 'var(--accent-gold)' }}>{user.name}</span> ({user.role === 'teacher' ? 'Tutor' : user.role === 'admin' ? 'Admin' : 'Student/Parent'})
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {user.email} {user.isDemo && '• [Test Session]'}
                  </div>
                </div>
              </div>
              <Link
                href={user.role === 'teacher' ? '/tutor-dashboard' : user.role === 'admin' ? '/admin' : '/student-dashboard'}
                className="btn btn-gold"
                style={{
                  padding: '8px 18px',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          )}

          {/* Main Grid: Authentication Area & Quick Demo Access */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))',
            gap: '2.2rem',
            alignItems: 'start'
          }}>

            {/* Left Card: Core Authentication Tabs with Organic Glassmorphism */}
            <div style={{
              background: 'rgba(20, 22, 27, 0.78)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(245, 158, 11, 0.22)',
              borderRadius: '24px',
              padding: 'clamp(1.5rem, 3.5vw, 2.4rem)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
            }}>
              
              {/* Tab Selector (Hidden during password recovery) */}
              {!isRecoveryMode && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '6px',
                background: 'rgba(11, 12, 14, 0.9)',
                padding: '5px',
                borderRadius: '14px',
                marginBottom: '1.75rem',
                border: '1px solid var(--border-color)'
              }}>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: activeTab === 'signin' ? 800 : 500,
                    background: activeTab === 'signin' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'transparent',
                    color: activeTab === 'signin' ? '#0B0C0E' : 'var(--text-secondary)',
                    border: 'none',
                    boxShadow: activeTab === 'signin' ? '0 4px 14px rgba(245, 158, 11, 0.35)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: activeTab === 'signup' ? 800 : 500,
                    background: activeTab === 'signup' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'transparent',
                    color: activeTab === 'signup' ? '#0B0C0E' : 'var(--text-secondary)',
                    border: 'none',
                    boxShadow: activeTab === 'signup' ? '0 4px 14px rgba(245, 158, 11, 0.35)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <UserPlus size={15} />
                  <span>Register</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('magiclink'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: activeTab === 'magiclink' ? 800 : 500,
                    background: activeTab === 'magiclink' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'transparent',
                    color: activeTab === 'magiclink' ? '#0B0C0E' : 'var(--text-secondary)',
                    border: 'none',
                    boxShadow: activeTab === 'magiclink' ? '0 4px 14px rgba(245, 158, 11, 0.35)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Zap size={15} />
                  <span>Magic Link</span>
                </button>
              </div>
              )}

              {/* Status Notifications */}
              {errorMsg && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#dc2626',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginBottom: '1.25rem',
                  lineHeight: '1.5'
                }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>{errorMsg}</div>
                </div>
              )}

              {successMsg && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: '#059669',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginBottom: '1.25rem',
                  lineHeight: '1.5'
                }}>
                  <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>{successMsg}</div>
                </div>
              )}

              {emailConfirmationRequired && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#b45309',
                  fontSize: '0.84rem',
                  marginBottom: '1.25rem',
                  lineHeight: '1.5'
                }}>
                  <strong>Verification Note:</strong> Please check your email inbox and click the confirmation link to activate your account. You can also explore instantly using the test demo role cards on the right.
                </div>
              )}

              {/* ==================== PASSWORD RECOVERY MODE FORM ==================== */}
              {isRecoveryMode ? (
                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    color: 'var(--accent-gold)'
                  }}>
                    <div style={{ fontWeight: 800, fontSize: '0.96rem', marginBottom: '4px' }}>
                      🔑 Reset Your Password
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      Create a new password below to regain full access to your account.
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      New Password (minimum 6 characters)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input
                        type="password"
                        required
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-input"
                        style={{
                          width: '100%',
                          padding: '11px 14px 11px 40px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'rgba(16, 18, 23, 0.9)',
                          color: 'var(--text-primary)',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Confirm New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input
                        type="password"
                        required
                        placeholder="Re-enter your new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="form-input"
                        style={{
                          width: '100%',
                          padding: '11px 14px 11px 40px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'rgba(16, 18, 23, 0.9)',
                          color: 'var(--text-primary)',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '13px 20px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: '#0B0C0E',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.96rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Lock size={16} />
                    <span>{isSubmitting ? 'Saving Password...' : 'Save & Update Password'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRecoveryMode(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      padding: '6px'
                    }}
                  >
                    Cancel and return to Sign In
                  </button>
                </form>
              ) : (
                <>
                {/* ==================== TAB 1: SIGN IN ==================== */}
                {activeTab === 'signin' && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  

                  <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Email Address
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                          type="email"
                          required
                          placeholder="e.g. yourname@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-input"
                          style={{
                            width: '100%',
                            padding: '11px 14px 11px 40px',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.95rem'
                          }}
                        />
                      </div>
                    </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(!showForgotPassword)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-gold)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        style={{
                          width: '100%',
                          padding: '11px 42px 11px 40px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'rgba(16, 18, 23, 0.9)',
                          color: 'var(--text-primary)',
                          fontSize: '0.95rem'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {showForgotPassword && (
                    <div style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px dashed rgba(245, 158, 11, 0.4)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        Forgot your password?
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        Enter your registered email address above. We will send a secure link to your Gmail to create a new password.
                      </div>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={isSubmitting}
                        style={{
                          padding: '9px 16px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                          color: '#0B0C0E',
                          border: 'none',
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          alignSelf: 'flex-start',
                          boxShadow: '0 3px 10px rgba(245, 158, 11, 0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Send size={14} />
                        <span>{isSubmitting ? 'Sending Link...' : 'Send Password Reset Link to Gmail'}</span>
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Already clicked the link or have a token?</span>
                        <button
                          type="button"
                          onClick={() => { setIsRecoveryMode(true); setShowForgotPassword(false); }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-gold)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: 0
                          }}
                        >
                          Click here to enter new password
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || authLoading}
                    style={{
                      width: '100%',
                      padding: '12px 18px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: '#0B0C0E',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.96rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      marginTop: '0.5rem',
                      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <LogIn size={17} />
                    <span>{isSubmitting ? 'Signing in...' : 'Sign In to Portal'}</span>
                  </button>
                </form>
                </div>
              )}

              {/* ==================== TAB 2: REGISTRATION ==================== */}
              {activeTab === 'signup' && (
                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  
                  {/* Role Switcher */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Register As:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedRole('teacher')}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: selectedRole === 'teacher' ? '2px solid #059669' : '1px solid var(--border-color)',
                          background: selectedRole === 'teacher' ? 'rgba(5, 150, 105, 0.08)' : 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          fontWeight: selectedRole === 'teacher' ? 700 : 500,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <BookOpen size={16} color="#059669" />
                        <span>Teacher / Tutor</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('student_parent')}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: selectedRole === 'student_parent' ? '2px solid #2563eb' : '1px solid var(--border-color)',
                          background: selectedRole === 'student_parent' ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          fontWeight: selectedRole === 'student_parent' ? 700 : 500,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <GraduationCap size={16} color="#2563eb" />
                        <span>Student / Parent</span>
                      </button>
                    </div>
                  </div>

                  {/* Google 1-Click Sign Up */}
                  <button
                    type="button"
                    onClick={() => handleGoogleSignIn(selectedRole)}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '10px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Sign Up with Google ({selectedRole === 'teacher' ? 'Teacher' : 'Student'})</span>
                  </button>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    margin: '0.25rem 0',
                    color: 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                    <span>Or Register with Email Form</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                  </div>

                  {/* Common Basic Info */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                        {selectedRole === 'teacher' ? 'Full Name' : 'Student Full Name'}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                          type="text"
                          required
                          placeholder={selectedRole === 'teacher' ? 'e.g. Harshit Patel' : 'e.g. Aaryan Sharma'}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="form-input"
                          style={{
                            width: '100%',
                            padding: '9px 12px 9px 36px',
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
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                        WhatsApp / Contact Phone
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="form-input"
                          style={{
                            width: '100%',
                            padding: '9px 12px 9px 36px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                        Email Address
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                          type="email"
                          required
                          placeholder="e.g. yourname@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-input"
                          style={{
                            width: '100%',
                            padding: '9px 12px 9px 36px',
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
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                        Password (min 6 characters)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Create a secure password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-input"
                          style={{
                            width: '100%',
                            padding: '9px 38px 9px 36px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer'
                          }}
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Teacher Specific Comprehensive Registration Fields */}
                  {selectedRole === 'teacher' && (
                    <div style={{
                      padding: '1.2rem',
                      background: 'rgba(5, 150, 105, 0.04)',
                      borderRadius: '12px',
                      border: '1px solid rgba(5, 150, 105, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Award size={16} /> Educator Qualification & Background
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            College / Institution
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. PCE PURNIA / Delhi University"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            className="form-input"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            Degree, Semester & CGPA
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. B.Tech/BS: 3rd sem with 7.2 CGPA"
                            value={degreeStatus}
                            onChange={(e) => setDegreeStatus(e.target.value)}
                            className="form-input"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            Teaching Experience
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 3+ years teaching experience"
                            value={experienceYears}
                            onChange={(e) => setExperienceYears(e.target.value)}
                            className="form-input"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            Teaching Medium Comfort
                          </label>
                          <select
                            value={mediumPreference}
                            onChange={(e) => setMediumPreference(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.88rem'
                            }}
                          >
                            <option value="Hindi medium only">Hindi medium only</option>
                            <option value="English medium only">English medium only</option>
                            <option value="Bilingual (Hindi + English)">Bilingual (Hindi + English)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                          Primary Subjects & Classes Handled
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mathematics, Science (Classes 8 to 10)"
                          value={subjects}
                          onChange={(e) => setSubjects(e.target.value)}
                          className="form-input"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.88rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                          Short Bio & Teaching Philosophy
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Briefly describe your concept clarity method, past board exam results, etc."
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="form-input"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.88rem',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Student / Parent Specific Fields */}
                  {selectedRole === 'student_parent' && (
                    <div style={{
                      padding: '1.2rem',
                      background: 'rgba(37, 99, 235, 0.04)',
                      borderRadius: '12px',
                      border: '1px solid rgba(37, 99, 235, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <GraduationCap size={16} /> Student Academic Information
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            Parent / Guardian Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Sharma"
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            className="form-input"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            Residential Area / Locality
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Line Bazar, Purnia"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="form-input"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            Class
                          </label>
                          <select
                            value={classLevel}
                            onChange={(e) => setClassLevel(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.85rem'
                            }}
                          >
                            <option value="Class 5">Class 5</option>
                            <option value="Class 6">Class 6</option>
                            <option value="Class 7">Class 7</option>
                            <option value="Class 8">Class 8</option>
                            <option value="Class 9">Class 9</option>
                            <option value="Class 10">Class 10</option>
                            <option value="Class 11">Class 11</option>
                            <option value="Class 12">Class 12</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            Board
                          </label>
                          <select
                            value={board}
                            onChange={(e) => setBoard(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.85rem'
                            }}
                          >
                            <option value="CBSE">CBSE</option>
                            <option value="ICSE">ICSE</option>
                            <option value="State Board">State Board (BSEB)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            Medium
                          </label>
                          <select
                            value={schoolMedium}
                            onChange={(e) => setSchoolMedium(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.85rem'
                            }}
                          >
                            <option value="Hindi Medium">Hindi Medium</option>
                            <option value="English Medium">English Medium</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || authLoading}
                    style={{
                      width: '100%',
                      padding: '13px 20px',
                      borderRadius: '12px',
                      background: selectedRole === 'teacher' 
                        ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
                        : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: selectedRole === 'teacher' ? '#ffffff' : '#0B0C0E',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.96rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      marginTop: '0.5rem',
                      boxShadow: selectedRole === 'teacher'
                        ? '0 6px 22px rgba(16, 185, 129, 0.35)'
                        : '0 6px 22px rgba(245, 158, 11, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <UserPlus size={17} />
                    <span>
                      {isSubmitting 
                        ? 'Creating Account...' 
                        : selectedRole === 'teacher' 
                          ? 'Register as Accredited Tutor' 
                          : 'Register Student & Book Assessment'}
                    </span>
                  </button>
                </form>
              )}

              {/* ==================== TAB 3: MAGIC LINK ==================== */}
              {activeTab === 'magiclink' && (
                <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Sign in without entering a password. We will send a secure one-click link to your email address.
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input
                        type="email"
                        required
                        placeholder="e.g. you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        style={{
                          width: '100%',
                          padding: '11px 14px 11px 40px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'rgba(16, 18, 23, 0.9)',
                          color: 'var(--text-primary)',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || authLoading}
                    style={{
                      width: '100%',
                      padding: '13px 20px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: '#0B0C0E',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.96rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      marginTop: '0.5rem',
                      boxShadow: '0 6px 22px rgba(245, 158, 11, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <Send size={16} />
                    <span>{isSubmitting ? 'Sending link...' : 'Send Magic Link to Email'}</span>
                  </button>
                </form>
              )}
              </>
              )}

              {/* Bottom Quick Links */}
              <div style={{
                marginTop: '1.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <span>Need a verified home tutor?</span>
                <Link href="/book-assessment" style={{ color: 'var(--accent-gold)', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>Book Free Assessment</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>

            {/* Right Column: Instant Role Demo Access (Matching 3D Portal / Hero Sandbox) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(59, 130, 246, 0.08))',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '20px',
                padding: '1.3rem 1.5rem',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Zap size={20} color="#F59E0B" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    1-Click Instant Role Sandbox
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                    For instant review and testing. Click any role below to launch the live dashboard directly:
                  </p>
                </div>
              </div>

              {/* Role Cards with Hero Aesthetic */}
              {(['teacher', 'student_parent', 'admin'] as UserRole[]).map((r) => {
                const info = roleInfo[r];
                const Icon = info.icon;

                return (
                  <div
                    key={r}
                    className="role-sandbox-card"
                    style={{
                      background: 'rgba(20, 22, 27, 0.78)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '18px',
                      padding: '1.35rem',
                      boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: `${info.color}18`,
                          border: `1px solid ${info.color}35`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: info.color
                        }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                            {info.title}
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {info.subtitle}
                          </span>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '20px',
                        background: `${info.color}15`,
                        border: `1px solid ${info.color}30`,
                        color: info.color
                      }}>
                        {info.badge}
                      </span>
                    </div>

                    <div style={{
                      background: 'rgba(11, 12, 14, 0.85)',
                      border: '1px solid var(--border-color)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>Demo Profile:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{info.demoName}</strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => loginAs(r)}
                      disabled={authLoading}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: r === 'teacher' 
                          ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                          : r === 'admin' 
                            ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                            : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        color: '#ffffff',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: `0 4px 14px ${info.color}35`,
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <span>Launch as {info.demoName}</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                );
              })}

            </div>

          </div>

        </div>
      </main>

      <style jsx global>{`
        .form-input {
          transition: all 0.2s ease !important;
        }
        .form-input:focus {
          border-color: #F59E0B !important;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.22) !important;
          outline: none !important;
          background: rgba(22, 24, 30, 0.98) !important;
        }
        .form-input::placeholder {
          color: var(--text-tertiary, #94a3b8) !important;
          opacity: 0.75 !important;
        }
        .role-sandbox-card {
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease !important;
        }
        .role-sandbox-card:hover {
          transform: translateY(-2px);
          border-color: rgba(245, 158, 11, 0.35) !important;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.45) !important;
        }
      `}</style>

      <Footer />
    </>
  );
}
