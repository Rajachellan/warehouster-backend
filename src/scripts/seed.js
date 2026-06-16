require('dotenv').config();
const connectDB = require('../config/database');
const { Admin } = require('../models');
const { ROLES } = require('../config/constants');
const { seedDefaults } = require('../services/settings.service');

const seed = async () => {
  await connectDB();
  await seedDefaults();

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

  console.log('Seed completed.');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
