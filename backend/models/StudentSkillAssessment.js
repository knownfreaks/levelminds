const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const StudentProfile = require('./StudentProfile');
const AssessmentSkill = require('./AssessmentSkill'); // The parent skill (e.g., Classroom Management)

const StudentSkillAssessment = sequelize.define('StudentSkillAssessment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  // Foreign key to StudentProfile
  studentId: {
    type: DataTypes.INTEGER,
    references: {
      model: StudentProfile,
      key: 'id',
    },
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE', // If student is deleted, their assessments are deleted
  },
  // Foreign key to AssessmentSkill (the parent skill being assessed)
  assessmentSkillId: {
    type: DataTypes.INTEGER,
    references: {
      model: AssessmentSkill,
      key: 'id',
    },
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE', // If the assessment skill is deleted, related student assessments are deleted
  },
  total_score: { // Sum of 4 sub-skill scores, out of 40
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Total score for this assessment skill (sum of sub-skill scores)',
  },
  // You might want a unique constraint to ensure a student is assessed only once per skill
  // Or handle multiple assessments per skill with a 'version' or 'date' field
}, {
  tableName: 'StudentSkillAssessments',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['studentId', 'assessmentSkillId'] // Ensure a student has only one assessment per skill
    }
  ]
});

// Define associations
StudentProfile.hasMany(StudentSkillAssessment, { foreignKey: 'studentId', as: 'skillAssessments' });
StudentSkillAssessment.belongsTo(StudentProfile, { foreignKey: 'studentId' });

AssessmentSkill.hasMany(StudentSkillAssessment, { foreignKey: 'assessmentSkillId', as: 'studentAssessments' });
StudentSkillAssessment.belongsTo(AssessmentSkill, { foreignKey: 'assessmentSkillId' });

module.exports = StudentSkillAssessment;