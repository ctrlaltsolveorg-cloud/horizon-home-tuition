'use client';

import React, { useRef } from 'react';
import HorizonBrandHeader from './HorizonBrandHeader';
import { MonthlyReportCard } from '@/lib/supabase';
import { Printer, Download, ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, User, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';

interface ReportCardViewProps {
  report: MonthlyReportCard;
  showBackBtn?: boolean;
  backUrl?: string;
  isEvaluatorView?: boolean;
}

export default function ReportCardView({
  report,
  showBackBtn = true,
  backUrl = '/student-dashboard',
  isEvaluatorView = false
}: ReportCardViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-card-container">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="no-print report-card-actions">
        {showBackBtn && (
          <Link href={backUrl} className="report-btn-secondary">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isEvaluatorView && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#d97706',
              fontSize: '0.82rem',
              fontWeight: 700
            }}>
              <ShieldCheck size={15} />
              <span>Independent Evaluation Audit</span>
            </span>
          )}

          <button onClick={handlePrint} className="report-btn-primary">
            <Printer size={16} />
            <span>Print / Download Official PDF</span>
          </button>
        </div>
      </div>

      {/* ==================== A4 SINGLE PAGE DOCUMENT ==================== */}
      <div className="report-card-paper">
        
        {/* Brand Header with Live Logo Mapping */}
        <HorizonBrandHeader
          logoSize={50}
          titleSize="1.55rem"
          subtitleSize="0.68rem"
          reportTitle="MONTHLY PROGRESS REPORT"
          reportSubtitle="Single-Page Comprehensive Audit"
        />

        {/* Student & Assessment Meta Grid */}
        <div className="report-meta-grid">
          <div className="report-meta-box">
            <div className="report-meta-label">STUDENT NAME</div>
            <div className="report-meta-value">{report.student_name || '[Student Full Name]'}</div>
          </div>
          <div className="report-meta-box">
            <div className="report-meta-label">CLASS / GRADE</div>
            <div className="report-meta-value">{report.class_grade || 'Class 7th • CBSE/ICSE'}</div>
          </div>
          <div className="report-meta-box">
            <div className="report-meta-label">ASSESSMENT MONTH</div>
            <div className="report-meta-value">{report.assessment_month || 'September, 2026'}</div>
          </div>
          <div className="report-meta-box">
            <div className="report-meta-label">ASSIGNED TUTOR</div>
            <div className="report-meta-value">{report.assigned_tutor_name || 'Horizon Certified Tutor'} {report.assigned_tutor_contact ? `• ${report.assigned_tutor_contact}` : ''}</div>
          </div>
        </div>

        {/* SECTION 1: PASSAGE READING & COMPREHENSION EVALUATION */}
        <div className="report-section">
          <div className="report-section-header">
            <span className="section-title">1. PASSAGE READING &amp; COMPREHENSION EVALUATION</span>
            <span className="section-subtitle">Evaluating Reading Pace (WPM) &amp; 5 Direct Comprehension Questions</span>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>LANGUAGE MEDIUM</th>
                <th style={{ width: '25%' }}>PASSAGE LENGTH &amp; TIME</th>
                <th style={{ width: '18%' }}>SPEED (WPM)</th>
                <th style={{ width: '20%' }}>5 COMPREHENSION QS</th>
                <th style={{ width: '12%' }}>FLUENCY (10.00)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="table-primary-text">Hindi Passage Reading</div>
                  <div className="table-secondary-text">(शुद्धता एवं स्पष्ट उच्चारण)</div>
                </td>
                <td className="table-text-cell">{report.hindi_passage_length_time || '160 Words • 1m 25s'}</td>
                <td className="table-text-cell font-bold">{report.hindi_speed_wpm || '113 WPM (Good)'}</td>
                <td className="table-text-cell highlight-green">{report.hindi_comprehension_qs || '4.0 / 5.0 Correct (1 Error)'}</td>
                <td className="table-score-cell">{report.hindi_fluency || '8.50 / 10.00'}</td>
              </tr>
              <tr>
                <td>
                  <div className="table-primary-text">English Passage Reading</div>
                  <div className="table-secondary-text">(Pace &amp; Pronunciation)</div>
                </td>
                <td className="table-text-cell">{report.english_passage_length_time || '175 Words • 1m 35s'}</td>
                <td className="table-text-cell font-bold">{report.english_speed_wpm || '110 WPM (Optimal)'}</td>
                <td className="table-text-cell highlight-green">{report.english_comprehension_qs || '5.0 / 5.0 Correct (0 Error)'}</td>
                <td className="table-score-cell">{report.english_fluency || '9.00 / 10.00'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 2: ACADEMIC CHAPTER ASSESSMENTS */}
        <div className="report-section">
          <div className="report-section-header">
            <span className="section-title">2. ACADEMIC CHAPTER ASSESSMENTS (TARGET: 2 CHAPTERS PER SUBJECT)</span>
            <span className="section-subtitle">Monthly Progressive Cycle • Each Chapter Tested Out of 10.00 Marks</span>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>SUBJECT</th>
                <th style={{ width: '53%' }}>ASSIGNED TARGET CHAPTERS TESTED THIS MONTH</th>
                <th style={{ width: '13%' }}>MARKS (MAX 10.00)</th>
                <th style={{ width: '12%' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {/* Mathematics */}
              <tr>
                <td rowSpan={2} className="subject-cell">Mathematics</td>
                <td className="chapter-cell">{report.math_ch1_name || 'Ch 1: Integers, Number Line & Rules'}</td>
                <td className="table-score-cell">{report.math_ch1_marks || '9.50 / 10.00'}</td>
                <td className="status-cell">
                  <span className={`status-pill ${report.math_ch1_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                    {report.math_ch1_status || 'Cleared'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="chapter-cell">{report.math_ch2_name || 'Ch 2: Fractions, Decimals & Problem Sums'}</td>
                <td className="table-score-cell">{report.math_ch2_marks || '8.50 / 10.00'}</td>
                <td className="status-cell">
                  <span className={`status-pill ${report.math_ch2_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                    {report.math_ch2_status || 'Cleared'}
                  </span>
                </td>
              </tr>

              {/* Science */}
              <tr>
                <td rowSpan={2} className="subject-cell">Science</td>
                <td className="chapter-cell">{report.science_ch1_name || 'Ch 1: Nutrition in Plants (Modes & Photosynthesis)'}</td>
                <td className="table-score-cell">{report.science_ch1_marks || '9.00 / 10.00'}</td>
                <td className="status-cell">
                  <span className={`status-pill ${report.science_ch1_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                    {report.science_ch1_status || 'Cleared'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="chapter-cell">{report.science_ch2_name || 'Ch 2: Nutrition in Animals (Digestive Organs)'}</td>
                <td className="table-score-cell">{report.science_ch2_marks || '7.50 / 10.00'}</td>
                <td className="status-cell">
                  <span className={`status-pill ${report.science_ch2_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                    {report.science_ch2_status || 'Revision'}
                  </span>
                </td>
              </tr>

              {/* Social Science */}
              <tr>
                <td rowSpan={2} className="subject-cell">Social Science</td>
                <td className="chapter-cell">{report.sst_ch1_name || 'Ch 1: Tracing Changes Through a Thousand Years'}</td>
                <td className="table-score-cell">{report.sst_ch1_marks || '8.50 / 10.00'}</td>
                <td className="status-cell">
                  <span className={`status-pill ${report.sst_ch1_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                    {report.sst_ch1_status || 'Cleared'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="chapter-cell">{report.sst_ch2_name || 'Ch 2: Our Environment & Earth Interior Layers'}</td>
                <td className="table-score-cell">{report.sst_ch2_marks || '8.00 / 10.00'}</td>
                <td className="status-cell">
                  <span className={`status-pill ${report.sst_ch2_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                    {report.sst_ch2_status || 'Cleared'}
                  </span>
                </td>
              </tr>

              {/* Languages */}
              <tr>
                <td rowSpan={2} className="subject-cell">Languages</td>
                <td className="chapter-cell">{report.lang_eng_name || 'English (Ch 1-2): Three Questions & The Squirrel'}</td>
                <td className="table-score-cell">{report.lang_eng_marks || '9.00 / 10.00'}</td>
                <td className="status-cell">
                  <span className={`status-pill ${report.lang_eng_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                    {report.lang_eng_status || 'Cleared'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="chapter-cell">{report.lang_hindi_name || 'Hindi (Ch 1-2): हम पंछी उन्मुक्त गगन के & दादी माँ'}</td>
                <td className="table-score-cell">{report.lang_hindi_marks || '8.50 / 10.00'}</td>
                <td className="status-cell">
                  <span className={`status-pill ${report.lang_hindi_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                    {report.lang_hindi_status || 'Cleared'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 3: COMMUNICATION SKILLS & CONVERSATIONAL ENGLISH HABITS */}
        <div className="report-section">
          <div className="report-section-header">
            <span className="section-title">3. COMMUNICATION SKILLS &amp; CONVERSATIONAL ENGLISH HABITS</span>
            <span className="section-subtitle">Manners &amp; Confidence (/20.00) + English Usage Percentage (/10.00)</span>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>BEHAVIORAL &amp; COMMUNICATION PARAMETER</th>
                <th style={{ width: '12%' }}>MAX SCALE</th>
                <th style={{ width: '14%' }}>SCORE AWARDED</th>
                <th style={{ width: '36%' }}>OBSERVATION &amp; FEEDBACK</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="table-primary-text">Respectful Manners, Listening &amp; Etiquette</div>
                  <div className="table-secondary-text">Greeting tutor, polite speech, attentiveness</div>
                </td>
                <td className="table-text-cell">{report.manners_max?.toFixed(2) || '10.00'}</td>
                <td className="table-score-cell highlight-green">{report.manners_score?.toFixed(2) || '9.50'}</td>
                <td className="table-obs-cell">{report.manners_obs || 'Polite, attentive; follows homework schedules obediently.'}</td>
              </tr>
              <tr>
                <td>
                  <div className="table-primary-text">Confidence &amp; Articulation / Way of Speaking</div>
                  <div className="table-secondary-text">Eye contact, voice clarity, prompt doubt-asking</div>
                </td>
                <td className="table-text-cell">{report.confidence_max?.toFixed(2) || '10.00'}</td>
                <td className="table-score-cell highlight-green">{report.confidence_score?.toFixed(2) || '8.50'}</td>
                <td className="table-obs-cell">{report.confidence_obs || 'Answers without shyness; asks doubts with clarity.'}</td>
              </tr>
              <tr>
                <td>
                  <div className="table-primary-text">Spoken English Usage in Daily Conversation</div>
                  <div className="table-secondary-text">Percentage of English vocabulary used during tuition</div>
                </td>
                <td className="table-text-cell">{report.english_usage_max?.toFixed(2) || '10.00'}</td>
                <td className="table-score-cell highlight-purple">{report.english_usage_score?.toFixed(2) || '8.00'}</td>
                <td className="table-obs-cell">{report.english_usage_obs || '~65% English words used actively during tuition hours.'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 4: SUPER-INTELLIGENCE & HIGH-PERFORMANCE PILLARS */}
        <div className="report-section">
          <div className="report-section-header">
            <span className="section-title">4. SUPER-INTELLIGENCE &amp; HIGH-PERFORMANCE PILLARS</span>
            <span className="section-subtitle">Building Analytical Mindset, Fast Calculation, IQ &amp; Daily Discipline</span>
          </div>

          <div className="pillars-grid">
            {/* Mental Math & Speed Agility */}
            <div className="pillar-card">
              <div className="pillar-card-header">
                <span className="pillar-title">Mental Math &amp; Speed Agility</span>
                <span className="pillar-score">{report.mental_math_score || '9.0 / 10.00'}</span>
              </div>
              <div className="pillar-body">
                {report.mental_math_obs || 'Fast oral tables up to 19; prompt mental addition without rough notebook dependence.'}
              </div>
            </div>

            {/* Logical Aptitude & Brain Puzzles */}
            <div className="pillar-card">
              <div className="pillar-card-header">
                <span className="pillar-title">Logical Aptitude &amp; Brain Puzzles</span>
                <span className="pillar-score">{report.logical_aptitude_score || '8.5 / 10.00'}</span>
              </div>
              <div className="pillar-body">
                {report.logical_aptitude_obs || 'Solved 4/5 pattern-finding and critical reasoning puzzles during weekly aptitude rounds.'}
              </div>
            </div>

            {/* Homework Discipline & Self-Study */}
            <div className="pillar-card">
              <div className="pillar-card-header">
                <span className="pillar-title">Homework Discipline &amp; Self-Study</span>
                <span className="pillar-score">{report.homework_score || '9.5 / 10.00'}</span>
              </div>
              <div className="pillar-body">
                {report.homework_obs || '96% daily homework completion rate on time without needing repeated follow-ups.'}
              </div>
            </div>

            {/* Neatness, Handwriting & Copy Layout */}
            <div className="pillar-card">
              <div className="pillar-card-header">
                <span className="pillar-title">Neatness, Handwriting &amp; Copy Layout</span>
                <span className="pillar-score">{report.neatness_score || '8.0 / 10.00'}</span>
              </div>
              <div className="pillar-body">
                {report.neatness_obs || 'Clean margin maintenance; neat step-by-step working. Science diagram labeling can improve.'}
              </div>
            </div>
          </div>
        </div>

        {/* OVERALL PERFORMANCE SUMMARY BAR */}
        <div className="report-summary-bar">
          <div className="summary-left">
            <span className="summary-label">Overall Performance:</span>
            <span className="summary-highlight">{report.overall_percentage?.toFixed(1) || '86.5'}% ({report.grade || 'Grade A+ Outstanding'})</span>
            <span className="summary-divider">•</span>
            <span className="summary-target">Next Month Target: {report.next_month_target || 'Chapters 3 & 4 of all subjects'}</span>
          </div>
          <div className="summary-right">
            <span className="summary-focus">Focus: {report.focus_recommendation || 'Daily 15m English book reading at home'}</span>
          </div>
        </div>

        {/* 3 OFFICIAL SIGNATORIES */}
        <div className="report-signatures">
          <div className="sig-block">
            <div className="sig-line"></div>
            <div className="sig-title">ASSIGNED HOME TUTOR</div>
            <div className="sig-subtitle">Horizon Certified Faculty</div>
          </div>
          <div className="sig-block">
            <div className="sig-line"></div>
            <div className="sig-title">PARENT / GUARDIAN</div>
            <div className="sig-subtitle">Verified &amp; Acknowledged</div>
          </div>
          <div className="sig-block">
            <div className="sig-line"></div>
            <div className="sig-title">HORIZON ACADEMIC COORDINATOR</div>
            <div className="sig-subtitle">Official Quality Audit</div>
          </div>
        </div>

        {/* DOCUMENT FOOTER */}
        <div className="report-footer">
          <span>HORIZON HOME TUITION • Monthly Comprehensive Student Evaluation</span>
          <span>Empowering Smart Learning at Home</span>
          <span>Page 1 of 1</span>
        </div>

      </div>

      {/* Embedded High-Fidelity Print & Layout Styles */}
      <style jsx>{`
        .report-card-container {
          width: 100%;
          min-height: 100vh;
          background: #0B0F19;
          padding: 2rem 1rem 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .report-card-actions {
          width: 100%;
          max-width: 900px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .report-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 8px;
          background: linear-gradient(135deg, #F59E0B, #D97706);
          color: #000;
          font-weight: 800;
          font-size: 0.92rem;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);
          transition: transform 0.2s;
        }
        .report-btn-primary:hover {
          transform: translateY(-2px);
        }

        .report-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          background: #1E293B;
          color: #F8FAFC;
          font-weight: 600;
          font-size: 0.88rem;
          text-decoration: none;
          border: 1px solid #334155;
          transition: background 0.2s;
        }
        .report-btn-secondary:hover {
          background: #334155;
        }

        /* The Paper Sheet */
        .report-card-paper {
          width: 100%;
          max-width: 900px;
          background: #FFFFFF;
          color: #0F172A;
          padding: 28px 34px 22px;
          border-radius: 4px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-sizing: border-box;
          line-height: 1.25;
        }

        /* Meta Grid */
        .report-meta-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr 1.3fr;
          border: 1px solid #CBD5E1;
          border-radius: 4px;
          margin: 14px 0 12px;
          background: #F8FAFC;
        }

        .report-meta-box {
          padding: 6px 10px;
          border-right: 1px solid #CBD5E1;
        }
        .report-meta-box:last-child {
          border-right: none;
        }

        .report-meta-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: #475569;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .report-meta-value {
          font-size: 0.88rem;
          font-weight: 800;
          color: #0F172A;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Section Containers */
        .report-section {
          margin-bottom: 12px;
        }

        .report-section-header {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          background: #0F172A;
          color: #FFFFFF;
          padding: 5px 10px;
          border-radius: 3px 3px 0 0;
        }

        .section-title {
          font-size: 0.74rem;
          font-weight: 900;
          letter-spacing: 0.03em;
        }

        .section-subtitle {
          font-size: 0.65rem;
          color: #94A3B8;
          font-weight: 600;
        }

        /* Tables */
        .report-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #CBD5E1;
          border-top: none;
          font-size: 0.75rem;
        }

        .report-table th {
          background: #F1F5F9;
          color: #334155;
          font-weight: 800;
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          padding: 5px 8px;
          border: 1px solid #CBD5E1;
          text-align: left;
        }

        .report-table td {
          padding: 4.5px 8px;
          border: 1px solid #E2E8F0;
          vertical-align: middle;
        }

        .table-primary-text {
          font-weight: 800;
          color: #0284C7;
          font-size: 0.76rem;
        }

        .table-secondary-text {
          font-size: 0.64rem;
          color: #64748B;
          margin-top: 1px;
        }

        .table-text-cell {
          font-size: 0.73rem;
          color: #334155;
        }

        .table-score-cell {
          font-size: 0.78rem;
          font-weight: 800;
          color: #0F172A;
          text-align: right;
          padding-right: 12px;
          font-family: 'Inter', monospace;
        }

        .subject-cell {
          font-weight: 800;
          color: #0F172A;
          background: #F8FAFC;
          border-right: 1px solid #CBD5E1;
          font-size: 0.78rem;
        }

        .chapter-cell {
          color: #1E293B;
          font-weight: 600;
          font-size: 0.73rem;
        }

        .status-cell {
          text-align: center;
        }

        .status-pill {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .status-cleared {
          background: #DCFCE7;
          color: #15803D;
        }
        .status-revision {
          background: #FEF3C7;
          color: #B45309;
        }

        .highlight-green {
          color: #16A34A;
          font-weight: 800;
        }
        .highlight-purple {
          color: #9333EA;
          font-weight: 800;
        }
        .font-bold {
          font-weight: 800;
        }

        .table-obs-cell {
          font-size: 0.71rem;
          color: #475569;
          line-height: 1.25;
        }

        /* Pillars Grid */
        .pillars-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          border: 1px solid #CBD5E1;
          border-top: none;
          padding: 6px;
          background: #FFFFFF;
        }

        .pillar-card {
          border: 1px solid #E2E8F0;
          border-radius: 3px;
          padding: 5px 8px;
          background: #FAFAFA;
        }

        .pillar-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2px;
        }

        .pillar-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: #0284C7;
        }

        .pillar-score {
          font-size: 0.74rem;
          font-weight: 800;
          color: #0284C7;
          font-family: 'Inter', monospace;
        }

        .pillar-body {
          font-size: 0.67rem;
          color: #475569;
          line-height: 1.25;
        }

        /* Summary Bar */
        .report-summary-bar {
          margin: 10px 0;
          padding: 6px 12px;
          background: #F8FAFC;
          border-left: 4px solid #0284C7;
          border-radius: 2px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
        }

        .summary-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .summary-label {
          font-weight: 800;
          color: #0F172A;
        }

        .summary-highlight {
          font-weight: 800;
          color: #0284C7;
        }

        .summary-divider {
          color: #94A3B8;
          font-weight: bold;
        }

        .summary-target {
          color: #1E293B;
          font-weight: 700;
        }

        .summary-right {
          font-weight: 700;
          color: #475569;
        }

        /* Signatures */
        .report-signatures {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          margin-top: 18px;
          padding-top: 10px;
        }

        .sig-block {
          text-align: center;
        }

        .sig-line {
          width: 100%;
          height: 1px;
          background: #475569;
          margin-bottom: 6px;
        }

        .sig-title {
          font-size: 0.68rem;
          font-weight: 900;
          color: #0F172A;
          letter-spacing: 0.03em;
        }

        .sig-subtitle {
          font-size: 0.62rem;
          color: #64748B;
          font-weight: 600;
          margin-top: 1px;
        }

        /* Footer */
        .report-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 14px;
          padding-top: 6px;
          border-top: 1px solid #E2E8F0;
          font-size: 0.62rem;
          color: #64748B;
          font-weight: 600;
        }

        /* Mobile Media Queries */
        @media screen and (max-width: 768px) {
          .report-card-container {
            padding: 0.65rem 0.4rem 2.5rem;
          }

          .report-card-actions {
            flex-wrap: wrap;
            gap: 8px;
          }

          .report-card-paper {
            padding: 16px 12px 14px;
            border-radius: 8px;
          }

          .report-meta-grid {
            grid-template-columns: 1fr 1fr;
          }

          .report-table {
            display: block;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .pillars-grid {
            grid-template-columns: 1fr;
          }

          .report-signatures {
            gap: 10px;
          }
        }

        @media screen and (max-width: 480px) {
          .report-meta-grid {
            grid-template-columns: 1fr;
          }

          .report-meta-box {
            border-right: none;
            border-bottom: 1px solid #CBD5E1;
          }

          .report-summary-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }

        /* Print Media Styles */
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 8mm 6mm 8mm;
          }

          body {
            background: #FFFFFF !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print {
            display: none !important;
          }

          .report-card-container {
            background: #FFFFFF !important;
            padding: 0 !important;
            min-height: auto !important;
          }

          .report-card-paper {
            box-shadow: none !important;
            max-width: 100% !important;
            padding: 0 !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
