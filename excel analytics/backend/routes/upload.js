const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth');


// Upload file and analyze
router.post('/', auth, uploadController.uploadMiddleware, uploadController.uploadFile);

// Get upload history for current user
router.get('/history', auth, uploadController.getUploadHistory);

// Delete upload history for current user
router.delete('/history', auth, uploadController.deleteUploadHistory);

module.exports = router;
