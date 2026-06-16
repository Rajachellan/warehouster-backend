const express = require('express');
const leadController = require('../controllers/lead.controller');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/constants');
const { createLeadRules } = require('../validators');

const router = express.Router();

router.post('/', createLeadRules, validate, leadController.createLead);

router.use(protect);
router.get('/', authorize(PERMISSIONS.MANAGE_LEADS), leadController.getLeads);
router.get('/export', authorize(PERMISSIONS.MANAGE_LEADS), leadController.exportLeads);
router.get('/:id', authorize(PERMISSIONS.MANAGE_LEADS), leadController.getLead);
router.patch('/:id', authorize(PERMISSIONS.MANAGE_LEADS), leadController.updateLead);

module.exports = router;
