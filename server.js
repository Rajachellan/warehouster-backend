require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const config = require('./src/config');
const { seedDefaults } = require('./src/services/settings.service');
const { startCampaignScheduler } = require('./src/jobs/campaignScheduler');

const start = async () => {
  await connectDB();
  await seedDefaults();
  startCampaignScheduler();

  app.listen(config.port, () => {
    console.log(`Warehouster API running on port ${config.port}`);
    console.log(`Swagger docs: ${config.apiUrl}/api/docs`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
