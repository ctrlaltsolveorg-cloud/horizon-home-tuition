'use client';

import React, { useState, useEffect } from 'react';
import { MonthlyReportCard, EvaluationDuty } from '@/lib/supabase';
import { X, Save, CheckCircle2, ShieldAlert, Sparkles, Calculator, BookOpen, User, MapPin } from 'lucide-react';
import HorizonLogoIcon from './HorizonLogoSvg';
import {
  computeChapterStatus,
  computeWpmCategory,
  parseNumericScore,
  parseWpmNumber,
  parsePassageWords,
  parsePassageTime,
  parseCompCorrect,
  formatCompString,
  formatScoreFloat
} from './ReportCardInteractiveEditor';
import { FormattedScoreInput } from './FormattedScoreInput';

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
  classGrade = 'Class 7th • CBSE',
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
  const [hindiLengthTime, setHindiLengthTime] = useState(existingReport?.hindi_passage_length_time || '300 Words • 1m 25s');
  const [hindiWpmNum, setHindiWpmNum] = useState<number>(parseWpmNumber(existingReport?.hindi_speed_wpm) || 113);
  const [hindiComp, setHindiComp] = useState(existingReport?.hindi_comprehension_qs || '04.00 / 05.00 Correct (01.00 Error)');
  const [hindiFluencyNum, setHindiFluencyNum] = useState<number>(parseNumericScore(existingReport?.hindi_fluency) || 8.5);

  const [englishLengthTime, setEnglishLengthTime] = useState(existingReport?.english_passage_length_time || '300 Words • 1m 35s');
  const [englishWpmNum, setEnglishWpmNum] = useState<number>(parseWpmNumber(existingReport?.english_speed_wpm) || 110);
  const [englishComp, setEnglishComp] = useState(existingReport?.english_comprehension_qs || '05.00 / 05.00 Correct (00.00 Errors)');
  const [englishFluencyNum, setEnglishFluencyNum] = useState<number>(parseNumericScore(existingReport?.english_fluency) || 9.0);

  // Section 2: Chapter Assessments (Scores out of 10)
  const [mathCh1Name, setMathCh1Name] = useState(existingReport?.math_ch1_name || 'Ch 1: Integers, Number Line & Rules');
  const [mathCh1Score, setMathCh1Score] = useState<number>(parseNumericScore(existingReport?.math_ch1_marks) || 7.5);

  const [mathCh2Name, setMathCh2Name] = useState(existingReport?.math_ch2_name || 'Ch 2: Fractions, Decimals & Problem Sums');
  const [mathCh2Score, setMathCh2Score] = useState<number>(parseNumericScore(existingReport?.math_ch2_marks) || 8.5);

  const [sciCh1Name, setSciCh1Name] = useState(existingReport?.science_ch1_name || 'Ch 1: Nutrition in Plants (Modes & Photosynthesis)');
  const [sciCh1Score, setSciCh1Score] = useState<number>(parseNumericScore(existingReport?.science_ch1_marks) || 9.0);

  const [sciCh2Name, setSciCh2Name] = useState(existingReport?.science_ch2_name || 'Ch 2: Nutrition in Animals (Digestive Organs)');
  const [sciCh2Score, setSciCh2Score] = useState<number>(parseNumericScore(existingReport?.science_ch2_marks) || 7.5);

  const [sstCh1Name, setSstCh1Name] = useState(existingReport?.sst_ch1_name || 'Ch 1: Tracing Changes Through a Thousand Years');
  const [sstCh1Score, setSstCh1Score] = useState<number>(parseNumericScore(existingReport?.sst_ch1_marks) || 8.5);

  const [sstCh2Name, setSstCh2Name] = useState(existingReport?.sst_ch2_name || 'Ch 2: Our Environment & Earth Interior Layers');
  const [sstCh2Score, setSstCh2Score] = useState<number>(parseNumericScore(existingReport?.sst_ch2_marks) || 8.0);

  const [langEngName, setLangEngName] = useState(existingReport?.lang_eng_name || 'English (Ch 1-2): Three Questions & The Squirrel');
  const [langEngScore, setLangEngScore] = useState<number>(parseNumericScore(existingReport?.lang_eng_marks) || 9.0);

  const [langHindiName, setLangHindiName] = useState(existingReport?.lang_hindi_name || 'Hindi (Ch 1-2): हम पंछी उन्मुक्त गगन के & दादी माँ');
  const [langHindiScore, setLangHindiScore] = useState<number>(parseNumericScore(existingReport?.lang_hindi_marks) || 8.5);

  // Section 3: Communication Skills
  const [mannersScore, setMannersScore] = useState(existingReport?.manners_score || 9.5);
  const [mannersObs, setMannersObs] = useState(existingReport?.manners_obs || '');
  const [confidenceScore, setConfidenceScore] = useState(existingReport?.confidence_score || 8.5);
  const [confidenceObs, setConfidenceObs] = useState(existingReport?.confidence_obs || '');
  const [englishUsageScore, setEnglishUsageScore] = useState(existingReport?.english_usage_score || 8.0);
  const [englishUsageObs, setEnglishUsageObs] = useState(existingReport?.english_usage_obs || '');

  // Section 4: Super-Intelligence Pillars
  const [mentalMathScore, setMentalMathScore] = useState<number>(parseNumericScore(existingReport?.mental_math_score) || 9.0);
  const [mentalMathObs, setMentalMathObs] = useState(existingReport?.mental_math_obs || '');
  const [logicalScore, setLogicalScore] = useState<number>(parseNumericScore(existingReport?.logical_aptitude_score) || 8.5);
  const [logicalObs, setLogicalObs] = useState(existingReport?.logical_aptitude_obs || '');
  const [homeworkScore, setHomeworkScore] = useState<number>(parseNumericScore(existingReport?.homework_score) || 9.5);
  const [homeworkObs, setHomeworkObs] = useState(existingReport?.homework_obs || '');
  const [neatnessScore, setNeatnessScore] = useState<number>(parseNumericScore(existingReport?.neatness_score) || 8.0);
  const [neatnessObs, setNeatnessObs] = useState(existingReport?.neatness_obs || '');

  // Summary & Targets
  const [overallPercentage, setOverallPercentage] = useState<number>(existingReport?.overall_percentage || 86.5);
  const [grade, setGrade] = useState(existingReport?.grade || 'Grade A+ Outstanding');
  const [nextTarget, setNextTarget] = useState(
    existingReport?.next_month_target && existingReport.next_month_target !== 'Chapters 3 & 4 of all subjects'
      ? existingReport.next_month_target
      : 'Next two chapters in all subjects'
  );
  const [focusRec, setFocusRec] = useState(existingReport?.focus_recommendation || 'Daily 15m English book reading at home');

  // Auto calculate overall percentage & grade based on marks
  const recalculateOverall = () => {
    try {
      const academicScores = [
        mathCh1Score, mathCh2Score,
        sciCh1Score, sciCh2Score,
        sstCh1Score, sstCh2Score,
        langEngScore, langHindiScore
      ];
      const academicAvg = (academicScores.reduce((a, b) => a + b, 0) / academicScores.length) * 10; // out of 100
      const commAvg = ((mannersScore + confidenceScore + englishUsageScore) / 30) * 100;
      const pillarScores = [mentalMathScore, logicalScore, homeworkScore, neatnessScore];
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

  const handleEnglishUsageChange = (newScore: number) => {
    setEnglishUsageScore(newScore);
    const pct = Math.round(newScore * 10);
    setEnglishUsageObs(`~${pct}% English words used actively during tuition hours.`);
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
      test_center_name: duty?.center_name || 'Horizon Central Assessment Center',
      
      hindi_passage_length_time: hindiLengthTime,
      hindi_speed_wpm: `${hindiWpmNum} WPM ${computeWpmCategory(hindiWpmNum)}`,
      hindi_comprehension_qs: hindiComp,
      hindi_fluency: `${formatScoreFloat(hindiFluencyNum)} / 10.00`,

      english_passage_length_time: englishLengthTime,
      english_speed_wpm: `${englishWpmNum} WPM ${computeWpmCategory(englishWpmNum)}`,
      english_comprehension_qs: englishComp,
      english_fluency: `${formatScoreFloat(englishFluencyNum)} / 10.00`,

      math_ch1_name: mathCh1Name,
      math_ch1_marks: `${formatScoreFloat(mathCh1Score)} / 10.00`,
      math_ch1_status: computeChapterStatus(mathCh1Score),
      math_ch2_name: mathCh2Name,
      math_ch2_marks: `${formatScoreFloat(mathCh2Score)} / 10.00`,
      math_ch2_status: computeChapterStatus(mathCh2Score),

      science_ch1_name: sciCh1Name,
      science_ch1_marks: `${formatScoreFloat(sciCh1Score)} / 10.00`,
      science_ch1_status: computeChapterStatus(sciCh1Score),
      science_ch2_name: sciCh2Name,
      science_ch2_marks: `${formatScoreFloat(sciCh2Score)} / 10.00`,
      science_ch2_status: computeChapterStatus(sciCh2Score),

      sst_ch1_name: sstCh1Name,
      sst_ch1_marks: `${formatScoreFloat(sstCh1Score)} / 10.00`,
      sst_ch1_status: computeChapterStatus(sstCh1Score),
      sst_ch2_name: sstCh2Name,
      sst_ch2_marks: `${formatScoreFloat(sstCh2Score)} / 10.00`,
      sst_ch2_status: computeChapterStatus(sstCh2Score),

      lang_eng_name: langEngName,
      lang_eng_marks: `${formatScoreFloat(langEngScore)} / 10.00`,
      lang_eng_status: computeChapterStatus(langEngScore),
      lang_hindi_name: langHindiName,
      lang_hindi_marks: `${formatScoreFloat(langHindiScore)} / 10.00`,
      lang_hindi_status: computeChapterStatus(langHindiScore),

      manners_max: 10,
      manners_score: Number(mannersScore),
      manners_obs: mannersObs,
      confidence_max: 10,
      confidence_score: Number(confidenceScore),
      confidence_obs: confidenceObs,
      english_usage_max: 10,
      english_usage_score: Number(englishUsageScore),
      english_usage_obs: englishUsageObs,

      mental_math_score: `${formatScoreFloat(mentalMathScore)} / 10.00`,
      mental_math_obs: mentalMathObs,
      logical_aptitude_score: `${formatScoreFloat(logicalScore)} / 10.00`,
      logical_aptitude_obs: logicalObs,
      homework_score: `${formatScoreFloat(homeworkScore)} / 10.00`,
      homework_obs: homeworkObs,
      neatness_score: `${formatScoreFloat(neatnessScore)} / 10.00`,
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
                {showPrevReport ? 'Hide Prev Report' : 'View Old Report'}
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

        {/* Security Banner */}
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
            <span><strong>Cross-Evaluation Active:</strong> You are evaluating this student independently at <strong>{duty?.center_name || 'Horizon Central Assessment Center'}</strong>.</span>
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
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Hindi Reading Time</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>300 Words •</span>
                  <input
                    type="text"
                    value={parsePassageTime(hindiLengthTime)}
                    onChange={(e) => setHindiLengthTime(`300 Words • ${e.target.value}`)}
                    placeholder="1m 25s"
                    style={{ width: '75px', background: 'transparent', border: 'none', color: '#F8FAFC', fontWeight: 700, outline: 'none' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Hindi Speed (WPM)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <input
                    type="number"
                    value={hindiWpmNum || ''}
                    onChange={(e) => setHindiWpmNum(parseInt(e.target.value, 10) || 0)}
                    style={{ width: '50px', background: 'transparent', border: 'none', color: '#F8FAFC', fontWeight: 700, outline: 'none' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 800 }}>WPM {computeWpmCategory(hindiWpmNum)}</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Hindi Comprehension Qs</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <FormattedScoreInput
                    min={0}
                    max={5}
                    step={0.1}
                    value={parseCompCorrect(hindiComp)}
                    onChange={(val) => setHindiComp(formatCompString(parseFloat(val) || 0))}
                    style={{ width: '48px', background: 'transparent', border: 'none', color: '#34D399', fontWeight: 800, textAlign: 'right', outline: 'none' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>/ 05.00</span>
                  <span style={{ fontSize: '0.70rem', color: '#F59E0B', fontWeight: 800 }}>
                    ({formatScoreFloat(Math.max(0, 5 - parseCompCorrect(hindiComp)))} {Math.abs(Math.max(0, 5 - parseCompCorrect(hindiComp)) - 1) < 0.01 ? 'Error' : 'Errors'})
                  </span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Hindi Fluency (/10.00)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <FormattedScoreInput
                    min={0}
                    max={10}
                    step={0.1}
                    value={hindiFluencyNum}
                    onChange={(val) => setHindiFluencyNum(parseFloat(val) || 0)}
                    style={{ width: '45px', background: 'transparent', border: 'none', color: '#38BDF8', fontWeight: 800, textAlign: 'right', outline: 'none' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>/ 10.00</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>English Reading Time</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>300 Words •</span>
                  <input
                    type="text"
                    value={parsePassageTime(englishLengthTime)}
                    onChange={(e) => setEnglishLengthTime(`300 Words • ${e.target.value}`)}
                    placeholder="1m 35s"
                    style={{ width: '75px', background: 'transparent', border: 'none', color: '#F8FAFC', fontWeight: 700, outline: 'none' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>English Speed (WPM)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <input
                    type="number"
                    value={englishWpmNum || ''}
                    onChange={(e) => setEnglishWpmNum(parseInt(e.target.value, 10) || 0)}
                    style={{ width: '50px', background: 'transparent', border: 'none', color: '#F8FAFC', fontWeight: 700, outline: 'none' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 800 }}>WPM {computeWpmCategory(englishWpmNum)}</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>English Comprehension Qs</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <FormattedScoreInput
                    min={0}
                    max={5}
                    step={0.1}
                    value={parseCompCorrect(englishComp)}
                    onChange={(val) => setEnglishComp(formatCompString(parseFloat(val) || 0))}
                    style={{ width: '48px', background: 'transparent', border: 'none', color: '#34D399', fontWeight: 800, textAlign: 'right', outline: 'none' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>/ 05.00</span>
                  <span style={{ fontSize: '0.70rem', color: '#F59E0B', fontWeight: 800 }}>
                    ({formatScoreFloat(Math.max(0, 5 - parseCompCorrect(englishComp)))} {Math.abs(Math.max(0, 5 - parseCompCorrect(englishComp)) - 1) < 0.01 ? 'Error' : 'Errors'})
                  </span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>English Fluency (/10.00)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <FormattedScoreInput
                    min={0}
                    max={10}
                    step={0.1}
                    value={englishFluencyNum}
                    onChange={(val) => setEnglishFluencyNum(parseFloat(val) || 0)}
                    style={{ width: '45px', background: 'transparent', border: 'none', color: '#38BDF8', fontWeight: 800, textAlign: 'right', outline: 'none' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>/ 10.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. ACADEMIC CHAPTER ASSESSMENTS */}
          <div style={{ border: '1px solid #334155', borderRadius: '10px', padding: '1rem', background: '#131D31' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '0.92rem', color: '#F59E0B', fontWeight: 800 }}>
              2. ACADEMIC CHAPTER ASSESSMENTS (Locked /10.00 • Auto Status)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Math */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.82rem' }}>Math Ch 1</span>
                <input type="text" value={mathCh1Name} onChange={(e) => setMathCh1Name(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <FormattedScoreInput min={0} max={10} step={0.1} value={mathCh1Score} onChange={(val) => setMathCh1Score(parseFloat(val) || 0)} style={{ width: '45px', background: 'transparent', border: 'none', color: '#38BDF8', fontWeight: 800, textAlign: 'right', outline: 'none' }} />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>/ 10.00</span>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center', background: mathCh1Score >= 8.5 ? 'rgba(16, 185, 129, 0.2)' : mathCh1Score >= 5.0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: mathCh1Score >= 8.5 ? '#34D399' : mathCh1Score >= 5.0 ? '#FBBF24' : '#F87171' }}>
                  {computeChapterStatus(mathCh1Score)}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.82rem' }}>Math Ch 2</span>
                <input type="text" value={mathCh2Name} onChange={(e) => setMathCh2Name(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <FormattedScoreInput min={0} max={10} step={0.1} value={mathCh2Score} onChange={(val) => setMathCh2Score(parseFloat(val) || 0)} style={{ width: '45px', background: 'transparent', border: 'none', color: '#38BDF8', fontWeight: 800, textAlign: 'right', outline: 'none' }} />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>/ 10.00</span>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center', background: mathCh2Score >= 8.5 ? 'rgba(16, 185, 129, 0.2)' : mathCh2Score >= 5.0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: mathCh2Score >= 8.5 ? '#34D399' : mathCh2Score >= 5.0 ? '#FBBF24' : '#F87171' }}>
                  {computeChapterStatus(mathCh2Score)}
                </span>
              </div>

              {/* Science */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontWeight: 800, color: '#10B981', fontSize: '0.82rem' }}>Science Ch 1</span>
                <input type="text" value={sciCh1Name} onChange={(e) => setSciCh1Name(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <FormattedScoreInput min={0} max={10} step={0.1} value={sciCh1Score} onChange={(val) => setSciCh1Score(parseFloat(val) || 0)} style={{ width: '45px', background: 'transparent', border: 'none', color: '#38BDF8', fontWeight: 800, textAlign: 'right', outline: 'none' }} />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>/ 10.00</span>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center', background: sciCh1Score >= 8.5 ? 'rgba(16, 185, 129, 0.2)' : sciCh1Score >= 5.0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: sciCh1Score >= 8.5 ? '#34D399' : sciCh1Score >= 5.0 ? '#FBBF24' : '#F87171' }}>
                  {computeChapterStatus(sciCh1Score)}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#10B981', fontSize: '0.82rem' }}>Science Ch 2</span>
                <input type="text" value={sciCh2Name} onChange={(e) => setSciCh2Name(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <FormattedScoreInput min={0} max={10} step={0.1} value={sciCh2Score} onChange={(val) => setSciCh2Score(parseFloat(val) || 0)} style={{ width: '45px', background: 'transparent', border: 'none', color: '#38BDF8', fontWeight: 800, textAlign: 'right', outline: 'none' }} />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>/ 10.00</span>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center', background: sciCh2Score >= 8.5 ? 'rgba(16, 185, 129, 0.2)' : sciCh2Score >= 5.0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: sciCh2Score >= 8.5 ? '#34D399' : sciCh2Score >= 5.0 ? '#FBBF24' : '#F87171' }}>
                  {computeChapterStatus(sciCh2Score)}
                </span>
              </div>

              {/* Social Science */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontWeight: 800, color: '#A855F7', fontSize: '0.82rem' }}>Social Sci Ch 1</span>
                <input type="text" value={sstCh1Name} onChange={(e) => setSstCh1Name(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <FormattedScoreInput min={0} max={10} step={0.1} value={sstCh1Score} onChange={(val) => setSstCh1Score(parseFloat(val) || 0)} style={{ width: '45px', background: 'transparent', border: 'none', color: '#38BDF8', fontWeight: 800, textAlign: 'right', outline: 'none' }} />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>/ 10.00</span>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center', background: sstCh1Score >= 8.5 ? 'rgba(16, 185, 129, 0.2)' : sstCh1Score >= 5.0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: sstCh1Score >= 8.5 ? '#34D399' : sstCh1Score >= 5.0 ? '#FBBF24' : '#F87171' }}>
                  {computeChapterStatus(sstCh1Score)}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#A855F7', fontSize: '0.82rem' }}>Social Sci Ch 2</span>
                <input type="text" value={sstCh2Name} onChange={(e) => setSstCh2Name(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <FormattedScoreInput min={0} max={10} step={0.1} value={sstCh2Score} onChange={(val) => setSstCh2Score(parseFloat(val) || 0)} style={{ width: '45px', background: 'transparent', border: 'none', color: '#38BDF8', fontWeight: 800, textAlign: 'right', outline: 'none' }} />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>/ 10.00</span>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center', background: sstCh2Score >= 8.5 ? 'rgba(16, 185, 129, 0.2)' : sstCh2Score >= 5.0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: sstCh2Score >= 8.5 ? '#34D399' : sstCh2Score >= 5.0 ? '#FBBF24' : '#F87171' }}>
                  {computeChapterStatus(sstCh2Score)}
                </span>
              </div>

              {/* Languages */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontWeight: 800, color: '#EC4899', fontSize: '0.82rem' }}>English Ch 1-2</span>
                <input type="text" value={langEngName} onChange={(e) => setLangEngName(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <FormattedScoreInput min={0} max={10} step={0.1} value={langEngScore} onChange={(val) => setLangEngScore(parseFloat(val) || 0)} style={{ width: '45px', background: 'transparent', border: 'none', color: '#38BDF8', fontWeight: 800, textAlign: 'right', outline: 'none' }} />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>/ 10.00</span>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center', background: langEngScore >= 8.5 ? 'rgba(16, 185, 129, 0.2)' : langEngScore >= 5.0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: langEngScore >= 8.5 ? '#34D399' : langEngScore >= 5.0 ? '#FBBF24' : '#F87171' }}>
                  {computeChapterStatus(langEngScore)}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#EC4899', fontSize: '0.82rem' }}>Hindi Ch 1-2</span>
                <input type="text" value={langHindiName} onChange={(e) => setLangHindiName(e.target.value)} style={{ padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.82rem' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px' }}>
                  <FormattedScoreInput min={0} max={10} step={0.1} value={langHindiScore} onChange={(val) => setLangHindiScore(parseFloat(val) || 0)} style={{ width: '45px', background: 'transparent', border: 'none', color: '#38BDF8', fontWeight: 800, textAlign: 'right', outline: 'none' }} />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>/ 10.00</span>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center', background: langHindiScore >= 8.5 ? 'rgba(16, 185, 129, 0.2)' : langHindiScore >= 5.0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: langHindiScore >= 8.5 ? '#34D399' : langHindiScore >= 5.0 ? '#FBBF24' : '#F87171' }}>
                  {computeChapterStatus(langHindiScore)}
                </span>
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
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Respectful Manners Score (/10): <strong>{formatScoreFloat(mannersScore)}</strong></label>
                <input type="range" min="1" max="10" step="0.1" value={mannersScore} onChange={(e) => setMannersScore(parseFloat(e.target.value))} style={{ width: '100%' }} />
                <textarea rows={2} value={mannersObs} onChange={(e) => setMannersObs(e.target.value)} placeholder="Polite, attentive; follows homework schedules obediently." style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Confidence &amp; Articulation (/10): <strong>{formatScoreFloat(confidenceScore)}</strong></label>
                <input type="range" min="1" max="10" step="0.1" value={confidenceScore} onChange={(e) => setConfidenceScore(parseFloat(e.target.value))} style={{ width: '100%' }} />
                <textarea rows={2} value={confidenceObs} onChange={(e) => setConfidenceObs(e.target.value)} placeholder="Answers without shyness; asks doubts with clarity." style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>English Spoken Usage (/10): <strong>{formatScoreFloat(englishUsageScore)}</strong></label>
                <input type="range" min="1" max="10" step="0.1" value={englishUsageScore} onChange={(e) => handleEnglishUsageChange(parseFloat(e.target.value))} style={{ width: '100%' }} />
                <textarea rows={2} value={englishUsageObs} onChange={(e) => setEnglishUsageObs(e.target.value)} placeholder="~80% English words used actively during tuition hours." style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.8rem', marginTop: '4px' }} />
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
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Mental Math Score (/10)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px', marginBottom: '4px' }}>
                  <FormattedScoreInput min={0} max={10} step={0.1} value={mentalMathScore} onChange={(val) => setMentalMathScore(parseFloat(val) || 0)} style={{ width: '45px', background: 'transparent', border: 'none', color: '#38BDF8', fontWeight: 800, textAlign: 'right', outline: 'none' }} />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>/ 10.00</span>
                </div>
                <textarea rows={2} value={mentalMathObs} onChange={(e) => setMentalMathObs(e.target.value)} placeholder="Fast oral tables up to 19; prompt mental addition without rough notebook dependence." style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.75rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Logical Aptitude Score (/10)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px', marginBottom: '4px' }}>
                  <FormattedScoreInput min={0} max={10} step={0.1} value={logicalScore} onChange={(val) => setLogicalScore(parseFloat(val) || 0)} style={{ width: '45px', background: 'transparent', border: 'none', color: '#38BDF8', fontWeight: 800, textAlign: 'right', outline: 'none' }} />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>/ 10.00</span>
                </div>
                <textarea rows={2} value={logicalObs} onChange={(e) => setLogicalObs(e.target.value)} placeholder="Solved 4/5 pattern-finding and critical reasoning puzzles during weekly aptitude rounds." style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.75rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Homework Discipline (/10)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px', marginBottom: '4px' }}>
                  <FormattedScoreInput min={0} max={10} step={0.1} value={homeworkScore} onChange={(val) => setHomeworkScore(parseFloat(val) || 0)} style={{ width: '45px', background: 'transparent', border: 'none', color: '#38BDF8', fontWeight: 800, textAlign: 'right', outline: 'none' }} />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>/ 10.00</span>
                </div>
                <textarea rows={2} value={homeworkObs} onChange={(e) => setHomeworkObs(e.target.value)} placeholder="96% daily homework completion rate on time without needing repeated follow-ups." style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.75rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Neatness &amp; Handwriting (/10)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px', marginBottom: '4px' }}>
                  <FormattedScoreInput min={0} max={10} step={0.1} value={neatnessScore} onChange={(val) => setNeatnessScore(parseFloat(val) || 0)} style={{ width: '45px', background: 'transparent', border: 'none', color: '#38BDF8', fontWeight: 800, textAlign: 'right', outline: 'none' }} />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>/ 10.00</span>
                </div>
                <textarea rows={2} value={neatnessObs} onChange={(e) => setNeatnessObs(e.target.value)} placeholder="Clean margin maintenance; neat step-by-step working. Science diagram labeling can improve." style={{ width: '100%', padding: '6px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.75rem' }} />
              </div>
            </div>
          </div>

          {/* Targets & Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8' }}>Next Month Target</label>
              <input type="text" value={nextTarget} onChange={(e) => setNextTarget(e.target.value)} placeholder="Next two chapters in all subjects" style={{ width: '100%', padding: '8px 12px', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8' }}>Daily Focus Recommendation</label>
              <input type="text" value={focusRec} onChange={(e) => setFocusRec(e.target.value)} placeholder="Daily 15m English book reading at home" style={{ width: '100%', padding: '8px 12px', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', marginTop: '4px' }} />
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
