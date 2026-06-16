const express = require('express');
const authController = require('../controllers/auth.controller');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authorizeRole } = require('../middleware/rbac');
const { ROLES } = require('../config/constants');
const { loginRules, forgotPasswordRules, resetPasswordRules } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Admin authentication
 */

router.post('/login', loginRules, validate, authController.login);
router.post('/forgot-password', forgotPasswordRules, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordRules, validate, authController.resetPassword);

router.use(protect);
router.get('/me', authController.getMe);
router.post(
  '/admins',
  authorizeRole(ROLES.SUPER_ADMIN),
  authController.createAdmin
);

module.exports = router;
