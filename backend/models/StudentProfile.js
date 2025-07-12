const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StudentProfile = sequelize.define('StudentProfile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
  },
  mobile: {
    type: DataTypes.STRING,
    unique: true,
  },
  about: {
    type: DataTypes.TEXT,
  },
  image_url: {
    type: DataTypes.TEXT,
  },
  college_name: {
    type: DataTypes.STRING,
  },
  university_name: {
    type: DataTypes.STRING,
  },
  course_name: {
    type: DataTypes.STRING,
  },
  course_year: {
    type: DataTypes.STRING,
  },
});

module.exports = StudentProfile;