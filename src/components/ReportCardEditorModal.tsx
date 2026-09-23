'use client';

import React, { useState, useEffect } from 'react';
import { MonthlyReportCard, EvaluationDuty } from '@/lib/supabase';
import { X, Save, CheckCircle2, ShieldAlert, Sparkles, Calculator, BookOpen, User, MapPin } from 'lucide-react';
import HorizonLogoIcon from './HorizonLogoSvg';

interface ReportCardEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  duty?: EvaluationDuty;
  studentName: string;
  studentId: string;
  classGrade?: string;
  assignedTutorName?: string;
  assignedTutorContact?: string;
  evaluatorName?: string;
  existingReport?: MonthlyReportCard | null;
  previousReport?: MonthlyReportCard | null;
  onSave: (reportData: Partial<MonthlyReportCard>) => Promise<boolean>;
}

export default function ReportCardEditorModal({
  isOpen,
  onClose,
  duty,
  studentName,
  studentId,
  classGrade = 'Class 7th • CBSE/ICSE',
  assignedTutorName = 'Regular Faculty',
  assignedTutorContact = '+91 9162162128',
  evaluatorName = 'Independent Evaluator',
  existingReport = null,
  previousReport = null,
  onSave
}: ReportCardEditorModalProps) {
  if (!isOpen) return null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPrevReport, setShowPrevReport] = useState(false);

  // Form State initialized with existingReport or realistic defaults
  const [assessmentMonth, setAssessmentMonth] = useState(existingReport?.assessment_month || 'September, 2026');

  // Section 1: Passage Reading
  const [hindiLengthTime, setHindiLengthTime] = useState(existingReport?.hindi_passage_length_time || '160 Words • 1m 25s');
  const [hindiSpeedWpm, setHindiSpeedWpm] = useState(existingReport?.hindi_speed_wpm || '113 WPM (Good)');
  const [hindiComp, setHindiComp] = useState(existingReport?.hindi_comprehension_qs || '4.0 / 5.0 Correct (1 Error)');
  const [hindiFluency, setHindiFluency] = useState(existingReport?.hindi_fluency || '8.50 / 10.00');

  const [englishLengthTime, setEnglishLengthTime] = useState(existingReport?.english_passage_length_time || '175 Words • 1m 35s');
  const [englishSpeedWpm, setEnglishSpeedWpm] = useState(existingReport?.english_speed_wpm || '110 WPM (Optimal)');
  const [englishComp, setEnglishComp] = useState(existingReport?.english_comprehension_qs || '5.0 / 5.0 Correct (0 Error)');
  const [englishFluency, setEnglishFluency] = useState(existingReport?.english_fluency || '9.00 / 10.00');

  // Section 2: Chapter Assessments
  const [mathCh1Name, setMathCh1Name] = useState(existingReport?.math_ch1_name || 'Ch 1: Integers, Number Line & Rules');
  const [mathCh1Marks, setMathCh1Marks] = useState(existingReport?.math_ch1_marks || '9.50 / 10.00');
  const [mathCh1Status, setMathCh1Status] = useState<'Cleared' | 'Revision' | 'Excellent'>(existingReport?.math_ch1_status || 'Cleared');

  const [mathCh2Name, setMathCh2Name] = useState(existingReport?.math_ch2_name || 'Ch 2: Fractions, Decimals & Problem Sums');
  const [mathCh2Marks, setMathCh2Marks] = useState(existingReport?.math_ch2_marks || '8.50 / 10.00');
  const [mathCh2Status, setMathCh2Status] = useState<'Cleared' | 'Revision' | 'Excellent'>(existingReport?.math_ch2_status || 'Cleared');

  const [sciCh1Name, setSciCh1Name] = useState(existingReport?.science_ch1_name || 'Ch 1: Nutrition in Plants (Modes & Photosynthesis)');
  const [sciCh1Marks, setSciCh1Marks] = useState(existingReport?.science_ch1_marks || '9.00 / 10.00');
  const [sciCh1Status, setSciCh1Status] = useState<'Cleared' | 'Revision' | 'Excellent'>(existingReport?.science_ch1_status || 'Cleared');

  const [sciCh2Name, setSciCh2Name] = useState(existingReport?.science_ch2_name || 'Ch 2: Nutrition in Animals (Digestive Organs)');
  const [sciCh2Marks, setSciCh2Marks] = useState(existingReport?.science_ch2_marks || '7.50 / 10.00');
  const [sciCh2Status, setSciCh2Status] = useState<'Cleared' | 'Revision' | 'Excellent'>(existingReport?.science_ch2_status || 'Revision');

  const [sstCh1Name, setSstCh1Name] = useState(existingReport?.sst_ch1_name || 'Ch 1: Tracing Changes Through a Thousand Years');
  const [sstCh1Marks, setSstCh1Marks] = useState(existingReport?.sst_ch1_marks || '8.50 / 10.00');
  const [sstCh1Status, setSstCh1Status] = useState<'Cleared' | 'Revision' | 'Excellent'>(existingReport?.sst_ch1_status || 'Cleared');

  const [sstCh2Name, setSstCh2Name] = useState(existingReport?.sst_ch2_name || 'Ch 2: Our Environment & Earth Interior Layers');
  const [sstCh2Marks, setSstCh2Marks] = useState(existingReport?.sst_ch2_marks || '8.00 / 10.00');
  const [sstCh2Status, setSstCh2Status] = useState<'Cleared' | 'Revision' | 'Excellent'>(existingReport?.sst_ch2_status || 'Cleared');

  const [langEngName, setLangEngName] = useState(existingReport?.lang_eng_name || 'English (Ch 1-2): Three Questions & The Squirrel');
  const [langEngMarks, setLangEngMarks] = useState(existingReport?.lang_eng_marks || '9.00 / 10.00');
  const [langEngStatus, setLangEngStatus] = useState<'Cleared' | 'Revision' | 'Excellent'>(existingReport?.lang_eng_status || 'Cleared');

  const [langHindiName, setLangHindiName] = useState(existingReport?.lang_hindi_name || 'Hindi (Ch 1-2): हम पंछी उन्मुक्त गगन के & दादी माँ');
  const [langHindiMarks, setLangHindiMarks] = useState(existingReport?.lang_hindi_marks || '8.50 / 10.00');
  const [langHindiStatus, setLangHindiStatus] = useState<'Cleared' | 'Revision' | 'Excellent'>(existingReport?.lang_hindi_status || 'Cleared');

  // Section 3: Communication Skills
  const [mannersScore, setMannersScore] = useState(existingReport?.manners_score || 9.5);
  const [mannersObs, setMannersObs] = useState(existingReport?.manners_obs || 'Polite, attentive; follows homework schedules obediently.');
  const [confidenceScore, setConfidenceScore] = useState(existingReport?.confidence_score || 8.5);
  const [confidenceObs, setConfidenceObs] = useState(existingReport?.confidence_obs || 'Answers without shyness; asks doubts with clarity.');
  const [englishUsageScore, setEnglishUsageScore] = useState(existingReport?.english_usage_score || 8.0);
  const [englishUsageObs, setEnglishUsageObs] = useState(existingReport?.english_usage_obs || '~65% English words used actively during tuition hours.');

  // Section 4: Super-Intelligence Pillars
  const [mentalMathScore, setMentalMathScore] = useState(existingReport?.mental_math_score || '9.0 / 10.00');
  const [mentalMathObs, setMentalMathObs] = useState(existingReport?.mental_math_obs || 'Fast oral tables up to 19; prompt mental addition without rough notebook dependence.');
  const [logicalScore, setLogicalScore] = useState(existingReport?.logical_aptitude_score || '8.5 / 10.00');
  const [logicalObs, setLogicalObs] = useState(existingReport?.logical_aptitude_obs || 'Solved 4/5 pattern-finding and critical reasoning puzzles during weekly aptitude rounds.');
  const [homeworkScore, setHomeworkScore] = useState(existingReport?.homework_score || '9.5 / 10.00');
  const [homeworkObs, setHomeworkObs] = useState(existingReport?.homework_obs || '96% daily homework completion rate on time without needing repeated follow-ups.');
  const [neatnessScore, setNeatnessScore] = useState(existingReport?.neatness_score || '8.0 / 10.00');
  const [neatnessObs, setNeatnessObs] = useState(existingReport?.neatness_obs || 'Clean margin maintenance; neat step-by-step working. Science diagram labeling can improve.');

  // Summary & Targets
  const [overallPercentage, setOverallPercentage] = useState<number>(existingReport?.overall_percentage || 86.5);
  const [grade, setGrade] = useState(existingReport?.grade || 'Grade A+ Outstanding');
  const [nextTarget, setNextTarget] = useState(existingReport?.next_month_target || 'Chapters 3 & 4 of all subjects');
  const [focusRec, setFocusRec] = useState(existingReport?.focus_recommendation || 'Daily 15m English book reading at home');

  // Auto calculate overall percentage & grade based on marks
  const recalculateOverall = () => {
    try {
      const parseNum = (str: string) => {
        const match = str.match(/([0-9]+(?:\.[0-9]+)?)/);
        return match ? parseFloat(match[1]) : 8.0;
      };

      const academicScores = [
        parseNum(mathCh1Marks), parseNum(mathCh2Marks),
        parseNum(sciCh1Marks), parseNum(sciCh2Marks),
        parseNum(sstCh1Marks), parseNum(sstCh2Marks),
        parseNum(langEngMarks), parseNum(langHindiMarks)
      ];
      const academicAvg = (academicScores.reduce((a, b) => a + b, 0) / academicScores.length) * 10; // out of 100

      const commAvg = ((mannersScore + confidenceScore + englishUsageScore) / 30) * 100;
      
      const pillarScores = [parseNum(mentalMathScore), parseNum(logicalScore), parseNum(homeworkScore), parseNum(neatnessScore)];
      const pillarAvg = (pillarScores.reduce((a, b) => a + b, 0) / 4) * 10;

      const computed = (academicAvg * 0.5) + (commAvg * 0.25) + (pillarAvg * 0.25);
      const rounded = Math.round(computed * 10) / 10;
      setOverallPercentage(rounded);

      if (rounded >= 90) setGrade('Grade A+ Outstanding');
      else if (rounded >= 80) setGrade('Grade A Excellent');
      else if (rounded >= 70) setGrade('Grade B+ Very Good');
      else if (rounded >= 60) setGrade('Grade B Good');
      else setGrade('Needs Improvement');
    } catch (e) {
      console.warn('Calculation error:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const payload: Partial<MonthlyReportCard> = {
      student_id: studentId,
      student_name: studentName,
      class_grade: classGrade,
      assessment_month: assessmentMonth,
      assigned_tutor_name: assignedTutorName,
      assigned_tutor_contact: assignedTutorContact,
      evaluator_tutor_name: evaluatorName,
      duty_id: duty?.id,
      test_center_name: duty?.center_name || 'Horizon Examination Center',
      
      hindi_passage_length_time: hindiLengthTime,
      hindi_speed_wpm: hindiSpeedWpm,
      hindi_comprehension_qs: hindiComp,
      hindi_fluency: hindiFluency,

      english_passage_length_time: englishLengthTime,
      english_speed_wpm: englishSpeedWpm,
      english_comprehension_qs: englishComp,
      english_fluency: englishFluency,

      math_ch1_name: mathCh1Name,
      math_ch1_marks: mathCh1Marks,
      math_ch1_status: mathCh1Status,
      math_ch2_name: mathCh2Name,
      math_ch2_marks: mathCh2Marks,
      math_ch2_status: mathCh2Status,

      science_ch1_name: sciCh1Name,
      science_ch1_marks: sciCh1Marks,
      science_ch1_status: sciCh1Status,
      science_ch2_name: sciCh2Name,
      science_ch2_marks: sciCh2Marks,
      science_ch2_status: sciCh2Status,

      sst_ch1_name: sstCh1Name,
      sst_ch1_marks: sstCh1Marks,
      sst_ch1_status: sstCh1Status,
      sst_ch2_name: sstCh2Name,
      sst_ch2_marks: sstCh2Marks,
      sst_ch2_status: sstCh2Status,

      lang_eng_name: langEngName,
      lang_eng_marks: langEngMarks,
      lang_eng_status: langEngStatus,
      lang_hindi_name: langHindiName,
      lang_hindi_marks: langHindiMarks,
      lang_hindi_status: langHindiStatus,

      manners_max: 10,
      manners_score: Number(mannersScore),
      manners_obs: mannersObs,
      confidence_max: 10,
      confidence_score: Number(confidenceScore),
      confidence_obs: confidenceObs,
      english_usage_max: 10,
      english_usage_score: Number(englishUsageScore),
      english_usage_obs: englishUsageObs,

      mental_math_score: mentalMathScore,
      mental_math_obs: mentalMathObs,
      logical_aptitude_score: logicalScore,
      logical_aptitude_obs: logicalObs,
      homework_score: homeworkScore,
      homework_obs: homeworkObs,
      neatness_score: neatnessScore,
      neatness_obs: neatnessObs,

      overall_percentage: overallPercentage,
      grade: grade,
      next_month_target: nextTarget,
      focus_recommendation: focusRec,
      status: 'VERIFIED'
    };

    const success = await onSave(payload);
    setIsSubmitting(false);
    if (success) {
      onClose();
    } else {
      setErrorMsg('Failed to save report card. Please verify database connection.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#0F172A',
        border: '1px solid #334155',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1050px',
        maxHeight: '92vh',
        overflowY: 'auto',
        color: '#F8FAFC',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HorizonLogoIcon size={28} color="#F59E0B" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC' }}>
                Conduct Monthly Test &amp; Fill Progress Report
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span>Student: <strong style={{ color: '#F59E0B' }}>{studentName}</strong> ({classGrade})</span>
                <span>•</span>
                <span>Evaluator: <strong style={{ color: '#38BDF8' }}>{evaluatorName}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {previousReport && (
              <button
                type="button"
                onClick={() => setShowPrevReport(!showPrevReport)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: showPrevReport ? '#38BDF8' : '#1E293B',
                  color: showPrevReport ? '#000' : '#F8FAFC',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1px solid #334155',
                  cursor: 'pointer'
                }}
              >
                {showPrevReport ? 'Hide Prev Report' : '👁️ View Old Report'}
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: '#1E293B',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Security / 1-Day Duty Banner */}
        <div style={{
          padding: '10px 1.5rem',
          background: 'rgba(245, 158, 11, 0.08)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B' }}>
            <ShieldAlert size={16} />
            <span><strong>Cross-Evaluation Active:</strong> You are evaluating this student independently at <strong>{duty?.center_name || 'Horizon Examination Center'}</strong>.</span>
          </div>
          <button
            type="button"
            onClick={recalculateOverall}
            style={{
              background: 'transparent',
              border: '1px solid #F59E0B',
              color: '#F59E0B',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Calculator size={14} />
            <span>Auto-Calculate Grade</span>
          </button>
        </div>

        {/* Previous Report Reference Drawer */}
        {showPrevReport && previousReport && (
          <div style={{
            margin: '1rem 1.5rem 0',
            padding: '1rem',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.06)',
            border: '1px dashed #0284C7',
            fontSize: '0.82rem'
          }}>
            <h4 style={{ margin: '0 0 6px 0', color: '#38BDF8', fontWeight: 800 }}>
              Previous Month ({previousReport.assessment_month}) Audit Snapshot:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div>Overall: <strong>{previousReport.overall_percentage}% ({previousReport.grade})</strong></div>
              <div>Hindi WPM: <strong>{previousReport.hindi_speed_wpm}</strong></div>
              <div>English WPM: <strong>{previousReport.english_speed_wpm}</strong></div>
              <div>Target was: <em>{previousReport.next_month_target}</em></div>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Assessment Month Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8' }}>Assessment Month &amp; Year</label>
              <input
                type="text"
                required
                value={assessmentMonth}
                onChange={(e) => setAssessmentMonth(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8' }}>Overall Score Preview</label>
              <div style={{ marginTop: '4px', padding: '8px 12px', background: '#1E293B', border: '1px solid #38BDF8', borderRadius: '8px', color: '#38BDF8', fontWeight: 800, fontSize: '0.92rem' }}>
                {overallPercentage}% • {grade}
              </div>
            </div>
          </div>

          {/* 1. PASSAGE READING */}
          <div style={{ border: '1px solid #334155', borderRadius: '10px', padding: '1rem', background: '#131D31' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '0.92rem', color: '#F59E0B', fontWeight: 800 }}>
              1. PASSAGE READING &amp; COMPREHENSION EVALUATION
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Hindi Length &amp; Time</label>
                <input type="text" value={hindiLengthTime} onChange={(e) => setHindiLengthTime(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Hindi Speed (WPM)</label>
                <input type="text" value={hindiSpeedWpm} onChange={(e) => setHindiSpeedWpm(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Hindi Comprehension Qs</label>
                <input type="text" value={hindiComp} onChange={(e) => setHindiComp(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Hindi Fluency (/10.00)</label>
                <input type="text" value={hindiFluency} onChange={(e) => setHindiFluency(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>English Length &amp; Time</label>
                <input type="text" value={englishLengthTime} onChange={(e) => setEnglishLengthTime(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>English Speed (WPM)</label>
                <input type="text" value={englishSpeedWpm} onChange={(e) => setEnglishSpeedWpm(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>English Comprehension Qs</label>
                <input type="text" value={englishComp} onChange={(e) => setEnglishComp(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>English Fluency (/10.00)</label>
                <input type="text" value={englishFluency} onChange={(e) => setEnglishFluency(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC' }} />
              </div>
            </div>
          </div>

          {/* 2. ACADEMIC CHAPTER ASSESSMENTS */}
          <div style={{ border: '1px solid #334155', borderRadius: '10px', padding: '1rem', background: '#131D31' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '0.92rem', color: '#F59E0B', fontWeight: 800 }}>
              2. ACADEMIC CHAPTER ASSESSMENTS (2 Chapters Per Subject)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Math */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.82rem' }}>Math Ch 1</span>
                <input type="text" value={mathCh1Name} onChange={(e) => setMathCh1Name(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <input type="text" value={mathCh1Marks} onChange={(e) => setMathCh1Marks(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <select value={mathCh1Status} onChange={(e: any) => setMathCh1Status(e.target.value)} style={{ padding: '6px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem' }}>
                  <option value="Cleared">Cleared</option>
                  <option value="Revision">Revision</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.82rem' }}>Math Ch 2</span>
                <input type="text" value={mathCh2Name} onChange={(e) => setMathCh2Name(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <input type="text" value={mathCh2Marks} onChange={(e) => setMathCh2Marks(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <select value={mathCh2Status} onChange={(e: any) => setMathCh2Status(e.target.value)} style={{ padding: '6px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem' }}>
                  <option value="Cleared">Cleared</option>
                  <option value="Revision">Revision</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </div>

              {/* Science */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontWeight: 800, color: '#10B981', fontSize: '0.82rem' }}>Science Ch 1</span>
                <input type="text" value={sciCh1Name} onChange={(e) => setSciCh1Name(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <input type="text" value={sciCh1Marks} onChange={(e) => setSciCh1Marks(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <select value={sciCh1Status} onChange={(e: any) => setSciCh1Status(e.target.value)} style={{ padding: '6px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem' }}>
                  <option value="Cleared">Cleared</option>
                  <option value="Revision">Revision</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#10B981', fontSize: '0.82rem' }}>Science Ch 2</span>
                <input type="text" value={sciCh2Name} onChange={(e) => setSciCh2Name(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <input type="text" value={sciCh2Marks} onChange={(e) => setSciCh2Marks(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <select value={sciCh2Status} onChange={(e: any) => setSciCh2Status(e.target.value)} style={{ padding: '6px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem' }}>
                  <option value="Cleared">Cleared</option>
                  <option value="Revision">Revision</option>
                </select>
              </div>

              {/* Social Science */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontWeight: 800, color: '#A855F7', fontSize: '0.82rem' }}>Social Sci Ch 1</span>
                <input type="text" value={sstCh1Name} onChange={(e) => setSstCh1Name(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <input type="text" value={sstCh1Marks} onChange={(e) => setSstCh1Marks(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <select value={sstCh1Status} onChange={(e: any) => setSstCh1Status(e.target.value)} style={{ padding: '6px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem' }}>
                  <option value="Cleared">Cleared</option>
                  <option value="Revision">Revision</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#A855F7', fontSize: '0.82rem' }}>Social Sci Ch 2</span>
                <input type="text" value={sstCh2Name} onChange={(e) => setSstCh2Name(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <input type="text" value={sstCh2Marks} onChange={(e) => setSstCh2Marks(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <select value={sstCh2Status} onChange={(e: any) => setSstCh2Status(e.target.value)} style={{ padding: '6px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem' }}>
                  <option value="Cleared">Cleared</option>
                  <option value="Revision">Revision</option>
                </select>
              </div>

              {/* Languages */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontWeight: 800, color: '#EC4899', fontSize: '0.82rem' }}>English Ch 1-2</span>
                <input type="text" value={langEngName} onChange={(e) => setLangEngName(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <input type="text" value={langEngMarks} onChange={(e) => setLangEngMarks(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <select value={langEngStatus} onChange={(e: any) => setLangEngStatus(e.target.value)} style={{ padding: '6px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem' }}>
                  <option value="Cleared">Cleared</option>
                  <option value="Revision">Revision</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#EC4899', fontSize: '0.82rem' }}>Hindi Ch 1-2</span>
                <input type="text" value={langHindiName} onChange={(e) => setLangHindiName(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <input type="text" value={langHindiMarks} onChange={(e) => setLangHindiMarks(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <select value={langHindiStatus} onChange={(e: any) => setLangHindiStatus(e.target.value)} style={{ padding: '6px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem' }}>
                  <option value="Cleared">Cleared</option>
                  <option value="Revision">Revision</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. COMMUNICATION SKILLS & HABITS */}
          <div style={{ border: '1px solid #334155', borderRadius: '10px', padding: '1rem', background: '#131D31' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '0.92rem', color: '#F59E0B', fontWeight: 800 }}>
              3. COMMUNICATION SKILLS &amp; CONVERSATIONAL ENGLISH HABITS
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Respectful Manners Score (/10): <strong>{mannersScore}</strong></label>
                <input type="range" min="1" max="10" step="0.5" value={mannersScore} onChange={(e) => setMannersScore(parseFloat(e.target.value))} style={{ width: '100%' }} />
                <textarea rows={2} value={mannersObs} onChange={(e) => setMannersObs(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Confidence &amp; Articulation (/10): <strong>{confidenceScore}</strong></label>
                <input type="range" min="1" max="10" step="0.5" value={confidenceScore} onChange={(e) => setConfidenceScore(parseFloat(e.target.value))} style={{ width: '100%' }} />
                <textarea rows={2} value={confidenceObs} onChange={(e) => setConfidenceObs(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>English Spoken Usage (/10): <strong>{englishUsageScore}</strong></label>
                <input type="range" min="1" max="10" step="0.5" value={englishUsageScore} onChange={(e) => setEnglishUsageScore(parseFloat(e.target.value))} style={{ width: '100%' }} />
                <textarea rows={2} value={englishUsageObs} onChange={(e) => setEnglishUsageObs(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem', marginTop: '4px' }} />
              </div>
            </div>
          </div>

          {/* 4. SUPER-INTELLIGENCE PILLARS */}
          <div style={{ border: '1px solid #334155', borderRadius: '10px', padding: '1rem', background: '#131D31' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '0.92rem', color: '#F59E0B', fontWeight: 800 }}>
              4. SUPER-INTELLIGENCE &amp; HIGH-PERFORMANCE PILLARS
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Mental Math Score</label>
                <input type="text" value={mentalMathScore} onChange={(e) => setMentalMathScore(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem' }} />
                <textarea rows={2} value={mentalMathObs} onChange={(e) => setMentalMathObs(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.75rem', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Logical Aptitude Score</label>
                <input type="text" value={logicalScore} onChange={(e) => setLogicalScore(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem' }} />
                <textarea rows={2} value={logicalObs} onChange={(e) => setLogicalObs(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.75rem', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Homework Discipline Score</label>
                <input type="text" value={homeworkScore} onChange={(e) => setHomeworkScore(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem' }} />
                <textarea rows={2} value={homeworkObs} onChange={(e) => setHomeworkObs(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.75rem', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Neatness &amp; Handwriting Score</label>
                <input type="text" value={neatnessScore} onChange={(e) => setNeatnessScore(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem' }} />
                <textarea rows={2} value={neatnessObs} onChange={(e) => setNeatnessObs(e.target.value)} style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.75rem', marginTop: '4px' }} />
              </div>
            </div>
          </div>

          {/* Targets & Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8' }}>Next Month Target</label>
              <input type="text" value={nextTarget} onChange={(e) => setNextTarget(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8' }}>Daily Focus Recommendation</label>
              <input type="text" value={focusRec} onChange={(e) => setFocusRec(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', marginTop: '4px' }} />
            </div>
          </div>

          {errorMsg && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.86rem' }}>
              {errorMsg}
            </div>
          )}

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '1rem', borderTop: '1px solid #1E293B' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid #334155',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#000',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
              }}
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Submitting & Locking Report...' : 'Finalize & Lock Report Card'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
