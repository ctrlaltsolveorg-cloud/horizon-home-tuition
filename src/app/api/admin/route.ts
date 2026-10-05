import { NextResponse } from 'next/server';
import { supabase, isUUID } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all';

    if (type === 'enquiries') {
      const { data: enquiries, error } = await supabase
        .from('student_enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json({ enquiries: enquiries || [] });
    }

    if (type === 'tutors') {
      const { data: tutors, error } = await supabase
        .from('tutor_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json({ tutors: tutors || [] });
    }

    // Default dashboard summary directly from online Supabase PostgreSQL
    const [enquiriesRes, tutorsRes, assignmentsRes, reportCardsRes] = await Promise.all([
      supabase.from('student_enquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('tutor_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('student_assignments').select('*').order('created_at', { ascending: false }),
      supabase.from('monthly_report_cards').select('*').order('created_at', { ascending: false })
    ]);

    const enquiries = enquiriesRes.data || [];
    const tutors = (tutorsRes.data || []).map((t: any) => ({
      ...t,
      verification_status: t.is_verified ? 'VERIFIED' : 'PENDING'
    }));
    const assignments = assignmentsRes.data || [];
    const reportCards = reportCardsRes.data || [];

    return NextResponse.json({
      enquiries,
      tutors,
      assignments,
      reportCards,
      stats: {
        totalEnquiries: enquiries.length,
        newEnquiries: enquiries.filter((e: any) => e.status === 'pending' || e.status === 'NEW').length,
        totalTutors: tutors.length,
        verifiedTutors: tutors.filter((t: any) => t.is_verified === true).length,
        activeAssignments: assignments.filter((a: any) => a.status === 'active' || a.status === 'ACTIVE').length
      }
    });
  } catch (error: any) {
    console.error('Admin GET Supabase Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. Update Tutor Verification Status directly in Supabase
    if (action === 'update_tutor_status') {
      const { id, verification_status } = body;
      const isVerified = (verification_status || '').toUpperCase() === 'VERIFIED';

      let updateQuery = supabase
        .from('tutor_profiles')
        .update({
          is_verified: isVerified,
          rating: isVerified ? 5.0 : null,
          updated_at: new Date().toISOString()
        });

      if (isUUID(id)) {
        updateQuery = updateQuery.or(`id.eq.${id},user_id.eq.${id}`);
      } else {
        updateQuery = updateQuery.ilike('email', id);
      }

      const { data, error } = await updateQuery.select();

      if (error) throw error;
      return NextResponse.json({
        success: true,
        data,
        message: `Tutor verification status successfully updated to ${verification_status} in online Supabase database.`
      });
    }

    // 2. Update Enquiry Status directly in Supabase
    if (action === 'update_enquiry_status') {
      const { id, status, notes } = body;
      const { data, error } = await supabase
        .from('student_enquiries')
        .update({
          status,
          notes: notes || undefined
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, data, message: `Enquiry #${id} updated to ${status}` });
    }

    // 3. Assign Tutor to Student Enquiry directly in Supabase
    if (action === 'create_assignment') {
      const { enquiryId, tutorId, studentName, classLevel, monthlyFee } = body;
      
      // Update student_enquiries
      if (enquiryId) {
        await supabase
          .from('student_enquiries')
          .update({
            assigned_teacher_id: tutorId,
            test_status: 'Tutor Assigned • Active'
          })
          .eq('id', enquiryId);
      }

      // Insert into student_assignments
      const { data, error } = await supabase
        .from('student_assignments')
        .insert([{
          tutor_id: tutorId,
          student_name: studentName,
          class_grade: classLevel || 'Class 9',
          subjects: 'Complete Board Syllabus',
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
          monthly_fee: monthlyFee || 4500,
          location: 'Purnia'
        }])
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data, message: 'Assignment successfully created in online Supabase.' });
    }

    return NextResponse.json({ error: 'Invalid admin action.' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin POST Supabase Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
