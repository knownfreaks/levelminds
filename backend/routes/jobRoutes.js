const express = require('express');
     const router = express.Router();
     const auth = require('../middleware/auth');

     const { createJob, getAllJobs, applyForJob, getJobById, updateJob } = require('../controllers/jobController');

     const studentOnly = (req, res, next) => {
         if (req.user && req.user.role === 'student') {
             next();
         } else {
             res.status(403).json({ msg: 'Access denied. Students only.' });
         }
     };

     const schoolOnly = (req, res, next) => {
         if (req.user && req.user.role === 'school') {
             next();
         } else {
             res.status(403).json({ msg: 'Access denied. Schools only.' });
         }
     };

     router.post('/', auth, schoolOnly, createJob);
     router.get('/', auth, getAllJobs);
     router.post('/:jobId/apply', auth, studentOnly, applyForJob);
     router.get('/:id', auth, getJobById);
     router.put('/:id', auth, schoolOnly, updateJob);

     module.exports = router;