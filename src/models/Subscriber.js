const mongoose = require('mongoose');
const { SUBSCRIBER_STATUSES } = require('../config/constants');

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: SUBSCRIBER_STATUSES, default: 'active' },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: Date,
  },
  { timestamps: true }
);

subscriberSchema.index({ status: 1 });

module.exports = mongoose.model('Subscriber', subscriberSchema);
