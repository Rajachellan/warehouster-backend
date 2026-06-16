const jwt = require('jsonwebtoken');
const config = require('../config');
const { Admin } = require('../models');

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);
    const admin = await Admin.findById(decoded.id);
    if (admin?.isActive) req.admin = admin;
  } catch {
    // ignore invalid token on public routes
  }
  next();
};

module.exports = optionalAuth;
