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
  profileData?: any;
  isDemo?: boolean;
}

export interface TeacherExtraData {
  college?: string;
  degreeStatus?: string;
  experienceYears?: string;
  mediumPreference?: string;
  subjects?: string;
  bio?: string;
}

export interface StudentExtraData {
  parentName?: string;
  classLevel?: string;
  board?: string;
  schoolMedium?: string;
  address?: string;
}

export interface SignUpMetadata extends TeacherExtraData, StudentExtraData {
  fullName: string;
  phone?: string;
  role: UserRole;
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
  signUp: (email: string, password: string, metadata: SignUpMetadata) => Promise<AuthResponse>;
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
    profileData: {
      college: 'PCE PURNIA',
      degree_status: 'B.Tech/BS: 3rd sem with 7.2 CGPA',
      experience_years: '3+ years teaching experience',
      medium_preference: 'Hindi medium only',
      subjects: 'Mathematics, Science, Foundation Physics',
      bio_and_custom_notes: 'Dedicated home tutor from PCE Purnia. Specialized in CBSE and Bihar State Board Hindi-medium students.'
    },
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
      profileData: meta,
      isDemo: false
    };
  };

  // Helper: fetch profile from profiles table
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) return null;
      return data as Profile;
    } catch {
      return null;
    }
  };

  // Initialize session on mount + subscribe to Supabase auth events
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
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

        const savedUserStr = localStorage.getItem('horizon_auth_user');
        if (savedUserStr) {
          try {
            const savedUser: AuthUser = JSON.parse(savedUserStr);
            if (mounted) {
              setUser(savedUser);
            }
          } catch {
            localStorage.removeItem('horizon_auth_user');
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      setSession(newSession);

      if (event === 'SIGNED_IN' && newSession?.user) {
        const profile = await fetchProfile(newSession.user.id);
        const authUser = buildAuthUser(newSession.user, profile);
        setUser(authUser);
        localStorage.setItem('horizon_auth_user', JSON.stringify(authUser));
      } else if (event === 'SIGNED_OUT') {
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

  // Email & Password Sign In
  const signInWithPassword = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          return {
            success: false,
            requiresEmailConfirmation: true,
            error: 'Your email is not confirmed yet. Please check your inbox for the verification link, or use the Instant Demo button to log in directly.'
          };
        }

        if (error.message.toLowerCase().includes('invalid login credentials')) {
          return {
            success: false,
            error: 'Incorrect email or password. Please verify your credentials or register a new account.'
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

        if (authUser.role === 'teacher') {
          router.push('/tutor-dashboard');
        } else if (authUser.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/student-dashboard');
        }

        return { success: true };
      }

      return { success: false, error: 'Login could not be completed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred during sign in.' };
    } finally {
      setLoading(false);
    }
  };

  // Sign Up with comprehensive details taken right at registration
  const signUp = async (
    email: string,
    password: string,
    metadata: SignUpMetadata
  ): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      
      // Store all fields in user_metadata so they persist permanently with auth
      const userMetadata: Record<string, any> = {
        full_name: metadata.fullName.trim(),
        phone: metadata.phone?.trim() || '',
        role: metadata.role,
        college: metadata.college?.trim() || '',
        degree_status: metadata.degreeStatus?.trim() || '',
        experience_years: metadata.experienceYears?.trim() || '',
        medium_preference: metadata.mediumPreference?.trim() || '',
        subjects: metadata.subjects?.trim() || '',
        bio: metadata.bio?.trim() || '',
        parent_name: metadata.parentName?.trim() || '',
        class_level: metadata.classLevel?.trim() || '',
        board: metadata.board?.trim() || '',
        school_medium: metadata.schoolMedium?.trim() || '',
        address: metadata.address?.trim() || ''
      };

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: userMetadata,
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
            error: 'Email signup rate limit reached. Please use Instant Role Demo to test immediately.'
          };
        }
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const userId = data.user.id;

        // 1. Upsert into public.profiles
        await supabase.from('profiles').upsert({
          id: userId,
          email: cleanEmail,
          role: metadata.role,
          full_name: metadata.fullName.trim(),
          phone: metadata.phone?.trim() || '',
          updated_at: new Date().toISOString()
        });

        // 2. If Teacher: save directly to tutor_profiles with all the details entered during registration!
        if (metadata.role === 'teacher') {
          await supabase.from('tutor_profiles').upsert({
            id: userId,
            user_id: userId,
            full_name: metadata.fullName.trim(),
            college: metadata.college?.trim() || 'Institution / College',
            degree_status: metadata.degreeStatus?.trim() || 'Degree / Qualification',
            experience_years: metadata.experienceYears?.trim() || '1+ years',
            medium_preference: metadata.mediumPreference?.trim() || 'English / Hindi',
            subjects: metadata.subjects?.trim() || 'General Subjects',
            bio_and_custom_notes: metadata.bio?.trim() || '',
            phone: metadata.phone?.trim() || '',
            email: cleanEmail,
            rating: 5.0,
            updated_at: new Date().toISOString()
          });
        }

        // 3. If Student: create enquiry/student record
        if (metadata.role === 'student_parent') {
          await supabase.from('student_enquiries').insert([{
            student_id: userId,
            student_name: metadata.fullName.trim(),
            parent_name: metadata.parentName?.trim() || metadata.fullName.trim(),
            phone: metadata.phone?.trim() || '',
            email: cleanEmail,
            class_level: metadata.classLevel || 'Class 9',
            board: metadata.board || 'CBSE',
            school_medium: metadata.schoolMedium || 'English Medium',
            address: metadata.address?.trim() || '',
            test_status: 'Assessment Scheduled',
            fee_status: 'pending'
          }]);
        }

        // Check if session was granted immediately (email confirmation disabled)
        if (data.session) {
          setSession(data.session);
          const authUser: AuthUser = {
            id: userId,
            email: cleanEmail,
            name: metadata.fullName.trim(),
            role: metadata.role,
            phone: metadata.phone?.trim() || '',
            profileData: userMetadata,
            isDemo: false
          };
          setUser(authUser);
          localStorage.setItem('horizon_auth_user', JSON.stringify(authUser));

          if (metadata.role === 'teacher') {
            router.push('/tutor-dashboard');
          } else {
            router.push('/student-dashboard');
          }

          return { success: true };
        } else {
          return {
            success: true,
            confirmationSent: true
          };
        }
      }

      return { success: false, error: 'Registration could not be completed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred during registration.' };
    } finally {
      setLoading(false);
    }
  };

  // Magic Link / OTP Sign In
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

  // Instant Demo Role Login (for evaluators & quick testing)
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
      console.warn('SignOut notice:', e);
    } finally {
      setUser(null);
      setSession(null);
      localStorage.removeItem('horizon_auth_user');
      setLoading(false);
      router.push('/login');
    }
  };

  // Refresh user data from profiles
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
