    const { DataTypes } = require('sequelize');
    const sequelize = require('../config/db');

    const Helptkt = sequelize.define('Helptkt', { // Model name must match file name and usage in index.js
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Subject of the help ticket',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed description of the issue',
      },
      status: {
        type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
        defaultValue: 'open',
        allowNull: false,
        comment: 'Current status of the ticket',
      },
      userId: { // Foreign key to User who submitted the ticket
        type: DataTypes.INTEGER,
        references: {
          model: 'Users', // Reference the Users table directly
          key: 'id',
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    }, {
      tableName: 'HelpTickets', // Table name in DB
      timestamps: true,
    });

    module.exports = Helptkt;
    