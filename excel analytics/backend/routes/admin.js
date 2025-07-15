
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Simple admin check middleware
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access required' });
}

router.get('/users', auth, isAdmin, adminController.getUsers);
router.delete('/user/:id', auth, isAdmin, adminController.deleteUser);

module.exports = router;
