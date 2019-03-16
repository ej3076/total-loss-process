'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
// TODO: Make this strictly only accept CORS from the web service address.
app.use(cors());

app.use('/claims', require('./routes/claims'));
app.use('/keys', require('./routes/keys'));

app.use((err, req, res, next) => {
  if (!err) return next();
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    name: err.name,
    statusCode: err.statusCode,
    message: err.message,
  });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
