     const StudentProfile = require('../models/StudentProfile');
     const User = require('../models/User');
     const Interview = require('../models/Interview');
     const JobApplication = require('../models/JobApplication');
     const Job = require('../models/Job');
     const SchoolProfile = require('../models/SchoolProfile');
     const StudentSkillAssessment = require('../models/StudentSkillAssessment');
     const AssessmentSkill = require('../models/AssessmentSkill');
     const AssessmentSubSkill = require('../models/AssessmentSubSkill');
     const StudentSubSkillScore = require('../models/StudentSubSkillScore');
     const Helptkt = require('../models/Helptkt'); // <-- Import Helptkt model
     const sequelize = require('../config/db');
     const { sendEmail } = require('../services/emailService'); // Import email service

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
     exports.getStudentApplications = async (req, res) => {
       try {
         const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
         if (!studentProfile) {
           return res.status(404).json({ msg: 'Student profile not found.' });
         }
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
           order: [['updatedAt', 'DESC']]
         });
         res.json(applications);
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // --- Get Student Core Skills Assessments ---

     // @desc    Get a student's core skill assessment scores
     // @route   GET /api/students/profile/core-skills-assessments
     // @access  Private (Student only)
     exports.getStudentCoreSkillsAssessments = async (req, res) => {
       try {
         const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
         if (!studentProfile) {
           return res.status(404).json({ msg: 'Student profile not found.' });
         }

         const assessments = await StudentSkillAssessment.findAll({
           where: { studentId: studentProfile.id },
           include: [
             {
               model: AssessmentSkill,
               attributes: ['name', 'description'],
               include: [
                 {
                   model: AssessmentSubSkill,
                   as: 'assessmentSubSkills',
                   attributes: ['id', 'name', 'max_score']
                 }
               ]
             },
             {
               model: StudentSubSkillScore,
               as: 'subSkillScores',
               attributes: ['subSkillId', 'score']
             }
           ],
           order: [[AssessmentSkill, 'name', 'ASC']]
         });

         const formattedAssessments = assessments.map(assessment => {
           const skillData = assessment.AssessmentSkill;
           const subScoresMap = {};
           if (assessment.subSkillScores && Array.isArray(assessment.subSkillScores)) {
             assessment.subSkillScores.forEach(s => {
               subScoresMap[s.subSkillId] = s.score;
             });
           }

           const subSkillsWithScores = skillData.assessmentSubSkills.map(sub => ({
             id: sub.id,
             name: sub.name,
             max_score: sub.max_score,
             score: subScoresMap[sub.id] !== undefined ? subScoresMap[sub.id] : null
           }));

           return {
             id: assessment.id,
             skill_name: skillData.name,
             skill_description: skillData.description,
             total_score: assessment.total_score,
             out_of: 40,
             sub_skills: subSkillsWithScores,
             createdAt: assessment.createdAt,
             updatedAt: assessment.updatedAt
           };
         });

         res.json({ success: true, assessments: formattedAssessments });

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

         // Optionally, send an email notification to admin
         const adminUser = await User.findOne({ where: { role: 'admin' } });
         if (adminUser && adminUser.email) {
           const userEmail = req.user.email;
           const emailHtml = `
             <p>A new help ticket has been submitted by ${userEmail}.</p>
             <p><strong>Subject:</strong> ${subject}</p>
             <p><strong>Description:</strong> ${description}</p>
             <p>Ticket ID: ${newTicket.id}</p>
             <p>Please log in to the admin panel to view and manage this ticket.</p>
           `;
           await sendEmail(adminUser.email, `New Help Ticket: ${subject}`, emailHtml);
         }

         res.status(201).json({ success: true, message: 'Help ticket submitted successfully', ticket: newTicket });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };
     