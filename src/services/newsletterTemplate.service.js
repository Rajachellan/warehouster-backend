const DEFAULT_TEMPLATES = [
  {
    name: 'Monthly Market Update',
    description: 'Share warehousing trends and market insights with subscribers.',
    subject: 'Warehouster Insights — Monthly Market Update',
    htmlContent: `<h2 style="color:#0A1E46;margin-top:0;">Industrial Market Update</h2>
<p>Dear subscriber,</p>
<p>Here is your monthly snapshot of India's warehousing and industrial real estate landscape.</p>
<ul>
  <li><strong>Demand:</strong> Grade-A warehouse uptake remains strong across key corridors.</li>
  <li><strong>Rentals:</strong> Stable pricing with selective premium for ready-to-move assets.</li>
  <li><strong>Outlook:</strong> E-commerce and 3PL continue to drive absorption.</li>
</ul>
<p>Explore our latest projects and insights on the Warehouster website.</p>
<p>Best regards,<br><strong>The Warehouster Team</strong></p>`,
  },
  {
    name: 'New Blog Announcement',
    description: 'Notify subscribers when you publish a new blog article.',
    subject: 'New on Warehouster — Latest Industrial Intelligence',
    htmlContent: `<h2 style="color:#0A1E46;margin-top:0;">Fresh Insight Published</h2>
<p>We've just published a new article you may find valuable:</p>
<p style="font-size:18px;font-weight:bold;color:#B89650;">[Your blog title here]</p>
<p>[Short summary of the article — replace this text before sending.]</p>
<p><a href="https://warehouster.com/blogs" style="color:#0A1E46;font-weight:bold;">Read the full article →</a></p>
<p>Stay ahead with strategic warehousing intelligence from Warehouster.</p>`,
  },
  {
    name: 'Project Spotlight',
    description: 'Highlight a warehouse project or development update.',
    subject: 'Warehouster Project Spotlight',
    htmlContent: `<h2 style="color:#0A1E46;margin-top:0;">Project Spotlight</h2>
<p>Dear subscriber,</p>
<p>We're excited to share an update from our industrial portfolio:</p>
<p style="background:#F5F0E8;padding:16px;border-radius:8px;">
  <strong>[Project name]</strong><br>
  [Location] · [Key specs — e.g. 200,000 sq.ft. Grade-A warehouse]
</p>
<p>[2–3 sentences about the project, tenant fit, or availability.]</p>
<p>Interested in a site visit or leasing discussion? Reply to this email or contact our team.</p>
<p>Regards,<br><strong>Warehouster Development Team</strong></p>`,
  },
];

const ensureDefaultTemplates = async () => {
  const { NewsletterTemplate } = require('../models');
  const count = await NewsletterTemplate.countDocuments();
  if (count > 0) return;

  await NewsletterTemplate.insertMany(
    DEFAULT_TEMPLATES.map((t) => ({
      ...t,
      createdBy: null,
    }))
  );
};

const getTemplates = async () => {
  await ensureDefaultTemplates();
  const { NewsletterTemplate } = require('../models');
  return NewsletterTemplate.find().sort({ createdAt: -1 }).lean();
};

const createTemplate = async (data, admin) => {
  const { NewsletterTemplate } = require('../models');
  return NewsletterTemplate.create({ ...data, createdBy: admin._id });
};

const updateTemplate = async (id, data) => {
  const { NewsletterTemplate } = require('../models');
  const AppError = require('../utils/AppError');
  const template = await NewsletterTemplate.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!template) throw new AppError('Template not found', 404);
  return template;
};

const deleteTemplate = async (id) => {
  const { NewsletterTemplate } = require('../models');
  const AppError = require('../utils/AppError');
  const template = await NewsletterTemplate.findByIdAndDelete(id);
  if (!template) throw new AppError('Template not found', 404);
  return template;
};

module.exports = {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
