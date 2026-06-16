const { Lead } = require('../models');
const AppError = require('../utils/AppError');
const { paginate, buildPaginationMeta } = require('../utils/helpers');
const { toCSV } = require('../utils/csvExport');
const logActivity = require('./activityLog.service');

const createLead = async (data) => {
  const lead = await Lead.create(data);
  return lead;
};

const getLeads = async ({ page, limit, search, status }) => {
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const query = Lead.find(filter).sort({ createdAt: -1 });
  const total = await Lead.countDocuments(filter);
  const leads = await paginate(query, { page, limit });

  return { leads, meta: buildPaginationMeta(total, page, limit) };
};

const getLeadById = async (id) => {
  const lead = await Lead.findById(id);
  if (!lead) throw new AppError('Lead not found', 404);
  return lead;
};

const updateLead = async (id, data, admin, req) => {
  const lead = await Lead.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!lead) throw new AppError('Lead not found', 404);

  if (data.status) {
    await logActivity({
      action: 'update_status',
      entity: 'lead',
      entityId: lead._id,
      description: `Lead status changed to ${data.status}`,
      metadata: { status: data.status },
      performedBy: admin._id,
      req,
    });
  }

  return lead;
};

const exportLeadsCSV = async (filters = {}) => {
  const filter = {};
  if (filters.status) filter.status = filters.status;
  const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();
  return toCSV(leads, ['name', 'email', 'phone', 'inquiryType', 'message', 'status', 'notes', 'createdAt']);
};

module.exports = { createLead, getLeads, getLeadById, updateLead, exportLeadsCSV };
