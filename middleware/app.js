const express = require('express');
const express_handlebar = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.port || 8080;

// Database variable
const sequelize = require('./config/database');

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Show message on localhost:8080
//app.get('/', (req, res) => res.send(`Test localhost:${port}`));
app.get('/', function (req, res) {
    res.send(`GET request homepage - localhost:${port}`)
});

app.post('/', function (req, res) {
    res.send(`POST request homepage - localhost:${port}`)
});

app.put('/', function (req, res) {
    res.send(`PUT request homepage - localhost:${port}`)
});

app.delete('/', function (req, res) {
    res.send(`DELETE request homepage - localhost:${port}`)
});

// Customer routes - query to pull results from customer table
app.use('/customer', require('./routes/customer'));

app.listen(port, console.log(`Server started on port ${port}`));
