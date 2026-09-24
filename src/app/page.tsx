'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShieldCheck,
  BookOpen,
  RefreshCw,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Star,
  CheckCircle2,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export default function HomePage() {
  const { lang, t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <Navbar />

      {/* SECTION 1 — HERO SECTION */}
      <section className="hero-section">
        {/* Mobile Ambient Image Background Layer */}
        <div className="hero-mobile-bg-layer" />

        {/* Subtle Ambient Pattern */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.4,
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))',
            gap: 'clamp(2rem, 5vw, 3.5rem)',
            alignItems: 'center'
          }}>
            {/* HERO LEFT */}
            <div>
              {/* Badge Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--accent-gold-light)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                padding: '0.4rem 0.9rem',
                borderRadius: '30px',
                marginBottom: '1.25rem',
                backdropFilter: 'blur(12px)',
                maxWidth: '100%',
                flexWrap: 'wrap'
              }}>
                <Sparkles size={15} color="#F59E0B" />
                <span style={{ fontSize: 'clamp(0.68rem, 2.5vw, 0.8rem)', fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  MANAGED HOME TUITION • CLASSES 5–12
                </span>
              </div>

              {/* Headline */}
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4.8vw, 4rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                marginBottom: '1.15rem',
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)'
              }}>
                The Right Tutor.{' '}
                <span style={{
                  fontFamily: 'serif',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  paddingRight: '0.2rem'
                }}>
                  For Your Child.
                </span>
              </h1>

              <p style={{
                fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)',
                color: 'var(--text-secondary)',
                marginBottom: '1.75rem',
                fontWeight: 400,
                lineHeight: 1.65,
                maxWidth: '600px'
              }}>
                Horizon matches and manages background-verified expert tutors for Classes 5–12 across CBSE, ICSE, and State Boards — with academic assessments and free tutor replacement guarantee.
              </p>

              {/* Boards Tag Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '2rem',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>BOARDS:</span>
                {['CBSE', 'ICSE', 'STATE BOARD'].map((board, idx) => (
                  <span key={idx} style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {board}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '2.25rem'
              }}>
                {/* Temporarily hidden per user request — easily restorable */}
                {/*
                <Link href="/book-assessment" className="btn btn-gold" style={{ fontSize: 'clamp(0.88rem, 2.5vw, 1rem)', padding: '0.8rem 1.6rem', borderRadius: '30px' }}>
                  {t.bookAssessmentCTA} <ArrowRight size={17} />
                </Link>
                */}

                <Link href="/become-a-tutor" className="btn btn-secondary" style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', padding: '0.75rem 1.35rem', borderRadius: '30px' }}>
                  {t.becomeTutorCTA}
                </Link>
              </div>

              {/* Trust Metrics Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-color)'
              }}>
                <div>
                  <div style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.65rem)', fontWeight: 900, color: 'var(--text-primary)' }}>100%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Verified Tutors</div>
                </div>
                <div>
                  <div style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.65rem)', fontWeight: 900, color: 'var(--accent-gold)' }}>4.9 ★</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Parent Rating</div>
                </div>
                <div>
                  <div style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.65rem)', fontWeight: 900, color: 'var(--accent-green)' }}>&lt; 24 Hrs</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tutor Match</div>
                </div>
              </div>
            </div>

            {/* HERO RIGHT: 3D ORGANIC PORTAL CUTOUT WINDOW (Desktop Only) */}
            <div className="hero-desktop-portal" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '100%' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '440px',
                height: 'clamp(300px, 50vw, 420px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box'
              }}>

                {/* BACKING BLOB 1 (Navy Accent) */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  width: '90%',
                  height: '90%',
                  background: 'var(--blob-bg-1)',
                  borderRadius: '40% 60% 70% 30% / 40% 50% 50% 60%',
                  transform: 'rotate(-8deg)',
                  opacity: 0.85,
                  boxShadow: 'var(--shadow-md)'
                }} />

                {/* BACKING BLOB 2 (Gold Accent) */}
                <div style={{
                  position: 'absolute',
                  top: '22px',
                  right: '10px',
                  width: '88%',
                  height: '88%',
                  background: 'var(--blob-bg-2)',
                  borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%',
                  transform: 'rotate(8deg)',
                  boxShadow: 'var(--shadow-md)'
                }} />

                {/* MAIN RECESSED PORTAL CUTOUT WINDOW */}
                <div style={{
                  position: 'relative',
                  width: '92%',
                  height: '92%',
                  borderRadius: '44% 56% 62% 38% / 45% 55% 45% 55%',
                  overflow: 'hidden',
                  background: 'var(--portal-bg)',
                  border: '2.5px solid var(--border-highlight)',
                  boxShadow: 'inset 0 16px 36px rgba(0, 0, 0, 0.4), var(--shadow-lg)'
                }}>

                  {/* The Horizon Tutor Photo */}
                  <img
                    src="/horizon-teaching.jpg"
                    alt="Horizon Tutor Teaching Student inside 3D Portal Window"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block'
                    }}
                  />

                  {/* Bottom Depth Shadow Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '70px',
                    background: 'linear-gradient(to top, var(--bg-main) 0%, transparent 100%)',
                    pointerEvents: 'none'
                  }} />
                </div>

                {/* FLOATING OVERLAY BADGES */}
                
                {/* Badge 1: Top Left Glass Pill */}
                <div style={{
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                  background: 'var(--pill-bg)',
                  backdropFilter: 'blur(16px)',
                  color: 'var(--pill-text)',
                  fontWeight: 800,
                  fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '30px',
                  border: '1px solid var(--pill-border)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  zIndex: 10,
                  maxWidth: '85%'
                }}>
                  <Star size={13} fill="#F59E0B" color="#F59E0B" />
                  <span>4.9 ★ Parent Rating</span>
                </div>

                {/* Badge 2: Top Right Gold Pill */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '0px',
                  background: 'var(--bg-card)',
                  border: '1.5px solid var(--accent-gold)',
                  color: 'var(--accent-gold)',
                  fontWeight: 700,
                  fontSize: 'clamp(0.68rem, 2vw, 0.76rem)',
                  padding: '0.35rem 0.7rem',
                  borderRadius: '30px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  zIndex: 10,
                  maxWidth: '85%'
                }}>
                  <BarChart3 size={13} color="#F59E0B" /> Verified Reports
                </div>

                {/* Badge 3: Bottom Right Glass Card */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '0px',
                  background: 'var(--pill-bg)',
                  backdropFilter: 'blur(16px)',
                  color: 'var(--pill-text)',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '16px',
                  border: '1px solid var(--pill-border)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  zIndex: 10,
                  maxWidth: '90%'
                }}>
                  <div style={{
                    background: '#10B981',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <RefreshCw size={14} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 'clamp(0.72rem, 2vw, 0.8rem)', color: 'var(--pill-text)' }}>
                      Free Tutor Replacement
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      100% Parent Satisfaction
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 — WHY HORIZON */}
      <section style={{ padding: '5.5rem 0', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
              THE MANAGED ADVANTAGE
            </span>
            <h2 style={{ fontSize: '2.25rem', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
              Why Choose Horizon Managed Tuition?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.65 }}>
              Unlike simple tutor listings, Horizon takes complete responsibility for tutor verification, trial matching, and monthly academic progress.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.75rem'
          }}>
            <div className="dark-card" style={{ padding: '2rem' }}>
              <div style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>
                <BookOpen size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t.featureAssessmentTitle}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{t.featureAssessmentDesc}</p>
            </div>

            <div className="dark-card" style={{ padding: '2rem' }}>
              <div style={{ color: 'var(--accent-green)', marginBottom: '1rem' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t.featureVerifiedTitle}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{t.featureVerifiedDesc}</p>
            </div>

            <div className="dark-card" style={{ padding: '2rem' }}>
              <div style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }}>
                <GraduationCap size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t.featureHomeTuitionTitle}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{t.featureHomeTuitionDesc}</p>
            </div>

            <div className="dark-card" style={{ padding: '2rem' }}>
              <div style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>
                <RefreshCw size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t.featureReplacementTitle}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{t.featureReplacementDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — HOW HORIZON WORKS */}
      <section style={{ padding: '5.5rem 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-blue" style={{ marginBottom: '0.85rem' }}>
              TRANSPARENT PROCESS
            </span>
            <h2 style={{ fontSize: '2.25rem', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
              {t.howTitle}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              {t.howSubtitle}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { num: '01', title: t.step1Title, desc: t.step1Desc },
              { num: '02', title: t.step2Title, desc: t.step2Desc },
              { num: '03', title: t.step3Title, desc: t.step3Desc },
              { num: '04', title: t.step4Title, desc: t.step4Desc }
            ].map((step, idx) => (
              <div key={idx} className="dark-card" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.45rem', color: 'var(--text-primary)' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — CLASSES COVERED */}
      <section style={{ padding: '5.5rem 0', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
              ACADEMIC FOCUS
            </span>
            <h2 style={{ fontSize: '2.25rem', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
              {t.classesTitle}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Tailored curriculum support for Classes 5–12 across CBSE, ICSE, and State Board standards.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div className="dark-card" style={{ padding: '2.25rem' }}>
              <div style={{ color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>
                MIDDLE SCHOOL
              </div>
              <h3 style={{ fontSize: '1.45rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                {t.class5_8}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                {t.class5_8_desc}
              </p>
            </div>

            <div className="dark-card" style={{ padding: '2.25rem', border: '1.5px solid rgba(245, 158, 11, 0.4)' }}>
              <div style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>
                HIGH SCHOOL / BOARDS
              </div>
              <h3 style={{ fontSize: '1.45rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                {t.class9_10}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                {t.class9_10_desc}
              </p>
            </div>

            <div className="dark-card" style={{ padding: '2.25rem' }}>
              <div style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>
                SENIOR SECONDARY
              </div>
              <h3 style={{ fontSize: '1.45rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                {t.class11_12}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                {t.class11_12_desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — CALL TO ACTION BANNER */}
      <section style={{
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        padding: '5.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <h2 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: '1.15rem', fontWeight: 900 }}>
            Looking for a Home Tutor for Your Child?
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2.25rem', lineHeight: 1.65 }}>
            Tell us what your child needs. Horizon will conduct an academic assessment and match the right verified tutor.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/book-assessment" className="btn btn-gold" style={{ fontSize: '1.1rem', padding: '1.1rem 2.6rem', borderRadius: '30px' }}>
              {t.bookAssessmentCTA}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
