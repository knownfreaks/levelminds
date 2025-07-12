const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our new security middleware
const { getMyProfile } = require('../controllers/profileController');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private (because we use the 'auth' middleware)
router.get('/me', auth, getMyProfile);

module.exports = router;