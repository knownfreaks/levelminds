     const SchoolProfile = require('../models/SchoolProfile');
     const User = require('../models/User');
     const Job = require('../models/Job');
     const JobApplication = require('../models/JobApplication');
     const StudentProfile = require('../models/StudentProfile');
     const Interview = require('../models/Interview');
     const JobType = require('../models/JobType');
     const Subject = require('../models/Subject');

     // @desc    Get the profile for the logged-in school
     exports.getSchoolProfile = async (req, res) => {
       try {
         const profile = await SchoolProfile.findOne({
           where: { userId: req.user.id },
           include: [{ model: User, attributes: ['email'] }]
         });
         if (!profile) {
           return res.status(404).json({ msg: 'School profile not found' });
         }
         res.json(profile);
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Update the profile for the logged-in school
     exports.updateSchoolProfile = async (req, res) => {
       const { school_name, logo_url, about, website, address, cityId, stateId, pincode } = req.body;
       try {
         const profile = await SchoolProfile.findOne({ where: { userId: req.user.id } });
         if (!profile) {
           return res.status(404).json({ msg: 'School profile not found' });
         }
         profile.school_name = school_name || profile.school_name;
         profile.logo_url = logo_url || profile.logo_url;
         profile.about = about || profile.about;
         profile.website = website || profile.website;
         profile.address = address || profile.address;
         profile.cityId = cityId || profile.cityId;
         profile.stateId = stateId || profile.stateId;
         profile.pincode = pincode || profile.pincode;
         await profile.save();
         res.json(profile);
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Get all jobs posted by the logged-in school
     exports.getSchoolJobs = async (req, res) => {
         try {
             const schoolProfile = await SchoolProfile.findOne({ where: { userId: req.user.id } });
             if (!schoolProfile) {
                 return res.status(404).json({ msg: 'School profile not found.' });
             }
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

     // @desc    Get all applicants for a specific job posted by the school
     exports.getJobApplicants = async (req, res) => {
         try {
             const schoolProfile = await SchoolProfile.findOne({ where: { userId: req.user.id } });
             if (!schoolProfile) { return res.status(404).json({ msg: 'School profile not found.' }); }
             const jobId = req.params.jobId;
             const job = await Job.findOne({ where: { id: jobId, schoolId: schoolProfile.id } });
             if (!job) { return res.status(403).json({ msg: 'Access denied. This job does not belong to your school.' }); }
             const applications = await JobApplication.findAll({
                 where: { jobId: jobId },
                 include: [{ model: StudentProfile, attributes: ['first_name', 'last_name', 'image_url', 'about'], include: [{ model: User, attributes: ['email'] }] }]
             });
             res.json(applications);
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Update the status of a job application
     exports.updateApplicationStatus = async (req, res) => {
         try {
             const { status } = req.body;
             const applicationId = req.params.appId;
             const schoolProfile = await SchoolProfile.findOne({ where: { userId: req.user.id } });
             if (!schoolProfile) { return res.status(404).json({ msg: 'School profile not found.' }); }
             const application = await JobApplication.findOne({
                 where: { id: applicationId },
                 include: [{ model: Job, where: { schoolId: schoolProfile.id }, attributes: [] }]
             });
             if (!application) { return res.status(403).json({ msg: "Access denied. This application does not belong to one of your school's jobs." }); }
             application.status = status;
             await application.save();
             res.json(application);
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Schedule an interview for an application
     exports.scheduleInterview = async (req, res) => {
         const { interview_date, interview_time, location } = req.body;
         const applicationId = req.params.appId;
         try {
             const schoolProfile = await SchoolProfile.findOne({ where: { userId: req.user.id } });
             if (!schoolProfile) { return res.status(404).json({ msg: 'School profile not found.' }); }
             const application = await JobApplication.findOne({
                 where: { id: applicationId },
                 include: [{ model: Job, where: { schoolId: schoolProfile.id }, attributes: [] }]
             });
             if (!application) { return res.status(403).json({ msg: "Access denied. Application not found for your school." }); }
             const newInterview = await Interview.create({
                 applicationId: application.id,
                 interview_date,
                 interview_time,
                 location: location || schoolProfile.address,
             });
             application.status = 'interview_scheduled';
             await application.save();
             res.status(201).json(newInterview);
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Get School Dashboard Metrics
     // @route   GET /api/schools/dashboard-metrics
     // @access  Private (School only)
     exports.getSchoolDashboardMetrics = async (req, res) => {
       try {
         const schoolProfile = await SchoolProfile.findOne({ where: { userId: req.user.id } });
         if (!schoolProfile) {
           return res.status(404).json({ success: false, msg: 'School profile not found.' });
         }

         const totalJobsPosted = await Job.count({ where: { schoolId: schoolProfile.id } });
         const totalApplicationsReceived = await JobApplication.count({
           include: [{ model: Job, where: { schoolId: schoolProfile.id }, attributes: [] }]
         });
         const shortlistedApplications = await JobApplication.count({
           where: { status: 'shortlisted' },
           include: [{ model: Job, where: { schoolId: schoolProfile.id }, attributes: [] }]
         });
         const interviewsScheduled = await JobApplication.count({
           where: { status: 'interview_scheduled' },
           include: [{ model: Job, where: { schoolId: schoolProfile.id }, attributes: [] }]
         });

         res.json({
           success: true,
           metrics: {
             totalJobsPosted,
             totalApplicationsReceived,
             shortlistedApplications,
             interviewsScheduled,
           }
         });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };
     