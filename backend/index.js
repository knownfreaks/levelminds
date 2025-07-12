     const express = require('express');
     const { Sequelize, DataTypes } = require('sequelize');
     const cors = require('cors');
     require('dotenv').config();
     const path = require('path');

     // --- Initialize Sequelize instance ---
     const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
       host: process.env.PG_HOST,
       dialect: 'postgres',
       logging: false, // Set to true to see SQL queries in console
     });

     // --- Import and Define Models ---
     const User = require('./models/User');
     const StudentProfile = require('./models/StudentProfile');
     const SchoolProfile = require('./models/SchoolProfile');
     const Job = require('./models/Job');
     const JobApplication = require('./models/JobApplication');
     const Interview = require('./models/Interview');
     const JobType = require('./models/JobType');
     const Subject = require('./models/Subject');
     const State = require('./models/State');
     const City = require('./models/City');
     const Skill = require('./models/Skill');
     const SubSkill = require('./models/SubSkill');
     const Certificate = require('./models/Certificate');
     const StudentPersonalSkill = require('./models/StudentPersonalSkill');
     const AssessmentSkillCategory = require('./models/AssessmentSkillCategory');
     const AssessmentSkill = require('./models/AssessmentSkill');
     const AssessmentSubSkill = require('./models/AssessmentSubSkill');
     const StudentSkillAssessment = require('./models/StudentSkillAssessment');
     const StudentSubSkillScore = require('./models/StudentSubSkillScore');
     const Helptkt = require('./models/Helptkt'); // <-- CORRECTED: Changed to Helptkt

     // --- Define Associations (Centralized) ---
     // User and Profiles
     User.hasOne(StudentProfile, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
     StudentProfile.belongsTo(User, { foreignKey: 'userId' });

     User.hasOne(SchoolProfile, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
     SchoolProfile.belongsTo(User, { foreignKey: 'userId' });

     // SchoolProfile and Location
     State.hasMany(City, { foreignKey: 'stateId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
     City.belongsTo(State, { foreignKey: 'stateId' });

     SchoolProfile.belongsTo(State, { foreignKey: 'stateId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
     SchoolProfile.belongsTo(City, { foreignKey: 'cityId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

     // Job and related models
     JobType.hasMany(Job, { foreignKey: 'jobTypeId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
     Job.belongsTo(JobType, { foreignKey: 'jobTypeId' });

     Subject.hasMany(Job, { foreignKey: 'subjectId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
     Job.belongsTo(Subject, { foreignKey: 'subjectId' });

     SchoolProfile.hasMany(Job, { foreignKey: 'schoolId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
     Job.belongsTo(SchoolProfile, { foreignKey: 'schoolId' });

     // Job Applications and related models
     Job.hasMany(JobApplication, { foreignKey: 'jobId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
     JobApplication.belongsTo(Job, { foreignKey: 'jobId' });

     StudentProfile.hasMany(JobApplication, { foreignKey: 'studentId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
     JobApplication.belongsTo(StudentProfile, { foreignKey: 'studentId' });

     // Interviews
     JobApplication.hasOne(Interview, { foreignKey: 'applicationId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
     Interview.belongsTo(JobApplication, { foreignKey: 'applicationId' });

     // JobType and Skill/SubSkill (Original job-related skills)
     JobType.hasMany(Skill, { foreignKey: 'jobTypeId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
     Skill.belongsTo(JobType, { foreignKey: 'jobTypeId' });

     Skill.hasMany(SubSkill, { foreignKey: 'skillId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
     SubSkill.belongsTo(Skill, { foreignKey: 'skillId' });

     // Student Personal Skills
     StudentProfile.hasMany(StudentPersonalSkill, { foreignKey: 'studentId', as: 'personalSkills', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
     StudentPersonalSkill.belongsTo(StudentProfile, { foreignKey: 'studentId' });

     // Student Certifications
     StudentProfile.hasMany(Certificate, { foreignKey: 'studentId', as: 'certifications', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
     Certificate.belongsTo(StudentProfile, { foreignKey: 'studentId' });

     // Assessment Skills Hierarchy
     AssessmentSkillCategory.hasMany(AssessmentSkill, { foreignKey: 'categoryId', as: 'assessmentSkills', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
     AssessmentSkill.belongsTo(AssessmentSkillCategory, { foreignKey: 'categoryId' });

     AssessmentSkill.hasMany(AssessmentSubSkill, { foreignKey: 'skillId', as: 'assessmentSubSkills', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
     AssessmentSubSkill.belongsTo(AssessmentSkill, { foreignKey: 'skillId' });

     // Student Skill Assessments (Core Skills)
     StudentProfile.hasMany(StudentSkillAssessment, { foreignKey: 'studentId', as: 'skillAssessments', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
     StudentSkillAssessment.belongsTo(StudentProfile, { foreignKey: 'studentId' });

     AssessmentSkill.hasMany(StudentSkillAssessment, { foreignKey: 'assessmentSkillId', as: 'studentAssessments', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
     StudentSkillAssessment.belongsTo(AssessmentSkill, { foreignKey: 'assessmentSkillId' });

     // Student Sub-Skill Scores
     StudentSkillAssessment.hasMany(StudentSubSkillScore, { foreignKey: 'assessmentId', as: 'subSkillScores', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
     StudentSubSkillScore.belongsTo(StudentSkillAssessment, { foreignKey: 'assessmentId' });

     AssessmentSubSkill.hasMany(StudentSubSkillScore, { foreignKey: 'subSkillId', as: 'studentScores', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
     StudentSubSkillScore.belongsTo(AssessmentSubSkill, { foreignKey: 'subSkillId' });

     // Help Tickets
     User.hasMany(Helptkt, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' }); // <-- NEW ASSOCIATION for Helptkt
     Helptkt.belongsTo(User, { foreignKey: 'userId' }); // <-- NEW ASSOCIATION for Helptkt


     // --- Express App Setup ---
     const app = express();

     // Middleware
     app.use(cors());
     app.use(express.json());

     // Test DB Connection
     sequelize
       .authenticate()
       .then(() => console.log('Database connected...'))
       .catch((err) => console.log('Error: ' + err));

     // Sync database & create tables if they don't exist
     sequelize.sync({ alter: true })
       .then(() => console.log('Tables created successfully!'))
       .catch(err => console.error('Unable to create tables:', err));

     // Serve static files from the 'uploads' directory
     app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

     // Routes
     app.get('/', (req, res) => res.send('API is running...'));
     app.use('/api/auth', require('./routes/authRoutes'));
     app.use('/api/upload-image', require('./routes/uploadRoutes'));
     app.use('/api/admin', require('./routes/adminRoutes'));
     app.use('/api/schools', require('./routes/schoolRoutes'));
     app.use('/api/profile', require('./routes/profileRoutes'));
     app.use('/api/jobs', require('./routes/jobRoutes'));
     app.use('/api/students', require('./routes/studentRoutes'));
     app.use('/api/students/profile/certifications', require('./routes/certificationRoutes'));
     app.use('/api/students/profile/my-skills', require('./routes/studentPersonalSkillRoutes'));
     app.use('/api/admin', require('./routes/assessmentMasterRoutes'));


     const PORT = process.env.PORT || 5000;

     app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
     