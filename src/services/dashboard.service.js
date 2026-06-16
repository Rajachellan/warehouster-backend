const { Lead, Subscriber, Blog, News, Campaign, ActivityLog } = require('../models');

const getDashboardStats = async () => {
  const [totalLeads, totalSubscribers, totalBlogs, totalNews, totalCampaigns] = await Promise.all([
    Lead.countDocuments(),
    Subscriber.countDocuments({ status: 'active' }),
    Blog.countDocuments({ status: 'published' }),
    News.countDocuments({ status: 'published' }),
    Campaign.countDocuments(),
  ]);

  const [recentLeads, recentSubscribers] = await Promise.all([
    Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
    Subscriber.find().sort({ subscribedAt: -1 }).limit(5).lean(),
  ]);

  return {
    stats: {
      totalLeads,
      totalSubscribers,
      totalBlogs,
      totalNews,
      totalCampaigns,
    },
    recentLeads,
    recentSubscribers,
  };
};

const getLeadConversionChart = async () => {
  const pipeline = [
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { status: '$_id', count: 1, _id: 0 } },
  ];
  return Lead.aggregate(pipeline);
};

const getMonthlySubscriberChart = async () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const pipeline = [
    { $match: { subscribedAt: { $gte: twelveMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$subscribedAt' },
          month: { $month: '$subscribedAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    {
      $project: {
        year: '$_id.year',
        month: '$_id.month',
        count: 1,
        _id: 0,
      },
    },
  ];

  return Subscriber.aggregate(pipeline);
};

const getActivityLogs = async ({ page, limit, entity, action }) => {
  const filter = {};
  if (entity) filter.entity = entity;
  if (action) filter.action = action;

  const skip = (Math.max(1, page) - 1) * limit;
  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.min(100, limit)),
    ActivityLog.countDocuments(filter),
  ]);

  return {
    logs,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

module.exports = {
  getDashboardStats,
  getLeadConversionChart,
  getMonthlySubscriberChart,
  getActivityLogs,
};
