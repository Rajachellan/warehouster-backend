const newsService = require('../services/news.service');
const asyncHandler = require('../utils/asyncHandler');

exports.createNews = asyncHandler(async (req, res) => {
  const article = await newsService.createNews(req.body, req.admin, req);
  res.status(201).json({ success: true, data: article });
});

exports.getNews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  const publicOnly = !req.admin;
  const result = await newsService.getNewsList({ page, limit, status, search, publicOnly });
  res.json({ success: true, ...result });
});

exports.getNewsArticle = asyncHandler(async (req, res) => {
  const publicOnly = !req.admin;
  const article = await newsService.getNewsBySlug(req.params.slug, publicOnly);
  res.json({ success: true, data: article });
});

exports.getNewsById = asyncHandler(async (req, res) => {
  const article = await newsService.getNewsById(req.params.id);
  res.json({ success: true, data: article });
});

exports.updateNews = asyncHandler(async (req, res) => {
  const article = await newsService.updateNews(req.params.id, req.body, req.admin);
  res.json({ success: true, data: article });
});

exports.deleteNews = asyncHandler(async (req, res) => {
  await newsService.deleteNews(req.params.id);
  res.json({ success: true, message: 'News article deleted' });
});
