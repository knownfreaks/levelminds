// Import all necessary models at the top of the file
const JobType = require('../models/JobType');
const Subject = require('../models/Subject');
const State = require('../models/State');
const City = require('../models/City');
const Skill = require('../models/Skill');
const SubSkill = require('../models/SubSkill');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const SchoolProfile = require('../models/SchoolProfile');

// --- Job Type Controllers ---

// @desc    Create a new job type
exports.createJobType = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ msg: 'Name is required' });
    }
    const newJobType = await JobType.create({ name });
    res.status(201).json(newJobType);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all job types
exports.getJobTypes = async (req, res) => {
  try {
    const jobTypes = await JobType.findAll({ order: [['name', 'ASC']] });
    res.json(jobTypes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a job type
exports.updateJobType = async (req, res) => {
    try {
        const { name } = req.body;
        const jobType = await JobType.findByPk(req.params.id);

        if (!jobType) {
            return res.status(404).json({ msg: 'Job type not found' });
        }

        jobType.name = name || jobType.name;
        await jobType.save();
        res.json(jobType);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a job type
exports.deleteJobType = async (req, res) => {
    try {
        const jobType = await JobType.findByPk(req.params.id);

        if (!jobType) {
            return res.status(404).json({ msg: 'Job type not found' });
        }

        await jobType.destroy();
        res.json({ msg: 'Job type removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Subject Controllers ---
exports.createSubject = async (req, res) => {
  try {
    const { name } = req.body;
    const newSubject = await Subject.create({ name });
    res.status(201).json(newSubject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({ order: [['name', 'ASC']] });
    res.json(subjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- State Controllers ---
exports.createState = async (req, res) => {
  try {
    const { name } = req.body;
    const newState = await State.create({ name });
    res.status(201).json(newState);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.getStates = async (req, res) => {
  try {
    const states = await State.findAll({ order: [['name', 'ASC']] });
    res.json(states);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- City Controllers ---
exports.createCity = async (req, res) => {
  try {
    const { name, stateId } = req.body;
    const newCity = await City.create({ name, stateId });
    res.status(201).json(newCity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.getCitiesByState = async (req, res) => {
  try {
    const cities = await City.findAll({ where: { stateId: req.params.stateId }, order: [['name', 'ASC']] });
    res.json(cities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- Skill Controllers ---
exports.createSkill = async (req, res) => {
  try {
    const { name, jobTypeId } = req.body;
    const newSkill = await Skill.create({ name, jobTypeId });
    res.status(201).json(newSkill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getSkillsByJobType = async (req, res) => {
  try {
    const skills = await Skill.findAll({ where: { jobTypeId: req.params.jobTypeId }, include: [SubSkill] });
    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- SubSkill Controllers ---
exports.createSubSkill = async (req, res) => {
  try {
    const { name, skillId } = req.body;
    const newSubSkill = await SubSkill.create({ name, skillId });
    res.status(201).json(newSubSkill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- Admin User Management Controllers ---

// @desc    Get all users (students, schools, admins)
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
      include: [
        {
          model: StudentProfile,
          attributes: ['first_name', 'last_name', 'mobile'],
          required: false
        },
        {
          model: SchoolProfile,
          attributes: ['school_name'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a user's details (email only) by ID (Admin only)
// @route   PUT /api/admin/users/:userId
// @access  Private (Admin only)
exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { email } = req.body; // Explicitly only destructure 'email'

  try {
    let user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Only update email if provided and different
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ msg: 'Email already in use by another user.' });
      }
      user.email = email;
    }

    // IMPORTANT: No other fields (like 'role') are considered for update here.
    // The 'role' property of the user object is NOT touched.

    await user.save();
    // Return the user's current state from the database, which should reflect
    // only the email change if it occurred, and the original role.
    res.json({ success: true, message: 'User updated successfully', user: { id: user.id, email: user.email, role: user.role } });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a user by ID (Admin only)
// @route   DELETE /api/admin/users/:userId
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return res.status(403).json({ msg: 'Admins cannot delete their own account via this endpoint.' });
    }

    await user.destroy(); // Sequelize will handle cascading deletes if set up in models
    res.json({ success: true, message: 'User removed successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
