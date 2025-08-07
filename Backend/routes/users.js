const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Placeholder for user management routes
// You can expand this with admin routes for user management

router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

module.exports = router; 