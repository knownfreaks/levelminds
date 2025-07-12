const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const SchoolProfile = require('../models/SchoolProfile');

// Helper function to get user's display name
const getUserDisplayName = async (user) => {
  let userName = user.email; // Default to email

  if (user.role === 'student') {
    const studentProfile = await StudentProfile.findOne({ where: { userId: user.id } });
    if (studentProfile) {
      userName = `${studentProfile.first_name || ''} ${studentProfile.last_name || ''}`.trim();
      if (!userName) userName = user.email; // Fallback if names are empty
    }
  } else if (user.role === 'school') {
    const schoolProfile = await SchoolProfile.findOne({ where: { userId: user.id } });
    if (schoolProfile) {
      userName = schoolProfile.school_name || user.email; // Fallback if school_name is empty
    }
  }
  return userName;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { email, password, role, name } = req.body; // Expect 'name' for registration

  try {
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = await User.create({
      email,
      password: hashedPassword, // Use hashed password
      role
    });

    // Create associated profile based on role
    if (role === 'student') {
      await StudentProfile.create({
        userId: user.id,
        first_name: name ? name.split(' ')[0] : '', // Safely split name
        last_name: name ? name.split(' ').slice(1).join(' ') : '', // Safely split name
      });
    } else if (role === 'school') {
      await SchoolProfile.create({
        userId: user.id,
        school_name: name || 'New School', // Use provided name or default
      });
    }
    // No profile needed for 'admin' role initially

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      async (err, token) => { // Use async callback to await getUserDisplayName
        if (err) throw err;

        const userName = await getUserDisplayName(user); // Get display name for response

        res.status(201).json({
          success: true,
          message: "Registration successful",
          user: {
            id: user.id,
            name: userName,
            email: user.email,
            role: user.role
          },
          token
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

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

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      async (err, token) => { // Use async callback to await getUserDisplayName
        if (err) throw err;

        const userName = await getUserDisplayName(user); // Get display name for response

        res.json({
          success: true,
          message: "Login successful",
          user: {
            id: user.id,
            name: userName,
            email: user.email,
            role: user.role
          },
          token
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
