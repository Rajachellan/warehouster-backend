const express = require('express');
const settingsController = require('../controllers/settings.controller');
const protect = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

router.get('/website', settingsController.getPublicWebsiteInfo);

router.use(protect);
router.get('/', authorize(PERMISSIONS.MANAGE_SETTINGS), settingsController.getSettings);
router.patch('/', authorize(PERMISSIONS.MANAGE_SETTINGS), settingsController.updateSettings);
router.put('/bulk', authorize(PERMISSIONS.MANAGE_SETTINGS), settingsController.updateSettingsBulk);

module.exports = router;
