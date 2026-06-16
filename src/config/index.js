require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
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
