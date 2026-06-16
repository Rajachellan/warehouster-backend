const mongoose = require('mongoose');
const { NEWS_STATUSES } = require('../config/constants');

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    featuredImage: { type: String, default: '' },
    source: { type: String, default: '', trim: true },
    pdfUrl: { type: String, default: '' },
    status: { type: String, enum: NEWS_STATUSES, default: 'draft' },
    publishedAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

newsSchema.index({ status: 1, publishedAt: -1 });

module.exports = mongoose.model('News', newsSchema);
