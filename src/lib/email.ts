import nodemailer from 'nodemailer';

interface EmailData {
  subject: string;
  html: string;
  text?: string;
}

export async function sendAdminNotification(data: EmailData) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@horizontuitions.com';

  console.log(`[EMAIL DISPATCH] Subject: "${data.subject}" to ${adminEmail}`);

  if (!host || !user || !pass) {
    console.log('[EMAIL NOTICE] SMTP credentials not set. Logging email content to console:');
    console.log('--- EMAIL CONTENT START ---');
    console.log(data.html.replace(/<[^>]+>/g, ' '));
    console.log('--- EMAIL CONTENT END ---');
    return { success: true, mode: 'simulated' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"HORIZON System" <${user}>`,
      to: adminEmail,
      subject: data.subject,
      text: data.text || data.html.replace(/<[^>]+>/g, ' '),
      html: data.html,
    });

    return { success: true, mode: 'smtp' };
  } catch (err) {
    console.error('[EMAIL ERROR] Failed to send email:', err);
    return { success: false, error: err };
  }
}
