'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import { supabase, Profile } from '@/lib/supabase';

export type UserRole = 'student_parent' | 'teacher' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  isDemo?: boolean;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  confirmationSent?: boolean;
  requiresEmailConfirmation?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  session: Session | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, metadata: { fullName: string; phone?: string; role: UserRole }) => Promise<AuthResponse>;
  signInWithOtp: (email: string) => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  loginAs: (role: UserRole, customEmail?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default demo users for immediate testing & evaluators
export const DEMO_USERS: Record<UserRole, AuthUser> = {
  student_parent: {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Aaryan Sharma (Parent: Ramesh Sharma)',
    email: 'ramesh.sharma@gmail.com',
    role: 'student_parent',
    phone: '+91 98111 22334',
    isDemo: true
  },
  teacher: {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Harshit Patel',
    email: 'harshit.patel@horizon.edu',
    role: 'teacher',
    phone: '+91 98765 43210',
    isDemo: true
  },
  admin: {
    id: '33333333-3333-4333-8333-333333333333',
    name: 'Horizon Admin',
    email: 'admin@horizon.edu',
    role: 'admin',
    phone: '+91 91234 56789',
    isDemo: true
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Helper: map Supabase user + profile into AuthUser
  const buildAuthUser = (sbUser: User, profile?: Profile | null): AuthUser => {
    const meta = sbUser.user_metadata || {};
    const fallbackRole: UserRole = meta.role === 'teacher' || meta.role === 'admin' ? meta.role : 'student_parent';
    const fallbackName = meta.full_name || sbUser.email?.split('@')[0] || 'Horizon User';

    return {
      id: sbUser.id,
      email: sbUser.email || '',
      name: profile?.full_name || fallbackName,
      role: (profile?.role as UserRole) || fallbackRole,
      phone: profile?.phone || meta.phone || '',
      avatar_url: profile?.avatar_url || meta.avatar_url || '',
      isDemo: false
    };
  };

  // Helper: fetch profile from Supabase profiles table
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Could not query profiles table:', error.message);
        return null;
      }
      return data as Profile;
    } catch (e) {
      console.warn('fetchProfile error:', e);
      return null;
    }
  };

  // Helper: ensure profile row exists in Supabase
  const syncProfile = async (sbUser: User, role?: UserRole, fullName?: string, phone?: string) => {
    try {
      const existing = await fetchProfile(sbUser.id);
      if (!existing) {
        const meta = sbUser.user_metadata || {};
        const newProfile: Partial<Profile> = {
          id: sbUser.id,
          email: sbUser.email || '',
          role: role || meta.role || 'student_parent',
          full_name: fullName || meta.full_name || sbUser.email?.split('@')[0] || 'User',
          phone: phone || meta.phone || '',
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase.from('profiles').upsert(newProfile);
        if (error) {
          console.warn('syncProfile upsert error:', error.message);
        }
      }
    } catch (e) {
      console.warn('syncProfile error:', e);
    }
  };

  // Initialize session on mount + subscribe to Supabase auth events
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        // 1. Check active Supabase session
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession?.user) {
          if (!mounted) return;
          setSession(currentSession);
          const profile = await fetchProfile(currentSession.user.id);
          const authUser = buildAuthUser(currentSession.user, profile);
          setUser(authUser);
          localStorage.setItem('horizon_auth_user', JSON.stringify(authUser));
          setLoading(false);
          return;
        }

        // 2. Check saved session (including demo users) in localStorage
        const savedUserStr = localStorage.getItem('horizon_auth_user');
        if (savedUserStr) {
          try {
            const savedUser: AuthUser = JSON.parse(savedUserStr);
            if (mounted) {
              setUser(savedUser);
            }
          } catch (e) {
            localStorage.removeItem('horizon_auth_user');
          }
        }
      } catch (err) {
        console.error('Error during initAuth:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // 3. Listen for Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      setSession(newSession);

      if (event === 'SIGNED_IN' && newSession?.user) {
        const profile = await fetchProfile(newSession.user.id);
        const authUser = buildAuthUser(newSession.user, profile);
        setUser(authUser);
        localStorage.setItem('horizon_auth_user', JSON.stringify(authUser));
      } else if (event === 'SIGNED_OUT') {
        // Only clear if not in demo mode
        const saved = localStorage.getItem('horizon_auth_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!parsed.isDemo) {
            setUser(null);
            localStorage.removeItem('horizon_auth_user');
          }
        } else {
          setUser(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Real Supabase Email & Password Sign In
  const signInWithPassword = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        // Detect email confirmation requirement
        if (error.message.toLowerCase().includes('email not confirmed')) {
          return {
            success: false,
            requiresEmailConfirmation: true,
            error: 'Your email is not confirmed yet. Please check your inbox for the verification link from Supabase, or use the 1-Click Demo Login to explore immediately.'
          };
        }

        if (error.message.toLowerCase().includes('invalid login credentials')) {
          return {
            success: false,
            error: 'Invalid email or password. Please check your details or create a new account.'
          };
        }

        return { success: false, error: error.message };
      }

      if (data?.user) {
        setSession(data.session);
        const profile = await fetchProfile(data.user.id);
        const authUser = buildAuthUser(data.user, profile);
        setUser(authUser);
        localStorage.setItem('horizon_auth_user', JSON.stringify(authUser));

        // Sync profile row if missing
        await syncProfile(data.user, authUser.role);

        // Redirect based on role
        if (authUser.role === 'teacher') {
          router.push('/tutor-dashboard');
        } else if (authUser.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/student-dashboard');
        }

        return { success: true };
      }

      return { success: false, error: 'Login failed: No user returned.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred during sign in.' };
    } finally {
      setLoading(false);
    }
  };

  // Real Supabase Sign Up (Registration)
  const signUp = async (
    email: string,
    password: string,
    metadata: { fullName: string; phone?: string; role: UserRole }
  ): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: metadata.fullName,
            phone: metadata.phone || '',
            role: metadata.role
          },
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined
        }
      });

      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          return {
            success: false,
            error: 'An account with this email already exists. Please switch to the Sign In tab.'
          };
        }
        if (error.message.toLowerCase().includes('rate limit')) {
          return {
            success: false,
            error: 'Email signup rate limit reached by Supabase. Please use 1-Click Demo Login to test the platform immediately.'
          };
        }
        return { success: false, error: error.message };
      }

      if (data?.user) {
        // If session was returned immediately (email confirmation disabled in Supabase)
        if (data.session) {
          setSession(data.session);
          await syncProfile(data.user, metadata.role, metadata.fullName, metadata.phone);
          const authUser = buildAuthUser(data.user, {
            id: data.user.id,
            email: cleanEmail,
            full_name: metadata.fullName,
            role: metadata.role,
            phone: metadata.phone
          });
          setUser(authUser);
          localStorage.setItem('horizon_auth_user', JSON.stringify(authUser));

          if (metadata.role === 'teacher') {
            router.push('/tutor-dashboard');
          } else {
            router.push('/student-dashboard');
          }

          return { success: true };
        } else {
          // Email confirmation is required by Supabase project settings
          return {
            success: true,
            confirmationSent: true
          };
        }
      }

      return { success: false, error: 'Registration could not be completed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred during sign up.' };
    } finally {
      setLoading(false);
    }
  };

  // Real Supabase Magic Link / OTP Sign In
  const signInWithOtp = async (email: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/student-dashboard` : undefined
        }
      });

      if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          return {
            success: false,
            error: 'Email rate limit exceeded. Please use 1-Click Demo Login to access immediately.'
          };
        }
        return { success: false, error: error.message };
      }

      return { success: true, confirmationSent: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send login link.' };
    } finally {
      setLoading(false);
    }
  };

  // Password Reset
  const resetPassword = async (email: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, confirmationSent: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send password reset email.' };
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Instant Demo Login (Student/Parent, Teacher, Admin)
  const loginAs = async (role: UserRole, customEmail?: string) => {
    setLoading(true);
    try {
      let targetUser: AuthUser = { ...DEMO_USERS[role] };

      if (customEmail) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', customEmail)
          .maybeSingle();

        if (data) {
          targetUser = {
            id: data.id,
            name: data.full_name,
            email: data.email,
            role: data.role as UserRole,
            phone: data.phone,
            isDemo: false
          };
        }
      }

      setUser(targetUser);
      localStorage.setItem('horizon_auth_user', JSON.stringify(targetUser));

      // Redirect to appropriate dashboard
      if (role === 'student_parent') {
        router.push('/student-dashboard');
      } else if (role === 'teacher') {
        router.push('/tutor-dashboard');
      } else {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut notice:', e);
    } finally {
      setUser(null);
      setSession(null);
      localStorage.removeItem('horizon_auth_user');
      setLoading(false);
      router.push('/login');
    }
  };

  // Refresh user data from Supabase
  const refreshUser = async () => {
    if (!user || user.isDemo) return;
    try {
      const profile = await fetchProfile(user.id);
      if (profile) {
        const updated: AuthUser = {
          ...user,
          name: profile.full_name,
          phone: profile.phone,
          role: profile.role as UserRole
        };
        setUser(updated);
        localStorage.setItem('horizon_auth_user', JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Error refreshing user:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        session,
        loading,
        signInWithPassword,
        signUp,
        signInWithOtp,
        resetPassword,
        loginAs,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
