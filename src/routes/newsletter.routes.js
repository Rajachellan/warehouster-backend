const express = require('express');
const newsletterController = require('../controllers/newsletter.controller');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/constants');
const { subscribeRules } = require('../validators');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/subscribe', subscribeRules, validate, newsletterController.subscribe);

router.use(protect);
router.get('/', authorize(PERMISSIONS.MANAGE_SUBSCRIBERS), newsletterController.getSubscribers);
router.get('/export', authorize(PERMISSIONS.MANAGE_SUBSCRIBERS), newsletterController.exportSubscribers);
router.post(
  '/import',
  authorize(PERMISSIONS.MANAGE_SUBSCRIBERS),
  upload.single('file'),
  newsletterController.importSubscribers
);

module.exports = router;
