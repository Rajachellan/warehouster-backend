const express = require('express');
const newsController = require('../controllers/news.controller');
const protect = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const validate = require('../middleware/validate');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/constants');
const { newsRules } = require('../validators');

const router = express.Router();

router.get('/', optionalAuth, newsController.getNews);
router.get('/:slug', optionalAuth, newsController.getNewsArticle);

router.use(protect);
router.post('/', authorize(PERMISSIONS.MANAGE_NEWS), newsRules, validate, newsController.createNews);
router.get('/admin/:id', authorize(PERMISSIONS.MANAGE_NEWS), newsController.getNewsById);
router.put('/:id', authorize(PERMISSIONS.MANAGE_NEWS), newsController.updateNews);
router.delete('/:id', authorize(PERMISSIONS.MANAGE_NEWS), newsController.deleteNews);

module.exports = router;
