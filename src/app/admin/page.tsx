'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase, TestCenter, EvaluationDuty, MonthlyReportCard } from '@/lib/supabase';
import {
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  RefreshCw,
  Search,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Lock,
  LogOut,
  Sliders,
  Award,
  Sparkles,
  FileText,
  Building2,
  MapPin,
  Printer,
  ShieldAlert,
  Plus
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'tutors' | 'assessments' | 'matching' | 'trials' | 'replacements' | 'settings' | 'center_audits'>('overview');
  
  const [testCenters, setTestCenters] = useState<TestCenter[]>([]);
  const [evaluationDuties, setEvaluationDuties] = useState<EvaluationDuty[]>([]);
  const [monthlyReportCards, setMonthlyReportCards] = useState<MonthlyReportCard[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [langFilter, setLangFilter] = useState('ALL');

  // Assessment Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [assessSubject, setAssessSubject] = useState('');
  const [assessLevel, setAssessLevel] = useState('Intermediate');
  const [assessStrengths, setAssessStrengths] = useState('');
  const [assessWeaknesses, setAssessWeaknesses] = useState('');
  const [assessAttention, setAssessAttention] = useState('');
  const [assessRecs, setAssessRecs] = useState('');

  // Matching Modal State
  const [matchingModalOpen, setMatchingModalOpen] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState<string>('');
  const [trialDate, setTrialDate] = useState('');
  const [trialTime, setTrialTime] = useState('5:00 PM');
  const [packageName, setPackageName] = useState('Horizon Standard Managed Home Tuition');
  const [packagePrice, setPackagePrice] = useState('₹6,000 / month');

  // Config State
  const [configPhone, setConfigPhone] = useState('+91 9162162128');
  const [configWhatsapp, setConfigWhatsapp] = useState('+91 9162162128');
  const [configEmail, setConfigEmail] = useState('Ctrl.alt.solve.org@gmail.com');

  useEffect(() => {
    const isAuth = sessionStorage.getItem('horizon_admin_auth');
    if (isAuth === 'true') {
      setAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && (password === 'horizon123#password' || password === 'admin')) {
      setAuthenticated(true);
      sessionStorage.setItem('horizon_admin_auth', 'true');
      setLoginError('');
      fetchDashboardData();
    } else {
      setLoginError('Invalid admin username or password.');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem('horizon_admin_auth');
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      const json = await res.json();
      if (res.ok) {
        setData(json);
        if (json.configs) {
          if (json.configs.horizon_phone) setConfigPhone(json.configs.horizon_phone);
          if (json.configs.whatsapp_number) setConfigWhatsapp(json.configs.whatsapp_number);
          if (json.configs.admin_email) setConfigEmail(json.configs.admin_email);
        }
      }

      // Fetch Live Supabase Test Centers, Duties & Report Cards
      const { data: centers } = await supabase.from('test_centers').select('*').order('created_at', { ascending: false });
      if (centers) setTestCenters(centers);

      const { data: duties } = await supabase.from('evaluation_duties').select('*').order('created_at', { ascending: false });
      if (duties) setEvaluationDuties(duties);

      const { data: reps } = await supabase.from('monthly_report_cards').select('*').order('created_at', { ascending: false });
      if (reps) setMonthlyReportCards(reps);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateEnquiryStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_enquiry_status', id, status })
      });
      if (res.ok) fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTutorStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_tutor_status', id, status })
      });
      if (res.ok) fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_assessment',
          enquiry_id: selectedEnquiry.id,
          student_name: selectedEnquiry.student_name,
          class_level: selectedEnquiry.class_level,
          subject: assessSubject || selectedEnquiry.subjects,
          assessment_date: new Date().toISOString().split('T')[0],
          strengths: assessStrengths,
          weaknesses: assessWeaknesses,
          topics_attention: assessAttention,
          recommendations: assessRecs,
        })
      });
      if (res.ok) {
        setAssessmentModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !selectedTutorId) return;

    const tut = (data?.tutors || []).find((t: any) => String(t.id) === String(selectedTutorId));

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_assignment',
          enquiry_id: selectedEnquiry.id,
          tutor_id: Number(selectedTutorId),
          student_name: selectedEnquiry.student_name,
          tutor_name: tut?.full_name || 'Tutor',
          tutor_code: tut?.tutor_code || 'HZN',
          class_level: selectedEnquiry.class_level,
          subject: selectedEnquiry.subjects,
          schedule: `${trialDate} @ ${trialTime}`,
          package_name: packageName,
          package_price: packagePrice,
        })
      });
      if (res.ok) {
        setMatchingModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_configs',
          configs: {
            horizon_phone: configPhone,
            whatsapp_number: configWhatsapp,
            admin_email: configEmail,
          }
        })
      });
      if (res.ok) {
        alert('Configuration saved successfully!');
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Enquiries
  const filteredEnquiries = (data?.enquiries || []).filter((e: any) => {
    const matchesSearch = searchQuery === '' ||
      e.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.parent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.subjects.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchesLang = langFilter === 'ALL' || e.preferred_language === langFilter;

    return matchesSearch && matchesStatus && matchesLang;
  });

  if (!authenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
        <Navbar />
        <main style={{ padding: '5rem 0', flex: 1, display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ maxWidth: '460px' }}>
            <div className="dark-card" style={{ padding: '2.75rem 2rem', borderTop: '5px solid var(--accent-gold)', borderRadius: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <Lock size={38} color="var(--accent-gold)" style={{ marginBottom: '0.65rem' }} />
                <h2 style={{ fontSize: '1.65rem', color: 'var(--text-primary)', fontWeight: 800 }}>Horizon Admin Portal</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Protected Administrator Access</p>
              </div>

              <div style={{ background: 'var(--accent-gold-light)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.9rem 1.1rem', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--accent-gold)' }}>Demo Credentials:</strong><br />
                Username: <code>admin</code><br />
                Password: <code>horizon123#password</code>
              </div>

              {loginError && (
                <div style={{ background: 'rgba(225, 29, 72, 0.15)', color: 'var(--accent-red)', border: '1px solid rgba(225, 29, 72, 0.3)', padding: '0.85rem', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '1.25rem', fontWeight: 600 }}>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Admin Username</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', borderRadius: '30px' }}>
                  Log In to Admin Dashboard
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', transition: 'background 0.3s ease, color 0.3s ease' }}>
      {/* Admin Subheader */}
      <div style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', padding: '0.85rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--accent-gold)', fontSize: '1.2rem' }}>HORIZON ADMIN</span>
          <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>MANAGED TUITION CONTROL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={fetchDashboardData} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', borderRadius: '20px' }}>
            <RefreshCw size={14} /> Refresh Data
          </button>
          <button onClick={handleLogout} className="btn" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', background: 'var(--accent-red)', color: '#FFFFFF', borderRadius: '20px' }}>
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </div>

      <Navbar />

      {/* Main Admin Dashboard */}
      <main style={{ padding: '2.5rem 0 4.5rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '1240px' }}>

          {/* Admin Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.55rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '2.25rem', overflowX: 'auto' }}>
            {[
              { id: 'overview', label: 'Overview Dashboard' },
              { id: 'enquiries', label: `Parent Enquiries (${data?.enquiries?.length || 0})` },
              { id: 'tutors', label: `Tutor Network (${data?.tutors?.length || 0})` },
              { id: 'center_audits', label: `Test Centers & Cross-Audits (${monthlyReportCards.length})` },
              { id: 'assessments', label: 'Student Assessments' },
              { id: 'matching', label: 'Tutor Matching' },
              { id: 'trials', label: 'Trial Sessions' },
              { id: 'replacements', label: 'Tutor Replacements' },
              { id: 'settings', label: 'System Settings' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.7rem 1.25rem',
                  fontSize: '0.92rem',
                  fontWeight: activeTab === tab.id ? 800 : 500,
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid var(--accent-gold)' : '3px solid transparent',
                  background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  borderRadius: '10px 10px 0 0',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              {/* Analytics Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="dark-card" style={{ borderLeft: '4px solid var(--primary-blue)', padding: '1.75rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.05em' }}>TOTAL PARENT ENQUIRIES</div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary-blue)', margin: '0.3rem 0' }}>
                    {data?.stats?.totalEnquiries || 0}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    {data?.stats?.newEnquiries || 0} New Pending Action
                  </div>
                </div>

                <div className="dark-card" style={{ borderLeft: '4px solid var(--accent-green)', padding: '1.75rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.05em' }}>VERIFIED TUTORS</div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--accent-green)', margin: '0.3rem 0' }}>
                    {data?.stats?.verifiedTutors || 0}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Out of {data?.stats?.totalTutors || 0} Registered Tutors
                  </div>
                </div>

                <div className="dark-card" style={{ borderLeft: '4px solid var(--accent-gold)', padding: '1.75rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.05em' }}>ACTIVE TUITION MATCHES</div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--accent-gold)', margin: '0.3rem 0' }}>
                    {data?.stats?.activeAssignments || 0}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--accent-green)', fontWeight: 700 }}>Ongoing Managed Tuitions</div>
                </div>

                <div className="dark-card" style={{ borderLeft: '4px solid #9333EA', padding: '1.75rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.05em' }}>PENDING TRIALS</div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#9333EA', margin: '0.3rem 0' }}>
                    {data?.stats?.pendingTrials || 0}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Demo Sessions Scheduled</div>
                </div>
              </div>

              {/* Quick Actions & Recent Enquiries */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                <div className="dark-card" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '1.25rem', fontWeight: 800 }}>Quick Action Panel</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <button onClick={() => setActiveTab('enquiries')} className="btn btn-gold" style={{ justifyContent: 'flex-start', borderRadius: '12px' }}>
                      View Recent Parent Enquiries
                    </button>
                    <button onClick={() => setActiveTab('tutors')} className="btn btn-secondary" style={{ justifyContent: 'flex-start', borderRadius: '12px' }}>
                      Verify Tutor Applications
                    </button>
                    <button onClick={() => setActiveTab('settings')} className="btn btn-secondary" style={{ justifyContent: 'flex-start', borderRadius: '12px' }}>
                      Update Horizon Phone & WhatsApp Settings
                    </button>
                  </div>
                </div>

                <div className="dark-card" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '1.25rem', fontWeight: 800 }}>System Summary</h3>
                  <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                    Horizon is operating normally. All parent enquiries are automatically recorded with language preference tags (English ↔ हिंदी) and stored in SQLite database.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PARENT ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div>
              {/* Search & Filter Controls */}
              <div className="dark-card" style={{ marginBottom: '1.75rem', padding: '1.35rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-input)', padding: '0.6rem 1.1rem', borderRadius: '10px', border: '1px solid var(--border-color)', flex: 1, minWidth: '240px' }}>
                    <Search size={18} color="var(--text-secondary)" />
                    <input
                      type="text"
                      placeholder="Search student, parent, area, or subject..."
                      style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.92rem', color: 'var(--text-primary)' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <select className="form-select" style={{ width: 'auto', fontSize: '0.88rem' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="ALL">All Statuses</option>
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="ASSESSMENT_SCHEDULED">ASSESSMENT_SCHEDULED</option>
                      <option value="ASSESSMENT_COMPLETED">ASSESSMENT_COMPLETED</option>
                      <option value="MATCHING">MATCHING</option>
                      <option value="TRIAL">TRIAL</option>
                      <option value="CONVERTED">CONVERTED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>

                    <select className="form-select" style={{ width: 'auto', fontSize: '0.88rem' }} value={langFilter} onChange={(e) => setLangFilter(e.target.value)}>
                      <option value="ALL">All Languages</option>
                      <option value="hi">हिंदी (Hindi Preferred)</option>
                      <option value="en">English Preferred</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Enquiries Table */}
              <div className="dark-card" style={{ padding: '0', overflowX: 'auto', borderRadius: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-input)', borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>ID</th>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Student Details</th>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Parent Contact & Language</th>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Location</th>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Status</th>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnquiries.map((enq: any) => (
                      <tr key={enq.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '1rem 1.15rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                          #{enq.id}
                        </td>
                        <td style={{ padding: '1rem 1.15rem' }}>
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{enq.student_name}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
                            {enq.class_level} • {enq.board} ({enq.school_medium || 'English'} Medium)
                          </div>
                          <div style={{ color: 'var(--primary-blue)', fontSize: '0.84rem', fontWeight: 700 }}>
                            {enq.subjects}
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.15rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{enq.parent_name}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>{enq.parent_phone}</div>
                          
                          {/* PREFERRED LANGUAGE HIGHLIGHT */}
                          <div style={{ marginTop: '5px' }}>
                            {enq.preferred_language === 'hi' ? (
                              <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                                Preferred: हिंदी (Hindi)
                              </span>
                            ) : (
                              <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
                                Preferred: English
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.15rem' }}>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{enq.area}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{enq.city} ({enq.pincode})</div>
                        </td>
                        <td style={{ padding: '1rem 1.15rem' }}>
                          <select
                            value={enq.status}
                            onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                            style={{
                              padding: '0.4rem 0.75rem',
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-input)',
                              color: 'var(--text-primary)'
                            }}
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="ASSESSMENT_SCHEDULED">ASSESSMENT_SCHEDULED</option>
                            <option value="ASSESSMENT_COMPLETED">ASSESSMENT_COMPLETED</option>
                            <option value="MATCHING">MATCHING</option>
                            <option value="TRIAL">TRIAL</option>
                            <option value="CONVERTED">CONVERTED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td style={{ padding: '1rem 1.15rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <a href={`tel:${enq.parent_phone}`} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', borderRadius: '8px' }} title="Call Parent">
                              <Phone size={12} /> Call
                            </a>
                            <a
                              href={`https://wa.me/${enq.parent_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(enq.preferred_language === 'hi' ? `नमस्ते ${enq.parent_name} जी, मैं Horizon से संपर्क कर रहा हूँ।` : `Hello ${enq.parent_name}, I am calling from Horizon.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-whatsapp"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', borderRadius: '8px' }}
                              title="WhatsApp Parent"
                            >
                              <MessageCircle size={12} /> WA
                            </a>
                            <button
                              onClick={() => { setSelectedEnquiry(enq); setAssessmentModalOpen(true); }}
                              className="btn btn-secondary"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', borderRadius: '8px' }}
                            >
                              Assess
                            </button>
                            <button
                              onClick={() => { setSelectedEnquiry(enq); setMatchingModalOpen(true); }}
                              className="btn btn-gold"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', borderRadius: '8px' }}
                            >
                              Match
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TUTOR NETWORK */}
          {activeTab === 'tutors' && (
            <div>
              <div className="dark-card" style={{ padding: '0', overflowX: 'auto', borderRadius: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-input)', borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Tutor ID & Name</th>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Qualification & College</th>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Subjects & Classes</th>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Location</th>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Verification Status</th>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.tutors || []).map((tut: any) => (
                      <tr key={tut.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '1rem 1.15rem' }}>
                          <div style={{ fontWeight: 900, color: 'var(--accent-gold)', fontSize: '0.84rem' }}>{tut.tutor_code}</div>
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{tut.full_name}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{tut.phone}</div>
                        </td>
                        <td style={{ padding: '1rem 1.15rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{tut.highest_qualification}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{tut.college} ({tut.graduation_year})</div>
                        </td>
                        <td style={{ padding: '1rem 1.15rem' }}>
                          <div style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>{tut.subjects}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{tut.classes} ({tut.boards})</div>
                        </td>
                        <td style={{ padding: '1rem 1.15rem' }}>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{tut.area}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{tut.city}</div>
                        </td>
                        <td style={{ padding: '1rem 1.15rem' }}>
                          <select
                            value={tut.verification_status}
                            onChange={(e) => updateTutorStatus(tut.id, e.target.value)}
                            style={{
                              padding: '0.4rem 0.75rem',
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-input)',
                              color: 'var(--text-primary)'
                            }}
                          >
                            <option value="APPLIED">APPLIED</option>
                            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                            <option value="VERIFIED">VERIFIED</option>
                            <option value="AVAILABLE">AVAILABLE</option>
                            <option value="ASSIGNED">ASSIGNED</option>
                            <option value="ACTIVE">ACTIVE</option>
                          </select>
                        </td>
                        <td style={{ padding: '1rem 1.15rem' }}>
                          <a href={`/tutor-verify/${tut.tutor_code}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '8px' }}>
                            QR Verify Link
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: STUDENT ASSESSMENTS */}
          {activeTab === 'assessments' && (
            <div className="dark-card" style={{ padding: '2.25rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 800 }}>Recorded Student Assessments</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {(data?.assessments || []).map((ass: any) => (
                  <div key={ass.id} style={{ border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.5rem', background: 'var(--bg-input)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <h4 style={{ color: 'var(--accent-gold)', fontSize: '1.15rem', fontWeight: 800 }}>{ass.student_name} ({ass.class_level}) — {ass.subject}</h4>
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Date: {ass.assessment_date}</span>
                    </div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
                      <p><strong style={{ color: 'var(--text-primary)' }}>Strengths:</strong> <span style={{ color: 'var(--text-secondary)' }}>{ass.strengths || 'N/A'}</span></p>
                      <p><strong style={{ color: 'var(--text-primary)' }}>Weaknesses:</strong> <span style={{ color: 'var(--text-secondary)' }}>{ass.weaknesses || 'N/A'}</span></p>
                      <p><strong style={{ color: 'var(--text-primary)' }}>Topics Needing Attention:</strong> <span style={{ color: 'var(--text-secondary)' }}>{ass.topics_attention || 'N/A'}</span></p>
                      <p><strong style={{ color: 'var(--text-primary)' }}>Recommendations:</strong> <span style={{ color: 'var(--text-secondary)' }}>{ass.recommendations || 'N/A'}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MATCHING & ASSIGNMENTS */}
          {activeTab === 'matching' && (
            <div className="dark-card" style={{ padding: '2.25rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 800 }}>Active Assignments & Matches</h3>
              <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-input)', borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Student</th>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Matched Tutor</th>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Subject & Schedule</th>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Package Price</th>
                      <th style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.assignments || []).map((asg: any) => (
                      <tr key={asg.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '1rem 1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{asg.student_name} ({asg.class_level})</td>
                        <td style={{ padding: '1rem 1.15rem', color: 'var(--text-primary)' }}>{asg.tutor_name} ({asg.tutor_code})</td>
                        <td style={{ padding: '1rem 1.15rem', color: 'var(--text-secondary)' }}>{asg.subject} • {asg.schedule}</td>
                        <td style={{ padding: '1rem 1.15rem', fontWeight: 800, color: 'var(--accent-green)' }}>{asg.package_price}</td>
                        <td style={{ padding: '1rem 1.15rem' }}>
                          <span className="badge badge-blue">{asg.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="dark-card" style={{ maxWidth: '650px', padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 800 }}>System Settings & Business Config</h3>
              <form onSubmit={handleSaveConfig}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Horizon Contact Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={configPhone}
                    onChange={(e) => setConfigPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>WhatsApp Number (e.g. +91 9162162128)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={configWhatsapp}
                    onChange={(e) => setConfigWhatsapp(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Admin Email for Notifications</label>
                  <input
                    type="email"
                    className="form-input"
                    value={configEmail}
                    onChange={(e) => setConfigEmail(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-gold" style={{ padding: '1rem 1.8rem', marginTop: '0.5rem', borderRadius: '30px' }}>
                  Save Configuration
                </button>
              </form>
            </div>
          )}

          {/* TAB 9: TEST CENTERS & CROSS-EVALUATION AUDITS */}
          {activeTab === 'center_audits' && (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={24} color="var(--accent-gold)" /> Monthly Test Centers &amp; Cross-Audits
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                    Strict anti-bias evaluation control: Independent cross-tutors assigned to testing hubs with 1-day evaluation windows.
                  </p>
                </div>
              </div>

              {/* Section A: Allocated Test Centers */}
              <div className="dark-card" style={{ padding: '1.75rem', borderRadius: '18px', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-gold)', margin: 0 }}>
                    1. Verified Examination Centers
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {(testCenters.length > 0 ? testCenters : [
                    {
                      id: 'cen-1',
                      center_name: 'Horizon Central Assessment Hub #1',
                      center_code: 'CEN-PUR-01',
                      location_address: 'Line Bazar Road, Near Govt Medical College, Purnia',
                      coordinator_name: 'Academic Director Piyush',
                      contact_number: '+91 9162162128',
                      capacity: 60
                    }
                  ]).map((center) => (
                    <div
                      key={center.id}
                      style={{
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1.25rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'var(--accent-gold)', color: '#000', fontSize: '0.72rem', fontWeight: 900 }}>
                          {center.center_code}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>
                          Capacity: {center.capacity || 50} Students
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 6px' }}>
                        {center.center_name}
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <MapPin size={14} color="#38BDF8" />
                        <span>{center.location_address}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '6px', marginTop: '6px' }}>
                        Coordinator: <strong style={{ color: 'var(--text-primary)' }}>{center.coordinator_name}</strong> ({center.contact_number})
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section B: Master Progress Report Cards List */}
              <div className="dark-card" style={{ padding: '1.75rem', borderRadius: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-gold)', margin: 0 }}>
                      2. Official Monthly Progress Report Cards (Single-Page Audits)
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                      All verified reports generated by independent cross-examiners and visible in Student &amp; Parent portals.
                    </p>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>STUDENT &amp; CLASS</th>
                        <th>TEACHING TUTOR</th>
                        <th>CROSS-EXAMINER &amp; CENTER</th>
                        <th>MONTH</th>
                        <th>OVERALL SCORE</th>
                        <th>AUDIT STATUS</th>
                        <th>OFFICIAL PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(monthlyReportCards.length > 0 ? monthlyReportCards : [
                        {
                          id: 'rep-sample-001',
                          report_code: 'REP-202609-001',
                          student_name: 'Aaryan Sharma',
                          class_grade: 'Class 7th • CBSE',
                          assigned_tutor_name: 'Harshit Patel',
                          evaluator_tutor_name: 'Vikash Kumar (Cross-Examiner)',
                          test_center_name: 'Horizon Central Hub #1',
                          assessment_month: 'September, 2026',
                          overall_percentage: 86.5,
                          grade: 'Grade A+ Outstanding',
                          status: 'VERIFIED'
                        }
                      ]).map((rep) => (
                        <tr key={rep.id}>
                          <td>
                            <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>{rep.student_name}</strong>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{rep.class_grade}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{rep.assigned_tutor_name}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--accent-gold)' }}>Regular Faculty (No Edit Access)</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, color: '#38BDF8' }}>{rep.evaluator_tutor_name}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{rep.test_center_name || 'Center #1'}</div>
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{rep.assessment_month}</span>
                          </td>
                          <td>
                            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#10B981', fontFamily: 'monospace' }}>
                              {rep.overall_percentage}%
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{rep.grade}</div>
                          </td>
                          <td>
                            <span className="badge badge-success">
                              ✓ {rep.status || 'VERIFIED'}
                            </span>
                          </td>
                          <td>
                            <Link
                              href={`/report-card/${rep.id || 'sample'}`}
                              target="_blank"
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                background: 'linear-gradient(135deg, var(--accent-gold), #D97706)',
                                color: '#000',
                                fontWeight: 800,
                                fontSize: '0.78rem',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Printer size={13} />
                              <span>View / Print PDF</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ASSESSMENT MODAL */}
      {assessmentModalOpen && selectedEnquiry && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem' }}>
          <div className="dark-card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--accent-gold)', marginBottom: '1.25rem', fontWeight: 800 }}>
              Record Diagnostic Assessment: {selectedEnquiry.student_name}
            </h3>

            <form onSubmit={handleSaveAssessment}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Subject</label>
                <input type="text" className="form-input" value={assessSubject || selectedEnquiry.subjects} onChange={(e) => setAssessSubject(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Strengths</label>
                <input type="text" className="form-input" placeholder="e.g. Number systems, basic calculation speed" value={assessStrengths} onChange={(e) => setAssessStrengths(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Weaknesses / Needs Attention</label>
                <input type="text" className="form-input" placeholder="e.g. Geometry proofs, word problem application" value={assessWeaknesses} onChange={(e) => setAssessWeaknesses(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Recommended Focus</label>
                <textarea className="form-textarea" placeholder="e.g. Geometry fundamentals + chapter test practice" value={assessRecs} onChange={(e) => setAssessRecs(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setAssessmentModalOpen(false)} className="btn btn-secondary" style={{ borderRadius: '24px' }}>Cancel</button>
                <button type="submit" className="btn btn-gold" style={{ borderRadius: '24px' }}>Save Assessment Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MATCHING MODAL */}
      {matchingModalOpen && selectedEnquiry && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem' }}>
          <div className="dark-card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--accent-gold)', marginBottom: '0.5rem', fontWeight: 800 }}>
              Match Verified Tutor: {selectedEnquiry.student_name}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Requirement: {selectedEnquiry.class_level} ({selectedEnquiry.board}) • {selectedEnquiry.subjects} • Location: {selectedEnquiry.area}
            </p>

            <form onSubmit={handleCreateAssignment}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Select Verified Tutor</label>
                <select className="form-select" value={selectedTutorId} onChange={(e) => setSelectedTutorId(e.target.value)} required>
                  <option value="">-- Choose Verified Tutor --</option>
                  {(data?.tutors || []).map((tut: any) => (
                    <option key={tut.id} value={tut.id}>
                      {tut.tutor_code} — {tut.full_name} ({tut.highest_qualification}, {tut.area}) [{tut.verification_status}]
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Trial Session Date</label>
                  <input type="date" className="form-input" value={trialDate} onChange={(e) => setTrialDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Trial Session Time</label>
                  <input type="text" className="form-input" value={trialTime} onChange={(e) => setTrialTime(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Package Name</label>
                  <input type="text" className="form-input" value={packageName} onChange={(e) => setPackageName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Package Price</label>
                  <input type="text" className="form-input" value={packagePrice} onChange={(e) => setPackagePrice(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setMatchingModalOpen(false)} className="btn btn-secondary" style={{ borderRadius: '24px' }}>Cancel</button>
                <button type="submit" className="btn btn-gold" style={{ borderRadius: '24px' }}>Assign Tutor & Schedule Trial</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
