const { SchoolProfile, User, Job, JobApplication, StudentProfile, Interview, City, State } = require('../models');
const { createNotification } = require('../services/notificationService');

// @desc    Complete school onboarding
// @route   PUT /api/schools/onboarding
// @access  Private (School only)
exports.completeOnboarding = async (req, res) => {
    const { logo_url, about, website, address, cityId, stateId, pincode } = req.body;
    try {
        const profile = await SchoolProfile.findOne({ where: { userId: req.user.id } });
        if (!profile) return res.status(404).json({ msg: 'School profile not found' });

        profile.logo_url = logo_url;
        profile.about = about;
        profile.website = website;
        profile.address = address;
        profile.cityId = cityId;
        profile.stateId = stateId;
        profile.pincode = pincode;
        await profile.save();

        const user = await User.findByPk(req.user.id);
        user.onboarded = true;
        await user.save();

        res.json({ success: true, message: "Onboarding complete!", profile });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get the profile for the logged-in school
// @route   GET /api/schools/profile
// @access  Private (School only)
exports.getSchoolProfile = async (req, res) => {
  try {
    const profile = await SchoolProfile.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, attributes: ['email'] }, {model: City}, {model: State}]
    });
    if (!profile) return res.status(404).json({ msg: 'School profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all jobs posted by the logged-in school
// @route   GET /api/schools/jobs
// @access  Private (School only)
exports.getSchoolJobs = async (req, res) => {
    try {
        const schoolProfile = await SchoolProfile.findOne({ where: { userId: req.user.id } });
        if (!schoolProfile) return res.status(404).json({ msg: 'School profile not found.' });
        
        const jobs = await Job.findAll({
            where: { schoolId: schoolProfile.id },
            order: [['createdAt', 'DESC']],
            include: [ JobType, Subject ]
        });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all applicants for a specific job
// @route   GET /api/schools/jobs/:jobId/applicants
// @access  Private (School only)
exports.getJobApplicants = async (req, res) => {
    try {
        const schoolProfile = await SchoolProfile.findOne({ where: { userId: req.user.id } });
        if (!schoolProfile) return res.status(404).json({ msg: 'School profile not found.' });
        
        const applications = await JobApplication.findAll({
            where: { jobId: req.params.jobId },
            include: [{
                model: Job,
                where: { schoolId: schoolProfile.id },
                attributes: []
            }, {
                model: StudentProfile,
                attributes: ['id', 'first_name', 'last_name', 'image_url'],
                include: [{ model: User, attributes: ['email'] }]
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update the status of a job application
// @route   PUT /api/schools/applications/:appId/status
// @access  Private (School only)
exports.updateApplicationStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const application = await JobApplication.findByPk(req.params.appId, {
            include: [{ model: Job, attributes: ['title'] }, { model: StudentProfile, include: [User]}]
        });
        if (!application) return res.status(404).json({ msg: 'Application not found' });

        // TODO: Add check to ensure school owns this job application
        
        application.status = status;
        await application.save();

        // Notify student of status change
        await createNotification(
            application.StudentProfile.User.id,
            `Your application for "${application.Job.title}" was updated to: ${status}`,
            `/teacher/applications` // A potential route on frontend
        );

        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Schedule an interview for an application
// @route   POST /api/schools/applications/:appId/schedule-interview
// @access  Private (School only)
exports.scheduleInterview = async (req, res) => {
    const { interview_date, start_time, end_time, location } = req.body;
    try {
        const application = await JobApplication.findByPk(req.params.appId, {
            include: [{ model: Job, attributes: ['title'] }, { model: StudentProfile, include: [User]}]
        });
        if (!application) return res.status(404).json({ msg: "Application not found." });

        const newInterview = await Interview.create({
            applicationId: application.id,
            title: `Interview for ${application.Job.title}`,
            interview_date,
            start_time,
            end_time,
            location,
        });

        application.status = 'interview_scheduled';
        await application.save();

        // Notify student of the interview
        await createNotification(
            application.StudentProfile.User.id,
            `You have an interview scheduled for "${application.Job.title}"`,
            `/teacher/schedule`
        );
        
        res.status(201).json(newInterview);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a specific applicant's full profile
// @route   GET /api/schools/applicants/:studentId
// @access  Private (School only)
exports.getApplicantProfile = async (req, res) => {
    try {
        // In a real app, you'd first verify the school has access to this student
        // (e.g., the student has applied to one of their jobs).
        const profile = await StudentProfile.findOne({
            where: { id: req.params.studentId },
            include: [
                { model: User, attributes: ['email'] },
                { model: Certificate, as: 'certifications' },
                { model: StudentPersonalSkill, as: 'personalSkills' },
                // Include core skills assessment
            ]
        });
        if (!profile) return res.status(404).json({ msg: 'Applicant profile not found' });
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};