'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, CheckCircle2, Phone, MessageCircle, ArrowRight, UserCheck, Sparkles, MapPin, User, ShieldCheck } from 'lucide-react';

export default function BookAssessmentPage() {
  const { lang, t } = useLanguage();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Clean, Simple Enquiry State
  const [studentName, setStudentName] = useState('');
  const [classLevel, setClassLevel] = useState('Class 8');
  const [board, setBoard] = useState('CBSE');
  const [schoolMedium, setSchoolMedium] = useState('English');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics']);
  const [area, setArea] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hi'>(lang);

  const popularSubjects = [
    'Mathematics', 'Science (General)', 'Physics', 'Chemistry', 'Biology',
    'Social Studies (SST)', 'English', 'Commerce', 'Accounts', 'Economics', 'Hindi'
  ];

  const handleSubjectToggle = (subj: string) => {
    if (selectedSubjects.includes(subj)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter(s => s !== subj));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subj]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!studentName.trim() || !area.trim() || !parentName.trim() || !parentPhone.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया सभी आवश्यक जानकारी भरें।' : 'Please fill in student name, area, parent name and phone number.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          classLevel,
          board,
          schoolMedium,
          subjects: selectedSubjects,
          area,
          parentName,
          parentPhone,
          preferredLanguage,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      router.push(`/thank-you?lang=${preferredLanguage}&id=${data.enquiryId}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <Navbar />

      {/* Header Banner */}
      <section style={{
        background: 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.12) 0%, var(--bg-main) 100%)',
        color: 'var(--text-primary)',
        padding: '3.5rem 0 3rem 0',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
            QUICK & EASY PARENT ENQUIRY
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', color: 'var(--text-primary)', marginBottom: '0.65rem', fontWeight: 900 }}>
            {lang === 'hi' ? 'होम ट्यूशन के लिए जानकारी दें' : 'Looking for Home Tuition?'}
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {lang === 'hi'
              ? 'केवल 15 सेकंड में बेसिक विवरण भरें। Horizon टीम आपसे संपर्क करेगी।'
              : 'Fill simple basic details in 15 seconds. Horizon team will connect with you shortly.'}
          </p>
        </div>
      </section>

      {/* Main Form Container */}
      <main style={{ padding: '3.5rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="dark-card" style={{ padding: '2.5rem 2rem', borderTop: '5px solid var(--accent-gold)', borderRadius: '24px' }}>
            
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.55rem', color: 'var(--text-primary)', marginBottom: '0.35rem', fontWeight: 800 }}>
                {lang === 'hi' ? 'छात्र और अभिभावक विवरण (Quick Form)' : 'Quick Home Tuition Enquiry'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                {lang === 'hi' ? 'आसान और सरल फॉर्म — तुरंत सहायता पाएं' : 'Simple & easy form to get matched with verified tutors'}
              </p>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(225, 29, 72, 0.15)', border: '1px solid rgba(225, 29, 72, 0.3)', color: 'var(--accent-red)', padding: '0.9rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.92rem', fontWeight: 600 }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* CARD 1: STUDENT REQUIREMENT */}
              <div style={{ background: 'var(--bg-input)', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-gold)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.55rem', fontWeight: 800 }}>
                  <BookOpen size={20} color="var(--accent-gold)" /> 1. Student Details (छात्र की जानकारी)
                </h3>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {t.studentName} *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder={lang === 'hi' ? 'उदा. अमन कुमार' : 'e.g. Aman Kumar'}
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {t.classLabel} *
                    </label>
                    <select
                      className="form-select"
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                    >
                      <option value="Class 5">Class 5</option>
                      <option value="Class 6">Class 6</option>
                      <option value="Class 7">Class 7</option>
                      <option value="Class 8">Class 8</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10 (Board)</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12 (Board)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {t.boardLabel} *
                    </label>
                    <select
                      className="form-select"
                      value={board}
                      onChange={(e) => setBoard(e.target.value)}
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State Board">State Board</option>
                      <option value="Other">Other Board</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {t.schoolMediumLabel}
                  </label>
                  <select
                    className="form-select"
                    value={schoolMedium}
                    onChange={(e) => setSchoolMedium(e.target.value)}
                  >
                    <option value="English">English Medium</option>
                    <option value="Hindi">Hindi Medium (हिंदी माध्यम)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {t.subjectsLabel} *
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', marginTop: '0.35rem' }}>
                    {popularSubjects.map((subj) => {
                      const selected = selectedSubjects.includes(subj);
                      return (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => handleSubjectToggle(subj)}
                          style={{
                            padding: '0.45rem 0.9rem',
                            fontSize: '0.85rem',
                            borderRadius: '20px',
                            border: selected ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-color)',
                            background: selected ? 'var(--accent-gold-light)' : 'var(--bg-main)',
                            color: selected ? 'var(--accent-gold)' : 'var(--text-secondary)',
                            fontWeight: selected ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {selected ? '✓ ' : '+ '} {subj}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CARD 2: LOCATION & PARENT CONTACT */}
              <div style={{ background: 'var(--bg-input)', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-gold)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.55rem', fontWeight: 800 }}>
                  <User size={20} color="var(--accent-gold)" /> 2. Parent Contact & Location (अभिभावक की जानकारी)
                </h3>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {t.areaLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder={lang === 'hi' ? 'उदा. लाजपत नगर / सेक्टर 56' : 'e.g. Lajpat Nagar / Sector 56'}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {t.parentName} *
                    </label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder={lang === 'hi' ? 'उदा. राजेश कुमार' : 'e.g. Rajesh Kumar'}
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {t.parentPhone} *
                    </label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      placeholder="e.g. +91 9162162128"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* PREFERRED COMMUNICATION LANGUAGE TOGGLE */}
                <div className="form-group" style={{ background: 'var(--accent-gold-light)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1.15rem', borderRadius: '14px', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                  <label className="form-label" style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.92rem' }}>
                    {t.preferredLanguage} *
                  </label>
                  <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.5rem' }}>
                    <label className="radio-label" style={{ flex: 1, padding: '0.65rem 0.95rem', fontSize: '0.9rem', justifyContent: 'center' }}>
                      <input
                        type="radio"
                        name="prefLang"
                        value="en"
                        checked={preferredLanguage === 'en'}
                        onChange={() => setPreferredLanguage('en')}
                      />
                      English
                    </label>

                    <label className="radio-label" style={{ flex: 1, padding: '0.65rem 0.95rem', fontSize: '0.9rem', justifyContent: 'center' }}>
                      <input
                        type="radio"
                        name="prefLang"
                        value="hi"
                        checked={preferredLanguage === 'hi'}
                        onChange={() => setPreferredLanguage('hi')}
                      />
                      हिंदी (Hindi)
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-gold"
                style={{ width: '100%', fontSize: '1.15rem', padding: '1.15rem', marginTop: '0.5rem', borderRadius: '30px' }}
              >
                {loading ? t.submitting : (lang === 'hi' ? 'जमा करें और ट्यूटर मैच कराएं' : 'Submit & Connect with Horizon Counselor')}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
