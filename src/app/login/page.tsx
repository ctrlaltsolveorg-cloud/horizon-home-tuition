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
  CheckCircle2, 
  School,
  FileSpreadsheet,
  Award
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const { loginAs, loginWithEmail, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student_parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter a valid email');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    const ok = await loginWithEmail(email, selectedRole);
    if (!ok) {
      setErrorMsg('Failed to log in. Please try demo login.');
    }
    setIsSubmitting(false);
  };

  const handleDemoLogin = (role: UserRole) => {
    loginAs(role);
  };

  const roleConfigs = {
    student_parent: {
      title: 'Student & Parent Portal',
      subtitle: 'छात्र एवं अभिभावक लॉगिन',
      icon: GraduationCap,
      color: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      accentBg: 'rgba(37, 99, 235, 0.08)',
      borderColor: 'rgba(37, 99, 235, 0.25)',
      description: 'Check when enquiry was submitted, diagnostic test schedule date & score, fee payment history, monthly progress cards, and your assigned teacher profile.',
      highlights: [
        'Enquiry & Test Schedule Timeline',
        'Fee Payment Status & Receipt Details',
        'Detailed Monthly Progress Reports with Metrics',
        'Assigned Teacher Profile Card'
      ],
      demoLabel: 'Login as Aaryan (Student/Parent)'
    },
    teacher: {
      title: 'Teacher & Tutor Workspace',
      subtitle: 'शिक्षक एवं ट्यूटर पोर्टल',
      icon: BookOpen,
      color: 'linear-gradient(135deg, #059669, #10b981)',
      accentBg: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.25)',
      description: 'Manage and update your teaching profile in Supabase forever (e.g. PCE Purnia, B.Tech 3rd sem with 7.2 CGPA, Hindi medium comfort, 3+ years experience). View assigned students & submit monthly reports.',
      highlights: [
        'Live Editable Profile (College, CGPA, Medium)',
        'Saved permanently in Supabase database',
        'Assigned Students Roster',
        'Monthly Report Submission Engine'
      ],
      demoLabel: 'Login as Harshit Patel (Teacher)'
    },
    admin: {
      title: 'Developer & Admin Suite',
      subtitle: 'प्रशासक एवं डेवलपर कंट्रोल',
      icon: ShieldCheck,
      color: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
      accentBg: 'rgba(124, 58, 237, 0.08)',
      borderColor: 'rgba(124, 58, 237, 0.25)',
      description: 'Full supervisory oversight: view all user profiles, assign teachers to students, schedule diagnostic assessments, log fee transactions, and manage monthly reports.',
      highlights: [
        'Complete Database Management',
        'Teacher-Student Matching Engine',
        'Fee & Assessment Administration',
        'System Metrics & Supabase Sync'
      ],
      demoLabel: 'Login as Horizon Admin'
    }
  };

  const currentConfig = roleConfigs[selectedRole];
  const IconComponent = currentConfig.icon;

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '88vh',
        background: 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.06), transparent 70%), var(--bg-primary)',
        padding: '3rem 1rem 5rem'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Header */}
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
              <Sparkles size={16} /> Multi-Role Supabase Cloud Portal
            </div>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              Welcome to HORIZON Portal
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
              Select your user type to access your personalized dashboard backed permanently by Supabase.
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {(['student_parent', 'teacher', 'admin'] as UserRole[]).map((r) => {
              const cfg = roleConfigs[r];
              const Icon = cfg.icon;
              const isSelected = selectedRole === r;

              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setSelectedRole(r); setErrorMsg(''); }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '1.25rem 1.25rem',
                    borderRadius: '16px',
                    border: isSelected ? `2px solid var(--primary)` : '1px solid var(--border-color)',
                    background: isSelected ? cfg.accentBg : 'var(--card-bg)',
                    boxShadow: isSelected ? '0 8px 24px rgba(37, 99, 235, 0.12)' : '0 2px 8px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: cfg.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}>
                      <Icon size={22} />
                    </div>
                    {isSelected && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        background: 'rgba(37, 99, 235, 0.12)',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        <CheckCircle2 size={13} /> Active
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                    {cfg.title.split(' Portal')[0].split(' Workspace')[0].split(' Suite')[0]}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {cfg.subtitle}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Login Card Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem'
          }}>
            <div style={{
              background: 'var(--card-bg)',
              border: `1px solid ${currentConfig.borderColor}`,
              borderRadius: '20px',
              padding: '2.2rem',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.05)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center'
            }}>
              
              {/* Left Column: Role Details & Features */}
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  marginBottom: '0.75rem'
                }}>
                  <IconComponent size={20} />
                  <span>{currentConfig.title}</span>
                </div>

                <h2 style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem'
                }}>
                  {selectedRole === 'student_parent' && 'Parent & Student Dashboard'}
                  {selectedRole === 'teacher' && 'Teacher Accreditation & Profile Workspace'}
                  {selectedRole === 'admin' && 'Developer & Admin Master Panel'}
                </h2>

                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem'
                }}>
                  {currentConfig.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
                  {currentConfig.highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* 1-Click Demo Login */}
                <div style={{
                  padding: '1.2rem',
                  background: currentConfig.accentBg,
                  borderRadius: '14px',
                  border: `1px dashed ${currentConfig.borderColor}`
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    QUICK INSTANT TEST (RECOMMENDED)
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin(selectedRole)}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px 18px',
                      borderRadius: '10px',
                      background: currentConfig.color,
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <span>{currentConfig.demoLabel}</span>
                    <ArrowRight size={18} />
                  </button>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'center' }}>
                    Demo user: {DEMO_USERS[selectedRole].name} ({DEMO_USERS[selectedRole].email})
                  </div>
                </div>
              </div>

              {/* Right Column: Custom Email Login Form */}
              <div style={{
                background: 'var(--bg-primary)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid var(--border-color)'
              }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Or Log in with Your Email
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Syncs with your custom Supabase user profile.
                </p>

                {errorMsg && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    marginBottom: '1rem'
                  }}>
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input
                        type="email"
                        required
                        placeholder={DEMO_USERS[selectedRole].email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px 11px 40px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--card-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Password (Optional for Demo)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px 11px 40px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--card-bg)',
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
                      padding: '12px 18px',
                      borderRadius: '10px',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      marginTop: '0.5rem',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }}
                  >
                    {isSubmitting ? 'Logging in...' : 'Sign In / Register to Dashboard'}
                  </button>
                </form>

                <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Need a home tutor or want to register?{' '}
                  <Link href="/book-assessment" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    Book Free Assessment
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
