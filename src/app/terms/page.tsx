'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, CheckCircle2, AlertTriangle, HelpCircle, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            <BookOpen size={18} /> SERVICE GUIDELINES
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 900 }}>
            Terms & Conditions
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
            Clear and transparent guidelines for parents, students, and educators engaging with HORIZON Home Tuition.
          </p>
          <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--accent-gold)' }}>
            Effective: Academic Year 2026–2027
          </div>
        </div>
      </section>

      <main style={{ padding: '3.5rem 1rem', flex: 1 }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="dark-card" style={{ padding: '2.5rem', borderRadius: '24px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Section 1 */}
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={22} color="#F59E0B" /> 1. Managed Tuition Agreement
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.96rem' }}>
                HORIZON operates as a fully managed premium home tuition service. Unlike classified platforms, HORIZON coordinates tutor assignments, regular lesson plans, attendance validation, and monthly performance report cards.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={22} color="#F59E0B" /> 2. Assessment Tests & Report Cards
              </h2>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.94rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>Every enrolled student undergoes a baseline diagnostic assessment test before regular sessions commence.</li>
                <li>To maintain complete academic honesty and impartiality, monthly evaluations are conducted by an independent cross-evaluator tutor, not the regular teaching tutor.</li>
                <li>Only the assigned evaluator tutor and HORIZON Super Admin are authorized to compile and modify monthly report cards.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <AlertTriangle size={22} color="#F59E0B" /> 3. Tutor Code of Conduct & Safety
              </h2>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.94rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>Tutors must maintain strictly professional decorum at all times in the student's residence.</li>
                <li>Direct private fee settlements outside the HORIZON managed portal are strictly prohibited to protect both student safety and tutor remuneration guarantees.</li>
                <li>If a student or parent is dissatisfied with teaching quality, HORIZON guarantees a hassle-free tutor replacement upon request.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <HelpCircle size={22} color="#F59E0B" /> 4. Queries & Dispute Redressal
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.96rem' }}>
                For any questions or support, you can reach out directly to our Academic Coordination team at <strong>piyushkumarsihari@gmail.com</strong> or phone <strong>+91 9162162128</strong>.
              </p>
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
