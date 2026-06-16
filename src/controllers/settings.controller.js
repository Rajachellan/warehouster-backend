const settingsService = require('../services/settings.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettingsByGroup(req.query.group);
  res.json({ success: true, data: settings });
});

exports.getPublicWebsiteInfo = asyncHandler(async (req, res) => {
  const info = await settingsService.getPublicWebsiteInfo();
  res.json({ success: true, data: info });
});

exports.updateSettings = asyncHandler(async (req, res) => {
  const updated = await settingsService.updateSettings(req.body);
  res.json({ success: true, data: updated });
});

exports.updateSettingsBulk = asyncHandler(async (req, res) => {
  const updated = await settingsService.updateSettingsBulk(req.body.settings);
  res.json({ success: true, data: updated });
});
