const path = require('path');

const express = require('express');
const express_handlebar = require('express-handlebars');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./config/database');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());

// Show message on localhost:8080
app.get('/', function(req, res) {
  res.send(`GET request homepage - localhost:${PORT}`);
});

app.post('/', function(req, res) {
  res.send(`POST request homepage - localhost:${PORT}`);
});

app.put('/', function(req, res) {
  res.send(`PUT request homepage - localhost:${PORT}`);
});

app.delete('/', function(req, res) {
  res.send(`DELETE request homepage - localhost:${PORT}`);
});

// Customer routes - query to pull results from customer table
app.use('/customer', require('./routes/customer'));

// This is necessary because the database service takes a bit longer
// than this service to spin up.
const interval = setInterval(async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection established...');
    app.listen(
      PORT,
      console.log(`Server listening on port ${PORT}. (8080 if developing)`),
    );
    clearInterval(interval);
  } catch (_) {
    return;
  }
}, 1000);

console.log(process.env);
