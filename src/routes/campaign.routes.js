const express = require('express');
const campaignController = require('../controllers/campaign.controller');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/constants');
const { campaignRules } = require('../validators');

const router = express.Router();

router.use(protect);
router.get('/', authorize(PERMISSIONS.MANAGE_CAMPAIGNS), campaignController.getCampaigns);
router.post('/', authorize(PERMISSIONS.MANAGE_CAMPAIGNS), campaignRules, validate, campaignController.createCampaign);
router.get('/:id', authorize(PERMISSIONS.MANAGE_CAMPAIGNS), campaignController.getCampaign);
router.put('/:id', authorize(PERMISSIONS.MANAGE_CAMPAIGNS), campaignController.updateCampaign);
router.delete('/:id', authorize(PERMISSIONS.MANAGE_CAMPAIGNS), campaignController.deleteCampaign);
router.post('/:id/test', authorize(PERMISSIONS.MANAGE_CAMPAIGNS), campaignController.sendTest);
router.post('/:id/send', authorize(PERMISSIONS.MANAGE_CAMPAIGNS), campaignController.sendCampaign);
router.post('/:id/schedule', authorize(PERMISSIONS.MANAGE_CAMPAIGNS), campaignController.scheduleCampaign);

module.exports = router;
