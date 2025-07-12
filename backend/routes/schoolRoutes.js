const express = require('express');
     const router = express.Router();
     const auth = require('../middleware/auth');
     const {
       getSchoolProfile,
       updateSchoolProfile,
       getJobApplicants,
       updateApplicationStatus,
       scheduleInterview,
       getSchoolJobs,
       getSchoolDashboardMetrics
     } = require('../controllers/schoolController');

     const schoolOnly = (req, res, next) => {
         if (req.user && req.user.role === 'school') {
             next();
         } else {
             res.status(403).json({ msg: 'Access denied. Schools only.' });
         }
     };

     router.route('/profile')
       .get(auth, schoolOnly, getSchoolProfile)
       .put(auth, schoolOnly, updateSchoolProfile);

     router.get('/jobs', auth, schoolOnly, getSchoolJobs);
     router.get('/jobs/:jobId/applicants', auth, schoolOnly, getJobApplicants);
     router.put('/applications/:appId/status', auth, schoolOnly, updateApplicationStatus);
     router.post('/applications/:appId/schedule-interview', auth, schoolOnly, scheduleInterview);

     router.get('/dashboard-metrics', auth, schoolOnly, getSchoolDashboardMetrics);

     module.exports = router;