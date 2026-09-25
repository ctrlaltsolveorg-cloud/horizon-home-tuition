'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Layers,
  Check
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

// Available options for Class and Board selectors
const CLASS_OPTIONS = [
  'Class 1st', 'Class 2nd', 'Class 3rd', 'Class 4th',
  'Class 5th', 'Class 6th', 'Class 7th', 'Class 8th',
  'Class 9th', 'Class 10th', 'Class 11th', 'Class 12th'
];

const BOARD_OPTIONS = [
  'CBSE', 'ICSE', 'State Board', 'Bihar Board', 'Cambridge'
];

const MONTH_OPTIONS = [
  'August, 2026',
  'September, 2026',
  'October, 2026',
  'November, 2026',
  'December, 2026',
  'January, 2027',
  'February, 2027',
  'March, 2027'
];

// Helper: Determine Chapter Status based on marks (Out of 10)
export const computeChapterStatus = (score: number): 'CLEARED' | 'REVISION' | 'INCOMPLETE' => {
  if (score >= 8.5) return 'CLEARED';
  if (score >= 5.0) return 'REVISION';
  return 'INCOMPLETE';
};

// Helper: Determine WPM Speed Rating Category
export const computeWpmCategory = (wpm: number): string => {
  if (!wpm || wpm <= 0) return '';
  if (wpm >= 120) return '(Fluent)';
  if (wpm >= 100) return '(Optimal)';
  if (wpm >= 80) return '(Good)';
  return '(Needs Practice)';
};

// Helper: Parse numerical score from string like "7.50 / 10.00" or number
export const parseNumericScore = (val?: string | number): number => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return val;
  const match = String(val).match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

// Helper: Format score as 2-decimal float with leading zero if single digit (e.g. "05.30", "10.00", "08.50")
export const formatScoreFloat = (val?: number | string): string => {
  if (val === undefined || val === null || val === '') return '00.00';
  const num = typeof val === 'number' ? val : parseNumericScore(val);
  const clamped = Math.max(0, num);
  const fixed = clamped.toFixed(2);
  return clamped < 10 ? `0${fixed}` : fixed;
};

