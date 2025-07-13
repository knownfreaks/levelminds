const sequelize = require('../config/db');
const User = require('./User');
const StudentProfile = require('./StudentProfile');
const SchoolProfile = require('./SchoolProfile');
const Job = require('./Job');
const JobApplication = require('./JobApplication');
const Interview = require('./Interview');
const JobType = require('./JobType');
const Subject = require('./Subject');
const State = require('./State');
const City = require('./City');
const Certificate = require('./Certificate');
const StudentPersonalSkill = require('./StudentPersonalSkill');
const AssessmentSkillCategory = require('./AssessmentSkillCategory');
const AssessmentSkill = require('./AssessmentSkill');
const AssessmentSubSkill = require('./AssessmentSubSkill');
const StudentSkillAssessment = require('./StudentSkillAssessment');
const StudentSubSkillScore = require('./StudentSubSkillScore');
const Helptkt = require('./Helptkt');
const Notification = require('./Notification');
const Setting = require('./Setting');

// --- Define Associations (Centralized) ---

// User and Profiles
User.hasOne(StudentProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
StudentProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(SchoolProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
SchoolProfile.belongsTo(User, { foreignKey: 'userId' });

// SchoolProfile and Location
State.hasMany(City, { foreignKey: 'stateId', onDelete: 'CASCADE' });
City.belongsTo(State, { foreignKey: 'stateId' });

SchoolProfile.belongsTo(State, { foreignKey: 'stateId', onDelete: 'SET NULL' });
SchoolProfile.belongsTo(City, { foreignKey: 'cityId', onDelete: 'SET NULL' });

// Job and related models
JobType.hasMany(Job, { foreignKey: 'jobTypeId' });
Job.belongsTo(JobType, { foreignKey: 'jobTypeId' });

Subject.hasMany(Job, { foreignKey: 'subjectId' });
Job.belongsTo(Subject, { foreignKey: 'subjectId' });

SchoolProfile.hasMany(Job, { foreignKey: 'schoolId' });
Job.belongsTo(SchoolProfile, { foreignKey: 'schoolId' });

// Job Applications and related models
Job.hasMany(JobApplication, { foreignKey: 'jobId' });
JobApplication.belongsTo(Job, { foreignKey: 'jobId' });

StudentProfile.hasMany(JobApplication, { foreignKey: 'studentId' });
JobApplication.belongsTo(StudentProfile, { foreignKey: 'studentId' });

// Interviews
JobApplication.hasOne(Interview, { foreignKey: 'applicationId' });
Interview.belongsTo(JobApplication, { foreignKey: 'applicationId' });

// Student Personal Skills & Certificates
StudentProfile.hasMany(StudentPersonalSkill, { foreignKey: 'studentId', as: 'personalSkills' });
StudentPersonalSkill.belongsTo(StudentProfile, { foreignKey: 'studentId' });

StudentProfile.hasMany(Certificate, { foreignKey: 'studentId', as: 'certifications' });
Certificate.belongsTo(StudentProfile, { foreignKey: 'studentId' });

// Assessment Skills Hierarchy
AssessmentSkillCategory.hasMany(AssessmentSkill, { foreignKey: 'categoryId', as: 'assessmentSkills' });
AssessmentSkill.belongsTo(AssessmentSkillCategory, { foreignKey: 'categoryId' });

AssessmentSkill.hasMany(AssessmentSubSkill, { foreignKey: 'skillId', as: 'assessmentSubSkills' });
AssessmentSubSkill.belongsTo(AssessmentSkill, { foreignKey: 'skillId' });

// JobType (Category) to AssessmentSkill (Many-to-Many)
const JobTypeAssessmentSkill = sequelize.define('JobTypeAssessmentSkill', {}, { timestamps: false });
JobType.belongsToMany(AssessmentSkill, { through: JobTypeAssessmentSkill });
AssessmentSkill.belongsToMany(JobType, { through: JobTypeAssessmentSkill });

// Student Skill Assessments (Core Skills)
StudentProfile.hasMany(StudentSkillAssessment, { foreignKey: 'studentId', as: 'skillAssessments' });
StudentSkillAssessment.belongsTo(StudentProfile, { foreignKey: 'studentId' });

AssessmentSkill.hasMany(StudentSkillAssessment, { foreignKey: 'assessmentSkillId', as: 'studentAssessments' });
StudentSkillAssessment.belongsTo(AssessmentSkill, { foreignKey: 'assessmentSkillId' });

StudentSkillAssessment.hasMany(StudentSubSkillScore, { foreignKey: 'assessmentId', as: 'subSkillScores' });
StudentSubSkillScore.belongsTo(StudentSkillAssessment, { foreignKey: 'assessmentId' });

AssessmentSubSkill.hasMany(StudentSubSkillScore, { foreignKey: 'subSkillId', as: 'studentScores' });
StudentSubSkillScore.belongsTo(AssessmentSubSkill, { foreignKey: 'subSkillId' });

// Help Tickets
User.hasMany(Helptkt, { foreignKey: 'userId' });
Helptkt.belongsTo(User, { foreignKey: 'userId' });

// Notifications
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  StudentProfile,
  SchoolProfile,
  Job,
  JobApplication,
  Interview,
  JobType,
  Subject,
  State,
  City,
  Certificate,
  StudentPersonalSkill,
  AssessmentSkillCategory,
  AssessmentSkill,
  AssessmentSubSkill,
  StudentSkillAssessment,
  StudentSubSkillScore,
  Helptkt,
  Notification,
  Setting,
  JobTypeAssessmentSkill,
};