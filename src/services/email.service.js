const nodemailer = require('nodemailer');
const config = require('../config');
const { Settings } = require('../models');

let cachedTransporter = null;

const getSmtpSettings = async () => {
  const keys = ['smtp_host', 'smtp_port', 'smtp_secure', 'smtp_user', 'smtp_pass', 'smtp_from_name', 'smtp_from_email'];
  const settings = await Settings.find({ key: { $in: keys } });
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return {
    host: map.smtp_host || config.smtp.host,
    port: map.smtp_port || config.smtp.port,
    secure: map.smtp_secure ?? config.smtp.secure,
    user: map.smtp_user || config.smtp.user,
    pass: map.smtp_pass || config.smtp.pass,
    fromName: map.smtp_from_name || config.smtp.fromName,
    fromEmail: map.smtp_from_email || config.smtp.fromEmail,
  };
};

const getTransporter = async () => {
  const smtp = await getSmtpSettings();
  if (!smtp.user || !smtp.pass) {
    return null;
  }
  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  const smtp = await getSmtpSettings();
  const transporter = await getTransporter();

  if (!transporter) {
    console.warn('Email not sent — SMTP not configured:', subject);
    return { sent: false, reason: 'SMTP not configured' };
  }

  const info = await transporter.sendMail({
    from: `"${smtp.fromName}" <${smtp.fromEmail}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  });

  return { sent: true, messageId: info.messageId };
};

const sendBulkEmail = async (recipients, { subject, html }) => {
  const results = { sent: 0, failed: 0, errors: [] };

  for (const email of recipients) {
    try {
      const result = await sendEmail({ to: email, subject, html });
      if (result.sent) results.sent += 1;
      else results.failed += 1;
    } catch (err) {
      results.failed += 1;
      results.errors.push({ email, error: err.message });
    }
  }

  return results;
};

module.exports = { sendEmail, sendBulkEmail, getSmtpSettings };
