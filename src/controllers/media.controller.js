const { Media } = require('../models');
const mediaService = require('../services/media.service');
const asyncHandler = require('../utils/asyncHandler');
const { paginate, buildPaginationMeta } = require('../utils/helpers');

exports.upload = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'File is required' });
  }
  const folder = req.body.folder || 'blogs';
  const media = await mediaService.uploadImage(req.file, folder, req.admin._id);
  res.status(201).json({ success: true, data: media });
});

exports.getMedia = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, folder } = req.query;
  const filter = folder ? { folder } : {};
  const query = Media.find(filter).sort({ createdAt: -1 });
  const total = await Media.countDocuments(filter);
  const media = await paginate(query, { page, limit });
  res.json({ success: true, media, meta: buildPaginationMeta(total, page, limit) });
});

exports.deleteMedia = asyncHandler(async (req, res) => {
  const item = await Media.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Media not found' });
  }
  await mediaService.deleteImage(item.publicId);
  res.json({ success: true, message: 'Media deleted' });
});
