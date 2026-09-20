import { NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';
import { sendAdminNotification } from '@/lib/email';

export async function POST(req: Request) {
  try {
    initDB();
    const body = await req.json();

    const {
      studentName,
      classLevel,
      board,
      schoolMedium = 'English',
      subjects,
      academicDifficulty = '',
      tuitionType = 'Home Tuition',
      preferredDays = 'Flexible',
      preferredTime = 'Flexible',
      sessionsPerWeek = 'Standard',
      area,
      pincode = '',
      city = 'Delhi NCR',
      parentName,
      parentPhone,
      parentEmail = '',
      preferredLanguage = 'en',
      additionalNotes = '',
    } = body;

    // Validation for essential 4 fields
    if (!studentName || !classLevel || !board || !area || !parentName || !parentPhone) {
      return NextResponse.json(
        { error: 'Please fill in all basic fields (Student Name, Class, Board, Area, Parent Name, Parent Phone).' },
        { status: 400 }
      );
    }

    const subjectsStr = Array.isArray(subjects) ? subjects.join(', ') : subjects || 'General Subjects';

    // Database Insertion
    const stmt = db.prepare(`
      INSERT INTO enquiries (
        student_name, class_level, board, school_medium, subjects, academic_difficulty,
        tuition_type, preferred_days, preferred_time, sessions_per_week, area, pincode,
        city, parent_name, parent_phone, parent_email, preferred_language, additional_notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      studentName,
      classLevel,
      board,
      schoolMedium,
      subjectsStr,
      academicDifficulty,
      tuitionType,
      preferredDays,
      preferredTime,
      sessionsPerWeek,
      area,
      pincode,
      city,
      parentName,
      parentPhone,
      parentEmail,
      preferredLanguage,
      additionalNotes,
      'NEW'
    );

    const enquiryId = result.lastInsertRowid;

    // Dispatch Admin Notification Email
    const langDisplay = preferredLanguage === 'hi' ? 'हिंदी (Hindi)' : 'English';
    const emailSubject = `NEW PARENT ENQUIRY #${enquiryId} — ${studentName} (${classLevel}, ${board})`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e40af; margin-top: 0;">New Horizon Parent Enquiry #${enquiryId}</h2>
        <p style="background: #fef3c7; color: #92400e; padding: 10px; border-radius: 4px; font-weight: bold;">
          Preferred Contact Language: ${langDisplay}
        </p>

        <h3>Student Profile:</h3>
        <ul>
          <li><strong>Parent:</strong> ${parentName} (${parentPhone})</li>
          <li><strong>Student:</strong> ${studentName}</li>
          <li><strong>Class:</strong> ${classLevel}</li>
          <li><strong>Board:</strong> ${board}</li>
          <li><strong>Subject:</strong> ${subjectsStr}</li>
          <li><strong>Location/Area:</strong> ${area}</li>
          <li><strong>Preferred Language:</strong> ${langDisplay}</li>
          <li><strong>School Medium:</strong> ${schoolMedium}</li>
        </ul>
        
        <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">HORIZON Managed Home Tuition Platform — Admin Notification</p>
      </div>
    `;

    await sendAdminNotification({
      subject: emailSubject,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      enquiryId,
      message: preferredLanguage === 'hi'
        ? 'धन्यवाद! Horizon से संपर्क करने के लिए धन्यवाद। हमारी टीम जल्द ही आपसे संपर्क करेगी।'
        : 'Thank you for contacting Horizon. Our team will contact you shortly.',
    });
  } catch (error: any) {
    console.error('Enquiry API Error:', error);
    return NextResponse.json({ error: 'Failed to process parent enquiry: ' + error.message }, { status: 500 });
  }
}
