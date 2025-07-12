const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Skill = require('./Skill');

const SubSkill = sequelize.define('SubSkill', {
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

// A SubSkill belongs to one parent Skill
Skill.hasMany(SubSkill, { foreignKey: 'skillId' });
SubSkill.belongsTo(Skill, { foreignKey: 'skillId' });

module.exports = SubSkill;