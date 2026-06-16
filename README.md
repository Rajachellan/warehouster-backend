# Warehouster Backend API

Node.js / Express CMS API for the Warehouster platform.

## Stack

- Express.js + MongoDB (Mongoose)
- JWT authentication with RBAC (Super Admin, Admin, Editor)
- Nodemailer, Cloudinary, Multer
- Swagger OpenAPI docs

## Quick Start

```bash
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, SMTP, and Cloudinary credentials

npm install
npm run seed    # Creates super admin + default settings
npm run dev
```

API: `http://localhost:5000`  
Docs: `http://localhost:5000/api/docs`

## Default Super Admin (after seed)

- Email: `admin@warehouster.com`
- Password: `ChangeMe123!`

## API Route Groups

| Group | Base Path | Description |
|-------|-----------|-------------|
| Auth | `/api/auth` | Login, forgot/reset password |
| Leads | `/api/leads` | Contact form + admin management |
| Newsletter | `/api/newsletter` | Subscribe + subscriber admin |
| Blogs | `/api/blogs` | Public blog API + CMS |
| News | `/api/news` | Public news API + CMS |
| Campaigns | `/api/campaigns` | Email marketing |
| Media | `/api/media` | Cloudinary uploads |
| Settings | `/api/settings` | Website, SMTP, SEO config |
| Dashboard | `/api/dashboard` | Stats, charts, activity logs |

## Project Structure

```
src/
├── config/          # App, DB, Cloudinary, Swagger, constants
├── controllers/     # Request handlers
├── docs/            # OpenAPI YAML
├── jobs/            # Cron schedulers
├── middleware/      # Auth, RBAC, validation, upload
├── models/          # Mongoose schemas
├── routes/          # Express routers
├── scripts/         # Seed script
├── services/        # Business logic
├── templates/       # Email HTML templates
├── utils/           # Helpers
└── app.js           # Express app
server.js            # Entry point
```

## Roles & Permissions

- **Super Admin**: Full access including admin management
- **Admin**: Leads, subscribers, campaigns, blogs, news, media, settings
- **Editor**: Blogs, news, media, dashboard view

## Frontend Integration

Public endpoints (no auth):

- `POST /api/leads` — Contact form
- `POST /api/newsletter/subscribe` — Footer newsletter
- `GET /api/blogs` — Published blogs
- `GET /api/blogs/:slug` — Single blog
- `GET /api/news` — Published news
- `GET /api/news/:slug` — Single news article
- `GET /api/settings/website` — Contact info for site
