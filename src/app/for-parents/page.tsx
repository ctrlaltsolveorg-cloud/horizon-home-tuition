'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, CheckCircle2, RefreshCw, Users, BookOpen, Award, ArrowRight } from 'lucide-react';

export default function ForParentsPage() {
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
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>PARENTS PEACE OF MIND</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 900 }}>
            {t.parentPitchTitle}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontWeight: 500 }}>
            {t.parentPitchText}
          </p>
        </div>
      </section>

      <main style={{ padding: '4rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '3.5rem' }}>
            <div className="dark-card" style={{ padding: '2.25rem' }}>
              <ShieldCheck size={32} color="var(--accent-green)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.65rem', color: 'var(--text-primary)', fontWeight: 800 }}>Strict Background Verification</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                Every tutor undergoes ID check, academic qualification verification, reference checks, and home safety compliance.
              </p>
            </div>

            <div className="dark-card" style={{ padding: '2.25rem' }}>
              <BookOpen size={32} color="var(--primary-blue)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.65rem', color: 'var(--text-primary)', fontWeight: 800 }}>Diagnostic Student Assessment</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                We don’t randomly assign tutors. We assess your child’s learning gaps, board syllabus needs, and personality compatibility.
              </p>
            </div>

            <div className="dark-card" style={{ padding: '2.25rem' }}>
              <RefreshCw size={32} color="var(--accent-gold)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.65rem', color: 'var(--text-primary)', fontWeight: 800 }}>Zero-Hassle Tutor Replacement</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                If you are unsatisfied with teaching style or schedule changes occur, Horizon replaces the tutor immediately without additional charges.
              </p>
            </div>

            <div className="dark-card" style={{ padding: '2.25rem' }}>
              <Award size={32} color="#9333EA" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.65rem', color: 'var(--text-primary)', fontWeight: 800 }}>Monthly Progress Tracking</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                Receive structured progress logs detailing chapters completed, test scores, homework completion, and areas needing attention.
              </p>
            </div>
          </div>

          <div className="dark-card" style={{ background: 'var(--bg-card)', border: '1.5px solid var(--accent-gold)', padding: '3rem 2rem', textAlign: 'center', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 900 }}>
              Ready to Give Your Child the Horizon Advantage?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', marginBottom: '1.75rem', maxWidth: '600px', margin: '0 auto 1.75rem auto' }}>
              Book a free academic diagnostic assessment today. Our counselor will contact you in your preferred language.
            </p>
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
