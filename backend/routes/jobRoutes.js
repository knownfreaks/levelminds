const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Correctly import all functions in one line
const { createJob, getAllJobs, applyForJob, getJobById, updateJob } = require('../controllers/jobController');

// Middleware to check if user is a school
const schoolOnly = (req, res, next) => {
    if (req.user && req.user.role === 'school') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Schools only.' });
    }
};

// Middleware to check if user is a student
const studentOnly = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Students only.' });
    }
};

// --- Job Routes ---

// School route to create a job
router.post('/', auth, schoolOnly, createJob);

// School route to update a specific job
router.put('/:id', auth, schoolOnly, updateJob);

// Student route to get all open jobs
router.get('/', auth, studentOnly, getAllJobs);

// Student route to get a single job's details
router.get('/:id', auth, studentOnly, getJobById);

// Student route to apply for a job
router.post('/:jobId/apply', auth, studentOnly, applyForJob);

module.exports = router;