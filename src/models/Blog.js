const mongoose = require('mongoose');
const { BLOG_STATUSES } = require('../config/constants');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    featuredImage: { type: String, default: '' },
    category: { type: String, default: 'General', trim: true },
    tags: [{ type: String, trim: true }],
    author: { type: String, default: 'Warehouster Team', trim: true },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    status: { type: String, enum: BLOG_STATUSES, default: 'draft' },
    publishedAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

blogSchema.index({ status: 1, publishedAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
