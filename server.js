require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const config = require('./src/config');
const { seedDefaults } = require('./src/services/settings.service');
const { startCampaignScheduler } = require('./src/jobs/campaignScheduler');
const { Admin } = require('./src/models');
const { ROLES } = require('./src/config/constants');

const seedAdmin = async () => {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@warehouster.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const existing = await Admin.findOne({ email }).select('+password');

  if (existing) {
    existing.password = password;
    existing.role = ROLES.SUPER_ADMIN;
    existing.isActive = true;
    await existing.save();
    console.log(`Super admin updated: ${email}`);
  } else {
    await Admin.create({
      name: process.env.SEED_ADMIN_NAME || 'Super Admin',
      email,
      password,
      role: ROLES.SUPER_ADMIN,
    });
    console.log(`Super admin created: ${email}`);
  }
};

const start = async () => {
  await connectDB();
  await seedDefaults();
  await seedAdmin();
  startCampaignScheduler();

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`Warehouster API running on port ${config.port}`);
    console.log(`Swagger docs: ${config.apiUrl}/api/docs`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
