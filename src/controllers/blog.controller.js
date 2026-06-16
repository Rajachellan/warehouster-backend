const blogService = require('../services/blog.service');
const asyncHandler = require('../utils/asyncHandler');

exports.createBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.createBlog(req.body, req.admin, req);
  res.status(201).json({ success: true, data: blog });
});

exports.getBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search, category } = req.query;
  const publicOnly = !req.admin;
  const result = await blogService.getBlogs({ page, limit, status, search, category, publicOnly });
  res.json({ success: true, ...result });
});

exports.getBlog = asyncHandler(async (req, res) => {
  const publicOnly = !req.admin;
  const blog = await blogService.getBlogBySlug(req.params.slug, publicOnly);
  res.json({ success: true, data: blog });
});

exports.getBlogById = asyncHandler(async (req, res) => {
  const blog = await blogService.getBlogById(req.params.id);
  res.json({ success: true, data: blog });
});

exports.updateBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.updateBlog(req.params.id, req.body, req.admin, req);
  res.json({ success: true, data: blog });
});

exports.deleteBlog = asyncHandler(async (req, res) => {
  await blogService.deleteBlog(req.params.id);
  res.json({ success: true, message: 'Blog deleted' });
});