// Helper: Parse WPM number from string like "110 WPM (Optimal)"
export const parseWpmNumber = (val?: string): number => {
  if (!val) return 0;
  const match = val.match(/([0-9]+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// Helper: Parse passage words count from string e.g. "300 Words • 1m 25s" (Always 300 words)
export const parsePassageWords = (_val?: string): number => {
  return 300;
};

// Helper: Parse passage reading time from string e.g. "300 Words • 1m 25s"
export const parsePassageTime = (val?: string): string => {
  if (!val) return '1m 25s';
  const parts = val.split('•');
  if (parts.length > 1) {
    return parts[1].trim();
  }
  return val.replace(/^[0-9]+\s*Words\s*/i, '').trim() || '1m 25s';
};

// Helper: Parse comprehension correct questions score from string e.g. "04.00 / 05.00 Correct (01.00 Error)"
export const parseCompCorrect = (val?: string | number): number => {
  if (val === undefined || val === null || val === '') return 4.0;
  if (typeof val === 'number') return val;
  const match = String(val).match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? parseFloat(match[1]) : 4.0;
};

// Helper: Format comprehension string e.g. 4 -> "04.00 / 05.00 Correct (01.00 Error)"
export const formatCompString = (correct: number): string => {
  const num = Math.max(0, Math.min(5, correct));
  const errCount = Math.max(0, 5 - num);
  const errText = Math.abs(errCount - 1) < 0.01 ? 'Error' : 'Errors';
  return `${formatScoreFloat(num)} / 05.00 Correct (${formatScoreFloat(errCount)} ${errText})`;
};

const DEFAULT_SAMPLE_DATA: MonthlyReportCard = {
  id: '',
  student_id: '',
  student_name: 'Aarav Sharma',
  parent_name: 'Suresh Sharma',
  class_grade: 'Class 7th • CBSE',
  assessment_month: 'September, 2026',
  
  assigned_tutor_name: 'Harshit Patel (PCE Purnia)',
  assigned_tutor_contact: '+91 9162162128',
  evaluator_tutor_name: 'Vikash Kumar (Certified Cross-Examiner)',
  test_center_name: 'Horizon Central Assessment Center (Center #1)',

  hindi_passage_length_time: '300 Words • 1m 25s',
  hindi_speed_wpm: '113 WPM (Good)',
  hindi_comprehension_qs: '04.00 / 05.00 Correct (01.00 Error)',
  hindi_fluency: '08.50 / 10.00',

  english_passage_length_time: '300 Words • 1m 35s',
  english_speed_wpm: '110 WPM (Optimal)',
  english_comprehension_qs: '05.00 / 05.00 Correct (00.00 Errors)',
  english_fluency: '09.00 / 10.00',

  math_ch1_name: 'Ch 1: Integers, Number Line & Rules',
  math_ch1_marks: '07.50 / 10.00',
  math_ch1_status: 'Revision',
  math_ch2_name: 'Ch 2: Fractions, Decimals & Problem Sums',
  math_ch2_marks: '08.50 / 10.00',
  math_ch2_status: 'Cleared',

  science_ch1_name: 'Ch 1: Nutrition in Plants (Modes & Photosynthesis)',
  science_ch1_marks: '09.00 / 10.00',
  science_ch1_status: 'Cleared',
  science_ch2_name: 'Ch 2: Nutrition in Animals (Digestive Organs)',
  science_ch2_marks: '07.50 / 10.00',
  science_ch2_status: 'Revision',

  sst_ch1_name: 'Ch 1: Tracing Changes Through a Thousand Years',
  sst_ch1_marks: '08.50 / 10.00',
  sst_ch1_status: 'Cleared',
  sst_ch2_name: 'Ch 2: Our Environment & Earth Interior Layers',
  sst_ch2_marks: '08.00 / 10.00',
  sst_ch2_status: 'Cleared',

  lang_eng_name: 'English (Ch 1-2): Three Questions & The Squirrel',
  lang_eng_marks: '09.00 / 10.00',
  lang_eng_status: 'Cleared',
  lang_hindi_name: 'Hindi (Ch 1-2): हम पंछी उन्मुक्त गगन के & दादी माँ',
  lang_hindi_marks: '08.50 / 10.00',
  lang_hindi_status: 'Cleared',

  manners_max: 10,
  manners_score: 9.50,
  manners_obs: '',
  confidence_max: 10,
  confidence_score: 8.50,
  confidence_obs: '',
  english_usage_max: 10,
  english_usage_score: 8.00,
  english_usage_obs: '',

  mental_math_score: '09.00 / 10.00',
  mental_math_obs: '',
  logical_aptitude_score: '08.50 / 10.00',
  logical_aptitude_obs: '',
  homework_score: '09.50 / 10.00',
  homework_obs: '',
  neatness_score: '08.00 / 10.00',
  neatness_obs: '',

  overall_percentage: 86.5,
  grade: 'Grade A+ Outstanding',
  next_month_target: 'Next two chapters in all subjects',
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

  // Parse initial class and board
  const parsedClassGrade = (initialReport?.class_grade || DEFAULT_SAMPLE_DATA.class_grade).split('•');
  const initialClass = parsedClassGrade[0]?.trim() || 'Class 7th';
  const initialBoard = parsedClassGrade[1]?.trim() || 'CBSE';

  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [selectedBoard, setSelectedBoard] = useState(initialBoard);

  const [formData, setFormData] = useState<MonthlyReportCard>(() => {
    const base = {
      ...DEFAULT_SAMPLE_DATA,
      ...(initialReport || {}),
      id: initialReport?.id || `rep-${Date.now()}`
    };

    // Auto-calculate initial statuses based on marks
    return {
      ...base,
      class_grade: `${initialClass} • ${initialBoard}`,
      math_ch1_status: computeChapterStatus(parseNumericScore(base.math_ch1_marks)),
      math_ch2_status: computeChapterStatus(parseNumericScore(base.math_ch2_marks)),
      science_ch1_status: computeChapterStatus(parseNumericScore(base.science_ch1_marks)),
      science_ch2_status: computeChapterStatus(parseNumericScore(base.science_ch2_marks)),
      sst_ch1_status: computeChapterStatus(parseNumericScore(base.sst_ch1_marks)),
      sst_ch2_status: computeChapterStatus(parseNumericScore(base.sst_ch2_marks)),
      lang_eng_status: computeChapterStatus(parseNumericScore(base.lang_eng_marks)),
      lang_hindi_status: computeChapterStatus(parseNumericScore(base.lang_hindi_marks)),
      next_month_target: base.next_month_target && base.next_month_target !== 'Chapters 3 & 4 of all subjects' 
        ? base.next_month_target 
        : 'Next two chapters in all subjects'
    };
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync Class and Board changes into formData
  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
    setFormData(prev => ({
      ...prev,
      class_grade: `${newClass} • ${selectedBoard}`
    }));
  };

  const handleBoardChange = (newBoard: string) => {
    setSelectedBoard(newBoard);
    setFormData(prev => ({
      ...prev,
      class_grade: `${selectedClass} • ${newBoard}`
    }));
  };

  // Live Auto-Calculate Overall % and Grade
  useEffect(() => {
    const scores = [
      parseNumericScore(formData.hindi_fluency),
      parseNumericScore(formData.english_fluency),
      parseNumericScore(formData.math_ch1_marks),
      parseNumericScore(formData.math_ch2_marks),
      parseNumericScore(formData.science_ch1_marks),
      parseNumericScore(formData.science_ch2_marks),
      parseNumericScore(formData.sst_ch1_marks),
      parseNumericScore(formData.sst_ch2_marks),
      parseNumericScore(formData.lang_eng_marks),
      parseNumericScore(formData.lang_hindi_marks),
      formData.manners_score || 0,
      formData.confidence_score || 0,
      formData.english_usage_score || 0,
      parseNumericScore(formData.mental_math_score),
      parseNumericScore(formData.logical_aptitude_score),
      parseNumericScore(formData.homework_score),
      parseNumericScore(formData.neatness_score)
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

  // Dedicated Handler for Chapter Marks that automatically locks `/ 10.00` and calculates Status
  const handleChapterMarkChange = (
    marksField: keyof MonthlyReportCard,
    statusField: keyof MonthlyReportCard,
    rawNum: string
  ) => {
    const num = Math.max(0, Math.min(10, parseFloat(rawNum) || 0));
    const formattedMarks = `${formatScoreFloat(num)} / 10.00`;
    const computedStatus = computeChapterStatus(num);

    setFormData((prev) => ({
      ...prev,
      [marksField]: rawNum === '' ? '' : formattedMarks,
      [statusField]: computedStatus
    }));
  };

  // Dedicated Handler for Section 4 Pillars / Section 1 Fluency Score
  const handleScoreOnlyChange = (field: keyof MonthlyReportCard, rawNum: string) => {
    const num = Math.max(0, Math.min(10, parseFloat(rawNum) || 0));
    const formattedMarks = `${formatScoreFloat(num)} / 10.00`;
    setFormData((prev) => ({
      ...prev,
      [field]: rawNum === '' ? '' : formattedMarks
    }));
  };

  // Handler for WPM Speed inputs
  const handleWpmChange = (field: 'hindi_speed_wpm' | 'english_speed_wpm', rawWpm: string) => {
    const wpm = parseInt(rawWpm, 10) || 0;
    const cat = computeWpmCategory(wpm);
    const formatted = wpm > 0 ? `${wpm} WPM ${cat}` : '';
    setFormData((prev) => ({
      ...prev,
      [field]: formatted
    }));
  };

  // Dedicated Handler for Passage Time (Locked 300 Words)
  const handlePassageTimeChange = (
    field: 'hindi_passage_length_time' | 'english_passage_length_time',
    timeVal: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: `300 Words • ${timeVal || '1m 25s'}`
    }));
  };

  // Dedicated Handler for Comprehension Score
  const handleCompScoreChange = (
    field: 'hindi_comprehension_qs' | 'english_comprehension_qs',
    rawNum: string
  ) => {
    const num = Math.max(0, Math.min(5, parseFloat(rawNum) || 0));
    setFormData((prev) => ({
      ...prev,
      [field]: formatCompString(num)
    }));
  };

  // Handler for English Usage Score that auto-updates observation percentage
  const handleEnglishUsageChange = (rawNum: string) => {
    const score = Math.max(0, Math.min(10, parseFloat(rawNum) || 0));
    const percent = Math.round(score * 10);
    const autoObs = `~${percent}% English words used actively during tuition hours.`;
    
    setFormData((prev) => ({
      ...prev,
      english_usage_score: score,
      english_usage_obs: prev.english_usage_obs?.startsWith('~') || !prev.english_usage_obs 
        ? autoObs 
        : prev.english_usage_obs
    }));
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all fields to standard baseline template?')) {
      setFormData({
        ...DEFAULT_SAMPLE_DATA,
        id: `rep-${Date.now()}`
      });
      setSelectedClass('Class 7th');
      setSelectedBoard('CBSE');
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
            <span>Official Report Card (Live Evaluation)</span>
          </div>
        </div>

        <div className="toolbar-right">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="tool-btn tool-btn-secondary"
            title="Reset to Template Baseline"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`tool-btn ${isPreviewMode ? 'tool-btn-active' : 'tool-btn-secondary'}`}
          >
            {isPreviewMode ? <Edit3 size={16} /> : <Eye size={16} />}
            <span>{isPreviewMode ? 'Edit Mode' : 'Clean Preview'}</span>
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
          reportSubtitle="Single-Page Comprehensive Academic & Skill Audit"
          dark={true}
        />

        {/* STUDENT & ASSESSMENT META GRID */}
        <div className="report-meta-grid">
          {/* STUDENT NAME - Auto mapped / filled */}
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
                placeholder="Student Name (Mapped from profile)"
              />
            )}
          </div>

          {/* CLASS / GRADE - Split Class & Board Dropdown Selectors */}
          <div className="report-meta-box">
            <label className="report-meta-label">CLASS &amp; BOARD</label>
            {isPreviewMode ? (
              <div className="report-meta-value">{formData.class_grade}</div>
            ) : (
              <div style={{ display: 'flex', gap: '4px' }}>
                <select
                  className="live-select live-input-bold"
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  style={{ width: '55%' }}
                >
                  {CLASS_OPTIONS.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                <select
                  className="live-select live-input-bold"
                  value={selectedBoard}
                  onChange={(e) => handleBoardChange(e.target.value)}
                  style={{ width: '45%' }}
                >
                  {BOARD_OPTIONS.map((brd) => (
                    <option key={brd} value={brd}>{brd}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* ASSESSMENT MONTH - Auto-detect / Dropdown Selector */}
          <div className="report-meta-box">
            <label className="report-meta-label">ASSESSMENT MONTH</label>
            {isPreviewMode ? (
              <div className="report-meta-value">{formData.assessment_month}</div>
            ) : (
              <select
                className="live-select live-input-bold"
                value={formData.assessment_month || 'September, 2026'}
                onChange={(e) => handleChange('assessment_month', e.target.value)}
              >
                {MONTH_OPTIONS.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            )}
          </div>

          {/* ASSIGNED TUTOR & CONTACT */}
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
                  style={{ width: '58%' }}
                />
                <input
                  type="text"
                  className="live-input"
                  value={formData.assigned_tutor_contact || ''}
                  onChange={(e) => handleChange('assigned_tutor_contact', e.target.value)}
                  placeholder="Contact"
                  style={{ width: '42%' }}
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
                <th style={{ width: '20%' }}>SPEED (WPM)</th>
                <th style={{ width: '18%' }}>5 COMPREHENSION QS</th>
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
                    <div className="locked-passage-wrap">
                      <span className="locked-sep">300 Words •</span>
                      <input
                        type="text"
                        className="live-time-input"
                        value={parsePassageTime(formData.hindi_passage_length_time)}
                        onChange={(e) => handlePassageTimeChange('hindi_passage_length_time', e.target.value)}
                        placeholder="1m 25s"
                      />
                    </div>
                  )}
                </td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-text-cell font-bold">{formData.hindi_speed_wpm}</span>
                  ) : (
                    <div className="locked-wpm-wrap">
                      <input
                        type="number"
                        min="0"
                        max="300"
                        className="live-wpm-num-input"
                        value={parseWpmNumber(formData.hindi_speed_wpm) || ''}
                        onChange={(e) => handleWpmChange('hindi_speed_wpm', e.target.value)}
                        placeholder="113"
                      />
                      <span className="locked-wpm-category">
                        WPM {computeWpmCategory(parseWpmNumber(formData.hindi_speed_wpm))}
                      </span>
                    </div>
                  )}
                </td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-text-cell highlight-green">{formData.hindi_comprehension_qs}</span>
                  ) : (
                    <div className="locked-comp-wrap">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        className="live-comp-num-input"
                        value={parseCompCorrect(formData.hindi_comprehension_qs)}
                        onChange={(e) => handleCompScoreChange('hindi_comprehension_qs', e.target.value)}
                        placeholder="04.00"
                      />
                      <span className="locked-comp-denom">/ 05.00 Correct</span>
                      <span className="locked-comp-error">
                        ({formatScoreFloat(Math.max(0, 5 - parseCompCorrect(formData.hindi_comprehension_qs)))} {Math.abs(Math.max(0, 5 - parseCompCorrect(formData.hindi_comprehension_qs)) - 1) < 0.01 ? 'Error' : 'Errors'})
                      </span>
                    </div>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {isPreviewMode ? (
                    <span className="table-score-cell">{formData.hindi_fluency}</span>
                  ) : (
                    <div className="locked-score-cell">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="live-score-num-input"
                        value={parseNumericScore(formData.hindi_fluency) || ''}
                        onChange={(e) => handleScoreOnlyChange('hindi_fluency', e.target.value)}
                        placeholder="08.50"
                      />
                      <span className="locked-denom">/ 10.00</span>
                    </div>
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
                    <div className="locked-passage-wrap">
                      <span className="locked-sep">300 Words •</span>
                      <input
                        type="text"
                        className="live-time-input"
                        value={parsePassageTime(formData.english_passage_length_time)}
                        onChange={(e) => handlePassageTimeChange('english_passage_length_time', e.target.value)}
                        placeholder="1m 35s"
                      />
                    </div>
                  )}
                </td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-text-cell font-bold">{formData.english_speed_wpm}</span>
                  ) : (
                    <div className="locked-wpm-wrap">
                      <input
                        type="number"
                        min="0"
                        max="300"
                        className="live-wpm-num-input"
                        value={parseWpmNumber(formData.english_speed_wpm) || ''}
                        onChange={(e) => handleWpmChange('english_speed_wpm', e.target.value)}
                        placeholder="110"
                      />
                      <span className="locked-wpm-category">
                        WPM {computeWpmCategory(parseWpmNumber(formData.english_speed_wpm))}
                      </span>
                    </div>
                  )}
                </td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-text-cell highlight-green">{formData.english_comprehension_qs}</span>
                  ) : (
                    <div className="locked-comp-wrap">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        className="live-comp-num-input"
                        value={parseCompCorrect(formData.english_comprehension_qs)}
                        onChange={(e) => handleCompScoreChange('english_comprehension_qs', e.target.value)}
                        placeholder="05.00"
                      />
                      <span className="locked-comp-denom">/ 05.00 Correct</span>
                      <span className="locked-comp-error">
                        ({formatScoreFloat(Math.max(0, 5 - parseCompCorrect(formData.english_comprehension_qs)))} {Math.abs(Math.max(0, 5 - parseCompCorrect(formData.english_comprehension_qs)) - 1) < 0.01 ? 'Error' : 'Errors'})
                      </span>
                    </div>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {isPreviewMode ? (
                    <span className="table-score-cell">{formData.english_fluency}</span>
                  ) : (
                    <div className="locked-score-cell">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="live-score-num-input"
                        value={parseNumericScore(formData.english_fluency) || ''}
                        onChange={(e) => handleScoreOnlyChange('english_fluency', e.target.value)}
                        placeholder="09.00"
                      />
                      <span className="locked-denom">/ 10.00</span>
                    </div>
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
            <span className="section-subtitle">Monthly Progressive Cycle • Locked /10.00 Suffix • Auto Status (Cleared / Revision / Incomplete)</span>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th style={{ width: '18%' }}>SUBJECT</th>
                <th style={{ width: '52%' }}>ASSIGNED TARGET CHAPTERS TESTED THIS MONTH</th>
                <th style={{ width: '17%', textAlign: 'right' }}>MARKS (/10)</th>
                <th style={{ width: '13%', textAlign: 'center' }}>STATUS (AUTO)</th>
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
                    <div className="locked-score-cell">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="live-score-num-input"
                        value={parseNumericScore(formData.math_ch1_marks) || ''}
                        onChange={(e) => handleChapterMarkChange('math_ch1_marks', 'math_ch1_status', e.target.value)}
                        placeholder="7.5"
                      />
                      <span className="locked-denom">/ 10.00</span>
                    </div>
                  )}
                </td>
                <td className="status-cell">
                  <span className={`status-pill status-${(formData.math_ch1_status || 'cleared').toLowerCase()}`}>
                    {formData.math_ch1_status || 'CLEARED'}
                  </span>
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
                    <div className="locked-score-cell">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="live-score-num-input"
                        value={parseNumericScore(formData.math_ch2_marks) || ''}
                        onChange={(e) => handleChapterMarkChange('math_ch2_marks', 'math_ch2_status', e.target.value)}
                        placeholder="8.5"
                      />
                      <span className="locked-denom">/ 10.00</span>
                    </div>
                  )}
                </td>
                <td className="status-cell">
                  <span className={`status-pill status-${(formData.math_ch2_status || 'cleared').toLowerCase()}`}>
                    {formData.math_ch2_status || 'CLEARED'}
                  </span>
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
                    <div className="locked-score-cell">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="live-score-num-input"
                        value={parseNumericScore(formData.science_ch1_marks) || ''}
                        onChange={(e) => handleChapterMarkChange('science_ch1_marks', 'science_ch1_status', e.target.value)}
                        placeholder="9.0"
                      />
                      <span className="locked-denom">/ 10.00</span>
                    </div>
                  )}
                </td>
                <td className="status-cell">
                  <span className={`status-pill status-${(formData.science_ch1_status || 'cleared').toLowerCase()}`}>
                    {formData.science_ch1_status || 'CLEARED'}
                  </span>
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
                    <div className="locked-score-cell">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="live-score-num-input"
                        value={parseNumericScore(formData.science_ch2_marks) || ''}
                        onChange={(e) => handleChapterMarkChange('science_ch2_marks', 'science_ch2_status', e.target.value)}
                        placeholder="7.5"
                      />
                      <span className="locked-denom">/ 10.00</span>
                    </div>
                  )}
                </td>
                <td className="status-cell">
                  <span className={`status-pill status-${(formData.science_ch2_status || 'revision').toLowerCase()}`}>
                    {formData.science_ch2_status || 'REVISION'}
                  </span>
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
                    <div className="locked-score-cell">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="live-score-num-input"
                        value={parseNumericScore(formData.sst_ch1_marks) || ''}
                        onChange={(e) => handleChapterMarkChange('sst_ch1_marks', 'sst_ch1_status', e.target.value)}
                        placeholder="8.5"
                      />
                      <span className="locked-denom">/ 10.00</span>
                    </div>
                  )}
                </td>
                <td className="status-cell">
                  <span className={`status-pill status-${(formData.sst_ch1_status || 'cleared').toLowerCase()}`}>
                    {formData.sst_ch1_status || 'CLEARED'}
                  </span>
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
                    <div className="locked-score-cell">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="live-score-num-input"
                        value={parseNumericScore(formData.sst_ch2_marks) || ''}
                        onChange={(e) => handleChapterMarkChange('sst_ch2_marks', 'sst_ch2_status', e.target.value)}
                        placeholder="8.0"
                      />
                      <span className="locked-denom">/ 10.00</span>
                    </div>
                  )}
                </td>
                <td className="status-cell">
                  <span className={`status-pill status-${(formData.sst_ch2_status || 'cleared').toLowerCase()}`}>
                    {formData.sst_ch2_status || 'CLEARED'}
                  </span>
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
                    <div className="locked-score-cell">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="live-score-num-input"
                        value={parseNumericScore(formData.lang_eng_marks) || ''}
                        onChange={(e) => handleChapterMarkChange('lang_eng_marks', 'lang_eng_status', e.target.value)}
                        placeholder="9.0"
                      />
                      <span className="locked-denom">/ 10.00</span>
                    </div>
                  )}
                </td>
                <td className="status-cell">
                  <span className={`status-pill status-${(formData.lang_eng_status || 'cleared').toLowerCase()}`}>
                    {formData.lang_eng_status || 'CLEARED'}
                  </span>
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
                    <div className="locked-score-cell">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="live-score-num-input"
                        value={parseNumericScore(formData.lang_hindi_marks) || ''}
                        onChange={(e) => handleChapterMarkChange('lang_hindi_marks', 'lang_hindi_status', e.target.value)}
                        placeholder="8.5"
                      />
                      <span className="locked-denom">/ 10.00</span>
                    </div>
                  )}
                </td>
                <td className="status-cell">
                  <span className={`status-pill status-${(formData.lang_hindi_status || 'cleared').toLowerCase()}`}>
                    {formData.lang_hindi_status || 'CLEARED'}
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
                <th style={{ width: '14%' }}>AWARDED</th>
                <th style={{ width: '36%' }}>OBSERVATION &amp; FEEDBACK (INSTRUCTION GUIDE)</th>
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
                    <span className="table-score-cell highlight-green">{formatScoreFloat(formData.manners_score ?? 9.5)}</span>
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
                    <span className="table-obs-cell">{formData.manners_obs || 'Polite, attentive; follows homework schedules obediently.'}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-input live-instruction-input"
                      value={formData.manners_obs || ''}
                      onChange={(e) => handleChange('manners_obs', e.target.value)}
                      placeholder="Polite, attentive; follows homework schedules obediently."
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
                    <span className="table-score-cell highlight-green">{formatScoreFloat(formData.confidence_score ?? 8.5)}</span>
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
                    <span className="table-obs-cell">{formData.confidence_obs || 'Answers without shyness; asks doubts with clarity.'}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-input live-instruction-input"
                      value={formData.confidence_obs || ''}
                      onChange={(e) => handleChange('confidence_obs', e.target.value)}
                      placeholder="Answers without shyness; asks doubts with clarity."
                    />
                  )}
                </td>
              </tr>

              {/* English Usage - Auto calculates percentage from score */}
              <tr>
                <td>
                  <div className="table-primary-text">Spoken English Usage in Daily Conversation</div>
                  <div className="table-secondary-text">Calculated directly from awarded score (/10.00)</div>
                </td>
                <td className="table-text-cell">10.00</td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-score-cell highlight-purple">{formatScoreFloat(formData.english_usage_score ?? 8.0)}</span>
                  ) : (
                    <input
                      type="number"
                      step="0.1"
                      max="10"
                      min="0"
                      className="live-table-score-input highlight-purple"
                      value={formData.english_usage_score ?? 8.0}
                      onChange={(e) => handleEnglishUsageChange(e.target.value)}
                    />
                  )}
                </td>
                <td>
                  {isPreviewMode ? (
                    <span className="table-obs-cell highlight-purple">{formData.english_usage_obs}</span>
                  ) : (
                    <input
                      type="text"
                      className="live-table-input live-instruction-input"
                      value={formData.english_usage_obs || ''}
                      onChange={(e) => handleChange('english_usage_obs', e.target.value)}
                      placeholder={`~${Math.round((formData.english_usage_score || 8) * 10)}% English words used actively during tuition hours.`}
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
                  <div className="locked-score-cell" style={{ maxWidth: '105px' }}>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className="live-score-num-input"
                      value={parseNumericScore(formData.mental_math_score) || ''}
                      onChange={(e) => handleScoreOnlyChange('mental_math_score', e.target.value)}
                      placeholder="9.0"
                    />
                    <span className="locked-denom">/ 10.00</span>
                  </div>
                )}
              </div>
              <div className="pillar-body">
                {isPreviewMode ? (
                  formData.mental_math_obs || 'Fast oral tables up to 19; prompt mental addition without rough notebook dependence.'
                ) : (
                  <textarea
                    rows={2}
                    className="live-textarea live-instruction-input"
                    value={formData.mental_math_obs || ''}
                    onChange={(e) => handleChange('mental_math_obs', e.target.value)}
                    placeholder="Fast oral tables up to 19; prompt mental addition without rough notebook dependence."
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
                  <div className="locked-score-cell" style={{ maxWidth: '105px' }}>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className="live-score-num-input"
                      value={parseNumericScore(formData.logical_aptitude_score) || ''}
                      onChange={(e) => handleScoreOnlyChange('logical_aptitude_score', e.target.value)}
                      placeholder="8.5"
                    />
                    <span className="locked-denom">/ 10.00</span>
                  </div>
                )}
              </div>
              <div className="pillar-body">
                {isPreviewMode ? (
                  formData.logical_aptitude_obs || 'Solved 4/5 pattern-finding and critical reasoning puzzles during weekly aptitude rounds.'
                ) : (
                  <textarea
                    rows={2}
                    className="live-textarea live-instruction-input"
                    value={formData.logical_aptitude_obs || ''}
                    onChange={(e) => handleChange('logical_aptitude_obs', e.target.value)}
                    placeholder="Solved 4/5 pattern-finding and critical reasoning puzzles during weekly aptitude rounds."
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
                  <div className="locked-score-cell" style={{ maxWidth: '105px' }}>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className="live-score-num-input"
                      value={parseNumericScore(formData.homework_score) || ''}
                      onChange={(e) => handleScoreOnlyChange('homework_score', e.target.value)}
                      placeholder="9.5"
                    />
                    <span className="locked-denom">/ 10.00</span>
                  </div>
                )}
              </div>
              <div className="pillar-body">
                {isPreviewMode ? (
                  formData.homework_obs || '96% daily homework completion rate on time without needing repeated follow-ups.'
                ) : (
                  <textarea
                    rows={2}
                    className="live-textarea live-instruction-input"
                    value={formData.homework_obs || ''}
                    onChange={(e) => handleChange('homework_obs', e.target.value)}
                    placeholder="96% daily homework completion rate on time without needing repeated follow-ups."
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
                  <div className="locked-score-cell" style={{ maxWidth: '105px' }}>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className="live-score-num-input"
                      value={parseNumericScore(formData.neatness_score) || ''}
                      onChange={(e) => handleScoreOnlyChange('neatness_score', e.target.value)}
                      placeholder="8.0"
                    />
                    <span className="locked-denom">/ 10.00</span>
                  </div>
                )}
              </div>
              <div className="pillar-body">
                {isPreviewMode ? (
                  formData.neatness_obs || 'Clean margin maintenance; neat step-by-step working. Science diagram labeling can improve.'
                ) : (
                  <textarea
                    rows={2}
                    className="live-textarea live-instruction-input"
                    value={formData.neatness_obs || ''}
                    onChange={(e) => handleChange('neatness_obs', e.target.value)}
                    placeholder="Clean margin maintenance; neat step-by-step working. Science diagram labeling can improve."
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
                  placeholder="Next two chapters in all subjects"
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
          max-width: 940px;
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
          max-width: 940px;
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

        /* EXACT A4 REPORT CARD SHEET - SLEEK LUXURY DARK THEME */
        .report-card-paper {
          width: 100%;
          max-width: 940px;
          background: #111827;
          color: #F8FAFC;
          padding: 24px 30px 20px;
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
          font-size: 0.82rem;
          color: #FFFFFF;
          font-weight: 600;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s;
        }
        .live-input::placeholder {
          color: #64748B !important;
          opacity: 0.75 !important;
          font-weight: 400 !important;
        }
        .live-input:focus {
          border-color: #F59E0B;
          background: #0B0F19;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
        }

        .live-select {
          width: 100%;
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 6px;
          padding: 5px 6px;
          font-size: 0.80rem;
          color: #FFFFFF;
          font-weight: 700;
          outline: none;
          cursor: pointer;
          box-sizing: border-box;
        }
        .live-select:focus {
          border-color: #F59E0B;
          background: #0B0F19;
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
          opacity: 0.75 !important;
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

        .live-instruction-input::placeholder {
          color: #64748B !important;
          opacity: 0.75 !important;
          font-style: italic !important;
          font-weight: 400 !important;
        }

        /* Locked Passage Length & Time Wrap */
        .locked-passage-wrap {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 4px;
          padding: 3px 5px;
          width: 100%;
          box-sizing: border-box;
        }
        .locked-passage-wrap:focus-within {
          border-color: #38BDF8;
          background: #0B0F19;
        }
        .live-words-num-input {
          width: 38px;
          background: transparent;
          border: none;
          color: #F8FAFC;
          font-size: 0.78rem;
          font-weight: 800;
          text-align: right;
          outline: none;
        }
        .locked-sep {
          font-size: 0.70rem;
          color: #64748B;
          font-weight: 700;
          user-select: none;
          white-space: nowrap;
        }
        .live-time-input {
          width: 58px;
          background: transparent;
          border: none;
          color: #F8FAFC;
          font-size: 0.76rem;
          font-weight: 700;
          outline: none;
        }

        /* Locked Comprehension Score Wrap */
        .locked-comp-wrap {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 4px;
          padding: 3px 5px;
          width: 100%;
          box-sizing: border-box;
        }
        .locked-comp-wrap:focus-within {
          border-color: #10B981;
          background: #0B0F19;
        }
        .live-comp-num-input {
          width: 32px;
          background: transparent;
          border: none;
          color: #34D399;
          font-size: 0.80rem;
          font-weight: 800;
          text-align: right;
          outline: none;
        }
        .locked-comp-denom {
          font-size: 0.68rem;
          color: #64748B;
          font-weight: 700;
          user-select: none;
          white-space: nowrap;
        }
        .locked-comp-error {
          font-size: 0.66rem;
          color: #F59E0B;
          font-weight: 800;
          user-select: none;
          white-space: nowrap;
          margin-left: 2px;
        }

        /* Locked Score Cell (Number input + fixed /10.00 suffix) */
        .locked-score-cell {
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 4px;
          padding: 3px 6px;
          box-sizing: border-box;
          width: 100%;
          max-width: 110px;
        }
        .locked-score-cell:focus-within {
          border-color: #38BDF8;
          background: #0B0F19;
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
        }

        .live-score-num-input {
          width: 44px;
          background: transparent;
          border: none;
          color: #38BDF8;
          font-size: 0.82rem;
          font-weight: 800;
          text-align: right;
          font-family: 'Inter', monospace;
          outline: none;
        }
        .live-score-num-input::placeholder {
          color: #94A3B8 !important;
        }

        .locked-denom {
          font-size: 0.72rem;
          font-weight: 700;
          color: #64748B;
          user-select: none;
          font-family: 'Inter', monospace;
        }

        /* Locked WPM Speed Wrap */
        .locked-wpm-wrap {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 4px;
          padding: 3px 6px;
          width: 100%;
        }
        .locked-wpm-wrap:focus-within {
          border-color: #38BDF8;
          background: #0B0F19;
        }

        .live-wpm-num-input {
          width: 42px;
          background: transparent;
          border: none;
          color: #F8FAFC;
          font-size: 0.78rem;
          font-weight: 800;
          outline: none;
        }
        .live-wpm-num-input::placeholder {
          color: #94A3B8 !important;
        }

        .locked-wpm-category {
          font-size: 0.72rem;
          font-weight: 800;
          color: #F59E0B;
          user-select: none;
          white-space: nowrap;
        }

        .live-table-score-input {
          width: 100%;
          max-width: 90px;
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
          color: #94A3B8 !important;
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
          opacity: 0.75 !important;
          font-style: italic !important;
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
          width: 210px;
        }
        .live-summary-input::placeholder {
          color: #94A3B8 !important;
        }

        /* Meta Grid */
        .report-meta-grid {
          display: grid;
          grid-template-columns: 1.25fr 1.15fr 1fr 1.35fr;
          border: 1px solid #334155;
          border-radius: 8px;
          margin: 12px 0 10px;
          background: #0F172A;
        }

        .report-meta-box {
          padding: 7px 10px;
          border-right: 1px solid #334155;
        }
        .report-meta-box:last-child {
          border-right: none;
        }

        .report-meta-label {
          font-size: 0.63rem;
          font-weight: 800;
          color: #94A3B8;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }

        .report-meta-value {
          font-size: 0.84rem;
          font-weight: 800;
          color: #FFFFFF;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Section Containers */
        .report-section {
          margin-bottom: 10px;
        }

        .report-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: #FFFFFF;
          padding: 5px 10px;
          border-radius: 6px 6px 0 0;
          border: 1px solid #334155;
          border-bottom: none;
        }

        .section-title {
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          color: #F59E0B;
        }

        .section-subtitle {
          font-size: 0.63rem;
          color: #94A3B8;
          font-weight: 600;
        }

        /* Tables */
        .report-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.74rem;
          border: 1px solid #334155;
          border-radius: 0 0 6px 6px;
          overflow: hidden;
          background: #111827;
        }

        .report-table thead tr {
          background: #1E293B;
          color: #94A3B8;
          border-bottom: 1px solid #334155;
        }

        .report-table th {
          padding: 5px 8px;
          font-size: 0.64rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-align: left;
        }

        .report-table tbody tr {
          border-bottom: 1px solid #1E293B;
        }
        .report-table tbody tr:last-child {
          border-bottom: none;
        }

        .report-table td {
          padding: 5px 8px;
          vertical-align: middle;
        }

        .subject-cell {
          font-weight: 800;
          color: #F8FAFC;
          background: #0F172A;
          border-right: 1px solid #334155;
          font-size: 0.76rem;
        }

        .chapter-cell {
          color: #E2E8F0;
          font-size: 0.74rem;
        }

        .status-cell {
          text-align: center;
        }

        .table-primary-text {
          font-weight: 800;
          color: #FFFFFF;
          font-size: 0.76rem;
        }
        .table-secondary-text {
          font-size: 0.64rem;
          color: #94A3B8;
          margin-top: 1px;
        }

        .table-text-cell {
          color: #CBD5E1;
          font-size: 0.74rem;
        }

        .table-score-cell {
          font-weight: 800;
          color: #38BDF8;
          font-size: 0.78rem;
          font-family: 'Inter', monospace;
        }

        /* Status Pills (Strictly Auto-Calculated) */
        .status-pill {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: 1px solid transparent;
          user-select: none;
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
        .status-incomplete {
          background: rgba(239, 68, 68, 0.2);
          color: #F87171;
          border-color: rgba(248, 113, 113, 0.4);
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
        }

        .pillar-card {
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 6px;
          padding: 6px 9px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pillar-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pillar-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: #F59E0B;
        }

        .pillar-score {
          font-size: 0.74rem;
          font-weight: 800;
          color: #38BDF8;
          font-family: 'Inter', monospace;
        }

        .pillar-body {
          font-size: 0.69rem;
          color: #94A3B8;
          line-height: 1.25;
        }

        /* Summary Bar */
        .report-summary-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
          border: 1px solid #334155;
          border-radius: 6px;
          padding: 6px 12px;
          margin-top: 10px;
          font-size: 0.72rem;
        }

        .summary-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .summary-label {
          font-weight: 800;
          color: #94A3B8;
        }

        .summary-highlight {
          font-weight: 900;
          color: #34D399;
          font-size: 0.76rem;
        }

        .summary-divider {
          color: #475569;
        }

        .summary-target {
          color: #FDE68A;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .summary-right {
          color: #94A3B8;
          font-size: 0.70rem;
        }

        /* Signatures */
        .report-signatures {
          display: grid;
          grid-template-columns: 1fr 1fr 1.2fr;
          gap: 16px;
          margin-top: 18px;
          padding-top: 6px;
        }

        .sig-block {
          text-align: center;
        }

        .sig-line {
          width: 80%;
          height: 1px;
          background: #475569;
          margin: 0 auto 6px;
        }

        .sig-title {
          font-size: 0.62rem;
          font-weight: 900;
          color: #E2E8F0;
          letter-spacing: 0.05em;
        }

        .sig-subtitle {
          font-size: 0.58rem;
          color: #94A3B8;
          margin-top: 1px;
        }

        /* Footer */
        .report-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 14px;
          padding-top: 6px;
          border-top: 1px solid #1E293B;
          font-size: 0.58rem;
          color: #64748B;
          font-weight: 600;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* PRINT STYLES - SINGLE CLEAN A4 PAGE */
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: #FFFFFF !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .report-editor-container {
            background: transparent !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          .report-card-paper {
            max-width: 100% !important;
            box-shadow: none !important;
            border: 1px solid #CBD5E1 !important;
            border-radius: 0 !important;
            padding: 18px 22px !important;
            background: #FFFFFF !important;
            color: #0F172A !important;
          }
          .report-meta-grid {
            background: #F8FAFC !important;
            border-color: #E2E8F0 !important;
          }
          .report-meta-box {
            border-color: #E2E8F0 !important;
          }
          .report-meta-value {
            color: #0F172A !important;
          }
          .report-section-header {
            background: #F1F5F9 !important;
            border-color: #CBD5E1 !important;
            color: #0F172A !important;
          }
          .section-title {
            color: #D97706 !important;
          }
          .report-table {
            background: #FFFFFF !important;
            border-color: #CBD5E1 !important;
          }
          .report-table thead tr {
            background: #F8FAFC !important;
            color: #475569 !important;
            border-color: #E2E8F0 !important;
          }
          .report-table tbody tr {
            border-color: #E2E8F0 !important;
          }
          .subject-cell {
            background: #F8FAFC !important;
            color: #0F172A !important;
            border-color: #E2E8F0 !important;
          }
          .chapter-cell {
            color: #334155 !important;
          }
          .table-primary-text {
            color: #0F172A !important;
          }
          .table-score-cell {
            color: #0284C7 !important;
          }
          .pillar-card {
            background: #F8FAFC !important;
            border-color: #E2E8F0 !important;
          }
          .pillar-body {
            color: #475569 !important;
          }
          .report-summary-bar {
            background: #F1F5F9 !important;
            border-color: #CBD5E1 !important;
          }
          .sig-line {
            background: #94A3B8 !important;
          }
          .sig-title {
            color: #0F172A !important;
          }
          .status-cleared {
            background: #DCFCE7 !important;
            color: #166534 !important;
            border-color: #86EFAC !important;
          }
          .status-revision {
            background: #FEF3C7 !important;
            color: #92400E !important;
            border-color: #FDE68A !important;
          }
          .status-incomplete {
            background: #FEE2E2 !important;
            color: #991B1B !important;
            border-color: #FCA5A5 !important;
          }
          .locked-score-cell, .locked-wpm-wrap {
            background: transparent !important;
            border: none !important;
          }
          .live-score-num-input, .live-wpm-num-input {
            color: #000000 !important;
          }
        }
      `}</style>
    </div>
  );
}
