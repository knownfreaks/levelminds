const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const JobApplication = require('./JobApplication');

const Interview = sequelize.define('Interview', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Scheduled Interview'
  },
  interview_date: {
    type: DataTypes.DATEONLY, // Stores only the date (YYYY-MM-DD)
    allowNull: false,
  },
  interview_time: {
    type: DataTypes.TIME, // Stores only the time
    allowNull: false,
  },
  location: {
    type: DataTypes.TEXT,
  },
});

// --- Define Associations ---
// An Interview belongs to one Job Application
Interview.belongsTo(JobApplication, { foreignKey: 'applicationId' });
JobApplication.hasOne(Interview, { foreignKey: 'applicationId' });

module.exports = Interview;