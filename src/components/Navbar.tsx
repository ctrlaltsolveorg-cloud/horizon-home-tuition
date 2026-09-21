'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Sun, Moon, Home, PhoneCall, Headphones, Phone, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* BRAND LOGO */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.65rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: 'var(--text-primary)'
          }}>
            HORIZON
          </span>
          <span style={{
            background: 'var(--accent-gold-light)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: 'var(--accent-gold)',
            fontSize: '0.65rem',
            fontWeight: 700,
            padding: '0.15rem 0.5rem',
            borderRadius: '20px',
            letterSpacing: '0.08em',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', whiteSpace: 'nowrap' }}>
          
          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s'
            }}
          >
            {theme === 'dark' ? <Sun size={17} color="#FBBF24" /> : <Moon size={17} color="#3B82F6" />}
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
                padding: '0.28rem 0.55rem',
                fontSize: '0.78rem',
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
                padding: '0.28rem 0.55rem',
                fontSize: '0.78rem',
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

          {/* Portal Login / Authenticated User Dashboard Badge */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link
                href={user.role === 'teacher' ? '/tutor-dashboard' : user.role === 'admin' ? '/admin' : '/student-dashboard'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.42rem 0.85rem',
                  borderRadius: '20px',
                  background: 'rgba(37, 99, 235, 0.1)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: 'var(--primary)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
                title={`Logged in as ${user.name}`}
              >
                <LayoutDashboard size={14} />
                <span>{user.name.split(' ')[0]}</span>
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.45rem 0.9rem',
                borderRadius: '20px',
                background: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                color: 'var(--primary)',
                fontSize: '0.82rem',
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
              padding: '0.55rem 1.25rem',
              fontSize: '0.88rem',
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
              padding: '0.2rem'
            }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
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
