const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const SchoolProfile = require('./SchoolProfile');
const JobType = require('./JobType');
const Subject = require('./Subject');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  application_deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  min_salary: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  max_salary: {
    type: DataTypes.INTEGER,
  },
  description: {
    type: DataTypes.TEXT,
  },
  responsibilities: {
    type: DataTypes.TEXT,
  },
  requirements: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    defaultValue: 'open',
  },
});

// --- Define Associations ---
// A Job belongs to one School
Job.belongsTo(SchoolProfile, { foreignKey: 'schoolId' });
// A Job has one JobType
Job.belongsTo(JobType, { foreignKey: 'jobTypeId' });
// A Job has one Subject
Job.belongsTo(Subject, { foreignKey: 'subjectId' });

module.exports = Job;