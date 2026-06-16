const express = require('express');
const authRoutes = require('./auth.routes');
const leadRoutes = require('./lead.routes');
const newsletterRoutes = require('./newsletter.routes');
const blogRoutes = require('./blog.routes');
const newsRoutes = require('./news.routes');
const campaignRoutes = require('./campaign.routes');
const mediaRoutes = require('./media.routes');
const settingsRoutes = require('./settings.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/blogs', blogRoutes);
router.use('/news', newsRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/media', mediaRoutes);
router.use('/settings', settingsRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
