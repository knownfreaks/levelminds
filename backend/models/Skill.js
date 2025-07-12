const { DataTypes } = require('sequelize');
     const sequelize = require('../config/db');

     const Skill = sequelize.define('Skill', {
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
       tableName: 'Skills',
       timestamps: true,
     });

     module.exports = Skill;