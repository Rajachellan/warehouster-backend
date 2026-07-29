require('dotenv').config();

const defaultCorsOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:5173',
  'https://admin.warehouster.com',
  'https://warehouster.com',
  'https://www.warehouster.com',
];

const envCorsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 9000,
  apiUrl: process.env.API_URL || 'http://localhost:9000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  corsOrigins: [...new Set([...defaultCorsOrigins, ...envCorsOrigins])],
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/warehouster',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    resetExpiresIn: process.env.JWT_RESET_EXPIRES_IN || '1h',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  cloudflareImages: {
    accountId: process.env.CLOUDFLARE_IMAGES_ACCOUNT_ID,
    apiToken: process.env.CLOUDFLARE_IMAGES_API_TOKEN,
    requireSignedURLs: process.env.CLOUDFLARE_IMAGES_REQUIRE_SIGNED_URLS === 'true',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromName: process.env.SMTP_FROM_NAME || 'Warehouster',
    fromEmail: process.env.SMTP_FROM_EMAIL || 'info@warehouster.com',
  },
  adminEmail: process.env.ADMIN_EMAIL || 'info@warehouster.com',
};
