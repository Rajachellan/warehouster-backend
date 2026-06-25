const express = require('express');
const newsletterController = require('../controllers/newsletter.controller');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/constants');
const { subscribeRules, unsubscribeRules, templateRules } = require('../validators');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/subscribe', subscribeRules, validate, newsletterController.subscribe);
router.post('/unsubscribe', unsubscribeRules, validate, newsletterController.unsubscribe);
router.get('/unsubscribe', newsletterController.unsubscribe);

router.use(protect);
router.get('/summary', authorize(PERMISSIONS.MANAGE_SUBSCRIBERS), newsletterController.getSummary);
router.get('/templates', authorize(PERMISSIONS.MANAGE_CAMPAIGNS), newsletterController.getTemplates);
router.post('/templates', authorize(PERMISSIONS.MANAGE_CAMPAIGNS), templateRules, validate, newsletterController.createTemplate);
router.put('/templates/:id', authorize(PERMISSIONS.MANAGE_CAMPAIGNS), templateRules, validate, newsletterController.updateTemplate);
router.delete('/templates/:id', authorize(PERMISSIONS.MANAGE_CAMPAIGNS), newsletterController.deleteTemplate);
router.get('/', authorize(PERMISSIONS.MANAGE_SUBSCRIBERS), newsletterController.getSubscribers);
router.get('/export', authorize(PERMISSIONS.MANAGE_SUBSCRIBERS), newsletterController.exportSubscribers);
router.post(
  '/import',
  authorize(PERMISSIONS.MANAGE_SUBSCRIBERS),
  upload.single('file'),
  newsletterController.importSubscribers
);

module.exports = router;
