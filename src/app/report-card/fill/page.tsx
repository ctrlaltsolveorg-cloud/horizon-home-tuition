'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportCardInteractiveEditor from '@/components/ReportCardInteractiveEditor';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function FillReportCardContent() {
  const searchParams = useSearchParams();
  const studentName = searchParams.get('studentName') || undefined;
  const classGrade = searchParams.get('classGrade') || undefined;
  const tutorName = searchParams.get('tutorName') || undefined;
  const dutyId = searchParams.get('dutyId') || undefined;
  const centerName = searchParams.get('centerName') || undefined;

  const initialReport = {
    ...(studentName ? { student_name: studentName } : {}),
    ...(classGrade ? { class_grade: classGrade } : {}),
    ...(tutorName ? { assigned_tutor_name: tutorName } : {}),
    ...(centerName ? { test_center_name: centerName } : {})
  };

  return (
    <ReportCardInteractiveEditor
      initialReport={initialReport}
      dutyId={dutyId}
      backUrl="/tutor-dashboard"
    />
  );
}

export default function FillReportCardPage() {
  return (
    <>
      <div className="no-print">
        <Navbar />
      </div>

      <main style={{ minHeight: '90vh', background: '#0B0F19' }}>
        <Suspense fallback={
          <div style={{ color: '#FFF', textAlign: 'center', padding: '5rem' }}>
            Loading Interactive Live Report Card...
          </div>
        }>
          <FillReportCardContent />
        </Suspense>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </>
  );
}
