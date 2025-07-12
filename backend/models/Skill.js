const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const JobType = require('./JobType');

const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { timestamps: false });

// A Skill belongs to one JobType (Category)
JobType.hasMany(Skill, { foreignKey: 'jobTypeId' });
Skill.belongsTo(JobType, { foreignKey: 'jobTypeId' });

module.exports = Skill;