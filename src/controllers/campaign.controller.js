const campaignService = require('../services/campaign.service');
const asyncHandler = require('../utils/asyncHandler');

exports.createCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.createCampaign(req.body, req.admin);
  res.status(201).json({ success: true, data: campaign });
});

exports.getCampaigns = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const result = await campaignService.getCampaigns({ page, limit, status });
  res.json({ success: true, ...result });
});

exports.getCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.getCampaignById(req.params.id);
  res.json({ success: true, data: campaign });
});

exports.updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.updateCampaign(req.params.id, req.body);
  res.json({ success: true, data: campaign });
});

exports.deleteCampaign = asyncHandler(async (req, res) => {
  await campaignService.deleteCampaign(req.params.id);
  res.json({ success: true, message: 'Campaign deleted' });
});

exports.sendTest = asyncHandler(async (req, res) => {
  const result = await campaignService.sendTestEmail(req.params.id, req.body.email);
  res.json({ success: true, ...result });
});

exports.sendCampaign = asyncHandler(async (req, res) => {
  const result = await campaignService.sendCampaign(req.params.id, req.admin, req);
  res.json({ success: true, data: result });
});

exports.scheduleCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.scheduleCampaign(req.params.id, req.body.scheduledAt);
  res.json({ success: true, data: campaign });
});
