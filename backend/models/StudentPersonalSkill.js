const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StudentPersonalSkill = sequelize.define('StudentPersonalSkill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  skill_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'StudentPersonalSkills',
  timestamps: true,
});

module.exports = StudentPersonalSkill;