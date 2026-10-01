'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <Navbar />

      <section style={{
        background: 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.14) 0%, var(--bg-main) 100%)',
        padding: '4rem 1rem 3.5rem 1rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.4rem 1rem', borderRadius: '30px', color: '#F59E0B', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
            <ShieldCheck size={18} /> TRUST & DATA SECURITY
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 900 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
            At HORIZON Home Tuition, we treat the safety and personal data of our students, parents, and tutors with the utmost integrity and confidentiality.
          </p>
          <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--accent-gold)' }}>
            Last Updated: October 2026 • Compliant with Indian IT Act & DPDP Framework
          </div>
        </div>
      </section>

      <main style={{ padding: '3.5rem 1rem', flex: 1 }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="dark-card" style={{ padding: '2.5rem', borderRadius: '24px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Section 1 */}
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <Lock size={22} color="#F59E0B" /> 1. Information We Collect
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.96rem', marginBottom: '0.75rem' }}>
                To match the best verified home tutor with your child and provide personalized academic tracking, we collect:
              </p>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.94rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li><strong>Parent & Student Details:</strong> Name, phone number, residential address/area (e.g., Purnia/Katihar localities), student's school, grade/class (5–12), curriculum board (CBSE, ICSE, Bihar Board), and learning challenges.</li>
                <li><strong>Tutor Profiles:</strong> Educational qualifications, college identity, background proofs, subject specializations, and contact coordinates.</li>
                <li><strong>Academic Assessment Records:</strong> Diagnostic baseline test scores, monthly diagnostic evaluation reports, and attendance records.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <Eye size={22} color="#F59E0B" /> 2. How We Use Your Information
              </h2>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.94rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>To allocate verified tutors geographically close to the student's residence.</li>
                <li>To generate monthly progress report cards and parent review analytics.</li>
                <li>To coordinate cross-evaluator examination duties at local assessment hubs.</li>
                <li>We <strong>NEVER sell, rent, or trade</strong> personal phone numbers or records to third-party telemarketers or advertisers.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <CheckCircle size={22} color="#F59E0B" /> 3. Strict Verification & Child Safety
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.96rem' }}>
                Student safety is our highest priority. All home tutors undergo in-person credential verification, government ID proof authentication, and academic vetting before being allowed into a student's home.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <FileText size={22} color="#F59E0B" /> 4. Contact Our Privacy Office
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.96rem' }}>
                If you have questions regarding data privacy or wish to update your records, please contact us directly:
              </p>
              <div style={{ marginTop: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <strong>HORIZON Academic Helpdesk</strong><br />
                Email: <span style={{ color: 'var(--accent-gold)' }}>piyushkumarsihari@gmail.com</span><br />
                Phone: <span style={{ color: 'var(--accent-gold)' }}>+91 9162162128</span><br />
                Location: Line Bazar, Purnia, Bihar — 854301
              </div>
            </div>

          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.95rem' }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
