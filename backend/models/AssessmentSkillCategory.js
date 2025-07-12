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
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    comment: 'Name of the assessment skill category (e.g., "Pedagogical Skills")',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Optional description for the category',
  },
}, {
  tableName: 'AssessmentSkillCategories', // Explicitly define table name
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = AssessmentSkillCategory;