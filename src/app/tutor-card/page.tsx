'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, CheckCircle2, QrCode, Printer, Sparkles } from 'lucide-react';

export default function TutorCardPage() {
  const [activeTab, setActiveTab] = useState<'idcard' | 'tshirt'>('idcard');
  const [tshirtSide, setTshirtSide] = useState<'front' | 'back'>('front');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <Navbar />

      <section style={{
        background: 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.14) 0%, var(--bg-main) 100%)',
        color: 'var(--text-primary)',
        padding: '3.5rem 0',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>PROFESSIONAL TUTOR IDENTITY</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 900 }}>
            Horizon Tutor ID Card & T-Shirt Concept
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Building professional trust, safety, and identity in home tuition.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.75rem' }}>
            <button
              onClick={() => setActiveTab('idcard')}
              className={`btn ${activeTab === 'idcard' ? 'btn-gold' : 'btn-secondary'}`}
              style={{ borderRadius: '24px' }}
            >
              Printable ID Card
            </button>
            <button
              onClick={() => setActiveTab('tshirt')}
              className={`btn ${activeTab === 'tshirt' ? 'btn-gold' : 'btn-secondary'}`}
              style={{ borderRadius: '24px' }}
            >
              Branded Tutor T-Shirt
            </button>
          </div>
        </div>
      </section>

      <main style={{ padding: '3.5rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {activeTab === 'idcard' ? (
            /* TUTOR ID CARD PREVIEW */
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
                This official ID card is issued to background-verified Horizon tutors. Scanning the QR code allows parents to verify accreditation in real-time.
              </p>

              {/* ID CARD CANVAS */}
              <div
                className="printable-area"
                style={{
                  width: '380px',
                  margin: '0 auto 2rem auto',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                  textAlign: 'left',
                  color: '#0F172A',
                  border: '1px solid #CBD5E1'
                }}
              >
                {/* Header Band */}
                <div style={{ background: '#0F172A', color: '#FFFFFF', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '1px', color: '#F59E0B' }}>HORIZON</div>
                    <div style={{ fontSize: '0.65rem', color: '#94A3B8', letterSpacing: '0.1em' }}>MANAGED HOME TUITION</div>
                  </div>
                  <span style={{ background: '#059669', color: '#FFFFFF', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                    VERIFIED
                  </span>
                </div>

                {/* Body Details */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '2px solid #F59E0B', color: '#0F172A', fontWeight: 800 }}>
                      PS
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', color: '#0F172A', fontWeight: 800 }}>Priya Sharma</h3>
                      <p style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>Verified Senior Tutor</p>
                      <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>ID: HZN-1025</p>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.4rem', background: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                    <div><strong>Subjects:</strong> Physics, Chemistry, Science</div>
                    <div><strong>Classes:</strong> Classes 9–12 (CBSE & ICSE)</div>
                    <div><strong>Qualification:</strong> M.Sc. Chemistry (IIT Delhi)</div>
                    <div><strong>Experience:</strong> 4+ Years</div>
                  </div>

                  {/* QR Verification Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed #CBD5E1', paddingTop: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A' }}>Scan to Verify Accreditation</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748B' }}>horizon-home-tuition.vercel.app</div>
                    </div>
                    <div style={{ background: '#0F172A', color: '#FFFFFF', padding: '0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <QrCode size={36} color="#F59E0B" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="no-print">
                <button onClick={() => window.print()} className="btn btn-gold" style={{ fontSize: '1.05rem', padding: '0.9rem 2rem', borderRadius: '24px' }}>
                  <Printer size={18} /> Print Tutor ID Badge
                </button>
              </div>
            </div>
          ) : (
            /* TUTOR T-SHIRT CONCEPT */
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
                <button
                  onClick={() => setTshirtSide('front')}
                  className={`btn ${tshirtSide === 'front' ? 'btn-gold' : 'btn-secondary'}`}
                  style={{ borderRadius: '20px' }}
                >
                  Front Side
                </button>
                <button
                  onClick={() => setTshirtSide('back')}
                  className={`btn ${tshirtSide === 'back' ? 'btn-gold' : 'btn-secondary'}`}
                  style={{ borderRadius: '20px' }}
                >
                  Back Side
                </button>
              </div>

              <div className="dark-card" style={{ maxWidth: '420px', margin: '0 auto', padding: '3rem 2rem', textAlign: 'center', borderRadius: '24px' }}>
                <div style={{ background: '#0F172A', width: '220px', height: '280px', margin: '0 auto', borderRadius: '20px 20px 8px 8px', border: '3px solid #242731', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', boxShadow: '0 15px 30px rgba(0,0,0,0.5)' }}>
                  
                  {tshirtSide === 'front' ? (
                    <>
                      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <div style={{ fontWeight: 900, fontSize: '0.9rem', color: '#F59E0B' }}>HORIZON</div>
                      </div>
                      <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.5rem 0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 800 }}>VERIFIED HOME TUTOR</div>
                        <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Classes 5–12</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#F59E0B', letterSpacing: '2px', marginBottom: '0.5rem' }}>
                        HORIZON
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '1rem' }}>
                        MANAGED HOME TUITION
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#94A3B8', borderTop: '1px solid #334155', paddingTop: '0.75rem' }}>
                        📊 Monthly Assessment | 🔄 Free Tutor Replacement
                      </div>
                    </>
                  )}
                </div>

                <p style={{ marginTop: '1.5rem', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  Horizon branded uniform creates instant professionalism and safety trust when tutors visit student homes.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
