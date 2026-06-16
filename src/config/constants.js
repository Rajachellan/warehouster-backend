const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
};

const PERMISSIONS = {
  MANAGE_ADMINS: 'manage_admins',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_LEADS: 'manage_leads',
  MANAGE_SUBSCRIBERS: 'manage_subscribers',
  MANAGE_CAMPAIGNS: 'manage_campaigns',
  MANAGE_BLOGS: 'manage_blogs',
  MANAGE_NEWS: 'manage_news',
  MANAGE_MEDIA: 'manage_media',
  VIEW_ACTIVITY_LOGS: 'view_activity_logs',
  VIEW_DASHBOARD: 'view_dashboard',
};

const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_LEADS,
    PERMISSIONS.MANAGE_SUBSCRIBERS,
    PERMISSIONS.MANAGE_CAMPAIGNS,
    PERMISSIONS.MANAGE_BLOGS,
    PERMISSIONS.MANAGE_NEWS,
    PERMISSIONS.MANAGE_MEDIA,
    PERMISSIONS.VIEW_ACTIVITY_LOGS,
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_SETTINGS,
  ],
  [ROLES.EDITOR]: [
    PERMISSIONS.MANAGE_BLOGS,
    PERMISSIONS.MANAGE_NEWS,
    PERMISSIONS.MANAGE_MEDIA,
    PERMISSIONS.VIEW_DASHBOARD,
  ],
};

const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted'];
const SUBSCRIBER_STATUSES = ['active', 'unsubscribed', 'bounced'];
const BLOG_STATUSES = ['draft', 'published', 'archived'];
const NEWS_STATUSES = ['draft', 'published', 'archived'];
const CAMPAIGN_STATUSES = ['draft', 'scheduled', 'sending', 'sent', 'failed'];

const INQUIRY_TYPES = [
  'Leasing',
  'Land & Warehouse Investments',
  'HR & Admin',
  'Media / Marketing',
  'Projects & Development',
];

const MEDIA_FOLDERS = ['blogs', 'news', 'campaigns'];

module.exports = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  LEAD_STATUSES,
  SUBSCRIBER_STATUSES,
  BLOG_STATUSES,
  NEWS_STATUSES,
  CAMPAIGN_STATUSES,
  INQUIRY_TYPES,
  MEDIA_FOLDERS,
};
