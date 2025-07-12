const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Correctly import all functions in one line
const { getSchoolProfile, updateSchoolProfile, getJobApplicants, updateApplicationStatus, scheduleInterview, getSchoolJobs } = require('../controllers/schoolController');

// Middleware to check if user is a school
const schoolOnly = (req, res, next) => {
    if (req.user && req.user.role === 'school') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Schools only.' });
    }
};

// @route   GET & PUT api/schools/profile
// @desc    Get or Update the logged-in school's profile
// @access  Private (School only)
router.route('/profile')
  .get(auth, schoolOnly, getSchoolProfile)
  .put(auth, schoolOnly, updateSchoolProfile);

// @route   GET /api/schools/jobs/:jobId/applicants
// @desc    Get all applicants for one of the school's jobs
// @access  Private (School only)
router.get('/jobs/:jobId/applicants', auth, schoolOnly, getJobApplicants); 

// @route   PUT /api/schools/applications/:appId/status
// @desc    Update an application's status
// @access  Private (School only)
router.put('/applications/:appId/status', auth, schoolOnly, updateApplicationStatus);

// @route   POST /api/schools/applications/:appId/schedule-interview
// @desc    Schedule an interview for an application
// @access  Private (School only)
router.post('/applications/:appId/schedule-interview', auth, schoolOnly, scheduleInterview);

// @route   GET /api/schools/jobs
// @desc    Get all jobs for the logged-in school
// @access  Private (School only)
router.get('/jobs', auth, schoolOnly, getSchoolJobs);

module.exports = router;