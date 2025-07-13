const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AssessmentSkillCategory = sequelize.define('AssessmentSkillCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'AssessmentSkillCategories',
  timestamps: true,
});

module.exports = AssessmentSkillCategory;