'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import {
  Menu,
  X,
  Sun,
  Moon,
  Home,
  PhoneCall,
  Headphones,
  Phone,
  LogOut,
  LayoutDashboard,
  User,
  Users,
  Award,
  ChevronDown,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="no-print" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      color: 'var(--text-primary)',
      transition: 'background 0.3s ease, border-color 0.3s ease'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '100vw',
        padding: '0 clamp(0.75rem, 2.5vw, 2rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        boxSizing: 'border-box'
      }}>
        {/* BRAND LOGO */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.25rem, 4vw, 1.65rem)',
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: 'var(--text-primary)'
          }}>
            HORIZON
          </span>
          <span style={{
            background: 'var(--accent-gold-light)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: 'var(--accent-gold)',
            fontSize: '0.62rem',
            fontWeight: 700,
            padding: '0.12rem 0.45rem',
            borderRadius: '20px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            MANAGED
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          {/* HOME WITH ICON */}
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: isActive('/') ? 'var(--accent-gold)' : 'var(--text-secondary)',
            fontWeight: isActive('/') ? 700 : 500,
            fontSize: '0.92rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'color 0.2s'
          }} title="Home">
            <Home size={18} color={isActive('/') ? 'var(--accent-gold)' : 'var(--text-secondary)'} />
            <span>{t.navHome}</span>
          </Link>

          <Link href="/how-it-works" style={{
            color: isActive('/how-it-works') ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: isActive('/how-it-works') ? 600 : 400,
            fontSize: '0.92rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}>
            {t.navHowItWorks}
          </Link>
          <Link href="/for-parents" style={{
            color: isActive('/for-parents') ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: isActive('/for-parents') ? 600 : 400,
            fontSize: '0.92rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}>
            {t.navForParents}
          </Link>
          <Link href="/for-tutors" style={{
            color: isActive('/for-tutors') ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: isActive('/for-tutors') ? 600 : 400,
            fontSize: '0.92rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}>
            {t.navForTutors}
          </Link>
          <Link href="/faq" style={{
            color: isActive('/faq') ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: isActive('/faq') ? 600 : 400,
            fontSize: '0.92rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}>
            {t.navFAQ}
          </Link>

          {/* CONTACT WITH ICON */}
          <Link href="/contact" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: isActive('/contact') ? 'var(--accent-gold)' : 'var(--text-secondary)',
            fontWeight: isActive('/contact') ? 700 : 500,
            fontSize: '0.92rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'color 0.2s'
          }} title="Contact Support">
            <PhoneCall size={17} color={isActive('/contact') ? 'var(--accent-gold)' : 'var(--text-secondary)'} />
            <span>{t.navContact}</span>
          </Link>
        </nav>

        {/* RIGHT ACTIONS — Theme Switcher, Language Switcher & Primary CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
          
          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s'
            }}
          >
            {theme === 'dark' ? <Sun size={15} color="#FBBF24" /> : <Moon size={15} color="#3B82F6" />}
          </button>

          {/* Language Switcher */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-input)',
            padding: '2px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setLang('en')}
              style={{
                padding: '0.22rem 0.45rem',
                fontSize: '0.72rem',
                fontWeight: lang === 'en' ? 700 : 500,
                background: lang === 'en' ? 'var(--text-primary)' : 'transparent',
                color: lang === 'en' ? 'var(--bg-main)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer'
              }}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              style={{
                padding: '0.22rem 0.45rem',
                fontSize: '0.72rem',
                fontWeight: lang === 'hi' ? 700 : 500,
                background: lang === 'hi' ? '#F59E0B' : 'transparent',
                color: lang === 'hi' ? '#0B0C0E' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer'
              }}
            >
              हिंदी
            </button>
          </div>

          {/* USER PROFILE AVATAR CIRCLE & DROPDOWN */}
          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: userDropdownOpen ? 'var(--bg-card-hover)' : 'var(--bg-input)',
                  border: userDropdownOpen ? '1px solid #F59E0B' : '1px solid var(--border-color)',
                  padding: '3px 8px 3px 3px',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: 'var(--shadow-sm)'
                }}
                aria-label="User profile menu"
                aria-expanded={userDropdownOpen}
              >
                {/* Profile Circle with User Initial */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: user.role === 'teacher' 
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' 
                    : user.role === 'admin'
                    ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)'
                    : 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  flexShrink: 0
                }}>
                  {user.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
                </div>

                <span className="desktop-only" style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  maxWidth: '90px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {user.name.split(' ')[0]}
                </span>

                <ChevronDown
                  size={14}
                  color="var(--text-secondary)"
                  style={{
                    transform: userDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    flexShrink: 0
                  }}
                />
              </button>

              {/* DROPDOWN POPUP MENU */}
              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '230px',
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
                  zIndex: 200,
                  padding: '6px'
                }}>
                  {/* User Card Header */}
                  <div style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid var(--border-color)',
                    marginBottom: '4px'
                  }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '10px',
                        background: user.role === 'teacher' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: user.role === 'teacher' ? '#F59E0B' : '#3B82F6',
                        textTransform: 'uppercase'
                      }}>
                        {user.role === 'teacher' ? 'Certified Tutor' : user.role === 'admin' ? 'Admin' : 'Student'}
                      </span>
                    </div>
                  </div>

                  {/* Option 1: Dashboard */}
                  <Link
                    href={user.role === 'teacher' ? '/tutor-dashboard' : user.role === 'admin' ? '/admin' : '/student-dashboard'}
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LayoutDashboard size={16} color="#3B82F6" />
                    <span>My Dashboard</span>
                  </Link>

                  {/* Option 2: Students / Classes */}
                  <Link
                    href={user.role === 'teacher' ? '/tutor-dashboard' : '/student-dashboard'}
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Users size={16} color="#10B981" />
                    <span>My Students</span>
                  </Link>

                  {/* Option 3: Manage Profile */}
                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <User size={16} color="#F59E0B" />
                    <span>Manage Profile</span>
                  </Link>

                  {/* Option 4: Reports */}
                  <Link
                    href="/report-card"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Award size={16} color="#06B6D4" />
                    <span>Progress Reports</span>
                  </Link>

                  <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />

                  {/* Option 5: Logout */}
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#EF4444',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={16} color="#EF4444" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="desktop-only"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                background: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                color: 'var(--primary)',
                fontSize: '0.80rem',
                fontWeight: 700,
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Portal Login
            </Link>
          )}

          {/* Primary CTA */}
          <Link
            href="/book-assessment"
            className="btn btn-gold desktop-only"
            style={{
              padding: '0.5rem 1.15rem',
              fontSize: '0.85rem',
              borderRadius: '24px',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            {t.bookAssessmentCTA}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'none',
              padding: '0.2rem',
              marginLeft: '0.2rem'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-main)',
          borderTop: '1px solid var(--border-color)',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem'
        }}>
          <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', fontSize: '1.05rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={18} color="var(--accent-gold)" /> {t.navHome}
          </Link>
          <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', fontSize: '1rem', textDecoration: 'none' }}>
            {t.navHowItWorks}
          </Link>
          <Link href="/for-parents" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', fontSize: '1rem', textDecoration: 'none' }}>
            {t.navForParents}
          </Link>
          <Link href="/for-tutors" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', fontSize: '1rem', textDecoration: 'none' }}>
            {t.navForTutors}
          </Link>
          <Link href="/faq" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', fontSize: '1rem', textDecoration: 'none' }}>
            {t.navFAQ}
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PhoneCall size={17} color="var(--accent-gold)" /> {t.navContact}
          </Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#F59E0B', fontSize: '1rem', textDecoration: 'none' }}>
            🔒 {t.navAdmin}
          </Link>

          {/* Mobile Auth Status */}
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <Link
                href={user.role === 'teacher' ? '/tutor-dashboard' : user.role === 'admin' ? '/admin' : '/student-dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none'
                }}
              >
                <LayoutDashboard size={18} /> My Dashboard ({user.name.split(' ')[0]})
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textDecoration: 'none'
                }}
              >
                <User size={18} /> Manage Profile
              </Link>
              <button
                type="button"
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}
            >
              Portal Login / Sign In →
            </Link>
          )}

          <Link
            href="/book-assessment"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-gold"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', borderRadius: '24px', textAlign: 'center', marginTop: '0.5rem' }}
          >
            {t.bookAssessmentCTA}
          </Link>
        </div>
      )}
    </header>
  );
}
