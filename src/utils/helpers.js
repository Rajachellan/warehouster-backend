const slugify = require('slugify');

const generateSlug = (text) =>
  slugify(text, { lower: true, strict: true, trim: true });

const paginate = (query, { page = 1, limit = 10 }) => {
  const skip = (Math.max(1, page) - 1) * limit;
  return query.skip(skip).limit(Math.min(100, limit));
};

const buildPaginationMeta = (total, page, limit) => ({
  total,
  page: Number(page),
  limit: Number(limit),
  totalPages: Math.ceil(total / limit) || 1,
});

module.exports = { generateSlug, paginate, buildPaginationMeta };
