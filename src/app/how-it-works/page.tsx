'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, CheckCircle2, ShieldCheck, RefreshCw, Users, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  const { lang, t } = useLanguage();

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
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>MANAGED HOME TUITION PROCESS</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 900 }}>
            {t.howTitle}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {t.howSubtitle}
          </p>
        </div>
      </section>

      <main style={{ padding: '4rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '900px' }}>

          {/* Detailed 5 steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
            {[
              { num: '01', title: t.step1Title, desc: t.step1Desc, detail: 'Parents share the child’s class, board, subjects, location, and preferred timing. Horizon counselor takes note of student’s school medium and learning goals.' },
              { num: '02', title: t.step2Title, desc: t.step2Desc, detail: 'Horizon academic expert conducts a diagnostic assessment to analyze strengths, weaknesses, and specific chapters needing focus.' },
              { num: '03', title: t.step3Title, desc: t.step3Desc, detail: 'We search our network of 100% background-verified tutors to find an exact match in subject mastery, board experience, and geographic proximity.' },
              { num: '04', title: t.step4Title, desc: t.step4Desc, detail: 'A demo trial session is conducted at your home. The parent and student evaluate the tutor’s teaching style before committing.' },
              { num: '05', title: t.step5Title, desc: t.step5Desc, detail: 'Regular structured home tuition begins with continuous monthly progress logs, attendance tracking, and Horizon support.' },
            ].map((step, idx) => (
              <div key={idx} className="dark-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', borderLeft: '5px solid var(--accent-gold)' }}>
                <span style={{ background: 'var(--accent-gold-light)', color: 'var(--accent-gold)', border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 800, fontSize: '1.2rem', padding: '0.6rem 1rem', borderRadius: '12px', minWidth: '50px', textAlign: 'center' }}>
                  {step.num}
                </span>
                <div>
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: 800 }}>{step.title}</h3>
                  <p style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.98rem', marginBottom: '0.5rem' }}>{step.desc}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65 }}>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comparative Table */}
          <div className="dark-card" style={{ padding: '2.5rem 2rem' }}>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 800 }}>
              Horizon vs Unverified Marketplace / Freelancers
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-input)', borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem', color: 'var(--text-primary)' }}>Feature</th>
                    <th style={{ padding: '1rem', color: 'var(--accent-gold)' }}>HORIZON Managed Service</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Generic Lead Marketplace</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Tutor Verification</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-green)', fontWeight: 700 }}>✓ Strict 5-Step Background & ID Check</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-red)' }}>✗ Unverified self-uploaded profiles</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Academic Assessment</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-green)', fontWeight: 700 }}>✓ Diagnostic test & gap analysis</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-red)' }}>✗ None</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Tutor Replacement Guarantee</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-green)', fontWeight: 700 }}>✓ Immediate free replacement</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-red)' }}>✗ Search again from scratch</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Progress Monitoring</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-green)', fontWeight: 700 }}>✓ Regular progress reports & logs</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-red)' }}>✗ No tracking</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Parent Support Layer</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-green)', fontWeight: 700 }}>✓ Horizon Coordinator Support</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-red)' }}>✗ Direct friction with tutor</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ textDecoration: 'none', textAlign: 'center', marginTop: '3.5rem' }}>
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
