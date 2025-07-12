const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const StudentProfile = require('./StudentProfile'); // Import StudentProfile model

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Name or title of the certificate',
  },
  given_by: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Organization or institution that issued the certificate',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Short description of the certificate or achievement',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Date the certificate was received',
  },
  file_url: { // <-- ADD THIS NEW FIELD
    type: DataTypes.TEXT,
    allowNull: true, // Can be null if no file is uploaded
    comment: 'URL to the uploaded certificate file (PDF, image, etc.)',
  },
  studentId: {
    type: DataTypes.INTEGER,
    references: {
      model: StudentProfile,
      key: 'id',
    },
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'Certificates',
  timestamps: true,
});

StudentProfile.hasMany(Certificate, { foreignKey: 'studentId', as: 'certifications' });
Certificate.belongsTo(StudentProfile, { foreignKey: 'studentId' });

module.exports = Certificate;