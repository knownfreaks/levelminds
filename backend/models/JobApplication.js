const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('applied', 'shortlisted', 'interview_scheduled', 'rejected', 'hired'),
    defaultValue: 'applied',
    allowNull: false,
  },
}, {
  tableName: 'JobApplications',
  timestamps: true,
});

module.exports = JobApplication;