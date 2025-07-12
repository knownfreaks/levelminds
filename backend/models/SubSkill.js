const { DataTypes } = require('sequelize');
     const sequelize = require('../config/db');

     const SubSkill = sequelize.define('SubSkill', {
       id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
       },
       name: {
         type: DataTypes.STRING(255),
         allowNull: false,
       },
     }, {
       tableName: 'SubSkills',
       timestamps: true,
     });

     module.exports = SubSkill;