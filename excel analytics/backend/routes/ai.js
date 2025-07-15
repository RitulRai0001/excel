const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/summary', aiController.summary);

module.exports = router;

