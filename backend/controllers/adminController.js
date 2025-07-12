     const User = require('../models/User');
     const StudentProfile = require('../models/StudentProfile');
     const SchoolProfile = require('../models/SchoolProfile');
     const JobType = require('../models/JobType');
     const Subject = require('../models/Subject');
     const State = require('../models/State');
     const City = require('../models/City');
     const Skill = require('../models/Skill');
     const SubSkill = require('../models/SubSkill');
     const Helptkt = require('../models/Helptkt'); // Corrected import for Helptkt
     const Job = require('../models/Job');
     const JobApplication = require('../models/JobApplication');
     const xlsx = require('xlsx'); // For bulk upload placeholders

     // @desc    Get all users (students, schools, admins)
     // @route   GET /api/admin/users
     // @access  Private (Admin only)
     exports.getAllUsers = async (req, res) => {
       try {
         const users = await User.findAll({
           attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
           include: [
             {
               model: StudentProfile,
               attributes: ['first_name', 'last_name', 'mobile'],
               required: false
             },
             {
               model: SchoolProfile,
               attributes: ['school_name'],
               required: false
             }
           ],
           order: [['createdAt', 'DESC']]
         });

         res.json({ success: true, users });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Update a user's details (email only) by ID (Admin only)
     // @route   PUT /api/admin/users/:userId
     // @access  Private (Admin only)
     exports.updateUser = async (req, res) => {
       const userId = req.params.userId;
       const { email } = req.body;

       try {
         let user = await User.findByPk(userId);

         if (!user) {
           return res.status(404).json({ success: false, message: 'User not found' });
         }

         if (email !== undefined && email !== user.email) {
           const existingUser = await User.findOne({ where: { email } });
           if (existingUser && existingUser.id !== user.id) {
             return res.status(400).json({ success: false, message: 'Email already in use by another user.' });
           }
           await user.update({ email });
         }

         const updatedUser = await User.findByPk(userId, {
           attributes: ['id', 'email', 'role']
         });

         res.json({ success: true, message: 'User updated successfully', user: updatedUser });

       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Delete a user by ID (Admin only)
     // @route   DELETE /api/admin/users/:userId
     // @access  Private (Admin only)
     exports.deleteUser = async (req, res) => {
       const userId = req.params.userId;

       try {
         const user = await User.findByPk(userId);

         if (!user) {
           return res.status(404).json({ success: false, message: 'User not found' });
         }

         if (user.id === req.user.id) {
           return res.status(403).json({ success: false, message: 'Admins cannot delete their own account via this endpoint.' });
         }

         await user.destroy();
         res.json({ success: true, message: 'User removed successfully' });

       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Get all job types
     // @route   GET /api/admin/job-types
     // @access  Private (Admin only)
     exports.getJobTypes = async (req, res) => {
       try {
         const jobTypes = await JobType.findAll({ order: [['name', 'ASC']] });
         res.json({ success: true, jobTypes });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Create a new job type
     // @route   POST /api/admin/job-types
     // @access  Private (Admin only)
     exports.createJobType = async (req, res) => {
       try {
         const { name } = req.body;
         if (!name) {
           return res.status(400).json({ success: false, msg: 'Name is required' });
         }
         const newJobType = await JobType.create({ name });
         res.status(201).json({ success: true, message: 'Job type created successfully', jobType: newJobType });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Update a job type
     // @route   PUT /api/admin/job-types/:id
     // @access  Private (Admin only)
     exports.updateJobType = async (req, res) => {
         try {
             const { name } = req.body;
             const jobType = await JobType.findByPk(req.params.id);

             if (!jobType) {
                 return res.status(404).json({ success: false, msg: 'Job type not found' });
             }

             jobType.name = name || jobType.name;
             await jobType.save();
             res.json({ success: true, message: 'Job type updated successfully', jobType });
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Delete a job type
     // @route   DELETE /api/admin/job-types/:id
     // @access  Private (Admin only)
     exports.deleteJobType = async (req, res) => {
         try {
             const jobType = await JobType.findByPk(req.params.id);

             if (!jobType) {
                 return res.status(404).json({ success: false, msg: 'Job type not found' });
             }

             await jobType.destroy();
             res.json({ success: true, message: 'Job type removed' });
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Get all subjects
     // @route   GET /api/admin/subjects
     // @access  Private (Admin only)
     exports.getSubjects = async (req, res) => {
       try {
         const subjects = await Subject.findAll({ order: [['name', 'ASC']] });
         res.json({ success: true, subjects });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Create a new subject
     // @route   POST /api/admin/subjects
     // @access  Private (Admin only)
     exports.createSubject = async (req, res) => {
       try {
         const { name } = req.body;
         if (!name) {
           return res.status(400).json({ success: false, msg: 'Name is required' });
         }
         const newSubject = await Subject.create({ name });
         res.status(201).json({ success: true, message: 'Subject created successfully', subject: newSubject });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Update a subject
     // @route   PUT /api/admin/subjects/:id
     // @access  Private (Admin only)
     exports.updateSubject = async (req, res) => {
         try {
             const { name } = req.body;
             const subject = await Subject.findByPk(req.params.id);

             if (!subject) {
                 return res.status(404).json({ success: false, msg: 'Subject not found' });
             }

             subject.name = name || subject.name;
             await subject.save();
             res.json({ success: true, message: 'Subject updated successfully', subject });
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Delete a subject
     // @route   DELETE /api/admin/subjects/:id
     // @access  Private (Admin only)
     exports.deleteSubject = async (req, res) => {
         try {
             const subject = await Subject.findByPk(req.params.id);

             if (!subject) {
                 return res.status(404).json({ success: false, msg: 'Subject not found' });
             }

             await subject.destroy();
             res.json({ success: true, message: 'Subject removed' });
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Get all states
     // @route   GET /api/admin/states
     // @access  Private (Admin only)
     exports.getStates = async (req, res) => {
       try {
         const states = await State.findAll({ order: [['name', 'ASC']] });
         res.json({ success: true, states });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Create a new state
     // @route   POST /api/admin/states
     // @access  Private (Admin only)
     exports.createState = async (req, res) => {
       try {
         const { name } = req.body;
         if (!name) {
           return res.status(400).json({ success: false, msg: 'Name is required' });
         }
         const newState = await State.create({ name });
         res.status(201).json({ success: true, message: 'State created successfully', state: newState });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Update a state
     // @route   PUT /api/admin/states/:id
     // @access  Private (Admin only)
     exports.updateState = async (req, res) => {
         try {
             const { name } = req.body;
             const state = await State.findByPk(req.params.id);

             if (!state) {
                 return res.status(404).json({ success: false, msg: 'State not found' });
             }

             state.name = name || state.name;
             await state.save();
             res.json({ success: true, message: 'State updated successfully', state });
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Delete a state
     // @route   DELETE /api/admin/states/:id
     // @access  Private (Admin only)
     exports.deleteState = async (req, res) => {
         try {
             const state = await State.findByPk(req.params.id);

             if (!state) {
                 return res.status(404).json({ success: false, msg: 'State not found' });
             }

             await state.destroy();
             res.json({ success: true, message: 'State removed' });
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Get cities by state ID
     // @route   GET /api/admin/cities/by-state/:stateId
     // @access  Private (Admin only)
     exports.getCitiesByState = async (req, res) => {
       try {
         const cities = await City.findAll({ where: { stateId: req.params.stateId }, order: [['name', 'ASC']] });
         res.json({ success: true, cities });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Create a new city
     // @route   POST /api/admin/cities
     // @access  Private (Admin only)
     exports.createCity = async (req, res) => {
       try {
         const { name, stateId } = req.body;
         if (!name || !stateId) {
           return res.status(400).json({ success: false, msg: 'Name and stateId are required' });
         }
         const newCity = await City.create({ name, stateId });
         res.status(201).json({ success: true, message: 'City created successfully', city: newCity });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Update a city
     // @route   PUT /api/admin/cities/:id
     // @access  Private (Admin only)
     exports.updateCity = async (req, res) => {
         try {
             const { name, stateId } = req.body;
             const city = await City.findByPk(req.params.id);

             if (!city) {
                 return res.status(404).json({ success: false, msg: 'City not found' });
             }

             city.name = name || city.name;
             city.stateId = stateId || city.stateId;
             await city.save();
             res.json({ success: true, message: 'City updated successfully', city });
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Delete a city
     // @route   DELETE /api/admin/cities/:id
     // @access  Private (Admin only)
     exports.deleteCity = async (req, res) => {
         try {
             const city = await City.findByPk(req.params.id);

             if (!city) {
                 return res.status(404).json({ success: false, msg: 'City not found' });
             }

             await city.destroy();
             res.json({ success: true, message: 'City removed' });
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Get all job-related skills
     // @route   GET /api/admin/skills
     // @access  Private (Admin only)
     exports.getSkills = async (req, res) => {
       try {
         const skills = await Skill.findAll({ order: [['name', 'ASC']] });
         res.json({ success: true, skills });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Create a new job-related skill
     // @route   POST /api/admin/skills
     // @access  Private (Admin only)
     exports.createSkill = async (req, res) => {
       try {
         const { name, jobTypeId } = req.body;
         if (!name || !jobTypeId) {
           return res.status(400).json({ success: false, msg: 'Name and jobTypeId are required' });
         }
         const newSkill = await Skill.create({ name, jobTypeId });
         res.status(201).json({ success: true, message: 'Skill created successfully', skill: newSkill });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Update a job-related skill
     // @route   PUT /api/admin/skills/:id
     // @access  Private (Admin only)
     exports.updateSkill = async (req, res) => {
         try {
             const { name, jobTypeId } = req.body;
             const skill = await Skill.findByPk(req.params.id);

             if (!skill) {
                 return res.status(404).json({ success: false, msg: 'Skill not found' });
             }

             skill.name = name || skill.name;
             skill.jobTypeId = jobTypeId || skill.jobTypeId;
             await skill.save();
             res.json({ success: true, message: 'Skill updated successfully', skill });
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Delete a job-related skill
     // @route   DELETE /api/admin/skills/:id
     // @access  Private (Admin only)
     exports.deleteSkill = async (req, res) => {
         try {
             const skill = await Skill.findByPk(req.params.id);

             if (!skill) {
                 return res.status(404).json({ success: false, msg: 'Skill not found' });
             }

             await skill.destroy();
             res.json({ success: true, message: 'Skill removed' });
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Get job-related skills by job type
     // @route   GET /api/admin/skills/by-job-type/:jobTypeId
     // @access  Private (Admin only)
     exports.getSkillsByJobType = async (req, res) => {
       const SubSkill = require('../models/SubSkill');
       try {
         const skills = await Skill.findAll({ where: { jobTypeId: req.params.jobTypeId }, include: [SubSkill] });
         res.json({ success: true, skills });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Get all job-related sub-skills
     // @route   GET /api/admin/sub-skills
     // @access  Private (Admin only)
     exports.getSubSkills = async (req, res) => {
       try {
         const subSkills = await SubSkill.findAll({ order: [['name', 'ASC']] });
         res.json({ success: true, subSkills });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Create a new job-related sub-skill
     // @route   POST /api/admin/sub-skills
     // @access  Private (Admin only)
     exports.createSubSkill = async (req, res) => {
       try {
         const { name, skillId } = req.body;
         if (!name || !skillId) {
           return res.status(400).json({ success: false, msg: 'Name and skillId are required' });
         }
         const newSubSkill = await SubSkill.create({ name, skillId });
         res.status(201).json({ success: true, message: 'Sub-skill created successfully', subSkill: newSubSkill });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Update a job-related sub-skill
     // @route   PUT /api/admin/sub-skills/:id
     // @access  Private (Admin only)
     exports.updateSubSkill = async (req, res) => {
         try {
             const { name, skillId } = req.body;
             const subSkill = await SubSkill.findByPk(req.params.id);

             if (!subSkill) {
                 return res.status(404).json({ success: false, msg: 'Sub-skill not found' });
             }

             subSkill.name = name || subSkill.name;
             subSkill.skillId = skillId || subSkill.skillId;
             await subSkill.save();
             res.json({ success: true, message: 'Sub-skill updated successfully', subSkill });
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Delete a job-related sub-skill
     // @route   DELETE /api/admin/sub-skills/:id
     // @access  Private (Admin only)
     exports.deleteSubSkill = async (req, res) => {
         try {
             const subSkill = await SubSkill.findByPk(req.params.id);

             if (!subSkill) {
                 return res.status(404).json({ success: false, msg: 'Sub-skill not found' });
             }

             await subSkill.destroy();
             res.json({ success: true, message: 'Sub-skill removed' });
         } catch (err) {
             console.error(err.message);
             res.status(500).send('Server Error');
         }
     };

     // @desc    Get job-related sub-skills by parent skill
     // @route   GET /api/admin/sub-skills/by-skill/:skillId
     // @access  Private (Admin only)
     exports.getSubSkillsBySkill = async (req, res) => {
       try {
         const subSkills = await SubSkill.findAll({ where: { skillId: req.params.skillId }, order: [['name', 'ASC']] });
         res.json({ success: true, subSkills });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Get Admin Dashboard Metrics
     // @route   GET /api/admin/dashboard-metrics
     // @access  Private (Admin only)
     exports.getAdminDashboardMetrics = async (req, res) => {
       try {
         const totalUsers = await User.count();
         const totalStudents = await User.count({ where: { role: 'student' } });
         const totalSchools = await User.count({ where: { role: 'school' } });
         const totalJobs = await Job.count();
         const totalApplications = await JobApplication.count();
         const pendingApplications = await JobApplication.count({ where: { status: 'applied' } });
         const shortlistedApplications = await JobApplication.count({ where: { status: 'shortlisted' } });
         const scheduledInterviews = await JobApplication.count({ where: { status: 'interview_scheduled' } });

         res.json({
           success: true,
           metrics: {
             totalUsers,
             totalStudents,
             totalSchools,
             totalJobs,
             totalApplications,
             pendingApplications,
             shortlistedApplications,
             scheduledInterviews,
           }
         });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Get all help tickets
     // @route   GET /api/admin/help-tickets
     // @access  Private (Admin only)
     exports.getHelpTickets = async (req, res) => {
       try {
         const tickets = await Helptkt.findAll({ // Using Helptkt model
           order: [['createdAt', 'DESC']]
         });
         res.json({ success: true, tickets });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Update help ticket status
     // @route   PUT /api/admin/help-tickets/:ticketId
     // @access  Private (Admin only)
     exports.updateHelpTicketStatus = async (req, res) => {
       const { status } = req.body;
       const ticketId = req.params.ticketId;
       try {
         let ticket = await Helptkt.findByPk(ticketId); // Using Helptkt model
         if (!ticket) {
           return res.status(404).json({ success: false, msg: 'Help ticket not found' });
         }
         ticket.status = status || ticket.status;
         await ticket.save();
         res.json({ success: true, message: 'Help ticket updated successfully', ticket });
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
       }
     };

     // @desc    Bulk upload users from Excel
     // @route   POST /api/admin/users/bulk-upload
     // @access  Private (Admin only)
     exports.bulkUploadUsers = async (req, res) => {
         res.status(501).json({ success: false, message: 'Bulk user upload not yet implemented.' });
     };

     // @desc    Bulk upload student core skill scores from Excel
     // @route   POST /api/admin/scores/bulk-upload
     // @access  Private (Admin only)
     exports.bulkUploadScores = async (req, res) => {
         res.status(501).json({ success: false, message: 'Bulk score upload not yet implemented.' });
     };
     