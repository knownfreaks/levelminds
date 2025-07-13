const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, StudentProfile, SchoolProfile } = require('../models');

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
    
    let profileData = {};
    if (user.role === 'student') {
        const studentProfile = await StudentProfile.findOne({ where: { userId: user.id }, attributes: ['first_name', 'last_name', 'image_url'] });
        profileData = studentProfile;
    } else if (user.role === 'school') {
        const schoolProfile = await SchoolProfile.findOne({ where: { userId: user.id }, attributes: ['school_name', 'logo_url'] });
        profileData = schoolProfile;
    }

    res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            onboarded: user.onboarded,
            profile: profileData,
        },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get the currently logged-in user's data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'role', 'onboarded'],
        });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};