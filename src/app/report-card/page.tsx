'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import ReportCardView from '@/components/ReportCardView';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MonthlyReportCard } from '@/lib/supabase';

const SAMPLE_AUDIT_REPORT: MonthlyReportCard = {
  id: 'rep-sample-001',
  student_id: 'std-aaryan-01',
  student_name: 'Aaryan Sharma',
  parent_name: 'Suresh Sharma',
  class_grade: 'Class 7th • CBSE/ICSE',
  assessment_month: 'September, 2026',
  
  assigned_tutor_name: 'Harshit Patel (PCE Purnia)',
  assigned_tutor_contact: '+91 9162162128',
  evaluator_tutor_name: 'Vikash Kumar (Certified Cross-Examiner)',
  test_center_name: 'Horizon Central Evaluation Center #1 - Purnia',

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
  next_month_target: 'Next two chapters in all subjects',
  focus_recommendation: 'Daily 15m English book reading at home',
  status: 'VERIFIED'
};

export default function ReportCardMainPage() {
  return (
    <>
      <div className="no-print">
        <Navbar />
      </div>

      <main style={{ minHeight: '90vh', background: '#0B0F19' }}>
        {/* Navigation Quick Bar */}
        <div className="no-print" style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '1.25rem 1rem 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ color: '#F8FAFC', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Horizon Official Monthly Progress Report
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
              Standardized single-page evaluation matching official printable audit blueprints.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              href="/report-card/fill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#000',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.86rem',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)'
              }}
            >
              <span>Live Direct-Fill Report Card</span>
            </Link>
          </div>
        </div>

        <ReportCardView report={SAMPLE_AUDIT_REPORT} />
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </>
  );
}

