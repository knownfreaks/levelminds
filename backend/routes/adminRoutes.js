    const express = require('express');
    const router = express.Router();
    const auth = require('../middleware/auth'); // Our security middleware

    // Import all the necessary controller functions, including the new user management ones
    const {
      createJobType, getJobTypes, updateJobType, deleteJobType,
      createSubject, getSubjects,
      createState, getStates,
      createCity, getCitiesByState,
      createSkill, getSkillsByJobType,
      createSubSkill,
      getAllUsers, // Existing
      updateUser,  // NEW
      deleteUser   // NEW
    } = require('../controllers/adminController');

    // Middleware to check if the user has the 'admin' role
    const adminOnly = (req, res, next) => {
        if (req.user && req.user.role === 'admin') {
            next(); // If user is an admin, proceed to the next function
        } else {
            // If not an admin, send an error response
            res.status(403).json({ msg: 'Access denied. Admins only.' });
        }
    };

    // --- Job Type Routes ---
    router.post('/job-types', auth, adminOnly, createJobType);
    router.get('/job-types', auth, getJobTypes);
    router.put('/job-types/:id', auth, adminOnly, updateJobType);
    router.delete('/job-types/:id', auth, adminOnly, deleteJobType);

    // --- Subject Routes ---
    router.post('/subjects', auth, adminOnly, createSubject);
    router.get('/subjects', auth, getSubjects);

    // --- State Routes ---
    router.post('/states', auth, adminOnly, createState);
    router.get('/states', auth, getStates);

    // --- City Routes ---
    router.post('/cities', auth, adminOnly, createCity);
    router.get('/cities/by-state/:stateId', auth, getCitiesByState);

    // --- Skill & Sub-skill Routes ---
    router.post('/skills', auth, adminOnly, createSkill);
    router.get('/skills/by-job-type/:jobTypeId', auth, getSkillsByJobType);
    router.post('/sub-skills', auth, adminOnly, createSubSkill);

    // --- User Management Routes (Admin Only) ---
    // @route   GET /api/admin/users
    // @desc    Get all users (students, schools, admins)
    // @access  Private (Admin only)
    router.get('/users', auth, adminOnly, getAllUsers);

    // @route   PUT /api/admin/users/:userId
    // @desc    Update a user's details or role
    // @access  Private (Admin only)
    router.put('/users/:userId', auth, adminOnly, updateUser);

    // @route   DELETE /api/admin/users/:userId
    // @desc    Delete a user
    // @access  Private (Admin only)
    router.delete('/users/:userId', auth, adminOnly, deleteUser);

    module.exports = router;
    