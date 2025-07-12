     const { Sequelize } = require('sequelize');
     require('dotenv').config();

     const sequelize = new Sequelize(
       process.env.PG_DATABASE,
       process.env.PG_USER,
       process.env.PG_PASSWORD,
       {
         host: process.env.PG_HOST,
         dialect: 'postgres',
         logging: false, // Set to true to see SQL queries in console
         pool: {
           max: 5,
           min: 0,
           acquire: 30000,
           idle: 10000
         }
       }
     );

     module.exports = sequelize;
     