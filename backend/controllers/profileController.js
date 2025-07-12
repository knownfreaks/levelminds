const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile'); // Import StudentProfile
const SchoolProfile = require('../models/SchoolProfile'); // Import SchoolProfile

// @desc    Get the logged-in user's profile (generic, fetches role-specific profile)
// @route   GET /api/profile
// @access  Private (All logged-in users)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let profileData = user.toJSON(); // Start with user data

    // Fetch and include role-specific profile data
    if (user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ where: { userId: user.id } });
      profileData.studentProfile = studentProfile;
    } else if (user.role === 'school') {
      const schoolProfile = await SchoolProfile.findOne({ where: { userId: user.id } });
      profileData.schoolProfile = schoolProfile;
    }

    res.json({ success: true, profile: profileData });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update generic user profile (placeholder - use role-specific APIs instead)
// @route   PUT /api/profile
// @access  Private (All logged-in users)
exports.updateProfile = async (req, res) => {
  // This API is a placeholder. For actual profile updates,
  // use /api/students/profile (PUT) or /api/schools/profile (PUT).
  // This generic update is complex to implement correctly for all roles and fields.
  res.status(501).json({ success: false, message: 'Generic profile update API not implemented. Use /api/students/profile or /api/schools/profile instead.' });
};