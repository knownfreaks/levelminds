const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  completeOnboarding,
  getStudentProfile,
  getStudentSchedule,
  getStudentApplications,
  submitHelpTicket,
  getNotifications,
  markNotificationsRead
} = require('../controllers/studentController');

const studentOnly = (req, res, next) => {
    if (req.user && req.user.role === 'student') return next();
    res.status(403).json({ msg: 'Access denied. Students only.' });
};

router.put('/onboarding', auth, studentOnly, completeOnboarding);
router.get('/profile', auth, studentOnly, getStudentProfile);
router.get('/schedule', auth, studentOnly, getStudentSchedule);
router.get('/applications', auth, studentOnly, getStudentApplications);
router.post('/help', auth, studentOnly, submitHelpTicket);

// Generic routes for any user
router.get('/notifications', auth, getNotifications);
router.put('/notifications/read', auth, markNotificationsRead);

module.exports = router;