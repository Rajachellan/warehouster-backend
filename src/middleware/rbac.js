const { ROLE_PERMISSIONS } = require('../config/constants');
const AppError = require('../utils/AppError');

const authorize = (...permissions) => (req, res, next) => {
  if (!req.admin) {
    return next(new AppError('Not authorized.', 401));
  }

  const rolePerms = ROLE_PERMISSIONS[req.admin.role] || [];

  const hasPermission = permissions.some((p) => rolePerms.includes(p));
  if (!hasPermission) {
    return next(new AppError('You do not have permission to perform this action.', 403));
  }

  next();
};

const authorizeRole = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    return next(new AppError('Insufficient role privileges.', 403));
  }
  next();
};

module.exports = { authorize, authorizeRole };
