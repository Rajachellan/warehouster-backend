const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const protect = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

router.use(protect);
router.get('/stats', authorize(PERMISSIONS.VIEW_DASHBOARD), dashboardController.getStats);
router.get('/charts/leads', authorize(PERMISSIONS.VIEW_DASHBOARD), dashboardController.getLeadChart);
router.get('/charts/subscribers', authorize(PERMISSIONS.VIEW_DASHBOARD), dashboardController.getSubscriberChart);
router.get('/activity-logs', authorize(PERMISSIONS.VIEW_ACTIVITY_LOGS), dashboardController.getActivityLogs);

module.exports = router;
