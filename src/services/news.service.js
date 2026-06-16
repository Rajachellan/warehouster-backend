const { News } = require('../models');
const AppError = require('../utils/AppError');
const { generateSlug, paginate, buildPaginationMeta } = require('../utils/helpers');
const logActivity = require('./activityLog.service');

const ensureUniqueSlug = async (slug, excludeId = null) => {
  let uniqueSlug = slug;
  let counter = 1;
  const filter = { slug: uniqueSlug };
  if (excludeId) filter._id = { $ne: excludeId };

  while (await News.findOne(filter)) {
    uniqueSlug = `${slug}-${counter}`;
    filter.slug = uniqueSlug;
    counter += 1;
  }
  return uniqueSlug;
};

const createNews = async (data, admin, req) => {
  const slug = await ensureUniqueSlug(data.slug || generateSlug(data.title));
  const article = await News.create({
    ...data,
    slug,
    createdBy: admin._id,
    publishedAt: data.status === 'published' ? new Date() : undefined,
  });

  await logActivity({
    action: 'create',
    entity: 'news',
    entityId: article._id,
    description: `News created: ${article.title}`,
    performedBy: admin._id,
    req,
  });

  return article;
};

const getNewsList = async ({ page, limit, status, search, publicOnly = false }) => {
  const filter = {};
  if (publicOnly) filter.status = 'published';
  else if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
  }

  const query = News.find(filter).sort({ publishedAt: -1, createdAt: -1 });
  const total = await News.countDocuments(filter);
  const articles = await paginate(query, { page, limit });

  return { news: articles, meta: buildPaginationMeta(total, page, limit) };
};

const getNewsBySlug = async (slug, publicOnly = false) => {
  const filter = { slug };
  if (publicOnly) filter.status = 'published';
  const article = await News.findOne(filter);
  if (!article) throw new AppError('News article not found', 404);
  return article;
};

const getNewsById = async (id) => {
  const article = await News.findById(id);
  if (!article) throw new AppError('News article not found', 404);
  return article;
};

const updateNews = async (id, data, admin) => {
  const article = await News.findById(id);
  if (!article) throw new AppError('News article not found', 404);

  if (data.title && !data.slug) {
    data.slug = await ensureUniqueSlug(generateSlug(data.title), id);
  } else if (data.slug) {
    data.slug = await ensureUniqueSlug(data.slug, id);
  }

  if (data.status === 'published' && article.status !== 'published') {
    data.publishedAt = new Date();
  }

  Object.assign(article, data);
  await article.save();
  return article;
};

const deleteNews = async (id) => {
  const article = await News.findByIdAndDelete(id);
  if (!article) throw new AppError('News article not found', 404);
  return article;
};

module.exports = {
  createNews,
  getNewsList,
  getNewsBySlug,
  getNewsById,
  updateNews,
  deleteNews,
};
