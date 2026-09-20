'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth, UserRole, DEMO_USERS } from '@/context/AuthContext';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  Phone,
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Send,
  KeyRound,
  UserPlus,
  LogIn,
  Zap,
  HelpCircle,
  Database
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type AuthTab = 'signin' | 'signup' | 'magiclink';

export default function LoginPage() {
  const { 
    signInWithPassword, 
    signUp, 
    signInWithOtp, 
    resetPassword, 
    loginAs, 
    loading: authLoading, 
    user 
  } = useAuth();

  // Active Tab: Sign In, Sign Up, Magic Link
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  
  // Role selector for sign up / role context
  const [selectedRole, setSelectedRole] = useState<UserRole>('student_parent');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Handle Sign In (Email + Password)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    setEmailConfirmationRequired(false);

    const res = await signInWithPassword(email, password);

    if (res.success) {
      setSuccessMsg('Signed in successfully! Redirecting to your dashboard...');
    } else {
      if (res.requiresEmailConfirmation) {
        setEmailConfirmationRequired(true);
        setErrorMsg(res.error || 'Email not confirmed yet.');
      } else {
        setErrorMsg(res.error || 'Failed to sign in. Please check your credentials.');
      }
    }
    setIsSubmitting(false);
  };

  // Handle Sign Up (Register New Account)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setErrorMsg('Please enter your full name, email, and a secure password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    setEmailConfirmationRequired(false);

    const res = await signUp(email, password, {
      fullName: fullName.trim(),
      phone: phoneNumber.trim(),
      role: selectedRole
    });

    if (res.success) {
      if (res.confirmationSent) {
        setEmailConfirmationRequired(true);
        setSuccessMsg(`Account created in Supabase! A verification email has been sent to ${email}. Please confirm your email to activate.`);
      } else {
        setSuccessMsg('Account created & profile registered in Supabase! Redirecting...');
      }
    } else {
      setErrorMsg(res.error || 'Registration failed. Please try again.');
    }
    setIsSubmitting(false);
  };

  // Handle Magic Link (OTP)
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await signInWithOtp(email);
    if (res.success) {
      setSuccessMsg(`Magic login link dispatched! Check your email (${email}) to log in instantly.`);
    } else {
      setErrorMsg(res.error || 'Failed to send login link. Please try demo login or password login.');
    }
    setIsSubmitting(false);
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address above to receive password reset instructions.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    const res = await resetPassword(email);
    if (res.success) {
      setResetEmailSent(true);
      setSuccessMsg(`Password reset instructions sent to ${email}.`);
    } else {
      setErrorMsg(res.error || 'Failed to send password reset email.');
    }
    setIsSubmitting(false);
  };

  // 1-Click Instant Demo Login
  const handleDemoLogin = (role: UserRole) => {
    loginAs(role);
  };

  const roleDetails = {
    student_parent: {
      title: 'Student & Parent Portal',
      subtitle: 'छात्र एवं अभिभावक लॉगिन',
      icon: GraduationCap,
      badge: 'Learner / Guardian',
      accentColor: '#2563eb',
      lightBg: 'rgba(37, 99, 235, 0.08)',
      borderColor: 'rgba(37, 99, 235, 0.25)',
      description: 'Access diagnostic assessment marks (88%), scheduled tutor visits, fee payment receipts, and monthly performance report cards.',
      demoUser: DEMO_USERS.student_parent
    },
    teacher: {
      title: 'Teacher & Tutor Workspace',
      subtitle: 'शिक्षक एवं ट्यूटर पोर्टल',
      icon: BookOpen,
      badge: 'Accredited Tutor',
      accentColor: '#10b981',
      lightBg: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.25)',
      description: 'Live profile management (PCE Purnia, 7.2 CGPA, Hindi medium preference), assigned student roster, and monthly academic report filing.',
      demoUser: DEMO_USERS.teacher
    },
    admin: {
      title: 'Horizon Master Admin',
      subtitle: 'प्रशासक एवं डेवलपर कंट्रोल',
      icon: ShieldCheck,
      badge: 'Super Admin',
      accentColor: '#7c3aed',
      lightBg: 'rgba(124, 58, 237, 0.08)',
      borderColor: 'rgba(124, 58, 237, 0.25)',
      description: 'Full supervisory controls: teacher-student matching engine, diagnostic test scheduling, fee ledger tracking, and database synchronization.',
      demoUser: DEMO_USERS.admin
    }
  };

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '90vh',
        background: 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.06), transparent 70%), var(--bg-primary)',
        padding: '3rem 1rem 5rem'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              <Database size={15} /> Supabase PostgreSQL Cloud Authentication
            </div>
            <h1 style={{
              fontSize: 'clamp(1.85rem, 4vw, 2.7rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em'
            }}>
              Welcome to HORIZON Portal
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
              Sign in or create your account to access student diagnostic progress, tutor verification, and personalized home tuition workspaces.
            </p>
          </div>

          {/* Already Logged In Quick Notice */}
          {user && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '14px',
              padding: '1rem 1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color="#10b981" />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    Currently logged in as: <span style={{ color: '#10b981' }}>{user.name}</span> ({user.role})
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {user.email} {user.isDemo && '• [Demo Session]'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  href={user.role === 'teacher' ? '/tutor-dashboard' : user.role === 'admin' ? '/admin' : '/student-dashboard'}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}

          {/* Main Grid: Form Container + Instant Demo Sandbox */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}>

            {/* Left Card: Supabase Auth Forms (Sign In, Sign Up, Magic Link) */}
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 12px 36px rgba(0,0,0,0.04)'
            }}>
              
              {/* Tab Selector */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '6px',
                background: 'var(--bg-primary)',
                padding: '4px',
                borderRadius: '12px',
                marginBottom: '1.75rem',
                border: '1px solid var(--border-color)'
              }}>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: activeTab === 'signin' ? 700 : 500,
                    background: activeTab === 'signin' ? 'var(--card-bg)' : 'transparent',
                    color: activeTab === 'signin' ? 'var(--primary)' : 'var(--text-secondary)',
                    border: 'none',
                    boxShadow: activeTab === 'signin' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
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
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: activeTab === 'signup' ? 700 : 500,
                    background: activeTab === 'signup' ? 'var(--card-bg)' : 'transparent',
                    color: activeTab === 'signup' ? 'var(--primary)' : 'var(--text-secondary)',
                    border: 'none',
                    boxShadow: activeTab === 'signup' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
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
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: activeTab === 'magiclink' ? 700 : 500,
                    background: activeTab === 'magiclink' ? 'var(--card-bg)' : 'transparent',
                    color: activeTab === 'magiclink' ? 'var(--primary)' : 'var(--text-secondary)',
                    border: 'none',
                    boxShadow: activeTab === 'magiclink' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Zap size={15} />
                  <span>Magic Link</span>
                </button>
              </div>

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

              {/* Email confirmation helper alert */}
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
                  <div style={{ fontWeight: 700, marginBottom: '4px' }}>
                    💡 Pro-Tip for Instant Testing:
                  </div>
                  <div>
                    Supabase sends a confirmation email to verify new accounts. If you want to test dashboards right now without checking email, simply use the <strong>1-Click Instant Demo Login</strong> cards on the right!
                  </div>
                </div>
              )}

              {/* ==================== TAB 1: SIGN IN ==================== */}
              {activeTab === 'signin' && (
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
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                          color: 'var(--primary)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
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
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 42px 11px 40px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-primary)',
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

                  {/* Forgot Password Inline Trigger */}
                  {showForgotPassword && (
                    <div style={{
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'rgba(37, 99, 235, 0.05)',
                      border: '1px dashed rgba(37, 99, 235, 0.25)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        Enter your email above and click below to receive a Supabase password reset link:
                      </div>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={isSubmitting}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          background: 'var(--primary)',
                          color: '#fff',
                          border: 'none',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          alignSelf: 'flex-start'
                        }}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Password Reset Email'}
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || authLoading}
                    style={{
                      width: '100%',
                      padding: '12px 18px',
                      borderRadius: '10px',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      marginTop: '0.5rem',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                  >
                    <LogIn size={17} />
                    <span>{isSubmitting ? 'Signing in with Supabase...' : 'Sign In to Portal'}</span>
                  </button>
                </form>
              )}

              {/* ==================== TAB 2: REGISTER / SIGN UP ==================== */}
              {activeTab === 'signup' && (
                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* Account Type Selection */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Register As:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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

                      <button
                        type="button"
                        onClick={() => setSelectedRole('teacher')}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: selectedRole === 'teacher' ? '2px solid #10b981' : '1px solid var(--border-color)',
                          background: selectedRole === 'teacher' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-primary)',
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
                        <BookOpen size={16} color="#10b981" />
                        <span>Teacher / Tutor</span>
                      </button>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input
                        type="text"
                        required
                        placeholder={selectedRole === 'student_parent' ? 'e.g. Ramesh Sharma' : 'e.g. Harshit Patel'}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 40px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          fontSize: '0.92rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                      Phone / WhatsApp Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 40px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          fontSize: '0.92rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 40px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          fontSize: '0.92rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                      Password (min 6 characters)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 42px 10px 40px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          fontSize: '0.92rem'
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
                          cursor: 'pointer'
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || authLoading}
                    style={{
                      width: '100%',
                      padding: '12px 18px',
                      borderRadius: '10px',
                      background: selectedRole === 'teacher' ? '#10b981' : 'var(--primary)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      marginTop: '0.5rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <UserPlus size={17} />
                    <span>{isSubmitting ? 'Registering with Supabase...' : `Register as ${selectedRole === 'teacher' ? 'Teacher' : 'Student/Parent'}`}</span>
                  </button>
                </form>
              )}

              {/* ==================== TAB 3: MAGIC LINK / OTP ==================== */}
              {activeTab === 'magiclink' && (
                <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    No password required. We'll send a secure one-click sign-in link via Supabase Auth directly to your email.
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
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                  <button
                    type="submit"
                    disabled={isSubmitting || authLoading}
                    style={{
                      width: '100%',
                      padding: '12px 18px',
                      borderRadius: '10px',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      marginTop: '0.5rem',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Send size={16} />
                    <span>{isSubmitting ? 'Sending Magic Link...' : 'Send Magic Link to Email'}</span>
                  </button>
                </form>
              )}

              {/* Bottom Quick Links */}
              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1.2rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <span>Need a verified home tutor?</span>
                <Link href="/book-assessment" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                  Book Free Assessment →
                </Link>
              </div>

            </div>

            {/* Right Column: 1-Click Instant Demo Sandbox (for Judges / Evaluators) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Sandbox Intro Badge */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(37, 99, 235, 0.08))',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <Zap size={22} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    1-Click Instant Sandbox Access
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                    Instant testing accounts pre-configured with full data in Supabase. Click any role below to test the corresponding live dashboard immediately:
                  </p>
                </div>
              </div>

              {/* Demo Role Cards */}
              {(['student_parent', 'teacher', 'admin'] as UserRole[]).map((r) => {
                const cfg = roleDetails[r];
                const Icon = cfg.icon;

                return (
                  <div
                    key={r}
                    style={{
                      background: 'var(--card-bg)',
                      border: `1px solid ${cfg.borderColor}`,
                      borderRadius: '16px',
                      padding: '1.4rem',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: cfg.lightBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: cfg.accentColor
                        }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                            {cfg.title}
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {cfg.subtitle}
                          </span>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: cfg.lightBg,
                        color: cfg.accentColor
                      }}>
                        {cfg.badge}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                      {cfg.description}
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-primary)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <span>Demo Account:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{cfg.demoUser.name.split(' (')[0]}</strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDemoLogin(r)}
                      disabled={authLoading}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: cfg.accentColor,
                        color: '#ffffff',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: `0 4px 12px ${cfg.accentColor}33`
                      }}
                    >
                      <span>Launch as {cfg.demoUser.name.split(' ')[0]}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                );
              })}

            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
