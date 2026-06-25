const { Campaign } = require('../models');
const AppError = require('../utils/AppError');
const { paginate, buildPaginationMeta } = require('../utils/helpers');
const { sendEmail } = require('./email.service');
const { newsletterEmail } = require('../templates/email.templates');
const { getActiveSubscribers, buildUnsubscribeUrl } = require('./newsletter.service');
const logActivity = require('./activityLog.service');

const createCampaign = async (data, admin, req) => {
  const campaign = await Campaign.create({ ...data, createdBy: admin._id });
  await logActivity({
    action: 'create',
    entity: 'campaign',
    entityId: campaign._id,
    description: `Newsletter draft created: ${campaign.title}`,
    performedBy: admin._id,
    req,
  });
  return campaign;
};

const getCampaigns = async ({ page, limit, status }) => {
  const filter = {};
  if (status) filter.status = status;
  const query = Campaign.find(filter).sort({ createdAt: -1 });
  const total = await Campaign.countDocuments(filter);
  const campaigns = await paginate(query, { page, limit });
  return { campaigns, meta: buildPaginationMeta(total, page, limit) };
};

const getCampaignById = async (id) => {
  const campaign = await Campaign.findById(id);
  if (!campaign) throw new AppError('Campaign not found', 404);
  return campaign;
};

const updateCampaign = async (id, data) => {
  const campaign = await Campaign.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!campaign) throw new AppError('Campaign not found', 404);
  return campaign;
};

const deleteCampaign = async (id) => {
  const campaign = await Campaign.findByIdAndDelete(id);
  if (!campaign) throw new AppError('Campaign not found', 404);
  return campaign;
};

const sendTestEmail = async (id, testEmail) => {
  const campaign = await getCampaignById(id);
  const sampleUnsubscribeUrl = buildUnsubscribeUrl('test-token');
  await sendEmail({
    to: testEmail,
    subject: `[TEST] ${campaign.subject}`,
    html: newsletterEmail(campaign.htmlContent, sampleUnsubscribeUrl),
  });
  return { message: 'Test email sent' };
};

const sendCampaign = async (id, admin, req) => {
  const campaign = await getCampaignById(id);
  if (campaign.status === 'sent') {
    throw new AppError('Campaign has already been sent', 400);
  }

  const recipients = await getActiveSubscribers();
  if (!recipients.length) {
    throw new AppError('No active subscribers to send to', 400);
  }

  campaign.status = 'sending';
  await campaign.save();

  const results = { sent: 0, failed: 0, errors: [] };

  for (const recipient of recipients) {
    try {
      const unsubscribeUrl = buildUnsubscribeUrl(recipient.unsubscribeToken);
      const html = newsletterEmail(campaign.htmlContent, unsubscribeUrl);
      const result = await sendEmail({
        to: recipient.email,
        subject: campaign.subject,
        html,
      });
      if (result.sent) results.sent += 1;
      else results.failed += 1;
    } catch (err) {
      results.failed += 1;
      results.errors.push({ email: recipient.email, error: err.message });
    }
  }

  campaign.status = results.failed === recipients.length ? 'failed' : 'sent';
  campaign.recipientsCount = results.sent;
  campaign.sentAt = new Date();
  if (results.failed === recipients.length) {
    campaign.errorMessage = 'All emails failed to send';
  }
  await campaign.save();

  await logActivity({
    action: 'send',
    entity: 'campaign',
    entityId: campaign._id,
    description: `Campaign sent: ${campaign.title} (${results.sent} recipients)`,
    metadata: results,
    performedBy: admin._id,
    req,
  });

  return { campaign, results };
};

const scheduleCampaign = async (id, scheduledAt) => {
  const campaign = await getCampaignById(id);
  if (new Date(scheduledAt) <= new Date()) {
    throw new AppError('Scheduled time must be in the future', 400);
  }
  campaign.scheduledAt = new Date(scheduledAt);
  campaign.status = 'scheduled';
  await campaign.save();
  return campaign;
};

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  sendTestEmail,
  sendCampaign,
  scheduleCampaign,
};
