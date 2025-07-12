const { DataTypes } = require('sequelize');
     const sequelize = require('../config/db');

     const Certificate = sequelize.define('Certificate', {
       id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
       },
       name: {
         type: DataTypes.STRING,
         allowNull: false,
         comment: 'Name or title of the certificate',
       },
       given_by: {
         type: DataTypes.STRING,
         allowNull: true,
         comment: 'Organization or institution that issued the certificate',
       },
       description: {
         type: DataTypes.TEXT,
         allowNull: true,
         comment: 'Short description of the certificate or achievement',
       },
       date: {
         type: DataTypes.DATEONLY,
         allowNull: true,
         comment: 'Date the certificate was received',
       },
       file_url: {
         type: DataTypes.TEXT,
         allowNull: true,
         comment: 'URL to the uploaded certificate file (PDF, image, etc.)',
       },
     }, {
       tableName: 'Certificates',
       timestamps: true,
     });

     module.exports = Certificate;