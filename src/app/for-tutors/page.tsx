'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { GraduationCap, Briefcase, ShieldCheck, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';

export default function ForTutorsPage() {
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <Navbar />

      <section style={{
        background: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.14) 0%, var(--bg-main) 100%)',
        color: 'var(--text-primary)',
        padding: '4rem 0 3.5rem 0',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-green" style={{ marginBottom: '1rem' }}>TUTOR NETWORK</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 900 }}>
            {t.tutorPitchTitle}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontWeight: 500 }}>
            {t.tutorPitchText}
          </p>
        </div>
      </section>

      <main style={{ padding: '4rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '3.5rem' }}>
            <div className="dark-card" style={{ padding: '2.25rem' }}>
              <Briefcase size={32} color="var(--accent-green)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.65rem', color: 'var(--text-primary)', fontWeight: 800 }}>Genuine Local Students</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                We connect you with serious, verified student requirements in your nearby location, eliminating wasted travel and fake leads.
              </p>
            </div>

            <div className="dark-card" style={{ padding: '2.25rem' }}>
              <UserCheck size={32} color="var(--primary-blue)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.65rem', color: 'var(--text-primary)', fontWeight: 800 }}>Professional Identity</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                Receive an official Horizon Tutor ID Card (with QR verification) and Horizon branded T-Shirt for professional trust.
              </p>
            </div>

            <div className="dark-card" style={{ padding: '2.25rem' }}>
              <ShieldCheck size={32} color="var(--accent-gold)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.65rem', color: 'var(--text-primary)', fontWeight: 800 }}>Operational Support</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                Horizon handles scheduling, parent alignment, requirement changes, and payment coordination so you can focus on teaching.
              </p>
            </div>
          </div>

          {/* ID Card & T-Shirt Promo banner */}
          <div className="dark-card" style={{ background: 'var(--bg-card)', border: '1.5px solid var(--accent-green)', padding: '2.5rem', borderRadius: '24px', marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>EXCLUSIVE TUTOR KIT</span>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 800 }}>
                  Horizon Tutor ID Card & T-Shirt Preview
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Build instant credibility with parents when you wear the official Horizon badge.
                </p>
              </div>
              <Link href="/tutor-card" className="btn btn-gold">
                View 3D ID Card & T-Shirt Concept <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div style={{ textDecoration: 'none', textAlign: 'center' }}>
            <Link href="/become-a-tutor" className="btn btn-gold" style={{ fontSize: '1.1rem', padding: '1.1rem 2.4rem', borderRadius: '30px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF' }}>
              {t.becomeTutorCTA} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
