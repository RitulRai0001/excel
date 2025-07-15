const Analysis = require('../models/Analysis');

exports.getDashboardData = async (req, res) => {
  try {
    // Get all analyses for the user
    const analyses = await Analysis.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ analyses });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
