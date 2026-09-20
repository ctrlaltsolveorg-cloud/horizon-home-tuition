'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { Briefcase, GraduationCap, ShieldCheck, Award, CheckCircle2, UserCheck, ArrowRight, User } from 'lucide-react';

export default function BecomeTutorPage() {
  const { lang, t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ code: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [highestQualification, setHighestQualification] = useState('B.Sc. Mathematics');
  const [college, setCollege] = useState('');
  const [graduationYear, setGraduationYear] = useState('2022');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics']);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['Classes 9–10']);
  const [selectedBoards, setSelectedBoards] = useState<string[]>(['CBSE', 'ICSE']);
  const [experienceYears, setExperienceYears] = useState('2');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [availableDays, setAvailableDays] = useState('Mon - Sat');
  const [availableTime, setAvailableTime] = useState('4:00 PM - 8:00 PM');
  const [expectedCompensation, setExpectedCompensation] = useState('₹600 / hour');
  const [experienceDescription, setExperienceDescription] = useState('');
  const [whyHorizon, setWhyHorizon] = useState('');

  const allSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Science', 'Accounts', 'Economics', 'English', 'Social Studies'];
  const allClasses = ['Classes 5–8', 'Classes 9–10', 'Classes 11–12'];
  const allBoards = ['CBSE', 'ICSE', 'State Board'];

  const toggleItem = (item: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          highestQualification,
          college,
          graduationYear,
          subjects: selectedSubjects,
          classes: selectedClasses,
          boards: selectedBoards,
          experienceYears,
          city,
          area,
          pincode,
          availableDays,
          availableTime,
          expectedCompensation,
          experienceDescription,
          whyHorizon,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSuccessData({ code: data.tutorCode });
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while submitting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <Navbar />

      {/* Hero Header */}
      <section style={{
        background: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.12) 0%, var(--bg-main) 100%)',
        color: 'var(--text-primary)',
        padding: '4rem 0',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-green" style={{ marginBottom: '1rem' }}>
            JOIN THE HORIZON TUTOR NETWORK
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 900 }}>
            Become a Horizon Tutor
          </h1>
          <p style={{ fontSize: '1.35rem', color: 'var(--accent-gold)', fontWeight: 800, marginBottom: '0.85rem' }}>
            Teach. Earn. Grow.
          </p>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.65 }}>
            Focus on delivering quality education while Horizon provides genuine local student opportunities, professional tutor identity, and full operational support.
          </p>
        </div>
      </section>

      {/* Main Form or Success Card */}
      <main style={{ padding: '3.5rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          {successData ? (
            <div className="dark-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', borderTop: '5px solid #10B981', borderRadius: '24px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <CheckCircle2 size={48} color="#10B981" />
              </div>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Application Submitted Successfully!
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.65 }}>
                Thank you, <strong>{fullName}</strong>. Your application has been logged into the Horizon Tutor Verification queue.
              </p>
              <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2rem', display: 'inline-block' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Your Unique Tutor ID</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-gold)' }}>{successData.code}</div>
              </div>
            </div>
          ) : (
            <div className="dark-card" style={{ padding: '2.5rem 2rem', borderTop: '5px solid var(--accent-green)', borderRadius: '24px' }}>
              
              <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.35rem', fontWeight: 800 }}>
                  Tutor Registration & Qualification Profile
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                  Fill your teaching background to match with nearby student requests in Delhi NCR
                </p>
              </div>

              {errorMsg && (
                <div style={{ background: 'rgba(225, 29, 72, 0.15)', border: '1px solid rgba(225, 29, 72, 0.3)', color: 'var(--accent-red)', padding: '0.9rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.92rem', fontWeight: 600 }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                
                {/* SECTION 1: PERSONAL & CONTACT */}
                <div style={{ background: 'var(--bg-input)', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '1.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-green)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.55rem', fontWeight: 800 }}>
                    <User size={20} color="var(--accent-green)" /> 1. Personal & Contact Details
                  </h3>

                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Rahul Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Phone Number *</label>
                      <input
                        type="tel"
                        required
                        className="form-input"
                        placeholder="e.g. +91 9162162128"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        className="form-input"
                        placeholder="e.g. rahulkumar@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Area / Locality *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Lajpat Nagar / Sector 56"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>City *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: ACADEMIC QUALIFICATION */}
                <div style={{ background: 'var(--bg-input)', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '1.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-green)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.55rem', fontWeight: 800 }}>
                    <GraduationCap size={20} color="var(--accent-green)" /> 2. Academic Qualification
                  </h3>

                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Highest Qualification Degree *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. B.Sc. Mathematics (Hons) / M.Tech"
                      value={highestQualification}
                      onChange={(e) => setHighestQualification(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>College / University Name *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Delhi University (Hindu College)"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Year of Graduation</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="e.g. 2022"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: TEACHING PREFERENCES */}
                <div style={{ background: 'var(--bg-input)', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '1.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-green)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.55rem', fontWeight: 800 }}>
                    <Briefcase size={20} color="var(--accent-green)" /> 3. Teaching Preferences & Experience
                  </h3>

                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Subjects You Can Teach *</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', marginTop: '0.35rem' }}>
                      {allSubjects.map((subj) => {
                        const selected = selectedSubjects.includes(subj);
                        return (
                          <button
                            key={subj}
                            type="button"
                            onClick={() => toggleItem(subj, selectedSubjects, setSelectedSubjects)}
                            style={{
                              padding: '0.45rem 0.9rem',
                              fontSize: '0.85rem',
                              borderRadius: '20px',
                              border: selected ? '1.5px solid var(--accent-green)' : '1px solid var(--border-color)',
                              background: selected ? 'var(--accent-green-light)' : 'var(--bg-main)',
                              color: selected ? 'var(--accent-green)' : 'var(--text-secondary)',
                              fontWeight: selected ? 700 : 500,
                              cursor: 'pointer'
                            }}
                          >
                            {selected ? '✓ ' : '+ '} {subj}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Classes Covered *</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                        {allClasses.map((c) => {
                          const selected = selectedClasses.includes(c);
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => toggleItem(c, selectedClasses, setSelectedClasses)}
                              style={{
                                padding: '0.4rem 0.85rem',
                                fontSize: '0.82rem',
                                borderRadius: '16px',
                                border: selected ? '1.5px solid var(--accent-green)' : '1px solid var(--border-color)',
                                background: selected ? 'var(--accent-green-light)' : 'var(--bg-main)',
                                color: selected ? 'var(--accent-green)' : 'var(--text-secondary)',
                                fontWeight: selected ? 700 : 500,
                                cursor: 'pointer'
                              }}
                            >
                              {selected ? '✓ ' : '+ '} {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Teaching Experience (Years)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-gold"
                  style={{ width: '100%', fontSize: '1.15rem', padding: '1.15rem', borderRadius: '30px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF' }}
                >
                  {loading ? 'Submitting Application...' : 'Submit Tutor Application'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
