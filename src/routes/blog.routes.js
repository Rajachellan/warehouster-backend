const express = require('express');
const blogController = require('../controllers/blog.controller');
const protect = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const validate = require('../middleware/validate');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/constants');
const { blogRules } = require('../validators');

const router = express.Router();

router.get('/', optionalAuth, blogController.getBlogs);
router.get('/:slug', optionalAuth, blogController.getBlog);

router.use(protect);
router.post('/', authorize(PERMISSIONS.MANAGE_BLOGS), blogRules, validate, blogController.createBlog);
router.get('/admin/:id', authorize(PERMISSIONS.MANAGE_BLOGS), blogController.getBlogById);
router.put('/:id', authorize(PERMISSIONS.MANAGE_BLOGS), blogController.updateBlog);
router.delete('/:id', authorize(PERMISSIONS.MANAGE_BLOGS), blogController.deleteBlog);

module.exports = router;
