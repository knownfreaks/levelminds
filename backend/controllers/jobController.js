const { Op } = require('sequelize');
const { Job, SchoolProfile, JobType, Subject, State, City, JobApplication, StudentProfile, AssessmentSkill, StudentSkillAssessment, Setting } = require('../models');
const { createNotification } = require('../services/notificationService');

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (School only)
exports.createJob = async (req, res) => {
  const { title, jobTypeId, application_deadline, subjectId, min_salary, max_salary, description, responsibilities, requirements } = req.body;

  try {
    const schoolProfile = await SchoolProfile.findOne({ where: { userId: req.user.id } });
    if (!schoolProfile) {
      return res.status(404).json({ msg: 'School profile not found.' });
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

// @desc    Get all open job postings (for Students, with matching logic)
// @route   GET /api/jobs
// @access  Private (Student only)
exports.getAllJobsForStudent = async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    if (!studentProfile) {
      return res.status(404).json({ msg: 'Student profile not found.' });
    }

    // Check if job matching is enabled
    const jobMatchingSetting = await Setting.findOne({ where: { key: 'jobMatching' } });
    const isJobMatchingEnabled = jobMatchingSetting ? jobMatchingSetting.value.enabled : true; // Default to true if not set

    let whereClause = {
      status: 'open',
      application_deadline: { [Op.gte]: new Date() }
    };

    if (isJobMatchingEnabled) {
      // 1. Find all AssessmentSkills the student has been assessed on.
      const studentAssessments = await StudentSkillAssessment.findAll({
        where: { studentId: studentProfile.id },
        attributes: ['assessmentSkillId']
      });
      const studentSkillIds = studentAssessments.map(a => a.assessmentSkillId);

      if (studentSkillIds.length > 0) {
        // 2. Find all JobTypes that are linked to those AssessmentSkills.
        const relevantJobTypes = await JobType.findAll({
          include: [{
            model: AssessmentSkill,
            where: { id: { [Op.in]: studentSkillIds } },
            attributes: [], // Don't need to return the skill details
            through: { attributes: [] } // Don't need the join table details
          }],
          attributes: ['id']
        });
        const relevantJobTypeIds = relevantJobTypes.map(jt => jt.id);
        
        // 3. Filter jobs by these JobTypes
        if (relevantJobTypeIds.length > 0) {
            whereClause.jobTypeId = { [Op.in]: relevantJobTypeIds };
        } else {
            // If student has skills but they don't match any job types, show no jobs.
            return res.json([]);
        }
      } else {
        // If student has no skills assessed, show no jobs based on matching logic.
        return res.json([]);
      }
    }

    const jobs = await Job.findAll({
      where: whereClause,
      include: [
        {
          model: SchoolProfile,
          attributes: ['school_name', 'logo_url'],
          include: [
              { model: City, attributes: ['name'] },
              { model: State, attributes: ['name'] }
          ]
        },
        { model: JobType, attributes: ['name'] },
        { model: Subject, attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
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

    const job = await Job.findByPk(req.params.jobId);
    if (!job) {
        return res.status(404).json({ msg: 'Job not found.' });
    }

    const existingApplication = await JobApplication.findOne({
      where: { studentId: studentProfile.id, jobId: job.id },
    });

    if (existingApplication) {
      return res.status(400).json({ msg: 'You have already applied for this job.' });
    }

    const newApplication = await JobApplication.create({
      studentId: studentProfile.id,
      jobId: job.id,
    });

    // Notify the school
    const school = await SchoolProfile.findByPk(job.schoolId, { include: User });
    if (school && school.User) {
        await createNotification(
            school.User.id,
            `${studentProfile.first_name} ${studentProfile.last_name} applied for your job: "${job.title}"`,
            `/school/jobs/${job.id}/applicants`
        );
    }

    res.status(201).json(newApplication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single job by its ID
// @route   GET /api/jobs/:id
// @access  Private
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        {
          model: SchoolProfile,
          attributes: ['school_name', 'logo_url', 'about', 'website', 'address', 'pincode'],
          include: [
              { model: City, attributes: ['name'] },
              { model: State, attributes: ['name'] }
          ]
        },
        { model: JobType, attributes: ['name'] },
        { model: Subject, attributes: ['name'] }
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