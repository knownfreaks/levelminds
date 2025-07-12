const User = require('../models/User');
// We will add the Profile models here later

// Controller to get the logged-in user's data
exports.getMyProfile = async (req, res) => {
  try {
    // req.user.id is added by the auth middleware
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }, // Don't send the password back
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // For now, we just return the basic user info.
    // Later, we will find the detailed student/school profile and send that too.
    res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};