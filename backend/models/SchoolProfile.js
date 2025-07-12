const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const City = require('./City');
const State = require('./State');

const SchoolProfile = sequelize.define('SchoolProfile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  school_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logo_url: {
    type: DataTypes.TEXT,
  },
  about: {
    type: DataTypes.TEXT,
  },
  website: {
    type: DataTypes.TEXT,
  },
  address: {
    type: DataTypes.STRING,
  },
  pincode: {
    type: DataTypes.STRING,
  },
});

// Define Associations with State and City
SchoolProfile.belongsTo(State, { foreignKey: 'stateId' });
SchoolProfile.belongsTo(City, { foreignKey: 'cityId' });

module.exports = SchoolProfile;