const express = require('express');
     const router = express.Router();
     const auth = require('../middleware/auth');
     const {
       getAllUsers, updateUser, deleteUser,
       createJobType, getJobTypes, updateJobType, deleteJobType,
       createSubject, getSubjects, updateSubject, deleteSubject,
       createState, getStates, updateState, deleteState,
       createCity, getCitiesByState, updateCity, deleteCity,
       createSkill, getSkills, updateSkill, deleteSkill, getSkillsByJobType,
       createSubSkill, getSubSkills, updateSubSkill, deleteSubSkill, getSubSkillsBySkill,
       getAdminDashboardMetrics,
       getHelpTickets, updateHelpTicketStatus,
       bulkUploadUsers, bulkUploadScores // Add bulk upload functions
     } = require('../controllers/adminController');

     const adminOnly = (req, res, next) => {
         if (req.user && req.user.role === 'admin') {
             next();
         } else {
             res.status(403).json({ msg: 'Access denied. Admins only.' });
         }
     };

     // User Management
     router.get('/users', auth, adminOnly, getAllUsers);
     router.put('/users/:userId', auth, adminOnly, updateUser);
     router.delete('/users/:userId', auth, adminOnly, deleteUser);

     // Job Type Management
     router.post('/job-types', auth, adminOnly, createJobType);
     router.get('/job-types', auth, getJobTypes);
     router.put('/job-types/:id', auth, adminOnly, updateJobType);
     router.delete('/job-types/:id', auth, adminOnly, deleteJobType);

     // Subject Management
     router.post('/subjects', auth, adminOnly, createSubject);
     router.get('/subjects', auth, getSubjects);
     router.put('/subjects/:id', auth, adminOnly, updateSubject);
     router.delete('/subjects/:id', auth, adminOnly, deleteSubject);

     // State Management
     router.post('/states', auth, adminOnly, createState);
     router.get('/states', auth, getStates);
     router.put('/states/:id', auth, adminOnly, updateState);
     router.delete('/states/:id', auth, adminOnly, deleteState);

     // City Management
     router.post('/cities', auth, adminOnly, createCity);
     router.get('/cities/by-state/:stateId', auth, getCitiesByState);
     router.put('/cities/:id', auth, adminOnly, updateCity);
     router.delete('/cities/:id', auth, adminOnly, deleteCity);

     // Job-related Skill Management
     router.post('/skills', auth, adminOnly, createSkill);
     router.get('/skills', auth, getSkills);
     router.get('/skills/by-job-type/:jobTypeId', auth, getSkillsByJobType);
     router.put('/skills/:id', auth, adminOnly, updateSkill);
     router.delete('/skills/:id', auth, adminOnly, deleteSkill);

     // Job-related Sub-skill Management
     router.post('/sub-skills', auth, adminOnly, createSubSkill);
     router.get('/sub-skills', auth, getSubSkills);
     router.get('/sub-skills/by-skill/:skillId', auth, getSubSkillsBySkill);
     router.put('/sub-skills/:id', auth, adminOnly, updateSubSkill);
     router.delete('/sub-skills/:id', auth, adminOnly, deleteSubSkill);

     // Admin Dashboard Metrics
     router.get('/dashboard-metrics', auth, adminOnly, getAdminDashboardMetrics);

     // Help Ticket Management
     router.get('/help-tickets', auth, adminOnly, getHelpTickets);
     router.put('/help-tickets/:ticketId', auth, adminOnly, updateHelpTicketStatus);

     // Bulk Operations (Placeholders)
     router.post('/users/bulk-upload', auth, adminOnly, bulkUploadUsers);
     router.post('/scores/bulk-upload', auth, adminOnly, bulkUploadScores);

     module.exports = router;