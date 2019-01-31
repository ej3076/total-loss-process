'use strict';
const path = require('path');

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 8080;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const app = express();

app.use(express.json());
app.use(cors());

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

app.use('/keys', require('./routes/keys'));

app.listen(PORT, () =>
  console.log(`Server listening on port ${IS_PRODUCTION ? PORT : '8080'}.`),
);
