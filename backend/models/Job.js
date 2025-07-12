const { DataTypes } = require('sequelize');
     const sequelize = require('../config/db');

     const Job = sequelize.define('Job', {
       id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
       },
       title: {
         type: DataTypes.STRING(255),
         allowNull: false,
       },
       application_deadline: {
         type: DataTypes.DATE,
         allowNull: false,
       },
       min_salary: {
         type: DataTypes.INTEGER,
         allowNull: false,
       },
       max_salary: {
         type: DataTypes.INTEGER,
         allowNull: true,
       },
       description: {
         type: DataTypes.TEXT,
         allowNull: true,
       },
       responsibilities: {
         type: DataTypes.TEXT,
         allowNull: true,
       },
       requirements: {
         type: DataTypes.TEXT,
         allowNull: true,
       },
       status: {
         type: DataTypes.ENUM('open', 'closed'),
         defaultValue: 'open',
         allowNull: true,
       },
     }, {
       tableName: 'Jobs',
       timestamps: true,
     });

     module.exports = Job;