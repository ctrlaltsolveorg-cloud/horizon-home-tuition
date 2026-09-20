'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function SubjectsPage() {
  const { t } = useLanguage();
  const [selectedBoard, setSelectedBoard] = useState<string>('ALL');

  const subjectsList = [
    { name: 'Mathematics', boards: ['CBSE', 'ICSE', 'State Board'], classes: 'Classes 5–12', desc: 'Algebra, Geometry, Trigonometry, Calculus, Statistics.' },
    { name: 'Physics', boards: ['CBSE', 'ICSE', 'State Board'], classes: 'Classes 9–12', desc: 'Mechanics, Electricity, Optics, Modern Physics.' },
    { name: 'Chemistry', boards: ['CBSE', 'ICSE', 'State Board'], classes: 'Classes 9–12', desc: 'Organic, Inorganic & Physical Chemistry.' },
    { name: 'Biology', boards: ['CBSE', 'ICSE', 'State Board'], classes: 'Classes 9–12', desc: 'Botany, Zoology, Genetics, Human Physiology.' },
    { name: 'Science (General)', boards: ['CBSE', 'ICSE', 'State Board'], classes: 'Classes 5–8', desc: 'Integrated science fundamentals and experiments.' },
    { name: 'Accountancy', boards: ['CBSE', 'ICSE', 'State Board'], classes: 'Classes 11–12', desc: 'Financial accounting, Partnership, Company accounts.' },
    { name: 'Economics', boards: ['CBSE', 'ICSE', 'State Board'], classes: 'Classes 9–12', desc: 'Microeconomics, Macroeconomics, Indian Economic Development.' },
    { name: 'Business Studies', boards: ['CBSE', 'ICSE', 'State Board'], classes: 'Classes 11–12', desc: 'Management principles, Finance, Marketing.' },
    { name: 'English Literature & Grammar', boards: ['CBSE', 'ICSE', 'State Board'], classes: 'Classes 5–12', desc: 'Reading comprehension, Writing, Prose & Poetry.' },
    { name: 'Social Studies (SST)', boards: ['CBSE', 'ICSE', 'State Board'], classes: 'Classes 5–10', desc: 'History, Civics, Geography, Economics.' },
  ];

  const filtered = selectedBoard === 'ALL'
    ? subjectsList
    : subjectsList.filter(s => s.boards.includes(selectedBoard));

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
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>SUBJECT CATALOG</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 900 }}>
            {t.subjectsTitle}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Expert home tutors for all major subjects in CBSE, ICSE & State Boards.
          </p>

          {/* Board Filter Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {['ALL', 'CBSE', 'ICSE', 'State Board'].map(b => (
              <button
                key={b}
                onClick={() => setSelectedBoard(b)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '20px',
                  fontWeight: selectedBoard === b ? 700 : 500,
                  fontSize: '0.9rem',
                  border: selectedBoard === b ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-color)',
                  background: selectedBoard === b ? 'var(--accent-gold)' : 'var(--bg-card)',
                  color: selectedBoard === b ? '#0B0C0E' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {b === 'ALL' ? 'All Boards' : b}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main style={{ padding: '4rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '3.5rem' }}>
            {filtered.map((sub, i) => (
              <div key={i} className="dark-card" style={{ borderTop: '4px solid var(--accent-gold)', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', fontWeight: 800 }}>{sub.name}</h3>
                  <span className="badge badge-blue">{sub.classes}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>{sub.desc}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {sub.boards.map(b => (
                    <span key={b} style={{ fontSize: '0.78rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '0.25rem 0.6rem', borderRadius: '6px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
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
