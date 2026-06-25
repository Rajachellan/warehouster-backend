const express = require('express');
const authController = require('../controllers/auth.controller');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authorizeRole } = require('../middleware/rbac');
const { ROLES } = require('../config/constants');
const {
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  createAdminRules,
  updateAdminRules,
  resetAdminPasswordRules,
} = require('../validators');

const router = express.Router();

router.post('/login', loginRules, validate, authController.login);
router.post('/forgot-password', forgotPasswordRules, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordRules, validate, authController.resetPassword);

router.use(protect);

router.get('/me', authController.getMe);

router.get('/admins', authorizeRole(ROLES.SUPER_ADMIN), authController.getAdmins);
router.post(
  '/admins',
  authorizeRole(ROLES.SUPER_ADMIN),
  createAdminRules,
  validate,
  authController.createAdmin
);
router.put(
  '/admins/:id',
  authorizeRole(ROLES.SUPER_ADMIN),
  updateAdminRules,
  validate,
  authController.updateAdmin
);
router.patch(
  '/admins/:id/password',
  authorizeRole(ROLES.SUPER_ADMIN),
  resetAdminPasswordRules,
  validate,
  authController.resetAdminPassword
);

module.exports = router;
