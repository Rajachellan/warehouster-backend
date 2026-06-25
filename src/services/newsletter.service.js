const crypto = require('crypto');
const { Subscriber } = require('../models');
const config = require('../config');
const { sendEmail } = require('./email.service');
const { welcomeEmail } = require('../templates/email.templates');
const AppError = require('../utils/AppError');
const { paginate, buildPaginationMeta } = require('../utils/helpers');
const { toCSV } = require('../utils/csvExport');
const csv = require('csv-parser');
const { Readable } = require('stream');

const generateUnsubscribeToken = () => crypto.randomBytes(24).toString('hex');

const ensureUnsubscribeToken = async (subscriber) => {
  if (!subscriber.unsubscribeToken) {
    subscriber.unsubscribeToken = generateUnsubscribeToken();
    await subscriber.save();
  }
  return subscriber.unsubscribeToken;
};

const buildUnsubscribeUrl = (token) =>
  `${config.frontendUrl}/newsletter/unsubscribe?token=${token}`;

const subscribe = async (email) => {
  const existing = await Subscriber.findOne({ email });
  if (existing) {
    if (existing.status === 'active') {
      throw new AppError('This email is already subscribed', 409);
    }
    existing.status = 'active';
    existing.subscribedAt = new Date();
    existing.unsubscribedAt = undefined;
    await ensureUnsubscribeToken(existing);
    await existing.save();
    await sendWelcomeIfEnabled(existing);
    return existing;
  }

  const subscriber = await Subscriber.create({
    email,
    unsubscribeToken: generateUnsubscribeToken(),
  });
  await sendWelcomeIfEnabled(subscriber);
  return subscriber;
};

const sendWelcomeIfEnabled = async (subscriber) => {
  const { Settings } = require('../models');
  const setting = await Settings.findOne({ key: 'newsletter_welcome_enabled' });
  if (setting?.value === false) return;

  const token = await ensureUnsubscribeToken(subscriber);
  await sendEmail({
    to: subscriber.email,
    subject: 'Welcome to Warehouster Insights',
    html: welcomeEmail(subscriber.email, buildUnsubscribeUrl(token)),
  });
};

const unsubscribeByToken = async (token) => {
  if (!token) {
    throw new AppError('Invalid unsubscribe link', 400);
  }

  const subscriber = await Subscriber.findOne({ unsubscribeToken: token });
  if (!subscriber) {
    throw new AppError('Invalid or expired unsubscribe link', 404);
  }

  if (subscriber.status === 'unsubscribed') {
    return { email: subscriber.email, alreadyUnsubscribed: true };
  }

  subscriber.status = 'unsubscribed';
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();

  return { email: subscriber.email, alreadyUnsubscribed: false };
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
            await Subscriber.create({ email, unsubscribeToken: generateUnsubscribeToken() });
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

const getActiveSubscribers = async () => {
  const subs = await Subscriber.find({ status: 'active' });
  const result = [];

  for (const sub of subs) {
    const token = await ensureUnsubscribeToken(sub);
    result.push({ email: sub.email, unsubscribeToken: token });
  }

  return result;
};

const getSubscriberSummary = async () => {
  const [active, unsubscribed, total] = await Promise.all([
    Subscriber.countDocuments({ status: 'active' }),
    Subscriber.countDocuments({ status: 'unsubscribed' }),
    Subscriber.countDocuments(),
  ]);
  return { active, unsubscribed, total };
};

module.exports = {
  subscribe,
  unsubscribeByToken,
  buildUnsubscribeUrl,
  getSubscribers,
  exportSubscribersCSV,
  importSubscribersCSV,
  getActiveEmails,
  getActiveSubscribers,
  getSubscriberSummary,
};
