const mongoose = require('mongoose');

const newsletterTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    subject: { type: String, required: true, trim: true },
    htmlContent: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NewsletterTemplate', newsletterTemplateSchema);
