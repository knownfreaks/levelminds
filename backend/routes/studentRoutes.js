const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Correctly import all functions in one line
const { getStudentProfile, updateStudentProfile, getStudentSchedule, getStudentApplications } = require('../controllers/studentController');

// Middleware to check if user is a student
const studentOnly = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Students only.' });
    }
};

// @route   GET & PUT api/students/profile
// @desc    Get or Update the logged-in student's profile
// @access  Private (Student only)
router.route('/profile')
  .get(auth, studentOnly, getStudentProfile)
  .put(auth, studentOnly, updateStudentProfile);

// @route   GET /api/students/schedule
// @desc    Get the student's interview schedule
// @access  Private (Student only)
router.get('/schedule', auth, studentOnly, getStudentSchedule);

// @route   GET /api/students/applications
// @desc    Get all of the student's job applications
// @access  Private (Student only)
router.get('/applications', auth, studentOnly, getStudentApplications);

module.exports = router;