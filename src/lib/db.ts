import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.VERCEL
  ? path.join('/tmp', 'horizon.db')
  : path.join(process.cwd(), 'horizon.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS configs (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS parents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      preferred_language TEXT DEFAULT 'en',
      area TEXT,
      pincode TEXT,
      city TEXT DEFAULT 'Delhi NCR',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER,
      name TEXT NOT NULL,
      class TEXT NOT NULL,
      board TEXT NOT NULL,
      school_medium TEXT DEFAULT 'English',
      subjects TEXT NOT NULL,
      academic_difficulty TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      class_level TEXT NOT NULL,
      board TEXT NOT NULL,
      school_medium TEXT DEFAULT 'English',
      subjects TEXT NOT NULL,
      academic_difficulty TEXT,
      tuition_type TEXT DEFAULT 'Home Tuition',
      preferred_days TEXT,
      preferred_time TEXT,
      sessions_per_week TEXT,
      area TEXT NOT NULL,
      pincode TEXT,
      city TEXT DEFAULT 'Delhi NCR',
      parent_name TEXT NOT NULL,
      parent_phone TEXT NOT NULL,
      parent_email TEXT,
      preferred_language TEXT DEFAULT 'en',
      additional_notes TEXT,
      status TEXT DEFAULT 'NEW',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tutors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tutor_code TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      photo_url TEXT,
      highest_qualification TEXT NOT NULL,
      college TEXT NOT NULL,
      graduation_year INTEGER,
      subjects TEXT NOT NULL,
      classes TEXT NOT NULL,
      boards TEXT NOT NULL,
      experience_years INTEGER DEFAULT 0,
      city TEXT NOT NULL,
      area TEXT NOT NULL,
      pincode TEXT,
      available_days TEXT,
      available_time TEXT,
      expected_compensation TEXT,
      experience_description TEXT,
      why_horizon TEXT,
      verification_status TEXT DEFAULT 'APPLIED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tutor_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tutor_id INTEGER NOT NULL,
      doc_type TEXT NOT NULL,
      doc_name TEXT NOT NULL,
      doc_url TEXT NOT NULL,
      verified_status TEXT DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enquiry_id INTEGER,
      student_name TEXT NOT NULL,
      class_level TEXT NOT NULL,
      subject TEXT NOT NULL,
      assessment_date TEXT,
      current_level TEXT,
      strengths TEXT,
      weaknesses TEXT,
      topics_attention TEXT,
      recommendations TEXT,
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enquiry_id INTEGER,
      tutor_id INTEGER NOT NULL,
      student_name TEXT NOT NULL,
      class_level TEXT NOT NULL,
      subject TEXT NOT NULL,
      schedule TEXT,
      start_date TEXT,
      package_name TEXT DEFAULT 'Horizon Standard Managed',
      package_price TEXT DEFAULT '₹6,000 / month',
      status TEXT DEFAULT 'MATCHED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS trial_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assignment_id INTEGER NOT NULL,
      trial_date TEXT NOT NULL,
      trial_time TEXT NOT NULL,
      notes TEXT,
      parent_feedback TEXT,
      tutor_feedback TEXT,
      result TEXT DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS progress_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assignment_id INTEGER NOT NULL,
      report_date TEXT NOT NULL,
      topics_covered TEXT,
      strengths TEXT,
      weak_areas TEXT,
      homework_status TEXT,
      attendance TEXT,
      tutor_comments TEXT,
      next_focus TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS replacement_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assignment_id INTEGER NOT NULL,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      replacement_tutor_id INTEGER,
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE
    );
  `);

  // Default configs matching the user card design: +91 9162162128 & Ctrl.alt.solve.org@gmail.com
  const setConfig = db.prepare(`INSERT OR REPLACE INTO configs (key, value) VALUES (?, ?)`);
  setConfig.run('horizon_phone', '+91 9162162128');
  setConfig.run('whatsapp_number', '+91 9162162128');
  setConfig.run('admin_email', 'Ctrl.alt.solve.org@gmail.com');
  setConfig.run('service_areas', 'Delhi NCR, South Delhi, Gurgaon, Noida, West Delhi, North Delhi');
  setConfig.run('pricing_starting', '₹4,500 / month');

  // Default admin user (username: admin, password: horizon123#password)
  const setUser = db.prepare(`INSERT OR IGNORE INTO users (id, username, password, role) VALUES (1, 'admin', 'horizon123#password', 'admin')`);
  setUser.run();

  // Seed sample tutors if empty
  const tutorCount = (db.prepare(`SELECT COUNT(*) as count FROM tutors`).get() as any).count;
  if (tutorCount === 0) {
    const insertTutor = db.prepare(`
      INSERT INTO tutors (
        tutor_code, full_name, phone, email, photo_url, highest_qualification,
        college, graduation_year, subjects, classes, boards, experience_years,
        city, area, pincode, available_days, available_time, expected_compensation,
        experience_description, why_horizon, verification_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertTutor.run(
      'HZN-1024',
      'Rahul Kumar',
      '+91 98112 34567',
      'rahul.kumar@example.com',
      '/tutors/rahul.jpg',
      'B.Sc. Mathematics (Hons)',
      'Delhi University (Hindu College)',
      2022,
      'Mathematics, Physics',
      'Classes 8–10, Classes 11–12',
      'CBSE, ICSE',
      3,
      'New Delhi',
      'South Extension / Lajpat Nagar',
      '110024',
      'Mon-Fri',
      '4:00 PM - 8:00 PM',
      '₹600 / hour',
      'Taught 30+ students in board classes with 90%+ average score in Mathematics.',
      'Horizon provides structured parent communication and genuine student opportunities.',
      'VERIFIED'
    );

    insertTutor.run(
      'HZN-1025',
      'Priya Sharma',
      '+91 98765 12345',
      'priya.sharma@example.com',
      '/tutors/priya.jpg',
      'M.Sc. Chemistry',
      'IIT Delhi',
      2021,
      'Chemistry, Science',
      'Classes 9–10, Classes 11–12',
      'CBSE, ICSE, State Board',
      4,
      'Gurgaon',
      'DLF Phase 4 / Sector 56',
      '122002',
      'All Days',
      '3:00 PM - 7:00 PM',
      '₹750 / hour',
      'Specialized in Board Exam prep and conceptual chemistry for Class 11-12.',
      'Appreciate Horizon managed support and tutor replacement protection.',
      'VERIFIED'
    );
  }
}

export default db;
