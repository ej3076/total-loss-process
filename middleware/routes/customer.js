const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const Customer = require('../models/customer');


router.get('/', (req, res) =>
    Customer.findAll()
        .then(customer => {
            console.log(customer);
            res.sendStatus(200);
        })
        .catch(err => console.log(err)));

module.exports = router;
