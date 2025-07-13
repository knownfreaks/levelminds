const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AssessmentSkill = sequelize.define('AssessmentSkill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'AssessmentSkills',
  timestamps: true,
});

module.exports = AssessmentSkill;