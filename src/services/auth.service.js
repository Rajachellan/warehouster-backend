const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');
const { Admin } = require('../models');
const AppError = require('../utils/AppError');
const { sendEmail } = require('./email.service');
const { resetPasswordEmail } = require('../templates/email.templates');
const logActivity = require('./activityLog.service');
const { ROLES } = require('../config/constants');

const signToken = (id) =>
  jwt.sign({ id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

const login = async (email, password, req) => {
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!admin.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  await logActivity({
    action: 'login',
    entity: 'admin',
    entityId: admin._id,
    description: `${admin.name} logged in`,
    performedBy: admin._id,
    req,
  });

  return { admin, token: signToken(admin._id) };
};

const forgotPassword = async (email) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return { message: 'If that email exists, a reset link has been sent.' };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  admin.resetPasswordExpires = Date.now() + 3600000;
  await admin.save({ validateBeforeSave: false });

  const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: admin.email,
    subject: 'Warehouster Admin — Reset Password',
    html: resetPasswordEmail(admin.name, resetUrl),
  });

  return { message: 'If that email exists, a reset link has been sent.' };
};

const resetPassword = async (token, password) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const admin = await Admin.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+password');

  if (!admin) {
    throw new AppError('Token is invalid or has expired', 400);
  }

  admin.password = password;
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpires = undefined;
  await admin.save();

  return { message: 'Password reset successful' };
};

const createAdmin = async (data, createdBy) => {
  const existing = await Admin.findOne({ email: data.email });
  if (existing) throw new AppError('Email already registered', 409);
  return Admin.create({ ...data, role: data.role || ROLES.EDITOR });
};

const getProfile = (admin) => admin;

module.exports = { login, forgotPassword, resetPassword, createAdmin, getProfile, signToken };
