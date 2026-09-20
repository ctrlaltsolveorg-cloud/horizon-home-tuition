'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import confetti from 'canvas-confetti';
import { CheckCircle2, Phone, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

function ThankYouContent() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const paramLang = searchParams.get('lang') || lang;
  const enquiryId = searchParams.get('id') || '';

  const isHindi = paramLang === 'hi';

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore confetti if unsupported
    }
  }, []);

  const phoneNum = '+919162162128';
  const whatsappNum = '919162162128';
  const whatsappMsg = encodeURIComponent(`Hello Horizon, I just submitted an enquiry #${enquiryId}. Please contact me.`);

  return (
    <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
      <div className="dark-card" style={{ padding: '3.5rem 2rem', borderTop: '5px solid #10B981', background: 'var(--bg-card)' }}>
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <CheckCircle2 size={48} color="#10B981" />
        </div>

        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          {isHindi ? 'धन्यवाद! Horizon से संपर्क करने के लिए धन्यवाद।' : 'Thank You for Contacting Horizon!'}
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: '#10B981',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1.5px solid rgba(16, 185, 129, 0.3)',
          padding: '1.25rem',
          borderRadius: '12px',
          fontWeight: 600,
          lineHeight: 1.6,
          marginBottom: '2rem'
        }}>
          {isHindi
            ? 'धन्यवाद! Horizon से संपर्क करने के लिए धन्यवाद। हमारी टीम जल्द ही आपकी पसंदीदा भाषा में आपसे संपर्क करेगी।'
            : 'Thank you for contacting Horizon. Our team will contact you shortly in your preferred language.'
          }
        </p>

        {enquiryId && (
          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
            Enquiry Reference ID: <strong style={{ color: 'var(--accent-gold)' }}>#HZN-ENQ-{enquiryId}</strong>
          </div>
        )}

        {/* Next Steps */}
        <div style={{ textAlign: 'left', background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
            {isHindi ? 'आगे क्या प्रक्रिया होगी?' : 'What happens next?'}
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.94rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', gap: '0.55rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>1.</span>
              <span>{isHindi ? 'हमारा अकादमिक सलाहकार 2 घंटे के भीतर आपसे बात करेगा।' : 'Our Academic Counselor calls you within 2 hours to confirm requirement.'}</span>
            </li>
            <li style={{ display: 'flex', gap: '0.55rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>2.</span>
              <span>{isHindi ? 'आपके बच्चे का निःशुल्क diagnostic assessment शेड्यूल किया जाएगा।' : 'We schedule a free diagnostic academic assessment for your child.'}</span>
            </li>
            <li style={{ display: 'flex', gap: '0.55rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>3.</span>
              <span>{isHindi ? 'आपके क्षेत्र से सत्यापित ट्यूटर के साथ ट्रायल सेशन आयोजित होगा।' : 'We match a background-verified local tutor for a trial session.'}</span>
            </li>
          </ul>
        </div>

        {/* Direct Connect Buttons — Clean text without phone number inside button label */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a href={`https://wa.me/${whatsappNum}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ padding: '0.85rem 1.65rem' }}>
            <MessageCircle size={18} /> {isHindi ? 'व्हाट्सएप पर बात करें' : 'Chat on WhatsApp'}
          </a>
          <a href={`tel:${phoneNum}`} className="btn btn-gold" style={{ padding: '0.85rem 1.65rem' }}>
            <Phone size={18} /> {isHindi ? 'कॉल करें' : 'Call Now'}
          </a>
          <Link href="/" className="btn btn-secondary" style={{ padding: '0.85rem 1.65rem' }}>
            {isHindi ? 'मुख्य पृष्ठ पर लौटें' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <Navbar />
      <main style={{ padding: '5rem 0', flex: 1, display: 'flex', alignItems: 'center' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading confirmation...</div>}>
          <ThankYouContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
