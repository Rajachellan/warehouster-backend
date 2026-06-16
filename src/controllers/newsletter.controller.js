const newsletterService = require('../services/newsletter.service');
const asyncHandler = require('../utils/asyncHandler');

exports.subscribe = asyncHandler(async (req, res) => {
  const subscriber = await newsletterService.subscribe(req.body.email);
  res.status(201).json({ success: true, message: 'Subscribed successfully', data: subscriber });
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
