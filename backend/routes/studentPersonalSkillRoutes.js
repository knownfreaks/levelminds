const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our security middleware
const {
  createPersonalSkill,
  getPersonalSkills,
  updatePersonalSkill,
  deletePersonalSkill
} = require('../controllers/studentPersonalSkillController'); // Import controller functions

// Middleware to check if user is a student
const studentOnly = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Students only.' });
    }
};

// @route   POST /api/students/profile/my-skills
// @desc    Add a new personal skill
// @access  Private (Student only)
router.post('/', auth, studentOnly, createPersonalSkill);

// @route   GET /api/students/profile/my-skills
// @desc    Get all personal skills for the logged-in student
// @access  Private (Student only)
router.get('/', auth, studentOnly, getPersonalSkills);

// @route   PUT /api/students/profile/my-skills/:skillId
// @desc    Update a specific personal skill
// @access  Private (Student only)
router.put('/:skillId', auth, studentOnly, updatePersonalSkill);

// @route   DELETE /api/students/profile/my-skills/:skillId
// @desc    Delete a specific personal skill
// @access  Private (Student only)
router.delete('/:skillId', auth, studentOnly, deletePersonalSkill);

module.exports = router;