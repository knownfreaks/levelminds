const { DataTypes } = require('sequelize');
     const sequelize = require('../config/db');

     const AssessmentSubSkill = sequelize.define('AssessmentSubSkill', {
       id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
       },
       name: {
         type: DataTypes.STRING(255),
         allowNull: false,
         comment: 'Name of the assessment sub-skill (e.g., "Classroom Rules Enforcement")',
       },
       max_score: {
         type: DataTypes.INTEGER,
         allowNull: false,
         defaultValue: 10,
         validate: {
           min: 0,
           max: 10
         },
         comment: 'Maximum possible score for this sub-skill',
       },
     }, {
       tableName: 'AssessmentSubSkills',
       timestamps: true,
     });

     module.exports = AssessmentSubSkill;