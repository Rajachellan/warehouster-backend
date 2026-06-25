const newsletterService = require('../services/newsletter.service');
const templateService = require('../services/newsletterTemplate.service');
const asyncHandler = require('../utils/asyncHandler');
exports.subscribe = asyncHandler(async (req, res) => {
  const subscriber = await newsletterService.subscribe(req.body.email);
  res.status(201).json({ success: true, message: 'Subscribed successfully', data: subscriber });
});

exports.unsubscribe = asyncHandler(async (req, res) => {
  const token = req.body.token || req.query.token;
  const result = await newsletterService.unsubscribeByToken(token);
  res.json({
    success: true,
    message: result.alreadyUnsubscribed
      ? 'You are already unsubscribed'
      : 'You have been unsubscribed successfully',
    data: { email: result.email },
  });
});

exports.getSubscribers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  const result = await newsletterService.getSubscribers({ page, limit, status, search });
  res.json({ success: true, ...result });
});

exports.exportSubscribers = asyncHandler(async (req, res) => {
  const csv = await newsletterService.exportSubscribersCSV();
  res.header('Content-Type', 'text/csv');
  res.attachment('subscribers.csv');
  res.send(csv);
});

exports.importSubscribers = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'CSV file is required' });
  }
  const result = await newsletterService.importSubscribersCSV(req.file.buffer);
  res.json({ success: true, data: result });
});

exports.getSummary = asyncHandler(async (req, res) => {
  const summary = await newsletterService.getSubscriberSummary();
  res.json({ success: true, data: summary });
});

exports.getTemplates = asyncHandler(async (req, res) => {
  const templates = await templateService.getTemplates();
  res.json({ success: true, data: templates });
});

exports.createTemplate = asyncHandler(async (req, res) => {
  const template = await templateService.createTemplate(req.body, req.admin);
  const logActivity = require('../services/activityLog.service');
  await logActivity({
    action: 'create',
    entity: 'newsletter_template',
    entityId: template._id,
    description: `Newsletter template created: ${template.name}`,
    performedBy: req.admin._id,
    req,
  });
  res.status(201).json({ success: true, data: template });
});

exports.updateTemplate = asyncHandler(async (req, res) => {
  const template = await templateService.updateTemplate(req.params.id, req.body);
  const logActivity = require('../services/activityLog.service');
  await logActivity({
    action: 'update',
    entity: 'newsletter_template',
    entityId: template._id,
    description: `Newsletter template updated: ${template.name}`,
    performedBy: req.admin._id,
    req,
  });
  res.json({ success: true, data: template });
});

exports.deleteTemplate = asyncHandler(async (req, res) => {
  const template = await templateService.deleteTemplate(req.params.id);
  const logActivity = require('../services/activityLog.service');
  await logActivity({
    action: 'delete',
    entity: 'newsletter_template',
    entityId: template._id,
    description: `Newsletter template deleted: ${template.name}`,
    performedBy: req.admin._id,
    req,
  });
  res.json({ success: true, message: 'Template deleted' });
});
