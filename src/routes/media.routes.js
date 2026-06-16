const express = require('express');
const mediaController = require('../controllers/media.controller');
const protect = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/constants');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);
router.get('/', authorize(PERMISSIONS.MANAGE_MEDIA), mediaController.getMedia);
router.post('/', authorize(PERMISSIONS.MANAGE_MEDIA), upload.single('file'), mediaController.upload);
router.delete('/:id', authorize(PERMISSIONS.MANAGE_MEDIA), mediaController.deleteMedia);

module.exports = router;
