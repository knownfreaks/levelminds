const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  completeOnboarding,
  getSchoolProfile,
  getSchoolJobs,
  getJobApplicants,
  updateApplicationStatus,
  scheduleInterview,
  getApplicantProfile
} = require('../controllers/schoolController');

const schoolOnly = (req, res, next) => {
    if (req.user && req.user.role === 'school') return next();
    res.status(403).json({ msg: 'Access denied. Schools only.' });
};

router.put('/onboarding', auth, schoolOnly, completeOnboarding);
router.get('/profile', auth, schoolOnly, getSchoolProfile);
router.get('/jobs', auth, schoolOnly, getSchoolJobs);
router.get('/jobs/:jobId/applicants', auth, schoolOnly, getJobApplicants);
router.put('/applications/:appId/status', auth, schoolOnly, updateApplicationStatus);
router.post('/applications/:appId/schedule-interview', auth, schoolOnly, scheduleInterview);
router.get('/applicants/:studentId', auth, schoolOnly, getApplicantProfile);

module.exports = router;