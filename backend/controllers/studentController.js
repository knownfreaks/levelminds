// Import all necessary models at the top, only once
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const Interview = require('../models/Interview');
const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const SchoolProfile = require('../models/SchoolProfile');

// @desc    Get the profile for the logged-in student
exports.getStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, attributes: ['email'] }]
    });
    if (!profile) {
      return res.status(404).json({ msg: 'Student profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update the profile for the logged-in student
exports.updateStudentProfile = async (req, res) => {
  const {
    first_name,
    last_name,
    gender,
    mobile,
    about,
    image_url,
    college_name,
    university_name,
    course_name,
    course_year
  } = req.body;
  try {
    const profile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ msg: 'Student profile not found' });
    }
    profile.first_name = first_name || profile.first_name;
    profile.last_name = last_name || profile.last_name;
    profile.gender = gender || profile.gender;
    profile.mobile = mobile || profile.mobile;
    profile.about = about || profile.about;
    profile.image_url = image_url || profile.image_url;
    profile.college_name = college_name || profile.college_name;
    profile.university_name = university_name || profile.university_name;
    profile.course_name = course_name || profile.course_name;
    profile.course_year = course_year || profile.course_year;
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all scheduled interviews for the logged-in student
exports.getStudentSchedule = async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    if (!studentProfile) {
      return res.status(404).json({ msg: 'Student profile not found.' });
    }

    const interviews = await Interview.findAll({
      include: [{
        model: JobApplication,
        where: { studentId: studentProfile.id },
        // attributes: [], // <--- THIS WAS THE BUG. IT HAS BEEN REMOVED.
        include: [{
          model: Job,
          attributes: ['title'],
          include: [{
            model: SchoolProfile,
            attributes: ['school_name']
          }]
        }]
      }],
      order: [['interview_date', 'ASC'], ['interview_time', 'ASC']]
    });

    res.json(interviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all applications for the logged-in student
// @route   GET /api/students/applications
// @access  Private (Student only)
exports.getStudentApplications = async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    if (!studentProfile) {
      return res.status(404).json({ msg: 'Student profile not found.' });
    }

    // Find all applications for this student and include the job details
    const applications = await JobApplication.findAll({
      where: { studentId: studentProfile.id },
      include: [{
        model: Job,
        attributes: ['title'],
        include: [{
          model: SchoolProfile,
          attributes: ['school_name']
        }]
      }],
      order: [['updatedAt', 'DESC']] // Show most recently updated applications first
    });

    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all applications for the logged-in student
// @route   GET /api/students/applications
// @access  Private (Student only)
exports.getStudentApplications = async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    if (!studentProfile) {
      return res.status(404).json({ msg: 'Student profile not found.' });
    }

    // Find all applications for this student and include the job details
    const applications = await JobApplication.findAll({
      where: { studentId: studentProfile.id },
      include: [{
        model: Job,
        attributes: ['title'],
        include: [{
          model: SchoolProfile,
          attributes: ['school_name']
        }]
      }],
      order: [['updatedAt', 'DESC']] // Show most recently updated applications first
    });

    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};