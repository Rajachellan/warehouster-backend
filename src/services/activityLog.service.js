const { ActivityLog } = require('../models');

const logActivity = async ({
  action,
  entity,
  entityId,
  description,
  metadata,
  performedBy,
  req,
}) => {
  try {
    await ActivityLog.create({
      action,
      entity,
      entityId,
      description,
      metadata,
      performedBy,
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'],
      userAgent: req?.headers?.['user-agent'],
    });
  } catch (err) {
    console.error('Activity log failed:', err.message);
  }
};

module.exports = logActivity;
