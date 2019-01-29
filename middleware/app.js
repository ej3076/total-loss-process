const express = require('express');
const express_handlebar = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.port || 8080;
const cors = require('cors');

app.use(cors());

// Database variable
//const sequelize = require('./config/database');

// Test database connection
/*

Commenting out DB for now - Seamus

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  

  
  */

// Show message on localhost:8080
//app.get('/', (req, res) => res.send(`Test localhost:${port}`));

app.get('', function (req, res) {
    res.send(JSON.stringify({ message: `Get request homepage - Success!` }))
});

app.post('/', function (req, res) {
    res.send(JSON.stringify({ message: `Post request homepage - Success!` }))
});

app.put('/', function (req, res) {
    res.send(JSON.stringify({ message: `Put request homepage - Success!` }))
});

app.delete('/', function (req, res) {
    res.send(JSON.stringify({ message: `Delete request homepage - Success!` }))
});

// Customer routes - query to pull results from customer table
app.use('/customer', require('./routes/customer'));

app.listen(port, console.log(`Server started on port ${port}`));