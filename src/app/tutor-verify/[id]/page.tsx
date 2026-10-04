import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Clock, CheckCircle2, Award, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TutorVerifyPage({ params }: { params: { id: string } }) {
  const tutorParam = params.id;

  // Query Supabase directly
  const { data: tutor } = await supabase
    .from('tutor_profiles')
    .select('*')
    .or(`id.eq.${tutorParam},user_id.eq.${tutorParam},email.ilike.${tutorParam}`)
    .maybeSingle();

  const isVerified = tutor?.is_verified === true || (tutor?.verification_status || '').toUpperCase() === 'VERIFIED';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <Navbar />

      <main style={{ padding: '4rem 0', flex: 1, display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          {tutor ? (
            <div className="dark-card" style={{ padding: '3rem 2.5rem', textAlign: 'center', borderTop: `6px solid ${isVerified ? 'var(--accent-green)' : '#F59E0B'}`, borderRadius: '24px' }}>
              <div style={{ background: isVerified ? 'var(--accent-green-light)' : 'rgba(245, 158, 11, 0.15)', width: '76px', height: '76px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', border: `1px solid ${isVerified ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.35)'}` }}>
                {isVerified ? (
                  <ShieldCheck size={44} color="var(--accent-green)" />
                ) : (
                  <Clock size={44} color="#F59E0B" />
                )}
              </div>

              <span className={`badge ${isVerified ? 'badge-green' : ''}`} style={{ fontSize: '0.82rem', padding: '0.4rem 1rem', marginBottom: '1rem', background: isVerified ? undefined : 'rgba(245, 158, 11, 0.15)', color: isVerified ? undefined : '#F59E0B', border: isVerified ? undefined : '1px solid rgba(245, 158, 11, 0.35)' }}>
                {isVerified ? 'OFFICIALLY VERIFIED HORIZON TUTOR' : 'UNDER VERIFICATION (PENDING ADMIN REVIEW)'}
              </span>

              <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: '0.35rem', fontWeight: 900 }}>
                {tutor.full_name}
              </h1>

              <div style={{ fontSize: '1.05rem', color: 'var(--accent-gold)', fontWeight: 800, marginBottom: '1.75rem' }}>
                Academic Institution: {tutor.college || 'PCE PURNIA'}
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '16px', textAlign: 'left', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <div style={{ marginBottom: '0.85rem', fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Degree & Qualification:</strong> <span style={{ color: 'var(--text-secondary)' }}>{tutor.degree_status || 'Accredited Tutor'}</span>
                </div>
                <div style={{ marginBottom: '0.85rem', fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Approved Subjects:</strong> <span style={{ color: 'var(--text-secondary)' }}>{Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : tutor.subjects || 'Mathematics & Science'}</span>
                </div>
                <div style={{ marginBottom: '0.85rem', fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Teaching Experience:</strong> <span style={{ color: 'var(--text-secondary)' }}>{tutor.experience_years || '1+ years'}</span>
                </div>
                <div style={{ marginBottom: '0.85rem', fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Medium Preference:</strong> <span style={{ color: 'var(--text-secondary)' }}>{tutor.medium_preference || 'Hindi / English'}</span>
                </div>
                <div style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Verification Status:</strong> <span style={{ color: isVerified ? 'var(--accent-green)' : '#F59E0B', fontWeight: 800 }}>{isVerified ? 'VERIFIED' : 'PENDING'}</span>
                </div>
              </div>

              <div style={{ background: 'var(--accent-gold-light)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1.1rem', borderRadius: '14px', fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '2rem', lineHeight: 1.6, fontWeight: 500 }}>
                {isVerified
                  ? 'This tutor is accredited by Horizon Home Tuition Services. For any queries or scheduling support, contact Horizon Academic Support at +91 9162162128.'
                  : 'This tutor profile is currently under review by the Horizon Academic Quality Cell. Once approved by Admin, batch allocations will be enabled.'}
              </div>

              <Link href="/book-assessment" className="btn btn-gold" style={{ width: '100%', fontSize: '1.1rem', padding: '1.1rem', borderRadius: '30px' }}>
                Book a Free Assessment with Horizon
              </Link>
            </div>
          ) : (
            <div className="dark-card" style={{ padding: '3rem', textAlign: 'center', borderTop: '6px solid var(--accent-red)', borderRadius: '24px' }}>
              <h2 style={{ color: 'var(--accent-red)', marginBottom: '1rem', fontWeight: 800 }}>Tutor Verification Record Not Found</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                No active tutor found matching <strong style={{ color: 'var(--text-primary)' }}>{tutorParam}</strong> in Horizon Supabase database.
              </p>
              <Link href="/" className="btn btn-gold" style={{ borderRadius: '30px', padding: '1rem 2rem' }}>
                Return to Horizon Homepage
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
