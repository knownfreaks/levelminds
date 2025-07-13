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
    type: DataTypes.STRING,
    allowNull: false,
  },
  max_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
  },
}, {
  tableName: 'AssessmentSubSkills',
  timestamps: true,
});

module.exports = AssessmentSubSkill;