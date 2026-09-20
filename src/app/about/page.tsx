'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, BookOpen, Users, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <Navbar />

      <section style={{
        background: 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.14) 0%, var(--bg-main) 100%)',
        color: 'var(--text-primary)',
        padding: '4rem 0 3.5rem 0',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>ABOUT HORIZON</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 900 }}>
            Managed Home Tuition for Classes 5–12
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
            The Right Tutor. For Your Child.
          </p>
        </div>
      </section>

      <main style={{ padding: '4rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="dark-card" style={{ padding: '3rem 2.5rem', marginBottom: '3rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', marginBottom: '1.25rem', fontWeight: 900 }}>
              Our Philosophy
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
              Horizon was founded on a simple principle: <strong style={{ color: 'var(--text-primary)' }}>Parents shouldn’t have to search, compare, coordinate and manage home tuition all by themselves.</strong>
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.75 }}>
              Unlike generic marketplaces that merely hand out phone numbers, Horizon provides a complete managed tuition service — taking care of diagnostic academic assessment, background verification, matching, trial sessions, progress monitoring, and tutor replacement protection.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/book-assessment" className="btn btn-gold" style={{ fontSize: '1.1rem', padding: '1.1rem 2.4rem', borderRadius: '30px' }}>
              {t.bookAssessmentCTA} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
