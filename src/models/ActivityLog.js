const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ entity: 1, entityId: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
