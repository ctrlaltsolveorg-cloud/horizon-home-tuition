'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { lang, setLang, t } = useLanguage();
  const phoneNum = '+919162162128';
  const whatsappNum = '919162162128';

  return (
    <footer className="no-print" style={{
      background: 'var(--bg-main)',
      color: 'var(--text-secondary)',
      paddingTop: '5.5rem',
      paddingBottom: '3.5rem',
      borderTop: '1px solid var(--border-color)',
      transition: 'background 0.3s ease, border-color 0.3s ease'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '3rem',
        marginBottom: '3.5rem'
      }}>
        {/* Col 1: Brand Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '0.08em'
            }}>
              HORIZON
            </span>
            <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>
              MANAGED
            </span>
          </div>
          <p style={{ color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.98rem', marginBottom: '1rem' }}>
            {t.tagline}
          </p>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            {t.footerDesc}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={() => setLang('en')}
              style={{
                padding: '0.45rem 0.9rem',
                fontSize: '0.85rem',
                fontWeight: lang === 'en' ? 700 : 500,
                background: lang === 'en' ? 'var(--text-primary)' : 'var(--bg-card)',
                color: lang === 'en' ? 'var(--bg-main)' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              style={{
                padding: '0.45rem 0.9rem',
                fontSize: '0.85rem',
                fontWeight: lang === 'hi' ? 700 : 500,
                background: lang === 'hi' ? '#F59E0B' : 'var(--bg-card)',
                color: lang === 'hi' ? '#0B0C0E' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Col 2: Support Services */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '1.25rem', fontWeight: 700 }}>
            Feel Free To Ask For
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--accent-gold)' }}>✦</span> Change schedule</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--accent-gold)' }}>✦</span> Tutor issue</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--accent-gold)' }}>✦</span> Feedback</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--accent-gold)' }}>✦</span> Replacement request</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--accent-gold)' }}>✦</span> Payment questions</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--accent-gold)' }}>✦</span> General support</li>
          </ul>
        </div>

        {/* Col 3: Quick Links */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '1.25rem', fontWeight: 700 }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
            <li><Link href="/book-assessment" style={{ color: 'var(--text-secondary)' }}>{t.bookAssessmentCTA}</Link></li>
            <li><Link href="/become-a-tutor" style={{ color: 'var(--text-secondary)' }}>{t.becomeTutorCTA}</Link></li>
            <li><Link href="/how-it-works" style={{ color: 'var(--text-secondary)' }}>{t.navHowItWorks}</Link></li>
            <li><Link href="/tutor-card" style={{ color: 'var(--text-secondary)' }}>Tutor ID Card & T-Shirt Concept</Link></li>
            <li><Link href="/logo" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>✨ Logo Design & Brand Theory</Link></li>
            <li><Link href="/flyer" style={{ color: 'var(--primary-blue)' }}>📄 Print Parent Marketing Flyer</Link></li>
            <li><Link href="/admin" style={{ color: 'var(--accent-gold)' }}>🔒 Admin Portal</Link></li>
          </ul>
        </div>

        {/* Col 4: Contact Us */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '1.25rem', fontWeight: 700 }}>
            Contact Us
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
            <a href="mailto:Ctrl.alt.solve.org@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)' }}>
              <Mail size={18} color="var(--accent-gold)" /> Ctrl.alt.solve.org@gmail.com
            </a>
            <a href={`tel:${phoneNum}`} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)' }}>
              <Phone size={18} color="var(--accent-red)" /> +91 9162162128
            </a>
            <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)' }}>
              <MessageCircle size={18} color="#25D366" /> WhatsApp (+91 9162162128)
            </a>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', color: 'var(--text-secondary)' }}>
              <MapPin size={18} color="#EF4444" style={{ marginTop: '3px' }} /> Delhi NCR (South Delhi, Gurgaon, Noida, West Delhi, North Delhi)
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{
        borderTop: '1px solid var(--border-color)',
        paddingTop: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.25rem',
        fontSize: '0.88rem'
      }}>
        <div>
          © {new Date().getFullYear()} HORIZON. {t.rightsReserved}
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'var(--text-secondary)' }}>Terms & Policy</Link>
          <Link href="/admin" style={{ color: 'var(--accent-gold)' }}>Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
