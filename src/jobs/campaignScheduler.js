const cron = require('node-cron');
const { Campaign } = require('../models');
const campaignService = require('../services/campaign.service');

const startCampaignScheduler = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const due = await Campaign.find({
        status: 'scheduled',
        scheduledAt: { $lte: new Date() },
      });

      for (const campaign of due) {
        const admin = { _id: campaign.createdBy };
        await campaignService.sendCampaign(campaign._id, admin, null);
        console.log(`Scheduled campaign sent: ${campaign.title}`);
      }
    } catch (err) {
      console.error('Campaign scheduler error:', err.message);
    }
  });
};

module.exports = { startCampaignScheduler };
