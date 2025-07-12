const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const AssessmentSkill = require('./AssessmentSkill'); // Import parent skill model

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
  max_score: { // To define the 'out of 10' part
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10, // Default to 10 as per your spec
    comment: 'Maximum possible score for this sub-skill',
  },
  // Foreign key for AssessmentSkill
  skillId: {
    type: DataTypes.INTEGER,
    references: {
      model: AssessmentSkill,
      key: 'id',
    },
    allowNull: false, // Each sub-skill must belong to a parent skill
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE', // If a parent skill is deleted, its sub-skills are also deleted
  },
}, {
  tableName: 'AssessmentSubSkills', // Explicitly define table name
  timestamps: true,
});

// Define associations
AssessmentSkill.hasMany(AssessmentSubSkill, { foreignKey: 'skillId', as: 'assessmentSubSkills' });
AssessmentSubSkill.belongsTo(AssessmentSkill, { foreignKey: 'skillId' });

module.exports = AssessmentSubSkill;