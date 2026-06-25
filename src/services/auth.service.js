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

const getAdmins = async () => Admin.find().sort({ createdAt: -1 });

const createAdmin = async (data, createdBy, req) => {
  const existing = await Admin.findOne({ email: data.email });
  if (existing) throw new AppError('Email already registered', 409);

  if (data.role === ROLES.SUPER_ADMIN && createdBy.role !== ROLES.SUPER_ADMIN) {
    throw new AppError('Only super admins can create super admin accounts', 403);
  }

  const admin = await Admin.create({
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role || ROLES.EDITOR,
  });

  await logActivity({
    action: 'create',
    entity: 'admin',
    entityId: admin._id,
    description: `Admin user created: ${admin.name} (${admin.email}) — role: ${admin.role}`,
    metadata: { role: admin.role, email: admin.email },
    performedBy: createdBy._id,
    req,
  });

  return admin;
};

const updateAdmin = async (id, data, updatedBy, req) => {
  const admin = await Admin.findById(id);
  if (!admin) throw new AppError('Admin user not found', 404);

  if (admin._id.equals(updatedBy._id) && data.isActive === false) {
    throw new AppError('You cannot deactivate your own account', 400);
  }

  if (data.role === ROLES.SUPER_ADMIN && updatedBy.role !== ROLES.SUPER_ADMIN) {
    throw new AppError('Only super admins can assign super admin role', 403);
  }

  if (admin.role === ROLES.SUPER_ADMIN && data.role && data.role !== ROLES.SUPER_ADMIN) {
    const superCount = await Admin.countDocuments({ role: ROLES.SUPER_ADMIN, isActive: true });
    if (superCount <= 1) {
      throw new AppError('Cannot change role of the only super admin', 400);
    }
  }

  const changes = [];
  if (data.name && data.name !== admin.name) {
    changes.push(`name → ${data.name}`);
    admin.name = data.name;
  }
  if (data.role && data.role !== admin.role) {
    changes.push(`role ${admin.role} → ${data.role}`);
    admin.role = data.role;
  }
  if (typeof data.isActive === 'boolean' && data.isActive !== admin.isActive) {
    changes.push(data.isActive ? 'activated' : 'deactivated');
    admin.isActive = data.isActive;
  }

  if (!changes.length) return admin;

  await admin.save();

  await logActivity({
    action: 'update',
    entity: 'admin',
    entityId: admin._id,
    description: `Admin user updated: ${admin.email} (${changes.join(', ')})`,
    metadata: { changes },
    performedBy: updatedBy._id,
    req,
  });

  return admin;
};

const resetAdminPassword = async (id, password, updatedBy, req) => {
  const admin = await Admin.findById(id).select('+password');
  if (!admin) throw new AppError('Admin user not found', 404);

  admin.password = password;
  await admin.save();

  await logActivity({
    action: 'update',
    entity: 'admin',
    entityId: admin._id,
    description: `Password reset for admin: ${admin.email}`,
    performedBy: updatedBy._id,
    req,
  });

  return { message: 'Password updated' };
};

const getProfile = (admin) => admin;

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  getAdmins,
  createAdmin,
  updateAdmin,
  resetAdminPassword,
  getProfile,
  signToken,
};
