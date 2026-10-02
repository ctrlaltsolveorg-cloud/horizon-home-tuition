'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  LogIn
} from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if session / recovery token exists in Supabase
  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      try {
        // 1. Check URL parameters for PKCE code or OTP token_hash
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          const tokenHash = params.get('token_hash');
          const type = (params.get('type') as any) || 'recovery';

          if (code) {
            try {
              const { data, error } = await supabase.auth.exchangeCodeForSession(code);
              if (!error && data.session) {
                if (mounted) {
                  setCheckingSession(false);
                }
                return;
              }
            } catch (exchangeErr) {
              console.warn('PKCE exchange attempt:', exchangeErr);
            }
          }

          if (tokenHash) {
            try {
              const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
              if (!error && data.session) {
                if (mounted) {
                  setCheckingSession(false);
                }
                return;
              }
            } catch (otpErr) {
              console.warn('OTP verification attempt:', otpErr);
            }
          }
        }

        // 2. Check if Supabase already holds an active session from the recovery link
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (mounted) {
            setCheckingSession(false);
          }
          return;
        }

        // 3. Check if URL hash contains recovery token
        if (typeof window !== 'undefined' && window.location.hash) {
          const hash = window.location.hash;
          if (hash.includes('access_token=') || hash.includes('type=recovery')) {
            if (mounted) {
              setCheckingSession(false);
            }
            return;
          }
        }

        // 4. Wait for onAuthStateChange
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, newSession: any) => {
          if (!mounted) return;
          if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && newSession)) {
            setCheckingSession(false);
          }
        });

        // 5. Fallback: allow form input anyway so users are never blocked
        setTimeout(() => {
          if (mounted && checkingSession) {
            setCheckingSession(false);
          }
        }, 1500);

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    }

    checkRecoverySession();

    return () => {
      mounted = false;
    };
  }, []);

  // Handle Password Update
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setErrorMsg(error.message || 'Failed to update password. The reset link may have expired.');
        setIsSubmitting(false);
        return;
      }

      setSuccessMsg('Your password has been reset successfully! Redirecting you to sign in...');

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred while saving your password.');
    } finally {
      setIsSubmitting(false);
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
        padding: 'clamp(3rem, 6vw, 5rem) 1rem 6rem',
        overflow: 'hidden'
      }}>
        {/* Subtle Ambient Dot Grid Pattern */}
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
          top: '8%',
          right: '10%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '540px', margin: '0 auto', position: 'relative', zIndex: 2 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
              <KeyRound size={15} color="#F59E0B" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                SECURITY & PASSWORD RECOVERY
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4.5vw, 2.8rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)'
            }}>
              Set Your New{' '}
              <span style={{
                fontFamily: 'serif',
                fontStyle: 'italic',
                fontWeight: 400,
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                paddingRight: '0.2rem'
              }}>
                Password
              </span>
            </h1>

            <p style={{
              fontSize: '0.98rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              margin: '0 auto',
              maxWidth: '440px'
            }}>
              Enter and confirm your new secure password below to regain full access to your HORIZON account.
            </p>
          </div>

          {/* Form Card */}
          <div style={{
            background: 'rgba(20, 22, 27, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '24px',
            padding: 'clamp(1.75rem, 4vw, 2.5rem)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
          }}>

            {/* Error Message */}
            {errorMsg && (
              <div style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>{errorMsg}</div>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div style={{
                padding: '14px 16px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontWeight: 600 }}>{successMsg}</div>
              </div>
            )}

            <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* New Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  New Password (minimum 6 characters)
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              {/* Confirm New Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
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
                  marginTop: '0.5rem',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.25s ease'
                }}
              >
                <KeyRound size={17} />
                <span>{isSubmitting ? 'Saving New Password...' : 'Save Password & Sign In'}</span>
              </button>

              {/* Back to Login link */}
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link
                  href="/login"
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <LogIn size={14} />
                  <span>Return to Sign In</span>
                </Link>
              </div>

            </form>
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
      `}</style>

      <Footer />
    </>
  );
}
