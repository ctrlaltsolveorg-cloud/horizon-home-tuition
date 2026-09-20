'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function ClassesPage() {
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
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>CLASSES 5 TO 12</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 900 }}>
            {t.classesTitle}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Structured, board-aligned home tuition curriculum designed for academic excellence.
          </p>
        </div>
      </section>

      <main style={{ padding: '4rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '950px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem', marginBottom: '3.5rem' }}>
            
            {/* Classes 5-8 */}
            <div className="dark-card" style={{ borderLeft: '6px solid var(--primary-blue)', padding: '2.5rem' }}>
              <span className="badge badge-blue" style={{ marginBottom: '0.85rem' }}>MIDDLE SCHOOL</span>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.65rem', fontWeight: 800 }}>{t.class5_8}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', marginBottom: '1.25rem', lineHeight: 1.65 }}>{t.class5_8_desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                <div>✓ Mathematics (Basic Algebra & Geometry)</div>
                <div>✓ Science (Physics, Chem, Bio intro)</div>
                <div>✓ English Reading & Grammar</div>
                <div>✓ Social Studies & Geography</div>
                <div>✓ Hindi & Language Support</div>
                <div>✓ Daily School Homework Assistance</div>
              </div>
            </div>

            {/* Classes 9-10 */}
            <div className="dark-card" style={{ borderLeft: '6px solid var(--accent-gold)', border: '1.5px solid rgba(245, 158, 11, 0.4)', padding: '2.5rem' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>HIGH SCHOOL & BOARDS</span>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.65rem', fontWeight: 800 }}>{t.class9_10}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', marginBottom: '1.25rem', lineHeight: 1.65 }}>{t.class9_10_desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                <div>✓ Mathematics (Algebra, Trig, Geometry)</div>
                <div>✓ Physics (Motion, Electricity, Light)</div>
                <div>✓ Chemistry (Equations, Acids, Metals)</div>
                <div>✓ Biology (Life Processes, Genetics)</div>
                <div>✓ CBSE/ICSE Board Test Series</div>
                <div>✓ Past 10 Years Question Practice</div>
              </div>
            </div>

            {/* Classes 11-12 */}
            <div className="dark-card" style={{ borderLeft: '6px solid var(--accent-green)', padding: '2.5rem' }}>
              <span className="badge badge-green" style={{ marginBottom: '0.85rem' }}>SENIOR SECONDARY SPECIALIZATION</span>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.65rem', fontWeight: 800 }}>{t.class11_12}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', marginBottom: '1.25rem', lineHeight: 1.65 }}>{t.class11_12_desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                <div>✓ Science Stream: Physics, Chem, Bio, Maths</div>
                <div>✓ Commerce Stream: Accountancy, Economics, BST</div>
                <div>✓ Applied Calculus & Higher Mathematics</div>
                <div>✓ Board Exam & Entrance Prep Support</div>
              </div>
            </div>

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
