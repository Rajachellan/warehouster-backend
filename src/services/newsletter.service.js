const { Subscriber } = require('../models');
const { sendEmail } = require('./email.service');
const { welcomeEmail } = require('../templates/email.templates');
const AppError = require('../utils/AppError');
const { paginate, buildPaginationMeta } = require('../utils/helpers');
const { toCSV } = require('../utils/csvExport');
const csv = require('csv-parser');
const { Readable } = require('stream');

const subscribe = async (email) => {
  const existing = await Subscriber.findOne({ email });
  if (existing) {
    if (existing.status === 'active') {
      throw new AppError('This email is already subscribed', 409);
    }
    existing.status = 'active';
    existing.subscribedAt = new Date();
    existing.unsubscribedAt = undefined;
    await existing.save();
    await sendWelcomeIfEnabled(email);
    return existing;
  }

  const subscriber = await Subscriber.create({ email });
  await sendWelcomeIfEnabled(email);
  return subscriber;
};

const sendWelcomeIfEnabled = async (email) => {
  const { Settings } = require('../models');
  const setting = await Settings.findOne({ key: 'newsletter_welcome_enabled' });
  if (setting?.value === false) return;
  await sendEmail({
    to: email,
    subject: 'Welcome to Warehouster Insights',
    html: welcomeEmail(email),
  });
};

const getSubscribers = async ({ page, limit, status, search }) => {
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.email = { $regex: search, $options: 'i' };

  const query = Subscriber.find(filter).sort({ subscribedAt: -1 });
  const total = await Subscriber.countDocuments(filter);
  const subscribers = await paginate(query, { page, limit });

  return { subscribers, meta: buildPaginationMeta(total, page, limit) };
};

const exportSubscribersCSV = async () => {
  const subscribers = await Subscriber.find().sort({ subscribedAt: -1 }).lean();
  return toCSV(subscribers, ['email', 'status', 'subscribedAt', 'createdAt']);
};

const importSubscribersCSV = (buffer) =>
  new Promise((resolve, reject) => {
    const results = { imported: 0, skipped: 0, errors: [] };
    const rows = [];

    Readable.from(buffer)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', async () => {
        for (const row of rows) {
          const email = (row.email || row.Email || '').trim().toLowerCase();
          if (!email) {
            results.skipped += 1;
            continue;
          }
          try {
            const exists = await Subscriber.findOne({ email });
            if (exists) {
              results.skipped += 1;
              continue;
            }
            await Subscriber.create({ email });
            results.imported += 1;
          } catch (err) {
            results.errors.push({ email, error: err.message });
          }
        }
        resolve(results);
      })
      .on('error', reject);
  });

const getActiveEmails = async () => {
  const subs = await Subscriber.find({ status: 'active' }).select('email').lean();
  return subs.map((s) => s.email);
};

module.exports = {
  subscribe,
  getSubscribers,
  exportSubscribersCSV,
  importSubscribersCSV,
  getActiveEmails,
};
