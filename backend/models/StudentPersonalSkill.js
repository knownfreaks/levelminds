const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const StudentProfile = require('./StudentProfile'); // Import StudentProfile model

const StudentPersonalSkill = sequelize.define('StudentPersonalSkill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  skill_name: {
    type: DataTypes.STRING(100), // Max 100 characters for skill name
    allowNull: false,
    comment: 'Name of the personal skill added by the student',
  },
  // Foreign key for StudentProfile
  studentId: {
    type: DataTypes.INTEGER,
    references: {
      model: StudentProfile, // This is a reference to the StudentProfile model
      key: 'id',
    },
    allowNull: false, // A personal skill must belong to a student
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE', // If a student is deleted, their personal skills are also deleted
  },
}, {
  tableName: 'StudentPersonalSkills', // Explicitly define table name
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Define the association
StudentProfile.hasMany(StudentPersonalSkill, { foreignKey: 'studentId', as: 'personalSkills' });
StudentPersonalSkill.belongsTo(StudentProfile, { foreignKey: 'studentId' });

module.exports = StudentPersonalSkill;