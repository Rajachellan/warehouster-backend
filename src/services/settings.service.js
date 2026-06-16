const { Settings } = require('../models');

const DEFAULT_SETTINGS = [
  { key: 'company_name', value: 'Warehouster', group: 'website' },
  { key: 'company_email', value: 'info@warehouster.com', group: 'website' },
  { key: 'company_phone', value: '+91 95600 11696', group: 'website' },
  {
    key: 'company_address',
    value: '3rd Floor, 17, 3rd Cross Street East, Venkatasamy Nagar, Shenoy Nagar, Chennai, Tamil Nadu 600030',
    group: 'website',
  },
  {
    key: 'social_links',
    value: { linkedin: '', twitter: '', facebook: '', instagram: '' },
    group: 'website',
  },
  { key: 'smtp_host', value: '', group: 'smtp' },
  { key: 'smtp_port', value: 587, group: 'smtp' },
  { key: 'smtp_secure', value: false, group: 'smtp' },
  { key: 'smtp_user', value: '', group: 'smtp' },
  { key: 'smtp_pass', value: '', group: 'smtp' },
  { key: 'smtp_from_name', value: 'Warehouster', group: 'smtp' },
  { key: 'smtp_from_email', value: 'info@warehouster.com', group: 'smtp' },
  { key: 'newsletter_welcome_enabled', value: true, group: 'newsletter' },
  { key: 'newsletter_footer_text', value: 'Subscribe for industrial insights', group: 'newsletter' },
  { key: 'seo_default_title', value: 'Warehouster — Industrial Warehousing', group: 'seo' },
  {
    key: 'seo_default_description',
    value: 'Grade-A industrial warehousing and logistics solutions across India.',
    group: 'seo',
  },
];

const seedDefaults = async () => {
  for (const setting of DEFAULT_SETTINGS) {
    await Settings.findOneAndUpdate({ key: setting.key }, setting, { upsert: true });
  }
};

const getSettingsByGroup = async (group) => {
  const filter = group ? { group } : {};
  const settings = await Settings.find(filter);
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
};

const getPublicWebsiteInfo = async () => {
  const settings = await Settings.find({ group: 'website' });
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
};

const updateSettings = async (updates) => {
  const results = [];
  for (const [key, value] of Object.entries(updates)) {
    const setting = await Settings.findOneAndUpdate(
      { key },
      { value },
      { new: true }
    );
    if (setting) results.push(setting);
  }
  return results;
};

const updateSettingsBulk = async (settingsArray) => {
  const results = [];
  for (const { key, value, group } of settingsArray) {
    const setting = await Settings.findOneAndUpdate(
      { key },
      { key, value, group },
      { new: true, upsert: true }
    );
    results.push(setting);
  }
  return results;
};

module.exports = {
  seedDefaults,
  getSettingsByGroup,
  getPublicWebsiteInfo,
  updateSettings,
  updateSettingsBulk,
  DEFAULT_SETTINGS,
};
