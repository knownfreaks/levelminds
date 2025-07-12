const { DataTypes } = require('sequelize');
     const sequelize = require('../config/db');

     const JobType = sequelize.define('JobType', {
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
       tableName: 'JobTypes',
       timestamps: true,
     });

     module.exports = JobType;