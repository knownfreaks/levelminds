const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StudentSkillAssessment = sequelize.define('StudentSkillAssessment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  total_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'StudentSkillAssessments',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['studentId', 'assessmentSkillId']
    }
  ]
});

module.exports = StudentSkillAssessment;