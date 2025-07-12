const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const AssessmentSkillCategory = require('./AssessmentSkillCategory'); // Import category model

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
  // Foreign key for AssessmentSkillCategory
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: AssessmentSkillCategory,
      key: 'id',
    },
    allowNull: true, // Each skill must belong to a category
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL', // If a category is deleted, skills can remain but categoryId becomes null
  },
}, {
  tableName: 'AssessmentSkills', // Explicitly define table name
  timestamps: true,
});

// Define associations
AssessmentSkillCategory.hasMany(AssessmentSkill, { foreignKey: 'categoryId', as: 'assessmentSkills' });
AssessmentSkill.belongsTo(AssessmentSkillCategory, { foreignKey: 'categoryId' });

module.exports = AssessmentSkill;