const { DataTypes } = require('sequelize');
     const sequelize = require('../config/db');

     const AssessmentSkill = sequelize.define('AssessmentSkill', {
       id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
       },
       name: {
         type: DataTypes.STRING(255),
         allowNull: false,
         unique: true,
         comment: 'Name of the assessment skill (e.g., "Lesson Planning")',
       },
       description: {
         type: DataTypes.TEXT,
         allowNull: true,
         comment: 'Optional description for the skill',
       },
     }, {
       tableName: 'AssessmentSkills',
       timestamps: true,
     });

     module.exports = AssessmentSkill;