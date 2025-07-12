const { DataTypes } = require('sequelize');
     const sequelize = require('../config/db');

     const StudentSubSkillScore = sequelize.define('StudentSubSkillScore', {
       id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
       },
       score: {
         type: DataTypes.INTEGER,
         allowNull: false,
         validate: {
           min: 0,
           max: 10
         },
         comment: 'Score obtained for this specific sub-skill (out of 10)',
       },
     }, {
       tableName: 'StudentSubSkillScores',
       timestamps: true,
       indexes: [
         {
           unique: true,
           fields: ['assessmentId', 'subSkillId']
         }
       ]
     });

     module.exports = StudentSubSkillScore;