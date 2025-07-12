// Import all necessary models and operators at the top
const { Op } = require('sequelize');
const Job = require('../models/Job');
const SchoolProfile = require('../models/SchoolProfile');
const JobType = require('../models/JobType');
const Subject = require('../models/Subject');
const State = require('../models/State');
const City = require('../models/City');
const JobApplication = require('../models/JobApplication');
const StudentProfile = require('../models/StudentProfile');

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (School only)
exports.createJob = async (req, res) => {
  const {
    title,
    jobTypeId,
    application_deadline,
    subjectId,
    min_salary,
    max_salary,
    description,
    responsibilities,
    requirements,
  } = req.body;

  try {
    const schoolProfile = await SchoolProfile.findOne({ where: { userId: req.user.id } });
    if (!schoolProfile) {
      return res.status(404).json({ msg: 'School profile not found to post a job' });
    }

    const newJob = await Job.create({
      title,
      jobTypeId,
      application_deadline,
      subjectId,
      min_salary,
      max_salary,
      description,
      responsibilities,
      requirements,
      schoolId: schoolProfile.id,
    });

    res.status(201).json(newJob);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all open job postings
// @route   GET /api/jobs
// @access  Private (Student only)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: {
        status: 'open',
        application_deadline: {
          [Op.gte]: new Date()
        }
      },
      include: [
        {
          model: SchoolProfile,
          attributes: ['school_name', 'logo_url'],
          include: [
              { model: City, attributes: ['name'] },
              { model: State, attributes: ['name'] }
          ]
        },
        {
          model: JobType,
          attributes: ['name']
        },
        {
          model: Subject,
          attributes: ['name']
        }
      ],
      order: [['createdAt', 'DESC']] // Use createdAt instead of posted_at
    });

    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:jobId/apply
// @access  Private (Student only)
exports.applyForJob = async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    if (!studentProfile) {
      return res.status(404).json({ msg: 'Student profile not found.' });
    }

    const jobId = req.params.jobId;

    // Check if the student has already applied for this job
    const existingApplication = await JobApplication.findOne({
      where: {
        studentId: studentProfile.id,
        jobId: jobId,
      },
    });

    if (existingApplication) {
      return res.status(400).json({ msg: 'You have already applied for this job.' });
    }

    const newApplication = await JobApplication.create({
      studentId: studentProfile.id,
      jobId: jobId,
    });

    res.status(201).json(newApplication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single job by its ID
// @route   GET /api/jobs/:id
// @access  Private (All logged-in users)
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      // Include all the rich details needed for the job details page
      include: [
        {
          model: SchoolProfile,
          attributes: ['school_name', 'logo_url', 'about', 'website', 'address', 'pincode'],
          include: [
              { model: City, attributes: ['name'] },
              { model: State, attributes: ['name'] }
          ]
        },
        {
          model: JobType,
          attributes: ['name']
        },
        {
          model: Subject,
          attributes: ['name']
        }
      ]
    });

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a job by its ID
// @route   PUT /api/jobs/:id
// @access  Private (School only, owner of the job)
exports.updateJob = async (req, res) => {
  const {
    title,
    application_deadline,
    min_salary,
    max_salary,
    description,
    responsibilities,
    requirements,
    status, // Allow status update as well (e.g., 'closed')
    jobTypeId,
    subjectId
  } = req.body;

  try {
    // Find the job by ID
    let job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Verify if the logged-in user (school) owns this job
    const schoolProfile = await SchoolProfile.findOne({ where: { userId: req.user.id } });
    if (!schoolProfile || job.schoolId !== schoolProfile.id) {
      return res.status(403).json({ msg: 'Access denied. You do not own this job.' });
    }

    // Update fields if provided in the request body
    job.title = title || job.title;
    job.application_deadline = application_deadline || job.application_deadline;
    job.min_salary = min_salary || job.min_salary;
    job.max_salary = max_salary || job.max_salary;
    job.description = description || job.description;
    job.responsibilities = responsibilities || job.responsibilities;
    job.requirements = requirements || job.requirements;
    job.status = status || job.status;
    job.jobTypeId = jobTypeId || job.jobTypeId;
    job.subjectId = subjectId || job.subjectId;

    await job.save();
    res.json(job);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};