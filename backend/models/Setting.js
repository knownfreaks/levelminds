const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Setting = sequelize.define('Setting', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  value: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  tableName: 'Settings',
  timestamps: true,
});

module.exports = Setting;