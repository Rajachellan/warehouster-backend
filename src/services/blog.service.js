const { Blog } = require('../models');
const AppError = require('../utils/AppError');
const { generateSlug, paginate, buildPaginationMeta } = require('../utils/helpers');
const logActivity = require('./activityLog.service');

const ensureUniqueSlug = async (slug, excludeId = null) => {
  let uniqueSlug = slug;
  let counter = 1;
  const filter = { slug: uniqueSlug };
  if (excludeId) filter._id = { $ne: excludeId };

  while (await Blog.findOne(filter)) {
    uniqueSlug = `${slug}-${counter}`;
    filter.slug = uniqueSlug;
    counter += 1;
  }
  return uniqueSlug;
};

const createBlog = async (data, admin, req) => {
  const slug = await ensureUniqueSlug(data.slug || generateSlug(data.title));
  const blog = await Blog.create({
    ...data,
    slug,
    createdBy: admin._id,
    publishedAt: data.status === 'published' ? new Date() : undefined,
  });

  await logActivity({
    action: 'create',
    entity: 'blog',
    entityId: blog._id,
    description: `Blog created: ${blog.title}`,
    performedBy: admin._id,
    req,
  });

  return blog;
};

const getBlogs = async ({ page, limit, status, search, category, publicOnly = false }) => {
  const filter = {};
  if (publicOnly) filter.status = 'published';
  else if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
  }

  const query = Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 });
  const total = await Blog.countDocuments(filter);
  const blogs = await paginate(query, { page, limit });

  return { blogs, meta: buildPaginationMeta(total, page, limit) };
};

const getBlogBySlug = async (slug, publicOnly = false) => {
  const filter = { slug };
  if (publicOnly) filter.status = 'published';
  const blog = await Blog.findOne(filter);
  if (!blog) throw new AppError('Blog not found', 404);
  return blog;
};

const getBlogById = async (id) => {
  const blog = await Blog.findById(id);
  if (!blog) throw new AppError('Blog not found', 404);
  return blog;
};

const updateBlog = async (id, data, admin, req) => {
  const blog = await Blog.findById(id);
  if (!blog) throw new AppError('Blog not found', 404);

  if (data.title && !data.slug) {
    data.slug = await ensureUniqueSlug(generateSlug(data.title), id);
  } else if (data.slug) {
    data.slug = await ensureUniqueSlug(data.slug, id);
  }

  if (data.status === 'published' && blog.status !== 'published') {
    data.publishedAt = new Date();
  }

  Object.assign(blog, data);
  await blog.save();
  return blog;
};

const deleteBlog = async (id) => {
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new AppError('Blog not found', 404);
  return blog;
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
};
