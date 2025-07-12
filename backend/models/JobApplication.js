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
         type: DataTypes.ENUM('applied', 'shortlisted', 'interview_scheduled', 'rejected'),
         defaultValue: 'applied',
         allowNull: true,
       },
     }, {
       tableName: 'JobApplications',
       timestamps: true,
     });

     module.exports = JobApplication;