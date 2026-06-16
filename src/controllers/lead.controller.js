const leadService = require('../services/lead.service');
const asyncHandler = require('../utils/asyncHandler');

exports.createLead = asyncHandler(async (req, res) => {
  const lead = await leadService.createLead(req.body);
  res.status(201).json({ success: true, message: 'Inquiry submitted successfully', data: lead });
});

exports.getLeads = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status } = req.query;
  const result = await leadService.getLeads({ page, limit, search, status });
  res.json({ success: true, ...result });
});

exports.getLead = asyncHandler(async (req, res) => {
  const lead = await leadService.getLeadById(req.params.id);
  res.json({ success: true, data: lead });
});

exports.updateLead = asyncHandler(async (req, res) => {
  const lead = await leadService.updateLead(req.params.id, req.body, req.admin, req);
  res.json({ success: true, data: lead });
});

exports.exportLeads = asyncHandler(async (req, res) => {
  const csv = await leadService.exportLeadsCSV({ status: req.query.status });
  res.header('Content-Type', 'text/csv');
  res.attachment('leads.csv');
  res.send(csv);
});
