const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const StudentSkillAssessment = require('./StudentSkillAssessment'); // The parent assessment
const AssessmentSubSkill = require('./AssessmentSubSkill'); // The sub-skill being scored

const StudentSubSkillScore = sequelize.define('StudentSubSkillScore', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  // Foreign key to StudentSkillAssessment
  assessmentId: { // Renamed from studentSkillAssessmentId for brevity
    type: DataTypes.INTEGER,
    references: {
      model: StudentSkillAssessment,
      key: 'id',
    },
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE', // If parent assessment is deleted, sub-scores are deleted
  },
  // Foreign key to AssessmentSubSkill
  subSkillId: {
    type: DataTypes.INTEGER,
    references: {
      model: AssessmentSubSkill,
      key: 'id',
    },
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE', // If sub-skill master data is deleted, related scores are deleted
  },
  score: { // Score out of 10
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10 // Enforce score range 0-10
    },
    comment: 'Score obtained for this specific sub-skill (out of 10)',
  },
}, {
  tableName: 'StudentSubSkillScores',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['assessmentId', 'subSkillId'] // Ensure only one score per sub-skill per assessment
    }
  ]
});

// Define associations
StudentSkillAssessment.hasMany(StudentSubSkillScore, { foreignKey: 'assessmentId', as: 'subSkillScores' });
StudentSubSkillScore.belongsTo(StudentSkillAssessment, { foreignKey: 'assessmentId' });

AssessmentSubSkill.hasMany(StudentSubSkillScore, { foreignKey: 'subSkillId', as: 'studentScores' });
StudentSubSkillScore.belongsTo(AssessmentSubSkill, { foreignKey: 'subSkillId' });


module.exports = StudentSubSkillScore;