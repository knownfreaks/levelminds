
     const { DataTypes } = require('sequelize');
     const sequelize = require('../config/db');

     const StudentProfile = sequelize.define('StudentProfile', {
       id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
       },
       first_name: {
         type: DataTypes.STRING(100),
         allowNull: false,
       },
       last_name: {
         type: DataTypes.STRING(100),
         allowNull: false,
       },
       gender: {
         type: DataTypes.STRING(50),
         allowNull: true,
       },
       mobile: {
         type: DataTypes.STRING(20),
         allowNull: true,
         unique: true,
       },
       about: {
         type: DataTypes.TEXT,
         allowNull: true,
       },
       image_url: {
         type: DataTypes.TEXT,
         allowNull: true,
         comment: 'URL for the student\'s profile picture.',
       },
       college_name: {
         type: DataTypes.STRING(255),
         allowNull: true,
       },
       university_name: {
         type: DataTypes.STRING(255),
         allowNull: true,
       },
       course_name: {
         type: DataTypes.STRING(255),
         allowNull: true,
       },
       course_year: {
         type: DataTypes.STRING(50),
         allowNull: true,
       },
     }, {
       tableName: 'StudentProfiles',
       timestamps: true,
     });

     module.exports = StudentProfile;