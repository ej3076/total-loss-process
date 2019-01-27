const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('customer', {
    NUSERID: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    NROLECODEID: {
        type: Sequelize.INTEGER
    },
    SFNAME: {
        type: Sequelize.STRING
    },
    SMNAME: {
        type: Sequelize.STRING
    },
    SLNAME: {
        type: Sequelize.STRING
    },
    DTDOB: {
        type: Sequelize.DATE
    },
    SSSN: {
        type: Sequelize.STRING
    }},
    {
        tableName: 'customer',
        timestamps: false
})

module.exports = Customer;