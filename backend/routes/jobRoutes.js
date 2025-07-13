const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { createJob, getAllJobsForStudent, applyForJob, getJobById } = require('../controllers/jobController');

const studentOnly = (req, res, next) => {
    if (req.user && req.user.role === 'student') return next();
    res.status(403).json({ msg: 'Access denied. Students only.' });
};

const schoolOnly = (req, res, next) => {
    if (req.user && req.user.role === 'school') return next();
    res.status(403).json({ msg: 'Access denied. Schools only.' });
};

router.post('/', auth, schoolOnly, createJob);
router.get('/', auth, studentOnly, getAllJobsForStudent);
router.post('/:jobId/apply', auth, studentOnly, applyForJob);
router.get('/:id', auth, getJobById); // Accessible by all logged-in users

module.exports = router;