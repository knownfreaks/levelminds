const express = require('express');
     const router = express.Router();
     const auth = require('../middleware/auth');

     const {
       getStudentProfile,
       updateStudentProfile,
       getStudentSchedule,
       getStudentApplications,
       getStudentCoreSkillsAssessments,
       submitHelpTicket
     } = require('../controllers/studentController');

     const studentOnly = (req, res, next) => {
         if (req.user && req.user.role === 'student') {
             next();
         } else {
             res.status(403).json({ msg: 'Access denied. Students only.' });
         }
     };

     router.route('/profile')
       .get(auth, studentOnly, getStudentProfile)
       .put(auth, studentOnly, updateStudentProfile);

     router.get('/schedule', auth, studentOnly, getStudentSchedule);
     router.get('/applications', auth, studentOnly, getStudentApplications);
     router.get('/profile/core-skills-assessments', auth, studentOnly, getStudentCoreSkillsAssessments);

     router.post('/help', auth, studentOnly, submitHelpTicket);

     module.exports = router;