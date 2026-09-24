'use client';

import React, { useState, useEffect } from 'react';
import HorizonBrandHeader from './HorizonBrandHeader';
import { MonthlyReportCard, supabase } from '@/lib/supabase';
import {
  Printer,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  ArrowLeft,
  BookOpen,
  Award,
  Zap,
  Clock,
  User,
  Calendar,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface ReportCardInteractiveEditorProps {
  initialReport?: Partial<MonthlyReportCard>;
  dutyId?: string;
  studentId?: string;
  onSaveSuccess?: (savedReport: MonthlyReportCard) => void;
  backUrl?: string;
}

const DEFAULT_SAMPLE_DATA: MonthlyReportCard = {
  id: '',
  student_id: '',
  student_name: 'Aaryan Sharma',
  parent_name: 'Suresh Sharma',
  class_grade: 'Class 7th • CBSE/ICSE',
  assessment_month: 'September, 2026',
  
  assigned_tutor_name: 'Harshit Patel (PCE Purnia)',
  assigned_tutor_contact: '+91 9162162128',
  evaluator_tutor_name: 'Vikash Kumar (Certified Cross-Examiner)',
  test_center_name: 'Purnia Central Evaluation Hub (Center #1)',

  hindi_passage_length_time: '160 Words • 1m 25s',
  hindi_speed_wpm: '113 WPM (Good)',
  hindi_comprehension_qs: '4.0 / 5.0 Correct (1 Error)',
  hindi_fluency: '8.50 / 10.00',

  english_passage_length_time: '175 Words • 1m 35s',
  english_speed_wpm: '110 WPM (Optimal)',
  english_comprehension_qs: '5.0 / 5.0 Correct (0 Error)',
  english_fluency: '9.00 / 10.00',

  math_ch1_name: 'Ch 1: Integers, Number Line & Rules',
  math_ch1_marks: '9.50 / 10.00',
  math_ch1_status: 'Cleared',
  math_ch2_name: 'Ch 2: Fractions, Decimals & Problem Sums',
  math_ch2_marks: '8.50 / 10.00',
  math_ch2_status: 'Cleared',

  science_ch1_name: 'Ch 1: Nutrition in Plants (Modes & Photosynthesis)',
  science_ch1_marks: '9.00 / 10.00',
  science_ch1_status: 'Cleared',
  science_ch2_name: 'Ch 2: Nutrition in Animals (Digestive Organs)',
  science_ch2_marks: '7.50 / 10.00',
  science_ch2_status: 'Revision',

  sst_ch1_name: 'Ch 1: Tracing Changes Through a Thousand Years',
  sst_ch1_marks: '8.50 / 10.00',
  sst_ch1_status: 'Cleared',
  sst_ch2_name: 'Ch 2: Our Environment & Earth Interior Layers',
  sst_ch2_marks: '8.00 / 10.00',
  sst_ch2_status: 'Cleared',

  lang_eng_name: 'English (Ch 1-2): Three Questions & The Squirrel',
  lang_eng_marks: '9.00 / 10.00',
  lang_eng_status: 'Cleared',
  lang_hindi_name: 'Hindi (Ch 1-2): हम पंछी उन्मुक्त गगन के & दादी माँ',
  lang_hindi_marks: '8.50 / 10.00',
  lang_hindi_status: 'Cleared',

  manners_max: 10,
  manners_score: 9.50,
  manners_obs: 'Polite, attentive; follows homework schedules obediently.',
  confidence_max: 10,
  confidence_score: 8.50,
  confidence_obs: 'Answers without shyness; asks doubts with clarity.',
  english_usage_max: 10,
  english_usage_score: 8.00,
  english_usage_obs: '~65% English words used actively during tuition hours.',

  mental_math_score: '9.0 / 10.00',
  mental_math_obs: 'Fast oral tables up to 19; prompt mental addition without rough notebook dependence.',
  logical_aptitude_score: '8.5 / 10.00',
  logical_aptitude_obs: 'Solved 4/5 pattern-finding and critical reasoning puzzles during weekly aptitude rounds.',
  homework_score: '9.5 / 10.00',
  homework_obs: '96% daily homework completion rate on time without needing repeated follow-ups.',
  neatness_score: '8.0 / 10.00',
  neatness_obs: 'Clean margin maintenance; neat step-by-step working. Science diagram labeling can improve.',

  overall_percentage: 86.5,
  grade: 'Grade A+ Outstanding',
  next_month_target: 'Chapters 3 & 4 of all subjects',
  focus_recommendation: 'Daily 15m English book reading at home',
  status: 'VERIFIED'
};

export default function ReportCardInteractiveEditor({
  initialReport,
  dutyId,
  studentId,
  onSaveSuccess,
  backUrl = '/tutor-dashboard'
}: ReportCardInteractiveEditorProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<MonthlyReportCard>(() => ({
    ...DEFAULT_SAMPLE_DATA,
    ...(initialReport || {}),
    id: initialReport?.id || `rep-${Date.now()}`
  }));

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper to parse numerical score from string like "9.50 / 10.00"
  const parseMarks = (val?: string): number => {
    if (!val) return 0;
    const match = val.match(/^([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Live Auto-Calculate Overall % and Grade
  useEffect(() => {
    const scores = [
      parseMarks(formData.hindi_fluency),
      parseMarks(formData.english_fluency),
      parseMarks(formData.math_ch1_marks),
      parseMarks(formData.math_ch2_marks),
      parseMarks(formData.science_ch1_marks),
      parseMarks(formData.science_ch2_marks),
      parseMarks(formData.sst_ch1_marks),
      parseMarks(formData.sst_ch2_marks),
      parseMarks(formData.lang_eng_marks),
      parseMarks(formData.lang_hindi_marks),
      formData.manners_score || 0,
      formData.confidence_score || 0,
      formData.english_usage_score || 0,
      parseMarks(formData.mental_math_score),
      parseMarks(formData.logical_aptitude_score),
      parseMarks(formData.homework_score),
      parseMarks(formData.neatness_score)
    ];

    const totalAwarded = scores.reduce((a, b) => a + b, 0);
    const maxPossible = 170; // 17 items * 10 marks each
    const pct = parseFloat(((totalAwarded / maxPossible) * 100).toFixed(1));

    let autoGrade = 'Grade A+ Outstanding';
    if (pct >= 90) autoGrade = 'Grade A+ Outstanding';
    else if (pct >= 80) autoGrade = 'Grade A Excellent';
    else if (pct >= 70) autoGrade = 'Grade B+ Very Good';
    else if (pct >= 60) autoGrade = 'Grade B Good';
    else autoGrade = 'Grade C Needs Improvement';

    setFormData((prev) => ({
      ...prev,
      overall_percentage: pct,
      grade: autoGrade
    }));
  }, [
    formData.hindi_fluency,
    formData.english_fluency,
    formData.math_ch1_marks,
    formData.math_ch1_status,
    formData.math_ch2_marks,
    formData.science_ch1_marks,
    formData.science_ch2_marks,
    formData.sst_ch1_marks,
    formData.sst_ch2_marks,
    formData.lang_eng_marks,
    formData.lang_hindi_marks,
    formData.manners_score,
    formData.confidence_score,
    formData.english_usage_score,
    formData.mental_math_score,
    formData.logical_aptitude_score,
    formData.homework_score,
    formData.neatness_score
  ]);

  const handleChange = (field: keyof MonthlyReportCard, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleStatus = (field: keyof MonthlyReportCard) => {
    const current = formData[field] as string;
    const nextVal = current === 'Cleared' ? 'Revision' : 'Cleared';
    handleChange(field, nextVal);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all fields to sample baseline template?')) {
      setFormData({
        ...DEFAULT_SAMPLE_DATA,
        id: `rep-${Date.now()}`
      });
      setSaveMessage({ type: 'success', text: 'Reset to standard baseline report!' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const code = formData.report_code || `REP-${Date.now().toString().slice(-6)}`;
      const payload: MonthlyReportCard = {
        ...formData,
        report_code: code,
        status: 'VERIFIED'
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from('monthly_report_cards')
        .upsert([payload])
        .select()
        .single();

      const finalRecord = data || payload;
      
      // Save local backup
      localStorage.setItem(`horizon_report_${finalRecord.id || code}`, JSON.stringify(finalRecord));
      
      setSaveMessage({
        type: 'success',
        text: `Official Report Card for ${finalRecord.student_name} successfully saved & locked!`
      });

      if (onSaveSuccess) {
        onSaveSuccess(finalRecord);
      }
    } catch (err: any) {
      console.warn('Supabase save with local storage fallback:', err.message);
      localStorage.setItem(`horizon_report_${formData.id}`, JSON.stringify(formData));
      setSaveMessage({
        type: 'success',
        text: `Report saved to offline store successfully!`
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="report-editor-container">
      {/* Top Floating Control Bar (Hidden in Print) */}
      <header className="no-print editor-toolbar">
        <div className="toolbar-left">
          <Link href={backUrl} className="tool-btn tool-btn-secondary">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
          <div className="duty-badge">
            <ShieldCheck size={16} color="#F59E0B" />
            <span>LIVE DIRECT-ON-PAGE FILLABLE REPORT CARD</span>
          </div>
        </div>

        <div className="toolbar-right">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`tool-btn ${isPreviewMode ? 'tool-btn-active' : 'tool-btn-secondary'}`}
            title="Toggle between Interactive Fill Form and Clean Print Preview"
          >
            {isPreviewMode ? <Edit3 size={16} /> : <Eye size={16} />}
            <span>{isPreviewMode ? 'Edit Live Mode' : 'Clean Preview'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="tool-btn tool-btn-secondary"
            title="Reset baseline values"
          >
            <RotateCcw size={15} />
            <span>Fill Baseline</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="tool-btn tool-btn-secondary"
          >
            <Printer size={16} />
            <span>Print / PDF</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="tool-btn tool-btn-primary"
          >
            {isSaving ? <Sparkles size={16} className="spin" /> : <Save size={16} />}
            <span>{isSaving ? 'Saving...' : 'Save & Lock Report'}</span>
          </button>
        </div>
      </header>

      {/* Save Notification Banner */}
      {saveMessage && (
        <div className="no-print notification-banner" style={{
          background: saveMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          borderColor: saveMessage.type === 'success' ? '#10B981' : '#EF4444',
          color: saveMessage.type === 'success' ? '#34D399' : '#F87171'
        }}>
          {saveMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Helpful Examiner Quick Instructions */}
      {!isPreviewMode && (
        <div className="no-print examiner-hint-bar">
          <div className="hint-pill">
            <Sparkles size={14} color="#F59E0B" />
            <span><b>Direct In-Place Evaluation:</b> Type or click directly into the report card below as you conduct each oral &amp; written test. Everything is auto-calculated live!</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ===================== EXACT A4 REPORT CARD SHEET ======================== */}
      {/* ========================================================================= */}
      <div className={`report-card-paper ${isPreviewMode ? 'mode-preview' : 'mode-interactive'}`}>
        
        {/* Real-time Centralized Brand Header */}
        <HorizonBrandHeader
          logoSize={52}
          titleSize="1.55rem"
          subtitleSize="0.68rem"
          reportTitle="MONTHLY PROGRESS REPORT"
          reportSubtitle="Single-Page Comprehensive Audit"
          dark={true}
        />

        {/* STUDENT & ASSESSMENT META GRID */}
        <div className="report-meta-grid">
          <div className="report-meta-box">
            <label className="report-meta-label">STUDENT NAME</label>
            {isPreviewMode ? (
              <div className="report-meta-value">{formData.student_name}</div>
            ) : (
              <input
                type="text"
                className="live-input live-input-bold"
                value={formData.student_name || ''}
                onChange={(e) => handleChange('student_name', e.target.value)}
                placeholder="e.g. Aaryan Sharma"
              />
            )}
          </div>

          <div className="report-meta-box">
            <label className="report-meta-label">CLASS / GRADE</label>
            {isPreviewMode ? (
              <div className="report-meta-value">{formData.class_grade}</div>
            ) : (
              <input
                type="text"
                className="live-input live-input-bold"
                value={formData.class_grade || ''}
                onChange={(e) => handleChange('class_grade', e.target.value)}
                placeholder="e.g. Class 7th • CBSE"
              />
            )}
          </div>

          <div className="report-meta-box">
            <label className="report-meta-label">ASSESSMENT MONTH</label>
            {isPreviewMode ? (
              <div className="report-meta-value">{formData.assessment_month}</div>
            ) : (
              <input
                type="text"
                className="live-input live-input-bold"
                value={formData.assessment_month || ''}
                onChange={(e) => handleChange('assessment_month', e.target.value)}
                placeholder="e.g. September, 2026"
              />
            )}
          </div>

          <div className="report-meta-box">
            <label className="report-meta-label">ASSIGNED TUTOR &amp; CONTACT</label>
            {isPreviewMode ? (
              <div className="report-meta-value">{formData.assigned_tutor_name} {formData.assigned_tutor_contact ? `• ${formData.assigned_tutor_contact}` : ''}</div>
            ) : (
              <div style={{ display: 'flex', gap: '4px' }}>
                <input
                  type="text"
                  className="live-input live-input-bold"
                  value={formData.assigned_tutor_name || ''}
                  onChange={(e) => handleChange('assigned_tutor_name', e.target.value)}
                  placeholder="Tutor Name"
                  style={{ width: '60%' }}
                />
                <input
                  type="text"
                  className="live-input"
                  value={formData.assigned_tutor_contact || ''}
                  onChange={(e) => handleChange('assigned_tutor_contact', e.target.value)}
                  placeholder="Phone"
                  style={{ width: '40%' }}
                />
              </div>
            )}
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
                <th style={{ width: '24%' }}>LANGUAGE MEDIUM</th>
                <th style={{ width: '26%' }}>PASSAGE LENGTH &amp; TIME</th>
                <th style={{ width: '18%' }}>SPEED (WPM)</th>
                <th style={{ width: '20%' }}>5 COMPREHENSION QS</th>
                <th style={{ width: '12%', textAlign: 'right' }}>FLUENCY (/10)</th>
              </tr>
            </thead>
            <tbody>
              {/* Hindi Row */}
              <tr>
                <td>
                  <div className="table-primary-text">Hindi Passage Reading</div>
                  <div className="table-secondary-text">(शुद्धता एवं स्पष्ट उच्चारण)</div>
                </td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-text-cell">{formData.hindi_passage_length_time}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-input"
                      value={formData.hindi_passage_length_time || ''}
                      onChange={(e) => handleChange('hindi_passage_length_time', e.target.value)}
                      placeholder="e.g. 160 Words • 1m 25s"
                    />
                  )}
                </td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-text-cell font-bold">{formData.hindi_speed_wpm}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-input font-bold"
                      value={formData.hindi_speed_wpm || ''}
                      onChange={(e) => handleChange('hindi_speed_wpm', e.target.value)}
                      placeholder="e.g. 113 WPM (Good)"
                    />
                  )}
                </td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-text-cell highlight-green">{formData.hindi_comprehension_qs}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-input highlight-green"
                      value={formData.hindi_comprehension_qs || ''}
                      onChange={(e) => handleChange('hindi_comprehension_qs', e.target.value)}
                      placeholder="e.g. 4.0 / 5.0 Correct"
                    />
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {isPreviewMode ? (
                    <span className="table-score-cell">{formData.hindi_fluency}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-score-input"
                      value={formData.hindi_fluency || ''}
                      onChange={(e) => handleChange('hindi_fluency', e.target.value)}
                      placeholder="8.50 / 10.00"
                    />
                  )}
                </td>
              </tr>

              {/* English Row */}
              <tr>
                <td>
                  <div className="table-primary-text">English Passage Reading</div>
                  <div className="table-secondary-text">(Pace &amp; Pronunciation)</div>
                </td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-text-cell">{formData.english_passage_length_time}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-input"
                      value={formData.english_passage_length_time || ''}
                      onChange={(e) => handleChange('english_passage_length_time', e.target.value)}
                      placeholder="e.g. 175 Words • 1m 35s"
                    />
                  )}
                </td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-text-cell font-bold">{formData.english_speed_wpm}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-input font-bold"
                      value={formData.english_speed_wpm || ''}
                      onChange={(e) => handleChange('english_speed_wpm', e.target.value)}
                      placeholder="e.g. 110 WPM (Optimal)"
                    />
                  )}
                </td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-text-cell highlight-green">{formData.english_comprehension_qs}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-input highlight-green"
                      value={formData.english_comprehension_qs || ''}
                      onChange={(e) => handleChange('english_comprehension_qs', e.target.value)}
                      placeholder="e.g. 5.0 / 5.0 Correct"
                    />
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {isPreviewMode ? (
                    <span className="table-score-cell">{formData.english_fluency}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-score-input"
                      value={formData.english_fluency || ''}
                      onChange={(e) => handleChange('english_fluency', e.target.value)}
                      placeholder="9.00 / 10.00"
                    />
                  )}
                </td>
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
                <th style={{ width: '20%' }}>SUBJECT</th>
                <th style={{ width: '54%' }}>ASSIGNED TARGET CHAPTERS TESTED THIS MONTH</th>
                <th style={{ width: '14%', textAlign: 'right' }}>MARKS (/10)</th>
                <th style={{ width: '12%', textAlign: 'center' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {/* Mathematics */}
              <tr>
                <td rowSpan={2} className="subject-cell">Mathematics</td>
                <td className="chapter-cell">
                  {isPreviewMode ? (
                    formData.math_ch1_name
                  ) : (
                    <input
                      type="text"
                      className="live-table-input"
                      value={formData.math_ch1_name || ''}
                      onChange={(e) => handleChange('math_ch1_name', e.target.value)}
                      placeholder="Ch 1 Name & Topics"
                    />
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {isPreviewMode ? (
                    <span className="table-score-cell">{formData.math_ch1_marks}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-score-input"
                      value={formData.math_ch1_marks || ''}
                      onChange={(e) => handleChange('math_ch1_marks', e.target.value)}
                      placeholder="9.50 / 10.00"
                    />
                  )}
                </td>
                <td className="status-cell">
                  {isPreviewMode ? (
                    <span className={`status-pill ${formData.math_ch1_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                      {formData.math_ch1_status || 'Cleared'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus('math_ch1_status')}
                      className={`status-pill clickable-pill ${formData.math_ch1_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}
                    >
                      {formData.math_ch1_status || 'Cleared'}
                    </button>
                  )}
                </td>
              </tr>
              <tr>
                <td className="chapter-cell">
                  {isPreviewMode ? (
                    formData.math_ch2_name
                  ) : (
                    <input
                      type="text"
                      className="live-table-input"
                      value={formData.math_ch2_name || ''}
                      onChange={(e) => handleChange('math_ch2_name', e.target.value)}
                      placeholder="Ch 2 Name & Topics"
                    />
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {isPreviewMode ? (
                    <span className="table-score-cell">{formData.math_ch2_marks}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-score-input"
                      value={formData.math_ch2_marks || ''}
                      onChange={(e) => handleChange('math_ch2_marks', e.target.value)}
                      placeholder="8.50 / 10.00"
                    />
                  )}
                </td>
                <td className="status-cell">
                  {isPreviewMode ? (
                    <span className={`status-pill ${formData.math_ch2_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                      {formData.math_ch2_status || 'Cleared'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus('math_ch2_status')}
                      className={`status-pill clickable-pill ${formData.math_ch2_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}
                    >
                      {formData.math_ch2_status || 'Cleared'}
                    </button>
                  )}
                </td>
              </tr>

              {/* Science */}
              <tr>
                <td rowSpan={2} className="subject-cell">Science</td>
                <td className="chapter-cell">
                  {isPreviewMode ? (
                    formData.science_ch1_name
                  ) : (
                    <input
                      type="text"
                      className="live-table-input"
                      value={formData.science_ch1_name || ''}
                      onChange={(e) => handleChange('science_ch1_name', e.target.value)}
                      placeholder="Ch 1 Name"
                    />
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {isPreviewMode ? (
                    <span className="table-score-cell">{formData.science_ch1_marks}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-score-input"
                      value={formData.science_ch1_marks || ''}
                      onChange={(e) => handleChange('science_ch1_marks', e.target.value)}
                      placeholder="9.00 / 10.00"
                    />
                  )}
                </td>
                <td className="status-cell">
                  {isPreviewMode ? (
                    <span className={`status-pill ${formData.science_ch1_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                      {formData.science_ch1_status || 'Cleared'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus('science_ch1_status')}
                      className={`status-pill clickable-pill ${formData.science_ch1_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}
                    >
                      {formData.science_ch1_status || 'Cleared'}
                    </button>
                  )}
                </td>
              </tr>
              <tr>
                <td className="chapter-cell">
                  {isPreviewMode ? (
                    formData.science_ch2_name
                  ) : (
                    <input
                      type="text"
                      className="live-table-input"
                      value={formData.science_ch2_name || ''}
                      onChange={(e) => handleChange('science_ch2_name', e.target.value)}
                      placeholder="Ch 2 Name"
                    />
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {isPreviewMode ? (
                    <span className="table-score-cell">{formData.science_ch2_marks}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-score-input"
                      value={formData.science_ch2_marks || ''}
                      onChange={(e) => handleChange('science_ch2_marks', e.target.value)}
                      placeholder="7.50 / 10.00"
                    />
                  )}
                </td>
                <td className="status-cell">
                  {isPreviewMode ? (
                    <span className={`status-pill ${formData.science_ch2_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                      {formData.science_ch2_status || 'Revision'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus('science_ch2_status')}
                      className={`status-pill clickable-pill ${formData.science_ch2_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}
                    >
                      {formData.science_ch2_status || 'Revision'}
                    </button>
                  )}
                </td>
              </tr>

              {/* Social Science */}
              <tr>
                <td rowSpan={2} className="subject-cell">Social Science</td>
                <td className="chapter-cell">
                  {isPreviewMode ? (
                    formData.sst_ch1_name
                  ) : (
                    <input
                      type="text"
                      className="live-table-input"
                      value={formData.sst_ch1_name || ''}
                      onChange={(e) => handleChange('sst_ch1_name', e.target.value)}
                      placeholder="SST Ch 1 Name"
                    />
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {isPreviewMode ? (
                    <span className="table-score-cell">{formData.sst_ch1_marks}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-score-input"
                      value={formData.sst_ch1_marks || ''}
                      onChange={(e) => handleChange('sst_ch1_marks', e.target.value)}
                      placeholder="8.50 / 10.00"
                    />
                  )}
                </td>
                <td className="status-cell">
                  {isPreviewMode ? (
                    <span className={`status-pill ${formData.sst_ch1_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                      {formData.sst_ch1_status || 'Cleared'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus('sst_ch1_status')}
                      className={`status-pill clickable-pill ${formData.sst_ch1_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}
                    >
                      {formData.sst_ch1_status || 'Cleared'}
                    </button>
                  )}
                </td>
              </tr>
              <tr>
                <td className="chapter-cell">
                  {isPreviewMode ? (
                    formData.sst_ch2_name
                  ) : (
                    <input
                      type="text"
                      className="live-table-input"
                      value={formData.sst_ch2_name || ''}
                      onChange={(e) => handleChange('sst_ch2_name', e.target.value)}
                      placeholder="SST Ch 2 Name"
                    />
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {isPreviewMode ? (
                    <span className="table-score-cell">{formData.sst_ch2_marks}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-score-input"
                      value={formData.sst_ch2_marks || ''}
                      onChange={(e) => handleChange('sst_ch2_marks', e.target.value)}
                      placeholder="8.00 / 10.00"
                    />
                  )}
                </td>
                <td className="status-cell">
                  {isPreviewMode ? (
                    <span className={`status-pill ${formData.sst_ch2_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                      {formData.sst_ch2_status || 'Cleared'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus('sst_ch2_status')}
                      className={`status-pill clickable-pill ${formData.sst_ch2_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}
                    >
                      {formData.sst_ch2_status || 'Cleared'}
                    </button>
                  )}
                </td>
              </tr>

              {/* Languages */}
              <tr>
                <td rowSpan={2} className="subject-cell">Languages</td>
                <td className="chapter-cell">
                  {isPreviewMode ? (
                    formData.lang_eng_name
                  ) : (
                    <input
                      type="text"
                      className="live-table-input"
                      value={formData.lang_eng_name || ''}
                      onChange={(e) => handleChange('lang_eng_name', e.target.value)}
                      placeholder="English Ch Topics"
                    />
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {isPreviewMode ? (
                    <span className="table-score-cell">{formData.lang_eng_marks}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-score-input"
                      value={formData.lang_eng_marks || ''}
                      onChange={(e) => handleChange('lang_eng_marks', e.target.value)}
                      placeholder="9.00 / 10.00"
                    />
                  )}
                </td>
                <td className="status-cell">
                  {isPreviewMode ? (
                    <span className={`status-pill ${formData.lang_eng_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                      {formData.lang_eng_status || 'Cleared'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus('lang_eng_status')}
                      className={`status-pill clickable-pill ${formData.lang_eng_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}
                    >
                      {formData.lang_eng_status || 'Cleared'}
                    </button>
                  )}
                </td>
              </tr>
              <tr>
                <td className="chapter-cell">
                  {isPreviewMode ? (
                    formData.lang_hindi_name
                  ) : (
                    <input
                      type="text"
                      className="live-table-input"
                      value={formData.lang_hindi_name || ''}
                      onChange={(e) => handleChange('lang_hindi_name', e.target.value)}
                      placeholder="Hindi Ch Topics"
                    />
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {isPreviewMode ? (
                    <span className="table-score-cell">{formData.lang_hindi_marks}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-score-input"
                      value={formData.lang_hindi_marks || ''}
                      onChange={(e) => handleChange('lang_hindi_marks', e.target.value)}
                      placeholder="8.50 / 10.00"
                    />
                  )}
                </td>
                <td className="status-cell">
                  {isPreviewMode ? (
                    <span className={`status-pill ${formData.lang_hindi_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}>
                      {formData.lang_hindi_status || 'Cleared'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus('lang_hindi_status')}
                      className={`status-pill clickable-pill ${formData.lang_hindi_status === 'Revision' ? 'status-revision' : 'status-cleared'}`}
                    >
                      {formData.lang_hindi_status || 'Cleared'}
                    </button>
                  )}
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
                <th style={{ width: '14%' }}>AWARDED</th>
                <th style={{ width: '36%' }}>OBSERVATION &amp; FEEDBACK</th>
              </tr>
            </thead>
            <tbody>
              {/* Manners */}
              <tr>
                <td>
                  <div className="table-primary-text">Respectful Manners, Listening &amp; Etiquette</div>
                  <div className="table-secondary-text">Greeting tutor, polite speech, attentiveness</div>
                </td>
                <td className="table-text-cell">10.00</td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-score-cell highlight-green">{formData.manners_score?.toFixed(2)}</span>
                  ) : (
                    <input
                      type="number"
                      step="0.1"
                      max="10"
                      min="0"
                      className="live-table-score-input highlight-green"
                      value={formData.manners_score ?? 9.5}
                      onChange={(e) => handleChange('manners_score', parseFloat(e.target.value) || 0)}
                    />
                  )}
                </td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-obs-cell">{formData.manners_obs}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-input"
                      value={formData.manners_obs || ''}
                      onChange={(e) => handleChange('manners_obs', e.target.value)}
                      placeholder="e.g. Polite, attentive; follows schedules obediently."
                    />
                  )}
                </td>
              </tr>

              {/* Confidence */}
              <tr>
                <td>
                  <div className="table-primary-text">Confidence &amp; Articulation / Way of Speaking</div>
                  <div className="table-secondary-text">Eye contact, voice clarity, prompt doubt-asking</div>
                </td>
                <td className="table-text-cell">10.00</td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-score-cell highlight-green">{formData.confidence_score?.toFixed(2)}</span>
                  ) : (
                    <input
                      type="number"
                      step="0.1"
                      max="10"
                      min="0"
                      className="live-table-score-input highlight-green"
                      value={formData.confidence_score ?? 8.5}
                      onChange={(e) => handleChange('confidence_score', parseFloat(e.target.value) || 0)}
                    />
                  )}
                </td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-obs-cell">{formData.confidence_obs}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-input"
                      value={formData.confidence_obs || ''}
                      onChange={(e) => handleChange('confidence_obs', e.target.value)}
                      placeholder="e.g. Answers without shyness; asks doubts with clarity."
                    />
                  )}
                </td>
              </tr>

              {/* English Usage */}
              <tr>
                <td>
                  <div className="table-primary-text">Spoken English Usage in Daily Conversation</div>
                  <div className="table-secondary-text">Percentage of English vocabulary used during tuition</div>
                </td>
                <td className="table-text-cell">10.00</td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-score-cell highlight-purple">{formData.english_usage_score?.toFixed(2)}</span>
                  ) : (
                    <input
                      type="number"
                      step="0.1"
                      max="10"
                      min="0"
                      className="live-table-score-input highlight-purple"
                      value={formData.english_usage_score ?? 8.0}
                      onChange={(e) => handleChange('english_usage_score', parseFloat(e.target.value) || 0)}
                    />
                  )}
                </td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-obs-cell">{formData.english_usage_obs}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-input"
                      value={formData.english_usage_obs || ''}
                      onChange={(e) => handleChange('english_usage_obs', e.target.value)}
                      placeholder="e.g. ~65% English words used actively during tuition."
                    />
                  )}
                </td>
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
            {/* Mental Math */}
            <div className="pillar-card">
              <div className="pillar-card-header">
                <span className="pillar-title">Mental Math &amp; Speed Agility</span>
                {isPreviewMode ? (
                  <span className="pillar-score">{formData.mental_math_score}</span>
                ) : (
                  <input
                    type="text"
                    className="live-pillar-score-input"
                    value={formData.mental_math_score || ''}
                    onChange={(e) => handleChange('mental_math_score', e.target.value)}
                    placeholder="9.0 / 10.00"
                  />
                )}
              </div>
              <div className="pillar-body">
                {isPreviewMode ? (
                  formData.mental_math_obs
                ) : (
                  <textarea
                    rows={2}
                    className="live-textarea"
                    value={formData.mental_math_obs || ''}
                    onChange={(e) => handleChange('mental_math_obs', e.target.value)}
                    placeholder="e.g. Fast oral tables up to 19; prompt mental addition."
                  />
                )}
              </div>
            </div>

            {/* Logical Aptitude */}
            <div className="pillar-card">
              <div className="pillar-card-header">
                <span className="pillar-title">Logical Aptitude &amp; Brain Puzzles</span>
                {isPreviewMode ? (
                  <span className="pillar-score">{formData.logical_aptitude_score}</span>
                ) : (
                  <input
                    type="text"
                    className="live-pillar-score-input"
                    value={formData.logical_aptitude_score || ''}
                    onChange={(e) => handleChange('logical_aptitude_score', e.target.value)}
                    placeholder="8.5 / 10.00"
                  />
                )}
              </div>
              <div className="pillar-body">
                {isPreviewMode ? (
                  formData.logical_aptitude_obs
                ) : (
                  <textarea
                    rows={2}
                    className="live-textarea"
                    value={formData.logical_aptitude_obs || ''}
                    onChange={(e) => handleChange('logical_aptitude_obs', e.target.value)}
                    placeholder="e.g. Solved 4/5 pattern-finding puzzles."
                  />
                )}
              </div>
            </div>

            {/* Homework Discipline */}
            <div className="pillar-card">
              <div className="pillar-card-header">
                <span className="pillar-title">Homework Discipline &amp; Self-Study</span>
                {isPreviewMode ? (
                  <span className="pillar-score">{formData.homework_score}</span>
                ) : (
                  <input
                    type="text"
                    className="live-pillar-score-input"
                    value={formData.homework_score || ''}
                    onChange={(e) => handleChange('homework_score', e.target.value)}
                    placeholder="9.5 / 10.00"
                  />
                )}
              </div>
              <div className="pillar-body">
                {isPreviewMode ? (
                  formData.homework_obs
                ) : (
                  <textarea
                    rows={2}
                    className="live-textarea"
                    value={formData.homework_obs || ''}
                    onChange={(e) => handleChange('homework_obs', e.target.value)}
                    placeholder="e.g. 96% daily homework completion rate on time."
                  />
                )}
              </div>
            </div>

            {/* Neatness & Handwriting */}
            <div className="pillar-card">
              <div className="pillar-card-header">
                <span className="pillar-title">Neatness, Handwriting &amp; Copy Layout</span>
                {isPreviewMode ? (
                  <span className="pillar-score">{formData.neatness_score}</span>
                ) : (
                  <input
                    type="text"
                    className="live-pillar-score-input"
                    value={formData.neatness_score || ''}
                    onChange={(e) => handleChange('neatness_score', e.target.value)}
                    placeholder="8.0 / 10.00"
                  />
                )}
              </div>
              <div className="pillar-body">
                {isPreviewMode ? (
                  formData.neatness_obs
                ) : (
                  <textarea
                    rows={2}
                    className="live-textarea"
                    value={formData.neatness_obs || ''}
                    onChange={(e) => handleChange('neatness_obs', e.target.value)}
                    placeholder="e.g. Clean margin maintenance; neat step-by-step working."
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* OVERALL PERFORMANCE SUMMARY BAR */}
        <div className="report-summary-bar">
          <div className="summary-left">
            <span className="summary-label">Overall Performance:</span>
            <span className="summary-highlight">{formData.overall_percentage?.toFixed(1)}% ({formData.grade})</span>
            <span className="summary-divider">•</span>
            <span className="summary-target">
              Target:{' '}
              {isPreviewMode ? (
                formData.next_month_target
              ) : (
                <input
                  type="text"
                  className="live-summary-input"
                  value={formData.next_month_target || ''}
                  onChange={(e) => handleChange('next_month_target', e.target.value)}
                  placeholder="e.g. Chapters 3 & 4 of all subjects"
                />
              )}
            </span>
          </div>
          <div className="summary-right">
            <span>
              Focus:{' '}
              {isPreviewMode ? (
                formData.focus_recommendation
              ) : (
                <input
                  type="text"
                  className="live-summary-input"
                  value={formData.focus_recommendation || ''}
                  onChange={(e) => handleChange('focus_recommendation', e.target.value)}
                  placeholder="e.g. Daily 15m English book reading"
                />
              )}
            </span>
          </div>
        </div>

        {/* 3 OFFICIAL SIGNATORIES */}
        <div className="report-signatures">
          <div className="sig-block">
            <div className="sig-line"></div>
            <div className="sig-title">ASSIGNED HOME TUTOR</div>
            <div className="sig-subtitle">{formData.assigned_tutor_name || 'Horizon Certified Faculty'}</div>
          </div>
          <div className="sig-block">
            <div className="sig-line"></div>
            <div className="sig-title">PARENT / GUARDIAN</div>
            <div className="sig-subtitle">Verified &amp; Acknowledged</div>
          </div>
          <div className="sig-block">
            <div className="sig-line"></div>
            <div className="sig-title">HORIZON ACADEMIC COORDINATOR</div>
            <div className="sig-subtitle">Official Quality Audit ({formData.test_center_name ? formData.test_center_name.split('•')[0] : 'Central Center'})</div>
          </div>
        </div>

        {/* DOCUMENT FOOTER */}
        <div className="report-footer">
          <span>HORIZON HOME TUITION • Monthly Comprehensive Student Evaluation</span>
          <span>Empowering Smart Learning at Home</span>
          <span>Page 1 of 1</span>
        </div>

      </div>

      {/* Embedded High-Fidelity Print & Editor Styles */}
      <style jsx>{`
        .report-editor-container {
          width: 100%;
          min-height: 100vh;
          background: #0B0F19;
          padding: 1.5rem 1rem 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .editor-toolbar {
          width: 100%;
          max-width: 920px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          background: #111827;
          border: 1px solid #1F2937;
          border-radius: 12px;
          padding: 8px 14px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .toolbar-left, .toolbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .duty-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 20px;
          color: #F59E0B;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.03em;
        }

        .tool-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          text-decoration: none;
        }

        .tool-btn-primary {
          background: linear-gradient(135deg, #F59E0B, #D97706);
          color: #000;
          box-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);
        }
        .tool-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.45);
        }

        .tool-btn-secondary {
          background: #1F2937;
          color: #E2E8F0;
          border: 1px solid #374151;
        }
        .tool-btn-secondary:hover {
          background: #374151;
        }

        .tool-btn-active {
          background: #0284C7;
          color: #FFF;
          border: 1px solid #38BDF8;
        }

        .notification-banner {
          width: 100%;
          max-width: 920px;
          padding: 10px 16px;
          border-radius: 8px;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 700;
          border: 1px solid;
          animation: fadeIn 0.3s ease;
        }

        .examiner-hint-bar {
          width: 100%;
          max-width: 920px;
          margin-bottom: 0.85rem;
        }

        .hint-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #1E293B;
          border: 1px solid #334155;
          padding: 8px 14px;
          border-radius: 8px;
          color: #CBD5E1;
          font-size: 0.78rem;
        }

        /* EXACT A4 REPORT CARD SHEET - SLEEK LUXURY DARK THEME */
        .report-card-paper {
          width: 100%;
          max-width: 940px;
          background: #111827;
          color: #F8FAFC;
          padding: 26px 32px 22px;
          border-radius: 12px;
          border: 1px solid #334155;
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.65), 0 0 35px rgba(245, 158, 11, 0.06);
          box-sizing: border-box;
          line-height: 1.25;
        }

        /* Live Inputs Styling in Dark Theme */
        .live-input {
          width: 100%;
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 6px;
          padding: 5px 8px;
          font-size: 0.84rem;
          color: #FFFFFF;
          font-weight: 600;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s;
        }
        .live-input::placeholder {
          color: #64748B !important;
          opacity: 0.8 !important;
          font-weight: 400 !important;
        }
        .live-input:focus {
          border-color: #F59E0B;
          background: #0B0F19;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
        }

        .live-input-bold {
          font-weight: 800;
        }

        .live-table-input {
          width: 100%;
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 4px;
          padding: 4px 7px;
          font-size: 0.76rem;
          color: #F8FAFC;
          font-weight: 600;
          outline: none;
          box-sizing: border-box;
          transition: all 0.15s;
        }
        .live-table-input::placeholder {
          color: #64748B !important;
          opacity: 0.8 !important;
          font-weight: 400 !important;
        }
        .live-table-input:hover {
          border-color: #475569;
          background: #141B2D;
        }
        .live-table-input:focus {
          border-color: #38BDF8;
          background: #0B0F19;
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
        }

        .live-table-score-input {
          width: 100%;
          max-width: 95px;
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 4px;
          padding: 4px 6px;
          font-size: 0.78rem;
          color: #38BDF8;
          font-weight: 800;
          text-align: right;
          font-family: 'Inter', monospace;
          outline: none;
          box-sizing: border-box;
          transition: all 0.15s;
        }
        .live-table-score-input::placeholder {
          color: #64748B !important;
          opacity: 0.8 !important;
          font-weight: 400 !important;
        }
        .live-table-score-input:hover {
          border-color: #475569;
        }
        .live-table-score-input:focus {
          border-color: #38BDF8;
          background: #0B0F19;
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
        }

        .live-pillar-score-input {
          width: 90px;
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 4px;
          padding: 3px 6px;
          font-size: 0.76rem;
          color: #F59E0B;
          font-weight: 800;
          text-align: right;
          font-family: 'Inter', monospace;
          outline: none;
        }
        .live-pillar-score-input::placeholder {
          color: #64748B !important;
          opacity: 0.8 !important;
          font-weight: 400 !important;
        }

        .live-textarea {
          width: 100%;
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 4px;
          padding: 5px 8px;
          font-size: 0.72rem;
          color: #F1F5F9;
          outline: none;
          resize: vertical;
          box-sizing: border-box;
        }
        .live-textarea::placeholder {
          color: #64748B !important;
          opacity: 0.8 !important;
          font-weight: 400 !important;
        }
        .live-textarea:focus {
          border-color: #38BDF8;
          background: #0B0F19;
        }

        .live-summary-input {
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 0.76rem;
          font-weight: 700;
          color: #FDE68A;
          outline: none;
          width: 190px;
        }
        .live-summary-input::placeholder {
          color: #64748B !important;
          opacity: 0.8 !important;
          font-weight: 400 !important;
        }

        /* Meta Grid */
        .report-meta-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr 1.3fr;
          border: 1px solid #334155;
          border-radius: 8px;
          margin: 14px 0 12px;
          background: #0F172A;
        }

        .report-meta-box {
          padding: 8px 10px;
          border-right: 1px solid #334155;
        }
        .report-meta-box:last-child {
          border-right: none;
        }

        .report-meta-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: #94A3B8;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }

        .report-meta-value {
          font-size: 0.88rem;
          font-weight: 800;
          color: #FFFFFF;
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
          justify-content: space-between;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: #FFFFFF;
          padding: 6px 10px;
          border-radius: 6px 6px 0 0;
          border: 1px solid #334155;
          border-bottom: none;
        }

        .section-title {
          font-size: 0.74rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          color: #F59E0B;
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
          border: 1px solid #334155;
          font-size: 0.76rem;
        }

        .report-table th {
          background: #0F172A;
          color: #94A3B8;
          font-weight: 800;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 6px 8px;
          border: 1px solid #334155;
          text-align: left;
        }

        .report-table td {
          padding: 5px 8px;
          border: 1px solid #334155;
          vertical-align: middle;
          background: #111827;
        }

        .table-primary-text {
          font-weight: 800;
          color: #38BDF8;
          font-size: 0.78rem;
        }

        .table-secondary-text {
          font-size: 0.65rem;
          color: #94A3B8;
        }

        .table-text-cell {
          font-size: 0.76rem;
          color: #E2E8F0;
        }

        .table-score-cell {
          font-size: 0.78rem;
          font-weight: 800;
          color: #38BDF8;
          font-family: 'Inter', monospace;
        }

        .subject-cell {
          font-weight: 800;
          color: #FFFFFF;
          background: #0F172A;
          border-right: 1px solid #334155;
          font-size: 0.78rem;
        }

        .chapter-cell {
          color: #F1F5F9;
          font-weight: 600;
          font-size: 0.74rem;
        }

        .status-cell {
          text-align: center;
        }

        .status-pill {
          display: inline-block;
          padding: 3px 9px;
          border-radius: 6px;
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          border: 1px solid transparent;
        }

        .clickable-pill {
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .clickable-pill:hover {
          transform: scale(1.05);
        }

        .status-cleared {
          background: rgba(16, 185, 129, 0.2);
          color: #34D399;
          border-color: rgba(52, 211, 153, 0.4);
        }
        .status-revision {
          background: rgba(245, 158, 11, 0.2);
          color: #FBBF24;
          border-color: rgba(251, 191, 36, 0.4);
        }

        .highlight-green {
          color: #34D399;
          font-weight: 800;
        }
        .highlight-purple {
          color: #C084FC;
          font-weight: 800;
        }
        .font-bold {
          font-weight: 800;
        }

        .table-obs-cell {
          font-size: 0.72rem;
          color: #CBD5E1;
          line-height: 1.25;
        }

        /* Pillars Grid */
        .pillars-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          border: 1px solid #334155;
          border-top: none;
          padding: 6px;
          background: #0F172A;
        }

        .pillar-card {
          border: 1px solid #334155;
          border-radius: 6px;
          padding: 6px 8px;
          background: #1E293B;
        }

        .pillar-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3px;
        }

        .pillar-title {
          font-size: 0.74rem;
          font-weight: 800;
          color: #38BDF8;
        }

        .pillar-score {
          font-size: 0.74rem;
          font-weight: 800;
          color: #F59E0B;
          font-family: 'Inter', monospace;
        }

        .pillar-body {
          font-size: 0.68rem;
          color: #CBD5E1;
          line-height: 1.25;
        }

        /* Summary Bar */
        .report-summary-bar {
          margin: 10px 0;
          padding: 7px 12px;
          background: #0F172A;
          border-left: 4px solid #F59E0B;
          border: 1px solid #334155;
          border-left-width: 4px;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.76rem;
        }

        .summary-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .summary-label {
          font-weight: 800;
          color: #FFFFFF;
        }

        .summary-highlight {
          font-weight: 800;
          color: #38BDF8;
        }

        .summary-divider {
          color: #64748B;
          font-weight: bold;
        }

        .summary-target {
          color: #FDE68A;
          font-weight: 700;
        }

        .summary-right {
          font-weight: 700;
          color: #94A3B8;
        }

        /* Signatures */
        .report-signatures {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin-top: 16px;
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
          font-size: 0.70rem;
          font-weight: 900;
          color: #FFFFFF;
          letter-spacing: 0.03em;
        }

        .sig-subtitle {
          font-size: 0.63rem;
          color: #94A3B8;
          font-weight: 600;
        }

        /* Footer */
        .report-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 6px;
          border-top: 1px solid #334155;
          font-size: 0.64rem;
          color: #94A3B8;
          font-weight: 600;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* =================== A4 PRINT STYLES =================== */
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm 6mm 4mm 6mm;
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

          .report-editor-container {
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

          /* Force inputs to look like normal text in print */
          input, textarea {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            box-shadow: none !important;
          }

          .clickable-pill {
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
