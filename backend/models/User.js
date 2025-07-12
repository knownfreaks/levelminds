const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const StudentProfile = require('./StudentProfile');
const SchoolProfile = require('./SchoolProfile');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('student', 'school', 'admin'),
    allowNull: false,
  },
});



module.exports = User;