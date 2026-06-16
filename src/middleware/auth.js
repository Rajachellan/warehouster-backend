const jwt = require('jsonwebtoken');
const config = require('../config');
const { Admin } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized. Please log in.', 401);
  }

  const decoded = jwt.verify(token, config.jwt.secret);
  const admin = await Admin.findById(decoded.id);

  if (!admin || !admin.isActive) {
    throw new AppError('Account not found or deactivated.', 401);
  }

  req.admin = admin;
  next();
});

module.exports = protect;
