import { NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';
import { sendAdminNotification } from '@/lib/email';

export async function POST(req: Request) {
  try {
    initDB();
    const body = await req.json();

    const {
      fullName,
      phone,
      email,
      photoUrl = '',
      highestQualification,
      college,
      graduationYear = new Date().getFullYear(),
      subjects,
      classes,
      boards,
      experienceYears = 0,
      city = 'Delhi NCR',
      area,
      pincode = '',
      availableDays = 'All Days',
      availableTime = 'Flexible',
      expectedCompensation = '',
      experienceDescription = '',
      whyHorizon = '',
    } = body;

    if (!fullName || !phone || !email || !highestQualification || !college || !area) {
      return NextResponse.json(
        { error: 'Please fill in all mandatory tutor registration fields.' },
        { status: 400 }
      );
    }

    const tutorCode = `HZN-${Math.floor(1000 + Math.random() * 9000)}`;
    const subjectsStr = Array.isArray(subjects) ? subjects.join(', ') : subjects || '';
    const classesStr = Array.isArray(classes) ? classes.join(', ') : classes || '';
    const boardsStr = Array.isArray(boards) ? boards.join(', ') : boards || '';

    const stmt = db.prepare(`
      INSERT INTO tutors (
        tutor_code, full_name, phone, email, photo_url, highest_qualification,
        college, graduation_year, subjects, classes, boards, experience_years,
        city, area, pincode, available_days, available_time, expected_compensation,
        experience_description, why_horizon, verification_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      tutorCode,
      fullName,
      phone,
      email,
      photoUrl,
      highestQualification,
      college,
      Number(graduationYear),
      subjectsStr,
      classesStr,
      boardsStr,
      Number(experienceYears),
      city,
      area,
      pincode,
      availableDays,
      availableTime,
      expectedCompensation,
      experienceDescription,
      whyHorizon,
      'APPLIED'
    );

    const tutorId = result.lastInsertRowid;

    // Send email notification
    await sendAdminNotification({
      subject: `NEW TUTOR APPLICATION — ${fullName} (${tutorCode})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #059669; margin-top: 0;">New Tutor Application: ${tutorCode}</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Phone:</strong> ${phone} | <strong>Email:</strong> ${email}</p>
          <p><strong>Qualification:</strong> ${highestQualification} (${college}, ${graduationYear})</p>
          <p><strong>Subjects:</strong> ${subjectsStr}</p>
          <p><strong>Classes:</strong> ${classesStr} | <strong>Boards:</strong> ${boardsStr}</p>
          <p><strong>Location:</strong> ${area}, ${city} (${pincode})</p>
          <p><strong>Experience:</strong> ${experienceYears} Years</p>
          <p><strong>Expected Compensation:</strong> ${expectedCompensation || 'Not specified'}</p>
          <hr/>
          <p style="font-size: 12px; color: #64748b;">Review and verify in Horizon Admin Panel: /admin</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      tutorId,
      tutorCode,
      message: 'Application submitted successfully. Horizon team will review your application soon.',
    });
  } catch (error: any) {
    console.error('Tutor Application API Error:', error);
    return NextResponse.json({ error: 'Failed to submit tutor application: ' + error.message }, { status: 500 });
  }
}
