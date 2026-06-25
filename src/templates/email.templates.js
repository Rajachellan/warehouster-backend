const baseLayout = (content, { unsubscribeUrl } = {}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #F5F0E8; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #0A1E46; padding: 24px 32px; text-align: center; }
    .header h1 { color: #B89650; margin: 0; font-size: 22px; letter-spacing: 2px; }
    .body { padding: 32px; color: #0A1E46; line-height: 1.6; }
    .footer { background: #F5F0E8; padding: 20px 32px; text-align: center; font-size: 12px; color: #6B7280; }
    .btn { display: inline-block; background: #0A1E46; color: #ffffff !important; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 16px; }
    .btn-unsub { display: inline-block; background: #6B7280; color: #ffffff !important; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold; margin-top: 12px; }
    .highlight { color: #B89650; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    td { padding: 8px 0; border-bottom: 1px solid #EDE8DC; }
    td:first-child { font-weight: bold; color: #6B7280; width: 140px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>WAREHOUSTER</h1></div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Warehouster. All rights reserved.</p>
      <p>3rd Floor, 17, 3rd Cross Street East, Shenoy Nagar, Chennai 600030</p>
      ${
        unsubscribeUrl
          ? `<p style="margin-top:16px;">
        <a href="${unsubscribeUrl}" class="btn-unsub">Unsubscribe</a>
      </p>
      <p style="margin-top:8px;font-size:11px;">You will no longer receive newsletter emails from Warehouster.</p>`
          : ''
      }
    </div>
  </div>
</body>
</html>
`;

const leadAdminNotification = (lead) =>
  baseLayout(`
    <h2 style="color:#0A1E46;">New Lead Received</h2>
    <p>A new inquiry has been submitted via the contact form.</p>
    <table>
      <tr><td>Name</td><td>${lead.name}</td></tr>
      <tr><td>Email</td><td>${lead.email}</td></tr>
      <tr><td>Phone</td><td>${lead.phone}</td></tr>
      <tr><td>Inquiry Type</td><td>${lead.inquiryType}</td></tr>
      <tr><td>Message</td><td>${lead.message}</td></tr>
    </table>
    <p>Please review and respond within 24 hours.</p>
  `);

const leadConfirmation = (name) =>
  baseLayout(`
    <h2 style="color:#0A1E46;">Thank you for contacting Warehouster</h2>
    <p>Dear <span class="highlight">${name}</span>,</p>
    <p>We have received your inquiry and our team will get back to you within <strong>24 hours</strong>.</p>
    <p>In the meantime, feel free to explore our latest projects and insights on our website.</p>
    <p>Best regards,<br><strong>The Warehouster Team</strong></p>
  `);

const welcomeEmail = (email, unsubscribeUrl) =>
  baseLayout(
    `
    <h2 style="color:#0A1E46;">Welcome to Warehouster Insights</h2>
    <p>Thank you for subscribing to our newsletter at <span class="highlight">${email}</span>.</p>
    <p>You'll receive the latest updates on industrial warehousing, market trends, and strategic intelligence directly in your inbox.</p>
    <p>We're excited to have you with us!</p>
    <p>Best regards,<br><strong>The Warehouster Team</strong></p>
  `,
    { unsubscribeUrl }
  );

const newsletterEmail = (htmlContent, unsubscribeUrl) =>
  baseLayout(htmlContent, { unsubscribeUrl });

const resetPasswordEmail = (name, resetUrl) =>
  baseLayout(`
    <h2 style="color:#0A1E46;">Reset Your Password</h2>
    <p>Hi <span class="highlight">${name}</span>,</p>
    <p>We received a request to reset your admin panel password. Click the button below to set a new password. This link expires in 1 hour.</p>
    <a href="${resetUrl}" class="btn">Reset Password</a>
    <p style="margin-top:24px;font-size:13px;color:#6B7280;">If you didn't request this, you can safely ignore this email.</p>
  `);

module.exports = {
  leadAdminNotification,
  leadConfirmation,
  welcomeEmail,
  newsletterEmail,
  resetPasswordEmail,
};
