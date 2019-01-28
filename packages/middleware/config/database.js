const Sequelize = require('sequelize');

// Export variable = DB name, username, password
module.exports = new Sequelize('fordtest', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});