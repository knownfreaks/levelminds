const { DataTypes } = require('sequelize');
     const sequelize = require('../config/db');

     const Interview = sequelize.define('Interview', {
       id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
       },
       title: {
         type: DataTypes.STRING(255),
         allowNull: false,
         defaultValue: 'Scheduled Interview',
       },
       interview_date: {
         type: DataTypes.DATEONLY,
         allowNull: false,
       },
       interview_time: {
         type: DataTypes.TIME,
         allowNull: false,
       },
       location: {
         type: DataTypes.TEXT,
         allowNull: true,
       },
     }, {
       tableName: 'Interviews',
       timestamps: true,
     });

     module.exports = Interview;