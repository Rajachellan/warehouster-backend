const { body } = require('express-validator');

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordRules = [body('email').isEmail().withMessage('Valid email is required')];

const resetPasswordRules = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const createLeadRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('inquiryType').trim().notEmpty().withMessage('Inquiry type is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

const subscribeRules = [body('email').isEmail().withMessage('Valid email is required')];

const blogRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
];

const newsRules = [body('title').trim().notEmpty().withMessage('Title is required')];

const campaignRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('htmlContent').trim().notEmpty().withMessage('HTML content is required'),
];

const createAdminRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['super_admin', 'admin', 'editor']).withMessage('Invalid role'),
];

const updateAdminRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('role').optional().isIn(['super_admin', 'admin', 'editor']).withMessage('Invalid role'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
];

const resetAdminPasswordRules = [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const templateRules = [
  body('name').trim().notEmpty().withMessage('Template name is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('htmlContent').trim().notEmpty().withMessage('Email content is required'),
];

const unsubscribeRules = [body('token').optional().isString()];

module.exports = {
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  createLeadRules,
  subscribeRules,
  blogRules,
  newsRules,
  campaignRules,
  unsubscribeRules,
  templateRules,
  createAdminRules,
  updateAdminRules,
  resetAdminPasswordRules,
};
