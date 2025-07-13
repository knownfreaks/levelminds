const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Helptkt = sequelize.define('Helptkt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
    defaultValue: 'open',
    allowNull: false,
  },
}, {
  tableName: 'HelpTickets',
  timestamps: true,
});

module.exports = Helptkt;