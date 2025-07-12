const { DataTypes } = require('sequelize');
     const sequelize = require('../config/db');

     const Subject = sequelize.define('Subject', {
       id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
       },
       name: {
         type: DataTypes.STRING(255),
         allowNull: false,
         unique: true,
       },
     }, {
       tableName: 'Subjects',
       timestamps: true,
     });

     module.exports = Subject;