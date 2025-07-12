const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const JobType = sequelize.define('JobType', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: false // We don't need createdAt/updatedAt for this simple table
});

module.exports = JobType;