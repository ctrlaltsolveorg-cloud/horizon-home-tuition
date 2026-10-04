import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendAdminNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      studentName,
      classLevel,
      board = 'CBSE',
      schoolMedium = 'English Medium',
      subjects,
      area,
      city = 'Purnia',
      parentName,
      parentPhone,
      parentEmail = '',
      preferredLanguage = 'en',
      additionalNotes = '',
    } = body;

    // Validation for essential fields
    if (!studentName || !classLevel || !parentName || !parentPhone) {
      return NextResponse.json(
        { error: 'Please fill in all basic fields (Student Name, Class, Parent Name, Parent Phone).' },
        { status: 400 }
      );
    }

    const subjectsStr = Array.isArray(subjects) ? subjects.join(', ') : subjects || 'General Subjects';

    // Insert directly into Supabase online PostgreSQL table student_enquiries
    const { data: newEnquiry, error } = await supabase
      .from('student_enquiries')
      .insert([{
        student_name: studentName.trim(),
        parent_name: parentName.trim(),
        phone: parentPhone.trim(),
        email: parentEmail ? parentEmail.trim().toLowerCase() : null,
        class_level: classLevel,
        board: board,
        school_medium: schoolMedium,
        address: `${area || ''}, ${city || 'Purnia'}`,
        test_status: 'Assessment Scheduled',
        test_score: '88%',
        fee_status: 'pending',
        fee_amount: 4500,
        status: 'pending',
        notes: additionalNotes || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase enquiry insertion error:', error);
      throw error;
    }

    // Dispatch Admin Notification Email
    try {
      const langDisplay = preferredLanguage === 'hi' ? 'हिंदी (Hindi)' : 'English';
      await sendAdminNotification({
        subject: `NEW PARENT ENQUIRY — ${studentName} (${classLevel}, ${board})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #1e40af; margin-top: 0;">New Horizon Parent Enquiry</h2>
            <p><strong>Parent:</strong> ${parentName} (${parentPhone})</p>
            <p><strong>Student:</strong> ${studentName} | <strong>Class:</strong> ${classLevel} (${board})</p>
            <p><strong>Subject:</strong> ${subjectsStr} | <strong>Medium:</strong> ${schoolMedium}</p>
            <p><strong>Location:</strong> ${area}, ${city}</p>
            <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">View and assign tutor in Horizon Admin Portal: /admin</p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.warn('Mail notification warning:', mailErr);
    }

    return NextResponse.json({
      success: true,
      enquiry: newEnquiry,
      message: preferredLanguage === 'hi'
        ? 'धन्यवाद! Horizon से संपर्क करने के लिए धन्यवाद। हमारी टीम जल्द ही आपसे संपर्क करेगी।'
        : 'Thank you for contacting Horizon. Our team will contact you shortly.',
    });
  } catch (error: any) {
    console.error('Enquiry API Error:', error);
    return NextResponse.json({ error: 'Failed to process parent enquiry: ' + error.message }, { status: 500 });
  }
}
