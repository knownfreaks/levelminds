const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Job = require('./Job');
const StudentProfile = require('./StudentProfile');

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('applied', 'shortlisted', 'interview_scheduled', 'rejected'),
    defaultValue: 'applied',
  },
  // We can add fields for resume_url and other documents later
});

// --- Define Associations ---
// An application belongs to one Job and one Student
JobApplication.belongsTo(Job, { foreignKey: 'jobId' });
JobApplication.belongsTo(StudentProfile, { foreignKey: 'studentId' });

module.exports = JobApplication;