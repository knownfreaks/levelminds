const { DataTypes } = require('sequelize');
     const sequelize = require('../config/db');

     const State = sequelize.define('State', {
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
       tableName: 'States',
       timestamps: true,
     });

     module.exports = State;