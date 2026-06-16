const mongoose = require('mongoose');
const { CAMPAIGN_STATUSES } = require('../config/constants');

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    htmlContent: { type: String, required: true },
    recipientsCount: { type: Number, default: 0 },
    status: { type: String, enum: CAMPAIGN_STATUSES, default: 'draft' },
    scheduledAt: Date,
    sentAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    recipientFilter: {
      type: String,
      enum: ['all', 'active'],
      default: 'active',
    },
    errorMessage: String,
  },
  { timestamps: true }
);

campaignSchema.index({ status: 1, scheduledAt: 1 });

module.exports = mongoose.model('Campaign', campaignSchema);
