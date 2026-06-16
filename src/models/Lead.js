const mongoose = require('mongoose');
const { LEAD_STATUSES } = require('../config/constants');

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    inquiryType: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: LEAD_STATUSES, default: 'new' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
