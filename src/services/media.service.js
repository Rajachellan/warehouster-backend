const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const config = require('../config');
const cloudinary = require('../config/cloudinary');
const { Media } = require('../models');
const AppError = require('../utils/AppError');
const { MEDIA_FOLDERS } = require('../config/constants');

const uploadsRoot = path.join(__dirname, '../../uploads');

const hasCloudflare = () =>
  Boolean(config.cloudflareImages?.accountId && config.cloudflareImages?.apiToken);

const hasCloudinary = () =>
  Boolean(config.cloudinary?.cloudName && config.cloudinary?.apiKey && config.cloudinary?.apiSecret);

const uploadToCloudflareImages = async (file, folder) => {
  const { accountId, apiToken, requireSignedURLs } = config.cloudflareImages;
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`;

  const form = new FormData();
  const blob = new Blob([file.buffer], { type: file.mimetype || 'application/octet-stream' });
  form.append('file', blob, file.originalname);
  form.append('requireSignedURLs', String(Boolean(requireSignedURLs)));
  form.append('metadata', JSON.stringify({ folder }));

  const resp = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiToken}` },
    body: form,
  });

  const json = await resp.json().catch(() => ({}));
  if (!json?.success) {
    throw new AppError(json?.errors?.[0]?.message || 'Cloudflare upload failed', 502);
  }

  const variants = json.result?.variants || [];
  const imageUrl =
    variants.find((v) => v.includes('/original')) ||
    variants[variants.length - 1] ||
    '';

  if (!imageUrl) {
    throw new AppError('Cloudflare upload succeeded but returned no image URL', 502);
  }

  return {
    publicId: String(json.result.id),
    url: imageUrl,
    secureUrl: imageUrl,
  };
};

const uploadToCloudinary = async (file, folder) => {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `warehouster/${folder}`, resource_type: 'auto' },
      (error, uploadResult) => {
        if (error) reject(error);
        else resolve(uploadResult);
      }
    );
    stream.end(file.buffer);
  });

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
};

const uploadToLocal = async (file, folder) => {
  const dir = path.join(uploadsRoot, folder);
  fs.mkdirSync(dir, { recursive: true });

  const ext = path.extname(file.originalname) || '.jpg';
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const relativePath = `${folder}/${filename}`;
  fs.writeFileSync(path.join(dir, filename), file.buffer);

  const baseUrl = config.apiUrl || `http://localhost:${config.port}`;
  const imageUrl = `${baseUrl}/uploads/${relativePath}`;

  return {
    publicId: relativePath,
    url: imageUrl,
    secureUrl: imageUrl,
    bytes: file.size,
  };
};

const deleteFromCloudflareImages = async (imageId) => {
  const { accountId, apiToken } = config.cloudflareImages;
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${encodeURIComponent(imageId)}`;
  await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${apiToken}` },
  });
};

const deleteFromLocal = async (publicId) => {
  const filepath = path.join(uploadsRoot, publicId);
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
};

const uploadImage = async (file, folder, uploadedBy) => {
  if (!MEDIA_FOLDERS.includes(folder)) {
    throw new AppError(`Invalid folder. Allowed: ${MEDIA_FOLDERS.join(', ')}`, 400);
  }

  let result;
  if (hasCloudflare()) {
    result = await uploadToCloudflareImages(file, folder);
  } else if (hasCloudinary()) {
    result = await uploadToCloudinary(file, folder);
  } else {
    result = await uploadToLocal(file, folder);
  }

  const media = await Media.create({
    publicId: result.publicId,
    url: result.url,
    secureUrl: result.secureUrl,
    folder,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes || file.size,
    originalName: file.originalname,
    uploadedBy,
  });

  return media;
};

const deleteImage = async (publicId) => {
  if (hasCloudflare()) {
    await deleteFromCloudflareImages(publicId);
  } else if (hasCloudinary()) {
    await cloudinary.uploader.destroy(publicId);
  } else {
    await deleteFromLocal(publicId);
  }
  await Media.findOneAndDelete({ publicId });
};

module.exports = { uploadImage, deleteImage };
