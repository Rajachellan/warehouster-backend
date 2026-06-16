const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getStats = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardStats();
  res.json({ success: true, data });
});

exports.getLeadChart = asyncHandler(async (req, res) => {
  const data = await dashboardService.getLeadConversionChart();
  res.json({ success: true, data });
});

exports.getSubscriberChart = asyncHandler(async (req, res) => {
  const data = await dashboardService.getMonthlySubscriberChart();
  res.json({ success: true, data });
});

exports.getActivityLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, entity, action } = req.query;
  const result = await dashboardService.getActivityLogs({ page, limit, entity, action });
  res.json({ success: true, ...result });
});
