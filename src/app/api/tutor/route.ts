import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendAdminNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      phone,
      email,
      highestQualification,
      college,
      subjects,
      classes,
      boards,
      experienceYears = '1+ years',
      city = 'Purnia',
      mediumPreference = 'Hindi / English',
      bioAndNotes = '',
      expectedCompensation = ''
    } = body;

    if (!fullName || !phone || !email) {
      return NextResponse.json(
        { error: 'Please fill in all mandatory tutor registration fields.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const subjectsArray = Array.isArray(subjects) ? subjects : (subjects ? subjects.split(',').map((s: string) => s.trim()) : ['Mathematics', 'Science']);

    // Insert directly into Supabase online PostgreSQL table tutor_profiles
    const { data: newTutor, error } = await supabase
      .from('tutor_profiles')
      .upsert({
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: cleanEmail,
        college: college || 'PCE PURNIA',
        degree_status: highestQualification || 'Degree / Qualification',
        experience_years: `${experienceYears} years experience`,
        medium_preference: mediumPreference,
        subjects: subjectsArray,
        classes_handled: Array.isArray(classes) ? classes.join(', ') : classes,
        bio_and_custom_notes: bioAndNotes,
        city: city,
        is_verified: false,
        rating: 5.0,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' })
      .select()
      .single();

    if (error) {
      // Fallback insert without onConflict
      await supabase.from('tutor_profiles').insert([{
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: cleanEmail,
        college: college || 'PCE PURNIA',
        degree_status: highestQualification || 'Degree / Qualification',
        experience_years: `${experienceYears} years experience`,
        medium_preference: mediumPreference,
        subjects: subjectsArray,
        city: city,
        is_verified: false,
        rating: 5.0
      }]);
    }

    // Send email notification to Admin
    try {
      await sendAdminNotification({
        subject: `NEW TUTOR APPLICATION — ${fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #059669; margin-top: 0;">New Tutor Registered: ${fullName}</h2>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Phone:</strong> ${phone} | <strong>Email:</strong> ${cleanEmail}</p>
            <p><strong>Qualification:</strong> ${highestQualification} (${college})</p>
            <p><strong>Subjects:</strong> ${subjectsArray.join(', ')}</p>
            <p><strong>Medium:</strong> ${mediumPreference} | <strong>City:</strong> ${city}</p>
            <hr/>
            <p style="font-size: 12px; color: #64748b;">Verify this tutor directly in the Horizon Admin Panel: /admin</p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.warn('Email notice warning:', mailErr);
    }

    return NextResponse.json({
      success: true,
      tutor: newTutor,
      message: 'Application submitted successfully to Horizon Supabase database. Admin will review and verify your profile soon.',
    });
  } catch (error: any) {
    console.error('Tutor Application API Error:', error);
    return NextResponse.json({ error: 'Failed to submit tutor application: ' + error.message }, { status: 500 });
  }
}
