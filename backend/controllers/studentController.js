const { StudentProfile, User, Interview, JobApplication, Job, SchoolProfile, StudentSkillAssessment, AssessmentSkill, AssessmentSubSkill, StudentSubSkillScore, Helptkt, Certificate, StudentPersonalSkill, Notification } = require('../models');
const { createNotification } = require('../services/notificationService');

// @desc    Complete student onboarding
// @route   PUT /api/students/onboarding
// @access  Private (Student only)
exports.completeOnboarding = async (req, res) => {
    const { first_name, last_name, mobile, about, image_url, college_name, university_name, course_name, course_year, certifications, personalSkills } = req.body;
    try {
        const profile = await StudentProfile.findOne({ where: { userId: req.user.id } });
        if (!profile) return res.status(404).json({ msg: 'Student profile not found' });

        // Update profile fields
        profile.first_name = first_name;
        profile.last_name = last_name;
        profile.mobile = mobile;
        profile.about = about;
        profile.image_url = image_url;
        profile.college_name = college_name;
        profile.university_name = university_name;
        profile.course_name = course_name;
        profile.course_year = course_year;
        await profile.save();

        // Handle certifications
        if (certifications && certifications.length) {
            await Certificate.destroy({ where: { studentId: profile.id } }); // Clear existing
            const certsToCreate = certifications.map(c => ({ ...c, studentId: profile.id }));
            await Certificate.bulkCreate(certsToCreate);
        }

        // Handle personal skills
        if (personalSkills && personalSkills.length) {
            await StudentPersonalSkill.destroy({ where: { studentId: profile.id } }); // Clear existing
            const skillsToCreate = personalSkills.map(s => ({ skill_name: s, studentId: profile.id }));
            await StudentPersonalSkill.bulkCreate(skillsToCreate);
        }

        const user = await User.findByPk(req.user.id);
        user.onboarded = true;
        await user.save();

        res.json({ success: true, message: "Onboarding complete!", profile });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// @desc    Get the profile for the logged-in student
// @route   GET /api/students/profile
// @access  Private (Student only)
exports.getStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      where: { userId: req.user.id },
      include: [
          { model: User, attributes: ['email'] },
          { model: Certificate, as: 'certifications' },
          { model: StudentPersonalSkill, as: 'personalSkills' },
          {
              model: StudentSkillAssessment,
              as: 'skillAssessments',
              include: [
                  {
                      model: AssessmentSkill,
                      attributes: ['name'],
                  },
                  {
                      model: StudentSubSkillScore,
                      as: 'subSkillScores',
                      include: [{ model: AssessmentSubSkill, attributes: ['name', 'max_score'] }]
                  }
              ]
          }
      ]
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

// @desc    Get all scheduled interviews for the logged-in student
// @route   GET /api/students/schedule
// @access  Private (Student only)
exports.getStudentSchedule = async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    if (!studentProfile) return res.status(404).json({ msg: 'Student profile not found.' });

    const interviews = await Interview.findAll({
      include: [{
        model: JobApplication,
        where: { studentId: studentProfile.id },
        include: [{
          model: Job,
          attributes: ['title'],
          include: [{ model: SchoolProfile, attributes: ['school_name'] }]
        }]
      }],
      order: [['interview_date', 'ASC'], ['start_time', 'ASC']]
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
    if (!studentProfile) return res.status(404).json({ msg: 'Student profile not found.' });

    const applications = await JobApplication.findAll({
      where: { studentId: studentProfile.id },
      include: [{
        model: Job,
        attributes: ['title'],
        include: [{ model: SchoolProfile, attributes: ['school_name', 'logo_url'] }]
      }],
      order: [['updatedAt', 'DESC']]
    });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Submit a help ticket
// @route   POST /api/students/help
// @access  Private (Student only)
exports.submitHelpTicket = async (req, res) => {
  const { subject, description } = req.body;
  if (!subject || !description) {
    return res.status(400).json({ success: false, message: 'Subject and description are required.' });
  }
  try {
    const newTicket = await Helptkt.create({
      userId: req.user.id,
      subject,
      description,
      status: 'open'
    });

    // Notify all admins
    const admins = await User.findAll({ where: { role: 'admin' } });
    for (const admin of admins) {
        await createNotification(admin.id, `New help ticket submitted: "${subject}"`, '/admin/help-tickets');
    }

    res.status(201).json({ success: true, message: 'Help ticket submitted successfully', ticket: newTicket });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.json({ success: true, notifications });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Mark notifications as read
// @route   PUT /api/notifications/read
// @access  Private
exports.markNotificationsRead = async (req, res) => {
    try {
        await Notification.update(
            { read: true },
            { where: { userId: req.user.id, read: false } }
        );
        res.json({ success: true, message: 'Notifications marked as read.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};