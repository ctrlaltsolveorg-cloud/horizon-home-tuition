'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth, UserRole, AuthUser } from '@/context/AuthContext';
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your Google authentication session...');

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      try {
        // 1. Get session from Supabase client
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session?.user) {
          // Listen for onAuthStateChange if session is still exchanging in URL hash
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (newSession?.user && isMounted) {
              await processUserSession(newSession.user);
            }
          });

          // Set fallback timeout
          setTimeout(() => {
            if (isMounted && status === 'loading') {
              setStatus('error');
              setMessage('Authentication timed out. Please try logging in again.');
            }
          }, 6000);

          return () => {
            subscription.unsubscribe();
          };
        }

        if (isMounted) {
          await processUserSession(session.user);
        }
      } catch (err: any) {
        console.error('OAuth Callback Error:', err);
        if (isMounted) {
          setStatus('error');
          setMessage(err.message || 'Failed to complete Google Sign In.');
        }
      }
    }

    async function processUserSession(sbUser: any) {
      const meta = sbUser.user_metadata || {};
      const pendingRole = (localStorage.getItem('horizon_pending_role') as UserRole) || null;
      
      const email = sbUser.email || '';
      const fullName = meta.full_name || meta.name || email.split('@')[0] || 'Horizon User';
      const avatarUrl = meta.avatar_url || meta.picture || '';

      // Check existing profile in database
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .maybeSingle();

      let finalRole: UserRole = 'student_parent';
      if (existingProfile?.role) {
        finalRole = existingProfile.role as UserRole;
      } else if (pendingRole) {
        finalRole = pendingRole;
      } else if (meta.role) {
        finalRole = meta.role;
      }

      // Upsert profile in Supabase profiles table
      const profileToSave = {
        id: sbUser.id,
        email: email,
        full_name: existingProfile?.full_name || fullName,
        role: finalRole,
        phone: existingProfile?.phone || meta.phone || '',
        avatar_url: existingProfile?.avatar_url || avatarUrl,
        updated_at: new Date().toISOString()
      };

      await supabase.from('profiles').upsert(profileToSave);

      // If tutor, ensure tutor_profiles entry exists
      if (finalRole === 'teacher') {
        const { data: existingTutor } = await supabase
          .from('tutor_profiles')
          .select('id')
          .eq('id', sbUser.id)
          .maybeSingle();

        if (!existingTutor) {
          await supabase.from('tutor_profiles').upsert({
            id: sbUser.id,
            user_id: sbUser.id,
            full_name: fullName,
            email: email,
            phone: meta.phone || '',
            college: 'Institution / University',
            degree_status: 'Degree Completed',
            experience_years: '2+ years',
            medium_preference: 'Hindi & English',
            subjects: 'All Subjects',
            rating: 5.0,
            updated_at: new Date().toISOString()
          });
        }
      }

      // If student, ensure student_enquiries entry exists
      if (finalRole === 'student_parent') {
        const { data: existingStudent } = await supabase
          .from('student_enquiries')
          .select('id')
          .eq('student_id', sbUser.id)
          .maybeSingle();

        if (!existingStudent) {
          await supabase.from('student_enquiries').insert([{
            student_id: sbUser.id,
            student_name: fullName,
            parent_name: fullName,
            email: email,
            phone: meta.phone || '',
            class_level: 'Class 9',
            board: 'CBSE',
            school_medium: 'English Medium',
            test_status: 'Active Registered',
            fee_status: 'pending'
          }]);
        }
      }

      // Construct AuthUser object for application state
      const authUser: AuthUser = {
        id: sbUser.id,
        email: email,
        name: existingProfile?.full_name || fullName,
        role: finalRole,
        phone: existingProfile?.phone || meta.phone || '',
        avatar_url: existingProfile?.avatar_url || avatarUrl,
        profileData: meta,
        isDemo: false
      };

      localStorage.setItem('horizon_auth_user', JSON.stringify(authUser));
      localStorage.removeItem('horizon_pending_role');

      if (isMounted) {
        setStatus('success');
        setMessage('Signed in successfully! Redirecting to your dashboard...');
      }

      // Redirect after brief pleasant confirmation
      setTimeout(() => {
        if (finalRole === 'teacher') {
          router.push('/tutor-dashboard');
        } else if (finalRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/student-dashboard');
        }
      }, 1000);
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <Navbar />

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        background: 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.1) 0%, transparent 60%), var(--bg-main)'
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {status === 'loading' && (
            <div>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'var(--accent-gold)'
              }}>
                <Loader2 size={32} className="animate-spin" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Connecting with Google
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {message}
              </p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: '#10B981'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#10B981' }}>
                Authentication Verified
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {message}
              </p>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: '#EF4444'
              }}>
                <AlertCircle size={36} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#EF4444' }}>
                Sign In Issue
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {message}
              </p>
              <button
                onClick={() => router.push('/login')}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
