const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StudentProfile = sequelize.define('StudentProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  college_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  university_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  course_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  course_year: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'StudentProfiles',
  timestamps: true,
});

module.exports = StudentProfile;