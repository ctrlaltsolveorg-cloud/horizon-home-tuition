'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Printer } from 'lucide-react';

export default function TutorFlyerPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9' }}>
      <Navbar />

      <div className="no-print container" style={{ padding: '1.5rem 0', textAlign: 'center' }}>
        <button onClick={handlePrint} className="btn btn-primary" style={{ fontSize: '1rem', background: '#059669' }}>
          <Printer size={18} /> Print / Save Tutor Flyer PDF
        </button>
      </div>

      {/* FLYER CANVAS */}
      <main style={{ padding: '1rem 0 4rem 0' }}>
        <div
          className="printable-area"
          style={{
            maxWidth: '750px',
            margin: '0 auto',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '2px solid #059669',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            overflow: 'hidden'
          }}
        >
          {/* Top Header */}
          <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #059669 100%)', color: '#FFFFFF', padding: '2.5rem 2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', background: '#F59E0B', color: '#0F172A', fontWeight: 800, fontSize: '0.85rem', padding: '0.3rem 1rem', borderRadius: '20px', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>
              TUTOR RECRUITMENT DRIVE
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              BECOME A HORIZON TUTOR
            </h1>

            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: '#FDE68A', marginBottom: '0.75rem' }}>
              Teach. Earn. Grow.
            </p>

            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '0.5rem 1.5rem', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
              CLASSES 5–12 | ALL SUBJECTS | DELHI NCR
            </div>
          </div>

          {/* Body Benefits */}
          <div style={{ padding: '2.5rem 2.5rem 1.5rem 2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#0F172A', textAlign: 'center', marginBottom: '1.5rem' }}>
              Why Join the Horizon Tutor Network?
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '10px', borderLeft: '4px solid #059669' }}>
                <h4 style={{ color: '#059669', fontSize: '1.05rem', marginBottom: '0.25rem' }}>✓ Genuine Local Students</h4>
                <p style={{ fontSize: '0.85rem', color: '#475569' }}>Direct home-tuition assignments in your nearby area.</p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '10px', borderLeft: '4px solid #1E40AF' }}>
                <h4 style={{ color: '#1E40AF', fontSize: '1.05rem', marginBottom: '0.25rem' }}>✓ Flexible Teaching Schedule</h4>
                <p style={{ fontSize: '0.85rem', color: '#475569' }}>Choose your preferred days, times, and classes.</p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '10px', borderLeft: '4px solid #D97706' }}>
                <h4 style={{ color: '#D97706', fontSize: '1.05rem', marginBottom: '0.25rem' }}>✓ Official Tutor Identity</h4>
                <p style={{ fontSize: '0.85rem', color: '#475569' }}>Receive Horizon Tutor ID Card & Branded T-Shirt.</p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '10px', borderLeft: '4px solid #9333EA' }}>
                <h4 style={{ color: '#9333EA', fontSize: '1.05rem', marginBottom: '0.25rem' }}>✓ Horizon Support Backup</h4>
                <p style={{ fontSize: '0.85rem', color: '#475569' }}>Parent alignment and operational assistance.</p>
              </div>
            </div>

            {/* CTA Box with QR Code */}
            <div style={{ background: '#ECFDF5', border: '2px dashed #059669', borderRadius: '16px', padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#059669', marginBottom: '0.4rem' }}>
                  APPLY ONLINE NOW
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#334155', marginBottom: '0.75rem' }}>
                  Scan the QR code to submit your tutor application profile.
                </p>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                  Visit: horizon-home-tuition.vercel.app/become-a-tutor
                </div>
              </div>

              {/* QR Code SVG */}
              <div style={{ textAlign: 'center', background: '#FFFFFF', padding: '0.75rem', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
                <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white"/>
                  <path d="M10 10H40V40H10V10ZM20 20V30H30V20H20Z" fill="#059669"/>
                  <path d="M60 10H90V40H60V10ZM70 20V30H80V20H70Z" fill="#059669"/>
                  <path d="M10 60H40V90H10V60ZM20 70V80H30V70H20Z" fill="#059669"/>
                  <path d="M50 50H60V60H50V50ZM60 60H70V70H60V60ZM70 50H80V60H70V50ZM80 60H90V70H80V60ZM50 70H60V80H50V70ZM70 70H80V80H70V70ZM60 80H70V90H60V80ZM80 80H90V90H80V90Z" fill="#059669"/>
                </svg>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>SCAN TO APPLY</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#0F172A', color: '#94A3B8', padding: '1rem 2rem', fontSize: '0.8rem', textAlign: 'center' }}>
            HORIZON Tutor Network • Professional Managed Tuition • Phone: +91 9162162128
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
