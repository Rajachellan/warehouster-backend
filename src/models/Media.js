const mongoose = require('mongoose');
const { MEDIA_FOLDERS } = require('../config/constants');

const mediaSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    folder: { type: String, enum: MEDIA_FOLDERS, required: true },
    format: String,
    width: Number,
    height: Number,
    bytes: Number,
    originalName: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

mediaSchema.index({ folder: 1, createdAt: -1 });

module.exports = mongoose.model('Media', mediaSchema);
