import { NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';

export async function GET(req: Request) {
  try {
    initDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all';

    if (type === 'enquiries') {
      const enquiries = db.prepare(`SELECT * FROM enquiries ORDER BY id DESC`).all();
      return NextResponse.json({ enquiries });
    }

    if (type === 'tutors') {
      const tutors = db.prepare(`SELECT * FROM tutors ORDER BY id DESC`).all();
      return NextResponse.json({ tutors });
    }

    // Default 'all' dashboard summary
    const enquiries = db.prepare(`SELECT * FROM enquiries ORDER BY id DESC`).all();
    const tutors = db.prepare(`SELECT * FROM tutors ORDER BY id DESC`).all();
    const assessments = db.prepare(`SELECT * FROM assessments ORDER BY id DESC`).all();
    const assignments = db.prepare(`
      SELECT a.*, t.full_name as tutor_name, t.tutor_code, t.phone as tutor_phone
      FROM assignments a
      LEFT JOIN tutors t ON a.tutor_id = t.id
      ORDER BY a.id DESC
    `).all();
    const trials = db.prepare(`SELECT * FROM trial_sessions ORDER BY id DESC`).all();
    const replacements = db.prepare(`SELECT * FROM replacement_requests ORDER BY id DESC`).all();
    const configs = db.prepare(`SELECT * FROM configs`).all();

    const configMap: Record<string, string> = {};
    configs.forEach((c: any) => { configMap[c.key] = c.value; });

    return NextResponse.json({
      enquiries,
      tutors,
      assessments,
      assignments,
      trials,
      replacements,
      configs: configMap,
      stats: {
        totalEnquiries: enquiries.length,
        newEnquiries: enquiries.filter((e: any) => e.status === 'NEW').length,
        totalTutors: tutors.length,
        verifiedTutors: tutors.filter((t: any) => t.verification_status === 'VERIFIED').length,
        activeAssignments: assignments.filter((a: any) => a.status === 'ACTIVE').length,
        pendingTrials: trials.filter((tr: any) => tr.result === 'PENDING').length,
      }
    });
  } catch (error: any) {
    console.error('Admin GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    initDB();
    const body = await req.json();
    const { action } = body;

    if (action === 'update_enquiry_status') {
      const { id, status, notes } = body;
      db.prepare(`UPDATE enquiries SET status = ?, additional_notes = coalesce(?, additional_notes) WHERE id = ?`).run(status, notes, id);
      return NextResponse.json({ success: true, message: `Enquiry #${id} status updated to ${status}` });
    }

    if (action === 'update_tutor_status') {
      const { id, verification_status } = body;
      db.prepare(`UPDATE tutors SET verification_status = ? WHERE id = ?`).run(verification_status, id);
      return NextResponse.json({ success: true, message: `Tutor #${id} verification status updated to ${verification_status}` });
    }

    if (action === 'save_assessment') {
      const { enquiryId, studentName, classLevel, subject, currentLevel, strengths, weaknesses, topicsAttention, recommendations, adminNotes } = body;
      const stmt = db.prepare(`
        INSERT INTO assessments (enquiry_id, student_name, class_level, subject, assessment_date, current_level, strengths, weaknesses, topics_attention, recommendations, admin_notes)
        VALUES (?, ?, ?, ?, DATE('now'), ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(enquiryId || null, studentName, classLevel, subject, currentLevel, strengths, weaknesses, topicsAttention, recommendations, adminNotes);
      
      if (enquiryId) {
        db.prepare(`UPDATE enquiries SET status = 'ASSESSMENT_COMPLETED' WHERE id = ?`).run(enquiryId);
      }
      return NextResponse.json({ success: true, message: 'Student assessment recorded successfully.' });
    }

    if (action === 'create_assignment') {
      const { enquiryId, tutorId, studentName, classLevel, subject, schedule, startDate, packageName, packagePrice, trialDate, trialTime } = body;
      
      const assignStmt = db.prepare(`
        INSERT INTO assignments (enquiry_id, tutor_id, student_name, class_level, subject, schedule, start_date, package_name, package_price, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'MATCHED')
      `);
      const res = assignStmt.run(enquiryId || null, tutorId, studentName, classLevel, subject, schedule, startDate, packageName, packagePrice);
      const assignmentId = res.lastInsertRowid;

      // Also schedule trial session if date provided
      if (trialDate) {
        db.prepare(`
          INSERT INTO trial_sessions (assignment_id, trial_date, trial_time, notes, result)
          VALUES (?, ?, ?, 'Trial scheduled by admin', 'PENDING')
        `).run(assignmentId, trialDate, trialTime || '5:00 PM');
      }

      if (enquiryId) {
        db.prepare(`UPDATE enquiries SET status = 'TRIAL' WHERE id = ?`).run(enquiryId);
      }

      return NextResponse.json({ success: true, assignmentId, message: 'Tutor matched and assignment created.' });
    }

    if (action === 'update_trial') {
      const { trialId, assignmentId, result, parentFeedback, tutorFeedback, notes } = body;
      db.prepare(`
        UPDATE trial_sessions SET result = ?, parent_feedback = ?, tutor_feedback = ?, notes = ? WHERE id = ?
      `).run(result, parentFeedback, tutorFeedback, notes, trialId);

      if (result === 'CONTINUE' && assignmentId) {
        db.prepare(`UPDATE assignments SET status = 'ACTIVE' WHERE id = ?`).run(assignmentId);
      } else if (result === 'CHANGE_TUTOR' && assignmentId) {
        db.prepare(`UPDATE assignments SET status = 'REPLACEMENT_REQUESTED' WHERE id = ?`).run(assignmentId);
        db.prepare(`INSERT INTO replacement_requests (assignment_id, reason, status) VALUES (?, 'Trial feedback requested replacement', 'PENDING')`).run(assignmentId);
      }

      return NextResponse.json({ success: true, message: 'Trial session updated.' });
    }

    if (action === 'update_configs') {
      const { configs } = body;
      const stmt = db.prepare(`INSERT OR REPLACE INTO configs (key, value) VALUES (?, ?)`);
      Object.keys(configs).forEach((key) => {
        stmt.run(key, configs[key]);
      });
      return NextResponse.json({ success: true, message: 'Admin configuration saved.' });
    }

    return NextResponse.json({ error: 'Invalid admin action.' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
