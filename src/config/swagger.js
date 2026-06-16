const swaggerJsdoc = require('swagger-jsdoc');
const config = require('../config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Warehouster CMS API',
      version: '1.0.0',
      description: 'REST API for Warehouster CMS — leads, newsletter, blogs, news, campaigns, and admin management.',
      contact: { name: 'Warehouster', email: 'info@warehouster.com' },
    },
    servers: [{ url: `${config.apiUrl}/api`, description: 'API Server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Lead: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            inquiryType: { type: 'string' },
            message: { type: 'string' },
            status: { type: 'string', enum: ['new', 'contacted', 'qualified', 'converted'] },
            notes: { type: 'string' },
          },
        },
        Blog: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            slug: { type: 'string' },
            excerpt: { type: 'string' },
            content: { type: 'string' },
            featuredImage: { type: 'string' },
            category: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            author: { type: 'string' },
            status: { type: 'string', enum: ['draft', 'published', 'archived'] },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Admin authentication' },
      { name: 'Leads', description: 'Contact form leads' },
      { name: 'Newsletter', description: 'Subscriber management' },
      { name: 'Blogs', description: 'Blog CMS' },
      { name: 'News', description: 'News CMS' },
      { name: 'Campaigns', description: 'Email campaigns' },
      { name: 'Media', description: 'Media library' },
      { name: 'Settings', description: 'Site settings' },
      { name: 'Dashboard', description: 'Dashboard & analytics' },
    ],
  },
  apis: ['./src/routes/*.js', './src/docs/*.yaml'],
};

module.exports = swaggerJsdoc(options);
