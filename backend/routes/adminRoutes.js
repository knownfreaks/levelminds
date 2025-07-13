const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createUser, getAllUsers, updateUser, deleteUser,
  getAdminDashboardMetrics,
  jobTypes, subjects, states, cities, getCitiesByState,
  assessmentCategories, assessmentSkills, assessmentSubSkills,
  getHelpTickets, updateHelpTicketStatus,
  bulkUploadUsers, bulkUploadScores
} = require('../controllers/adminController');

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ msg: 'Access denied. Admins only.' });
};

// User Management
router.post('/users', auth, adminOnly, createUser);
router.get('/users', auth, adminOnly, getAllUsers);
router.put('/users/:userId', auth, adminOnly, updateUser);
router.delete('/users/:userId', auth, adminOnly, deleteUser);

// Dashboard
router.get('/dashboard-metrics', auth, adminOnly, getAdminDashboardMetrics);

// Master Data: Job Types, Subjects, States, Cities
router.get('/job-types', auth, adminOnly, jobTypes.getAll);
router.post('/job-types', auth, adminOnly, jobTypes.create);
router.put('/job-types/:id', auth, adminOnly, jobTypes.update);
router.delete('/job-types/:id', auth, adminOnly, jobTypes.delete);

router.get('/subjects', auth, adminOnly, subjects.getAll);
router.post('/subjects', auth, adminOnly, subjects.create);
router.put('/subjects/:id', auth, adminOnly, subjects.update);
router.delete('/subjects/:id', auth, adminOnly, subjects.delete);

router.get('/states', auth, adminOnly, states.getAll);
router.post('/states', auth, adminOnly, states.create);
router.put('/states/:id', auth, adminOnly, states.update);
router.delete('/states/:id', auth, adminOnly, states.delete);

router.get('/cities/by-state/:stateId', auth, adminOnly, getCitiesByState);
router.post('/cities', auth, adminOnly, cities.create);
router.put('/cities/:id', auth, adminOnly, cities.update);
router.delete('/cities/:id', auth, adminOnly, cities.delete);

// Master Data: Assessment Skills
router.get('/assessment-skill-categories', auth, adminOnly, assessmentCategories.getAll);
router.post('/assessment-skill-categories', auth, adminOnly, assessmentCategories.create);
router.put('/assessment-skill-categories/:id', auth, adminOnly, assessmentCategories.update);
router.delete('/assessment-skill-categories/:id', auth, adminOnly, assessmentCategories.delete);

router.get('/assessment-skills', auth, adminOnly, assessmentSkills.getAll);
router.post('/assessment-skills', auth, adminOnly, assessmentSkills.create);
router.put('/assessment-skills/:id', auth, adminOnly, assessmentSkills.update);
router.delete('/assessment-skills/:id', auth, adminOnly, assessmentSkills.delete);

router.get('/assessment-sub-skills', auth, adminOnly, assessmentSubSkills.getAll);
router.post('/assessment-sub-skills', auth, adminOnly, assessmentSubSkills.create);
router.put('/assessment-sub-skills/:id', auth, adminOnly, assessmentSubSkills.update);
router.delete('/assessment-sub-skills/:id', auth, adminOnly, assessmentSubSkills.delete);

// Help Tickets
router.get('/help-tickets', auth, adminOnly, getHelpTickets);
router.put('/help-tickets/:ticketId', auth, adminOnly, updateHelpTicketStatus);

// Bulk Uploads
router.post('/users/bulk-upload', auth, adminOnly, bulkUploadUsers);
router.post('/scores/bulk-upload', auth, adminOnly, bulkUploadScores);

module.exports = router;