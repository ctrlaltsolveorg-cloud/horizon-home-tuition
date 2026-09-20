'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Profile, TutorProfile, StudentEnquiry } from '@/lib/supabase';

export type UserRole = 'student_parent' | 'teacher' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  profileData?: any;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  loginAs: (role: UserRole, email?: string) => Promise<void>;
  loginWithEmail: (email: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default demo users for immediate testing
export const DEMO_USERS: Record<UserRole, AuthUser> = {
  student_parent: {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Aaryan Sharma (Parent: Ramesh Sharma)',
    email: 'ramesh.sharma@gmail.com',
    role: 'student_parent',
    phone: '+91 98111 22334'
  },
  teacher: {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Harshit Patel',
    email: 'harshit.patel@horizon.edu',
    role: 'teacher',
    phone: '+91 98765 43210'
  },
  admin: {
    id: '33333333-3333-4333-8333-333333333333',
    name: 'Horizon Admin',
    email: 'admin@horizon.edu',
    role: 'admin',
    phone: '+91 91234 56789'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check saved session in localStorage
    try {
      const savedUser = localStorage.getItem('horizon_auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Error restoring session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginAs = async (role: UserRole, customEmail?: string) => {
    setLoading(true);
    try {
      let targetUser = DEMO_USERS[role];
      if (customEmail) {
        // Look up profile in Supabase
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', customEmail)
          .single();

        if (data) {
          targetUser = {
            id: data.id,
            name: data.full_name,
            email: data.email,
            role: data.role as UserRole,
            phone: data.phone
          };
        }
      }

      setUser(targetUser);
      localStorage.setItem('horizon_auth_user', JSON.stringify(targetUser));

      // Redirect to role dashboard
      if (role === 'student_parent') {
        router.push('/student-dashboard');
      } else if (role === 'teacher') {
        router.push('/tutor-dashboard');
      } else {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, role: UserRole): Promise<boolean> => {
    setLoading(true);
    try {
      // Check if user exists in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (data) {
        const loggedUser: AuthUser = {
          id: data.id,
          name: data.full_name,
          email: data.email,
          role: data.role as UserRole,
          phone: data.phone
        };
        setUser(loggedUser);
        localStorage.setItem('horizon_auth_user', JSON.stringify(loggedUser));
        return true;
      } else {
        // Create new user profile in Supabase
        const newId = crypto.randomUUID ? crypto.randomUUID() : 'user_' + Date.now();
        const defaultName = email.split('@')[0];
        const newProfile = {
          id: newId,
          role: role,
          full_name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
          email: email
        };

        const { error: insertErr } = await supabase.from('profiles').insert([newProfile]);
        if (insertErr) {
          console.warn('Could not insert to Supabase, falling back to local session:', insertErr);
        }

        const newUser: AuthUser = {
          id: newId,
          name: newProfile.full_name,
          email: email,
          role: role
        };

        setUser(newUser);
        localStorage.setItem('horizon_auth_user', JSON.stringify(newUser));
        return true;
      }
    } catch (err) {
      console.error('Error logging in with email:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('horizon_auth_user');
    router.push('/login');
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) {
        const updated: AuthUser = {
          ...user,
          name: data.full_name,
          phone: data.phone
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
        loading,
        loginAs,
        loginWithEmail,
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
