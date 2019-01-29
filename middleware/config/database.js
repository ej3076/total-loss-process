const Sequelize = require('sequelize');

const DB_NAME = process.env.DB_NAME || 'fordtotalloss';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'root';

// Export variable = DB name, username, password
module.exports = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: 'middleware-db',
  port: 3306,
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
