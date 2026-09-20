'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { Phone, MessageCircle, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();
  const phoneNum = '+919162162128';
  const whatsappNum = '919162162128';
  const whatsappMsg = encodeURIComponent('Hello Horizon, I would like to enquire about home tuition.');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <Navbar />

      <section style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>REACH OUT TO US</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            {t.navContact}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)' }}>
            Our academic counselors are available to answer your questions in English & Hindi.
          </p>
        </div>
      </section>

      <main style={{ padding: '4rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div className="dark-card">
              <Phone size={28} color="var(--accent-red)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Call Horizon</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1rem' }}>Speak directly with an academic counselor (+91 9162162128).</p>
              <a href={`tel:${phoneNum}`} className="btn btn-gold" style={{ width: '100%' }}>
                <Phone size={18} /> Call Now
              </a>
            </div>

            <div className="dark-card">
              <MessageCircle size={28} color="#25D366" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>WhatsApp Horizon</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1rem' }}>Instant chat assistance and quick enquiry (+91 9162162128).</p>
              <a href={`https://wa.me/${whatsappNum}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ width: '100%' }}>
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </div>

            <div className="dark-card">
              <Mail size={28} color="var(--accent-gold)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Email Support</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1rem' }}>Send your specific requirements.</p>
              <a href="mailto:Ctrl.alt.solve.org@gmail.com" style={{ fontWeight: 600, color: 'var(--accent-gold)', fontSize: '0.95rem' }}>
                Ctrl.alt.solve.org@gmail.com
              </a>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/book-assessment" className="btn btn-gold" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              {t.bookAssessmentCTA} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
