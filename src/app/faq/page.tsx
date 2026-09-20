'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export default function FAQPage() {
  const { lang, t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = lang === 'hi' ? [
    { q: 'Horizon ट्यूटर मार्केटप्लेस से कैसे अलग है?', a: 'Horizon केवल ट्यूटर की सूची नहीं दिखाता। हम आपके बच्चे के शैक्षणिक स्तर का निःशुल्क मूल्यांकन करते हैं, सत्यापित ट्यूटर से मैच कराते हैं, ट्रायल सेशन आयोजित करते हैं, मासिक प्रगति ट्रैक करते हैं और आवश्यकता पड़ने पर बिना किसी अतिरिक्त शुल्क के ट्यूटर बदलते हैं।' },
    { q: 'ट्यूटर का सत्यापन (Verification) कैसे किया जाता है?', a: 'प्रत्येक Horizon ट्यूटर पहचान पत्र (Aadhaar/PAN), शैक्षणिक योग्यता डिग्री, पिछला अनुभव, संदर्भ जांच और सुरक्षा आचार संहिता समझौते के 5-स्तरीय सत्यापन से गुजरता है।' },
    { q: 'यदि बच्चा ट्यूटर के साथ सहज महसूस नहीं करता है तो क्या होगा?', a: 'Horizon आपको ट्यूटर बदलने की 100% गारंटी देता है। हमारी टीम बिना किसी सवाल या अतिरिक्त शुल्क के तुरंत दूसरा उपयुक्त ट्यूटर प्रदान करती है।' },
    { q: 'ट्यूशन की फीस कितनी है?', a: 'ट्यूशन फीस छात्र की कक्षा (Class 5-12), विषय, साप्ताहिक सत्रों और ट्यूटर की योग्यता पर निर्भर करती है। शुल्क का पारदर्शी विवरण मूल्यांकन के बाद प्रदान किया जाता है।' },
    { q: 'क्या माता-पिता हिंदी में बात कर सकते हैं?', a: 'हाँ! हमारी पूरी वेबसाइट और सपोर्ट टीम हिंदी और अंग्रेजी दोनों भाषाओं में 100% उपलब्ध है।' },
  ] : [
    { q: 'How is Horizon different from a tutor directory or lead marketplace?', a: 'Horizon is a managed home-tuition service. We don’t just give you phone numbers. We conduct student academic assessments, match background-verified tutors, arrange trial sessions, monitor monthly progress, and handle instant tutor replacements.' },
    { q: 'How are Horizon tutors verified?', a: 'Every Horizon tutor undergoes 5-step verification: Government Photo ID check, Academic qualification & degree verification, Reference checks, Address verification, and Code of Conduct agreement.' },
    { q: 'What happens if we are not satisfied with the assigned tutor?', a: 'Horizon provides a 100% free Tutor Replacement Guarantee. If you feel the teaching style or timing is not suitable, we assign a new verified tutor immediately without extra charges.' },
    { q: 'How much does Horizon home tuition cost?', a: 'Tuition fees are structured transparently based on Class (5-12), subject requirement, number of weekly sessions, and tutor experience. There are no hidden fees or exposed internal commission splits.' },
    { q: 'Can parents request counselors who speak Hindi?', a: 'Yes! Horizon fully supports bilingual parent communication in both English and Hindi. Select your preferred communication language when filling out the enquiry form.' },
  ];

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
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>QUESTIONS & ANSWERS</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 900 }}>
            {t.navFAQ}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Everything parents and tutors need to know about Horizon Managed Home Tuition.
          </p>
        </div>
      </section>

      <main style={{ padding: '4rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3.5rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="dark-card"
                  style={{
                    padding: '1.5rem 1.75rem',
                    cursor: 'pointer',
                    borderLeft: isOpen ? '4px solid var(--accent-gold)' : '1px solid var(--border-color)',
                    background: 'var(--bg-card)'
                  }}
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 700 }}>{faq.q}</h3>
                    {isOpen ? <ChevronUp size={22} color="var(--accent-gold)" /> : <ChevronDown size={22} color="var(--text-muted)" />}
                  </div>
                  {isOpen && (
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.65, borderTop: '1px solid var(--border-color)', paddingTop: '0.9rem' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
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
