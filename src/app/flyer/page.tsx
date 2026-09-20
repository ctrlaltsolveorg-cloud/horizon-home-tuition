'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Phone, Mail, Printer } from 'lucide-react';

export default function FlyerPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C0E', color: '#FFFFFF' }}>
      <Navbar />

      <div className="no-print container" style={{ padding: '2rem 0', textAlign: 'center' }}>
        <button onClick={handlePrint} className="btn btn-gold" style={{ fontSize: '1rem' }}>
          <Printer size={18} /> Print / Save Dark Brand Card & Flyer PDF
        </button>
      </div>

      {/* FLYER CANVAS MATCHING USER'S ATTACHED BRAND CARD IMAGE */}
      <main style={{ padding: '1rem 0 5rem 0' }}>
        <div
          className="printable-area"
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            background: '#0D0E11',
            borderRadius: '24px',
            border: '2px solid #242731',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
            overflow: 'hidden',
            color: '#FFFFFF',
            padding: '3.5rem'
          }}
        >
          {/* Brand Header & Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 300, color: '#9A9FA5', fontFamily: 'var(--font-heading)', letterSpacing: '0.02em', marginBottom: '0.25rem' }}>
                Home Tuition
              </div>
              <div style={{ fontSize: '0.9rem', color: '#F59E0B', fontWeight: 600 }}>
                Personalised Tuition for Classes 5–12 | CBSE • ICSE • State Boards
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.08em' }}>
                HORIZON
              </h1>
              <span className="badge badge-gold" style={{ marginTop: '0.35rem' }}>MANAGED SERVICE</span>
            </div>
          </div>

          {/* Body List & QR Code Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
            {/* List items from user card image */}
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 500, marginBottom: '1.5rem' }}>
                Feel free to ask for :
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.08rem', color: '#9A9FA5' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#F59E0B', fontSize: '1.2rem' }}>✦</span> Change schedule
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#F59E0B', fontSize: '1.2rem' }}>✦</span> Tutor issue
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#F59E0B', fontSize: '1.2rem' }}>✦</span> Feedback
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#F59E0B', fontSize: '1.2rem' }}>✦</span> Replacement request
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#F59E0B', fontSize: '1.2rem' }}>✦</span> Payment questions
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#F59E0B', fontSize: '1.2rem' }}>✦</span> General support
                </li>
              </ul>
            </div>

            {/* QR Code Container */}
            <div style={{ textAlign: 'center', background: '#14161B', padding: '2rem', borderRadius: '20px', border: '1px solid #242731' }}>
              <div style={{ fontSize: '1.15rem', color: '#9A9FA5', marginBottom: '1.25rem', fontWeight: 400 }}>
                scan to contact us :
              </div>
              <div style={{ display: 'inline-block', background: '#FFFFFF', padding: '1rem', borderRadius: '16px' }}>
                <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white"/>
                  <path d="M10 10H40V40H10V10ZM20 20V30H30V20H20Z" fill="#0B0C0E"/>
                  <path d="M60 10H90V40H60V10ZM70 20V30H80V20H70Z" fill="#0B0C0E"/>
                  <path d="M10 60H40V90H10V60ZM20 70V80H30V70H20Z" fill="#0B0C0E"/>
                  <path d="M50 50H60V60H50V50ZM60 60H70V70H60V60ZM70 50H80V60H70V50ZM80 60H90V70H80V60ZM50 70H60V80H50V70ZM70 70H80V80H70V70ZM60 80H70V90H60V80ZM80 80H90V90H80V90Z" fill="#0B0C0E"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Footer Contact Line from User Card Image */}
          <div style={{
            borderTop: '1px solid #242731',
            paddingTop: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '1rem',
            color: '#9A9FA5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} color="#9A9FA5" /> Ctrl.alt.solve.org@gmail.com
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E11D48', fontWeight: 600 }}>
              <Phone size={18} color="#E11D48" /> +91 9162162128
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
